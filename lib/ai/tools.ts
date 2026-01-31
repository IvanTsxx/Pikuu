/** biome-ignore-all lint/suspicious/noExplicitAny: <false> */
import {
  type InferToolInput,
  type InferToolOutput,
  type ToolSet,
  tool,
  type UIMessageStreamWriter,
} from "ai";
import { z } from "zod";
import { getProjectState, updateProjectState } from "../project-state";

export const generatePrismaTool = (writer: UIMessageStreamWriter) =>
  tool({
    description:
      "Generate or update Prisma schema with models, fields, and relations",
    inputSchema: z.object({
      id: z.string().describe("The chat ID"),
      schema: z.string().describe("Complete Prisma schema"),
      models: z.array(z.string()).describe("List of model names in the schema"),
    }),
    execute: async ({ id, schema, models }, { toolCallId }) => {
      try {
        // Get previous state for diff
        const currentState = await getProjectState(id);
        const previousCode = currentState?.prismaSchema;

        // Update project state
        await updateProjectState(id, { prismaSchema: schema });

        // Write final artifact
        writer.write({
          type: "data-artifact",
          data: {
            id: toolCallId,
            name: "Prisma Schema",
            type: "prisma",
            filePath: "prisma/schema.prisma",
            code: schema,
            previousCode,
            isNew: !previousCode,
          },
          id: toolCallId,
        });

        return { success: true, models };
      } catch (error) {
        console.error("Error in generatePrisma:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          toolName: "generatePrisma",
          timestamp: new Date().toISOString(),
          guidance:
            "The generatePrisma tool failed. Please analyze the error and retry with corrected parameters if possible. If the error persists, inform the user about the issue.",
        };
      }
    },
  });

export type GeneratePrismaToolInput = InferToolInput<
  ReturnType<typeof generatePrismaTool>
>;
export type GeneratePrismaToolOutput = InferToolOutput<
  ReturnType<typeof generatePrismaTool>
>;

export const generateZodTool = (writer: UIMessageStreamWriter) =>
  tool({
    description: "Generate Zod validation schemas from Prisma models",
    inputSchema: z.object({
      id: z.string().describe("The chat ID"),
      schemas: z
        .record(z.string(), z.string())
        .describe("Model name to Zod schema code map"),
    }),
    execute: async ({ id, schemas }, { toolCallId }) => {
      try {
        const currentState = await getProjectState(id);
        await updateProjectState(id, { zodSchemas: schemas });

        // Write each schema as an artifact
        for (const [modelName, schema] of Object.entries(schemas)) {
          const previousCode = currentState?.zodSchemas?.[modelName];
          const artifactId = `${toolCallId}-${modelName}`;
          writer.write({
            type: "data-artifact",
            data: {
              id: artifactId,
              name: `${modelName} Schema`,
              type: "zod",
              filePath: `lib/validations/${modelName.toLowerCase()}.ts`,
              code: schema,
              previousCode,
              isNew: !previousCode,
            },
            id: artifactId,
          });
        }

        return { success: true, count: Object.keys(schemas).length };
      } catch (error) {
        console.error("Error in generateZod:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          toolName: "generateZod",
          timestamp: new Date().toISOString(),
          guidance:
            "The generateZod tool failed. Please analyze the error and retry with corrected parameters if possible. If the error persists, inform the user about the issue.",
        };
      }
    },
  });

export type GenerateZodToolInput = InferToolInput<
  ReturnType<typeof generateZodTool>
>;
export type GenerateZodToolOutput = InferToolOutput<
  ReturnType<typeof generateZodTool>
>;

export const generateCrudTool = (writer: UIMessageStreamWriter) =>
  tool({
    description:
      "Generate CRUD operations (Server Actions or Route Handlers based on strategy)",
    inputSchema: z.object({
      id: z.string().describe("The chat ID"),
      strategy: z
        .enum(["actions", "routes"])
        .describe("Use Server Actions or Route Handlers"),
      operations: z
        .record(z.string(), z.string())
        .describe("Operation name to code map"),
    }),
    execute: async ({ id, strategy, operations }, { toolCallId }) => {
      try {
        const currentState = await getProjectState(id);
        const updates =
          strategy === "actions"
            ? { actions: operations, crudStrategy: strategy }
            : { routes: operations, crudStrategy: strategy };

        await updateProjectState(id, updates);

        // Write each operation as an artifact
        for (const [name, code] of Object.entries(operations)) {
          const existingOps =
            strategy === "actions"
              ? currentState?.actions
              : currentState?.routes;
          const previousCode = existingOps?.[name];
          const artifactId = `${toolCallId}-${name}`;

          writer.write({
            type: "data-artifact",
            data: {
              id: artifactId,
              name: `${name} ${strategy === "actions" ? "Action" : "Route"}`,
              type: strategy === "actions" ? "action" : "route",
              filePath:
                strategy === "actions"
                  ? `app/actions/${name}.ts`
                  : `app/api/${name}/route.ts`,
              code,
              previousCode,
              isNew: !previousCode,
            },
            id: artifactId,
          });
        }

        return {
          success: true,
          strategy,
          count: Object.keys(operations).length,
        };
      } catch (error) {
        console.error("Error in generateCrud:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          toolName: "generateCrud",
          timestamp: new Date().toISOString(),
          guidance:
            "The generateCrud tool failed. Please analyze the error and retry with corrected parameters if possible. If the error persists, inform the user about the issue.",
        };
      }
    },
  });

