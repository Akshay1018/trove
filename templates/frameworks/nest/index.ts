import { FrameworkTemplate } from '../../types';

export const nestTemplate: FrameworkTemplate = {
  name: 'nest',
  dependencies: [
    '@nestjs/common@10.3.0',
    '@nestjs/core@10.3.0',
    '@nestjs/platform-express@10.3.0',
    '@nestjs/swagger@7.1.17',
    '@nestjs/config@3.1.1',
    '@nestjs/terminus@10.2.0',
    'class-validator@0.14.0',
    'class-transformer@0.5.1',
    'helmet@7.1.0',
    'winston@3.11.0',
    'nest-winston@1.9.4',
    'reflect-metadata@0.1.13'
  ],
  devDependencies: [
    'typescript@5.3.3',
    '@types/node@20.10.5',
    '@types/express@4.17.21',
    '@nestjs/cli@10.2.1',
    '@nestjs/schematics@10.0.3',
    '@nestjs/testing@10.3.0',
    'ts-node@10.9.2',
    'ts-loader@9.5.1',
    'rimraf@5.0.5'
  ],
  scripts: {
    'build': 'nest build',
    'format': 'prettier --write "src/**/*.ts" "test/**/*.ts"',
    'start': 'nest start',
    'start:dev': 'nest start --watch',
    'start:debug': 'nest start --debug --watch',
    'start:prod': 'node dist/main',
    'lint': 'eslint "{src,apps,libs,test}/**/*.ts"',
    'lint:fix': 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
    'test': 'jest',
    'test:watch': 'jest --watch',
    'test:cov': 'jest --coverage',
    'test:debug': 'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
    'test:e2e': 'jest --config ./test/jest-e2e.json'
  },
  files: [
    {
      path: 'src/main.ts',
      content: `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig)
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  
  // Global middleware
  app.use(helmet());
  app.enableCors();
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API endpoints documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(port);
  console.log(\`Application is running on: \${await app.getUrl()}\`);
}

bootstrap();`
    },
    {
      path: 'src/app.module.ts',
      content: `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    HealthModule,
  ],
})
export class AppModule {}`
    },
    {
      path: 'src/config/env.validation.ts',
      content: `import { IsEnum, IsNumber, IsOptional, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}`
    },
    {
      path: 'src/config/logger.config.ts',
      content: `import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('MyApp', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
};`
    },
    {
      path: 'src/health/health.module.ts',
      content: `import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}`
    },
    {
      path: 'src/health/health.controller.ts',
      content: `import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}`
    },
    {
      path: 'test/app.e2e-spec.ts',
      content: `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});`
    },
    {
      path: 'test/jest-e2e.json',
      content: `{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\\\.(t|j)s$": "ts-jest"
  }
}`
    }
  ]
}; 