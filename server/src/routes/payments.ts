import express from 'express';
import {
    initiatePayment,
    verifyPayment,
    getPaymentHistory,
    handlePaystackWebhook
} from '../controllers/payments';

const router = express.Router();

// Payment operations
router.post('/initiate', initiatePayment);
router.get('/verify', verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handlePaystackWebhook);
router.get('/history/:registryItemId', getPaymentHistory);

export default router; 