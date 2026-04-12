import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sevenDaysAgo = subDays(new Date(), 7);

    // Fetching the most recent activities across multiple models
    const [employees, teams, evaluations, comments] = await Promise.all([
      prisma.employee.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
      prisma.team.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
      prisma.evaluation.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { employee: { select: { fullName: true } } }
      }),
      prisma.comment.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { employee: { select: { fullName: true } } }
      }),
    ]);

    // Format them into a single list of notifications
    const notifications = [
      ...employees.map(e => ({
        id: `emp-${e.id}`,
        type: "EMPLOYEE",
        title: "Novo Funcionário",
        message: `${e.fullName} foi cadastrado(a) no setor ${e.sector}.`,
        createdAt: e.createdAt,
      })),
      ...teams.map(t => ({
        id: `team-${t.id}`,
        type: "TEAM",
        title: "Nova Equipe",
        message: `Equipe ${t.name} foi formada com sucesso.`,
        createdAt: t.createdAt,
      })),
      ...evaluations.map(ev => ({
        id: `eval-${ev.id}`,
        type: "EVALUATION",
        title: "Nova Avaliação",
        message: `Avaliação registrada para ${ev.employee.fullName}.`,
        createdAt: ev.createdAt,
      })),
      ...comments.map(c => ({
        id: `comm-${c.id}`,
        type: "COMMENT",
        title: "Novo Comentário",
        message: `Um novo comentário foi adicionado para ${c.employee.fullName}.`,
        createdAt: c.createdAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10); // Last 10 updates

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Notification API Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
