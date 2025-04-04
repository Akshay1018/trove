import Router from '@koa/router';

export function routes(router: Router) {
  // Root route
  router.get('/', (ctx) => {
    ctx.body = {
      message: 'Welcome to the API',
      version: '1.0.0'
    };
  });

  // Health check
  router.get('/health', (ctx) => {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  });

  // Add more routes here
} 