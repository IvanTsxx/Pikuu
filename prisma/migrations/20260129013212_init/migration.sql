-- CreateEnum
CREATE TYPE "CrudStrategy" AS ENUM ('actions', 'routes');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_balance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalCredits" INTEGER NOT NULL DEFAULT 0,
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "freeCredits" INTEGER NOT NULL DEFAULT 3,
    "paidCredits" INTEGER NOT NULL DEFAULT 0,
    "freeCreditsUsed" INTEGER NOT NULL DEFAULT 0,
    "freeCreditsResetAt" TIMESTAMP(3),
    "lastPurchaseAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "creditsAmount" INTEGER NOT NULL,
    "priceUsd" DECIMAL(10,2) NOT NULL,
    "pricePerCredit" DECIMAL(10,4) NOT NULL,
    "polarCheckoutId" TEXT,
    "polarOrderId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "credit_purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "projectId" TEXT,
    "operationType" TEXT,
    "creditsCharged" INTEGER,
    "purchaseId" TEXT,
    "relatedEntity" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "crud_strategy" "CrudStrategy" NOT NULL DEFAULT 'actions',
    "prisma_schema" TEXT,
    "zod_schemas" JSONB NOT NULL DEFAULT '{}',
    "actions" JSONB NOT NULL DEFAULT '{}',
    "routes" JSONB NOT NULL DEFAULT '{}',
    "forms" JSONB NOT NULL DEFAULT '{}',
    "workflow" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parts" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL DEFAULT 0,
    "text_text" TEXT,
    "reasoning_text" TEXT,
    "file_mediaType" TEXT,
    "file_filename" TEXT,
    "file_url" TEXT,
    "source_url_sourceId" TEXT,
    "source_url_url" TEXT,
    "source_url_title" TEXT,
    "source_document_sourceId" TEXT,
    "source_document_mediaType" TEXT,
    "source_document_title" TEXT,
    "source_document_filename" TEXT,
    "tool_toolCallId" TEXT,
    "tool_state" TEXT,
    "tool_errorText" TEXT,
    "tool_generatePrisma_input" JSONB,
    "tool_generatePrisma_output" JSONB,
    "tool_generateZod_input" JSONB,
    "tool_generateZod_output" JSONB,
    "tool_generateCrud_input" JSONB,
    "tool_generateCrud_output" JSONB,
    "tool_generateForms_input" JSONB,
    "tool_generateForms_output" JSONB,
    "tool_generateWorkflow_input" JSONB,
    "tool_generateWorkflow_output" JSONB,
    "data_artifact_id" TEXT,
    "data_artifact_name" TEXT,
    "data_artifact_type" TEXT,
    "data_artifact_filePath" TEXT,
    "data_artifact_code" TEXT,
    "data_artifact_diff" TEXT,
    "data_artifact_isNew" BOOLEAN,
    "providerMetadata" JSONB,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT,
    "operation_type" TEXT NOT NULL,
    "tools_executed" JSONB NOT NULL,
    "credits_charged" INTEGER NOT NULL,
    "ai_cost_usd" DECIMAL(10,6) NOT NULL,
    "duration_ms" INTEGER,
    "token_usage" JSONB,
    "intent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_config" (
    "id" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "polarProductId" TEXT,
    "creditsAmount" INTEGER NOT NULL,
    "priceUsd" DECIMAL(10,2) NOT NULL,
    "pricePerCredit" DECIMAL(10,4) NOT NULL,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_cost" (
    "id" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "creditsRequired" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredEmail" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referrerBonus" INTEGER NOT NULL DEFAULT 20,
    "referredBonus" INTEGER NOT NULL DEFAULT 20,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_metrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "paidUsers" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "starterPackSales" INTEGER NOT NULL DEFAULT 0,
    "proPackSales" INTEGER NOT NULL DEFAULT 0,
    "powerPackSales" INTEGER NOT NULL DEFAULT 0,
    "projectsCreated" INTEGER NOT NULL DEFAULT 0,
    "totalGenerations" INTEGER NOT NULL DEFAULT 0,
    "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
    "creditsPurchased" INTEGER NOT NULL DEFAULT 0,
    "totalAiCostUsd" DECIMAL(10,6) NOT NULL DEFAULT 0,
    "freeToFirstPurchase" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "credit_balance_userId_key" ON "credit_balance"("userId");

-- CreateIndex
CREATE INDEX "credit_balance_userId_idx" ON "credit_balance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_purchase_polarCheckoutId_key" ON "credit_purchase"("polarCheckoutId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_purchase_polarOrderId_key" ON "credit_purchase"("polarOrderId");

-- CreateIndex
CREATE INDEX "credit_purchase_userId_idx" ON "credit_purchase"("userId");

-- CreateIndex
CREATE INDEX "credit_purchase_polarCheckoutId_idx" ON "credit_purchase"("polarCheckoutId");

-- CreateIndex
CREATE INDEX "credit_purchase_paymentStatus_idx" ON "credit_purchase"("paymentStatus");

-- CreateIndex
CREATE INDEX "credit_transaction_userId_idx" ON "credit_transaction"("userId");

-- CreateIndex
CREATE INDEX "credit_transaction_projectId_idx" ON "credit_transaction"("projectId");

-- CreateIndex
CREATE INDEX "credit_transaction_type_idx" ON "credit_transaction"("type");

-- CreateIndex
CREATE INDEX "credit_transaction_createdAt_idx" ON "credit_transaction"("createdAt");

-- CreateIndex
CREATE INDEX "chats_user_id_idx" ON "chats"("user_id");

-- CreateIndex
CREATE INDEX "chats_user_id_updated_at_idx" ON "chats"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "messages_chat_id_idx" ON "messages"("chat_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "parts_message_id_idx" ON "parts"("message_id");

-- CreateIndex
CREATE INDEX "parts_message_id_order_idx" ON "parts"("message_id", "order");

-- CreateIndex
CREATE INDEX "usage_logs_user_id_idx" ON "usage_logs"("user_id");

-- CreateIndex
CREATE INDEX "usage_logs_chat_id_idx" ON "usage_logs"("chat_id");

-- CreateIndex
CREATE INDEX "usage_logs_operation_type_idx" ON "usage_logs"("operation_type");

-- CreateIndex
CREATE INDEX "usage_logs_created_at_idx" ON "usage_logs"("created_at");

-- CreateIndex
CREATE INDEX "usage_logs_user_id_created_at_idx" ON "usage_logs"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_config_packageType_key" ON "pricing_config"("packageType");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_config_polarProductId_key" ON "pricing_config"("polarProductId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_cost_operationType_key" ON "credit_cost"("operationType");

-- CreateIndex
CREATE INDEX "referral_referrerId_idx" ON "referral"("referrerId");

-- CreateIndex
CREATE INDEX "referral_referredEmail_idx" ON "referral"("referredEmail");

-- CreateIndex
CREATE INDEX "referral_status_idx" ON "referral"("status");

-- CreateIndex
CREATE UNIQUE INDEX "daily_metrics_date_key" ON "daily_metrics"("date");

-- CreateIndex
CREATE INDEX "daily_metrics_date_idx" ON "daily_metrics"("date");
