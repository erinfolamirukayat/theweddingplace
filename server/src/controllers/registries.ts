import { Request, Response } from 'express';
import { pool } from '../index';
import { Registry, RegistryItem, RegistryPicture } from '../types';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

function generateUniqueId(length: number = 4): string {
  return crypto.randomBytes(length).toString('hex');
}

function generateSlug(coupleNames: string): string {
  let base = coupleNames
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-');
  const unique = generateUniqueId(2);
  return `${base}-${unique}`;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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
        const { uuid } = req.params;
        const result = await pool.query('SELECT * FROM registries WHERE uuid = $1', [uuid]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        
        const registry = result.rows[0];
        const userId = (req as any).user?.userId;
        if (Number(registry.user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }

        res.json(registry);
    } catch (error) {
        console.error('Error fetching registry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new registry
export const createRegistry = async (req: Request, res: Response): Promise<void> => {
    try {
        const { couple_names, ...rest } = req.body;
        const coupleParts = couple_names.split(' & ');
        const brideFirst = coupleParts[0] ? coupleParts[0].trim().split(' ')[0] : '';
        const groomFirst = coupleParts[1] ? coupleParts[1].trim().split(' ')[0] : '';
        const namesForSlug = (brideFirst && groomFirst) ? `${brideFirst} and ${groomFirst}` : couple_names;
        let baseSlug = slugify(namesForSlug);
        let slug = baseSlug;
        
        let exists = await pool.query('SELECT 1 FROM registries WHERE share_slug = $1', [slug]);
        if (exists.rows.length > 0) {
            slug = baseSlug + '-' + generateUniqueId(2);
            exists = await pool.query('SELECT 1 FROM registries WHERE share_slug = $1', [slug]);
            while (exists.rows.length > 0) {
                slug = baseSlug + '-' + generateUniqueId(3);
                exists = await pool.query('SELECT 1 FROM registries WHERE share_slug = $1', [slug]);
            }
        }
        const user_id = (req as any).user?.userId; // from JWT

        const result = await pool.query(
            'INSERT INTO registries (couple_names, wedding_date, story, share_slug, user_id, phone, wedding_city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [couple_names, rest.wedding_date, rest.story, slug, user_id, rest.phone, rest.wedding_city]
        );
        const registry = result.rows[0];

        if (rest.photo_url) {
            await pool.query(
                'INSERT INTO registry_pictures (registry_id, image_url) VALUES ($1, $2)',
                [registry.id, rest.photo_url]
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
        const { uuid } = req.params;
        const { couple_names, wedding_date, story, phone, wedding_city } = req.body;
        const userId = (req as any).user?.userId;

        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }

        const result = await pool.query(
            'UPDATE registries SET couple_names = $1, wedding_date = $2, story = $3, phone = $4, wedding_city = $5 WHERE uuid = $6 RETURNING *',
            [couple_names, wedding_date, story, phone, wedding_city, uuid]
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
        const { uuid } = req.params;
        const userId = (req as any).user?.userId;

        const regCheck = await pool.query('SELECT user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }

        const result = await pool.query('DELETE FROM registries WHERE uuid = $1 RETURNING *', [uuid]);
        
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
        const { uuid } = req.params;
        const result = await pool.query(
            `SELECT ri.*, p.name, p.description, p.price, p.image_url, p.suggested_amount 
             FROM registry_items ri 
             JOIN products p ON ri.product_id = p.id 
             JOIN registries r ON ri.registry_id = r.id
             WHERE r.uuid = $1`,
            [uuid]
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
        const { uuid } = req.params;
        const { product_id, quantity } = req.body;
        const userId = (req as any).user?.userId;

        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }
        
        const internalId = regCheck.rows[0].id;
        const result = await pool.query(
            'INSERT INTO registry_items (registry_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [internalId, product_id, quantity]
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
        const { uuid, itemId } = req.params;
        const userId = (req as any).user?.userId;

        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }

        const internalId = regCheck.rows[0].id;
        const result = await pool.query(
            'DELETE FROM registry_items WHERE id = $1 AND registry_id = $2 RETURNING *',
            [itemId, internalId]
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
        const { uuid } = req.params;
        const result = await pool.query(
            `SELECT rp.* FROM registry_pictures rp 
             JOIN registries r ON rp.registry_id = r.id 
             WHERE r.uuid = $1 ORDER BY rp.created_at DESC`,
            [uuid]
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
        const { uuid } = req.params;
        const { image_url } = req.body;
        const userId = (req as any).user?.userId;

        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }
        
        const internalId = regCheck.rows[0].id;
        const result = await pool.query(
            'INSERT INTO registry_pictures (registry_id, image_url) VALUES ($1, $2) RETURNING *',
            [internalId, image_url]
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
        const { uuid, pictureId } = req.params;
        const imageUrl = decodeURIComponent(pictureId);
        const userId = (req as any).user?.userId;

        const regCheck = await pool.query('SELECT id, user_id FROM registries WHERE uuid = $1', [uuid]);
        if (regCheck.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        if (Number(regCheck.rows[0].user_id) !== Number(userId)) {
            res.status(403).json({ error: 'Unauthorized to access this registry' });
            return;
        }

        const internalId = regCheck.rows[0].id;
        const result = await pool.query(
            'DELETE FROM registry_pictures WHERE image_url = $1 AND registry_id = $2 RETURNING *',
            [imageUrl, internalId]
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
    try {
        const { shareSlug } = req.params;
        console.log('shareUrl param:', shareSlug);
        const result = await pool.query('SELECT * FROM registries WHERE share_slug = $1', [shareSlug]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registry not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching registry by slug:', error);
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
        const { shareSlug, itemId } = req.params;

        // First get the registry by share_slug
        const registryResult = await pool.query(
            'SELECT * FROM registries WHERE share_slug = $1',
            [shareSlug]
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

export const getRegistryByShareSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { share_slug } = req.params;
    const result = await pool.query('SELECT * FROM registries WHERE share_slug = $1', [share_slug]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Registry not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting registry by share_slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 