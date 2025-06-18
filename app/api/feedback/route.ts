import { NextResponse } from 'next/server';
import { createFeedback, initDatabase } from '@/app/lib/database';

let dbInitialized = false;

export async function POST(request: Request) {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }

    const body = await request.json();
    const { name, email, feedback, rating } = body;

    if (!feedback || !rating) {
      return NextResponse.json(
        { error: 'Feedback and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const newFeedback = await createFeedback({
      name: name || null,
      email: email || null,
      feedback,
      rating,
      product_id: 'general'
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}