import express from 'express';
import { submitSurvey } from '../controllers/survey';

const router = express.Router();

// Submit survey response
router.post('/', submitSurvey);

export default router; 