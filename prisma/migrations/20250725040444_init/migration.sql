/*
  Warnings:

  - You are about to drop the column `total_price` on the `estimation_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `estimation_items` table. All the data in the column will be lost.
  - You are about to drop the column `wo_id` on the `estimations` table. All the data in the column will be lost.
  - You are about to alter the column `total_estimated_amount` on the `estimations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - The primary key for the `service_required_spare_parts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `service_name` on the `services` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the column `brand` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `initial_stock` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `make` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `variant` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `spare_parts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the column `remark` on the `stock_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type` on the `stock_transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[work_order_id]` on the table `estimations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_id,spare_part_id]` on the table `service_required_spare_parts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_number]` on the table `stock_transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gender` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `estimation_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `estimation_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_order_id` to the `estimations` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `service_required_spare_parts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_number` to the `stock_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `stock_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_category` to the `units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_type` to the `units` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SparePartCategory" AS ENUM ('ENGINE', 'BRAKE', 'SUSPENSION', 'ELECTRICAL', 'BODY', 'TIRE', 'LIGHTING', 'EXHAUST', 'COOLING', 'STEERING', 'TRANSMISSION', 'INTERIOR', 'EXTERIOR', 'FILTERS', 'FLUIDS', 'TOOLS', 'ACCESSORIES', 'OTHER');

-- CreateEnum
CREATE TYPE "SparePartStatus" AS ENUM ('AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "WorkOrderTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "StockTransactionType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RETURN');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('MEASUREMENT', 'CURRENCY', 'TIME', 'OTHER');

-- CreateEnum
CREATE TYPE "UnitCategory" AS ENUM ('LENGTH', 'WEIGHT', 'VOLUME', 'AREA', 'COUNT', 'CURRENCY', 'DURATION', 'OTHER');

-- DropForeignKey
ALTER TABLE "estimations" DROP CONSTRAINT "estimations_wo_id_fkey";

-- DropIndex
DROP INDEX "estimations_wo_id_key";

-- DropIndex
DROP INDEX "services_service_name_key";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "estimation_items" DROP COLUMN "total_price",
DROP COLUMN "unit_price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "estimations" DROP COLUMN "wo_id",
ADD COLUMN     "work_order_id" TEXT NOT NULL,
ALTER COLUMN "total_estimated_amount" DROP DEFAULT,
ALTER COLUMN "total_estimated_amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "service_required_spare_parts" DROP CONSTRAINT "service_required_spare_parts_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "service_required_spare_parts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "services" DROP COLUMN "service_name",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "spare_parts" DROP COLUMN "brand",
DROP COLUMN "initial_stock",
DROP COLUMN "make",
DROP COLUMN "manufacturer",
DROP COLUMN "sku",
DROP COLUMN "stock",
DROP COLUMN "variant",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "max_stock_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "min_stock_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock_quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "supplier_id" TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "stock_transactions" DROP COLUMN "remark",
DROP COLUMN "transaction_type",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "processed_by_id" TEXT,
ADD COLUMN     "transaction_number" TEXT NOT NULL,
ADD COLUMN     "type" "StockTransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "units" ADD COLUMN     "symbol" TEXT,
ADD COLUMN     "unit_category" "UnitCategory" NOT NULL,
ADD COLUMN     "unit_type" "UnitType" NOT NULL;

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "work_order_tasks" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "task_name" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorkOrderTaskStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_to_id" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "work_order_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_services" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_order_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_spare_parts" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_order_spare_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_images" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    "uploaded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_order_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_items" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_order_services_work_order_id_service_id_key" ON "work_order_services"("work_order_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_order_spare_parts_work_order_id_spare_part_id_key" ON "work_order_spare_parts"("work_order_id", "spare_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_order_items_work_order_id_spare_part_id_key" ON "work_order_items"("work_order_id", "spare_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimations_work_order_id_key" ON "estimations"("work_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_required_spare_parts_service_id_spare_part_id_key" ON "service_required_spare_parts"("service_id", "spare_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transactions_transaction_number_key" ON "stock_transactions"("transaction_number");

-- AddForeignKey
ALTER TABLE "spare_parts" ADD CONSTRAINT "spare_parts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_tasks" ADD CONSTRAINT "work_order_tasks_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_tasks" ADD CONSTRAINT "work_order_tasks_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_tasks" ADD CONSTRAINT "work_order_tasks_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_services" ADD CONSTRAINT "work_order_services_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_services" ADD CONSTRAINT "work_order_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_spare_parts" ADD CONSTRAINT "work_order_spare_parts_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_spare_parts" ADD CONSTRAINT "work_order_spare_parts_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_images" ADD CONSTRAINT "work_order_images_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_items" ADD CONSTRAINT "work_order_items_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_items" ADD CONSTRAINT "work_order_items_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
