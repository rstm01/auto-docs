"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface DocumentsContentProps {
  documents: any[];
  isAdmin: boolean;
}

export function DocumentsContent({ documents, isAdmin }: DocumentsContentProps) {
  const { t, lang } = useLanguage();

  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: t("draft") || "Черновик", color: "bg-slate-500" },
    PENDING: { label: t("pending"), color: "bg-amber-500" },
    APPROVED: { label: t("approved"), color: "bg-emerald-500" },
    REJECTED: { label: t("rejected"), color: "bg-red-500" }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("documents")}</h1>
          <p className="text-slate-500">{t("recentDocs")}</p>
        </div>
        <Link href="/documents/new" className={buttonVariants({ variant: "default" })}>
          <span className="mr-2">➕</span>
          {t("newDocument")}
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed rounded-lg shadow-sm">
          <span className="text-4xl mb-4">📂</span>
          <h3 className="text-lg font-medium text-foreground">{t("noDocs")}</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
            {t("createFirst")}
          </p>
          <Link href="/documents/new" className={buttonVariants({ variant: "outline" })}>{t("newDocument")}</Link>
        </div>
      ) : (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y border-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("title")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("status")}</th>
                {isAdmin && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("author")}</th>}
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("date")}</th>
                <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y border-border">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📄</span>
                      <div className="font-medium">{doc.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={statusMap[doc.status].color + " hover:" + statusMap[doc.status].color}>
                      {statusMap[doc.status].label}
                    </Badge>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {doc.author.name}
                      <div className="text-xs text-muted-foreground">{doc.author.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(doc.updatedAt).toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/documents/${doc.id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors">
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
