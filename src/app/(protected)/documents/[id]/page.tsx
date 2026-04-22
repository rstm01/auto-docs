import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { StatusActions } from "./StatusActions";

/**
 * Страница детального просмотра документа.
 * Является серверным компонентом.
 */

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // В Next.js 15+ параметры страницы являются промисом
  const { id } = await params;

  // Получение сессии текущего пользователя
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  // Поиск конкретного документа в БД по ID
  const document = await prisma.document.findUnique({
    where: { id },
    include: { author: { select: { name: true, email: true } } }
  });

  // Если документ не найден, возвращаем 404
  if (!document) {
    notFound();
  }

  const isAdmin = session.user.role === "ADMIN";
  const isAuthor = document.authorId === session.user.id;

  /**
   * Проверка прав доступа (Security Check): 
   * Только автор документа или администратор имеют право просматривать документ.
   */
  if (!isAdmin && !isAuthor) {
    notFound();
  }

  // Маппинг статусов для отображения
  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: "Черновик", color: "bg-slate-500" },
    PENDING: { label: "На согласовании", color: "bg-amber-500" },
    APPROVED: { label: "Утвержден", color: "bg-emerald-500" },
    REJECTED: { label: "Отклонен", color: "bg-red-500" }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Шапка страницы с навигацией и статусом */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/documents" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <span className="text-xl">←</span>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight">{document.title}</h1>
              <Badge className={statusMap[document.status].color}>
                {statusMap[document.status].label}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Создан {new Date(document.createdAt).toLocaleDateString("ru-RU")} в {new Date(document.createdAt).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        {/* 
            Панель действий со статусами. 
            Логика кнопок вынесена в отдельный клиентский компонент StatusActions.
        */}
        <StatusActions 
          documentId={document.id} 
          currentStatus={document.status} 
          isAdmin={isAdmin} 
          isAuthor={isAuthor} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Основной контент документа */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Содержание документа</CardTitle>
            </CardHeader>
            <CardContent>
              {document.description ? (
                <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-relaxed text-slate-700 bg-slate-50 p-6 rounded-md border">
                  {document.description}
                </div>
              ) : (
                <p className="text-slate-500 italic">Описание отсутствует</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Сайдбар с метаданными */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Автор</div>
                <div className="mt-1 font-medium">{document.author.name}</div>
                <div className="text-sm text-slate-500">{document.author.email}</div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-slate-500">Последнее обновление</div>
                <div className="mt-1">
                  {new Date(document.updatedAt).toLocaleDateString("ru-RU")} {new Date(document.updatedAt).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

