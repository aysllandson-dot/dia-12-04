import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.employeeSkill.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir registro de habilidade" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { level, experienceYears, notes } = body;

    const updated = await prisma.employeeSkill.update({
      where: { id },
      data: {
        level,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : undefined,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar habilidade" }, { status: 500 });
  }
}
