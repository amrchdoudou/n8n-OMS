import { PrismaClient } from './src/generated/prisma/client.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('No user found in the database. Please create a user first.');
    return;
  }

  if (!user.apiKey) {
    const newApiKey = `oms_${uuidv4().replace(/-/g, '')}`;
    user = await prisma.user.update({
      where: { id: user.id },
      data: { apiKey: newApiKey }
    });
    console.log('--- NEW API KEY GENERATED ---');
    console.log(`User: ${user.username}`);
    console.log(`API Key: ${newApiKey}`);
    console.log('---------------------------');
  } else {
    console.log('--- EXISTING API KEY FOUND ---');
    console.log(`User: ${user.username}`);
    console.log(`API Key: ${user.apiKey}`);
    console.log('-----------------------------');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
