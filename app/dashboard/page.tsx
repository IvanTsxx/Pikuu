import { CreditBalanceCard } from "@/app/dashboard/_components/balance-card";
import { TransactionHistory } from "@/app/dashboard/_components/transaction-history";
import { UsageChart } from "@/app/dashboard/_components/usage-chart";
import { getUserBalance } from "@/lib/credits/balance";
import { getCurrentUser } from "@/lib/db/queries/auth";
import { prisma } from "@/lib/prisma";

export default async function CreditsPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return null;
  }

  const balance = await getUserBalance(user.id);

  const transactions = await prisma.creditTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const usageLogs = await prisma.usageLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="container p-8">
      <h1 className="mb-8 font-bold text-3xl">Mis Créditos</h1>

      <div className="mb-8 grid gap-6">
        <CreditBalanceCard balance={balance} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <UsageChart logs={usageLogs} />
      </div>

      <TransactionHistory transactions={transactions} />
    </div>
  );
}
