/*
  Warnings:

  - Added the required column `descripcion` to the `Permiso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modulo` to the `Rol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Permiso` ADD COLUMN `descripcion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Rol` ADD COLUMN `modulo` VARCHAR(191) NOT NULL;
