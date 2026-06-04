"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Trash2, Edit } from "lucide-react";
import { deleteDocument, semanticSearchDocuments } from "@/server/actions";

type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  updatedAt: Date;
  author: { name: string | null; email: string };
};

export function AdminDocumentsTable({ initialDocuments }: { initialDocuments: DocumentRow[] }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSmartSearch, setIsSmartSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [semanticMatches, setSemanticMatches] = useState<string[] | null>(null);

  // Debounced эффект для умного поиска
  useEffect(() => {
    if (!isSmartSearch) return;

    if (searchQuery.trim().length === 0) {
      const timer = setTimeout(() => setSemanticMatches(null), 0);
      return () => clearTimeout(timer);
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
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isSmartSearch, documents]);

  const handleDelete = async (id: string) => {
    if (!confirm("Правда ли вы хотите удалить этот файл?")) return;
    
    setIsDeleting(id);
    const res = await deleteDocument(id);
    
    if (res.success) {
      setDocuments(docs => docs.filter(d => d.id !== id));
    } else {
      alert("Ошибка при удалении: " + res.error);
    }
    setIsDeleting(null);
  };

  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: "Черновик", color: "bg-slate-500" },
    PENDING: { label: "На проверке", color: "bg-amber-500" },
    APPROVED: { label: "Одобрен", color: "bg-emerald-500" },
    REJECTED: { label: "Отклонен", color: "bg-red-500" }
  };

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();

    if (isSmartSearch) {
      const hasExactMatch = doc.title.toLowerCase().includes(query) || 
                            (doc.description && doc.description.toLowerCase().includes(query));
      const hasSemanticMatch = semanticMatches !== null && semanticMatches.includes(doc.id);
      return hasExactMatch || hasSemanticMatch;
    }

    return doc.title.toLowerCase().includes(query);
  });

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
      <div className="flex flex-col gap-3 max-w-sm">
        <Input
          type="search"
          placeholder={isSmartSearch ? "Умный ИИ поиск..." : "Поиск по названию..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card"
        />
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-card p-2 rounded-lg border border-border/50">
          <input 
            type="checkbox" 
            checked={isSmartSearch}
            onChange={(e) => {
              setIsSmartSearch(e.target.checked);
              if (!e.target.checked) setSemanticMatches(null);
            }}
            className="rounded text-blue-600 w-4 h-4"
          />
          <span className={isSmartSearch ? "text-blue-600 font-bold" : "text-muted-foreground"}>
            🪄 Умный поиск (ИИ)
          </span>
          {isSearching && <span className="ml-auto text-xs text-muted-foreground animate-pulse">Думает...</span>}
        </label>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-border/50">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Название</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Статус</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Автор</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Дата</th>
            <th className="relative px-6 py-4"><span className="sr-only">Действия</span></th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border/50 text-foreground">
          {filteredDocs.map((doc) => (
            <tr key={doc.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📄</span>
                  <div className="font-medium text-foreground">{doc.title}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={statusMap[doc.status]?.color || "bg-slate-500"}>
                  {statusMap[doc.status]?.label || doc.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {doc.author.name || "Без имени"}
                <div className="text-xs text-muted-foreground">{doc.author.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {new Date(doc.updatedAt).toLocaleDateString("ru-RU")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                <Link href={`/admin-panel/documents/${doc.id}`} className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 rounded-md transition-colors" title="Просмотр">
                  <span className="w-4 h-4 text-lg leading-none flex items-center justify-center">👁️</span>
                </Link>
                <Link href={`/admin-panel/documents/${doc.id}/edit`} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-md transition-colors" title="Редактировать">
                  <Edit className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  disabled={isDeleting === doc.id}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors disabled:opacity-50"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {filteredDocs.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                Документы не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
