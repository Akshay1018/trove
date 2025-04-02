import Router from '@koa/router';

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

export { router as healthRoutes }; 