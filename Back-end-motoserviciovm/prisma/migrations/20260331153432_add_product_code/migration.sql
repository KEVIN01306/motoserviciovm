/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Producto` ADD COLUMN `codigo` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Producto_codigo_key` ON `Producto`(`codigo`);
