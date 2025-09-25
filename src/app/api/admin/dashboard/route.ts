import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  // Busca dados reais do banco
  // Ajuste os modelos conforme a estrutura de pedidos/clientes
  const pizzasVendidas = await prisma.pedido.count();
  const clientesAtivos = await prisma.user.count({ where: { role: 'cliente' } });
  // Soma do valor total dos pedidos
  const valorFaturado = await prisma.pedido.aggregate({ _sum: { valorTotal: true } });
  // Busca todos os itens de pizza e conta sabores
  const itensPizza = await prisma.pedidoItem.findMany({
    where: { tipoProduto: 'pizza' },
    select: { sabores: true, quantidade: true },
  });
  const saborCount: Record<string, number> = {};
  for (const item of itensPizza) {
    for (const sabor of item.sabores) {
      saborCount[sabor] = (saborCount[sabor] || 0) + (item.quantidade || 1);
    }
  }
  const saborMaisPedido = Object.entries(saborCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return NextResponse.json({
    pizzasVendidas,
    clientesAtivos,
    saborMaisPedido,
    valorFaturado: valorFaturado._sum?.valorTotal || 0,
  });
}
