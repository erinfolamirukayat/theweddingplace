import { Request, Response } from 'express';
import { pool } from '../index';

export const submitSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            email,
            relationship_status,
            given_gift,
            received_unwanted_gift,
            gift_ease,
            would_use_registry,
            share_link_method,
            culture_show_gift,
            culture_associate_gift,
            open_to_conversation,
            phone_number,
            additional_comments
        } = req.body;

        // Validation for required fields
        if (!name || !relationship_status || !given_gift || !received_unwanted_gift || !gift_ease || !would_use_registry || !share_link_method || !culture_show_gift || !open_to_conversation) {
            res.status(400).json({ error: 'Please fill in all required fields.' });
            return;
        }

        const shareLinkMethodStr = Array.isArray(share_link_method)
            ? share_link_method.join(', ')
            : share_link_method;

        const phoneNumberValue = phone_number && phone_number.trim() !== '' ? phone_number : null;
        const additionalCommentsValue = additional_comments && additional_comments.trim() !== '' ? additional_comments : null;

        const query = `INSERT INTO survey_responses (
            name, email, relationship_status, given_gift, received_unwanted_gift, gift_ease, would_use_registry, share_link_method, culture_show_gift, culture_associate_gift, open_to_conversation, phone_number, additional_comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;

        const values = [
            name, email, relationship_status, given_gift, received_unwanted_gift, gift_ease, would_use_registry, shareLinkMethodStr, culture_show_gift, culture_associate_gift, open_to_conversation, phoneNumberValue, additionalCommentsValue
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 