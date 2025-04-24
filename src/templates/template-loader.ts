import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { TemplateFile } from '../types/template';
import * as ejs from 'ejs';

export class TemplateLoader {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public loadTemplateFiles(relativePath: string): TemplateFile[] {
    const fullPath = join(this.basePath, relativePath);
    const files = this.getFilesRecursively(fullPath);

    return files.map(file => {
      const source = file.replace(this.basePath + '/', '');
      let target = source;

      // Transform template paths to target paths
      if (source.includes('/frameworks/')) {
        target = source
          .replace('/frameworks/express/src/', '/src/')
          .replace('/frameworks/koa/src/', '/src/')
          .replace('/frameworks/nestjs/src/', '/src/')
          .replace('/frameworks/fastify/src/', '/src/')
          .replace('.template', '');
      } else if (source.includes('/databases/')) {
        target = source
          .replace('/databases/mongodb/', '/src/')
          .replace('/databases/postgres/', '/src/')
          .replace('/databases/mysql/', '/src/')
          .replace('.template', '');
      } else if (source.includes('/auth/')) {
        target = source
          .replace('/auth/jwt/', '/src/')
          .replace('/auth/session/', '/src/')
          .replace('/auth/oauth/', '/src/')
          .replace('.template', '');
      } else if (source.includes('/ci/')) {
        target = source
          .replace('/ci/github/', '/')
          .replace('/ci/gitlab/', '/')
          .replace('/ci/bitbucket/', '/')
          .replace('/ci/jenkins/', '/')
          .replace('.template', '');
      } else if (source.includes('/common/base/')) {
        target = source
          .replace('/common/base/', '/')
          .replace('.template', '');
      } else {
        target = source.replace('.template', '');
      }

      return { source, target };
    });
  }

  private getFilesRecursively(dir: string): string[] {
    const files: string[] = [];

    readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        files.push(...this.getFilesRecursively(res));
      } else if (dirent.name.endsWith('.template')) {
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
    return ejs.render(template, data);
  }
}