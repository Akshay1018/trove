export interface PackageVersion {
  version: string;
  description?: string;
  isRequired?: boolean;
}

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
}

export interface FrameworkDependencies {
  core: PackageInfo[];
  database: {
    mongodb?: PackageInfo[];
    postgresql?: PackageInfo[];
    mysql?: PackageInfo[];
  };
  auth: {
    jwt?: PackageInfo[];
    session?: PackageInfo[];
    oauth?: PackageInfo[];
  };
  development: PackageInfo[];
  testing: PackageInfo[];
}

export interface DependencyRegistry {
  express: FrameworkDependencies;
  nestjs: FrameworkDependencies;
  fastify: FrameworkDependencies;
  koa: FrameworkDependencies;
}

export interface DependencyResolutionOptions {
  framework: 'express' | 'nestjs' | 'fastify' | 'koa';
  database?: 'mongodb' | 'postgresql' | 'mysql' | 'skip';
  auth?: 'jwt' | 'session' | 'oauth' | 'skip';
  includeDev?: boolean;
}

export interface ResolvedDependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
} 