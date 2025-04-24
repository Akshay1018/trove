import * as fs from 'fs-extra';
import * as path from 'path';
import { TEMPLATES_DIR } from '../src/config/constants';
import {
  Framework,
  Database,
  CI,
  FRAMEWORK_SPECIFIC,
  DATABASE_SPECIFIC,
  AUTH_SPECIFIC,
  CI_SPECIFIC,
  BASE_STRUCTURE
} from '../src/templates/structure';

async function ensureTemplateFile(templatePath: string) {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  
  if (!fs.existsSync(fullPath)) {
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, '// Template content will be added here\n');
    console.log(`Created empty template: ${templatePath}`);
  }
}

async function verifyBaseTemplates() {
  console.log('Verifying base templates...');
  for (const file of [...BASE_STRUCTURE.files.base, ...BASE_STRUCTURE.files.src]) {
    await ensureTemplateFile(file);
  }
}

async function verifyFrameworkTemplates() {
  console.log('Verifying framework templates...');
  const frameworks: Framework[] = ['express', 'koa', 'fastify', 'nestjs'];
  
  for (const framework of frameworks) {
    const config = FRAMEWORK_SPECIFIC[framework];
    if (config) {
      for (const file of config.files.base) {
        await ensureTemplateFile(file);
      }
    }
  }
}

async function verifyDatabaseTemplates() {
  console.log('Verifying database templates...');
  const databases: Database[] = ['mongodb', 'postgres', 'mysql'];
  
  for (const db of databases) {
    const config = DATABASE_SPECIFIC[db];
    if (config) {
      for (const file of config.files.base) {
        await ensureTemplateFile(file);
      }
    }
  }
}

async function verifyAuthTemplates() {
  console.log('Verifying auth templates...');
  const authTypes = ['jwt', 'oauth', 'session'];
  
  for (const auth of authTypes) {
    const files = AUTH_SPECIFIC[auth];
    if (files) {
      for (const file of files) {
        await ensureTemplateFile(file);
      }
    }
  }
}

async function verifyCITemplates() {
  console.log('Verifying CI templates...');
  const ciTypes: CI[] = ['github', 'gitlab', 'jenkins', 'bitbucket'];
  
  for (const ci of ciTypes) {
    const files = CI_SPECIFIC[ci];
    if (files) {
      for (const file of files) {
        await ensureTemplateFile(file);
      }
    }
  }
}

async function main() {
  try {
    await verifyBaseTemplates();
    await verifyFrameworkTemplates();
    await verifyDatabaseTemplates();
    await verifyAuthTemplates();
    await verifyCITemplates();
    console.log('Template verification complete!');
  } catch (error) {
    console.error('Error verifying templates:', error);
    process.exit(1);
  }
}

main(); 