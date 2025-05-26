import express from 'express';
import productRoutes from './products';
import registryRoutes from './registries';
import paymentRoutes from './payments';

const router = express.Router();

// Mount routes
router.use('/products', productRoutes);
router.use('/registries', registryRoutes);
router.use('/payments', paymentRoutes);

export default router; 