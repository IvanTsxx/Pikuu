import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { customSession, magicLink } from "better-auth/plugins";
import authConfig from "@/config/auth.config";
import { PRODUCTS_CONFIG } from "@/config/products";
import { env } from "@/env/server";
import { prisma } from "@/lib/prisma";
import { polarClient } from "../polar";

export const auth = betterAuth({
  ...authConfig,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      expiresIn: 15 * 60 * 1000, // 15 minutos en milisegundos
      async sendMagicLink(data) {
        // Send an email to the user with a magic link
        const { sendEmail } = await import("@/lib/send-email");
        await sendEmail({
          expiresIn: "15 minutos",
          magicLinkUrl: data.url,
          to: data.email,
          type: "magic-link",
        });
      },
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,

      use: [
        checkout({
          products: PRODUCTS_CONFIG.map((p) => ({
            productId: p.productId,
            slug: p.slug,
          })),

          successUrl: `${env.APP_URL}/dashboard/success?checkout_id={CHECKOUT_ID}`, // Redirect to pricing page (or a success page)
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,

          onOrderPaid: async (payload) => {
            const { addCredits } = await import("../credits/balance");

            const customerEmail = payload.data.customer.email;

            if (!customerEmail) {
              console.error("No customer email in Polar webhook payload");
              return;
            }

            const user = await prisma.user.findFirst({
              where: { email: customerEmail },
            });

            if (!user) {
              console.error(`User not found for email: ${customerEmail}`);
              return;
            }

            // 2. Identify the package
            const productId = payload.data.productId || undefined;
            const pricingConfig = await prisma.pricingConfig.findUnique({
              where: { polarProductId: productId },
            });

            if (!pricingConfig) {
              console.error(
                `Pricing config not found for product ID: ${productId}`,
              );
              return;
            }

            // 3. Record purchase and add credits
            // Check if order already processed
            const existingPurchase = await prisma.creditPurchase.findUnique({
              where: { polarOrderId: payload.data.id },
            });

            if (existingPurchase) {
              return;
            }

            const orderData = payload.data;

            await prisma.creditPurchase.create({
              data: {
                userId: user.id,
                polarOrderId: orderData.id,
                polarCheckoutId: orderData.checkoutId,
                priceUsd: Number(orderData.totalAmount) / 100, // Amount is usually in cents
                packageType: pricingConfig.packageType,
                pricePerCredit: pricingConfig.pricePerCredit,
                creditsAmount: pricingConfig.creditsAmount,
                paymentStatus: "completed",
                metadata: orderData.metadata || {},
              },
            });

            await addCredits(
              user.id,
              pricingConfig.creditsAmount,
              orderData.id,
            );
            console.log(`Added ${pricingConfig.creditsAmount}`);
          },
        }),
      ],
      user: {
        deleteUser: {
          enabled: true,
          afterDelete: async (user: User) => {
            if (!user) {
              throw new Error("User not found");
            }
            await polarClient.customers.deleteExternal({
              externalId: user?.id,
            });
          },
        },
      },
    }),
    nextCookies(),
    customSession(async ({ user, session }) => {
      const userDB = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          creditBalance: true,
          usageLogs: true,
          chats: true,
        },
      });

      return {
        user: userDB,
        session,
      };
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        async before(_user) {},
        async after(user) {
          const { id, email } = user;
          const isAdmin = email === env.ADMIN_EMAIL;

          if (!user) {
            throw new Error("User not found");
          }

          let userRow = await prisma.user.findUnique({
            where: { id },
          });

          if (!userRow) {
            console.log("User not found, creating...");
            const name = (isAdmin && env.ADMIN_NAME) || "";
            const newUser = await prisma.user.create({
              data: {
                id,
                name,
                email,
                role: isAdmin ? "ADMIN" : "USER",
                emailVerified: true,
              },
            });

            userRow = newUser;
          }

          if (isAdmin) {
            // --- Update user role ---
            await prisma.user.update({
              where: { id },
              data: {
                role: "ADMIN",
                emailVerified: true,
              },
            });
          }
        },
      },
    },
  },
  trustedOrigins: [env.APP_URL, "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
