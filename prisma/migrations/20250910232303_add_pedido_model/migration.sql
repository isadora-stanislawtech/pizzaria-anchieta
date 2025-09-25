-- CreateTable
CREATE TABLE "public"."Pedido" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipoProduto" TEXT NOT NULL,
    "tamanho" TEXT,
    "meioMeio" BOOLEAN,
    "sabores" TEXT[],
    "quantidade" INTEGER NOT NULL,
    "bebida" TEXT,
    "volumeMl" INTEGER,
    "tipoPedido" TEXT NOT NULL,
    "enderecoId" TEXT,
    "formaPagamento" TEXT NOT NULL,
    "trocoPara" DOUBLE PRECISION,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "realizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadoEm" TIMESTAMP(3),

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Endereco" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "cep" TEXT NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Endereco" ADD CONSTRAINT "Endereco_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
