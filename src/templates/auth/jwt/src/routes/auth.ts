import Router from '@koa/router';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = new Router({ prefix: '/auth' });

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticate, AuthController.me);

export { router }; 