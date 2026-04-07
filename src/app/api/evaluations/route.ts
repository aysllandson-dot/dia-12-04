import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluationSchema } from "@/lib/validations/evaluation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = evaluationSchema.parse(body);

    const average = (
      validatedData.punctuality +
      validatedData.organization +
      validatedData.knowledge +
      validatedData.proactivity +
      validatedData.commitment
    ) / 5;

    const evaluation = await prisma.evaluation.create({
      data: {
        employeeId: validatedData.employeeId,
        supervisorId: (session.user as any).id,
        punctuality: validatedData.punctuality,
        punctualityComment: validatedData.punctualityComment || null,
        organization: validatedData.organization,
        organizationComment: validatedData.organizationComment || null,
        knowledge: validatedData.knowledge,
        knowledgeComment: validatedData.knowledgeComment || null,
        proactivity: validatedData.proactivity,
        proactivityComment: validatedData.proactivityComment || null,
        commitment: validatedData.commitment,
        commitmentComment: validatedData.commitmentComment || null,
        average,
      },
    });

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro interno no servidor ao registrar avaliação" },
      { status: 500 }
    );
  }
}
