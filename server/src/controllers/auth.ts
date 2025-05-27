import { Request, Response } from 'express';
import { pool } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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