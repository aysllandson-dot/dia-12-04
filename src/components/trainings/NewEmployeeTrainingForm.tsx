"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";

interface EmployeeOption {
  id: string;
  fullName: string;
  role: string;
  sector: string;
}

interface TrainingOption {
  id: string;
  title: string;
  category: string | null;
  hours: number | null;
}

export default function NewEmployeeTrainingForm({
  employees,
  catalogTrainings,
  initialEmployeeId,
}: {
  employees: EmployeeOption[];
  catalogTrainings: TrainingOption[];
  initialEmployeeId?: string;
}) {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId || "");
  const [trainingId, setTrainingId] = useState("");
  const [status, setStatus] = useState("Concluído");
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split("T")[0]);
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !trainingId) {
      setError("Selecione o funcionário e o treinamento.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/employee-trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          trainingId,
          status,
          completionDate: completionDate || null,
          expirationDate: expirationDate || null,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar treinamento");
      }

      router.push("/dashboard/trainings");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
            Funcionário <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Selecione um funcionário...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName} ({emp.role} - {emp.sector})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
            Treinamento / Habilidade <span className="text-red-500">*</span>
          </label>
          {catalogTrainings.length === 0 ? (
            <p className="text-xs text-amber-600 dark:text-amber-400 italic">
              Nenhum treinamento cadastrado no catálogo ainda. Crie um tipo no catálogo primeiro na página de Treinamentos.
            </p>
          ) : (
            <select
              required
              value={trainingId}
              onChange={(e) => setTrainingId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">Selecione um treinamento do catálogo...</option>
              {catalogTrainings.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.title} ({tr.category || "Geral"}{tr.hours ? ` - ${tr.hours}h` : ""})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="Concluído">Concluído</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Pendente">Pendente</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
              Data de Conclusão
            </label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
              Data de Validade (Opcional)
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
            Observações (Opcional)
          </label>
          <textarea
            rows={3}
            placeholder="Ex: Certificado emitido pela empresa XYZ, Nota de aprovação..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || catalogTrainings.length === 0}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {loading ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}
