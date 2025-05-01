import { logger } from './logger';

interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

/**
 * Merges multiple package.json contents into one
 * @param packages Array of package.json contents to merge
 * @returns Merged package.json content
 */
export function mergePackageJson(packages: PackageJson[]): PackageJson {
  const merged: PackageJson = {
    name: '',
    version: '1.0.0',
    description: '',
    main: 'dist/index.js',
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };

  for (const pkg of packages) {
    // Merge simple fields (take the last non-empty value)
    if (pkg.name) merged.name = pkg.name;
    if (pkg.version) merged.version = pkg.version;
    if (pkg.description) merged.description = pkg.description;
    if (pkg.main) merged.main = pkg.main;

    // Merge scripts (prefer later definitions)
    merged.scripts = { ...merged.scripts, ...pkg.scripts };

    // Merge dependencies and devDependencies
    if (pkg.dependencies) {
      merged.dependencies = mergeDependencies(merged.dependencies || {}, pkg.dependencies);
    }
    if (pkg.devDependencies) {
      merged.devDependencies = mergeDependencies(merged.devDependencies || {}, pkg.devDependencies);
    }

    // Merge other fields
    for (const [key, value] of Object.entries(pkg)) {
      if (!['name', 'version', 'description', 'main', 'scripts', 'dependencies', 'devDependencies'].includes(key)) {
        merged[key] = value;
      }
    }
  }

  logger.info('Merged package.json dependencies:', {
    dependencyCount: Object.keys(merged.dependencies || {}).length,
    devDependencyCount: Object.keys(merged.devDependencies || {}).length
  });

  return merged;
}

/**
 * Merges dependency objects, keeping the highest version when there's a conflict
 */
function mergeDependencies(
  existing: Record<string, string>,
  additional: Record<string, string>
): Record<string, string> {
  const merged = { ...existing };

  for (const [name, version] of Object.entries(additional)) {
    if (!merged[name] || compareVersions(version, merged[name]) > 0) {
      merged[name] = version;
    }
  }

  return merged;
}

/**
 * Compares two version strings
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1: string, v2: string): number {
  // Remove ^ or ~ from the version strings
  const clean1 = v1.replace(/[\^~]/, '');
  const clean2 = v2.replace(/[\^~]/, '');

  const parts1 = clean1.split('.').map(Number);
  const parts2 = clean2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
} 