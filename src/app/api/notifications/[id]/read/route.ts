import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: Record<string, string> } // 👈 aqui
) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Parâmetro 'id' ausente" }, { status: 400 });
  }

  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/notifications/[id]/read:", err);
    return NextResponse.json({ error: "Erro ao marcar como lida" }, { status: 500 });
  }
}
