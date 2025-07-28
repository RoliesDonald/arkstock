/*
  Warnings:

  - You are about to drop the column `parentCompanyId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `mechanic_id` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `compatibility` on the `spare_parts` table. All the data in the column will be lost.
  - You are about to drop the column `body_style` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `model_year` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `settledOdo` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleMake` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chassis_num]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unit_price` to the `estimation_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `invoice_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuel_type` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_odometer` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_service_date` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission_type` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_category` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_make` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_type` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year_made` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `vehicles` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT', 'SUSPENDED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('PASSENGER', 'COMMERCIAL', 'MOTORCYCLE');

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('SEDAN', 'HATCH_BACK', 'MPV', 'SUV', 'CROSSOVER', 'COUPE', 'CABRIOLET', 'STATION_WAGON', 'ROADSTER', 'MINI_VAN', 'PICKUP', 'SMALL_VAN', 'MINI_BUS', 'LIGHT_TRUCK', 'BOX_TRUCK', 'WING_BOX', 'DUMP_TRUCK', 'TANKER_TRUCK', 'TRAILER', 'FLATBED_TRUCK', 'REFRIGERATED_TRUCK', 'CAR_CARRIER', 'CONCRETE_MIXER_TRUCK', 'LOG_CARRIER_TRUCK', 'MEDIUM_BUS', 'BIG_BUS', 'SCOOTER', 'CUB_BIKE', 'SPORT_BIKE', 'NAKED_BIKE', 'CRUISER', 'TOURING_BIKE', 'TRAIL_DUAL', 'E_BIKE', 'ALL_TERRAIN_VEHICLE', 'MOPED');

-- CreateEnum
CREATE TYPE "VehicleFuelType" AS ENUM ('GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC', 'LPG', 'CNG');

-- CreateEnum
CREATE TYPE "VehicleTransmissionType" AS ENUM ('MANUAL/MT', 'AUTOMATIC/AT', 'CVT', 'AMT', 'SEMI_AUTOMATIC', 'DCT/DSG', 'ELECTRIC_CVT');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'AVAILABLE', 'IN_MAINTENANCE', 'RENTED', 'OUT_OF_SERVICE', 'BRAKE_DOWN', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'FLEET_PIC', 'SERVICE_MANAGER', 'SERVICE_ADVISOR', 'FINANCE_MANAGER', 'FINANCE_STAFF', 'SALES_MANAGER', 'SALES_STAFF', 'ACCOUNTING_MANAGER', 'ACCOUNTING_STAFF', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF', 'PURCHASING_MANAGER', 'PURCHASING_STAFF', 'MECHANIC', 'USER', 'DRIVER', 'PIC');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE', 'REJECTED', 'SENT', 'PARTIALLY_PAID');

-- CreateEnum
CREATE TYPE "EstimationStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('IN', 'OUT', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('CENTRAL_WAREHOUSE', 'BRANCH_WAREHOUSE', 'SERVICE_CAR_WAREHOUSE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CompanyType" ADD VALUE 'RENTAL';
ALTER TYPE "CompanyType" ADD VALUE 'FLEET_COMPANY';
ALTER TYPE "CompanyType" ADD VALUE 'SERVICE_MAINTENANCE';
ALTER TYPE "CompanyType" ADD VALUE 'RENTAL_COMPANY';
ALTER TYPE "CompanyType" ADD VALUE 'CHILD_COMPANY';
ALTER TYPE "CompanyType" ADD VALUE 'OTHER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'REJECTED';
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'PARTIALLY_RECEIVED';

-- AlterEnum
ALTER TYPE "WoProgresStatus" ADD VALUE 'INVOICE_CREATED';

-- DropForeignKey
ALTER TABLE "estimations" DROP CONSTRAINT "estimations_approved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "estimations" DROP CONSTRAINT "estimations_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_approved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_approved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_requested_by_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_company_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_car_user_id_fkey";

-- DropForeignKey
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_approved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_locationId_fkey";

-- DropForeignKey
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_requested_by_id_fkey";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "parentCompanyId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "parent_company_id" TEXT,
ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "estimation_services" ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "estimations" ADD COLUMN     "accountant_id" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "EstimationStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "invoice_services" ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "mechanic_id",
ADD COLUMN     "accountant_id" TEXT,
ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "remark" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "rejection_reason" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "category" TEXT,
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "tasks" TEXT[];

-- AlterTable
ALTER TABLE "spare_part_suitable_vehicles" ADD COLUMN     "model_year" INTEGER,
ADD COLUMN     "trim_level" TEXT;

-- AlterTable
ALTER TABLE "spare_parts" DROP COLUMN "compatibility",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "initial_stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "body_style",
DROP COLUMN "model_year",
DROP COLUMN "settledOdo",
DROP COLUMN "vehicleMake",
ADD COLUMN     "chassis_num" TEXT,
ADD COLUMN     "fuel_type" "VehicleFuelType" NOT NULL,
ADD COLUMN     "last_odometer" INTEGER NOT NULL,
ADD COLUMN     "last_service_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "VehicleStatus" NOT NULL,
ADD COLUMN     "transmission_type" "VehicleTransmissionType" NOT NULL,
ADD COLUMN     "vehicle_category" "VehicleCategory" NOT NULL,
ADD COLUMN     "vehicle_make" TEXT NOT NULL,
ADD COLUMN     "vehicle_type" "VehicleType" NOT NULL,
ADD COLUMN     "year_made" INTEGER NOT NULL,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "car_user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "work_orders" DROP COLUMN "locationId",
ADD COLUMN     "location_id" TEXT,
ALTER COLUMN "settled_odo" DROP NOT NULL;

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "photo" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "position" TEXT,
    "role" "EmployeeRole" NOT NULL DEFAULT 'USER',
    "department" TEXT,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "tanggal_lahir" TIMESTAMP(3),
    "tanggal_bergabung" TIMESTAMP(3),
    "company_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_required_spare_parts" (
    "service_id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_required_spare_parts_pkey" PRIMARY KEY ("service_id","spare_part_id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "warehouse_type" "WarehouseType" NOT NULL DEFAULT 'BRANCH_WAREHOUSE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stocks" (
    "id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transactions" (
    "id" TEXT NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "source_warehouse_id" TEXT NOT NULL,
    "target_warehouse_id" TEXT,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_name_key" ON "warehouses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_stocks_spare_part_id_warehouse_id_key" ON "warehouse_stocks"("spare_part_id", "warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_chassis_num_key" ON "vehicles"("chassis_num");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_parent_company_id_fkey" FOREIGN KEY ("parent_company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_car_user_id_fkey" FOREIGN KEY ("car_user_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_accountant_id_fkey" FOREIGN KEY ("accountant_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_required_spare_parts" ADD CONSTRAINT "service_required_spare_parts_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_required_spare_parts" ADD CONSTRAINT "service_required_spare_parts_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_accountant_id_fkey" FOREIGN KEY ("accountant_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocks" ADD CONSTRAINT "warehouse_stocks_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocks" ADD CONSTRAINT "warehouse_stocks_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_source_warehouse_id_fkey" FOREIGN KEY ("source_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_target_warehouse_id_fkey" FOREIGN KEY ("target_warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
