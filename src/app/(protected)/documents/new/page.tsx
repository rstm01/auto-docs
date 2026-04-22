"use client";

/**
 * Клиентская страница создания нового документа.
 * Использует формы и серверные действия для взаимодействия с БД.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createDocument } from "@/server/actions";

export default function NewDocumentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState("");           // Состояние для хранения ошибок валидации

  /**
   * Обработка отправки формы.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Сбор данных из полей формы с помощью FormData
    const formData = new FormData(e.currentTarget);
    
    // Вызов серверного действия (Server Action)
    const result = await createDocument(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success) {
      // При успешном создании перенаправляем на страницу документа
      router.push(`/documents/${result.documentId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Кнопка "Назад" и заголовок */}
      <div className="flex items-center space-x-4">
        <Link href="/documents" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <span className="text-xl">←</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Новый документ</h1>
          <p className="text-slate-500">Создание карточки документа</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Метаданные документа</CardTitle>
            <CardDescription>
              Заполните основную информацию о документе. После сохранения он получит статус "Черновик".
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Отображение ошибок, если они есть */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {/* Поле названия */}
            <div className="space-y-2">
              <Label htmlFor="title">Название документа <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="Например: Договор на оказание услуг №123"
                required
                minLength={3}
              />
            </div>
            
            {/* Поле описания */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание или содержание</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Кратко опишите суть документа..."
                className="min-h-[200px] resize-none"
              />
            </div>
          </CardContent>
          
          {/* Нижняя панель с кнопками */}
          <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
            <Link href="/documents" className={buttonVariants({ variant: "outline" })}>
              Отмена
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : (
                <>
                  <span className="mr-2">💾</span>
                  Сохранить черновик
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

