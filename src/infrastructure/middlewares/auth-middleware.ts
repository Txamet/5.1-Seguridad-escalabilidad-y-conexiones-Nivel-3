import { NextFunction } from 'express';
import { AuthService } from '../../application/services/auth-service';
import jwt from 'jsonwebtoken';

export function AuthMiddleware(req: any, res: any, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const payload = AuthService.verifyToken(token);
    (req as any).userId = payload.userId;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access token is missing' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const authorizeAdmin = (req: any, res: any, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
};

