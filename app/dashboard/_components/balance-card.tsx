import { AlertTriangle, CheckCircle, CreditCard, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balance: {
    totalCredits: number;
    usedCredits: number;
    freeCredits: number;
    paidCredits: number;
  } | null;
}

export function CreditBalanceCard({ balance }: BalanceCardProps) {
  const {
    totalCredits = 0,
    usedCredits = 0,
    freeCredits = 0,
    paidCredits = 0,
  } = balance || {};

  const available = Math.max(0, totalCredits - usedCredits);

  // Calculate percentage for progress bar
  const usagePercentage =
    totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;

  // Color coding status
  const isLowBalance = available <= 5 && available > 0;
  const isCriticalBalance = available === 0;

  const statusColor = isCriticalBalance
    ? "text-destructive"
    : isLowBalance
      ? "text-yellow-500"
      : "text-primary";
  // Determine progress bar color based on usage/availability
  // If critical (0 available), red. If low, yellow. Normal otherwise.
  // Note: progress bar typically shows *usage*.
  // If usage is high (low balance), we might want to color it differently?
  // Let's stick to status colors for the text and maybe the progress indicator if possible,
  // but standard Progress component might not accept color prop easily without custom class.
  // We can wrap it or style it.

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-2">
        <CardTitle className="flex items-center gap-2 font-medium text-sm">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Créditos Disponibles
        </CardTitle>
        {isLowBalance && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tus créditos se están agotando.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {isCriticalBalance && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-destructive" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sin créditos disponibles.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <div className={cn("font-bold text-3xl", statusColor)}>
              {available}
            </div>
            <p className="text-muted-foreground text-xs">
              de {totalCredits} totales
            </p>
          </div>
          {/* Visual Pill for status */}
          {available > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-primary text-xs">Activo</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Uso</span>
              <span>{Math.min(100, Math.round(usagePercentage))}%</span>
            </div>
            <div
              className={cn(
                "[&>div]:bg-primary",
                isCriticalBalance && "[&>div]:bg-destructive",
                isLowBalance && "[&>div]:bg-yellow-500",
              )}
            >
              <Progress value={usagePercentage} className="h-2" />
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="rounded-lg border border-border/50 bg-muted/50 p-2.5">
              <div className="mb-1 text-muted-foreground text-xs">
                Comprados
              </div>
              <div className="font-semibold text-sm">{paidCredits}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/50 p-2.5">
              <div className="mb-1 text-muted-foreground text-xs">
                Gratuitos
              </div>
              <div className="font-semibold text-sm">{freeCredits}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-2">
        <Link href="/dashboard/pricing" className="w-full">
          <Button
            size="sm"
            variant={isCriticalBalance ? "destructive" : "default"}
            className="w-full cursor-pointer shadow-sm"
          >
            {isCriticalBalance ? "Recargar Ahora" : "Comprar más créditos"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
