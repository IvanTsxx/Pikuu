"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function CheckoutSuccess({ checkoutId }: { checkoutId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (checkoutId) {
      toast.success("¡Compra realizada con éxito!", {
        description: "Los créditos han sido agregados a tu cuenta.",
        duration: 5000,
      });
    }
  }, [checkoutId, router, pathname, searchParams]);

  return null;
}
