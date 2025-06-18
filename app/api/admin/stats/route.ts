import { NextResponse } from 'next/server';
import { getFeedbackStats, initDatabase } from '@/app/lib/database';
import { verifyToken } from '@/app/lib/auth';

let dbInitialized = false;

export async function GET(request: Request) {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }

    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const stats = await getFeedbackStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}