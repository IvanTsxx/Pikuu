import { prisma } from "@/lib/prisma";
import { PricingCard } from "./_components/pricing-card";

export default async function Pricing() {
  const tiers = await prisma.pricingConfig.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <div className="container relative mx-auto overflow-hidden px-4 py-32">
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="font-semibold text-base text-primary leading-7">
          Pricing
        </h2>
        <p className="mt-2 font-bold text-4xl text-foreground tracking-tight sm:text-5xl">
          Purchase Credits
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
        Choose the package that best fits your needs. Pay once, use forever.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.id}
            packageType={tier.packageType}
            name={tier.displayName}
            price={Number(tier.priceUsd)}
            credits={Number(tier.creditsAmount)}
            discount={Number(tier.discountPercent)}
            isPopular={tier.isPopular}
            description={tier.description || ""}
            pricePerCredit={Number(tier.pricePerCredit)}
          />
        ))}
      </div>
    </div>
  );
}
