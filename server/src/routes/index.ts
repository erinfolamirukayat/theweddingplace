import express from 'express';
import productRoutes from './products';
import registryRoutes from './registries';
import paymentRoutes from './payments';
import surveyRoutes from './survey';
import contributionsRoutes from './contributions';

const router = express.Router();

// Mount routes
router.use('/products', productRoutes);
router.use('/registries', registryRoutes);
router.use('/payments', paymentRoutes);
router.use('/survey', surveyRoutes);
router.use('/contributions', contributionsRoutes);

export default router; 