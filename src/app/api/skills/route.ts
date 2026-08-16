import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { employeeSkills: true }
        }
      }
    });

    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar catálogo de habilidades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Nome da habilidade é obrigatório" }, { status: 400 });
    }

    const newSkill = await prisma.skill.create({
      data: {
        name: name.trim(),
        category: category?.trim() || "Prática / Operacional",
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe uma habilidade cadastrada com esse nome" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao cadastrar habilidade" }, { status: 500 });
  }
}
