/*
  Warnings:

  - A unique constraint covering the columns `[cilindrada]` on the table `Cilindrada` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linea]` on the table `Linea` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[marca]` on the table `Marca` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cilindrada_cilindrada_key` ON `Cilindrada`(`cilindrada`);

-- CreateIndex
CREATE UNIQUE INDEX `Linea_linea_key` ON `Linea`(`linea`);

-- CreateIndex
CREATE UNIQUE INDEX `Marca_marca_key` ON `Marca`(`marca`);
