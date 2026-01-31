import type { OperationType } from "@/app/generated/prisma/client";
import { OperationType as OperationTypeEnum } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Cache de costos en memoria
let costsCache: Map<OperationType, number> | null = null;

export async function getCreditCost(
  operationType: OperationType,
): Promise<number> {
  if (!costsCache) {
    const costs = await prisma.creditCost.findMany({
      where: { isActive: true },
    });
    costsCache = new Map(
      costs.map((c) => [c.operationType, c.creditsRequired]),
    );
  }

  return costsCache.get(operationType) || 0;
}

export async function calculateOperationCost(
  intent: string,
  toolsToExecute: string[],
): Promise<number> {
  // Mapear intent a operationType
  const operationType =
    intent === "create_project"
      ? OperationTypeEnum.FULL_PROJECT
      : determineOperationType(toolsToExecute);

  return getCreditCost(operationType);
}

export function determineOperationType(tools: string[]): OperationType {
  if (tools.length >= 4) return OperationTypeEnum.FULL_PROJECT;
  if (tools.includes("generatePrisma")) return OperationTypeEnum.ADD_MODEL;
  if (tools.length >= 2) return OperationTypeEnum.MODIFY_SECTION;
  return OperationTypeEnum.ITERATE;
}
