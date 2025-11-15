/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Permiso` table. All the data in the column will be lost.
  - You are about to drop the column `modulo` on the `Rol` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Permiso` DROP COLUMN `descripcion`,
    ADD COLUMN `modulo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Rol` DROP COLUMN `modulo`,
    ADD COLUMN `descripcion` VARCHAR(191) NULL;
