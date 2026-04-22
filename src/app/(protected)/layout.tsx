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

  // Конфигурация основного меню навигации
  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: "📊" },
    { name: t("documents"), href: "/documents", icon: "📄" },
    { name: t("newDocument"), href: "/documents/new", icon: "➕" },
  ];

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
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold tracking-tight">
                  AuroDocs
                </Link>
              </div>
              {/* Ссылки навигации */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                        isActive
                          ? "border-primary text-primary font-bold"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}




