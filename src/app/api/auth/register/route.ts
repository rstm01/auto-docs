import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Схема валидации данных регистрации с помощью библиотеки Zod.
 * Обеспечивает строгую проверку типов и форматов на стороне сервера.
 */
const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

/**
 * Обработчик POST-запроса для регистрации нового пользователя.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Валидация входных данных
    const { name, email, password } = registerSchema.parse(body);

    // 2. Проверка, не занят ли email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // 3. Хэширование пароля для безопасного хранения в БД
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Создание записи пользователя в базе данных
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // По умолчанию новый пользователь получает роль USER
      },
    });

    // Специальная логика для демонстрации: 
    // Если это самый первый пользователь в системе, делаем его ADMIN
    const count = await prisma.user.count();
    if (count === 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" }
      });
    }

    return NextResponse.json(
      { message: "Пользователь успешно создан", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    // Обработка ошибок валидации Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    // Обработка прочих системных ошибок
    return NextResponse.json({ message: "Произошла ошибка при регистрации" }, { status: 500 });
  }
}

