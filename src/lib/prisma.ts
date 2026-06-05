import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Объявление глобальной переменной для предотвращения создания множества экземпляров PrismaClient
 * в режиме разработки (Hot Reloading). Это паттерн Singleton.
 */
declare global {
  var prisma: PrismaClient | undefined;
}

const getPrismaClient = () => {
  if (process.env.NODE_ENV === "production") {
    const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } else {
    return new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" }),
    });
  }
};

export const prisma = global.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
