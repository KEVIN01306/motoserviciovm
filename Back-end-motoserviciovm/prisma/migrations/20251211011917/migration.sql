/*
  Warnings:

  - You are about to drop the `_VentaProductos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `costo` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_VentaProductos` DROP FOREIGN KEY `_VentaProductos_A_fkey`;

-- DropForeignKey
ALTER TABLE `_VentaProductos` DROP FOREIGN KEY `_VentaProductos_B_fkey`;

-- AlterTable
ALTER TABLE `Producto` ADD COLUMN `costo` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `_VentaProductos`;

-- CreateTable
CREATE TABLE `VentaProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ventaId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `totalProducto` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VentaProducto_ventaId_productoId_key`(`ventaId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VentaProducto` ADD CONSTRAINT `VentaProducto_ventaId_fkey` FOREIGN KEY (`ventaId`) REFERENCES `Venta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentaProducto` ADD CONSTRAINT `VentaProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
