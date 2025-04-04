import { Pool } from 'pg';
import { logger } from '../utils/logger';

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || '<%= projectName %>',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    client.release();
    logger.info('Connected to PostgreSQL database');
  } catch (error) {
    logger.error('Error connecting to PostgreSQL database:', error);
    throw error;
  }
}

export { pool }; 