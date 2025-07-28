/*
  Warnings:

  - The `position` column on the `employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EmployeePosition" AS ENUM ('STAFF', 'SUPERVISOR', 'MANAGER', 'SENIOR_MANAGER', 'DIRECTOR', 'VICE_PRESIDENT', 'CHIEF_LEVEL');

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "position",
ADD COLUMN     "position" "EmployeePosition";
