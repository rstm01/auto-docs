"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardContentProps {
  session: any;
  totalDocs: number;
  pendingDocs: number;
  approvedDocs: number;
  rejectedDocs: number;
  recentDocs: any[];
  isAdmin: boolean;
}

export function DashboardContent({
  session,
  totalDocs,
  pendingDocs,
  approvedDocs,
  rejectedDocs,
  recentDocs,
  isAdmin
}: DashboardContentProps) {
  const { t, lang } = useLanguage();

  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: t("draft") || "Черновик", color: "bg-slate-500" },
    PENDING: { label: t("pending"), color: "bg-amber-500" },
    APPROVED: { label: t("approved"), color: "bg-emerald-500" },
    REJECTED: { label: t("rejected"), color: "bg-red-500" }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с приветствием */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("welcome")}, {session.user.name}</h1>
        <p className="text-slate-500">{t("recentDocs")}</p>
      </div>

      {/* Сетка карточек со статистикой */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("statsTotal")}</CardTitle>
            <span className="text-xl">📄</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("statsPending")}</CardTitle>
            <span className="text-xl">🕒</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("statsApproved")}</CardTitle>
            <span className="text-xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("statsRejected")}</CardTitle>
            <span className="text-xl">❌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedDocs}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">{t("recentDocs")}</h2>
      
      {recentDocs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center bg-card border-dashed">
          <span className="text-4xl mb-4">📄</span>
          <h3 className="font-medium text-foreground">{t("noDocs")}</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">{t("createFirst")}</p>
          <Link href="/documents/new" className="text-sm font-medium text-blue-600 hover:underline">
            {t("newDocument")}
          </Link>
        </Card>
      ) : (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y border-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("title")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("status")}</th>
                {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("author")}</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("date")}</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y border-border">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{doc.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={statusMap[doc.status].color + " hover:" + statusMap[doc.status].color}>
                      {statusMap[doc.status].label}
                    </Badge>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {doc.author.name}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/documents/${doc.id}`} className="text-blue-600 hover:text-blue-900">
                      {t("open")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
