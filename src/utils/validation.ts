import fs from 'fs';
import path from 'path';

export function validateProjectName(input: string): boolean | string {
  if (!input) {
    return 'Project name cannot be empty';
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
    return 'Project name can only contain letters, numbers, dashes and underscores';
  }

  if (fs.existsSync(path.join(process.cwd(), input))) {
    return 'A directory with this name already exists';
  }

  return true;
}

export function validatePath(path: string): boolean | string {
  if (!path) {
    return 'Path cannot be empty';
  }

  if (fs.existsSync(path)) {
    return 'Path already exists';
  }

  return true;
} 