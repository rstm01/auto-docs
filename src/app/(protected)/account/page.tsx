"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/server/actions";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

export default function AccountPage() {
  const { t } = useLanguage();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    const result = await updateUserProfile(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: t("saveChanges") });
      // Обновляем сессию на клиенте, передавая новые данные
      await update({ name, lastName, email });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("account")}</h1>
        <p className="text-slate-500">{t("profileInfo")}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("account")}</CardTitle>
            <CardDescription>
              {t("profileInfo")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message.text && (
              <div className={`p-3 text-sm rounded-md border ${
                message.type === "error" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("nameLabel")}</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={session?.user?.name || ""}
                  placeholder={t("nameLabel")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastNameLabel")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={(session?.user as any)?.lastName || ""}
                  placeholder={t("lastNameLabel")}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={session?.user?.email || ""}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="pt-2">
              <p className="text-xs text-slate-400">
                {t("status")}: <span className="font-bold">{session?.user?.role === "ADMIN" ? "Admin" : "User"}</span>
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6 bg-slate-50/50 dark:bg-muted/50 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("save") + "..." : t("saveChanges")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
