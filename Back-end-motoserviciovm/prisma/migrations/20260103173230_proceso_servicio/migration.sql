-- AlterTable
ALTER TABLE `Modelo` ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Moto` ADD COLUMN `calcomania` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ServicioOpcionesTipoServicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicioId` INTEGER NOT NULL,
    `opcionServicioId` INTEGER NOT NULL,
    `checked` BOOLEAN NOT NULL DEFAULT false,
    `observaciones` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServicioOpcionesTipoServicio_servicioId_opcionServicioId_key`(`servicioId`, `opcionServicioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServicioOpcionesTipoServicio` ADD CONSTRAINT `ServicioOpcionesTipoServicio_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicioOpcionesTipoServicio` ADD CONSTRAINT `ServicioOpcionesTipoServicio_opcionServicioId_fkey` FOREIGN KEY (`opcionServicioId`) REFERENCES `OpcionServicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
