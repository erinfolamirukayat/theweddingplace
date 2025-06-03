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

        const result = await pool.query(
            `INSERT INTO survey_responses (
                name, email, age_range, relationship_status, wedding_planning_status,
                received_unwanted_gifts, known_registry_platforms, registry_usefulness,
                would_use_platform, desired_gifts, preferred_shopping_method,
                other_shopping_method, desired_features, open_to_conversation, contact_info
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                name, email, age_range, relationship_status, wedding_planning_status,
                received_unwanted_gifts, known_registry_platforms, registry_usefulness,
                would_use_platform, desired_gifts, preferred_shopping_method,
                other_shopping_method, desired_features, open_to_conversation, contact_info
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 