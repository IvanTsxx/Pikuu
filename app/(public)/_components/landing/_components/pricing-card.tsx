"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getProductByPackageType } from "@/config/products";
import { checkout } from "@/lib/auth/auth-client";

interface PricingCardProps {
  packageType: string;
  name: string;
  price: number;
  credits: number;
  pricePerCredit: number;
  discount?: number;
  isPopular?: boolean;
  description?: string;
  variant?: "public" | "dashboard";
}

export function PricingCard({
  packageType,
  name,
  price,
  credits,
  discount,
  isPopular,
  description,
  variant = "public",
}: PricingCardProps) {
  const router = useRouter();

  const handlePurchase = async () => {
    const product = getProductByPackageType(packageType);
    const productSlug = product?.slug;

    if (!productSlug) {
      console.error("Invalid package type:", packageType);
      return;
    }

    try {
      const { data, error } = await checkout({
        slug: productSlug,
      });

      if (error) {
        toast.error("Error al comprar", {
          description: error.message,
        });
        console.error("Checkout error:", error);
        return;
      }

      if (data?.url) {
        router.push(data.url);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Error al comprar", {
          description: err.message,
        });
      }
      console.error("Checkout exception:", err);
    }
  };

  if (variant === "dashboard") {
    return (
      <div
        className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-vercel-sm ${
          isPopular
            ? "border-primary bg-primary/5 shadow-vercel-sm"
            : "border-border bg-card shadow-sm"
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 font-bold text-[10px] text-primary-foreground uppercase tracking-widest">
            Recommend
          </div>
        )}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-foreground text-lg">{name}</h3>
          <span className="font-bold text-2xl text-foreground">
            ${Number(price)}
          </span>
        </div>
        <p className="mb-6 flex-1 text-muted-foreground text-xs">
          {description}
        </p>
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 font-medium text-xs">
            <Check className="h-3.5 w-3.5 text-primary" />
            <span>{credits} Credits</span>
          </div>
          {discount !== undefined && discount > 0 && (
            <div className="flex items-center gap-2 font-medium text-green-500 text-xs">
              <Check className="h-3.5 w-3.5" />
              <span>{discount}% Discount</span>
            </div>
          )}
        </div>
        <Button
          onClick={handlePurchase}
          size="sm"
          className="w-full font-bold"
          variant={isPopular ? "default" : "outline"}
        >
          Buy Now
        </Button>
      </div>
    );
  }

  return (
    <div
      key={packageType}
      className={`relative flex flex-col overflow-hidden rounded-4xl border p-8 transition-all duration-500 md:p-10 ${
        isPopular
          ? "z-10 scale-105 border-primary bg-background shadow-vercel-dark"
          : "border-border bg-card/50 shadow-vercel-sm"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 rounded-bl-2xl bg-primary px-6 py-1 font-bold text-[10px] text-primary-foreground uppercase tracking-[0.2em]">
          Popular Plan
        </div>
      )}
      <h3 className="mb-2 font-bold text-2xl text-foreground tracking-tight">
        {name}
      </h3>
      <p className="mb-8 h-12 overflow-hidden text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="mb-8 flex items-baseline gap-2">
        <span className="font-black text-5xl text-foreground tracking-tighter">
          ${Number(price)}
        </span>
        <span className="font-bold text-muted-foreground text-sm uppercase">
          USD
        </span>
      </div>
      <ul className="mb-10 flex-1 space-y-4">
        <li className="flex items-center gap-3 font-medium text-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-3 w-3 text-primary" />
          </div>
          {credits} Credits
        </li>
        <li className="flex items-center gap-3 text-muted-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
            <Check className="h-3 w-3" />
          </div>
          One-time payment
        </li>
        {discount !== undefined && discount > 0 && (
          <li className="flex items-center gap-3 font-bold text-green-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-3 w-3" />
            </div>
            {discount}% Discount included
          </li>
        )}
      </ul>
      <Button
        onClick={handlePurchase}
        size="lg"
        className={`h-14 w-full rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 ${
          isPopular ? "bg-primary text-primary-foreground shadow-vercel" : ""
        }`}
        variant={isPopular ? "default" : "outline"}
      >
        Choose {name}
      </Button>
    </div>
  );
}
