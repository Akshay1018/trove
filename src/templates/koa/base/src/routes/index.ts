import Router from '@koa/router';
import { ExampleController } from '../controllers/example.controller';

const router = new Router();

// Health check
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' };
});

// Example routes
router.get('/examples', ExampleController.findAll);
router.get('/examples/:id', ExampleController.findById);
router.post('/examples', ExampleController.create);
router.put('/examples/:id', ExampleController.update);
router.delete('/examples/:id', ExampleController.delete);

export { router }; 