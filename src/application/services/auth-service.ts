import jwt from 'jsonwebtoken';

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET || "secret");
  }
}