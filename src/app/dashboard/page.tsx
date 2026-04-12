import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Star, MessageSquare, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import EvaluationRadarChart from "@/components/evaluations/EvaluationRadarChart";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import EmployeeAvatar from "@/components/employees/EmployeeAvatar";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const [totalEmployees, totalEvaluations, recentComments] = await Promise.all([
    prisma.employee.count({ where: { status: "Ativo" } }),
    prisma.evaluation.count(),
    prisma.comment.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { employee: { select: { fullName: true, photoUrl: true } } }
    })
  ]);

  const avgData = await prisma.evaluation.aggregate({
    _avg: {
      average: true,
      punctuality: true,
      organization: true,
      knowledge: true,
      proactivity: true,
      commitment: true,
    }
  });

  const dashboardRadarData = [
    {
      punctuality: avgData._avg.punctuality || 0,
      organization: avgData._avg.organization || 0,
      knowledge: avgData._avg.knowledge || 0,
      proactivity: avgData._avg.proactivity || 0,
      commitment: avgData._avg.commitment || 0,
      createdAt: new Date(),
    }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Dashboard <span className="text-[var(--primary)]">Central</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">
            Acompanhamento em tempo real de desempenho e engajamento.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card hover-lift p-8 flex items-center justify-between group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[var(--primary)]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Funcionários Ativos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{totalEmployees}</span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +2
              </span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] transition-all duration-500 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:shadow-[0_0_20px_var(--primary-glow)] relative z-10">
            <Users className="w-8 h-8" />
          </div>
        </div>

        <div className="glass-card hover-lift p-8 flex items-center justify-between group overflow-hidden relative stagger-1">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[var(--secondary)]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Rating Geral</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[var(--secondary)] tracking-tighter">
                {(avgData._avg.average || 0).toFixed(1)}
              </span>
              <span className="text-2xl text-[var(--secondary)]">★</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)]/10 flex items-center justify-center text-[var(--secondary)] transition-all duration-500 group-hover:bg-[var(--secondary)] group-hover:text-white group-hover:shadow-[0_0_20px_var(--secondary-glow)] relative z-10">
            <Star className="w-8 h-8" />
          </div>
        </div>

        <div className="glass-card hover-lift p-8 flex items-center justify-between group overflow-hidden relative stagger-2">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Avaliações</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{totalEvaluations}</span>
              <span className="text-xs font-bold text-slate-400">registros</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 transition-all duration-500 group-hover:bg-slate-800 group-hover:text-white relative z-10">
            <MessageSquare className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-3 flex flex-col gap-6 stagger-1">
          <div className="flex items-center justify-between bg-white/30 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
              Overview de Competências
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primary)] opacity-70" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Média Global</span>
            </div>
          </div>
          
          <div className="glass-card p-4 md:p-8 flex-1 flex flex-col items-center justify-center min-h-[400px]">
            {totalEvaluations > 0 ? (
              <div className="w-full h-full animate-fade-up stagger-2">
                <EvaluationRadarChart evaluations={dashboardRadarData} />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3 italic">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <FileText className="w-8 h-8 opacity-20" />
                </div>
                Ainda não há dados suficientes para gerar o gráfico.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-2 flex flex-col gap-6 stagger-2">
          <div className="flex items-center justify-between bg-white/30 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--secondary)]" />
              Atividade Recente
            </h2>
            <Link 
              href="/dashboard/comments" 
              className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] transition-all"
            >
              Ver Tudo
            </Link>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {recentComments.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-400 flex flex-col items-center justify-center flex-1 italic">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 opacity-20" />
                </div>
                Nenhum comentário registrado recentemente.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentComments.map((comment: any, idx: number) => (
                  <div 
                    key={comment.id} 
                    className={`glass-card p-5 hover:border-[var(--secondary)]/30 transition-all duration-300 group animate-fade-up stager-${idx+1}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <EmployeeAvatar photoUrl={comment.employee.photoUrl} fullName={comment.employee.fullName} size="sm" />
                          <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[var(--secondary)] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                             <ArrowUpRight className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-none mb-1">{comment.employee.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {format(new Date(comment.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 italic text-slate-600 dark:text-slate-300 text-sm leading-relaxed group-hover:bg-white dark:group-hover:bg-slate-800 transition-all">
                      "{comment.text}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

