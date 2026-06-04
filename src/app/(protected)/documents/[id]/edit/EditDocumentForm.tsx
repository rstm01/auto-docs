"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { updateDocument } from "@/server/actions";
import { useLanguage } from "@/context/LanguageContext";

interface EditDocumentFormProps {
  document: {
    id: string;
    title: string;
    description: string | null;
  };
  isAdmin: boolean;
  returnUrl?: string;
}

/**
 * Клиентский компонент формы редактирования документа.
 * Управляет отправкой изменений на сервер.
 */
export function EditDocumentForm({ document, isAdmin, returnUrl }: EditDocumentFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки формы
  const [error, setError] = useState("");           // Хранение ошибок валидации формы
  const [statusAction, setStatusAction] = useState<string | null>(null); // Желаемый статус сохранения

  const backUrl = returnUrl || `/documents/${document.id}`;

  /**
   * Обработка отправки формы обновления.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    if (statusAction) {
      formData.append("statusAction", statusAction);
    }
    const result = await updateDocument(document.id, formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success) {
      // После успешного обновления перенаправляем обратно на страницу документа
      router.push(backUrl);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Кнопка возврата к просмотру */}
      <div className="flex items-center space-x-4">
        <Link href={backUrl} className={buttonVariants({ variant: "ghost", size: "icon", className: "text-slate-400 hover:text-white" })}>
          <span className="text-xl">←</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("editDoc")}</h1>
          <p className="text-slate-500">{t("editDocDesc")}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("editDoc")}</CardTitle>
            <CardDescription>
              Измените название или описание документа. После сохранения изменений ИИ-эмбеддинг будет автоматически пересчитан.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ошибки валидации */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {/* Поле редактирования названия */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")} <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                defaultValue={document.title}
                placeholder="Например: Договор на оказание услуг №123"
                required
                minLength={3}
              />
            </div>
            
            {/* Поле редактирования содержания */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание или содержание</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={document.description || ""}
                placeholder="Кратко опишите суть документа..."
                className="min-h-[200px] resize-none"
              />
            </div>
          </CardContent>
          
          {/* Нижняя панель действий */}
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t p-6 bg-slate-50/50">
            <Link href={backUrl} className={buttonVariants({ variant: "outline", className: "text-slate-800 dark:text-slate-200" })}>
              {t("cancel")}
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Админские кнопки изменения статуса при сохранении */}
              {isAdmin && (
                <>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-slate-600 hover:bg-slate-700 text-white w-full sm:w-auto"
                    onClick={() => setStatusAction("DRAFT")}
                  >
                    {isLoading && statusAction === "DRAFT" ? "Сохранение..." : (
                      <>
                        <span className="mr-2">📝</span>
                        Черновик
                      </>
                    )}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                    onClick={() => setStatusAction("REJECTED")}
                  >
                    {isLoading && statusAction === "REJECTED" ? "Сохранение..." : (
                      <>
                        <span className="mr-2">✖️</span>
                        Отклонен
                      </>
                    )}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                    onClick={() => setStatusAction("APPROVED")}
                  >
                    {isLoading && statusAction === "APPROVED" ? "Сохранение..." : (
                      <>
                        <span className="mr-2">✔️</span>
                        Одобрен
                      </>
                    )}
                  </Button>
                </>
              )}
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
                onClick={() => setStatusAction(null)}
              >
                {isLoading && !statusAction ? "Сохранение..." : (
                  <>
                    <span className="mr-2">💾</span>
                    {t("saveChanges")}
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
