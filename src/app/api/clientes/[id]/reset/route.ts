import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Resetar senha do cliente para padrão
export async function POST(req: Request, context: unknown) {
  const ctx = context as { params?: { id?: string } } | undefined;
  const id = ctx?.params?.id;
  if (!id) return NextResponse.json({ error: 'id faltando' }, { status: 400 });
  const senhaPadrao = await bcrypt.hash('cliente@123', 10);
  await prisma.user.update({
    where: { id },
    data: { password: senhaPadrao },
  });
  return NextResponse.json({ ok: true });
}
