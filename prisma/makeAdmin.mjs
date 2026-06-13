// Promote a user to ADMIN by email.
// Usage: npm run make-admin -- you@example.com
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run make-admin -- <email>");
  process.exit(1);
}

const user = await prisma.user
  .update({
    where: { email: email.toLowerCase() },
    data: { role: "ADMIN" },
  })
  .catch(() => null);

if (!user) {
  console.error(`No user found with email: ${email}. Register first, then run this.`);
} else {
  console.log(`✅ ${user.email} is now an ADMIN.`);
}

await prisma.$disconnect();
