"use client";

import { signOut, useSession } from "next-auth/react";
import { Menu, UserCircle, LogOut, Bell, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 flex items-center justify-between px-6 z-30 sticky top-0 transition-all duration-500">
      {/* Background with glass effect - floating look on desktop */}
      <div className="absolute inset-x-4 top-2 bottom-2 glass-morphism rounded-2xl -z-10 shadow-lg shadow-black/5 hidden md:block" />
      <div className="absolute inset-0 bg-[#6D1414] md:hidden -z-10" />

      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Mobile Logo */}
        <div className="md:hidden relative w-40 h-10">
          <Image
            src="/images/Logo.png"
            alt="Viana & Moura"
            fill
            className="object-contain"
          />
        </div>

        {/* Desktop Search / Breadcrumb Placeholder */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-400 focus-within:text-slate-600 focus-within:border-slate-300 transition-all">
          <Search className="w-4 h-4" />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 md:dark:hover:bg-slate-800 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--secondary)] rounded-full border-2 border-white dark:border-slate-900" />
        </button>

        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {session.user.name || session.user.email}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-tighter text-[var(--secondary)]">
                {(session.user as any).role || "Supervisor"}
              </span>
            </div>
            
            <button className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[var(--primary)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm">
              <UserCircle className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group"
              title="Sair"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

