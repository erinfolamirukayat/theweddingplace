import { Request, Response } from 'express';
import { pool } from '../index';

export const createContribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registry_item_id, name, email, amount, message } = req.body;
    if (!registry_item_id || !name || !email || !amount) {
      res.status(400).json({ error: 'Missing required fields.' });
      return;
    }
    if (Number(amount) < 5000) {
      res.status(400).json({ error: 'Contribution amount must be at least ₦5,000.' });
      return;
    }
    // Insert into contributors with status 'initiated'
    const result = await pool.query(
      `INSERT INTO contributors (registry_item_id, name, email, amount, message, status) VALUES ($1, $2, $3, $4, $5, 'initiated') RETURNING *`,
      [registry_item_id, name, email, amount, message]
    );
    // Note: contributions_received is not updated here; it will be updated after payment verification
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 