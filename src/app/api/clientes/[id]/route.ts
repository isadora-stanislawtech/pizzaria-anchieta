import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Atualizar cliente
export async function PATCH(req: Request, context: unknown) {
  const ctx = context as { params?: { id?: string } } | undefined;
  const id = ctx?.params?.id;
  if (!id) return NextResponse.json({ error: 'id faltando' }, { status: 400 });
  const body = await req.json();
  const cliente = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      telefone: body.telefone,
      enderecoPrincipal: body.enderecoId ? { connect: { id: body.enderecoId } } : undefined,
    },
  });
  return NextResponse.json(cliente);
}

// Deletar cliente
export async function DELETE(req: Request, context: unknown) {
  const ctx = context as { params?: { id?: string } } | undefined;
  const id = ctx?.params?.id;
  if (!id) return NextResponse.json({ error: 'id faltando' }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
