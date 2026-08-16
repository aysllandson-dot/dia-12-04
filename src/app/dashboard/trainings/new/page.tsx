import { prisma } from "@/lib/prisma";
import NewEmployeeTrainingForm from "@/components/trainings/NewEmployeeTrainingForm";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewEmployeeTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialEmployeeId = typeof params.employeeId === "string" ? params.employeeId : "";

  const [employees, catalogTrainings] = await Promise.all([
    prisma.employee.findMany({
      where: { status: "Ativo" },
      select: { id: true, fullName: true, role: true, sector: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.training.findMany({
      select: { id: true, title: true, category: true, hours: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/trainings"
          className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
            Registrar Treinamento
          </h1>
          <p className="text-xs text-slate-400">Vincule um curso ou habilidade a um funcionário</p>
        </div>
      </div>

      <NewEmployeeTrainingForm
        employees={employees}
        catalogTrainings={catalogTrainings}
        initialEmployeeId={initialEmployeeId}
      />
    </div>
  );
}
