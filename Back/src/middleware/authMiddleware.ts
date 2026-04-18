// middlewares/authMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from "../Services/Common.js";


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  // 1. Try API Key Authentication
  if (apiKey) {
    try {
      const user = await prisma.user.findFirst({
        where: { apiKey: apiKey },
      });

      if (user) {
        (req as any).user = { id: user.id, email: user.email };
        return next();
      }
    } catch (err) {
      console.error('API Key auth error:', err);
    }
  }

  // 2. Try JWT Authentication
  if (authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('JWT '))) {
    const token = authHeader.split(' ')[1];
    
    if (token) {
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is not set');
        }

        const decoded = jwt.verify(token, jwtSecret) as unknown as { userId: number; email: string };
        (req as any).user = { id: decoded.userId, email: decoded.email };
        return next();
      } catch (err) {
        // If JWT fails but API Key was already tried, we fall through to 401
      }
    }
  }

  return res.status(401).json({ error: 'Authentication failed: No valid token or API key provided' });
};

