import express from 'express';
import { register, login, getMe, updateMe, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../controllers/auth';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', authenticateJWT, resendVerification);
router.get('/users/me', authenticateJWT, getMe);
router.put('/users/me', authenticateJWT, updateMe);

export default router; 