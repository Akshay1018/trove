import { Router } from 'express';
import healthRouter from './health.routes';
<% if (auth) { %>import authRouter from './auth.routes';<% } %>

const router = Router();

router.use('/health', healthRouter);
<% if (auth) { %>router.use('/auth', authRouter);<% } %>

export { router as routes }; 