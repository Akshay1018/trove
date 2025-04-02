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
        { name: 'Express.js', value: 'express' },
        { name: 'NestJS', value: 'nest' },
        { name: 'Fastify', value: 'fastify' },
        { name: 'Koa', value: 'koa' }
      ]
    });
  }

  if (!options.database) {
    questions.push({
      type: 'list',
      name: 'database',
      message: 'Which database would you like to use?',
      choices: [
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' }
      ]
    });
  }

  if (!options.auth) {
    questions.push({
      type: 'list',
      name: 'auth',
      message: 'Which authentication method would you like to use?',
      choices: [
        { name: 'JWT', value: 'jwt' },
        { name: 'Session', value: 'session' },
        { name: 'OAuth', value: 'oauth' }
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