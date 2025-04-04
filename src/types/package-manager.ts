import { Framework } from './template';

export interface Dependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export type DependencyRegistry = Record<Framework, Dependencies>; 