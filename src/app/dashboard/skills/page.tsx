import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Wrench, Plus, Award, Star, Filter, CheckCircle } from "lucide-react";
import EmployeeAvatar from "@/components/employees/EmployeeAvatar";
import NewCatalogSkillModal from "@/components/skills/NewCatalogSkillModal";
import EmployeeSkillActions from "@/components/skills/EmployeeSkillActions";

export const dynamic = "force-dynamic";

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const levelFilter = typeof params.level === "string" ? params.level : "";

  // Auto-seed default practical skills if empty
  const existingCount = await prisma.skill.count();
  if (existingCount === 0) {
    const defaultSkills = [
      { name: "Pintura", category: "Acabamento", description: "Pintura residencial, predial e acabamento de finos detalhes" },
      { name: "Revestimento Cerâmico", category: "Acabamento", description: "Assentamento de pisos, porcelanatos e revestimentos de parede" },
      { name: "Redes", category: "Instalações", description: "Infraestrutura de redes de dados, lógica e cabeamento estruturado" },
      { name: "Alvenaria", category: "Construção Civil", description: "Elevação de alvenaria estrutural e vedação" },
      { name: "Instalações Elétricas", category: "Instalações", description: "Instalações elétricas de baixa tensão e passagem de fiação" },
      { name: "Instalações Hidráulicas", category: "Instalações", description: "Montagem de tubulações de água e esgoto" },
    ];
    for (const sk of defaultSkills) {
      await prisma.skill.create({ data: sk }).catch(() => {});
    }
  }

  const [employeeSkills, catalogSkills] = await Promise.all([
    prisma.employeeSkill.findMany({
      where: {
        ...(levelFilter ? { level: levelFilter } : {}),
      },
      include: {
        employee: { select: { id: true, fullName: true, role: true, sector: true, photoUrl: true } },
        skill: { select: { id: true, name: true, category: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.skill.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { employeeSkills: true } } },
    }),
  ]);

  const total = employeeSkills.length;
  const specialistCount = employeeSkills.filter((s) => s.level === "Especialista").length;
  const advancedCount = employeeSkills.filter((s) => s.level === "Avançado").length;
  const intermediateCount = employeeSkills.filter((s) => s.level === "Intermediário" || s.level === "Iniciante").length;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Wrench className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Habilidades Práticas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
            Mapeamento de competências operacionais (Pintura, Revestimento Cerâmico, Redes, etc).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NewCatalogSkillModal />
          <Link
            href="/dashboard/skills/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Registrar Habilidade
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Habilidades</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{total}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Especialistas</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{specialistCount}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avançados</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{advancedCount}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Intermediário / Iniciante</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{intermediateCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar Nível:
          </span>
          {[
            { label: "Todos", value: "" },
            { label: "Especialista", value: "Especialista" },
            { label: "Avançado", value: "Avançado" },
            { label: "Intermediário", value: "Intermediário" },
            { label: "Iniciante", value: "Iniciante" },
          ].map((f) => {
            const isActive = levelFilter === f.value;
            return (
              <Link
                key={f.value}
                href={f.value ? `/dashboard/skills?level=${encodeURIComponent(f.value)}` : "/dashboard/skills"}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 font-medium text-right">
          Catálogo: <span className="font-bold text-slate-700 dark:text-slate-200">{catalogSkills.length} habilidades cadastradas</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Funcionário</th>
                <th className="p-4">Habilidade Prática</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Experiência</th>
                <th className="p-4 text-center">Nível de Domínio</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              {employeeSkills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                    Nenhuma habilidade registrada.
                  </td>
                </tr>
              ) : (
                employeeSkills.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar photoUrl={rec.employee.photoUrl} fullName={rec.employee.fullName} size="sm" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
                            {rec.employee.fullName}
                          </p>
                          <p className="text-xs text-slate-400">{rec.employee.role} - {rec.employee.sector}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{rec.skill.name}</p>
                      {rec.notes && <p className="text-xs text-slate-400 italic mt-0.5">{rec.notes}</p>}
                    </td>

                    <td className="p-4 text-xs">
                      <span className="inline-block font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {rec.skill.category || "Geral"}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {rec.experienceYears ? `${rec.experienceYears} anos` : <span className="text-slate-400 italic">-</span>}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full font-bold ${
                          rec.level === "Especialista"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : rec.level === "Avançado"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : rec.level === "Intermediário"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {rec.level}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <EmployeeSkillActions recordId={rec.id} currentLevel={rec.level} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
