/*
  Warnings:

  - You are about to alter the column `descuentoTotal` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Double`.

*/
-- AlterTable
ALTER TABLE `Venta` MODIFY `descuentoTotal` DOUBLE NULL;
