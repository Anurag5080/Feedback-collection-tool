import { NextResponse } from 'next/server';
import { getAllFeedbacks, initDatabase } from '@/app/lib/database';
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

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const feedbacks = await getAllFeedbacks(limit, offset);
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}