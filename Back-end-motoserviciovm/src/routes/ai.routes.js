import { Router } from 'express';
import { postDiagnostic } from '../controllers/ai.controller.js';

const router = Router();

router.post('/diagnostic', postDiagnostic);

export default router;
