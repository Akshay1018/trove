#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { createProject } from './commands/create';
import { version } from '../package.json';

const program = new Command();

program
  .name('trove')
  .description('A modern CLI tool for creating Node.js applications with best practices')
  .version(version);

program
  .command('create')
  .description('Create a new Node.js application')
  .argument('[name]', 'Project name')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--skip-db', 'Skip database configuration')
  .option('--skip-auth', 'Skip authentication setup')
  .action(async (name, options) => {
    const spinner = ora();
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          default: name || 'my-node-app',
          when: !name,
          validate: (input) => {
            if (/^[a-z0-9-]+$/.test(input)) return true;
            return 'Project name may only contain lowercase letters, numbers, and dashes';
          }
        },
        {
          type: 'list',
          name: 'framework',
          message: 'Which framework would you like to use?',
          choices: [
            { name: 'Express.js - Fast, unopinionated, minimalist', value: 'express' },
            { name: 'Koa.js - Modern, lightweight, composable', value: 'koa' },
            { name: 'NestJS - Progressive, enterprise-ready', value: 'nest' },
            { name: 'Fastify - Fast and low overhead', value: 'fastify' }
          ]
        },
        {
          type: 'list',
          name: 'database',
          message: 'Which database would you like to use?',
          when: !options.skipDb,
          choices: [
            { name: 'MongoDB - Document database', value: 'mongodb' },
            { name: 'PostgreSQL - Relational database', value: 'postgres' },
            { name: 'MySQL - Relational database', value: 'mysql' },
            { name: 'None', value: null }
          ]
        },
        {
          type: 'list',
          name: 'auth',
          message: 'Which authentication method would you like to use?',
          when: !options.skipAuth,
          choices: [
            { name: 'JWT - JSON Web Tokens', value: 'jwt' },
            { name: 'Session Based', value: 'session' },
            { name: 'OAuth 2.0', value: 'oauth' },
            { name: 'None', value: null }
          ]
        },
        {
          type: 'confirm',
          name: 'cicd',
          message: 'Would you like to set up CI/CD?',
          default: true
        },
        {
          type: 'list',
          name: 'cicdPlatform',
          message: 'Which CI/CD platform would you like to use?',
          when: (answers) => answers.cicd,
          choices: [
            { name: 'GitHub Actions', value: 'github' },
            { name: 'GitLab CI', value: 'gitlab' },
            { name: 'Bitbucket Pipelines', value: 'bitbucket' }
          ]
        }
      ]);

      const config = {
        ...answers,
        name: name || answers.projectName,
        skipDb: options.skipDb,
        skipAuth: options.skipAuth
      };

      spinner.start('Creating your project...');
      await createProject(config);
      spinner.succeed(chalk.green('Project created successfully! 🚀'));

      console.log('\n' + chalk.cyan('Next steps:'));
      console.log(chalk.white(`  cd ${config.name}`));
      console.log(chalk.white('  npm install'));
      console.log(chalk.white('  npm run dev'));

      console.log('\n' + chalk.cyan('Available commands:'));
      console.log(chalk.white('  npm run dev      - Start development server'));
      console.log(chalk.white('  npm run build    - Build for production'));
      console.log(chalk.white('  npm run test     - Run tests'));
      console.log(chalk.white('  npm run lint     - Lint code'));
      console.log(chalk.white('  npm run format   - Format code'));

      if (config.cicd) {
        console.log('\n' + chalk.cyan('CI/CD Setup:'));
        console.log(chalk.white(`  CI/CD configuration has been created for ${config.cicdPlatform}`));
        if (config.cicdPlatform === 'github') {
          console.log(chalk.white('  Check .github/workflows/ci.yml for the workflow configuration'));
        }
      }

    } catch (error) {
      spinner.fail(chalk.red('Failed to create project'));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(); 