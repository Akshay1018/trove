#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import { createCommand } from './commands/create';

const program = new Command();

program
  .name('trove')
  .description('A CLI tool for creating modern Node.js backend applications')
  .version(version);

// Add commands
createCommand(program, {
  defaultFramework: 'express',
  defaultDatabase: 'mongodb'
});

program.parse(process.argv); 