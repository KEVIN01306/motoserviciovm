-- AlterTable
ALTER TABLE `Servicio` ADD COLUMN `kilometrajeProximoServicio` INTEGER NULL;

-- AlterTable
ALTER TABLE `Venta` ADD COLUMN `descuentoTotal` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `VentaProducto` ADD COLUMN `descuento` BOOLEAN NULL;

-- CreateTable
CREATE TABLE `ServicioProductoProximo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServicioProductoProximo` ADD CONSTRAINT `ServicioProductoProximo_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
