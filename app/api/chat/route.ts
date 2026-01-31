import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from "ai";
import { OperationType } from "@/app/generated/prisma/client";
import { env } from "@/env/server";
import { updateChatNameIfInitial } from "@/lib/ai/chat-utils";
import { detectIntent } from "@/lib/ai/intent-detector";
import { createTools } from "@/lib/ai/tools";
import { createSystemPrompt } from "@/lib/ai/utils";
import {
  deductCredits,
  getUserBalance,
  hasEnoughCredits,
} from "@/lib/credits/balance"; // Import getUserBalance
import {
  calculateOperationCost,
  determineOperationType,
} from "@/lib/credits/costs";
import { loadChat, upsertMessage } from "@/lib/db/actions";
import { getCurrentUser } from "@/lib/db/queries/auth";
import type { MyUIMessage } from "@/lib/message-types";
import { getOrCreateProjectState } from "@/lib/project-state";
import { createUsageLog } from "@/lib/usage-log";

export const maxDuration = 8000;

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const model = openrouter.chat("openai/gpt-oss-120b:free");

export async function POST(req: Request) {
  try {
    // get the last message from the client:
    const { message, chatId }: { message: MyUIMessage; chatId: string } =
      await req.json();

    // create or update last message in database
    await upsertMessage({ chatId, id: message.id, message });

    // load the previous messages from the server:
    const messages = await loadChat(chatId);

    // Get or create project state

    const user = await getCurrentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    const state = await getOrCreateProjectState({ chatId });

    // Detect intent from last message
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
    const { intent, context: intentContext } = await detectIntent(
      content,
      !!state.prismaSchema,
      model,
    );

    // Initial Credit Check
    const estimatedCost = await calculateOperationCost(intent, []);

    // Allow if cost is 0 or user has enough
    if (estimatedCost > 0) {
      const hasCredits = await hasEnoughCredits(userId, estimatedCost);
      if (!hasCredits) {
        const balance = await getUserBalance(userId);
        const available = balance.totalCredits - balance.usedCredits;
        const missing = estimatedCost - available;

        // Simple recommendation logic (could be more sophisticated)
        let recommendedPackage = "Starter Pack";
        if (missing > 300) recommendedPackage = "Power Pack";
        else if (missing > 100) recommendedPackage = "Pro Pack";

        return new Response(
          JSON.stringify({
            error: "Insufficient credits",
            missingCredits: missing,
            requiredCredits: estimatedCost,
            availableCredits: available,
            recommendedPackage,
          }),
          {
            status: 402,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const abortController = new AbortController();

    // Track usage stats
    let toolsUsed: string[] = [];
    const totalUsage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    } = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };

    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        // If it's the first message, generate a name for the chat
        if (messages.length === 1 && message.role === "user") {
          const firstMessageContent = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");

          if (firstMessageContent) {
            // Await to ensure the name update happens before the main response
            await updateChatNameIfInitial(chatId, firstMessageContent, writer);
          }
        }
        const result = streamText({
          model,
          messages: await convertToModelMessages(messages),
          tools: createTools(writer),
          system: createSystemPrompt(state, intent, intentContext),
          activeTools: [
            "generateCrud",
            "generateForms",
            "generatePrisma",
            "generateWorkflow",
            "generateZod",
          ],
          toolChoice: "auto",

          abortSignal: abortController.signal, // optional
          onFinish: ({ totalUsage: usageTotal, toolResults }) => {
            const toolsTitles: string[] = [];
            for (const toolResult of toolResults) {
              if (toolResult.title) {
                toolsTitles.push(toolResult.title);
              }
            }

            if (toolsTitles?.length > 0) {
              toolsUsed = toolsTitles;
            }

            const { inputTokens, outputTokens, totalTokens } = usageTotal;

            if (inputTokens) {
              totalUsage.inputTokens += inputTokens;
            }
            if (outputTokens) {
              totalUsage.outputTokens += outputTokens;
            }

            if (totalTokens) {
              totalUsage.totalTokens += totalTokens;
            }
          },
          stopWhen:
            intent === "create_project" ? stepCountIs(50) : stepCountIs(20),
        });

        result.consumeStream();
        writer.merge(
          result.toUIMessageStream({
            sendSources: true,
            sendFinish: true,
            sendReasoning: true,
            sendStart: false,
          }),
        );
      },
      onError: (error) => {
        // Error messages are masked by default for security reasons.
        // If you want to expose the error message to the client, you can do so here:
        return error instanceof Error ? error.message : String(error);
      },
      onFinish: async ({ responseMessage }) => {
        try {
          await upsertMessage({
            id: responseMessage.id,
            chatId,
            message: responseMessage,
          });

          // Calculate final cost and deduct
          const operationType =
            intent === "create_project"
              ? OperationType.FULL_PROJECT
              : determineOperationType(toolsUsed);
          const finalCost = await calculateOperationCost(intent, toolsUsed);

          let actualCharged = 0;
          if (finalCost > 0) {
            const deduction = await deductCredits(
              userId,
              finalCost,
              chatId,
              operationType,
            );
            if (deduction.success) {
              actualCharged = finalCost;
            }
          }

          // Log usage
          await createUsageLog({
            userId,
            chatId,
            operationType,
            toolsExecuted: toolsUsed,
            creditsCharged: actualCharged,
            aiCostUsd: 0, // Set to 0 or calculate based on token usage if pricing available
            intent,
            tokenUsage: {
              input: totalUsage.inputTokens,
              output: totalUsage.outputTokens,
            },
            success: true,
          });
        } catch (error) {
          console.error("Error in onFinish (DB/Credits):", error);
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
