declare module '*.ejs' {
  const content: string;
  export default content;
}

declare module '*.template' {
  const content: string;
  export default content;
}

// Extend existing modules
declare module 'inquirer' {
  import { Framework, Database, Auth } from './index';
  
  interface Answers extends Record<string, any> {
    projectName?: string;
    framework?: Framework;
    database?: Database;
    auth?: Auth;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function prompt<T>(questions: QuestionCollection<Answers>) {
    throw new Error('Function not implemented.');
  }
} 