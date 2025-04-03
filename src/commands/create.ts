import { Command } from 'commander';
import inquirer from 'inquirer';
import { validateProjectName } from '../utils/validation';
import { TemplateManager } from '../utils/template-manager';
import { logger } from '../utils/logger';

interface CreateOptions {
  defaultFramework?: string;
  defaultDatabase?: string;
}

export function createCommand(program: Command, options: CreateOptions = {}) {
  program
    .command('create <project-name>')
    .description('Create a new backend application')
    .action(async (projectName: string) => {
      try {
        const answers = await promptForOptions();
        await createProject(projectName, answers);
      } catch (error) {
        logger.error('Failed to create project:', error);
        process.exit(1);
      }
    });
}

async function promptForOptions() {
  const questions: inquirer.Question[] = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      validate: (input: string) => {
        const result = validateProjectName(input);
        return result === true ? true : result;
      }
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices: [
        { name: 'Express.js', value: 'express' },
        { name: 'Koa.js', value: 'koa' },
        { name: 'NestJS', value: 'nest' },
        { name: 'Fastify', value: 'fastify' }
      ]
    },
    {
      type: 'list',
      name: 'database',
      message: 'Which database would you like to use?',
      choices: [
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'Skip database setup', value: 'skip' }
      ]
    },
    {
      type: 'list',
      name: 'auth',
      message: 'Which authentication method would you like to use?',
      choices: [
        { name: 'JWT', value: 'jwt' },
        { name: 'Session', value: 'session' },
        { name: 'OAuth', value: 'oauth' },
        { name: 'Skip authentication setup', value: 'skip' }
      ]
    }
  ];

  return inquirer.prompt(questions);
}

async function createProject(projectName: string, options: any) {
  const templateManager = new TemplateManager();
  await templateManager.createProject(projectName, options);
} 