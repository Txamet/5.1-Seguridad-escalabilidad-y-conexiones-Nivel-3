import { config } from 'dotenv';

config();

export const DATABASE_URL = process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/dbname';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const PORT = process.env.PORT || 3000;