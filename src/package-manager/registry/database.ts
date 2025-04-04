import { Dependencies } from '../../types/package-manager';

export const mongodbDependencies: Dependencies = {
  dependencies: {
    'mongoose': '^8.1.1',
    '@nestjs/mongoose': '^10.0.2',
    'mongodb': '^6.3.0'
  },
  devDependencies: {
    '@types/mongoose': '^5.11.97'
  }
};

export const postgresqlDependencies: Dependencies = {
  dependencies: {
    'pg': '^8.11.3',
    'typeorm': '^0.3.19',
    '@nestjs/typeorm': '^10.0.1'
  },
  devDependencies: {
    '@types/pg': '^8.10.9'
  }
};

export const mysqlDependencies: Dependencies = {
  dependencies: {
    'mysql2': '^3.9.1',
    'typeorm': '^0.3.19',
    '@nestjs/typeorm': '^10.0.1'
  },
  devDependencies: {
    '@types/mysql': '^2.15.25'
  }
}; 