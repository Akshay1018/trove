import fs from 'fs';
import path from 'path';
import {
  Framework,
  Auth,
  CI,
  Database,
  FRAMEWORK_SPECIFIC,
  DATABASE_SPECIFIC,
  AUTH_SPECIFIC,
  CI_SPECIFIC,
} from '../src/templates/structure';

const TEMPLATES_DIR = path.join(__dirname, '../src/templates');

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createEmptyTemplateFile(filePath: string) {
  const dir = path.dirname(filePath);
  ensureDirectoryExists(dir);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '// TODO: Implement template\n');
    console.log(`Created empty template: ${filePath}`);
  }
}

function verifyFrameworkTemplates() {
  Object.entries(FRAMEWORK_SPECIFIC).forEach(([framework, config]) => {
    config.files.base.forEach(file => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      createEmptyTemplateFile(templatePath);
    });
  });
}

function verifyDatabaseTemplates() {
  Object.entries(DATABASE_SPECIFIC).forEach(([database, config]) => {
    config.files.base.forEach(file => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      createEmptyTemplateFile(templatePath);
    });
  });
}

function verifyAuthTemplates() {
  Object.entries(AUTH_SPECIFIC).forEach(([auth, files]) => {
    files.forEach(file => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      createEmptyTemplateFile(templatePath);
    });
  });
}

function verifyCITemplates() {
  Object.entries(CI_SPECIFIC).forEach(([ci, files]) => {
    files.forEach(file => {
      const templatePath = path.join(TEMPLATES_DIR, file);
      createEmptyTemplateFile(templatePath);
    });
  });
}

console.log('Verifying framework templates...');
verifyFrameworkTemplates();

console.log('Verifying database templates...');
verifyDatabaseTemplates();

console.log('Verifying auth templates...');
verifyAuthTemplates();

console.log('Verifying CI templates...');
verifyCITemplates();

console.log('Template verification complete!'); 