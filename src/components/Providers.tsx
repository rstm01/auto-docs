"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

/**
 * Компонент-обертка для подключения контекстов на стороне клиента.
 * SessionProvider позволяет использовать хук useSession() в клиентских компонентах.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

