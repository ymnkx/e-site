import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import d from './src/data/project.ts';
const { url, publicDir, subDirectory } = d;

// https://astro.build/config
export default defineConfig({
  base: subDirectory,
  outDir: `./docs/`,
  publicDir: publicDir,
  site: url,
  server: { host: true, port: 3000 },
  vite: {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        '@scss/': `${path.resolve(__dirname, 'src')}/styles/`,
      },
    },
  },
  build: {
    assets: '_assets',
  },
});
