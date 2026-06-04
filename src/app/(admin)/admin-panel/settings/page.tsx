import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Настройки</h1>
        <p className="text-muted-foreground mt-1">Управление настройками системы и профилем администратора</p>
      </div>

      <SettingsForm user={session?.user} />
    </div>
  );
}
