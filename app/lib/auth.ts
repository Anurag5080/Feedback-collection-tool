import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminPayload {
  username: string;
  iat: number;
  exp: number;
}

export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (error) {
    return null;
  }
}