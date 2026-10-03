import { Request, Response } from 'express';
import { pool } from '../index';

export const getFulfillment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uuid } = req.params;
        const userId = (req as any).user?.userId;

        // Verify registry belongs to user
        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const registryId = regCheck.rows[0].id;

        const result = await pool.query(
            'SELECT * FROM registry_fulfillments WHERE registry_id = $1',
            [registryId]
        );

        if (result.rows.length === 0) {
            res.json({}); // Return empty object if no fulfillment exists yet
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error fetching fulfillment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateFulfillment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uuid } = req.params;
        const userId = (req as any).user?.userId;
        const { fulfillment_preference, post_wedding_date, bank_name, account_name, account_number } = req.body;

        // Verify registry belongs to user
        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const registryId = regCheck.rows[0].id;

        // Upsert fulfillment data
        const result = await pool.query(
            `INSERT INTO registry_fulfillments (registry_id, fulfillment_preference, post_wedding_date, bank_name, account_name, account_number)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (registry_id) 
             DO UPDATE SET 
                fulfillment_preference = EXCLUDED.fulfillment_preference,
                post_wedding_date = EXCLUDED.post_wedding_date,
                bank_name = EXCLUDED.bank_name,
                account_name = EXCLUDED.account_name,
                account_number = EXCLUDED.account_number,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [registryId, fulfillment_preference || null, post_wedding_date || null, bank_name || null, account_name || null, account_number || null]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating fulfillment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
