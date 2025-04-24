import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { TemplateManager } from '../utils/template-manager';
import { logger } from '../utils/logger';
import { Framework, Database, Auth, CI, TemplateOptions as ExternalTemplateOptions } from '../types/template';
import path from 'path';
import { TemplateOptions as ManagerTemplateOptions } from '../types/template-options';

interface CreateCommandOptions {
  defaultFramework?: string;
  defaultDatabase?: string;
  defaultAuth?: string;
  defaultCI?: string;
  projectName?: string;
}

interface Answers {
  projectName: string;
  framework: Framework;
  database: Database;
  auth: Auth;
  ci: CI;
}

export async function createCommand(program: Command, options: CreateCommandOptions = {}): Promise<void> {
  console.log(chalk.cyan('\n🚀 Welcome to Trove - Modern Node.js Backend Generator\n'));
  
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: chalk.green('What is your project name?'),
        default: options.projectName || 'my-node-app',
        when: !options.projectName,
        validate: (input: string) => {
          if (/^[a-z0-9-]+$/.test(input)) return true;
          return 'Project name may only contain lowercase letters, numbers, and dashes';
        }
      },
      {
        type: 'list',
        name: 'framework',
        message: chalk.green('Which framework would you like to use?'),
        default: options.defaultFramework || 'express',
        when: !options.defaultFramework,
        choices: [
          { name: chalk.blue('Express.js') + chalk.gray(' - Fast, unopinionated, minimalist web framework'), value: 'express' },
          { name: chalk.blue('Koa.js') + chalk.gray(' - Modern & lightweight web framework'), value: 'koa' },
          { name: chalk.blue('NestJS') + chalk.gray(' - Progressive Node.js framework for scalable apps'), value: 'nestjs' },
          { name: chalk.blue('Fastify') + chalk.gray(' - Fast and low overhead web framework'), value: 'fastify' }
        ]
      },
      {
        type: 'list',
        name: 'database',
        message: chalk.green('Which database would you like to use?'),
        default: options.defaultDatabase || 'mongodb',
        when: !options.defaultDatabase,
        choices: [
          { name: chalk.yellow('MongoDB') + chalk.gray(' - NoSQL database for modern apps'), value: 'mongodb' },
          { name: chalk.yellow('PostgreSQL') + chalk.gray(' - Advanced open source SQL database'), value: 'postgres' },
          { name: chalk.yellow('MySQL') + chalk.gray(' - Popular open source SQL database'), value: 'mysql' },
          { name: chalk.gray('Skip database setup'), value: 'skip' }
        ]
      },
      {
        type: 'list',
        name: 'auth',
        message: chalk.green('Which authentication method would you like to use?'),
        default: options.defaultAuth || 'jwt',
        when: !options.defaultAuth,
        choices: [
          { name: chalk.magenta('JWT') + chalk.gray(' - JSON Web Token based authentication'), value: 'jwt' },
          { name: chalk.magenta('Session') + chalk.gray(' - Traditional session-based auth'), value: 'session' },
          { name: chalk.magenta('OAuth') + chalk.gray(' - Social authentication (Google, GitHub, etc.)'), value: 'oauth' },
          { name: chalk.gray('Skip authentication setup'), value: 'skip' }
        ]
      },
      {
        type: 'list',
        name: 'ci',
        message: chalk.green('Which CI/CD platform would you like to use?'),
        default: options.defaultCI || 'github',
        when: !options.defaultCI,
        choices: [
          { name: chalk.cyan('GitHub Actions') + chalk.gray(' - Modern CI/CD for GitHub'), value: 'github' },
          { name: chalk.cyan('GitLab CI') + chalk.gray(' - Built-in CI/CD for GitLab'), value: 'gitlab' },
          { name: chalk.cyan('Bitbucket Pipelines') + chalk.gray(' - Integrated CI/CD for Bitbucket'), value: 'bitbucket' },
          { name: chalk.gray('Skip CI/CD setup'), value: 'skip' }
        ]
      }
    ]) as unknown as Answers;

    const spinner = ora({
      text: chalk.cyan('Creating your awesome project...'),
      spinner: 'dots'
    }).start();

    const projectName = options.projectName || answers.projectName;
    const projectPath = path.join(process.cwd(), projectName);
    const templateOptions: ManagerTemplateOptions = {
      framework: (options.defaultFramework as Framework) || answers.framework,
      database: (options.defaultDatabase as Database) || answers.database,
      auth: (options.defaultAuth as Auth) || answers.auth,
      ci: (options.defaultCI as CI) || answers.ci,
      projectName: projectName,
      description: `A modern Node.js backend application using ${answers.framework || options.defaultFramework}`,
      author: '',
      version: '1.0.0',
      license: 'MIT',
      packageManager: 'npm'
    };

    const templateManager = new TemplateManager(templateOptions, projectPath);

    await templateManager.createProject(projectName);

    spinner.succeed(chalk.green('Project created successfully! 🎉'));

    // Show next steps
    console.log('\n' + chalk.cyan.bold('Next steps:'));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev'));

    console.log('\n' + chalk.cyan.bold('Available commands:'));
    console.log(chalk.white('  npm run dev      ') + chalk.gray('- Start development server'));
    console.log(chalk.white('  npm run build    ') + chalk.gray('- Build for production'));
    console.log(chalk.white('  npm run test     ') + chalk.gray('- Run tests'));
    console.log(chalk.white('  npm run lint     ') + chalk.gray('- Lint code'));
    console.log(chalk.white('  npm run format   ') + chalk.gray('- Format code'));

    console.log('\n' + chalk.green.bold('Happy coding! 🚀\n'));

  } catch (error) {
    logger.error('Failed to create project:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
} 