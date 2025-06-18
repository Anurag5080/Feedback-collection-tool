import { NextResponse } from 'next/server';
import { verifyAdminUser, initDatabase } from '@/app/lib/database';
import { generateToken } from '@/app/lib/auth';

let dbInitialized = false;

export async function POST(request: Request) {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminUser(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(username);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`  `