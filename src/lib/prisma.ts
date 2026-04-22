import { PrismaClient } from "@prisma/client";

/**
 * Объявление глобальной переменной для предотвращения создания множества экземпляров PrismaClient
 * в режиме разработки (Hot Reloading). Это паттерн Singleton.
 */
declare global {
  var prisma: PrismaClient | undefined;
}

// В продакшене (Vercel) используем стандартный PrismaClient для PostgreSQL
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
