import { readFileSync } from 'fs';
import { join } from 'path';

export const loadTemplate = (templatePath: string): string => {
  const fullPath = join(__dirname, templatePath);
  return readFileSync(fullPath, 'utf-8');
};

export const templates = {
  express: {
    base: {
      'src/index.ts': loadTemplate('express/base/src/index.ts'),
      // Add other template files here
    }
  }
  // Add other framework templates here
}; 