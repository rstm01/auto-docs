import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Объявление глобальной переменной для предотвращения создания множества экземпляров PrismaClient
 * в режиме разработки (Hot Reloading). Это паттерн Singleton.
 */
declare global {
  var prismaNeon: PrismaClient | undefined;
}

const getPrismaClient = () => {
  const connectionString = process.env.POSTGRES_PRISMA_URL;
  const pool = new Pool({
    connectionString,
    ssl: true,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = global.prismaNeon || getPrismaClient();

if (process.env.NODE_ENV !== "production") global.prismaNeon = prisma;
