import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import DeleteEmployeeButton from "@/components/employees/DeleteEmployeeButton";
import EvaluationRadarChart from "@/components/evaluations/EvaluationRadarChart";

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      team: { 
        select: { name: true, sector: true } 
      },
      evaluations: {
        orderBy: { createdAt: "desc" },
        include: { supervisor: { select: { name: true } } }
      },
      trainings: {
        orderBy: { createdAt: "desc" },
        include: { training: true }
      }
    }
  });

  if (!employee) {
    notFound();
  }

  const totalAverage = employee.evaluations.length > 0
    ? (employee.evaluations.reduce((acc: number, curr: any) => acc + curr.average, 0) / employee.evaluations.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees" className="p-2 border border-gray-200 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Detalhes do Funcionário</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/employees/${employee.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-md font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
          <DeleteEmployeeButton id={employee.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-gray-200 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Foto do Funcionário na lateral */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
            {employee.photoUrl ? (
              <img src={employee.photoUrl} alt={employee.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-300 dark:text-slate-700">
                <Plus className="w-8 h-8 opacity-20" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Sem Foto</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome Completo</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{employee.fullName}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
            <span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${
                        employee.status === "Ativo" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : employee.status === "Inativo"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] dark:text-yellow-500"
                      }`}>
                 {employee.status}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Função/Cargo</h3>
            <p className="text-md text-gray-800 dark:text-gray-200">{employee.role}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Setor</h3>
            <p className="text-md text-gray-800 dark:text-gray-200">
              {employee.sector}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Obra</h3>
            <p className="text-md text-gray-800 dark:text-gray-200">
              {employee.team?.sector || employee.obra || "Não informado"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Equipe de Trabalho</h3>
            {employee.team ? (
              <p className="text-md text-[var(--color-primary)] font-semibold">
                {employee.team.name}
              </p>
            ) : (
              <p className="text-md text-gray-400 italic">Sem equipe</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data de Admissão</h3>
            <p className="text-md text-gray-800 dark:text-gray-200">
              {employee.admissionDate ? format(new Date(employee.admissionDate), "dd/MM/yyyy") : "Não informada"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CPF</h3>
            <p className="text-md text-gray-800 dark:text-gray-200">{employee.cpf || "Não informado"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EvaluationRadarChart evaluations={employee.evaluations} />
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Histórico de Avaliações</h2>
              {totalAverage && (
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span>Média Geral Total:</span>
                  <span className="text-sm font-black">{totalAverage}</span>
                </span>
              )}
            </div>
            <Link 
              href={`/dashboard/evaluations/new?employeeId=${employee.id}`}
              className="text-sm bg-blue-50 text-[var(--color-primary)] hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Nova Avaliação
            </Link>
          </div>
          
          <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400">
                  <th className="p-3 font-medium">Data</th>
                  <th className="p-3 font-medium">Avaliador</th>
                  <th className="p-3 font-medium text-center">Média</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {employee.evaluations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-500">
                      Nenhuma avaliação registrada
                    </td>
                  </tr>
                ) : (
                  employee.evaluations.map((ev: any) => (
                    <tr key={ev.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {format(new Date(ev.createdAt), "dd MMM yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {ev.supervisor.name || "Supervisor"}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${ev.average >= 4 ? 'text-green-600' : ev.average >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {ev.average.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {employee.evaluations.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50/80 dark:bg-slate-800/80 border-t-2 border-gray-200 dark:border-slate-700 font-bold">
                    <td colSpan={2} className="p-3 text-gray-900 dark:text-white text-right">
                      Média Geral Total:
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-sm font-black ${
                        Number(totalAverage) >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                        Number(totalAverage) >= 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {totalAverage}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Seção de Treinamentos e Habilidades */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Treinamentos & Habilidades</h2>
          </div>
          <Link
            href={`/dashboard/trainings/new?employeeId=${employee.id}`}
            className="text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Registrar Treinamento
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                <th className="p-3">Treinamento / Curso</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Conclusão</th>
                <th className="p-3">Validade</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {employee.trainings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                    Nenhum treinamento registrado para este funcionário.
                  </td>
                </tr>
              ) : (
                employee.trainings.map((tr: any) => (
                  <tr key={tr.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {tr.training.title}
                      {tr.notes && <p className="text-xs text-slate-400 italic font-normal">{tr.notes}</p>}
                    </td>
                    <td className="p-3 text-xs text-slate-500">
                      {tr.training.category || "Geral"} {tr.training.hours ? `(${tr.training.hours}h)` : ""}
                    </td>
                    <td className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {tr.completionDate ? format(new Date(tr.completionDate), "dd MMM yyyy", { locale: ptBR }) : "-"}
                    </td>
                    <td className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {tr.expirationDate ? format(new Date(tr.expirationDate), "dd/MM/yyyy") : "Indeterminada"}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs rounded-full font-bold ${
                        tr.status === "Concluído"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : tr.status === "Em Andamento"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : tr.status === "Pendente"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {tr.status}
                      </span>
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
