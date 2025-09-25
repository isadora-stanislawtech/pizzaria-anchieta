import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

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

// Buscar pedido por id
export async function GET(req: Request, context: unknown) {
  const ctx = context as { params?: { id?: string } } | undefined;
  const id = ctx?.params?.id;
  if (!id) return NextResponse.json({ erro: 'id faltando' }, { status: 400 });
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { cliente: true, endereco: true },
  });
  if (!pedido) return NextResponse.json({ erro: 'Pedido não encontrado' }, { status: 404 });
  return NextResponse.json(pedido);
}

// Atualizar status do pedido
export async function PATCH(req: Request, context: unknown) {
  const ctx = context as { params?: { id?: string } } | undefined;
  const id = ctx?.params?.id;
  if (!id) return NextResponse.json({ erro: 'id faltando' }, { status: 400 });
  const body = await req.json();
  // Permite atualizar qualquer campo do pedido, mas normalmente só status/finalizadoEm
  const pedido = await prisma.pedido.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.finalizadoEm && { finalizadoEm: body.finalizadoEm }),
      // Adicione outros campos se necessário
    },
  });
  // Criar notificação para o cliente quando o status mudar
  if (body.status) {
    await addNotification(pedido.clienteId, 'Atualização de pedido', `Seu pedido ${pedido.id} agora está: ${body.status}`);
  }
  return NextResponse.json(pedido);
}
