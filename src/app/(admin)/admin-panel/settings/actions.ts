"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Не авторизован");
  }

  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email обязателен");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: name || null,
      lastName: lastName || null,
      email: email,
    },
  });

  revalidatePath("/admin-panel/settings");
  return { success: true };
}
