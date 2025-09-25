// API para cadastro de cliente
// Recebe nome, email, senha
// Retorna sucesso ou erro
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { nome, email, senha, role } = req.body;
  // role: 'cliente' ou 'admin' (default: 'cliente')
  try {
    const hash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: {
        name: nome,
        email,
        password: hash,
        role: role || 'cliente',
      },
    });
    res.status(201).json({ sucesso: true, user });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ sucesso: false, erro: errorMsg });
  }
}
