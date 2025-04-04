export interface ProjectOptions {
  framework?: 'express' | 'nest' | 'fastify' | 'koa';
  database?: 'mongodb' | 'postgresql' | 'mysql';
  auth?: 'jwt' | 'session' | 'oauth';
}

export interface ProjectConfig extends ProjectOptions {
  name: string;
  path: string;
  dependencies: string[];
  devDependencies: string[];
} 