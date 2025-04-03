import { Command } from 'commander';
import inquirer from 'inquirer';
import { TemplateManager } from '../utils/template-manager';
import { logger } from '../utils/logger';

interface CreateCommandOptions {
  defaultFramework?: string;
  defaultDatabase?: string;
}

export function createCommand(program: Command, options: CreateCommandOptions = {}): void {
  program
    .command('create')
    .description('Create a new Node.js application')
    .argument('[name]', 'Project name')
    .action(async (name) => {
      try {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            default: name || 'my-node-app',
            when: !name,
            validate: (input: string) => {
              if (/^[a-z0-9-]+$/.test(input)) return true;
              return 'Project name may only contain lowercase letters, numbers, and dashes';
            }
          },
          {
            type: 'list',
            name: 'framework',
            message: 'Which framework would you like to use?',
            default: options.defaultFramework || 'express',
            choices: [
              'express',
              'koa',
              'nestjs',
              'fastify'
            ]
          },
          {
            type: 'list',
            name: 'database',
            message: 'Which database would you like to use?',
            default: options.defaultDatabase || 'mongodb',
            choices: [
              'mongodb',
              'postgresql',
              'mysql',
              'skip'
            ]
          },
          {
            type: 'list',
            name: 'auth',
            message: 'Which authentication method would you like to use?',
            choices: [
              'jwt',
              'session',
              'oauth',
              'skip'
            ]
          }
        ]);

        const templateManager = new TemplateManager();
        await templateManager.createProject(name || answers.projectName, {
          framework: answers.framework,
          database: answers.database,
          auth: answers.auth
        });

      } catch (error) {
        logger.error('Failed to create project:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });
} 