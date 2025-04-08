import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

export interface TemplateConfig {
  files: {
    [targetPath: string]: string;
  };
  dependencies?: {
    [name: string]: string;
  };
}

export const copyTemplateFiles = async (
  templateDir: string,
  targetDir: string,
  config: TemplateConfig
) => {
  try {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy each file according to the template configuration
    for (const [targetPath, sourcePath] of Object.entries(config.files)) {
      const sourceFilePath = path.join(templateDir, sourcePath);
      const targetFilePath = path.join(targetDir, targetPath);

      // Create the target directory if it doesn't exist
      const targetFileDir = path.dirname(targetFilePath);
      if (!fs.existsSync(targetFileDir)) {
        fs.mkdirSync(targetFileDir, { recursive: true });
      }

      // Copy the file
      if (fs.existsSync(sourceFilePath)) {
        const content = fs.readFileSync(sourceFilePath, 'utf8');
        fs.writeFileSync(targetFilePath, content);
        logger.info(`Copied ${sourcePath} to ${targetPath}`);
      } else {
        logger.warn(`Template file not found: ${sourceFilePath}`);
      }
    }
  } catch (error) {
    logger.error('Error copying template files:', error);
    throw error;
  }
}; 