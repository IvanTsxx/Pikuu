import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminStats } from "@/lib/admin/stats";
import { OverviewCharts } from "./_components/overview-charts";
import { RecentSales } from "./_components/recent-sales";
import { RecentUsers } from "./_components/recent-users";
import { StatsCards } from "./_components/stats-cards";

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
      </div>

      <StatsCards overview={stats.overview} />

      <OverviewCharts data={stats.charts} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentUsers users={stats.recentUsers} />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>Últimas transacciones realizadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={stats.recentSales} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
