"use client";

/**
 * Клиентский компонент для управления статусами документа.
 * Позволяет пользователям отправлять документы на проверку, 
 * а администраторам — утверждать или отклонять их.
 */

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { updateDocumentStatus, deleteDocument } from "@/server/actions";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface StatusActionsProps {
  documentId: string;   // ID документа
  currentStatus: string; // Текущий статус из БД
  isAdmin: boolean;      // Является ли текущий пользователь админом
  isAuthor: boolean;     // Является ли текущий пользователь автором
  adminPanelMode?: boolean; // Флаг: отрендерен ли компонент в админ-панели
}

export function StatusActions({ documentId, currentStatus, isAdmin, isAuthor, adminPanelMode }: StatusActionsProps) {
  const router = useRouter();
  const { t } = useLanguage();
  // Состояние загрузки для индикации процесса выполнения запроса
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const basePath = adminPanelMode ? "/admin-panel/documents" : "/documents";

  /**
   * Вызов серверного действия для обновления статуса.
   */
  const handleStatusUpdate = async (status: string) => {
    setIsLoading(status);
    await updateDocumentStatus(documentId, status);
    setIsLoading(null);
  };

  /**
   * Вызов серверного действия для удаления документа.
   */
  const handleDelete = async () => {
    if (!window.confirm("Правда ли вы хотите удалить этот файл?")) {
      return;
    }
    setIsLoading("delete");
    const result = await deleteDocument(documentId);
    if (result && result.error) {
      alert(result.error);
      setIsLoading(null);
    } else {
      router.push(basePath);
    }
  };

  // Права на редактирование и удаление: ADMIN или автор в статусе DRAFT/REJECTED
  const canEditOrDelete = isAdmin || (isAuthor && (currentStatus === "DRAFT" || currentStatus === "REJECTED"));

  return (
    <div className="flex items-center space-x-3">
      {/* Кнопка Редактировать */}
      {canEditOrDelete && (
        <Link 
          href={`${basePath}/${documentId}/edit`} 
          className={buttonVariants({ variant: "outline" })}
        >
          <span className="mr-2">✏️</span>
          {t("edit")}
        </Link>
      )}

      {/* Кнопка Удалить */}
      {adminPanelMode && isAdmin && (
        <Button 
          variant="outline" 
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleDelete}
          disabled={isLoading !== null}
        >
          <span className="mr-2">🗑️</span>
          {isLoading === "delete" ? t("deleting") : t("delete")}
        </Button>
      )}

      {/* 
          Логика: Если документ в статусе "Черновик" и пользователь — его автор,
          он может отправить его на проверку (статус PENDING).
      */}
      {currentStatus === "DRAFT" && isAuthor && (
        <Button 
          onClick={() => handleStatusUpdate("PENDING")} 
          disabled={isLoading !== null}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <span className="mr-2">📤</span>
          Отправить на проверку
        </Button>
      )}

      {/* 
          Логика: Если документ в статусе "На проверке" и пользователь — администратор,
          он видит кнопки управления жизненным циклом (Утвердить/Отклонить).
      */}
      {currentStatus === "PENDING" && isAdmin && (
        <>
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={isLoading !== null}
          >
            <span className="mr-2">✖️</span>
            Отклонить
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleStatusUpdate("APPROVED")}
            disabled={isLoading !== null}
          >
            <span className="mr-2">✔️</span>
            Утвердить
          </Button>
        </>
      )}
    </div>
  );
}

