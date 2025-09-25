/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Endereco` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enderecoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Endereco" DROP CONSTRAINT "Endereco_clienteId_fkey";

-- AlterTable
ALTER TABLE "public"."Endereco" DROP COLUMN "clienteId",
ADD COLUMN     "usuarioId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "enderecoId" TEXT,
ADD COLUMN     "telefone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_enderecoId_key" ON "public"."User"("enderecoId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Endereco" ADD CONSTRAINT "Endereco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
