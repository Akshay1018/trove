export interface DatabaseConfig {
  type: 'mongodb' | 'postgres' | 'mysql';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  url?: string;
}

export interface DatabaseTemplate {
  name: string;
  dependencies: string[];
  devDependencies: string[];
  environmentVariables: {
    development: Record<string, string>;
    production: Record<string, string>;
    test: Record<string, string>;
  };
  files: {
    path: string;
    content: string;
  }[];
  scripts?: Record<string, string>;
}

export interface MongoDBConfig extends DatabaseConfig {
  type: 'mongodb';
  authSource?: string;
  replicaSet?: string;
  ssl?: boolean;
}

export interface PostgresConfig extends DatabaseConfig {
  type: 'postgres';
  schema?: string;
  ssl?: boolean;
  poolSize?: number;
}

export interface MySQLConfig extends DatabaseConfig {
  type: 'mysql';
  connectionLimit?: number;
  ssl?: boolean;
}

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getClient(): unknown;
}

export interface DatabaseModelTemplate {
  name: string;
  fields: {
    name: string;
    type: string;
    required?: boolean;
    unique?: boolean;
    default?: unknown;
    ref?: string;
  }[];
  timestamps?: boolean;
  indexes?: {
    fields: string[];
    unique?: boolean;
    sparse?: boolean;
  }[];
} 