import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, ShieldAlert, CheckCircle2 } from "lucide-react";

export default async function AdminDashboardPage() {
  // Получаем статистику для админа
  const totalDocuments = await prisma.document.count();
  const totalUsers = await prisma.user.count();
  
  const pendingDocs = await prisma.document.count({
    where: { status: "PENDING" }
  });
  
  const approvedDocs = await prisma.document.count({
    where: { status: "APPROVED" }
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Hero-блок (Приветствие) */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8 sm:p-10 text-foreground border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl opacity-70"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Панель управления
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Сводная статистика системы autodocs. Управляйте пользователями, документами и настройками в реальном времени.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              Система работает в штатном режиме
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Карточка 1 */}
        <Card className="glass-card bg-card/60 border-border/50 text-card-foreground overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Всего документов
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight">{totalDocuments}</div>
          </CardContent>
        </Card>

        {/* Карточка 2 */}
        <Card className="glass-card bg-card/60 border-border/50 text-card-foreground overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              На проверке
            </CardTitle>
            <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight text-amber-400">{pendingDocs}</div>
          </CardContent>
        </Card>

        {/* Карточка 3 */}
        <Card className="glass-card bg-card/60 border-border/50 text-card-foreground overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Одобренные
            </CardTitle>
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight text-emerald-400">{approvedDocs}</div>
          </CardContent>
        </Card>

        {/* Карточка 4 */}
        <Card className="glass-card bg-card/60 border-border/50 text-card-foreground overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Пользователей
            </CardTitle>
            <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold tracking-tight">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 md:p-8 backdrop-blur-sm group hover:border-border transition-colors shadow-sm">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/5 to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="p-4 rounded-2xl bg-muted/80 border border-border/50 flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg">
            <span className="text-4xl">🚀</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Добро пожаловать в панель администратора!</h3>
            <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
              Здесь вы можете управлять всеми документами в системе, менять их статусы, а также настраивать базовые параметры работы платформы. Используйте меню слева для навигации по разделам управления.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
