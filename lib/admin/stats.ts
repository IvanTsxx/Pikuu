import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getAdminStats = cache(async () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const millisecondsInDay = 1000 * 60 * 60 * 24;

  const [
    userCount,
    usersThisMonth,
    purchaseCount,
    purchasesThisMonth,
    totalRevenueResult,
    revenueThisMonthResult,
    recentUsers,
    recentUsersRaw, // Changed from dailyMetrics
    recentPurchasesRaw, // Added
    recentUsageLogsRaw, // Added for Active Users chart
    activeUsersResult,
    packSalesResult,
    recentSales,
  ] = await Promise.all([
    // Total Users
    prisma.user.count(),
    // Users New This Month
    prisma.user.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    }),

    // Total Sales
    prisma.creditPurchase.count(),
    // Sales This Month
    prisma.creditPurchase.count({
      where: {
        purchasedAt: {
          gte: firstDayOfMonth,
        },
      },
    }),

    // Total Revenue
    prisma.creditPurchase.aggregate({
      _sum: {
        priceUsd: true,
      },
    }),
    // Revenue This Month
    prisma.creditPurchase.aggregate({
      where: {
        purchasedAt: {
          gte: firstDayOfMonth,
        },
      },
      _sum: {
        priceUsd: true,
      },
    }),

    // Recent Users List
    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        role: true,
      },
    }),

    // Charts Data: Fetch Raw Data for real-time aggregation
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * millisecondsInDay),
        },
      },
      select: {
        createdAt: true,
      },
    }),
    prisma.creditPurchase.findMany({
      where: {
        purchasedAt: {
          gte: new Date(Date.now() - 30 * millisecondsInDay),
        },
      },
      select: {
        purchasedAt: true,
        priceUsd: true,
      },
    }),
    prisma.usageLog.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * millisecondsInDay),
        },
      },
      select: {
        userId: true,
        createdAt: true,
      },
    }),

    // Active Users (Last 24h) - Kept for "Active Now" card
    prisma.usageLog.groupBy({
      by: ["userId"],
      where: {
        createdAt: {
          gte: new Date(Date.now() - millisecondsInDay),
        },
      },
    }),

    // Pack Sales Distribution
    prisma.creditPurchase.groupBy({
      by: ["packageType"],
      _count: {
        _all: true,
      },
    }),

    // Recent Sales
    prisma.creditPurchase.findMany({
      take: 5,
      orderBy: {
        purchasedAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
  ]);

  // Calculations for Percentages
  // 1. Users
  const previousTotalUsers = userCount - usersThisMonth;
  const userChange =
    previousTotalUsers > 0 ? (usersThisMonth / previousTotalUsers) * 100 : 0;

  // 2. Revenue
  const totalRevenue = totalRevenueResult._sum.priceUsd?.toNumber() || 0;
  const revenueThisMonth =
    revenueThisMonthResult._sum.priceUsd?.toNumber() || 0;
  const previousTotalRevenue = totalRevenue - revenueThisMonth;
  const revenueChange =
    previousTotalRevenue > 0
      ? (revenueThisMonth / previousTotalRevenue) * 100
      : 0;

  // 3. Sales
  const previousTotalSales = purchaseCount - purchasesThisMonth;
  const salesChange =
    previousTotalSales > 0
      ? (purchasesThisMonth / previousTotalSales) * 100
      : 0;

  // 4. Active Users Card
  const activeNowCount = activeUsersResult.length;
  // Note: Accurate "active users vs yesterday" is complex without daily snapshots.
  // We will simply show the current active (24h) and 0 change for now if no history is available.
  const activeUsersChange = 0;

  // 5. Pack Distribution
  const packDistribution = packSalesResult.map((item) => ({
    name: item.packageType,
    value: item._count._all,
    fill: `var(--chart-${item.packageType === "starter" ? "4" : item.packageType === "pro" ? "1" : "3"})`,
  }));

  // 6. Dynamic Chart Data Aggregation
  const chartMap = new Map<
    string,
    { date: string; revenue: number; newUsers: number; activeUsers: number }
  >();

  // Helper to track unique active users per day
  const dailyActiveUsers = new Map<string, Set<string>>();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * millisecondsInDay);
    const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
    chartMap.set(dateKey, {
      date: dateKey,
      revenue: 0,
      newUsers: 0,
      activeUsers: 0,
    });
    dailyActiveUsers.set(dateKey, new Set());
  }

  // Aggregate Users
  for (const user of recentUsersRaw) {
    const d = user.createdAt.toISOString().split("T")[0];
    if (chartMap.has(d)) {
      chartMap.get(d)!.newUsers++;
    }
  }

  // Aggregate Revenue
  for (const purchase of recentPurchasesRaw) {
    const d = purchase.purchasedAt.toISOString().split("T")[0];
    if (chartMap.has(d)) {
      chartMap.get(d)!.revenue += purchase.priceUsd.toNumber();
    }
  }

  // Aggregate Active Users
  for (const log of recentUsageLogsRaw) {
    const d = log.createdAt.toISOString().split("T")[0];
    if (dailyActiveUsers.has(d)) {
      dailyActiveUsers.get(d)!.add(log.userId);
    }
  }

  // Fill activeUsers count in chartMap
  for (const [date, usersSet] of dailyActiveUsers) {
    if (chartMap.has(date)) {
      chartMap.get(date)!.activeUsers = usersSet.size;
    }
  }

  return {
    overview: {
      totalUsers: {
        value: userCount,
        change: userChange,
        trend: usersThisMonth > 0 ? "up" : "neutral",
      },
      totalRevenue: {
        value: totalRevenue,
        change: revenueChange,
        trend: revenueThisMonth > 0 ? "up" : "neutral",
      },
      totalSales: {
        value: purchaseCount,
        change: salesChange,
        trend: purchasesThisMonth > 0 ? "up" : "neutral",
      },
      activeUsers: {
        value: activeNowCount,
        change: activeUsersChange,
        trend: "neutral",
      },
    },
    recentUsers,
    charts: {
      // Return the aggregated maps
      dailyRevenue: Array.from(chartMap.values()),
      userGrowth: Array.from(chartMap.values()),
      packDistribution,
    },
    recentSales,
  };
});
