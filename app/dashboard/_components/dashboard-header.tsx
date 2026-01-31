import { AlertCircle, Coins } from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@/lib/auth";

export function DashboardHeader({ user }: { user: User }) {
  const isAdmin = user?.role === "ADMIN";

  const totalCredits = user?.creditBalance?.totalCredits ?? 0;
  const usedCredits = user?.creditBalance?.usedCredits ?? 0;
  const availableCredits = Math.max(0, totalCredits - usedCredits);

  const isLow = availableCredits <= 5 && availableCredits > 0;
  const isEmpty = availableCredits === 0;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <SidebarTrigger className="-ml-1" />

      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm">Bienvenido {user?.name}</p>
      </div>

      <div className="flex flex-1 items-center justify-end space-x-2">
        {isAdmin && <Badge>ADMIN</Badge>}

        {/* Minimalist Credit Display */}
        <div className="mr-2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant={isEmpty ? "destructive" : "secondary"}
                  className={`gap-1.5 ${isLow ? "border-yellow-600 bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25" : ""}`}
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span>{availableCredits}</span>
                  {isLow && <AlertCircle className="ml-0.5 h-3 w-3" />}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {isEmpty
                    ? "Sin créditos disponibles"
                    : isLow
                      ? "Créditos bajos"
                      : "Créditos disponibles"}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Total: {totalCredits} | Usados: {usedCredits}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <UserNav />
        <ModeToggle />
      </div>
    </header>
  );
}
