import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const indexPath = resolve(distDir, 'index.html');
const fallbackPath = resolve(distDir, '404.html');

if (!existsSync(indexPath)) {
  console.error('spa-fallback: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

copyFileSync(indexPath, fallbackPath);
console.log('spa-fallback: copied dist/index.html -> dist/404.html');