export type GenerateCrudToolInput = InferToolInput<
  ReturnType<typeof generateCrudTool>
>;
export type GenerateCrudToolOutput = InferToolOutput<
  ReturnType<typeof generateCrudTool>
>;

export const generateFormsTool = (writer: UIMessageStreamWriter) =>
  tool({
    description:
      "Generate forms with shadcn/ui, Zod validation, and TanStack Form",
    inputSchema: z.object({
      id: z.string().describe("The chat ID"),
      forms: z
        .record(z.string(), z.string())
        .describe("Form name to component code map"),
    }),
    execute: async ({ id, forms }, { toolCallId }) => {
      try {
        const currentState = await getProjectState(id);
        await updateProjectState(id, { forms });

        // Write each form as an artifact
        for (const [name, code] of Object.entries(forms)) {
          const previousCode = currentState?.forms?.[name];
          const artifactId = `${toolCallId}-${name}`;
          writer.write({
            type: "data-artifact",
            data: {
              id: artifactId,
              name: `${name} Form`,
              type: "form",
              filePath: `components/forms/${name.toLowerCase()}-form.tsx`,
              code,
              previousCode,
              isNew: !previousCode,
            },
            id: artifactId,
          });
        }

        return { success: true, count: Object.keys(forms).length };
      } catch (error) {
        console.error("Error in generateForms:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          toolName: "generateForms",
          timestamp: new Date().toISOString(),
          guidance:
            "The generateForms tool failed. Please analyze the error and retry with corrected parameters if possible. If the error persists, inform the user about the issue.",
        };
      }
    },
  });

export type GenerateFormsToolInput = InferToolInput<
  ReturnType<typeof generateFormsTool>
>;
export type GenerateFormsToolOutput = InferToolOutput<
  ReturnType<typeof generateFormsTool>
>;

export const generateWorkflowTool = (writer: UIMessageStreamWriter) =>
  tool({
    description: "Generate workflow definition with nodes and edges",
    inputSchema: z.object({
      id: z.string().describe("The chat ID"),
      workflow: z.object({
        nodes: z.array(z.any()).describe("Workflow nodes"),
        edges: z.array(z.any()).describe("Workflow edges"),
      }),
    }),
    execute: async ({ id, workflow }, { toolCallId }) => {
      try {
        const currentState = await getProjectState(id);
        const previousCode = currentState?.workflow
          ? JSON.stringify(currentState.workflow, null, 2)
          : undefined;

        await updateProjectState(id, { workflow });

        // Write workflow as artifact
        writer.write({
          type: "data-artifact",
          data: {
            id: toolCallId,
            name: "Workflow Definition",
            type: "workflow",
            filePath: "workflow.json",
            code: JSON.stringify(workflow, null, 2),
            previousCode,
            isNew: !previousCode,
          },
          id: toolCallId,
        });

        return { success: true, workflow };
      } catch (error) {
        console.error("Error in generateWorkflow:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          toolName: "generateWorkflow",
          timestamp: new Date().toISOString(),
          guidance:
            "The generateWorkflow tool failed. Please analyze the error and retry with corrected parameters if possible. If the error persists, inform the user about the issue.",
        };
      }
    },
  });

export type GenerateWorkflowToolInput = InferToolInput<
  ReturnType<typeof generateWorkflowTool>
>;
export type GenerateWorkflowToolOutput = InferToolOutput<
  ReturnType<typeof generateWorkflowTool>
>;

export const createTools = (writer: UIMessageStreamWriter) =>
  ({
    generatePrisma: generatePrismaTool(writer),
    generateZod: generateZodTool(writer),
    generateCrud: generateCrudTool(writer),
    generateForms: generateFormsTool(writer),
    generateWorkflow: generateWorkflowTool(writer),
  }) satisfies ToolSet;
