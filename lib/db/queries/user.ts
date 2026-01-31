import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getUserById = cache(async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      creditBalance: true,
    },
  });
});

export const getUserByEmail = cache(async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
});
