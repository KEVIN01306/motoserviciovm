/*
  Warnings:

  - You are about to alter the column `precio` on the `VentaProducto` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `HistorialContabilidad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `HistorialContabilidad` DROP FOREIGN KEY `HistorialContabilidad_estadoId_fkey`;

-- DropForeignKey
ALTER TABLE `HistorialContabilidad` DROP FOREIGN KEY `HistorialContabilidad_sucursalId_fkey`;

-- AlterTable
ALTER TABLE `VentaProducto` ADD COLUMN `costo` DOUBLE NULL,
    ADD COLUMN `ganacia` DOUBLE NULL,
    MODIFY `precio` DOUBLE NULL;

-- DropTable
DROP TABLE `HistorialContabilidad`;
