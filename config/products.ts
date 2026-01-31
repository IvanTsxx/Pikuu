export const PRODUCTS_CONFIG = [
  {
    productId: "c890f8a7-15b1-4914-9ae9-165a05f46f81",
    slug: "Power-Pack",
    name: "Power Pack",
    credits: 1000,
    priceUsd: 70.0,
    packageType: "power",
    description: "~100 proyectos completos",
    pricePerCredit: 0.07,
    discountPercent: 30,
    sortOrder: 3,
    isPopular: false,
  },
  {
    productId: "4a78e5ea-5abe-401e-a5b5-05912bce217c",
    slug: "Pro-Pack",
    name: "Pro Pack",
    credits: 300,
    priceUsd: 25.0,
    packageType: "pro",
    description: "~30 proyectos completos",
    pricePerCredit: 0.0833,
    discountPercent: 17,
    sortOrder: 2,
    isPopular: true,
  },
  {
    productId: "44afff7b-6e40-4ef7-9440-88ed8d9da0a1",
    slug: "Starter-Pack",
    name: "Starter Pack",
    credits: 100,
    priceUsd: 10.0,
    packageType: "starter",
    description: "~10 proyectos completos",
    pricePerCredit: 0.1,
    discountPercent: 0,
    sortOrder: 1,
    isPopular: false,
  },
] as const;

export function getProductBySlug(slug: string) {
  return PRODUCTS_CONFIG.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return PRODUCTS_CONFIG.find((p) => p.productId === id);
}

export function getProductByPackageType(packageType: string) {
  return PRODUCTS_CONFIG.find((p) => p.packageType === packageType);
}
