-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('CUSTOMER', 'VENDOR', 'CAR_USER', 'SUPPLIER', 'INTERNAL');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'MECHANIC', 'DRIVER', 'PIC', 'SERVICE_ADVISOR', 'WAREHOSE_STAFF', 'WAREHOUSE_MANAGER', 'ACCOUNTING_STAFF', 'ACCOUNTING_MANAGER', 'PURCHASING_STAFF', 'PURCHASING_MANAGER');

-- CreateEnum
CREATE TYPE "PartVariant" AS ENUM ('OEM', 'AFTERMARKET', 'GBOX', 'RECONDITIONED', 'USED');

-- CreateEnum
CREATE TYPE "WoProgresStatus" AS ENUM ('DRAFT', 'PENDING', 'ON_PROCESS', 'WAITING_APPROVAL', 'WAITING_PART', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "WoPriorityType" AS ENUM ('NORMAL', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ORDERED', 'SHIPPED', 'RECEIVED', 'CANCELED');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_email" TEXT,
    "logo" TEXT,
    "contact" TEXT,
    "address" TEXT,
    "tax_registered" BOOLEAN NOT NULL DEFAULT false,
    "companyType" "CompanyType" NOT NULL,
    "parentCompanyId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim_level" TEXT,
    "model_year" INTEGER,
    "body_style" TEXT,
    "color" TEXT,
    "vin_num" TEXT,
    "engine_num" TEXT,
    "settledOdo" INTEGER NOT NULL,
    "owner_id" TEXT NOT NULL,
    "car_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user _id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "photo" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "departement" TEXT,
    "company_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_parts" (
    "id" TEXT NOT NULL,
    "part_number" TEXT NOT NULL,
    "sku" TEXT,
    "part_name" TEXT NOT NULL,
    "variant" "PartVariant" NOT NULL,
    "make" TEXT,
    "compatibility" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spare_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "wo_number" TEXT NOT NULL,
    "wo_master" TEXT NOT NULL,
    "wo_date" TIMESTAMP(3) NOT NULL,
    "settled_odo" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "schedule_date" TIMESTAMP(3),
    "vehicle_location" TEXT NOT NULL,
    "notes" TEXT,
    "vehicleMake" TEXT NOT NULL,
    "progress_status" "WoProgresStatus" NOT NULL DEFAULT 'DRAFT',
    "priority_type" "WoPriorityType" NOT NULL DEFAULT 'NORMAL',
    "vehicle_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "car_user_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "mechanic_id" TEXT,
    "driver_id" TEXT,
    "driver_contact" TEXT,
    "approved_by_id" TEXT,
    "requested_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "request_odo" INTEGER NOT NULL,
    "actual_odo" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "finished_date" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "wo_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "mechanic_id" TEXT,
    "approved_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_services" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimations" (
    "id" TEXT NOT NULL,
    "estimation_number" TEXT NOT NULL,
    "estimation_date" TIMESTAMP(3) NOT NULL,
    "request_odo" INTEGER NOT NULL,
    "actual_odo" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "finished_date" TIMESTAMP(3),
    "total_estimated_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "wo_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "mechanic_id" TEXT,
    "approved_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimation_items" (
    "id" TEXT NOT NULL,
    "estimation_id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimation_services" (
    "id" TEXT NOT NULL,
    "estimation_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimation_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "po_number" TEXT NOT NULL,
    "po_date" TIMESTAMP(3) NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "delivery_address" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "delivery_date" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "requested_by_id" TEXT,
    "approved_by_id" TEXT,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" TEXT NOT NULL,
    "po_id" TEXT NOT NULL,
    "spare_part_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_part_suitable_vehicles" (
    "spare_part_id" TEXT NOT NULL,
    "vehicle_make" TEXT NOT NULL,
    "vehicle_model" TEXT NOT NULL,

    CONSTRAINT "spare_part_suitable_vehicles_pkey" PRIMARY KEY ("spare_part_id","vehicle_make","vehicle_model")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_id_key" ON "companies"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles"("license_plate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_num_key" ON "vehicles"("vin_num");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_engine_num_key" ON "vehicles"("engine_num");

-- CreateIndex
CREATE UNIQUE INDEX "users_user _id_key" ON "users"("user _id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "spare_parts_part_number_key" ON "spare_parts"("part_number");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_wo_number_key" ON "work_orders"("wo_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_wo_id_key" ON "invoices"("wo_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_items_invoice_id_spare_part_id_key" ON "invoice_items"("invoice_id", "spare_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "services_service_name_key" ON "services"("service_name");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_services_invoice_id_service_id_key" ON "invoice_services"("invoice_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimations_estimation_number_key" ON "estimations"("estimation_number");

-- CreateIndex
CREATE UNIQUE INDEX "estimations_wo_id_key" ON "estimations"("wo_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimation_items_estimation_id_spare_part_id_key" ON "estimation_items"("estimation_id", "spare_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimation_services_estimation_id_service_id_key" ON "estimation_services"("estimation_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_po_number_key" ON "purchase_orders"("po_number");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_items_po_id_spare_part_id_key" ON "purchase_order_items"("po_id", "spare_part_id");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_car_user_id_fkey" FOREIGN KEY ("car_user_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_car_user_id_fkey" FOREIGN KEY ("car_user_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_wo_id_fkey" FOREIGN KEY ("wo_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_services" ADD CONSTRAINT "invoice_services_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_services" ADD CONSTRAINT "invoice_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_wo_id_fkey" FOREIGN KEY ("wo_id") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimations" ADD CONSTRAINT "estimations_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimation_items" ADD CONSTRAINT "estimation_items_estimation_id_fkey" FOREIGN KEY ("estimation_id") REFERENCES "estimations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimation_items" ADD CONSTRAINT "estimation_items_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimation_services" ADD CONSTRAINT "estimation_services_estimation_id_fkey" FOREIGN KEY ("estimation_id") REFERENCES "estimations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimation_services" ADD CONSTRAINT "estimation_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_suitable_vehicles" ADD CONSTRAINT "spare_part_suitable_vehicles_spare_part_id_fkey" FOREIGN KEY ("spare_part_id") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
