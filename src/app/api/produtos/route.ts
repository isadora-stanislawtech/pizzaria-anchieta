import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const produtos = await prisma.produto.findMany({ orderBy: { criadoEm: 'desc' } });
  return NextResponse.json(produtos);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, descricao, imagem, tamanho, preco, preco4, preco8 } = body;
    const categoria = body.categoria || 'outros';
    if (!titulo) {
      return NextResponse.json({ error: 'titulo é obrigatório' }, { status: 400 });
    }

    // For pizzas, require preco4 and preco8
    if (categoria === 'pizza') {
      if (preco4 == null || preco8 == null) {
        return NextResponse.json({ error: 'para pizzas, preco4 e preco8 são obrigatórios' }, { status: 400 });
      }
    } else {
      // For non-pizzas keep preco required
      if (preco == null) {
        return NextResponse.json({ error: 'preco é obrigatório para este tipo de produto' }, { status: 400 });
      }
    }

    const data: any = {
      categoria,
      titulo,
      descricao: descricao || '',
      imagem: imagem || '',
      tamanho: tamanho || '',
    };
    if (categoria === 'pizza') {
      data.preco4 = Number(preco4);
      data.preco8 = Number(preco8);
      data.preco = null;
    } else {
      data.preco = Number(preco);
    }

    const produto = await prisma.produto.create({ data });
    return NextResponse.json(produto);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
    await prisma.produto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
