import type { Decimal } from "@prisma/client/runtime/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentSale {
  id: string;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  priceUsd: Decimal;
  purchasedAt: Date;
}

interface RecentSalesProps {
  sales: RecentSale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.user.image || ""} alt="Avatar" />
            <AvatarFallback>
              {sale.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="font-medium text-sm leading-none">{sale.user.name}</p>
            <p className="text-muted-foreground text-sm">{sale.user.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${Number(sale.priceUsd).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
