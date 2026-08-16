import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GraduationCap, Plus, CheckCircle2, Clock, AlertTriangle, XCircle, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import EmployeeAvatar from "@/components/employees/EmployeeAvatar";
import NewCatalogTrainingModal from "@/components/trainings/NewCatalogTrainingModal";
import EmployeeTrainingActions from "@/components/trainings/EmployeeTrainingActions";

export const dynamic = "force-dynamic";

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const statusFilter = typeof params.status === "string" ? params.status : "";

  const [employeeTrainings, catalogTrainings] = await Promise.all([
    prisma.employeeTraining.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      include: {
        employee: { select: { id: true, fullName: true, role: true, sector: true, photoUrl: true } },
        training: { select: { id: true, title: true, category: true, hours: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.training.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { employeeTrainings: true } } },
    }),
  ]);

  const total = employeeTrainings.length;
  const completedCount = employeeTrainings.filter((t) => t.status === "Concluído").length;
  const inProgressCount = employeeTrainings.filter((t) => t.status === "Em Andamento" || t.status === "Pendente").length;
  const expiredCount = employeeTrainings.filter((t) => t.status === "Vencido").length;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[var(--color-primary)]" />
            Treinamentos & Habilidades
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
            Gestão de capacitações, certificações e habilidades da equipe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NewCatalogTrainingModal />
          <Link
            href="/dashboard/trainings/new"
            className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg font-medium transition-all flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Registrar Treinamento
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrados</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{total}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Concluídos</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{completedCount}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Em Andamento / Pendente</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{inProgressCount}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vencidos / Reciclagem</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{expiredCount}</p>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          {[
            { label: "Todos", value: "" },
            { label: "Concluído", value: "Concluído" },
            { label: "Em Andamento", value: "Em Andamento" },
            { label: "Pendente", value: "Pendente" },
            { label: "Vencido", value: "Vencido" },
          ].map((f) => {
            const isActive = statusFilter === f.value;
            return (
              <Link
                key={f.value}
                href={f.value ? `/dashboard/trainings?status=${encodeURIComponent(f.value)}` : "/dashboard/trainings"}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 font-medium text-right">
          Catálogo: <span className="font-bold text-slate-700 dark:text-slate-200">{catalogTrainings.length} cursos disponíveis</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Funcionário</th>
                <th className="p-4">Treinamento / Habilidade</th>
                <th className="p-4">Categoria / Carga H.</th>
                <th className="p-4">Data Conclusão</th>
                <th className="p-4">Validade</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              {employeeTrainings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    Nenhum registro de treinamento encontrado.
                  </td>
                </tr>
              ) : (
                employeeTrainings.map((rec) => (
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
                      <p className="font-bold text-slate-800 dark:text-slate-100">{rec.training.title}</p>
                      {rec.notes && <p className="text-xs text-slate-400 italic mt-0.5">{rec.notes}</p>}
                    </td>

                    <td className="p-4 text-xs">
                      <span className="inline-block font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {rec.training.category || "Geral"}
                      </span>
                      {rec.training.hours && (
                        <span className="text-slate-400 ml-2 font-medium">{rec.training.hours}h</span>
                      )}
                    </td>

                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {rec.completionDate
                        ? format(new Date(rec.completionDate), "dd 'de' MMM, yyyy", { locale: ptBR })
                        : "-"}
                    </td>

                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {rec.expirationDate
                        ? format(new Date(rec.expirationDate), "dd/MM/yyyy")
                        : <span className="text-slate-400 italic">Indeterminada</span>}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full font-bold ${
                          rec.status === "Concluído"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : rec.status === "Em Andamento"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : rec.status === "Pendente"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <EmployeeTrainingActions recordId={rec.id} currentStatus={rec.status} />
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
