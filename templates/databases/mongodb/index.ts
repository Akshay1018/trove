import { DatabaseTemplate } from '../types';

export const mongodbTemplate: DatabaseTemplate = {
  name: 'mongodb',
  dependencies: [
    'mongoose@8.0.3',
    'mongodb@6.3.0'
  ],
  devDependencies: [
    '@types/mongoose@5.11.97',
    'mongodb-memory-server@9.1.3'
  ],
  environmentVariables: {
    development: {
      MONGODB_URI: 'mongodb://localhost:27017/{{database}}',
      MONGODB_USER: '',
      MONGODB_PASSWORD: '',
    },
    production: {
      MONGODB_URI: 'mongodb+srv://{{username}}:{{password}}@{{host}}/{{database}}',
      MONGODB_USER: '',
      MONGODB_PASSWORD: '',
    },
    test: {
      MONGODB_URI: 'mongodb://localhost:27017/{{database}}_test',
      MONGODB_USER: '',
      MONGODB_PASSWORD: '',
    }
  },
  files: [
    {
      path: 'src/config/database.ts',
      content: `import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  try {
    const mongoUri = config.MONGODB_URI;
    
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('connected', () => {
      logger.info('Connected to MongoDB');
    });

    logger.info('Database connection established');
  } catch (error) {
    logger.error('Error connecting to database:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    process.exit(1);
  }
}

export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}`
    },
    {
      path: 'src/models/base.model.ts',
      content: `import { Schema, Document, Model, model } from 'mongoose';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseModel<T extends BaseDocument> extends Model<T> {
  findByIdOrThrow(id: string): Promise<T>;
}

export const baseSchema = new Schema({}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

baseSchema.statics.findByIdOrThrow = async function(id: string) {
  const document = await this.findById(id);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};`
    },
    {
      path: 'src/models/example.model.ts',
      content: `import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from './base.model';

export interface ExampleDocument extends BaseDocument {
  name: string;
  description?: string;
  isActive: boolean;
}

const exampleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Merge with base schema
const schema = baseSchema.clone();
schema.add(exampleSchema);

// Indexes
schema.index({ name: 1 });

export const Example = model<ExampleDocument>('Example', schema);`
    },
    {
      path: 'src/utils/database.utils.ts',
      content: `import mongoose from 'mongoose';
import { logger } from './logger';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function handleDatabaseError(error: any): never {
  logger.error('Database operation failed:', error);
  
  if (error.name === 'ValidationError') {
    throw new DatabaseError('Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', '));
  }
  
  if (error.code === 11000) {
    throw new DatabaseError('Duplicate key error');
  }
  
  throw new DatabaseError('Database operation failed');
}`
    },
    {
      path: 'tests/database.test.ts',
      content: `import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDatabase, disconnectDatabase } from '../src/config/database';

describe('Database Connection', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should connect to the database', async () => {
    await connectDatabase();
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should disconnect from the database', async () => {
    await disconnectDatabase();
    expect(mongoose.connection.readyState).toBe(0);
  });
});`
    }
  ],
  scripts: {
    'db:seed': 'ts-node src/scripts/seed.ts',
    'db:migrate': 'ts-node src/scripts/migrate.ts',
    'db:reset': 'ts-node src/scripts/reset.ts'
  }
}; 