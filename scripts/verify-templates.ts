import * as fs from 'fs-extra';
import * as path from 'path';
import { TEMPLATES_DIR } from '../src/config/constants';

const requiredTemplateDirectories = [
  'common/base',
  'frameworks/express',
  'frameworks/koa',
  'frameworks/fastify',
  'frameworks/nestjs',
  'databases/mongodb',
  'databases/postgres',
  'databases/mysql',
  'auth/jwt',
  'auth/oauth',
  'auth/session',
  'ci/github',
  'ci/gitlab',
  'ci/jenkins',
  'ci/bitbucket'
];

function countTemplateFiles(directory: string): number {
  return fs.readdirSync(directory, { withFileTypes: true }).reduce((count, entry) => {
    const entryPath = path.join(directory, entry.name);
    return count + (entry.isDirectory() ? countTemplateFiles(entryPath) : 1);
  }, 0);
}

const missing: string[] = [];

for (const relativeDirectory of requiredTemplateDirectories) {
  const directory = path.join(TEMPLATES_DIR, relativeDirectory);
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory() || countTemplateFiles(directory) === 0) {
    missing.push(relativeDirectory);
  }
}

if (missing.length > 0) {
  console.error(`Missing or empty template directories: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Verified ${requiredTemplateDirectories.length} template directories.`);
