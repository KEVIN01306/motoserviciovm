/*
  Warnings:

  - You are about to drop the column `kilimetraje` on the `Servicio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Servicio` DROP COLUMN `kilimetraje`,
    ADD COLUMN `kilometraje` INTEGER NULL;
