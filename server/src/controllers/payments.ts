import { Request, Response } from 'express';
import { pool } from '../index';
import { PaystackService } from '../services/paystack';
import crypto from 'crypto';

/**
 * A private helper function to process a successful contribution.
 * This centralizes the database logic for both webhook and direct verification.
 * @param reference - The Paystack payment reference.
 * @param amountInKobo - The amount paid, in the smallest currency unit (kobo).
 * @param metadata - The metadata object from the transaction.
 * @returns The newly created contributor record.
 */
const _processSuccessfulContribution = async (
    reference: string,
    amountInKobo: number,
    metadata: { registry_item_id: string; name: string; email: string; message?: string }
) => {
    const { registry_item_id, name, email, message } = metadata;
    const amount = amountInKobo / 100; // Convert back to major currency unit (Naira)

    const result = await pool.query(
        `INSERT INTO contributors 
        (registry_item_id, name, email, amount, message, payment_reference, status) 
        VALUES ($1, $2, $3, $4, $5, $6, 'completed') 
        ON CONFLICT (payment_reference) DO NOTHING
        RETURNING *`,
        [registry_item_id, name, email, amount, message, reference]
    );

    // Only update the contributions if the insert was successful
    if (result.rows.length > 0) {
        await pool.query(
            `UPDATE registry_items 
            SET contributions_received = contributions_received + $1,
                is_fully_funded = (contributions_received + $1) >= price
            WHERE id = $2`,
            [amount, registry_item_id]
        );
    }
    return result.rows[0];
};

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
            try {
                const contribution = await _processSuccessfulContribution(
                    response.data.reference,
                    response.data.amount,
                    response.data.metadata
                );
                res.json({ status: 'success', data: contribution });
            } catch (dbError) {
                console.error('Error processing contribution in verifyPayment:', dbError);
                // Even if processing fails, the payment was successful. Avoid sending 500 if possible.
                res.status(200).json({ status: 'success', message: 'Payment verified but failed to update registry. Please contact support.' });
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
                try {
                    await _processSuccessfulContribution(
                        event.data.reference,
                        event.data.amount,
                        event.data.metadata
                    );
                    res.status(200).json({ status: 'received' });
                } catch (dbError) {
                    console.error('Webhook DB Insert Error:', dbError);
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
                res.status(200).json({ status: 'received' });
                break;

            default:
                res.status(200).json({ status: 'received' });
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 