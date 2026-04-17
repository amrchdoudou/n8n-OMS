// middlewares/authMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // console.log('headers = ', req.query);

  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    (authHeader && !authHeader.startsWith('Bearer ') && !authHeader.startsWith('JWT '))
  ) {
    return res.status(401).json({ error: 'No token provided in auth middleware' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided in auth middleware' });
  }

  try {
    // console.log('token = ', token);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, jwtSecret) as unknown as { userId: number; email: string };
    // attach current user id to request
    (req as any).user = { id: decoded.userId, email: decoded.email };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
