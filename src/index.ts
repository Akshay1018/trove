#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create';
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

createCommand(program);

program.parse(); 