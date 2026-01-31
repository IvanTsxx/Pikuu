/*
  Warnings:

  - The `operationType` column on the `credit_transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `operationType` on the `credit_cost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `operation_type` on the `usage_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('FULL_PROJECT', 'ADD_MODEL', 'MODIFY_SECTION', 'ITERATE');

-- AlterTable
ALTER TABLE "credit_cost" DROP COLUMN "operationType",
ADD COLUMN     "operationType" "OperationType" NOT NULL;

-- AlterTable
ALTER TABLE "credit_transaction" DROP COLUMN "operationType",
ADD COLUMN     "operationType" "OperationType";

-- AlterTable
ALTER TABLE "usage_logs" DROP COLUMN "operation_type",
ADD COLUMN     "operation_type" "OperationType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "credit_cost_operationType_key" ON "credit_cost"("operationType");

-- CreateIndex
CREATE INDEX "usage_logs_operation_type_idx" ON "usage_logs"("operation_type");
