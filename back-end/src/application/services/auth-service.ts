import jwt from 'jsonwebtoken';

export class AuthService {
  static generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET || "secret");
  }
}