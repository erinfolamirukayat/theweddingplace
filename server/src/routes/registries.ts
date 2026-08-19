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
router.get('/:uuid', authenticateJWT, getRegistryById);
router.post('/', authenticateJWT, createRegistry);
router.put('/:uuid', authenticateJWT, updateRegistry);
router.delete('/:uuid', authenticateJWT, deleteRegistry);

// Registry items operations
router.get('/:uuid/items', getRegistryItems);
router.post('/:uuid/items', authenticateJWT, addRegistryItem);
router.delete('/:uuid/items/:itemId', authenticateJWT, removeRegistryItem);

// Registry pictures operations
router.get('/:uuid/pictures', getRegistryPictures);
router.post('/:uuid/pictures', authenticateJWT, addRegistryPicture);
router.delete('/:uuid/pictures/:pictureId', authenticateJWT, removeRegistryPicture);

export default router; 