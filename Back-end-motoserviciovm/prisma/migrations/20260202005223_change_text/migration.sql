/*
  Warnings:

  - You are about to drop the column `logoTitleFirst` on the `texto` table. All the data in the column will be lost.
  - You are about to drop the column `logoTitleSecond` on the `texto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `texto` DROP COLUMN `logoTitleFirst`,
    DROP COLUMN `logoTitleSecond`,
    ADD COLUMN `logoTitle` VARCHAR(191) NULL;
