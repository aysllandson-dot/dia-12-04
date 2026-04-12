"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, UserPlus, Users, ClipboardList, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  type: "EMPLOYEE" | "TEAM" | "EVALUATION" | "COMMENT";
  title: string;
  message: string;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "EMPLOYEE": return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "TEAM": return <Users className="w-4 h-4 text-green-500" />;
      case "EVALUATION": return <ClipboardList className="w-4 h-4 text-yellow-500" />;
      case "COMMENT": return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all relative ${
          isOpen ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <Bell className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-secondary)] rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-morphism rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 py-2 z-50 animate-fade-up overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">Notificações</h3>
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-secondary)] font-bold">Recentes</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm animate-pulse">Carregando atualizações...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Nenhuma atualização recente.</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className="px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group cursor-default"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[var(--color-primary)]/30 transition-all">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{notif.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-black/5 dark:bg-white/5 text-center">
            <button className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-[var(--color-primary)] transition-colors">
              Marcar todas como lidas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
