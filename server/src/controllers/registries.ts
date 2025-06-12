import { Request, Response } from 'express';
import { pool } from '../index';
import { Registry, RegistryItem, RegistryPicture } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Get all registries
export const getAllRegistries = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM registries ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching registries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single registry
export const getRegistryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM registries WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching registry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new registry
export const createRegistry = async (req: Request, res: Response): Promise<void> => {
    try {
        const { couple_names, wedding_date, story, photo_url, phone, wedding_city } = req.body;
        const share_url = uuidv4();
        const user_id = (req as any).user?.userId; // from JWT

        const result = await pool.query(
            'INSERT INTO registries (couple_names, wedding_date, story, share_url, user_id, phone, wedding_city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [couple_names, wedding_date, story, share_url, user_id, phone, wedding_city]
        );
        const registry = result.rows[0];

        if (photo_url) {
            await pool.query(
                'INSERT INTO registry_pictures (registry_id, image_url) VALUES ($1, $2)',
                [registry.id, photo_url]
            );
        }

        res.status(201).json(registry);
    } catch (error) {
        console.error('Error creating registry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a registry
export const updateRegistry = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { couple_names, wedding_date, story, phone, wedding_city } = req.body;
        const result = await pool.query(
            'UPDATE registries SET couple_names = $1, wedding_date = $2, story = $3, phone = $4, wedding_city = $5 WHERE id = $6 RETURNING *',
            [couple_names, wedding_date, story, phone, wedding_city, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating registry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a registry
export const deleteRegistry = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM registries WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        
        res.json({ message: 'Registry deleted successfully' });
    } catch (error) {
        console.error('Error deleting registry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get registry items
export const getRegistryItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT ri.*, p.name, p.description, p.price, p.image_url, p.suggested_amount 
             FROM registry_items ri 
             JOIN products p ON ri.product_id = p.id 
             WHERE ri.registry_id = $1`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching registry items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add item to registry
export const addRegistryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { product_id, quantity } = req.body;
        
        const result = await pool.query(
            'INSERT INTO registry_items (registry_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [id, product_id, quantity]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding registry item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove item from registry
export const removeRegistryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, itemId } = req.params;
        const result = await pool.query(
            'DELETE FROM registry_items WHERE id = $1 AND registry_id = $2 RETURNING *',
            [itemId, id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry item not found' });
            return;
        }
        
        res.json({ message: 'Registry item removed successfully' });
    } catch (error) {
        console.error('Error removing registry item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get registry pictures
export const getRegistryPictures = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM registry_pictures WHERE registry_id = $1 ORDER BY created_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching registry pictures:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add picture to registry
export const addRegistryPicture = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { image_url } = req.body;
        
        const result = await pool.query(
            'INSERT INTO registry_pictures (registry_id, image_url) VALUES ($1, $2) RETURNING *',
            [id, image_url]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding registry picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove picture from registry
export const removeRegistryPicture = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, pictureId } = req.params;
        const result = await pool.query(
            'DELETE FROM registry_pictures WHERE id = $1 AND registry_id = $2 RETURNING *',
            [pictureId, id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry picture not found' });
            return;
        }
        
        res.json({ message: 'Registry picture removed successfully' });
    } catch (error) {
        console.error('Error removing registry picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get registry by share_url
export const getRegistryByShareUrl = async (req: Request, res: Response): Promise<void> => {
    const { shareUrl } = req.params;
    try {
        const result = await pool.query('SELECT * FROM registries WHERE share_url = $1', [shareUrl]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMyRegistries = async (req: Request, res: Response): Promise<void> => {
    const user_id = (req as any).user?.userId;
    try {
        const result = await pool.query('SELECT * FROM registries WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRegistryItemByShareUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shareUrl, itemId } = req.params;

        // First get the registry by share URL
        const registryResult = await pool.query(
            'SELECT * FROM registries WHERE share_url = $1',
            [shareUrl]
        );

        if (registryResult.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }

        const registry = registryResult.rows[0];

        // Then get the item with its product details
        const itemResult = await pool.query(
            `SELECT ri.*, p.name, p.description, p.price, p.image_url
             FROM registry_items ri
             JOIN products p ON ri.product_id = p.id
             WHERE ri.id = $1 AND ri.registry_id = $2`,
            [itemId, registry.id]
        );

        if (itemResult.rows.length === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        res.json(itemResult.rows[0]);
    } catch (error) {
        console.error('Error getting registry item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 