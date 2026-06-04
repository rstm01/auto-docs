"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Session } from "next-auth";

type RecentDoc = {
  id: string;
  title: string;
  status: string;
  createdAt: string | Date;
  author: { name: string | null };
};

interface DashboardContentProps {
  session: Session;
  totalDocs: number;
  pendingDocs: number;
  approvedDocs: number;
  rejectedDocs: number;
  recentDocs: RecentDoc[];
  isAdmin: boolean;
}

export function DashboardContent({
  session,
  totalDocs,
  pendingDocs,
  approvedDocs,
  rejectedDocs,
  recentDocs,
  isAdmin
}: DashboardContentProps) {
  const { t, lang } = useLanguage();

  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: t("draft") || "Черновик", color: "bg-slate-500" },
    PENDING: { label: t("pending"), color: "bg-amber-500" },
    APPROVED: { label: t("approved"), color: "bg-emerald-500" },
    REJECTED: { label: t("rejected"), color: "bg-red-500" }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero-блок (Приветствие) */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8 sm:p-10 text-card-foreground border bg-card/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl opacity-70"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Добро пожаловать обратно, {session.user.name || "Гость"}!
          </h1>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            Это ваша панель управления autodocs. Отслеживайте свои задачи, проверяйте статусы документов и работайте эффективно с инструментами мирового класса.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/documents/new" 
              className={buttonVariants({ variant: "default", size: "lg", className: "shadow-lg shadow-primary/20 transition-all hover:scale-105" })}
            >
              <span className="mr-2">📄</span> Создать документ
            </Link>
            {isAdmin && (
              <Link 
                href="/admin-panel/dashboard" 
                className={buttonVariants({ variant: "outline", size: "lg", className: "backdrop-blur-sm border-primary/30 hover:bg-primary/5 transition-all hover:scale-105" })}
              >
                <span className="mr-2">🛡️</span> Админ-панель
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Карточка 1 */}
        <Card className="glass-card overflow-hidden relative group border bg-card/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Все документы</CardTitle>
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <FileText className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight">{totalDocs}</div>
          </CardContent>
        </Card>

        {/* Карточка 2 */}
        <Card className="glass-card overflow-hidden relative group border bg-card/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">На согласовании</CardTitle>
            <div className="p-2 rounded-full bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight text-amber-500">{pendingDocs}</div>
          </CardContent>
        </Card>

        {/* Карточка 3 */}
        <Card className="glass-card overflow-hidden relative group border bg-card/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Утверждены</CardTitle>
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight text-emerald-500">{approvedDocs}</div>
          </CardContent>
        </Card>

        {/* Карточка 4 */}
        <Card className="glass-card overflow-hidden relative group border bg-card/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Отклонены</CardTitle>
            <div className="p-2 rounded-full bg-red-500/10 text-red-500 ring-1 ring-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <AlertCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight text-red-500">{rejectedDocs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Недавние документы</h2>
          <Link href="/documents" className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
            Смотреть все &rarr;
          </Link>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm">
          {recentDocs.length > 0 ? (
            <div className="divide-y divide-border/30">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/documents/${doc.id}`} className="font-semibold text-base hover:text-primary hover:underline truncate block">
                        {doc.title}
                      </Link>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{new Date(doc.createdAt).toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US")}</span>
                        {doc.author?.name && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                            <span className="truncate">{doc.author.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-2 sm:mt-0">
                      <Badge className={statusMap[doc.status].color + " hover:" + statusMap[doc.status].color} variant="outline">
                        {statusMap[doc.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Нет недавних документов</h3>
              <p className="text-muted-foreground text-sm max-w-sm">Здесь будут отображаться документы, которые вы недавно создавали или редактировали.</p>
              <Link href="/documents/new" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
                Создать первый документ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
