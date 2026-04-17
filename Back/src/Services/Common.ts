import { PrismaClient } from '../generated/prisma/client.js';
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const prisma = new PrismaClient();

const HashPassword = (password: string) => {
  const hash = crypto.createHmac('sha256', process.env.Hash_key!).update(password).digest('hex');
  return hash;
};

const GenerateJwtToken = (userId: number, email: string) => {
  // Implementation for generating JWT token
  const token = jwt.sign({ userId, email, type: 'access' }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
  return token;
};

const GenerateRefreshToken = (userId: number, email: string) => {
  // Implementation for generating JWT token
  const token = jwt.sign({ userId, email, type: 'refresh' }, process.env.JWT_SECRET!, {
    expiresIn: '100d',
  });
  return token;
};

const GetDataFromPath = async (filePath: string): Promise<string | null> => {
  try {
    const data = await readFile(filePath);
    const base64 = data.toString('base64');
    return base64;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
};

export {
  HashPassword,
  GenerateJwtToken,
  GenerateRefreshToken,
  GetDataFromPath,
};
