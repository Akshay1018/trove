import { Framework, Database, Auth, PackageInfo } from '../types/base';

export interface FrameworkDependencies {
  core: PackageInfo[];
  database: Partial<Record<Database, PackageInfo[]>>;
  auth: Partial<Record<Auth, PackageInfo[]>>;
  development: PackageInfo[];
  testing: PackageInfo[];
}

export type DependencyRegistry = Record<Framework, FrameworkDependencies>;

export interface DependencyResolutionOptions {
  framework: Framework;
  database?: Database;
  auth?: Auth;
  includeDev?: boolean;
}

export interface ResolvedDependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
} 

export { PackageInfo };
