#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import { createCommand } from './commands/create';

const program = new Command();

program
  .name('create-node-backend-temp')
  .description('A CLI tool for creating modern Node.js backend applications')
  .version(version);

program
  .command('create [project-name]')
  .description('Create a new Node.js backend project')
  .action(async (projectName) => {
    try {
      await createCommand(program, { projectName });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv); 