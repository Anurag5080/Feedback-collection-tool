import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/feedback_tool',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export interface Feedback {
  id: number;
  name?: string;
  email?: string;
  feedback: string;
  rating: number;
  product_id?: string;
  created_at: Date;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
  recentFeedbacks: Feedback[];
}

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        feedback TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        product_id VARCHAR(255) DEFAULT 'general',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO admin_users (username, password_hash)
      VALUES ('admin', $1)
      ON CONFLICT (username) DO UPDATE SET password_hash = $1
    `, [hashedPassword]);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

export async function createFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<Feedback> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO feedbacks (name, email, feedback, rating, product_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [feedback.name, feedback.email, feedback.feedback, feedback.rating, feedback.product_id || 'general']
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAllFeedbacks(limit = 50, offset = 0): Promise<Feedback[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM feedbacks ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
  const client = await pool.connect();
  try {
    // Get total count and average rating
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total_feedbacks,
        COALESCE(AVG(rating), 0) as average_rating
      FROM feedbacks
    `);

    const distributionResult = await client.query(`
      SELECT rating, COUNT(*) as count
      FROM feedbacks
      GROUP BY rating
      ORDER BY rating
    `);

    const ratingDistribution = [];
    for (let i = 1; i <= 5; i++) {
      const found = distributionResult.rows.find(row => row.rating === i);
      ratingDistribution.push({
        rating: i,
        count: found ? parseInt(found.count) : 0
      });
    }

    const recentResult = await client.query(`
      SELECT * FROM feedbacks
      ORDER BY created_at DESC
      LIMIT 10
    `);

    return {
      totalFeedbacks: parseInt(statsResult.rows[0].total_feedbacks),
      averageRating: parseFloat(statsResult.rows[0].average_rating) || 0,
      ratingDistribution,
      recentFeedbacks: recentResult.rows
    };
  } finally {
    client.release();
  }
}

export async function verifyAdminUser(username: string, password: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT password_hash FROM admin_users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return false;
    }

    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, result.rows[0].password_hash);
  } finally {
    client.release();
  }
}

export default pool;