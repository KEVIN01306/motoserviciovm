/*
  Warnings:

  - A unique constraint covering the columns `[dpi]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nit]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_dpi_key` ON `User`(`dpi`);

-- CreateIndex
CREATE UNIQUE INDEX `User_nit_key` ON `User`(`nit`);
