import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LanguageProvider } from "@/context/LanguageContext";

/**
 * Корневой шрифт (Inter) с поддержкой кириллицы.
 */
const inter = Inter({ subsets: ["latin", "cyrillic"] });

/**
 * Метаданные приложения (SEO и заголовок вкладки).
 */
export const metadata: Metadata = {
  title: "AuroDocs | Система документооборота",
  description: "Автоматизация документооборота для вашего бизнеса",
};

/**
 * Корневой компонент разметки (Root Layout).
 * Оборачивает все страницы приложения.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* Providers подключает NextAuth сессии и другие контексты */}
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
