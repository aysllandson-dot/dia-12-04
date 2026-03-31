"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteTeamButton({ id, teamName }: { id: string; teamName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente a equipe "${teamName}"?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir equipe");
      
      router.refresh();
    } catch (error) {
      alert("Falha ao excluir a equipe. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Excluir Equipe"
    >
      <Trash2 className="w-4 h-4" />
      <span>{loading ? "Excluindo..." : "Excluir"}</span>
    </button>
  );
}
