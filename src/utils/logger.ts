import chalk from 'chalk';

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(chalk.blue('info:'), message, ...args);
  },
  success: (message: string, ...args: any[]) => {
    console.log(chalk.green('success:'), message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.log(chalk.yellow('warn:'), message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(chalk.red('error:'), message, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('debug:'), message, ...args);
    }
  }
}; 