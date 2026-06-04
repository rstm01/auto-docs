"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { semanticSearchDocuments } from "@/server/actions";

type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  updatedAt: string | Date;
  author: { name: string | null; email: string };
};

interface DocumentsContentProps {
  documents: DocumentRow[];
  isAdmin: boolean;
}

export function DocumentsContent({ documents, isAdmin }: DocumentsContentProps) {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSmartSearch, setIsSmartSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [semanticMatches, setSemanticMatches] = useState<string[] | null>(null);

  // Debounced эффект для умного поиска
  useEffect(() => {
    if (!isSmartSearch) {
      return;
    }

    if (searchQuery.trim().length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSemanticMatches(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await semanticSearchDocuments(
          searchQuery, 
          documents.map(d => d.id)
        );
        
        if (response.success && response.matches) {
          setSemanticMatches(response.matches);
        } else {
          setSemanticMatches([]);
        }
      } catch (error) {
        console.error("Failed to perform smart search", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, isSmartSearch, documents]);

  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: t("draft") || "Черновик", color: "bg-slate-500" },
    PENDING: { label: t("pending"), color: "bg-amber-500" },
    APPROVED: { label: t("approved"), color: "bg-emerald-500" },
    REJECTED: { label: t("rejected"), color: "bg-red-500" }
  };

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();

    if (isSmartSearch) {
      // Умный поиск: точное совпадение по всему содержимому ИЛИ совпадение по смыслу от ИИ
      const hasExactMatch = doc.title.toLowerCase().includes(query) || 
                            (doc.description && doc.description.toLowerCase().includes(query));
      const hasSemanticMatch = semanticMatches !== null && semanticMatches.includes(doc.id);
      
      return hasExactMatch || hasSemanticMatch;
    }

    // Обычная фильтрация: поиск подстроки ТОЛЬКО по названию (по желанию пользователя)
    return doc.title.toLowerCase().includes(query);
  });

  // Если активен ИИ поиск, мы сортируем результаты: сначала точные совпадения, затем ИИ-совпадения по релевантности
  if (isSmartSearch) {
    filteredDocs.sort((a, b) => {
      const query = searchQuery.toLowerCase();
      const aExact = a.title.toLowerCase().includes(query) || (a.description && a.description.toLowerCase().includes(query));
      const bExact = b.title.toLowerCase().includes(query) || (b.description && b.description.toLowerCase().includes(query));
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      if (semanticMatches !== null) {
        const aIndex = semanticMatches.indexOf(a.id);
        const bIndex = semanticMatches.indexOf(b.id);
        return (aIndex !== -1 ? aIndex : 999) - (bIndex !== -1 ? bIndex : 999);
      }
      return 0;
    });
  }

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

      <div className="flex flex-col gap-3 max-w-sm">
        <Input
          type="search"
          placeholder={isSmartSearch ? "Умный ИИ поиск..." : (t("searchDocs") || "Поиск документов...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border">
          <input 
            type="checkbox" 
            checked={isSmartSearch}
            onChange={(e) => {
              setIsSmartSearch(e.target.checked);
              if (!e.target.checked) setSemanticMatches(null);
            }}
            className="rounded text-blue-600 w-4 h-4"
          />
          <span className={isSmartSearch ? "text-blue-600 font-bold" : "text-slate-600"}>
            🪄 Умный поиск (ИИ)
          </span>
          {isSearching && <span className="ml-auto text-xs text-muted-foreground animate-pulse">Думает...</span>}
        </label>
      </div>

      {filteredDocs.length === 0 ? (
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
              {filteredDocs.map((doc) => (
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
