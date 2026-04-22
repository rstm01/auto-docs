import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Конфигурация NextAuth для управления аутентификацией и сессиями.
 */
export const authOptions: AuthOptions = {
  // Список провайдеров авторизации
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Определение полей формы входа
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      /**
       * Функция проверки учетных данных при входе.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Неверный email или пароль");
        }

        // Поиск пользователя в базе данных по email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        // Сравнение введенного пароля с хэшем из БД
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Неверный пароль");
        }

        // Возврат данных пользователя для сохранения в JWT токене
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName || undefined,
          role: user.role,
        } as any;
      }
    })
  ],
  // Стратегия управления сессиями (используем JSON Web Token)
  session: {
    strategy: "jwt"
  },
  callbacks: {
    /**
     * Callback для дополнения JWT токена данными пользователя (например, ролью).
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.lastName = user.lastName;
      }
      
      // Если было вызвано обновление сессии (update)
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.lastName = session.lastName || token.lastName;
        token.email = session.email || token.email;
      }

      return token;
    },
    /**
     * Callback для передачи данных из токена в объект сессии, доступный на клиенте.
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.lastName = token.lastName as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  // Настройка кастомных страниц авторизации
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

