import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validations/employee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        team: true,
        evaluations: true,
        comments: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar funcionário" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = employeeSchema.parse(body);

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        fullName: validatedData.fullName,
        gender: validatedData.gender,
        role: validatedData.role,
        sector: validatedData.sector,
        status: validatedData.status,
        obra: (validatedData.obra || null) as any,
        birthDate: (validatedData.birthDate ? new Date(validatedData.birthDate) : null) as any,
        cpf: (validatedData.cpf ? validatedData.cpf.replace(/\D/g, "") : null) as any,
        phone: (validatedData.phone || null) as any,
        email: (validatedData.email || null) as any,
        street: (validatedData.street || null) as any,
        number: (validatedData.number || null) as any,
        neighborhood: (validatedData.neighborhood || null) as any,
        city: (validatedData.city || null) as any,
        state: (validatedData.state || null) as any,
        zipCode: (validatedData.zipCode || null) as any,
        admissionDate: (validatedData.admissionDate ? new Date(validatedData.admissionDate) : null) as any,
        photoUrl: (validatedData.photoUrl || null) as any,
      },
    });

    return NextResponse.json(employee);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar funcionário" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // Optional: Only allow ADMIN to delete
    // if (!session || (session.user as any).role !== "ADMIN") {
    //   return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    // }

    console.log(`Tentando excluir funcionário: ${id}`);

    // Check if employee exists
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    console.log(`Funcionário ${id} excluído com sucesso`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao excluir funcionário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir funcionário: " + (error.message || "Erro desconhecido") }, 
      { status: 500 }
    );
  }
}
