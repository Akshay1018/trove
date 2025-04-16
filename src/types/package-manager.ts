import { Framework } from './template';

export interface Dependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export type DependencyRegistry = Record<Framework, Dependencies>;

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export interface PackageManagerCommands {
  install: string;
  add: string;
  addDev: string;
  remove: string;
  run: string;
}

export const PACKAGE_MANAGER_COMMANDS: Record<PackageManager, PackageManagerCommands> = {
  npm: {
    install: 'npm install',
    add: 'npm install',
    addDev: 'npm install -D',
    remove: 'npm uninstall',
    run: 'npm run'
  },
  yarn: {
    install: 'yarn',
    add: 'yarn add',
    addDev: 'yarn add -D',
    remove: 'yarn remove',
    run: 'yarn'
  },
  pnpm: {
    install: 'pnpm install',
    add: 'pnpm add',
    addDev: 'pnpm add -D',
    remove: 'pnpm remove',
    run: 'pnpm'
  }
}; 