import { Request, Response } from 'express';
import { pool } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, how_heard } = req.body;
  if (!email || !password || !first_name || !last_name || !how_heard) {
    return res.status(400).json({ error: 'All fields are required' });
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
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, how_heard FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { first_name, last_name, how_heard } = req.body;
  if (!first_name || !last_name || !how_heard) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, how_heard = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, how_heard',
      [first_name, last_name, how_heard, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 