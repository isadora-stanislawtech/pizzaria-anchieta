// src/app/api/clientes/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

// GET /api/clientes
export async function GET() {
  const clientes = await prisma.user.findMany({
    where: { role: "cliente" },
    include: {
      enderecoPrincipal: true,
      pedidos: { orderBy: { realizadoEm: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clientes);
}

// POST /api/clientes
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const { name, email, telefone, password, enderecoId, enderecoPrincipal, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "name e email são obrigatórios" }, { status: 400 });
    }

    // Se não veio password, define um padrão
    const hashed = await bcrypt.hash(password ?? "cliente@123", 10);

    const data: Prisma.UserCreateInput = {
      name,
      email,
      telefone: telefone ?? null,
      password: hashed,
      role: (role ?? "cliente") as any,
    };

    if (typeof enderecoId === "string" && enderecoId.trim().length > 0) {
      (data as any).enderecoPrincipal = { connect: { id: enderecoId } };
    } else if (enderecoPrincipal && typeof enderecoPrincipal === "object") {
      (data as any).enderecoPrincipal = { create: enderecoPrincipal as Prisma.EnderecoCreateInput };
    }

    const user = await prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, telefone: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    // E-mail único → 409
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }
    console.error("POST /api/clientes error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
