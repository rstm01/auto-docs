"use client";

/**
 * Обертка для защищенных страниц.
 * Содержит общую навигацию (Navbar), логику определения активной вкладки
 * и меню управления профилем.
 */

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  // Получение данных текущей сессии на клиенте
  const { data: session, status } = useSession();
  // Получение текущего пути для подсветки активного пункта меню
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN";

  // Конфигурация основного меню навигации
  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: "📊" },
    { name: t("documents"), href: "/documents", icon: "📄" },
    { name: t("newDocument"), href: "/documents/new", icon: "➕" },
  ];

  if (isAdmin) {
    navigation.push({ name: t("adminEditTab"), href: "/admin/edit-docs", icon: "⚙️" });
  }

  // Пока сессия загружается, можно показать индикатор загрузки или пустой экран
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Если сессия загружена, но пользователя нет — middleware должен был перенаправить,
  // но на всякий случай проверяем здесь.
  if (!session) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Верхняя навигационная панель (Navbar) */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300">
                    A
                  </div>
                  <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    autodocs
                  </span>
                </Link>
              </div>
              {/* Ссылки навигации */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary shadow-[inset_0_-2px_0_0_rgba(var(--primary),1)]"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span className="mr-2 opacity-80">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Меню пользователя в правой части Navbar */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Основная область контента (Main content) */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        {children}
      </main>
    </div>
  );
}




