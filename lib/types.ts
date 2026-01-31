/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
import { z } from "zod";

export const ProjectStateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().optional(),
  crudStrategy: z.enum(["actions", "routes"]),
  prismaSchema: z.string().optional(),
  zodSchemas: z.record(z.string(), z.string()),
  actions: z.record(z.string(), z.string()),
  routes: z.record(z.string(), z.string()),
  forms: z.record(z.string(), z.string()),
  workflow: z
    .object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProjectState = z.infer<typeof ProjectStateSchema>;

export type Intent =
  | "create_project"
  | "update_prisma"
  | "update_zod"
  | "update_crud"
  | "update_forms"
  | "update_workflow";

export const ArtifactSectionSchema = z.object({
  name: z.string(),
  type: z.enum(["prisma", "zod", "action", "route", "form", "workflow"]),
  filePath: z.string(),
  code: z.string(),
  previousCode: z.string().optional(),
  diff: z.string().optional(),
  isNew: z.boolean().optional(),
});

export type ArtifactSection = z.infer<typeof ArtifactSectionSchema>;

export const GeneratorToolResultSchema = z.object({
  success: z.boolean(),
  artifact: ArtifactSectionSchema.optional(),
  artifacts: z.array(ArtifactSectionSchema).optional(),
  models: z.array(z.string()).optional(),
  strategy: z.enum(["actions", "routes"]).optional(),
  workflow: z
    .object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    })
    .optional(),
});

export type GeneratorToolResult = z.infer<typeof GeneratorToolResultSchema>;
