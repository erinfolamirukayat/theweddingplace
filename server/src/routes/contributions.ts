import express from 'express';
import { createContribution } from '../controllers/contributions';

const router = express.Router();

// POST /api/contributions
router.post('/', createContribution);

export default router; 