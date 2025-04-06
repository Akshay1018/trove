import { buildApp } from './app';
import { config } from './config';

const start = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: config.port, host: config.host });
    app.log.info(`Server listening on ${config.host}:${config.port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start(); 