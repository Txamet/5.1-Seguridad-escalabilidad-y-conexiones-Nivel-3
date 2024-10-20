import { NextFunction } from 'express';
import { AuthService } from '../../application/services/auth-service';

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