-- DropForeignKey
ALTER TABLE `TipoServicio` DROP FOREIGN KEY `TipoServicio_tipoHorarioId_fkey`;

-- DropIndex
DROP INDEX `TipoServicio_tipoHorarioId_fkey` ON `TipoServicio`;

-- AddForeignKey
ALTER TABLE `TipoServicio` ADD CONSTRAINT `TipoServicio_tipoHorarioId_fkey` FOREIGN KEY (`tipoHorarioId`) REFERENCES `TipoHorario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
