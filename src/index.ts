#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './commands/create';
import { version } from '../package.json';

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

program
  .command('create')
  .description('Create a new backend application')
  .argument('[name]', 'Name of the application')
  .option('-f, --framework <framework>', 'Framework to use (express, nest, fastify, koa)')
  .option('-d, --database <database>', 'Database to use (mongodb, postgresql, mysql)')
  .option('-a, --auth <auth>', 'Authentication method (jwt, session, oauth)')
  .action(createProject);

program.parse(); 