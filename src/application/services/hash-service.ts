import bcryptjs from 'bcryptjs';

export class HashService {
  static async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }
}