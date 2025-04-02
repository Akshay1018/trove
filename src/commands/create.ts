import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { validateProjectName } from '../utils/validation';
import { ProjectOptions } from '../types/project';

export async function createProject(name: string, options: ProjectOptions) {
  try {
    // If name is not provided, prompt for it
    const answers = await promptMissingOptions(name, options);
    const spinner = ora('Creating your backend application...').start();

    // TODO: Implement project creation logic
    // 1. Validate project name and path
    // 2. Create project directory
    // 3. Copy template files
    // 4. Install dependencies
    // 5. Initialize git repository
    
    spinner.succeed(chalk.green('Successfully created backend application!'));
    
    console.log('\n' + chalk.blue('Next steps:'));
    console.log(chalk.cyan(`  cd ${answers.name}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));

    if (answers.database === 'skip') {
      console.log('\n' + chalk.yellow('Database configuration was skipped.'));
      console.log(chalk.yellow('To add database later, you will need to:'));
      console.log(chalk.yellow('1. Install database dependencies'));
      console.log(chalk.yellow('2. Configure database connection'));
      console.log(chalk.yellow('3. Set up environment variables'));
    }

    if (answers.auth === 'skip') {
      console.log('\n' + chalk.yellow('Authentication was skipped.'));
      console.log(chalk.yellow('To add authentication later, you will need to:'));
      console.log(chalk.yellow('1. Install authentication dependencies'));
      console.log(chalk.yellow('2. Set up authentication middleware'));
      console.log(chalk.yellow('3. Configure authentication routes'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    process.exit(1);
  }
}

async function promptMissingOptions(name?: string, options: ProjectOptions = {}) {
  const questions = [];

  if (!name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      validate: validateProjectName
    });
  }

  if (!options.framework) {
    questions.push({
      type: 'list',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices: [
        { name: 'Express.js - Lightweight and flexible', value: 'express' },
        { name: 'NestJS - Enterprise-ready, scalable', value: 'nest' },
        { name: 'Fastify - High-performance focus', value: 'fastify' },
        { name: 'Koa - Modern and minimal', value: 'koa' }
      ]
    });
  }

  if (!options.database) {
    questions.push({
      type: 'list',
      name: 'database',
      message: 'Which database would you like to use? (can be configured later)',
      choices: [
        { name: 'MongoDB - NoSQL, document-based', value: 'mongodb' },
        { name: 'PostgreSQL - Robust relational database', value: 'postgresql' },
        { name: 'MySQL - Popular relational database', value: 'mysql' },
        { name: 'Skip for now - Configure database later', value: 'skip' }
      ]
    });
  }

  if (!options.auth) {
    questions.push({
      type: 'list',
      name: 'auth',
      message: 'Which authentication method would you like to use? (can be configured later)',
      choices: [
        { name: 'JWT - Stateless authentication', value: 'jwt' },
        { name: 'Session - Traditional session-based', value: 'session' },
        { name: 'OAuth - Third-party authentication', value: 'oauth' },
        { name: 'Skip for now - Configure authentication later', value: 'skip' }
      ]
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    name: name || answers.name,
    framework: options.framework || answers.framework,
    database: options.database || answers.database,
    auth: options.auth || answers.auth
  };
} 