#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import { createCommand } from './commands/create';

const program = new Command();

program
  .name('trove')
  .description('A CLI tool for creating modern Node.js backend applications')
  .version(version);

program
  .command('create [project-name]')
  .description('Create a new Node.js backend project')
  .option('-f, --framework <framework>', 'Framework to use (express, koa, nestjs, fastify)')
  .option('-d, --database <database>', 'Database to use (mongodb, postgres, mysql)')
  .option('-a, --auth <auth>', 'Authentication method (jwt, session, oauth)')
  .option('-c, --ci <ci>', 'CI/CD platform (github, gitlab, bitbucket, jenkins)')
  .option('--skip-tests', 'Skip generating test files and test configuration')
  .action(async (projectName, cmdOptions) => {
    try {
      await createCommand(program, {
        projectName,
        defaultFramework: cmdOptions.framework,
        defaultDatabase: cmdOptions.database,
        defaultAuth: cmdOptions.auth,
        defaultCI: cmdOptions.ci,
        skipTests: cmdOptions.skipTests
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv); 