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
import bcrypt from "bcryptjs";

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

/**
 * Умный поиск (Keyword Search)
 * Теперь ищет только по точному совпадению слов.
 * @param query Поисковый запрос
 * @param documentIds Список ID документов для поиска (уже отфильтрованных по правам доступа)
 */
export async function semanticSearchDocuments(query: string, documentIds: string[]) {
  try {
    const documents = await prisma.document.findMany({
      where: { id: { in: documentIds } }
    });

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const results = [];

    for (const doc of documents) {
      const textToSearch = `${doc.title} ${doc.description || ""}`.toLowerCase();
      
      // Ищем точное совпадение слов из запроса в тексте документа
      const hasMatch = queryWords.every(word => textToSearch.includes(word));
      
      if (hasMatch) {
        results.push({ id: doc.id });
      }
    }

    return { success: true, matches: results.map(r => r.id) };
  } catch (error) {
    console.error("Ошибка при умном поиске:", error);
    return { error: "Ошибка при выполнении умного поиска" };
  }
}

/**
 * Обновление полей документа (название и описание)
 * @param documentId ID документа
 * @param formData Данные формы
 */
export async function updateDocument(documentId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Не авторизован" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const statusAction = formData.get("statusAction") as string; // Необязательный статус ("APPROVED" | "REJECTED")

  if (!title || title.length < 3) {
    return { error: "Название должно содержать минимум 3 символа" };
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return { error: "Документ не найден" };
    }

    const isAdmin = session.user.role === "ADMIN";
    const isAuthor = document.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return { error: "Нет прав доступа" };
    }

    // Если обычный пользователь (автор), проверяем статус
    if (!isAdmin && document.status !== "DRAFT" && document.status !== "REJECTED") {
      return { error: "Нельзя редактировать документ в текущем статусе" };
    }

    // Определение нового статуса (только ADMIN может задать статус при сохранении)
    let newStatus = document.status;
    if (isAdmin && statusAction) {
      if (statusAction === "APPROVED" || statusAction === "REJECTED" || statusAction === "PENDING" || statusAction === "DRAFT") {
        newStatus = statusAction;
      }
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        title,
        description,
        status: newStatus,
        embedding: null, // Сбрасываем ИИ-эмбеддинг для пересчета на новый текст
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/documents");
    revalidatePath(`/documents/${documentId}`);

    return { success: true };
  } catch (error) {
    console.error("Ошибка при обновлении документа:", error);
    return { error: "Ошибка при обновлении документа" };
  }
}

/**
 * Удаление документа
 * @param documentId ID документа
 */
export async function deleteDocument(documentId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Не авторизован" };
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return { error: "Документ не найден" };
    }

    const isAdmin = session.user.role === "ADMIN";

    if (!isAdmin) {
      return { error: "Только администратор может удалять документы" };
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/documents");

    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении документа:", error);
    return { error: "Ошибка при удалении документа" };
  }
}

/**
 * Создание демо-аккаунтов (Администратор и Пользователь), если они отсутствуют в БД.
 */
export async function ensureDemoAccounts() {
  try {
    // 1. Проверяем и создаем аккаунт Администратора
    const adminEmail = "admin@example.com";
    let admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("adminpassword", 10);
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Администратор",
          lastName: "Системы",
          role: "ADMIN",
        },
      });
    }

    // 2. Проверяем и создаем аккаунт обычного Пользователя
    const userEmail = "user@example.com";
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash("userpassword", 10);
      user = await prisma.user.create({
        data: {
          email: userEmail,
          password: hashedPassword,
          name: "Иван",
          lastName: "Иванов",
          role: "USER",
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Ошибка при подготовке демо-аккаунтов:", error);
    return { error: "Ошибка при подготовке демо-аккаунтов" };
  }
}



