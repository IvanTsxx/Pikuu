import { polarClient } from "@polar-sh/better-auth/client";
import {
  customSessionClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env/client";
import type { auth } from ".";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    magicLinkClient(),
    polarClient(),
    customSessionClient<typeof auth>(),
  ],
});

export const { signIn, signUp, signOut, useSession, checkout } = authClient;
