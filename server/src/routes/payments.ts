import express from 'express';
import {
    initiatePayment,
    verifyPayment,
    getPaymentHistory
} from '../controllers/payments';

const router = express.Router();

// Payment operations
router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);
router.get('/history/:registryItemId', getPaymentHistory);

export default router; 