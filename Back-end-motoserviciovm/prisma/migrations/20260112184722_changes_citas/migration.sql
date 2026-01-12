/*
  Warnings:

  - Added the required column `horaCita` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoServicioId` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Cita` DROP FOREIGN KEY `Cita_motoId_fkey`;

-- AlterTable
ALTER TABLE `Cita` ADD COLUMN `horaCita` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipoServicioId` INTEGER NOT NULL,
    MODIFY `motoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `TipoServicio` ADD COLUMN `tipoHorarioId` INTEGER NULL;

-- CreateTable
CREATE TABLE `HorasDisponible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horaInicio` VARCHAR(191) NOT NULL,
    `horaFin` VARCHAR(191) NOT NULL,
    `tipoServicioHorarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiasDisponible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia` VARCHAR(191) NOT NULL,
    `tipoServicioHorarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoServicioHorario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidadPersonal` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `fechaVijencia` DATETIME(3) NULL,
    `tipoHorarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoHorario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TipoHorario_tipo_key`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TipoServicio` ADD CONSTRAINT `TipoServicio_tipoHorarioId_fkey` FOREIGN KEY (`tipoHorarioId`) REFERENCES `TipoServicioHorario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_tipoServicioId_fkey` FOREIGN KEY (`tipoServicioId`) REFERENCES `TipoServicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_motoId_fkey` FOREIGN KEY (`motoId`) REFERENCES `Moto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HorasDisponible` ADD CONSTRAINT `HorasDisponible_tipoServicioHorarioId_fkey` FOREIGN KEY (`tipoServicioHorarioId`) REFERENCES `TipoServicioHorario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiasDisponible` ADD CONSTRAINT `DiasDisponible_tipoServicioHorarioId_fkey` FOREIGN KEY (`tipoServicioHorarioId`) REFERENCES `TipoServicioHorario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoServicioHorario` ADD CONSTRAINT `TipoServicioHorario_tipoHorarioId_fkey` FOREIGN KEY (`tipoHorarioId`) REFERENCES `TipoHorario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoServicioHorario` ADD CONSTRAINT `TipoServicioHorario_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
