"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { ensureDemoAccounts } from "@/server/actions";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role_selection" | "user_login">("role_selection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDemoLogin = async (role: "admin" | "user") => {
    setIsLoading(true);
    setError("");

    const setupResult = await ensureDemoAccounts();
    if (setupResult.error) {
      setError(setupResult.error);
      setIsLoading(false);
      return;
    }

    const demoEmail = role === "admin" ? "admin@example.com" : "user@example.com";
    const demoPassword = role === "admin" ? "adminpassword" : "userpassword";

    const res = await signIn("credentials", {
      email: demoEmail,
      password: demoPassword,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Вход в систему</CardTitle>
            <CardDescription className="text-slate-500">
              {step === "role_selection" 
                ? "Выберите способ входа в систему autodocs"
                : "Введите email и пароль для доступа к autodocs"
              }
            </CardDescription>
          </CardHeader>

          {step === "role_selection" ? (
            <CardContent className="space-y-4 py-6">
              <Button 
                variant="outline" 
                className="w-full h-16 text-lg justify-start px-6 bg-white hover:bg-slate-50 border-slate-200 shadow-sm transition-all hover:shadow-md"
                onClick={() => setStep("user_login")}
              >
                <span className="text-2xl mr-4">👤</span>
                Вход как Пользователь
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-16 text-lg justify-start px-6 bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-sm transition-all hover:shadow-md"
                onClick={() => router.push("/admin-login")}
              >
                <span className="text-2xl mr-4">🛡️</span>
                Вход как Администратор
              </Button>

              <div className="pt-6 text-sm text-center text-slate-500">
                Нет аккаунта?{" "}
                <Link href="/register" className="font-semibold text-slate-900 hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Пароль</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
                <div className="flex justify-between w-full text-sm">
                  <button 
                    type="button" 
                    onClick={() => setStep("role_selection")}
                    className="text-slate-500 hover:text-slate-900 hover:underline"
                  >
                    ← Назад к выбору
                  </button>
                  <div className="text-slate-500">
                    Нет аккаунта?{" "}
                    <Link href="/register" className="font-semibold text-slate-900 hover:underline">
                      Зарегистрироваться
                    </Link>
                  </div>
                </div>

                {/* Разделитель */}
                <div className="relative w-full my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-50 px-2 text-slate-500">Демо-доступ</span>
                  </div>
                </div>

                {/* Кнопки быстрого входа */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={isLoading}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                  >
                    ⚙️ Админ
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin("user")}
                    disabled={isLoading}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                  >
                    👤 Пользователь
                  </Button>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
