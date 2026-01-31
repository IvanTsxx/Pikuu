import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.user) return null;
  return session.user;
});
