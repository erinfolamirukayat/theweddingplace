import { Request, Response } from 'express';
import { pool } from '../index';

export const submitSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            email,
            age_range,
            relationship_status,
            wedding_planning_status,
            received_unwanted_gifts,
            known_registry_platforms,
            registry_usefulness,
            would_use_platform,
            desired_gifts,
            preferred_shopping_method,
            other_shopping_method,
            desired_features,
            open_to_conversation,
            contact_info
        } = req.body;

        // Validation for required fields
        if (!name || !email || !age_range || !relationship_status || !wedding_planning_status || !registry_usefulness || !would_use_platform || !preferred_shopping_method || !open_to_conversation) {
            return res.status(400).json({ error: 'Please fill in all required fields.' });
        }

        const query = `INSERT INTO survey_responses (
            name, email, age_range, relationship_status, wedding_planning_status,
            received_unwanted_gifts, known_registry_platforms, registry_usefulness,
            would_use_platform, desired_gifts, preferred_shopping_method,
            other_shopping_method, desired_features, open_to_conversation, contact_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;

        const values = [
            name, email, age_range, relationship_status, wedding_planning_status,
            received_unwanted_gifts, known_registry_platforms, registry_usefulness,
            would_use_platform, desired_gifts, preferred_shopping_method,
            other_shopping_method, desired_features, open_to_conversation, contact_info
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 