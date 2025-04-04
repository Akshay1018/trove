import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { TemplateFile } from './types';

export class TemplateLoader {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public loadTemplateFiles(relativePath: string): TemplateFile[] {
    const fullPath = join(this.basePath, relativePath);
    const files = this.getFilesRecursively(fullPath);

    return files.map(file => ({
      path: file.replace(this.basePath + '/', ''),
      content: readFileSync(file, 'utf-8'),
      isConfig: file.endsWith('.ejs')
    }));
  }

  private getFilesRecursively(dir: string): string[] {
    const files: string[] = [];

    readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        files.push(...this.getFilesRecursively(res));
      } else {
        files.push(res);
      }
    });

    return files;
  }

  public loadTemplate(relativePath: string): string {
    return readFileSync(join(this.basePath, relativePath), 'utf-8');
  }

  public loadJsonTemplate(relativePath: string): any {
    const content = this.loadTemplate(relativePath);
    return JSON.parse(content);
  }

  public loadEjsTemplate(relativePath: string, data: any): string {
    const template = this.loadTemplate(relativePath);
    return render(template, data);
  }
} 