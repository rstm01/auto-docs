import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditDocumentForm } from "@/app/(protected)/documents/[id]/edit/EditDocumentForm";

export default async function AdminEditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Извлечение документа из базы данных
  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    notFound();
  }

  return (
    <div className="text-foreground">
      <EditDocumentForm 
        document={document} 
        isAdmin={true} 
        returnUrl={`/admin-panel/documents`} 
      />
    </div>
  );
}
