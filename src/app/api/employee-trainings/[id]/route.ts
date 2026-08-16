import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.employeeTraining.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir registro de treinamento" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, completionDate, expirationDate, notes } = body;

    const updated = await prisma.employeeTraining.update({
      where: { id },
      data: {
        status,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar registro de treinamento" }, { status: 500 });
  }
}
