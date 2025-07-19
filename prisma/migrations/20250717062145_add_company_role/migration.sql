/*
  Warnings:

  - Added the required column `companyRole` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('MAIN_COMPANY', 'CHILD_COMPANY');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "companyRole" "CompanyRole" NOT NULL;
