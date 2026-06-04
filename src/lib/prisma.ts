import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Объявление глобальной переменной для предотвращения создания множества экземпляров PrismaClient
 * в режиме разработки (Hot Reloading). Это паттерн Singleton.
 */
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  (process.env.NODE_ENV === "production"
    ? new PrismaClient()
    : new PrismaClient({
        adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" }),
      }));

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
