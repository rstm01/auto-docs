import { prisma } from "@/lib/prisma";
import { AdminDocumentsTable } from "./AdminDocumentsTable";

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Все документы</h1>
        <p className="text-muted-foreground mt-1">Управление всеми файлами системы</p>
      </div>

      <AdminDocumentsTable initialDocuments={documents} />
    </div>
  );
}
