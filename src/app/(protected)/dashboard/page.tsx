import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * Страница дашборда (панель управления).
 * Это серверный компонент, который получает данные напрямую из БД.
 */

// Принудительная динамическая отрисовка (чтобы данные всегда были актуальными)
export const dynamic = "force-dynamic";

import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  // Получение текущей сессии пользователя
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const isAdmin = session.user.role === "ADMIN";

  const totalDocs = await prisma.document.count(
    isAdmin ? undefined : { where: { authorId: session.user.id } }
  );
  
  const pendingDocs = await prisma.document.count({
    where: { 
      status: "PENDING",
      ...(isAdmin ? {} : { authorId: session.user.id })
    }
  });

  const approvedDocs = await prisma.document.count({
    where: { 
      status: "APPROVED",
      ...(isAdmin ? {} : { authorId: session.user.id })
    }
  });

  const rejectedDocs = await prisma.document.count({
    where: { 
      status: "REJECTED",
      ...(isAdmin ? {} : { authorId: session.user.id })
    }
  });

  const recentDocs = await prisma.document.findMany({
    where: isAdmin ? undefined : { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { author: { select: { name: true, email: true } } }
  });

  return (
    <DashboardContent 
      session={session}
      totalDocs={totalDocs}
      pendingDocs={pendingDocs}
      approvedDocs={approvedDocs}
      rejectedDocs={rejectedDocs}
      recentDocs={recentDocs}
      isAdmin={isAdmin}
    />
  );
}

