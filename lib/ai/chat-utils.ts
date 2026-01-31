import { generateText, type UIMessageStreamWriter } from "ai";
import { revalidatePath } from "next/cache";
import { model } from "@/app/api/chat/route";
import { prisma } from "@/lib/prisma";
import type { MyUIMessage } from "../message-types";

export async function generateChatName(firstMessage: string): Promise<string> {
  try {
    const { text } = await generateText({
      model,
      prompt: `Generate a short, concise, and descriptive title for a software project based on this first user message: "${firstMessage}". 
      The title should be professional and catchy. 
      Example: "un marketplace de juegos de play 4 simple" -> "PlayStation Marketplace"
      Example: "una app de tareas con recordatorios" -> "TaskFlow Pro"
      ONLY return the title, no quotes or additional text.`,
    });

    return text.trim().replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Error generating chat name:", error);
    return "New Project";
  }
}

export async function updateChatNameIfInitial(
  chatId: string,
  firstMessage: string,
  writer?: UIMessageStreamWriter<MyUIMessage>,
) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { name: true },
    });

    if (chat && (chat.name === "New Chat" || !chat.name)) {
      const newName = await generateChatName(firstMessage);
      await prisma.chat.update({
        where: { id: chatId },
        data: { name: newName },
      });

      if (writer && newName) {
        writer.write({ type: "data-chatName", data: { name: newName } });
      }
    }
    revalidatePath(`/dashboard`);
    revalidatePath(`/dashboard/chat/${chatId}`);
  } catch (error) {
    console.error("Error updating chat name:", error);
  }
}
