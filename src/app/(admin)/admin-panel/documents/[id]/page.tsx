import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { StatusActions } from "@/app/(protected)/documents/[id]/StatusActions";

export const dynamic = "force-dynamic";

export default async function AdminDocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") return null;

  const document = await prisma.document.findUnique({
    where: { id },
    include: { author: { select: { name: true, email: true } } }
  });

  if (!document) {
    notFound();
  }

  const isAdmin = true;
  const isAuthor = document.authorId === session.user.id;

  const statusMap: Record<string, { label: string, color: string }> = {
    DRAFT: { label: "Черновик", color: "bg-slate-500" },
    PENDING: { label: "На согласовании", color: "bg-amber-500" },
    APPROVED: { label: "Утвержден", color: "bg-emerald-500" },
    REJECTED: { label: "Отклонен", color: "bg-red-500" }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin-panel/documents" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground" })}>
            <span className="text-xl">←</span>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{document.title}</h1>
              <Badge className={statusMap[document.status].color}>
                {statusMap[document.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Создан {new Date(document.createdAt).toLocaleDateString("ru-RU")} в {new Date(document.createdAt).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        <StatusActions 
          documentId={document.id} 
          currentStatus={document.status} 
          isAdmin={isAdmin} 
          isAuthor={isAuthor} 
          adminPanelMode={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle>Содержание документа</CardTitle>
            </CardHeader>
            <CardContent>
              {document.description ? (
                <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed bg-muted p-6 rounded-md border border-border">
                  {document.description}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Описание отсутствует</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Автор</div>
                <div className="mt-1 font-medium">{document.author.name}</div>
                <div className="text-sm text-muted-foreground">{document.author.email}</div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="text-sm font-medium text-muted-foreground">Последнее обновление</div>
                <div className="mt-1">
                  {new Date(document.updatedAt).toLocaleDateString("ru-RU")} {new Date(document.updatedAt).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
