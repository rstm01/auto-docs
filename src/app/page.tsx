"use client";

import Link from "next/link";
import { UserMenu } from "@/components/UserMenu";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Публичная шапка сайта */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg flex items-center justify-center w-8 h-8">
              📄
            </div>
            <span className="text-xl font-bold tracking-tight">AuroDocs</span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t("features")}</Link>
              <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t("about")}</Link>
            </nav>
            <Link 
              href="/login" 
              className="text-sm font-semibold px-4 py-2 border rounded-full hover:bg-muted transition-colors"
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero-секция */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-sm font-medium shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              {t("welcome")}
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
              {t("heroTitle")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/login" 
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-8 text-base font-medium text-white transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
              >
                {t("startWork")} <span className="ml-2">→</span>
              </Link>
              <Link 
                href="/register" 
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white dark:bg-card px-8 text-base font-medium text-slate-700 dark:text-foreground transition-all hover:bg-slate-50 dark:hover:bg-muted hover:scale-105 active:scale-95"
              >
                {t("createAccount")}
              </Link>
            </div>
          </div>
        </section>

        {/* Секция преимуществ */}
        <section id="features" className="py-20 bg-card border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-slate-900">Быстрый старт</h3>
                <p className="text-slate-600">
                  Мгновенное создание документов и простая система статусов для быстрого согласования.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-slate-900">Безопасность</h3>
                <p className="text-slate-600">
                  Ролевая модель доступа (RBAC) гарантирует, что ваши данные видят только те, кому это разрешено.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  📁
                </div>
                <h3 className="text-xl font-bold text-slate-900">Все в одном</h3>
                <p className="text-slate-600">
                  История изменений, комментарии и удобный дашборд для контроля всех процессов.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">📄</span>
            <span className="text-xl font-bold tracking-tight">AuroDocs</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            <Link href="#" className="hover:text-white transition-colors">Условия использования</Link>
            <Link href="#" className="hover:text-white transition-colors">Контакты</Link>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} AuroDocs. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}


