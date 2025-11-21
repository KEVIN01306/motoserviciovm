/*
  Warnings:

  - A unique constraint covering the columns `[modelo]` on the table `Modelo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modelo` to the `Modelo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Modelo` ADD COLUMN `modelo` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Modelo_modelo_key` ON `Modelo`(`modelo`);
