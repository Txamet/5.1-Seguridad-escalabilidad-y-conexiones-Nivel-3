import { NextFunction } from 'express';
import { AuthService } from '../../application/services/auth-service';

export const AuthMiddleware = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const SECRET = process.env.JWT_SECRET  

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = AuthService.verifyToken(token)
    req.user = { id: decoded.id, role: decoded.role };
    console.log(req.user)
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

