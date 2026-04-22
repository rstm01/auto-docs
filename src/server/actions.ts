"use server";

/**
 * Файл с серверными действиями (Server Actions).
 * Эти функции выполняются только на сервере, что обеспечивает безопасность
 * и прямой доступ к базе данных.
 */

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Создание нового документа
 * @param formData Данные из формы создания
 */
export async function createDocument(formData: FormData) {
  // Проверка сессии (авторизован ли пользователь)
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "Не авторизован" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // Валидация входных данных на стороне сервера
  if (!title || title.length < 3) {
    return { error: "Название должно содержать минимум 3 символа" };
  }

  try {
    // Сохранение документа в БД через Prisma
    const document = await prisma.document.create({
      data: {
        title,
        description,
        authorId: session.user.id,
        status: "DRAFT", // По умолчанию документ создается как черновик
      },
    });

    // Инвалидация кэша для обновления данных на страницах
    revalidatePath("/dashboard");
    revalidatePath("/documents");
    
    return { success: true, documentId: document.id };
  } catch (error) {
    console.error("Ошибка при создании документа:", error);
    return { error: "Ошибка при сохранении документа" };
  }
}

/**
 * Обновление статуса документа (жизненный цикл документа)
 * @param documentId ID документа
 * @param status Новый статус
 */
export async function updateDocumentStatus(documentId: string, status: string) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "Не авторизован" };
  }

  try {
    // Поиск документа в базе
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return { error: "Документ не найден" };
    }

    // Проверка прав доступа (Role-Based Access Control)
    const isAdmin = session.user.role === "ADMIN";
    const isAuthor = document.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return { error: "Нет прав доступа" };
    }

    // Бизнес-логика: только администратор может переводить в финальные статусы
    if (!isAdmin && (status === "APPROVED" || status === "REJECTED")) {
      return { error: "Только администратор может утверждать или отклонять документы" };
    }

    // Обновление статуса в БД
    await prisma.document.update({
      where: { id: documentId },
      data: { status },
    });

    // Обновление кэша связанных страниц
    revalidatePath("/dashboard");
    revalidatePath("/documents");
    revalidatePath(`/documents/${documentId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    return { error: "Ошибка при обновлении статуса" };
  }
}

/**
 * Обновление профиля пользователя
 * @param formData Данные профиля
 */
export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "Не авторизован" };
  }

  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  if (!name || name.length < 2) {
    return { error: "Имя должно содержать минимум 2 символа" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, lastName, email },
    });

    revalidatePath("/account");
    
    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    return { error: "Ошибка при обновлении профиля" };
  }
}

