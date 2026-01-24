-- DropForeignKey
ALTER TABLE `Moto` DROP FOREIGN KEY `Moto_modeloId_fkey`;

-- AlterTable
ALTER TABLE `Moto` MODIFY `modeloId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Venta` ADD COLUMN `reparacionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Moto` ADD CONSTRAINT `Moto_modeloId_fkey` FOREIGN KEY (`modeloId`) REFERENCES `Modelo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_reparacionId_fkey` FOREIGN KEY (`reparacionId`) REFERENCES `EnReparacion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
