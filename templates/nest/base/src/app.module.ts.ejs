import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
<% if (database === 'mongodb') { %>import { MongooseModule } from '@nestjs/mongoose';<% } %>
<% if (database === 'postgresql' || database === 'mysql') { %>import { TypeOrmModule } from '@nestjs/typeorm';<% } %>
import { HealthModule } from './health/health.module';
<% if (auth) { %>import { AuthModule } from './auth/auth.module';<% } %>

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database configuration
    <% if (database === 'mongodb') { %>
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/<%= projectName %>'),
    <% } else if (database === 'postgresql') { %>
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || '<%= projectName %>',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    <% } else if (database === 'mysql') { %>
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',
      database: process.env.MYSQL_DB || '<%= projectName %>',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    <% } %>

    // Feature modules
    HealthModule,
    <% if (auth) { %>AuthModule,<% } %>
  ],
})
export class AppModule {} 