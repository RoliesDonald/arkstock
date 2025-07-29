/*
  Warnings:

  - You are about to drop the column `user_id` on the `employees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "employees_user_id_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "user_id",
ADD COLUMN     "employee_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_id_key" ON "employees"("employee_id");
