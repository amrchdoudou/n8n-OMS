import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  console.log('User API Key:', user?.apiKey);
  console.log('User ID:', user?.id);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
