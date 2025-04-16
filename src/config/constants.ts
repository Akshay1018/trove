import path from 'path';

// Absolute path to the root of the templates directory
export const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

// Absolute path to the base common templates
export const BASE_TEMPLATE_PATH = path.join(TEMPLATES_DIR, 'common', 'base'); 