import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // El token està en el format "Bearer TOKEN"
  const SECRET = process.env.JWT_SECRET  

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET || "secret") as { id: string; role: string }; // Desxifra el token
    req.user = { id: decoded.id, role: decoded.role }; // Guarda la `userId` i el `role` al request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};