import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { createConnection } from 'typeorm';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test-project';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

// PostgreSQL Connection
export const connectPostgres = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'test-project',
    logging: (msg) => logger.debug(msg),
  });

  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connected successfully');
    return sequelize;
  } catch (error) {
    logger.error('PostgreSQL connection error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

// MySQL Connection
export const connectMySQL = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'test-project',
    logging: (msg) => logger.debug(msg),
  });

  try {
    await sequelize.authenticate();
    logger.info('MySQL connected successfully');
    return sequelize;
  } catch (error) {
    logger.error('MySQL connection error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

// TypeORM Connection (for NestJS)
export const connectTypeORM = async () => {
  try {
    const connection = await createConnection({
      type: process.env.DB_TYPE as 'postgres' | 'mysql' | 'mongodb' || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'test-project',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
    });
    logger.info('TypeORM connected successfully');
    return connection;
  } catch (error) {
    logger.error('TypeORM connection error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

// Export a generic connect function that will be used based on the database type
export const connectDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'mongodb';
  
  switch (dbType.toLowerCase()) {
    case 'mongodb':
      return connectMongoDB();
    case 'postgres':
      return connectPostgres();
    case 'mysql':
      return connectMySQL();
    case 'typeorm':
      return connectTypeORM();
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}; 