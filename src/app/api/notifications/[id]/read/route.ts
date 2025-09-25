import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Parâmetro 'id' ausente" }, { status: 400 });
  }

  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao marcar como lida" }, { status: 500 });
  }
}
