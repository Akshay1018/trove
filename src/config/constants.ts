import { join } from 'path';
import { existsSync } from 'fs';

const sourceTemplatesDir = join(__dirname, '..', 'templates');
const compiledTemplatesDir = join(__dirname, '..', '..', 'templates');

export const TEMPLATES_DIR = existsSync(join(sourceTemplatesDir, 'common', 'base'))
  ? sourceTemplatesDir
  : compiledTemplatesDir;

export const PACKAGE_JSON_PATH = join(__dirname, '..', '..', 'package.json');

export const BASE_TEMPLATE_PATH = join(TEMPLATES_DIR, 'common', 'base');
export const FRAMEWORK_TEMPLATE_PATH = join(TEMPLATES_DIR, 'frameworks');
export const DATABASE_TEMPLATE_PATH = join(TEMPLATES_DIR, 'databases');
export const AUTH_TEMPLATE_PATH = join(TEMPLATES_DIR, 'auth');
export const CI_TEMPLATE_PATH = join(TEMPLATES_DIR, 'ci');