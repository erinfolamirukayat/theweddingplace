import express from 'express';
import { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get a single product
router.get('/:id', getProductById);

// Create a new product
router.post('/', createProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

export default router; 