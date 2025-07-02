import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string }; // Adjust based on your JWT payload
    }
  }   
}

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const vendorMiddleware: RequestHandler = async (req, res, next) => {
  if (req.user?.role !== 'vendor') {
    res.status(403).json({ error: 'Access restricted to vendors' });
    return;
  }
  next();
};