import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: { title: "asc" },
      include: {
        _count: {
          select: { employeeTrainings: true }
        }
      }
    });

    return NextResponse.json(trainings);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar treinamentos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, hours } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Título do treinamento é obrigatório" }, { status: 400 });
    }

    const newTraining = await prisma.training.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category?.trim() || "Geral",
        hours: hours ? parseInt(hours, 10) : null,
      },
    });

    return NextResponse.json(newTraining, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um treinamento cadastrado com esse título" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar treinamento" }, { status: 500 });
  }
}
