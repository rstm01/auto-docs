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

export default function AdminLoginPage() {
  const router = useRouter();
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
      // Прямое перенаправление в панель администратора
      router.push("/admin-panel/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-700 bg-slate-800 text-slate-100 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-slate-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2 shadow-inner">
              <span className="text-xl">🛡️</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Вход для администраторов</CardTitle>
            <CardDescription className="text-slate-400">
              Безопасный доступ к панели управления
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-800 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email администратора</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-slate-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">Пароль</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-slate-700 mt-2 pt-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Проверка..." : "Войти в систему"}
              </Button>
              <div className="text-sm text-center text-slate-500">
                Обычный пользователь?{" "}
                <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Вернуться на обычный вход
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
