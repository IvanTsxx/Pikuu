import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // Verificar cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = subDays(new Date(), 1);
  yesterday.setHours(0, 0, 0, 0);

  // Calcular métricas del día anterior
  const [newUsers, activeUsers, paidUsers, revenue, purchases, usage] =
    await Promise.all([
      // Nuevos usuarios
      prisma.user.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Usuarios activos (con actividad)
      prisma.usageLog
        .groupBy({
          by: ["userId"],
          where: {
            createdAt: {
              gte: yesterday,
              lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        })
        .then((r) => r.length),

      // Usuarios con balance > 0
      prisma.creditBalance.count({
        where: { paidCredits: { gt: 0 } },
      }),

      // Revenue del día
      prisma.creditPurchase.aggregate({
        where: {
          paymentStatus: "completed",
          purchasedAt: {
            gte: yesterday,
            lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        _sum: { priceUsd: true },
      }),

      // Desglose de compras
      prisma.creditPurchase.groupBy({
        by: ["packageType"],
        where: {
          paymentStatus: "completed",
          purchasedAt: {
            gte: yesterday,
            lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      }),

      // Uso de créditos
      prisma.usageLog.aggregate({
        where: {
          createdAt: {
            gte: yesterday,
            lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          creditsCharged: true,
          aiCostUsd: true,
        },
        _count: true,
      }),
    ]);

  // Guardar métricas
  await prisma.dailyMetrics.create({
    data: {
      date: yesterday,
      newUsers,
      activeUsers,
      paidUsers,
      totalRevenue: revenue._sum.priceUsd || 0,
      starterPackSales:
        purchases.find((p) => p.packageType === "starter")?._count || 0,
      proPackSales: purchases.find((p) => p.packageType === "pro")?._count || 0,
      powerPackSales:
        purchases.find((p) => p.packageType === "power")?._count || 0,
      projectsCreated: usage._count,
      totalGenerations: usage._count,
      creditsConsumed: usage._sum.creditsCharged || 0,
      totalAiCostUsd: usage._sum.aiCostUsd || 0,
    },
  });

  return Response.json({ success: true });
}
