"use client";

import { useSession } from "next-auth/react";
import { useTransition, useState } from "react";
import { updateProfile } from "./actions";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({ user }: { user: { name?: string | null; lastName?: string | null; email?: string | null; role?: string | null } | null | undefined }) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateProfile(formData);
        
        // Update session in client
        await update({
          name: formData.get("name"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
        });
        
        setMessage({ type: "success", text: "Профиль успешно обновлен" });
      } catch (err: unknown) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Ошибка при обновлении профиля" });
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card border-border text-card-foreground">
        <CardHeader>
          <CardTitle>Профиль администратора</CardTitle>
          <CardDescription className="text-muted-foreground">Настройки вашего аккаунта</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Имя</Label>
              <Input 
                name="name" 
                defaultValue={user?.name || ""} 
                className="bg-background border-input text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Фамилия</Label>
              <Input 
                name="lastName" 
                defaultValue={user?.lastName || ""} 
                className="bg-background border-input text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email (Логин) / Gmail</Label>
              <Input 
                name="email" 
                type="email"
                required
                defaultValue={user?.email || ""} 
                className="bg-background border-input text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Роль в системе</Label>
              <Input 
                disabled 
                defaultValue={user?.role || "ADMIN"} 
                className="bg-background border-input font-bold text-red-500" 
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded text-sm ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {message.text}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isPending ? "Сохранение..." : "Сохранить профиль"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border text-card-foreground">
        <CardHeader>
          <CardTitle>Системные настройки</CardTitle>
          <CardDescription className="text-muted-foreground">Глобальные параметры приложения и внешний вид</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 border-b border-border pb-4">
            <Label className="text-foreground text-base font-medium">Тема оформления</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={() => setTheme('light')}
                className={`border-input ${theme === 'light' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-500' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                Светлая
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setTheme('dark')}
                className={`border-input ${theme === 'dark' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-500' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                Темная
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setTheme('system')}
                className={`border-input ${theme === 'system' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-500' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                Системная
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 flex items-center justify-between">
              <Label className="text-foreground">Регистрация пользователей</Label>
              <Button variant="outline" className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600">Включена</Button>
            </div>
            <div className="space-y-2 flex items-center justify-between">
              <Label className="text-foreground">ИИ поиск (HuggingFace)</Label>
              <Button variant="outline" className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600">Активен</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
