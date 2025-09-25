import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rua, bairro, numero, complemento, cep } = body;
    if (!rua || !bairro || !numero || !cep) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }
    const endereco = await prisma.endereco.create({
      data: {
        rua,
        bairro,
        numero,
        complemento,
        cep,
      },
    });
    return NextResponse.json(endereco);
  } catch {
    return NextResponse.json({ error: 'Erro ao criar endereço.' }, { status: 500 });
  }
}
