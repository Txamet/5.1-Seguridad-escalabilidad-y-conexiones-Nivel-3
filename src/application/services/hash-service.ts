import bcrypt from 'bcryptjs';

export class HashService {
  static async hashPassword(password: string): Promise<any> {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> { 
    return await bcrypt.compare(password, hash);
  }
}