import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(join(root, path), 'utf8'));
const name = '@duka/chladni';
const manifest = readJson('package.json');
const lock = readJson('package-lock.json').packages;
const release = lock[`node_modules/${name}`];
const archive = `vendor/duka-chladni-${release?.version}.tgz`;

assert.ok(release?.version, `${name} must have a locked version`);
assert.equal(manifest.dependencies[name], `file:${archive}`);
assert.equal(lock[''].dependencies[name], manifest.dependencies[name]);
assert.equal(release.resolved, manifest.dependencies[name]);
const digest = createHash('sha512').update(readFileSync(join(root, archive))).digest('base64');
assert.equal(release.integrity, `sha512-${digest}`, `${archive} differs from the lockfile`);
assert.equal(readJson(`node_modules/${name}/package.json`).version, release.version, 'Run npm ci before checking the release');
console.log(`${name}@${release.version}: tarball and lockfile match`);

const require = createRequire(import.meta.url);
const astro = join(dirname(require.resolve('astro/package.json')), 'bin/astro.mjs');
const temp = mkdtempSync(join(tmpdir(), 'duka-chladni-'));
const builds = [
  { name: 'local-default' },
  { name: 'local-preview', mode: 'chladni-preview', test: true },
  { name: 'main', branch: 'main', mode: 'chladni-preview' },
  { name: 'ordinary-preview', branch: 'navigation-review', mode: 'chladni-preview' },
  { name: 'staging', branch: 'staging', test: true },
];

try {
  for (const { name, branch, mode, test = false } of builds) {
    const outDir = join(temp, name);
    const env = { ...process.env };
    delete env.CF_PAGES;
    delete env.CF_PAGES_BRANCH;
    if (branch) {
      env.CF_PAGES = '1';
      env.CF_PAGES_BRANCH = branch;
    }
    const args = [astro, 'build', '--outDir', outDir];
    if (mode) args.push('--mode', mode);
    const result = spawnSync(process.execPath, args, { cwd: root, env, encoding: 'utf8' });
    if (result.error) throw result.error;
    assert.equal(result.status, 0, `${name} build failed\n${result.stdout}\n${result.stderr}`);

    const files = readdirSync(outDir, { recursive: true });
    const emitted = files.filter(file => /\.(?:html|js|css)$/.test(file))
      .map(file => readFileSync(join(outDir, file), 'utf8')).join('\n');
    assert.match(emitted, /\.chladni-player/, `${name}: player styles missing`);
    assert.ok(files.some(file => /[/\\]player\.[^/\\]+\.js$/.test(file)), `${name}: player chunk missing`);

    const editorMarkers = [
      ['editor entry', files.some(file => /[/\\]editor\.[^/\\]+\.js$/.test(file))],
      ['pattern atlas', files.some(file => /[/\\]pattern-atlas\./.test(file))],
      ['editor styles', /\.chladni-container/.test(emitted)],
      ['test styles', /\.navigation-test-layer/.test(emitted)],
      ['test action', emitted.includes('Lock & preview')],
      ['query gate', /\.get\(["'`]chladni["'`]\)/.test(emitted)],
      ['draft storage', emitted.includes('duka-navigation-chladni-v1')],
    ];
    for (const [marker, present] of editorMarkers) {
      assert.equal(present, test, `${name}: ${marker} should be ${test ? 'present' : 'absent'}`);
    }
    console.log(`${name}: ${test ? 'test-capable' : 'player-only'}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
