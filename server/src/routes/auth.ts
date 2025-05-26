import express from 'express';
import { register, login, getMe, updateMe } from '../controllers/auth';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/me', authenticateJWT, getMe);
router.put('/users/me', authenticateJWT, updateMe);

export default router; 