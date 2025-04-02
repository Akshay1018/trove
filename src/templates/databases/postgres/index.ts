import { DatabaseTemplate } from '../types';

export const postgresTemplate: DatabaseTemplate = {
  name: 'postgres',
  dependencies: [
    'typeorm@0.3.17',
    'pg@8.11.3',
    'dotenv@16.3.1',
    'reflect-metadata@0.1.13',
    '@nestjs/typeorm@10.0.1'
  ],
  devDependencies: [
    '@types/pg@8.10.9',
    'typeorm-naming-strategies@4.1.0',
    'typeorm-seeding@1.6.1'
  ],
  environmentVariables: {
    development: {
      POSTGRES_HOST: 'localhost',
      POSTGRES_PORT: '5432',
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: '{{database}}',
      POSTGRES_SCHEMA: 'public',
      POSTGRES_SSL: 'false'
    },
    production: {
      POSTGRES_HOST: '{{host}}',
      POSTGRES_PORT: '5432',
      POSTGRES_USER: '{{username}}',
      POSTGRES_PASSWORD: '{{password}}',
      POSTGRES_DB: '{{database}}',
      POSTGRES_SCHEMA: 'public',
      POSTGRES_SSL: 'true'
    },
    test: {
      POSTGRES_HOST: 'localhost',
      POSTGRES_PORT: '5432',
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: '{{database}}_test',
      POSTGRES_SCHEMA: 'public',
      POSTGRES_SSL: 'false'
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
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: parseInt(config.POSTGRES_PORT, 10),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  schema: config.POSTGRES_SCHEMA,
  ssl: config.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [Example],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: new SnakeNamingStrategy(),
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}`
    },
    {
      path: 'src/entities/example.entity.ts',
      content: `import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('examples')
export class Example extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Example of a computed column
  @Column({
    type: 'varchar',
    length: 510,
    nullable: true,
    generatedType: 'STORED',
    asExpression: "CONCAT(name, ' - ', description)"
  })
  searchableText?: string;
}`
    },
    {
      path: 'src/migrations/1709001234567-CreateExampleTable.ts',
      content: `import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateExampleTable1709001234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'examples',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
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
            generatedType: 'STORED',
            generatedIdentity: 'BY DEFAULT',
            asExpression: "CONCAT(name, ' - ', description)"
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
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
        ]
      }),
      true
    );

    // Enable uuid-ossp extension if not enabled
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('examples');
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
      .where('example.name ILIKE :name', { name: \`%\${name}%\` })
      .getMany();
  }
}

export const exampleRepository = new ExampleRepository();`
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
      description: 'Test Description'
    });

    expect(example.id).toBeDefined();
    expect(example.name).toBe('Test Example');

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