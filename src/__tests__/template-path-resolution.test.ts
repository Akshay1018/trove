import { describe, it, expect } from '@jest/globals';
import { resolveTargetRelativePath } from '../utils/template-manager';
import { join } from 'path';

describe('resolveTargetRelativePath', () => {
  describe('POSIX-style paths (macOS / Linux)', () => {
    it('should strip common/base/ prefix', () => {
      expect(resolveTargetRelativePath('common/base/.env.example.template')).toBe('.env.example');
      expect(resolveTargetRelativePath('common/base/.eslintrc.json')).toBe('.eslintrc.json');
      expect(resolveTargetRelativePath('common/base/tsconfig.json')).toBe('tsconfig.json');
      expect(resolveTargetRelativePath('common/base/src/config/index.ts')).toBe('src/config/index.ts');
    });

    it('should strip frameworks/{framework}/ prefix', () => {
      expect(resolveTargetRelativePath('frameworks/express/src/app.ts.template')).toBe('src/app.ts');
      expect(resolveTargetRelativePath('frameworks/fastify/src/index.ts.template')).toBe('src/index.ts');
      expect(resolveTargetRelativePath('frameworks/nestjs/src/main.ts')).toBe('src/main.ts');
    });

    it('should strip databases/{database}/ prefix', () => {
      expect(resolveTargetRelativePath('databases/mongodb/src/config/database.ts.template')).toBe(
        'src/config/database.ts'
      );
      expect(resolveTargetRelativePath('databases/postgresql/src/models/user.model.ts')).toBe(
        'src/models/user.model.ts'
      );
    });

    it('should strip auth/{auth}/ prefix', () => {
      expect(resolveTargetRelativePath('auth/jwt/src/controllers/auth.controller.ts')).toBe(
        'src/controllers/auth.controller.ts'
      );
      expect(resolveTargetRelativePath('auth/jwt/src/middleware/auth.middleware.ts.template')).toBe(
        'src/middleware/auth.middleware.ts'
      );
    });

    it('should map GitHub Actions workflows to .github/workflows/', () => {
      const result = resolveTargetRelativePath('ci/github/workflows/ci.yml.template', 'github');
      expect(result).toBe(join('.github', 'workflows', 'ci.yml'));
    });

    it('should map other CI workflows correctly', () => {
      expect(resolveTargetRelativePath('ci/gitlab/.gitlab-ci.yml.template', 'gitlab')).toBe(
        '.gitlab-ci.yml'
      );
      expect(resolveTargetRelativePath('ci/bitbucket/bitbucket-pipelines.yml', 'bitbucket')).toBe(
        'bitbucket-pipelines.yml'
      );
    });
  });

  describe('Windows-style paths (backslashes)', () => {
    it('should strip common\\base\\ prefix on Windows', () => {
      expect(resolveTargetRelativePath('common\\base\\.env.example.template')).toBe('.env.example');
      expect(resolveTargetRelativePath('common\\base\\.eslintrc.json')).toBe('.eslintrc.json');
      expect(resolveTargetRelativePath('common\\base\\tsconfig.json')).toBe('tsconfig.json');
      expect(resolveTargetRelativePath('common\\base\\src\\config\\index.ts')).toBe('src/config/index.ts');
    });

    it('should strip frameworks\\{framework}\\ prefix on Windows', () => {
      expect(resolveTargetRelativePath('frameworks\\express\\src\\app.ts.template')).toBe('src/app.ts');
      expect(resolveTargetRelativePath('frameworks\\fastify\\src\\index.ts.template')).toBe('src/index.ts');
      expect(resolveTargetRelativePath('frameworks\\nestjs\\src\\main.ts')).toBe('src/main.ts');
    });

    it('should strip databases\\{database}\\ prefix on Windows', () => {
      expect(resolveTargetRelativePath('databases\\mongodb\\src\\config\\database.ts.template')).toBe(
        'src/config/database.ts'
      );
      expect(resolveTargetRelativePath('databases\\postgresql\\src\\models\\user.model.ts')).toBe(
        'src/models/user.model.ts'
      );
    });

    it('should strip auth\\{auth}\\ prefix on Windows', () => {
      expect(resolveTargetRelativePath('auth\\jwt\\src\\controllers\\auth.controller.ts')).toBe(
        'src/controllers/auth.controller.ts'
      );
      expect(resolveTargetRelativePath('auth\\jwt\\src\\middleware\\auth.middleware.ts.template')).toBe(
        'src/middleware/auth.middleware.ts'
      );
    });

    it('should map GitHub Actions workflows to .github/workflows/ on Windows', () => {
      const result = resolveTargetRelativePath('ci\\github\\workflows\\ci.yml.template', 'github');
      expect(result).toBe(join('.github', 'workflows', 'ci.yml'));
    });

    it('should handle leading backslashes on Windows', () => {
      expect(resolveTargetRelativePath('\\common\\base\\.env.example.template')).toBe('.env.example');
      expect(resolveTargetRelativePath('\\frameworks\\express\\src\\app.ts')).toBe('src/app.ts');
    });
  });
});
