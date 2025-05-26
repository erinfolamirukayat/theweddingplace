import { Request, Response } from 'express';
import { pool } from '../index';
import axios from 'axios';
import { Contributor } from '../types';

// Initialize Paystack
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize payment
export const initiatePayment = async (req: Request, res: Response) => {
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
            return res.status(404).json({ error: 'Registry item not found' });
        }

        const registryItem = registryItemResult.rows[0];
        const remainingAmount = registryItem.price - registryItem.contributions_received;

        if (amount > remainingAmount) {
            return res.status(400).json({ error: 'Amount exceeds remaining balance' });
        }

        // Initialize Paystack transaction
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email,
                amount: amount * 100, // Convert to kobo
                callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
                metadata: {
                    registry_item_id,
                    name,
                    message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify payment
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { reference } = req.query;

        // Verify payment with Paystack
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const { status, data } = response.data;

        if (status === 'success') {
            const { metadata, amount } = data;
            const { registry_item_id, name, message } = metadata;

            // Record contribution
            const result = await pool.query(
                `INSERT INTO contributors 
                (registry_item_id, name, amount, message, payment_reference) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *`,
                [registry_item_id, name, amount / 100, message, reference]
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

            res.json({ status: 'success', data: result.rows[0] });
        } else {
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get payment history
export const getPaymentHistory = async (req: Request, res: Response) => {
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