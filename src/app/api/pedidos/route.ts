import { promises as fs } from 'fs';
import path from 'path';
const NOTIF_PATH = path.resolve(process.cwd(), 'src', 'data', 'notifications.json');
async function addNotification(userId: string | null, title: string, message: string) {
  try {
    const raw = await fs.readFile(NOTIF_PATH, 'utf8').catch(() => '[]');
    const arr = JSON.parse(raw);
    const novo = { id: (Math.random()+1).toString(36).substring(2,9), userId: userId || null, title, message, read: false, createdAt: new Date().toISOString() };
    arr.unshift(novo);
    await fs.mkdir(path.dirname(NOTIF_PATH), { recursive: true });
    await fs.writeFile(NOTIF_PATH, JSON.stringify(arr, null, 2), 'utf8');
  } catch { /* ignore errors */ }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type PedidoItemBody = {
  tipoProduto: string;
  tamanho?: string | null;
  meioMeio?: boolean;
  sabores?: string[];
  bebida?: string | null;
  volumeMl?: number | null;
  quantidade: number;
};

type PedidoBody = {
  clienteId: string;
  itens: PedidoItemBody[];
  tipoPedido: string; // 'delivery' | 'retirada'
  enderecoId?: string | null;
  endereco?: { rua: string; bairro: string; numero: string; complemento?: string; cep: string } | null;
  formaPagamento: string;
  trocoPara?: number | null;
  valorTotal?: number;
};

// Listar pedidos
export async function GET() {
  const pedidos = await prisma.pedido.findMany({
    include: {
      cliente: true,
      endereco: true,
      itens: true,
    },
    orderBy: { realizadoEm: 'desc' },
  });
  return NextResponse.json(pedidos);
}

// Criar pedido
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PedidoBody;
    // Basic validation
    if (!body.clienteId || !body.tipoPedido || !body.formaPagamento) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // If delivery and an endereco object is provided, create the Endereco and use its id
    let enderecoId: string | null = body.enderecoId ?? null;
    if (body.tipoPedido === 'delivery') {
      if (!enderecoId) {
        const e = body.endereco;
        if (!e || !e.rua || !e.bairro || !e.numero || !e.cep) {
          return NextResponse.json({ error: 'Endereço incompleto para delivery' }, { status: 400 });
        }
        const novo = await prisma.endereco.create({
          data: {
            rua: e.rua,
            bairro: e.bairro,
            numero: e.numero,
            complemento: e.complemento || null,
            cep: e.cep,
            usuarioId: body.clienteId,
          },
        });
        enderecoId = novo.id;
      }
    }

    // Build create data
    const data = {
      clienteId: body.clienteId,
      tipoPedido: body.tipoPedido,
      enderecoId: enderecoId,
      formaPagamento: body.formaPagamento,
      trocoPara: body.trocoPara ?? null,
      valorTotal: body.valorTotal ?? 0,
      itens: {
        create: body.itens.map(item => ({
          tipoProduto: item.tipoProduto,
          tamanho: item.tamanho || null,
          meioMeio: item.meioMeio ?? false,
          sabores: item.sabores ?? [],
          bebida: item.bebida ?? null,
          volumeMl: item.volumeMl ?? null,
          quantidade: item.quantidade,
        })),
      },
    } as const;

    const pedido = await prisma.pedido.create({
      data,
      include: { itens: true },
    });

    // Notificação para o cliente
    await addNotification(
      pedido.clienteId,
      'Pedido realizado',
      `Seu pedido #${pedido.id} foi realizado com sucesso!`
    );
    // Notificação para admin (userId null = broadcast)
    await addNotification(
      null,
      'Novo pedido',
      `Novo pedido recebido!`
    );

    // create a broadcast notification for admins in o DB também
    try {
      await prisma.notification.create({ data: { userId: null, title: 'Novo pedido', message: `Pedido ${pedido.id} realizado` } });
    } catch (e) {
      console.warn('Falha ao criar notificação DB', e);
    }

    return NextResponse.json(pedido, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
