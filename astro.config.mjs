import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('.', import.meta.url));
const packageLock = resolve(siteRoot, 'package-lock.json');

function chladniNavigation() {
  let workingSource;
  return {
    name: 'duka-chladni-navigation',
    config(_config, { command, mode }) {
      const dev = command === 'serve';
      const branch = process.env.CF_PAGES_BRANCH;
      const test = dev || (branch || process.env.CF_PAGES === '1'
        ? branch === 'staging'
        : mode === 'chladni-preview');
      const chrome = resolve(siteRoot, 'src/components/chrome');
      const alias = {
        '#navigation-chladni': resolve(chrome, test ? 'NavigationChladniPreview.tsx' : 'NavigationChladni.tsx'),
      };
      let server;

      if (dev && mode === 'chladni-source') {
        const source = resolve(siteRoot, process.env.CHLADNI_SOURCE_PATH || '..');
        const { name, exports } = JSON.parse(readFileSync(resolve(source, 'package.json'), 'utf8'));
        if (name !== '@duka/chladni') throw new Error('CHLADNI_SOURCE_PATH must point to the Chladni workspace.');
        for (const entry of ['./player', './editor']) {
          alias[`@duka/chladni/${entry.slice(2)}`] = resolve(source, exports[entry]);
        }
        workingSource = source;
        server = { fs: { allow: [siteRoot, source] } };
      }

      return {
        define: {
          // The source workspace may contain unreleased renderer changes.
          __CHLADNI_STILL_RELEASE__: JSON.stringify(workingSource ? null :
            JSON.parse(readFileSync(packageLock, 'utf8'))
              .packages['node_modules/@duka/chladni'].integrity),
        },
        cacheDir: dev ? resolve(siteRoot, workingSource ? 'node_modules/.vite-chladni-source' : 'node_modules/.vite-chladni-pinned') : undefined,
        resolve: { alias, dedupe: ['react', 'react-dom'] },
        optimizeDeps: { include: ['react-dom/client'], exclude: ['@duka/chladni'] },
        server,
      };
    },
    configureServer(server) {
      if (workingSource) server.watcher.add(resolve(workingSource, 'src'));
      else {
        server.watcher.add(packageLock);
        server.watcher.on('change', file => {
          if (resolve(file) === packageLock) void server.restart();
        });
      }
    },
  };
}

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: process.env.SITE_URL || 'https://example.invalid',
  vite: { plugins: [chladniNavigation()] },
});
