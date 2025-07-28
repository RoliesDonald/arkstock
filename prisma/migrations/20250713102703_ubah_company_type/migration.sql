/*
  Warnings:

  - The values [RENTAL,OTHER] on the enum `CompanyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyType_new" AS ENUM ('CUSTOMER', 'VENDOR', 'RENTAL_COMPANY', 'SERVICE_MAINTENANCE', 'FLEET_COMPANY', 'INTERNAL', 'CAR_USER', 'CHILD_COMPANY', 'SUPPLIER');
ALTER TABLE "companies" ALTER COLUMN "companyType" TYPE "CompanyType_new" USING ("companyType"::text::"CompanyType_new");
ALTER TYPE "CompanyType" RENAME TO "CompanyType_old";
ALTER TYPE "CompanyType_new" RENAME TO "CompanyType";
DROP TYPE "CompanyType_old";
COMMIT;
