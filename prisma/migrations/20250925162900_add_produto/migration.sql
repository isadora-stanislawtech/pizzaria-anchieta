-- CreateTable
CREATE TABLE "public"."Produto" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "imagem" TEXT,
    "tamanho" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);
