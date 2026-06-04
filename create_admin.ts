import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@autodocs.com";
  const password = await bcrypt.hash("admin12345", 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", password },
    create: { 
      email, 
      password, 
      name: "Главный", 
      lastName: "Администратор", 
      role: "ADMIN" 
    },
  });
  
  console.log("Admin successfully created:", user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
