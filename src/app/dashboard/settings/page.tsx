"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Configurações</h1>
            <p className="text-[var(--foreground)]/60 mt-1">Gerencie suas preferências de sistema e conta.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seção de Aparência */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--foreground)] border-b border-[var(--card-border)] pb-4">
              <Sun className="w-5 h-5 text-[var(--secondary)]" />
              Aparência
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-[var(--foreground)]/70">Escolha o tema da aplicação:</p>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    mounted && theme === "light" 
                      ? "border-[var(--secondary)] bg-[var(--secondary)]/10 text-[var(--secondary)]" 
                      : "border-transparent bg-[var(--background)] text-[var(--foreground)]/60 hover:bg-[var(--card-bg)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Sun className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">Claro</span>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    mounted && theme === "dark" 
                      ? "border-[var(--secondary)] bg-[var(--secondary)]/10 text-[var(--secondary)]" 
                      : "border-transparent bg-[var(--background)] text-[var(--foreground)]/60 hover:bg-[var(--card-bg)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Moon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">Escuro</span>
                </button>

                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    mounted && theme === "system" 
                      ? "border-[var(--secondary)] bg-[var(--secondary)]/10 text-[var(--secondary)]" 
                      : "border-transparent bg-[var(--background)] text-[var(--foreground)]/60 hover:bg-[var(--card-bg)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Monitor className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">Sistema</span>
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Conta */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--foreground)] border-b border-[var(--card-border)] pb-4">
              <User className="w-5 h-5 text-[var(--primary)] dark:text-[var(--primary-light)]" />
              Sua Conta
            </h2>

            <div className="space-y-6">
              <div className="bg-[var(--background)] p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--foreground)]">
                    {session?.user?.name || "Usuário"}
                  </div>
                  <div className="text-sm text-[var(--foreground)]/60">
                    {session?.user?.email || "Email não disponível"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 font-semibold transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                Sair / Alterar Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
