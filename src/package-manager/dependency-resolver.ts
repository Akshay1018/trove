import { DependencyResolutionOptions, PackageInfo, ResolvedDependencies } from './types';
import { dependencyRegistry } from './registry';

export class DependencyResolver {
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

    const dependencies: PackageInfo[] = [];
    const devDependencies: PackageInfo[] = [];
    const peerDependencies: PackageInfo[] = [];

    // Add core dependencies
    dependencies.push(...frameworkDeps.core);

    // Add database dependencies if specified
    if (database) {
      const dbDeps = frameworkDeps.database[database];
      if (dbDeps) {
        dependencies.push(...dbDeps);
      }
    }

    // Add auth dependencies if specified
    if (auth) {
      const authDeps = frameworkDeps.auth[auth];
      if (authDeps) {
        dependencies.push(...authDeps);
      }
    }

    // Add development dependencies if requested
    if (includeDev) {
      devDependencies.push(...frameworkDeps.development);
      devDependencies.push(...frameworkDeps.testing);
    }

    // Separate dev dependencies and peer dependencies
    const result: ResolvedDependencies = {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {}
    };

    // Process regular dependencies
    dependencies.forEach(dep => {
      if (dep.isPeerDependency) {
        result.peerDependencies[dep.name] = dep.versions[0].version;
      } else {
        result.dependencies[dep.name] = dep.versions[0].version;
      }
    });

    // Process dev dependencies
    devDependencies.forEach(dep => {
      if (dep.isDevDependency) {
        result.devDependencies[dep.name] = dep.versions[0].version;
      }
    });

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