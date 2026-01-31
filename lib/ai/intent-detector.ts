import type { LanguageModel } from "ai";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Intent } from "../types";

export async function detectIntent(
  message: string,
  hasExistingProject: boolean,
  model: LanguageModel,
): Promise<{ intent: Intent; context: string }> {
  const schema = z.object({
    intent: z
      .enum([
        "create_project",
        "update_prisma",
        "update_zod",
        "update_crud",
        "update_forms",
        "update_workflow",
      ])
      .describe(
        "The detected intent of the user. create_project for new apps, update_* for modifications. Ensure key is 'intent'.",
      ),
    context: z
      .string()
      .describe(
        "Specific observations and instructions for the system prompt based on what the user wants. " +
          "If the user provided a Prisma schema, explain that. " +
          "If they want to update something specific, detail what it is. " +
          "If they are starting a new project, specify if it's from scratch or with provided code.",
      ),
  });

  const { output } = await generateText({
    model,
    output: Output.object({
      schema,
    }),
    prompt: `
      Analyze the user's request and the current project state to determine their intent and generate context.

      Current State:
      - Has Existing Project: ${hasExistingProject}

      User Message:
      "${message}"

      Guidelines:
      1. If !Has Existing Project -> "create_project". 
         - Check if the user pasted a Prisma schema or SQL code. If so, put that in 'context' with instructions to use it.
         - If they just described an app concept, note that in 'context'.
      
      2. If Has Existing Project -> Determine if they want to update Prisma, Zod, CRUD (actions/routes), Forms, or Workflows.
         - "update_prisma": Modifying database, models, fields, relations.
         - "update_zod": Modifying validation schemas (usually happens with prisma updates, but prioritize prisma if both).
         - "update_crud": Creating/Updating API routes or Server Actions.
         - "update_forms": Creating/Updating UI forms.
         - "update_workflow": Changing logic flows or business processes.

      4. JSON Structure:
         - You obey the schema strictness.
         - The root key for the intent choice MUST be "intent" (not "action", not "type").
         - The root key for the context MUST be "context".
    `,
  });

  return output;
}
