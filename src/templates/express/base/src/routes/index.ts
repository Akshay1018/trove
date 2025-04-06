import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);

export default router; 