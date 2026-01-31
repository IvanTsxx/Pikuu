import { PricingCard } from "@/app/(public)/_components/landing/_components/pricing-card";
import { prisma } from "@/lib/prisma";

export default async function DashboardPricingPage() {
  const tiers = await prisma.pricingConfig.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <div className="container p-8">
      <div className="mb-12">
        <h1 className="mb-2 font-extrabold text-3xl text-foreground tracking-tight">
          Buy Credits
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose a package to top up your account balance.
        </p>
      </div>

      <div className="grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            variant="dashboard"
          />
        ))}
      </div>
    </div>
  );
}
