import { revalidatePath } from "next/cache";
import type {
  CreditBalance,
  OperationType,
} from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getUserBalance(
  userId: string,
  isPaid = false,
): Promise<CreditBalance> {
  let _balance: CreditBalance | null = await prisma.creditBalance.findUnique({
    where: { userId },
  });

  if (!_balance && !isPaid) {
    // Crear balance inicial con free tier
    _balance = await prisma.creditBalance.create({
      data: {
        userId,
        totalCredits: 3,
        freeCredits: 3,
        freeCreditsUsed: 0,
        paidCredits: 0,
        usedCredits: 0,
      },
    });
  } else if (!_balance && isPaid) {
    _balance = await prisma.creditBalance.create({
      data: {
        userId,
        totalCredits: 0,
        freeCredits: 0,
        freeCreditsUsed: 0,
        paidCredits: 0,
        usedCredits: 0,
      },
    });
  }

  const balance = _balance;

  if (!balance) {
    throw new Error("Balance not found");
  }

  return balance;
}

export async function hasEnoughCredits(
  userId: string,
  required: number,
): Promise<boolean> {
  const balance = await getUserBalance(userId);
  const available = balance.totalCredits - balance.usedCredits;
  return available >= required;
}

export async function deductCredits(
  userId: string,
  amount: number,
  projectId: string,
  operationType: OperationType,
): Promise<{ success: boolean; newBalance: number }> {
  const balance = await getUserBalance(userId);
  const available = balance.totalCredits - balance.usedCredits;

  if (available < amount) {
    return { success: false, newBalance: available };
  }

  // Actualizar balance
  const updated = await prisma.creditBalance.update({
    where: { userId },
    data: {
      usedCredits: { increment: amount },
      // Si tiene free credits, descontarlos primero
      freeCreditsUsed: {
        increment: Math.min(
          amount,
          balance.freeCredits - balance.freeCreditsUsed,
        ),
      },
    },
  });

  // Crear transaction log
  await prisma.creditTransaction.create({
    data: {
      userId,
      type: "generation",
      amount: -amount,
      projectId,
      operationType,
      creditsCharged: amount,
      description: `${operationType} - ${amount} créditos`,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/success");

  return {
    success: true,
    newBalance: updated.totalCredits - updated.usedCredits,
  };
}

export async function addCredits(
  userId: string,
  amount: number,
  purchaseId?: string,
) {
  const balance = await getUserBalance(userId);

  await prisma.creditBalance.update({
    where: { userId, id: balance.id },
    data: {
      totalCredits: { set: amount },
      paidCredits: { set: amount },
      lastPurchaseAt: new Date(),
      freeCredits: 0,
      freeCreditsUsed: 0,
      usedCredits: 0,
    },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      type: "purchase",
      amount,
      purchaseId,
      description: `Compra de ${amount} créditos`,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/success");
}
