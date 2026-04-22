"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    // Проверяем текущую тему при загрузке
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
        <p className="text-slate-500">{t("heroDesc")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings")}</CardTitle>
          <CardDescription>
            {t("heroDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Настройка языка */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">{t("language")}</Label>
              <p className="text-sm text-slate-500">{t("language")}</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-muted rounded-lg p-1">
              <button 
                onClick={() => setLang("RU")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === "RU" ? "bg-white dark:bg-card shadow-sm text-slate-900 dark:text-foreground" : "text-slate-500 hover:text-slate-700"}`}
              >
                Русский
              </button>
              <button 
                onClick={() => setLang("EN")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === "EN" ? "bg-white dark:bg-card shadow-sm text-slate-900 dark:text-foreground" : "text-slate-500 hover:text-slate-700"}`}
              >
                English
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-border" />

          {/* Настройка темы */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">{t("theme")}</Label>
              <p className="text-sm text-slate-500">{t("theme")}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{theme === "light" ? t("light") : t("dark")}</span>
              <button 
                onClick={toggleTheme}
                className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors duration-200 focus:outline-none"
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${theme === "dark" ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Уведомления (Заглушка) */}
          <div className="flex items-center justify-between py-2 opacity-50">
            <div className="space-y-0.5">
              <Label className="text-base">Email-уведомления</Label>
              <p className="text-sm text-slate-500">Получать письма о смене статусов документов.</p>
            </div>
            <button className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="text-2xl text-blue-600">ℹ️</div>
            <div>
              <p className="text-sm text-blue-900 font-medium">Бета-тестирование</p>
              <p className="text-xs text-blue-700 mt-1">
                Дополнительные настройки будут доступны в следующих обновлениях AutoDocs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
