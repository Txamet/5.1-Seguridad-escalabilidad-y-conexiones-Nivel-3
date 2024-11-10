import { NextFunction } from 'express';

export const authorizeAdmin = (req: any, res: any, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};