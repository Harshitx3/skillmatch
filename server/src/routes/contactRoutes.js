import { Router } from 'express';
const router = Router();
import { sendContactEmail } from '../controllers/contactController.js';

router.post('/contact', sendContactEmail);

export default router;