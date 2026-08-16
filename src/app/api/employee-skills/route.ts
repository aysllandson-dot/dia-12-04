import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employeeSkills = await prisma.employeeSkill.findMany({
      include: {
        employee: { select: { id: true, fullName: true, role: true, sector: true, photoUrl: true } },
        skill: { select: { id: true, name: true, category: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employeeSkills);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar habilidades dos funcionários" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, skillId, level, experienceYears, notes } = body;

    if (!employeeId || !skillId) {
      return NextResponse.json({ error: "Funcionário e Habilidade são obrigatórios" }, { status: 400 });
    }

    const record = await prisma.employeeSkill.create({
      data: {
        employeeId,
        skillId,
        level: level || "Intermediário",
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
        notes: notes?.trim() || null,
      },
      include: {
        employee: true,
        skill: true,
      }
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar habilidade para o funcionário" }, { status: 500 });
  }
}
