import type { InferUITools, UIMessage, UIMessagePart } from "ai";
import { z } from "zod";
import type { createTools } from "@/lib/ai/tools";

// Metadata schema
export const metadataSchema = z.object({});

export type MyMetadata = z.infer<typeof metadataSchema>;

// Data part schema - DEBE coincidir con la estructura que usas en writer.write()
export const dataPartSchema = z.object({
  // Este es el contenido del campo "data" que usas en writer.write()
  code: z.string(),
  filePath: z.string(),
  id: z.string(),
  isNew: z.boolean().optional(),
  name: z.string(),
  type: z.enum(["prisma", "zod", "action", "route", "form", "workflow"]),
  previousCode: z.string().optional(),
  diff: z.string().optional(),
});

export type ArtifactData = z.infer<typeof dataPartSchema>;

export const chatNameSchema = z.object({
  name: z.string(),
});

export type ChatNameData = z.infer<typeof chatNameSchema>;

// UIDataTypes debe ser un Record<string, unknown> donde las claves se usan para construir los tipos

export type MyDataParts = {
  artifact: ArtifactData;
  chatName: ChatNameData;
};

// Infer tool types from the tools function
export type MyTools = InferUITools<ReturnType<typeof createTools>>;

// Main message types
export type MyUIMessage = UIMessage<never, MyDataParts, MyTools>;

export type MyUIMessagePart = UIMessagePart<MyDataParts, MyTools>;
