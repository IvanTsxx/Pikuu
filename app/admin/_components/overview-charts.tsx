"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  date: string;
  revenue?: number;
  newUsers?: number;
  activeUsers?: number;
}

interface PackData {
  name: string;
  value: number;
  fill?: string;
}

interface OverviewChartsProps {
  data: {
    dailyRevenue: ChartData[];
    userGrowth: ChartData[];
    packDistribution?: PackData[];
  };
}

const revenueChartConfig = {
  revenue: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const userGrowthChartConfig = {
  newUsers: {
    label: "Nuevos",
    color: "var(--chart-2)",
  },
  activeUsers: {
    label: "Activos",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const packSalesChartConfig = {
  starter: {
    label: "Starter",
    color: "var(--chart-4)", // Light Grey
  },
  pro: {
    label: "Pro",
    color: "var(--chart-1)", // Primary (Greenish)
  },
  power: {
    label: "Power",
    color: "var(--chart-3)", // Medium Grey (or check chart-2 for dark)
  },
} satisfies ChartConfig;

export function OverviewCharts({ data }: OverviewChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ingresos Generales</CardTitle>
          <CardDescription>
            Ingresos diarios acumulados en los últimos 30 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={revenueChartConfig}
            className="min-h-[300px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data.dailyRevenue}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Nuevos Usuarios</CardTitle>
          <CardDescription>
            Crecimiento de usuarios nuevos vs activos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={userGrowthChartConfig}
            className="min-h-[300px] w-full"
          >
            <BarChart accessibilityLayer data={data.userGrowth}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(5)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="newUsers" fill="var(--color-newUsers)" radius={4} />
              <Bar
                dataKey="activeUsers"
                fill="var(--color-activeUsers)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {data.packDistribution && (
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Packs Más Vendidos</CardTitle>
            <CardDescription>
              Distribución de ventas por tipo de paquete
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={packSalesChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie
                  data={data.packDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Distribución total de ventas
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
