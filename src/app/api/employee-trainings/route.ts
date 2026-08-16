import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employeeTrainings = await prisma.employeeTraining.findMany({
      include: {
        employee: { select: { id: true, fullName: true, role: true, sector: true, photoUrl: true } },
        training: { select: { id: true, title: true, category: true, hours: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employeeTrainings);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar históricos de treinamentos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, trainingId, status, completionDate, expirationDate, notes } = body;

    if (!employeeId || !trainingId) {
      return NextResponse.json({ error: "Funcionário e Treinamento são obrigatórios" }, { status: 400 });
    }

    const record = await prisma.employeeTraining.create({
      data: {
        employeeId,
        trainingId,
        status: status || "Concluído",
        completionDate: completionDate ? new Date(completionDate) : new Date(),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        notes: notes?.trim() || null,
      },
      include: {
        employee: true,
        training: true,
      }
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar treinamento para o funcionário" }, { status: 500 });
  }
}
