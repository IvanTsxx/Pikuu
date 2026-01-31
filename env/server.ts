import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
  server: {
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    APP_URL: z.url().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),
    DATABASE_URL: z.url().min(1),
    EMAIL_FROM: z.string().min(1),
    EMAIL_PASS: z.string().min(1),
    EMAIL_USER: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_WEBHOOK_SECRET: z.string().min(1),
    ADMIN_EMAIL: z.string().min(1),
    ADMIN_NAME: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
});
