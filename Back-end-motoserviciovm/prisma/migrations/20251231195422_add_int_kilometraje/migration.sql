/*
  Warnings:

  - You are about to alter the column `kilimetraje` on the `Servicio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Servicio` MODIFY `kilimetraje` INTEGER NULL;
