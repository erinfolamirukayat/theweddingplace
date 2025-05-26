import { Request, Response } from 'express';
import { pool } from '../index';
import { Product } from '../types';

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single product
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, category, description, price, image_url, suggested_amount } = req.body;
        
        const result = await pool.query(
            'INSERT INTO products (name, category, description, price, image_url, suggested_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, category, description, price, image_url, suggested_amount]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, description, price, image_url, suggested_amount } = req.body;
        
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, price = $4, image_url = $5, suggested_amount = $6 WHERE id = $7 RETURNING *',
            [name, category, description, price, image_url, suggested_amount, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 