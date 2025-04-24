import { join } from 'path';

// In the compiled code, __dirname will be dist/config
// We need to go up one level to reach the dist root
export const TEMPLATES_DIR = join(__dirname, '..', 'templates');
export const PACKAGE_JSON_PATH = join(__dirname, '..', '..', 'package.json');

// Template paths
export const BASE_TEMPLATE_PATH = join(TEMPLATES_DIR, 'common', 'base');
export const FRAMEWORK_TEMPLATE_PATH = join(TEMPLATES_DIR, 'frameworks');
export const DATABASE_TEMPLATE_PATH = join(TEMPLATES_DIR, 'databases');
export const AUTH_TEMPLATE_PATH = join(TEMPLATES_DIR, 'auth');
export const CI_TEMPLATE_PATH = join(TEMPLATES_DIR, 'ci'); 