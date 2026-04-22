import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

import { DocumentsContent } from "@/components/DocumentsContent";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const isAdmin = session.user.role === "ADMIN";

  const documents = await prisma.document.findMany({
    where: isAdmin ? undefined : { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true, email: true } } }
  });

  return (
    <DocumentsContent documents={documents} isAdmin={isAdmin} />
  );
}
