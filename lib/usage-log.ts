// lib/usage-log.ts

import type { OperationType } from "@/app/generated/prisma/client";
import { prisma } from "./prisma";

export async function createUsageLog({
  userId,
  chatId,
  operationType,
  toolsExecuted,
  creditsCharged,
  aiCostUsd,
  durationMs,
  tokenUsage,
  intent,
  success = true,
  errorMessage,
}: {
  userId: string;
  chatId?: string;
  operationType: OperationType;
  toolsExecuted: string[];
  creditsCharged: number;
  aiCostUsd: number;
  durationMs?: number;
  tokenUsage?: { input: number; output: number; cached?: number };
  intent?: string;
  success?: boolean;
  errorMessage?: string;
}) {
  return await prisma.usageLog.create({
    data: {
      userId,
      chatId,
      operationType,
      toolsExecuted,
      creditsCharged,
      aiCostUsd,
      durationMs,
      tokenUsage,
      intent,
      success,
      errorMessage,
    },
  });
}

export async function getUserUsageStats(userId: string) {
  const logs = await prisma.usageLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalCredits = logs.reduce((sum, log) => sum + log.creditsCharged, 0);
  const totalCost = logs.reduce((sum, log) => sum + Number(log.aiCostUsd), 0);

  return {
    totalLogs: logs.length,
    totalCredits,
    totalCost,
    logs,
  };
}

export async function getChatUsageStats(chatId: string) {
  const logs = await prisma.usageLog.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
  });

  const totalCredits = logs.reduce((sum, log) => sum + log.creditsCharged, 0);
  const totalCost = logs.reduce((sum, log) => sum + Number(log.aiCostUsd), 0);

  return {
    totalLogs: logs.length,
    totalCredits,
    totalCost,
    logs,
  };
}
