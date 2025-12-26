/*
  Warnings:

  - You are about to drop the column `tipo` on the `IngresosEgresos` table. All the data in the column will be lost.
  - Added the required column `estadoId` to the `HistorialContabilidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sucursalId` to the `HistorialContabilidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoId` to the `IngresosEgresos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sucursalId` to the `IngresosEgresos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoId` to the `IngresosEgresos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EnParqueo` ADD COLUMN `sucursalId` INTEGER NULL;

-- AlterTable
ALTER TABLE `EnReparacion` ADD COLUMN `sucursalId` INTEGER NULL;

-- AlterTable
ALTER TABLE `HistorialContabilidad` ADD COLUMN `estadoId` INTEGER NOT NULL,
    ADD COLUMN `sucursalId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `IngresosEgresos` DROP COLUMN `tipo`,
    ADD COLUMN `estadoId` INTEGER NOT NULL,
    ADD COLUMN `sucursalId` INTEGER NOT NULL,
    ADD COLUMN `tipoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `RepuestosReparacion` ADD COLUMN `sucursalId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Venta` ADD COLUMN `sucursalId` INTEGER NULL;

-- AlterTable
ALTER TABLE `VentaProducto` ADD COLUMN `precio` INTEGER NULL;

-- CreateTable
CREATE TABLE `TipoContabilidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnParqueo` ADD CONSTRAINT `EnParqueo_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnReparacion` ADD CONSTRAINT `EnReparacion_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepuestosReparacion` ADD CONSTRAINT `RepuestosReparacion_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngresosEgresos` ADD CONSTRAINT `IngresosEgresos_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `TipoContabilidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngresosEgresos` ADD CONSTRAINT `IngresosEgresos_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngresosEgresos` ADD CONSTRAINT `IngresosEgresos_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialContabilidad` ADD CONSTRAINT `HistorialContabilidad_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialContabilidad` ADD CONSTRAINT `HistorialContabilidad_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
