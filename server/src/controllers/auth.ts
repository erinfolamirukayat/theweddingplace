import { Request, Response } from 'express';
import { pool } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, first_name, last_name, how_heard } = req.body;
  if (!email || !password || !first_name || !last_name || !how_heard) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, how_heard) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, created_at, first_name, last_name, how_heard',
      [email, hashed, first_name, last_name, how_heard]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Registration error:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, how_heard FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { first_name, last_name, how_heard } = req.body;
  if (!first_name || !last_name || !how_heard) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, how_heard = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, how_heard',
      [first_name, last_name, how_heard, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Return 200 even if user does not exist for security reasons (don't leak emails)
      res.json({ message: 'If that email exists in our system, a reset link has been sent.' });
      return;
    }

    const userId = userResult.rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing reset tokens for this user first
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

    // Insert new token
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    // Construct reset link
    const frontendUrl = process.env.FRONTEND_URL || 'https://theweddingplace.netlify.app';
    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send the email
    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'If that email exists in our system, a reset link has been sent.' });
  } catch (err) {
    console.error('ForgotPassword error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    // Fetch token details
    const result = await pool.query(
      `SELECT prt.*, u.id as user_id 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE u.email = $1 AND prt.token = $2 AND prt.expires_at > $3`,
      [email, token, new Date()]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    const userId = result.rows[0].user_id;
    const hashed = await bcrypt.hash(password, 10);

    // Update password in users table
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, userId]);

    // Clean up reset token
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('ResetPassword error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 