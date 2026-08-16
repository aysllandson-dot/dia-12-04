import { prisma } from "@/lib/prisma";
import NewEmployeeSkillForm from "@/components/skills/NewEmployeeSkillForm";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewEmployeeSkillPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialEmployeeId = typeof params.employeeId === "string" ? params.employeeId : "";

  const [employees, catalogSkills] = await Promise.all([
    prisma.employee.findMany({
      where: { status: "Ativo" },
      select: { id: true, fullName: true, role: true, sector: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.skill.findMany({
      select: { id: true, name: true, category: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/skills"
          className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Registrar Habilidade Prática
          </h1>
          <p className="text-xs text-slate-400">Atribua uma competência prática a um funcionário</p>
        </div>
      </div>

      <NewEmployeeSkillForm
        employees={employees}
        catalogSkills={catalogSkills}
        initialEmployeeId={initialEmployeeId}
      />
    </div>
  );
}
