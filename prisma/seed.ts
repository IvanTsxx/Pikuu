import { PRODUCTS_CONFIG } from "@/config/products";
import { prisma } from "@/lib/prisma";

async function main() {
  // Clear existing data
  await prisma.pricingConfig.deleteMany();
  await prisma.creditCost.deleteMany();

  // Pricing configs
  await prisma.pricingConfig.createMany({
    data: PRODUCTS_CONFIG.map((p) => ({
      packageType: p.packageType,
      polarProductId: p.productId,
      creditsAmount: p.credits,
      priceUsd: p.priceUsd,
      pricePerCredit: p.pricePerCredit,
      discountPercent: p.discountPercent || 0,
      displayName: p.name,
      description: p.description,
      sortOrder: p.sortOrder,
      isActive: true,
      isPopular: p.isPopular || false,
    })),
  });

  // Credit costs
  await prisma.creditCost.createMany({
    data: [
      {
        operationType: "FULL_PROJECT",
        creditsRequired: 10,
        displayName: "Proyecto Completo",
        description: "Schema + Zod + CRUD + Forms",
      },
      {
        operationType: "ADD_MODEL",
        creditsRequired: 3,
        displayName: "Agregar Modelo",
        description: "Nuevo modelo con CRUD y forms",
      },
      {
        operationType: "MODIFY_SECTION",
        creditsRequired: 2,
        displayName: "Modificar Sección",
        description: "Actualizar form, validation o CRUD",
      },
      {
        operationType: "ITERATE",
        creditsRequired: 1,
        displayName: "Iteración",
        description: "Ajustes y refinamientos",
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
