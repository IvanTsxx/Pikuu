import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckoutSuccess } from "./_components/checkout-success";

export default async function DashboardSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const { checkout_id } = await searchParams;

  if (!checkout_id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background p-4">
      <CheckoutSuccess checkoutId={checkout_id} />
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="zoom-in fade-in flex h-20 w-20 animate-in items-center justify-center rounded-full bg-green-100 duration-500 dark:bg-green-900/30">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <div className="slide-in-from-bottom-4 fade-in animate-in space-y-2 fill-mode-both delay-150 duration-500">
          <h1 className="font-bold text-3xl tracking-tighter">
            ¡Pago Exitoso!
          </h1>
          <p className="text-muted-foreground">
            Tus créditos han sido agregados correctamente a tu cuenta. ¡Gracias
            por confiar en nosotros!
          </p>
        </div>
        <div className="slide-in-from-bottom-4 fade-in flex w-full animate-in gap-2 fill-mode-both delay-300 duration-500">
          <Button
            render={<Link href="/dashboard">Ir al Dashboard</Link>}
            className="w-full"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
