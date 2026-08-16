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

interface SkillOption {
  id: string;
  name: string;
  category: string | null;
}

export default function NewEmployeeSkillForm({
  employees,
  catalogSkills,
  initialEmployeeId,
}: {
  employees: EmployeeOption[];
  catalogSkills: SkillOption[];
  initialEmployeeId?: string;
}) {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId || "");
  const [skillId, setSkillId] = useState("");
  const [level, setLevel] = useState("Intermediário");
  const [experienceYears, setExperienceYears] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !skillId) {
      setError("Selecione o funcionário e a habilidade.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/employee-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          skillId,
          level,
          experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar habilidade");
      }

      router.push("/dashboard/skills");
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
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
            Habilidade Prática <span className="text-red-500">*</span>
          </label>
          {catalogSkills.length === 0 ? (
            <p className="text-xs text-amber-600 dark:text-amber-400 italic">
              Nenhuma habilidade cadastrada no catálogo ainda. Adicione habilidades práticas no catálogo primeiro na página de Habilidades.
            </p>
          ) : (
            <select
              required
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecione uma habilidade do catálogo...</option>
              {catalogSkills.map((sk) => (
                <option key={sk.id} value={sk.id}>
                  {sk.name} ({sk.category || "Geral"})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
              Nível de Domínio <span className="text-red-500">*</span>
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Iniciante">Iniciante (Em Aprendizado)</option>
              <option value="Intermediário">Intermediário (Executa autonomamente)</option>
              <option value="Avançado">Avançado (Alta produtividade e qualidade)</option>
              <option value="Especialista">Especialista (Referência e instrutor)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
              Anos de Experiência (Opcional)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ex: 3"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1.5 text-slate-800 dark:text-slate-200 text-sm">
            Observações (Opcional)
          </label>
          <textarea
            rows={3}
            placeholder="Ex: Realizou acabamento cerâmico de alto padrão na obra X..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
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
            disabled={loading || catalogSkills.length === 0}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {loading ? "Salvando..." : "Salvar Habilidade"}
          </button>
        </div>
      </form>
    </div>
  );
}
