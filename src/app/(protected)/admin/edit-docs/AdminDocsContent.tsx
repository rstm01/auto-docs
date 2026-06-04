"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { updateDocumentStatus, deleteDocument } from "@/server/actions";
import { useRouter } from "next/navigation";

type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  updatedAt: string | Date;
  author: { name: string | null; email: string };
};

interface AdminDocsContentProps {
  documents: DocumentRow[];
}

/**
 * Клиентский компонент панели администратора для управления и изменения документов.
 */
export function AdminDocsContent({ documents }: AdminDocsContentProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Маппинг статусов
  const statusMap: Record<string, { label: string; color: string }> = {
    DRAFT: { label: t("draft") || "Черновик", color: "bg-slate-500" },
    PENDING: { label: t("pending"), color: "bg-amber-500" },
    APPROVED: { label: t("approved"), color: "bg-emerald-500" },
    REJECTED: { label: t("rejected"), color: "bg-red-500" },
  };

  /**
   * Быстрое обновление статуса (Утвердить / Отклонить)
   */
  const handleQuickStatus = async (documentId: string, status: string) => {
    setIsLoading(`${documentId}-${status}`);
    const result = await updateDocumentStatus(documentId, status);
    setIsLoading(null);
    if (result && result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  /**
   * Быстрое удаление документа
   */
  const handleDelete = async (documentId: string) => {
    if (!window.confirm("Правда ли вы хотите удалить этот файл?")) {
      return;
    }
    setIsLoading(`${documentId}-delete`);
    const result = await deleteDocument(documentId);
    setIsLoading(null);
    if (result && result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  // Фильтрация документов по названию или почте/имени автора
  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = doc.title.toLowerCase().includes(query);
    const emailMatch = doc.author.email.toLowerCase().includes(query);
    const nameMatch = doc.author.name ? doc.author.name.toLowerCase().includes(query) : false;
    return titleMatch || emailMatch || nameMatch;
  });

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("adminPanel") || "Панель администратора"}</h1>
        <p className="text-slate-500">{t("adminPanelDesc") || "Управление статусами и редактирование любых документов в системе"}</p>
      </div>

      {/* Поиск */}
      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Поиск по названию или автору..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900"
        />
      </div>

      {/* Таблица документов */}
      {filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed rounded-lg shadow-sm">
          <span className="text-4xl mb-4">🔍</span>
          <h3 className="text-lg font-medium text-foreground">Документы не найдены</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Попробуйте изменить поисковый запрос или создайте новые документы.
          </p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("title")}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("status")}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("author")}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("date")}</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y border-border">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">📄</span>
                        <div className="font-medium max-w-xs truncate">{doc.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={statusMap[doc.status].color + " hover:" + statusMap[doc.status].color}>
                        {statusMap[doc.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {doc.author.name || "Без имени"}
                      <div className="text-xs text-muted-foreground">{doc.author.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(doc.updatedAt).toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {/* Ссылка на редактирование */}
                      <Link 
                        href={`/documents/${doc.id}/edit`} 
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        ✏️ {t("edit")}
                      </Link>

                      {/* Быстрое Утверждение */}
                      {doc.status !== "APPROVED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
                          onClick={() => handleQuickStatus(doc.id, "APPROVED")}
                          disabled={isLoading !== null}
                        >
                          {isLoading === `${doc.id}-APPROVED` ? "..." : "✔️ Да"}
                        </Button>
                      )}

                      {/* Быстрое Отклонение */}
                      {doc.status !== "REJECTED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleQuickStatus(doc.id, "REJECTED")}
                          disabled={isLoading !== null}
                        >
                          {isLoading === `${doc.id}-REJECTED` ? "..." : "✖️ Нет"}
                        </Button>
                      )}

                      {/* Быстрое Удаление */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-500 hover:bg-slate-100 border-slate-200"
                        onClick={() => handleDelete(doc.id)}
                        disabled={isLoading !== null}
                      >
                        {isLoading === `${doc.id}-delete` ? "..." : "🗑️"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
