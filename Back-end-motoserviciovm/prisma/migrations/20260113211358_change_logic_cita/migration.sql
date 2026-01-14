/*
  Warnings:

  - You are about to drop the column `tipoServicioHorarioId` on the `HorasDisponible` table. All the data in the column will be lost.
  - You are about to drop the `_DiasDisponible_TipoServicioHorario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipoServicioHorarioDiaId` to the `HorasDisponible` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HorasDisponible` DROP FOREIGN KEY `HorasDisponible_tipoServicioHorarioId_fkey`;

-- DropForeignKey
ALTER TABLE `_DiasDisponible_TipoServicioHorario` DROP FOREIGN KEY `_DiasDisponible_TipoServicioHorario_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DiasDisponible_TipoServicioHorario` DROP FOREIGN KEY `_DiasDisponible_TipoServicioHorario_B_fkey`;

-- DropIndex
DROP INDEX `HorasDisponible_tipoServicioHorarioId_fkey` ON `HorasDisponible`;

-- AlterTable
ALTER TABLE `HorasDisponible` DROP COLUMN `tipoServicioHorarioId`,
    ADD COLUMN `tipoServicioHorarioDiaId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_DiasDisponible_TipoServicioHorario`;

-- CreateTable
CREATE TABLE `TipoServicioHorarioDia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoServicioHorarioId` INTEGER NOT NULL,
    `diaId` INTEGER NOT NULL,
    `cantidadPersonal` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TipoServicioHorarioDia_tipoServicioHorarioId_diaId_key`(`tipoServicioHorarioId`, `diaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HorasDisponible` ADD CONSTRAINT `HorasDisponible_tipoServicioHorarioDiaId_fkey` FOREIGN KEY (`tipoServicioHorarioDiaId`) REFERENCES `TipoServicioHorarioDia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoServicioHorarioDia` ADD CONSTRAINT `TipoServicioHorarioDia_tipoServicioHorarioId_fkey` FOREIGN KEY (`tipoServicioHorarioId`) REFERENCES `TipoServicioHorario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoServicioHorarioDia` ADD CONSTRAINT `TipoServicioHorarioDia_diaId_fkey` FOREIGN KEY (`diaId`) REFERENCES `DiasDisponible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
