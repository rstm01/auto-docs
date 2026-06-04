import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditDocumentForm } from "./EditDocumentForm";

/**
 * Серверная страница редактирования документа.
 * Проверяет права доступа и рендерит форму редактирования.
 */
export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // Извлечение документа из базы данных
  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    notFound();
  }

  const isAdmin = session.user.role === "ADMIN";
  const isAuthor = document.authorId === session.user.id;

  // Безопасность: только автор или администратор могут просматривать форму редактирования
  if (!isAdmin && !isAuthor) {
    notFound();
  }

  // Бизнес-логика: автор может редактировать только черновики (DRAFT) или отклоненные (REJECTED)
  if (!isAdmin && document.status !== "DRAFT" && document.status !== "REJECTED") {
    redirect(`/documents/${id}`);
  }

  return <EditDocumentForm document={document} isAdmin={isAdmin} />;
}
