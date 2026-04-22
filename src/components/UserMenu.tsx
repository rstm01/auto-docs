"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function UserMenu() {
  const { data: session, status } = useSession();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Переключение темы (визуальное)
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  if (!mounted || status === "loading") {
    return <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />;
  }

  const user = session?.user;

  return (
    <div className="relative group">
      <button className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center overflow-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 outline-none transition-all hover:scale-105 shadow-sm">
        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
      </button>
      
      <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 transform origin-top-right scale-95 group-hover:scale-100">
        <div className="px-3 py-3 border-b mb-1">
          <p className="text-sm font-bold text-foreground truncate">{user?.name || (lang === "RU" ? "Гость" : "Guest")}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email || (lang === "RU" ? "Войдите в систему" : "Please log in")}</p>
        </div>

        <div className="flex flex-col gap-0.5">
          {user && (
            <>
              <Link href="/account" className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                <span className="mr-3">👤</span> {lang === "RU" ? "Аккаунт" : "Account"}
              </Link>
              <Link href="/settings" className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="mr-3">⚙️</span> {lang === "RU" ? "Настройки" : "Settings"}
              </Link>
              <div className="h-px bg-slate-100 my-1" />
            </>
          )}

          {user ? (
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="mr-3">🚪</span> {lang === "RU" ? "Выйти" : "Sign Out"}
            </button>
          ) : (
            <>
              <Link href="/login" className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="mr-3">🔑</span> {lang === "RU" ? "Войти" : "Login"}
              </Link>
              <Link href="/register" className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="mr-3">👤</span> {lang === "RU" ? "Регистрация" : "Register"}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}




