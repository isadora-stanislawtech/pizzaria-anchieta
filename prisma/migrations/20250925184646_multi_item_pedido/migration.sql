/*
  Warnings:

  - You are about to drop the column `bebida` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `meioMeio` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `sabores` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `tamanho` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `tipoProduto` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `volumeMl` on the `Pedido` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Pedido" DROP COLUMN "bebida",
DROP COLUMN "meioMeio",
DROP COLUMN "quantidade",
DROP COLUMN "sabores",
DROP COLUMN "tamanho",
DROP COLUMN "tipoProduto",
DROP COLUMN "volumeMl";

-- CreateTable
CREATE TABLE "public"."PedidoItem" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "tipoProduto" TEXT NOT NULL,
    "tamanho" TEXT,
    "meioMeio" BOOLEAN,
    "sabores" TEXT[],
    "bebida" TEXT,
    "volumeMl" INTEGER,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
