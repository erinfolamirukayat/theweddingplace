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
    getMyRegistries
} from '../controllers/registries';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Registry CRUD operations
router.get('/', getAllRegistries);
router.get('/my', authenticateJWT, getMyRegistries);
router.get('/:id', getRegistryById);
router.post('/', authenticateJWT, createRegistry);
router.put('/:id', updateRegistry);
router.delete('/:id', deleteRegistry);

// Registry items operations
router.get('/:id/items', getRegistryItems);
router.post('/:id/items', addRegistryItem);
router.delete('/:id/items/:itemId', removeRegistryItem);

// Registry pictures operations
router.get('/:id/pictures', getRegistryPictures);
router.post('/:id/pictures', addRegistryPicture);
router.delete('/:id/pictures/:pictureId', removeRegistryPicture);

// New route to get a registry by share_url
router.get('/share/:shareUrl', getRegistryByShareUrl);

export default router; 