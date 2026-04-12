"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Star, 
  MessageSquare, 
  FileText,
  Settings,
  UsersRound,
  ChevronRight
} from "lucide-react";

import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Funcionários", href: "/dashboard/employees", icon: Users },
    { name: "Avaliações", href: "/dashboard/evaluations", icon: Star },
    { name: "Equipes", href: "/dashboard/teams", icon: UsersRound },
    { name: "Comentários", href: "/dashboard/comments", icon: MessageSquare },
    { name: "Relatórios", href: "/dashboard/reports", icon: FileText },
  ];

  return (
    <aside className="w-72 sidebar-glass text-white flex flex-col h-full shrink-0 z-20 hidden md:flex">
      {/* Brand Section */}
      <div className="h-44 flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm -z-10" />
        <Link 
          href="/dashboard" 
          className="relative w-full h-24 flex items-center justify-center transition-all duration-500 hover:scale-[1.02] active:scale-95 group"
        >
          <Image
            src="/images/Logo.png"
            alt="Viana & Moura"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500"
            priority
          />
        </Link>
        <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
          Recursos Humanos
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-6 pb-4 px-4 space-y-1.5 custom-scrollbar">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-500 group relative overflow-hidden ${
                isActive 
                  ? "bg-white/10 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              } animate-fade-up`}
              style={{ animationDelay: `${(index + 1) * 0.05}s` }}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--secondary)] shadow-[0_0_15px_var(--secondary)]" />
              )}
              
              <item.icon className={`w-5 h-5 transition-all duration-500 ${
                isActive 
                  ? "text-[var(--secondary)] scale-110" 
                  : "group-hover:text-white group-hover:scale-110"
              }`} />
              
              <span className="tracking-wide text-sm">{item.name}</span>
              
              {isActive && (
                <ChevronRight className="ml-auto w-4 h-4 text-[var(--secondary)]/50" />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Footer / Settings */}
      <div className="p-6 mt-auto">
        <Link 
          href="/dashboard/settings" 
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
            pathname === "/dashboard/settings"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" />
          <span className="text-sm font-medium">Configurações</span>
        </Link>
        
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between px-2">
          <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
            v1.0.0-PRO
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        </div>
      </div>
    </aside>
  );
}

