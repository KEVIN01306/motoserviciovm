/*
  Warnings:

  - You are about to drop the column `tipoServicioHorarioId` on the `DiasDisponible` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `DiasDisponible` DROP FOREIGN KEY `DiasDisponible_tipoServicioHorarioId_fkey`;

-- DropIndex
DROP INDEX `DiasDisponible_tipoServicioHorarioId_fkey` ON `DiasDisponible`;

-- AlterTable
ALTER TABLE `DiasDisponible` DROP COLUMN `tipoServicioHorarioId`;

-- CreateTable
CREATE TABLE `_DiasDisponible_TipoServicioHorario` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiasDisponible_TipoServicioHorario_AB_unique`(`A`, `B`),
    INDEX `_DiasDisponible_TipoServicioHorario_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DiasDisponible_TipoServicioHorario` ADD CONSTRAINT `_DiasDisponible_TipoServicioHorario_A_fkey` FOREIGN KEY (`A`) REFERENCES `DiasDisponible`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiasDisponible_TipoServicioHorario` ADD CONSTRAINT `_DiasDisponible_TipoServicioHorario_B_fkey` FOREIGN KEY (`B`) REFERENCES `TipoServicioHorario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
