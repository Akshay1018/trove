#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create';
import { version } from '../package.json';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { connectDatabase } from './config/database';

const program = new Command();

console.log(chalk.blue(`
╔═══════════════════════════════════════════╗
║         Create Backend App CLI            ║
╚═══════════════════════════════════════════╝
`));

program
  .name('create-backend-app')
  .description('CLI tool to create backend applications with various frameworks')
  .version(version);

createCommand(program);

program.parse();

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDatabase().catch((error) => {
  logger.error('Failed to connect to database:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to your Express.js API!' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 