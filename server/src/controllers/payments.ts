import { Request, Response } from 'express';
import { pool } from '../index';
import { PaystackService } from '../services/paystack';
import crypto from 'crypto';

// Initialize payment
export const initiatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { registry_item_id, name, email, amount, message } = req.body;

        // Get registry item details
        const registryItemResult = await pool.query(
            `SELECT ri.*, p.price, p.name as product_name 
             FROM registry_items ri 
             JOIN products p ON ri.product_id = p.id 
             WHERE ri.id = $1`,
            [registry_item_id]
        );

        if (registryItemResult.rows.length === 0) {
            res.status(404).json({ error: 'Registry item not found' });
            return;
        }

        const registryItem = registryItemResult.rows[0];
        const remainingAmount = registryItem.price - registryItem.contributions_received;

        if (amount > remainingAmount) {
            res.status(400).json({ error: 'Amount exceeds remaining balance' });
            return;
        }

        // Initialize Paystack transaction
        const paystackService = PaystackService.getInstance();
        const response = await paystackService.initializeTransaction({
            email,
            amount,
            metadata: {
                registry_item_id,
                name,
                email,
                message
            }
        });

        res.json(response);
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify payment
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reference } = req.query;

        if (!reference) {
            res.status(400).json({ error: 'Payment reference is required' });
            return;
        }

        // Check if the payment already exists in the database
        const existing = await pool.query(
            'SELECT * FROM contributors WHERE payment_reference = $1',
            [reference]
        );
        if (existing.rows.length > 0) {
            res.json({ status: 'success', data: existing.rows[0] });
            return;
        }

        // If not, verify with Paystack and insert as before
        const paystackService = PaystackService.getInstance();
        const response = await paystackService.verifyTransaction(reference as string);

        // The top-level `status` from Paystack is a boolean. The transaction status is in `data.status`.
        if (response.status && response.data.status === 'success') {
            const { metadata, amount } = response.data;
            const { registry_item_id, name, email, message } = metadata;

            try {
                const result = await pool.query(
                    `INSERT INTO contributors 
                    (registry_item_id, name, email, amount, message, payment_reference, status) 
                    VALUES ($1, $2, $3, $4, $5, $6, 'completed') 
                    RETURNING *`,
                    [registry_item_id, name, email, amount / 100, message, response.data.reference]
                );

                await pool.query(
                    `UPDATE registry_items 
                    SET contributions_received = contributions_received + $1,
                        is_fully_funded = CASE 
                            WHEN contributions_received + $1 >= (
                                SELECT price 
                                FROM products 
                                WHERE id = (
                                    SELECT product_id 
                                    FROM registry_items 
                                    WHERE id = $2
                                )
                            ) THEN true 
                            ELSE false 
                        END
                    WHERE id = $2`,
                    [amount / 100, registry_item_id]
                );

                res.json({ status: 'success', data: result.rows[0] });
            } catch (err: any) {
                // If unique violation, fetch and return the existing record
                if (err.code === '23505') { // Postgres unique violation
                    const existing = await pool.query(
                        'SELECT * FROM contributors WHERE payment_reference = $1',
                        [reference]
                    );
                    res.json({ status: 'success', data: existing.rows[0] });
                } else {
                    throw err;
                }
            }
        } else {
            res.status(400).json({ error: `Payment verification failed: ${response.message}` });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get payment history
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { registryItemId } = req.params;
        
        const result = await pool.query(
            'SELECT * FROM contributors WHERE registry_item_id = $1 ORDER BY created_at DESC',
            [registryItemId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle Paystack webhook
export const handlePaystackWebhook = async (req: Request, res: Response): Promise<void> => {
    console.log('Received Paystack webhook:', JSON.stringify(req.body, null, 2));
    try {
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            console.log('Invalid Paystack signature:', hash, req.headers['x-paystack-signature']);
            res.status(400).json({ error: 'Invalid signature' });
            return;
        }

        const event = req.body;

        // Handle the event
        switch (event.event) {
            case 'charge.success':
                const { reference, metadata, amount } = event.data;
                const { registry_item_id, name, email, message } = metadata;

                // Record contribution
                try {
                    const result = await pool.query(
                        `INSERT INTO contributors 
                        (registry_item_id, name, email, amount, message, payment_reference, status) 
                        VALUES ($1, $2, $3, $4, $5, $6, 'completed') 
                        RETURNING *`,
                        [registry_item_id, name, email, amount / 100, message, reference]
                    );

                    // Update registry item contributions
                    await pool.query(
                        `UPDATE registry_items 
                        SET contributions_received = contributions_received + $1,
                            is_fully_funded = CASE 
                                WHEN contributions_received + $1 >= (
                                    SELECT price 
                                    FROM products 
                                    WHERE id = (
                                        SELECT product_id 
                                        FROM registry_items 
                                        WHERE id = $2
                                    )
                                ) THEN true 
                                ELSE false 
                            END
                        WHERE id = $2`,
                        [amount / 100, registry_item_id]
                    );

                    res.json({ status: 'success' });
                } catch (dbError) {
                    console.error('DB Insert Error:', dbError);
                    res.status(500).json({ error: 'Internal server error' });
                }
                break;

            case 'charge.failed':
                // Handle failed payment
                const failedRef = event.data.reference;
                await pool.query(
                    `UPDATE contributors 
                    SET status = 'failed' 
                    WHERE payment_reference = $1`,
                    [failedRef]
                );
                res.json({ status: 'success' });
                break;

            default:
                res.json({ status: 'success' });
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 