-- AlterTable
ALTER TABLE `Servicio` MODIFY `fechaSalida` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `IngresosEgresos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `monto` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialContabilidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalIngresos` DOUBLE NOT NULL,
    `totalEgresos` DOUBLE NOT NULL,
    `totalServicios` DOUBLE NOT NULL,
    `totalVentas` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
