"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function UserMenu({ 
  children,
  dropdownPosition = "bottom-right"
}: { 
  children?: React.ReactNode;
  dropdownPosition?: "bottom-right" | "top-left" | "top-right" | "bottom-left";
}) {
  const { data: session, status } = useSession();
  const { lang } = useLanguage();
  const [hydrated] = useState(() => true);

  if (!hydrated || status === "loading") {
    return children ? <>{children}</> : <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />;
  }

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  // Determine positioning classes
  const positionClasses = {
    "bottom-right": "top-full right-0 mt-2 origin-top-right",
    "top-left": "bottom-full left-0 mb-2 origin-bottom-left",
    "top-right": "bottom-full right-0 mb-2 origin-bottom-right",
    "bottom-left": "top-full left-0 mt-2 origin-top-left",
  }[dropdownPosition];

  return (
    <div className="relative group cursor-pointer w-full">
      {children ? (
        children
      ) : (
        <button className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center overflow-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none transition-all hover:scale-105 shadow-sm font-semibold">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </button>
      )}
      
      <div className={`absolute ${positionClasses} w-64 bg-card border border-border/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 transform scale-95 group-hover:scale-100 backdrop-blur-xl`}>
        <div className="px-3 py-3 border-b border-border/50 mb-1">
          <p className="text-sm font-bold text-foreground truncate">{user?.name || (lang === "RU" ? "Гость" : "Guest")}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email || (lang === "RU" ? "Войдите в систему" : "Please log in")}</p>
        </div>

        <div className="flex flex-col gap-0.5">
          {user && (
            <>
              <Link href={isAdmin ? "/admin-panel/settings" : "/settings"} className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                <span className="mr-3">⚙️</span> {lang === "RU" ? "Настройки" : "Settings"}
              </Link>
              <div className="h-px bg-border/50 my-1" />
            </>
          )}

          {user ? (
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-lg transition-colors"
            >
              <span className="mr-3">🚪</span> {lang === "RU" ? "Выйти" : "Sign Out"}
            </button>
          ) : (
            <>
              <Link href="/login" className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                <span className="mr-3">🔑</span> {lang === "RU" ? "Войти" : "Login"}
              </Link>
              <Link href="/register" className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                <span className="mr-3">👤</span> {lang === "RU" ? "Регистрация" : "Register"}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}




