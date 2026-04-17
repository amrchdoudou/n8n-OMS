import { PrismaClient } from '@prisma/client';


import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const prisma = new PrismaClient();

const SaveFolderPath = 'uploads/';

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



export {
  HashPassword,
  GenerateJwtToken,
  GenerateRefreshToken,

};
