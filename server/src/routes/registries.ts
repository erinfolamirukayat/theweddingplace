import express from 'express';
import {
    getAllRegistries,
    getRegistryById,
    createRegistry,
    updateRegistry,
    deleteRegistry,
    getRegistryItems,
    addRegistryItem,
    removeRegistryItem,
    getRegistryPictures,
    addRegistryPicture,
    removeRegistryPicture,
    getRegistryByShareUrl,
    getMyRegistries,
    getRegistryItemByShareUrl
} from '../controllers/registries';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// New route to get a registry by share_slug
router.get('/share/:shareSlug', getRegistryByShareUrl);

// Add this route with the other registry routes
router.get('/share/:shareSlug/items/:itemId', getRegistryItemByShareUrl);

// Registry CRUD operations
router.get('/', getAllRegistries);
router.get('/mine', authenticateJWT, getMyRegistries); // Specific route first
router.get('/:id', authenticateJWT, getRegistryById);
router.post('/', authenticateJWT, createRegistry);
router.put('/:id', authenticateJWT, updateRegistry);
router.delete('/:id', authenticateJWT, deleteRegistry);

// Registry items operations
router.get('/:id/items', getRegistryItems);
router.post('/:id/items', authenticateJWT, addRegistryItem);
router.delete('/:id/items/:itemId', authenticateJWT, removeRegistryItem);

// Registry pictures operations
router.get('/:id/pictures', getRegistryPictures);
router.post('/:id/pictures', authenticateJWT, addRegistryPicture);
router.delete('/:id/pictures/:pictureId', authenticateJWT, removeRegistryPicture);

export default router; 