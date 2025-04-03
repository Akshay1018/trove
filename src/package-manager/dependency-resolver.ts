import { DependencyResolutionOptions, PackageInfo, ResolvedDependencies } from './types';
import { dependencyRegistry } from './registry';
import { logger } from '../utils/logger';

export class DependencyResolver {
  private dependencies: Map<string, PackageInfo>;
  private devDependencies: Map<string, PackageInfo>;

  constructor() {
    this.dependencies = new Map();
    this.devDependencies = new Map();
  }

  addDependency(pkg: PackageInfo, isDev = false): void {
    const target = isDev ? this.devDependencies : this.dependencies;
    if (!target.has(pkg.name)) {
      target.set(pkg.name, pkg);
    } else {
      logger.warn(`Package ${pkg.name} is already added as a ${isDev ? 'dev ' : ''}dependency`);
    }
  }

  addDependencies(packages: PackageInfo[], isDev = false): void {
    packages.forEach(pkg => this.addDependency(pkg, isDev));
  }

  getDependencies(): Record<string, string> {
    return this.mapToRecord(this.dependencies);
  }

  getDevDependencies(): Record<string, string> {
    return this.mapToRecord(this.devDependencies);
  }

  private mapToRecord(map: Map<string, PackageInfo>): Record<string, string> {
    const record: Record<string, string> = {};
    map.forEach((pkg, name) => {
      record[name] = pkg.version;
    });
    return record;
  }

  /**
   * Resolves dependencies based on the provided options
   * @param options The dependency resolution options
   * @returns The resolved dependencies
   */
  public resolveDependencies(options: DependencyResolutionOptions): ResolvedDependencies {
    const { framework, database, auth, includeDev = true } = options;
    const frameworkDeps = dependencyRegistry[framework];

    if (!frameworkDeps) {
      throw new Error(`Framework ${framework} not found in dependency registry`);
    }

    // Initialize result object
    const result: ResolvedDependencies = {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {}
    };

    // Add core dependencies
    frameworkDeps.core.forEach(dep => {
      result.dependencies[dep.name] = dep.version;
    });

    // Add database dependencies if specified
    if (database && database !== 'skip' && frameworkDeps.database[database]) {
      frameworkDeps.database[database].forEach(dep => {
        result.dependencies[dep.name] = dep.version;
      });
    }

    // Add auth dependencies if specified
    if (auth && auth !== 'skip' && frameworkDeps.auth[auth]) {
      frameworkDeps.auth[auth].forEach(dep => {
        result.dependencies[dep.name] = dep.version;
      });
    }

    // Add development dependencies if requested
    if (includeDev) {
      [...frameworkDeps.development, ...frameworkDeps.testing].forEach(dep => {
        result.devDependencies[dep.name] = dep.version;
      });
    }

    return result;
  }

  /**
   * Generates the package.json content based on resolved dependencies
   * @param options The dependency resolution options
   * @param projectName The name of the project
   * @returns The package.json content as a string
   */
  public generatePackageJson(options: DependencyResolutionOptions, projectName: string): string {
    const resolvedDeps = this.resolveDependencies(options);
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `A ${options.framework} application`,
      main: 'dist/index.js',
      scripts: {
        start: 'node dist/index.js',
        dev: 'ts-node-dev --respawn --transpile-only src/index.ts',
        build: 'tsc',
        test: 'jest',
        lint: 'eslint . --ext .ts',
        format: 'prettier --write "src/**/*.ts"'
      },
      keywords: [options.framework, 'typescript', 'node'],
      author: '',
      license: 'MIT',
      dependencies: resolvedDeps.dependencies,
      devDependencies: resolvedDeps.devDependencies,
      peerDependencies: resolvedDeps.peerDependencies
    };

    return JSON.stringify(packageJson, null, 2);
  }

  /**
   * Gets all available frameworks from the registry
   * @returns Array of framework names
   */
  public getAvailableFrameworks(): string[] {
    return Object.keys(dependencyRegistry);
  }

  /**
   * Gets all available databases for a given framework
   * @param framework The framework name
   * @returns Array of database names
   */
  public getAvailableDatabases(framework: string): string[] {
    const frameworkDeps = dependencyRegistry[framework];
    if (!frameworkDeps) {
      throw new Error(`Framework ${framework} not found in dependency registry`);
    }
    return Object.keys(frameworkDeps.database);
  }

  /**
   * Gets all available authentication methods for a given framework
   * @param framework The framework name
   * @returns Array of authentication method names
   */
  public getAvailableAuthMethods(framework: string): string[] {
    const frameworkDeps = dependencyRegistry[framework];
    if (!frameworkDeps) {
      throw new Error(`Framework ${framework} not found in dependency registry`);
    }
    return Object.keys(frameworkDeps.auth);
  }
} 