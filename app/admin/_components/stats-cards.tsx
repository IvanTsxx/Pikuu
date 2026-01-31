import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
  value: number;
  change: number;
  trend: string | "up" | "down" | "neutral";
}

interface StatsProps {
  overview: {
    totalUsers: StatItem;
    totalRevenue: StatItem;
    totalSales: StatItem;
    activeUsers: StatItem;
  };
}

export function StatsCards({ overview }: StatsProps) {
  const getTrendColor = (change: number) => {
    if (change > 0) return "text-emerald-500";
    if (change < 0) return "text-rose-500";
    return "text-muted-foreground";
  };

  const formatChange = (change: number) => {
    if (change === 0) return "Sin cambios";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}% desde el mes anterior`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Usuarios</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{overview.totalUsers.value}</div>
          <p className={`text-xs ${getTrendColor(overview.totalUsers.change)}`}>
            {formatChange(overview.totalUsers.change)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Ingresos Totales
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ${overview.totalRevenue.value.toFixed(2)}
          </div>
          <p
            className={`text-xs ${getTrendColor(overview.totalRevenue.change)}`}
          >
            {formatChange(overview.totalRevenue.change)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Ventas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{overview.totalSales.value}</div>
          <p className={`text-xs ${getTrendColor(overview.totalSales.change)}`}>
            {formatChange(overview.totalSales.change)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Activos Ahora</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{overview.activeUsers.value}</div>
          <p
            className={`text-xs ${getTrendColor(overview.activeUsers.change)}`}
          >
            {overview.activeUsers.change > 0 ? "+" : ""}
            {overview.activeUsers.change.toFixed(1)}% desde ayer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
