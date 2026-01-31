/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
import { prisma } from "./prisma";
import type { ProjectState } from "./types";

export async function getOrCreateProjectState({
  chatId,
}: {
  chatId: string;
}): Promise<ProjectState> {
  const existing = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!existing) {
    throw new Error("Chat not found");
  }

  return {
    id: existing.id,
    userId: existing.userId,
    name: existing.name ?? undefined,
    crudStrategy: existing.crudStrategy as "actions" | "routes",
    prismaSchema: existing.prismaSchema ?? undefined,
    zodSchemas: existing.zodSchemas as Record<string, string>,
    actions: existing.actions as Record<string, string>,
    routes: existing.routes as Record<string, string>,
    forms: existing.forms as Record<string, string>,
    workflow: existing.workflow as { nodes: any[]; edges: any[] } | undefined,
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
  };
}

export async function updateProjectState(
  chatId: string,
  updates: Partial<
    Omit<ProjectState, "id" | "userId" | "createdAt" | "updatedAt">
  >,
): Promise<ProjectState> {
  const updated = await prisma.chat.update({
    where: { id: chatId },
    data: {
      ...updates,
      updatedAt: new Date(),
    },
  });

  return {
    id: updated.id,
    userId: updated.userId,
    name: updated.name ?? undefined,
    crudStrategy: updated.crudStrategy,
    prismaSchema: updated.prismaSchema ?? undefined,
    zodSchemas: updated.zodSchemas as Record<string, string>,
    actions: updated.actions as Record<string, string>,
    routes: updated.routes as Record<string, string>,
    forms: updated.forms as Record<string, string>,
    workflow: updated.workflow as { nodes: any[]; edges: any[] } | undefined,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function getProjectState(
  chatId: string,
): Promise<ProjectState | null> {
  const existing = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!existing) return null;

  return {
    id: existing.id,
    userId: existing.userId,
    name: existing.name ?? undefined,
    crudStrategy: existing.crudStrategy as "actions" | "routes",
    prismaSchema: existing.prismaSchema ?? undefined,
    zodSchemas: existing.zodSchemas as Record<string, string>,
    actions: existing.actions as Record<string, string>,
    routes: existing.routes as Record<string, string>,
    forms: existing.forms as Record<string, string>,
    workflow: existing.workflow as { nodes: any[]; edges: any[] } | undefined,
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
  };
}
