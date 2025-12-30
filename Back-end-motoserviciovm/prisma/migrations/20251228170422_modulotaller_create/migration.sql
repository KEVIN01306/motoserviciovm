-- AlterTable
ALTER TABLE `IngresosEgresos` ADD COLUMN `moduloTallerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ModuloTaller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modulo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ModuloTaller_modulo_key`(`modulo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IngresosEgresos` ADD CONSTRAINT `IngresosEgresos_moduloTallerId_fkey` FOREIGN KEY (`moduloTallerId`) REFERENCES `ModuloTaller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
