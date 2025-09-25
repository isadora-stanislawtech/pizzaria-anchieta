export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma';

// Listar clientes
export async function GET() {
  const clientes = await prisma.user.findMany({
    where: { role: 'cliente' },
    include: {
      enderecoPrincipal: true,
      pedidos: { orderBy: { realizadoEm: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(clientes);
}

// Criar cliente
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, telefone, password, enderecoPrincipal, role } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'name, email and password are required' }), { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Build user create data. Only include enderecoPrincipal when it's a nested object with address fields
    const createData: Prisma.UserCreateInput = {
      name,
      email,
      telefone: telefone ?? null,
      password: hashed,
      role: role ?? 'cliente',
    };

    // If enderecoPrincipal is an object (with rua, bairro, numero, cep, etc.), create nested address
    if (enderecoPrincipal && typeof enderecoPrincipal === 'object') {
      // cast to Prisma Endereco nested create input
      type EnderecoNested = Prisma.UserCreateInput['enderecoPrincipal'];
      (createData as Prisma.UserCreateInput).enderecoPrincipal = { create: enderecoPrincipal as Prisma.EnderecoCreateInput } as EnderecoNested;
    }

    const user = await prisma.user.create({ data: createData });

    return new Response(JSON.stringify({ user }), { status: 201 });
  } catch (err: unknown) {
    console.error('POST /api/clientes error', err);
    // Se for erro de validação do Prisma (P2002), retorne 400 com mensagem clara
    if (typeof err === 'object' && err !== null) {
      const e = err as { code?: string };
      if (e.code === 'P2002') {
        return new Response(JSON.stringify({ error: 'Registro duplicado' }), { status: 400 });
      }
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
