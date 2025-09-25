import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  // return notifications that are broadcast (userId null) or belong to the user
  const notifs = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: null },
        { userId: userId || undefined },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(notifs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, message } = body;
    if (!title || !message) return NextResponse.json({ error: 'Campos faltando' }, { status: 400 });
    const novo = await prisma.notification.create({ data: { userId: userId || null, title, message } });
    return NextResponse.json(novo, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
