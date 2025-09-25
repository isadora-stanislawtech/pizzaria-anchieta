// Consolidated login handler: returns public user object (no password)
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, senha } = (await req.json()) as { email?: string; senha?: string };

    if (!email || !senha) {
      return NextResponse.json({ sucesso: false, erro: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, password: true, role: true } });
    if (!user) {
      return NextResponse.json({ sucesso: false, erro: 'Usuário não encontrado' }, { status: 401 });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.password);
    if (!senhaCorreta) {
      return NextResponse.json({ sucesso: false, erro: 'Senha incorreta' }, { status: 401 });
    }

    const publicUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return NextResponse.json({ sucesso: true, user: publicUser }, { status: 200 });
  } catch (err) {
    console.error('Erro no login:', err);
    return NextResponse.json({ sucesso: false, erro: 'Erro interno do servidor' }, { status: 500 });
  }
}
