import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminDocsContent } from "./AdminDocsContent";

export const dynamic = "force-dynamic";

/**
 * Административная страница «Управление и изменение».
 * Доступна только пользователям с ролью ADMIN.
 */
export default async function AdminEditDocsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Защита доступа: только администраторы могут заходить
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Получаем абсолютно все документы в системе
  const documents = await prisma.document.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <AdminDocsContent documents={documents} />
  );
}
