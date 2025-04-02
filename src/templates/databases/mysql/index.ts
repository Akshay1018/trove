import { DatabaseTemplate } from '../types';

export const mysqlTemplate: DatabaseTemplate = {
  name: 'mysql',
  dependencies: [
    'typeorm@0.3.17',
    'mysql2@3.6.5',
    'dotenv@16.3.1',
    'reflect-metadata@0.1.13',
    '@nestjs/typeorm@10.0.1'
  ],
  devDependencies: [
    '@types/node@20.10.5',
    'typeorm-naming-strategies@4.1.0',
    'typeorm-seeding@1.6.1'
  ],
  environmentVariables: {
    development: {
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: '3306',
      MYSQL_USER: 'root',
      MYSQL_PASSWORD: 'root',
      MYSQL_DATABASE: '{{database}}',
      MYSQL_CONNECTION_LIMIT: '10',
      MYSQL_SSL: 'false'
    },
    production: {
      MYSQL_HOST: '{{host}}',
      MYSQL_PORT: '3306',
      MYSQL_USER: '{{username}}',
      MYSQL_PASSWORD: '{{password}}',
      MYSQL_DATABASE: '{{database}}',
      MYSQL_CONNECTION_LIMIT: '100',
      MYSQL_SSL: 'true'
    },
    test: {
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: '3306',
      MYSQL_USER: 'root',
      MYSQL_PASSWORD: 'root',
      MYSQL_DATABASE: '{{database}}_test',
      MYSQL_CONNECTION_LIMIT: '10',
      MYSQL_SSL: 'false'
    }
  },
  files: [
    {
      path: 'src/config/database.ts',
      content: `import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from './index';
import { Example } from '../entities/example.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: config.MYSQL_HOST,
  port: parseInt(config.MYSQL_PORT, 10),
  username: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  ssl: config.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [Example],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    connectionLimit: parseInt(config.MYSQL_CONNECTION_LIMIT, 10),
    charset: 'utf8mb4_unicode_ci'
  }
};

export const AppDataSource = new DataSource(databaseConfig);

export async function connectDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
}`
    },
    {
      path: 'src/entities/base.entity.ts',
      content: `import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity as TypeOrmBaseEntity
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}`
    },
    {
      path: 'src/entities/example.entity.ts',
      content: `import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('examples')
export class Example extends BaseEntity {
  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Example of a generated column (MySQL 5.7+)
  @Column({
    type: 'varchar',
    length: 510,
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    generatedType: 'VIRTUAL',
    asExpression: "CONCAT(name, ' - ', IFNULL(description, ''))"
  })
  @Index()
  searchableText?: string;

  // Example of a JSON column (MySQL 5.7+)
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}`
    },
    {
      path: 'src/migrations/1709001234567-CreateExampleTable.ts',
      content: `import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateExampleTable1709001234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the function for UUID generation (MySQL doesn't have uuid_generate_v4())
    await queryRunner.query(\`
      CREATE FUNCTION IF NOT EXISTS uuid_v4()
      RETURNS CHAR(36)
      BEGIN
        RETURN LOWER(CONCAT(
          HEX(RANDOM_BYTES(4)),
          '-',
          HEX(RANDOM_BYTES(2)),
          '-4',
          SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3),
          '-',
          HEX(FLOOR(ASCII(RANDOM_BYTES(1)) & 63) + 128),
          SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3),
          '-',
          HEX(RANDOM_BYTES(6))
        ));
      END
    \`);

    await queryRunner.createTable(
      new Table({
        name: 'examples',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
            charset: 'utf8mb4',
            collation: 'utf8mb4_unicode_ci'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            charset: 'utf8mb4',
            collation: 'utf8mb4_unicode_ci'
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true
          },
          {
            name: 'searchable_text',
            type: 'varchar',
            length: '510',
            isNullable: true,
            charset: 'utf8mb4',
            collation: 'utf8mb4_unicode_ci',
            generatedType: 'VIRTUAL',
            asExpression: "CONCAT(name, ' - ', IFNULL(description, ''))"
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ],
        indices: [
          {
            name: 'IDX_examples_name',
            columnNames: ['name']
          },
          {
            name: 'IDX_examples_searchable_text',
            columnNames: ['searchable_text']
          }
        ],
        engine: 'InnoDB'
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('examples');
    await queryRunner.query('DROP FUNCTION IF EXISTS uuid_v4');
  }
}`
    },
    {
      path: 'src/repositories/base.repository.ts',
      content: `import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async findByIdOrThrow(id: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Entity not found');
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findByIdOrThrow(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  // MySQL-specific: Use REPLACE INTO for upsert
  async upsert(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    await this.repository.createQueryBuilder()
      .insert()
      .into(this.repository.target)
      .values(entity)
      .orUpdate(['name', 'description', 'is_active', 'metadata'], ['id'])
      .execute();
    return this.findByIdOrThrow(entity.id);
  }
}`
    },
    {
      path: 'src/repositories/example.repository.ts',
      content: `import { AppDataSource } from '../config/database';
import { Example } from '../entities/example.entity';
import { BaseRepository } from './base.repository';

class ExampleRepository extends BaseRepository<Example> {
  constructor() {
    super(AppDataSource.getRepository(Example));
  }

  async findByName(name: string): Promise<Example[]> {
    return AppDataSource.getRepository(Example)
      .createQueryBuilder('example')
      .where('example.name LIKE :name', { name: \`%\${name}%\` })
      .getMany();
  }

  // MySQL-specific: Full-text search example
  async searchByText(query: string): Promise<Example[]> {
    return AppDataSource.getRepository(Example)
      .createQueryBuilder('example')
      .where('MATCH(name, description) AGAINST (:query IN BOOLEAN MODE)', { query })
      .getMany();
  }
}`
    },
    {
      path: 'tests/database.test.ts',
      content: `import { AppDataSource, connectDatabase, disconnectDatabase } from '../src/config/database';
import { Example } from '../src/entities/example.entity';
import { exampleRepository } from '../src/repositories/example.repository';

describe('Database Connection', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should connect to the database', () => {
    expect(AppDataSource.isInitialized).toBe(true);
  });

  it('should create and retrieve an example', async () => {
    const example = await exampleRepository.create({
      name: 'Test Example',
      description: 'Test Description',
      metadata: { key: 'value' }
    });

    expect(example.id).toBeDefined();
    expect(example.name).toBe('Test Example');
    expect(example.metadata).toEqual({ key: 'value' });

    const retrieved = await exampleRepository.findById(example.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Test Example');
  });
});`
    }
  ],
  scripts: {
    'typeorm': 'typeorm-ts-node-commonjs',
    'db:migrate': 'npm run typeorm migration:run -- -d src/config/database.ts',
    'db:migrate:revert': 'npm run typeorm migration:revert -- -d src/config/database.ts',
    'db:generate': 'npm run typeorm migration:generate -- -d src/config/database.ts',
    'db:seed': 'ts-node src/seeds/index.ts'
  }
}; 