-- CreateTable: Crear la tabla Estado primero
CREATE TABLE `Estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Estado_estado_key`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insertar estados por defecto
INSERT INTO `Estado` (`estado`, `createdAt`, `updatedAt`) VALUES 
    ('Activo', NOW(), NOW()),
    ('Inactivo', NOW(), NOW());

-- Obtener el ID del estado "Activo"
SET @estado_activo_id = (SELECT id FROM `Estado` WHERE `estado` = 'Activo' LIMIT 1);

-- AlterTable: Agregar estadoId a Permiso (con datos existentes)
ALTER TABLE `Permiso` ADD COLUMN `estadoId` INTEGER NULL;
UPDATE `Permiso` SET `estadoId` = @estado_activo_id WHERE `estadoId` IS NULL;
ALTER TABLE `Permiso` MODIFY COLUMN `estadoId` INTEGER NOT NULL;

-- AlterTable: Agregar estadoId a Rol (con datos existentes)
ALTER TABLE `Rol` ADD COLUMN `estadoId` INTEGER NULL;
UPDATE `Rol` SET `estadoId` = @estado_activo_id WHERE `estadoId` IS NULL;
ALTER TABLE `Rol` MODIFY COLUMN `estadoId` INTEGER NOT NULL;

-- AlterTable: Agregar estadoId a Sucursal (con datos existentes)
ALTER TABLE `Sucursal` ADD COLUMN `estadoId` INTEGER NULL;
UPDATE `Sucursal` SET `estadoId` = @estado_activo_id WHERE `estadoId` IS NULL;
ALTER TABLE `Sucursal` MODIFY COLUMN `estadoId` INTEGER NOT NULL;

-- AlterTable: Agregar estadoId a User (con datos existentes)
ALTER TABLE `User` ADD COLUMN `estadoId` INTEGER NULL;
UPDATE `User` SET `estadoId` = @estado_activo_id WHERE `estadoId` IS NULL;
ALTER TABLE `User` MODIFY COLUMN `estadoId` INTEGER NOT NULL;

-- CreateTable: Crear las nuevas tablas
CREATE TABLE `Marca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marca` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Linea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `linea` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cilindrada` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cilindrada` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modelo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `año` INTEGER NOT NULL,
    `marcaId` INTEGER NOT NULL,
    `lineaId` INTEGER NOT NULL,
    `cilindradaId` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Moto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placa` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `modeloId` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Moto_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserMotos` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserMotos_AB_unique`(`A`, `B`),
    INDEX `_UserMotos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: Agregar foreign keys para las tablas existentes
ALTER TABLE `Permiso` ADD CONSTRAINT `Permiso_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Rol` ADD CONSTRAINT `Rol_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Sucursal` ADD CONSTRAINT `Sucursal_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `User` ADD CONSTRAINT `User_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: Agregar foreign keys para las nuevas tablas
ALTER TABLE `Marca` ADD CONSTRAINT `Marca_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Linea` ADD CONSTRAINT `Linea_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Cilindrada` ADD CONSTRAINT `Cilindrada_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Modelo` ADD CONSTRAINT `Modelo_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `Marca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Modelo` ADD CONSTRAINT `Modelo_lineaId_fkey` FOREIGN KEY (`lineaId`) REFERENCES `Linea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Modelo` ADD CONSTRAINT `Modelo_cilindradaId_fkey` FOREIGN KEY (`cilindradaId`) REFERENCES `Cilindrada`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Modelo` ADD CONSTRAINT `Modelo_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Moto` ADD CONSTRAINT `Moto_modeloId_fkey` FOREIGN KEY (`modeloId`) REFERENCES `Modelo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Moto` ADD CONSTRAINT `Moto_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `_UserMotos` ADD CONSTRAINT `_UserMotos_A_fkey` FOREIGN KEY (`A`) REFERENCES `Moto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_UserMotos` ADD CONSTRAINT `_UserMotos_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
