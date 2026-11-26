import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const site = new URL('../', import.meta.url);
const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:4340/');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname), 'Use a local site preview');
const chromePath = process.env.CHROME_PATH ?? (process.platform === 'win32'
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : 'google-chrome');
const presetBytes = await readFile(new URL('src/data/navigation.chladni.json', site));
const preset = JSON.parse(presetBytes);
const lock = JSON.parse(await readFile(new URL('package-lock.json', site), 'utf8'));
const release = lock.packages['node_modules/@duka/chladni'];
const profile = await mkdtemp(join(tmpdir(), 'duka-chladni-capture-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank',
], { stdio: 'ignore', windowsHide: true });
let socket;

async function waitFor(label, check) {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    const value = await check();
    if (value) return value;
    await delay(50);
  }
  throw new Error('Timed out waiting for ' + label);
}

try {
  const port = await waitFor('Chrome', async () => {
    try {
      return (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0].trim();
    } catch {
      return null;
    }
  });
  const targets = await fetch('http://127.0.0.1:' + port + '/json/list').then(res => res.json());
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    const call = pending.get(message.id);
    if (!call) return;
    pending.delete(message.id);
    if (message.error) call.reject(new Error(message.error.message));
    else call.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    return result.value;
  };

  await send('Page.enable');
  await send('Emulation.setScrollbarsHidden', { hidden: true });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
      return getContext.call(this, type, type === 'webgl2' && this.closest('.chladni-player')
        ? { ...attributes, preserveDrawingBuffer: true } : attributes);
    };
  ` });

  const stills = [];
  for (const name of ['desktop', 'mobile']) {
    const { width, height, enabled } = preset.framing[name];
    if (!enabled || (width < preset.framing.breakpoint) !== (name === 'mobile')) {
      console.log(`${name}: using live playback because the reference viewport does not select this crop`);
      continue;
    }
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    const page = new URL(origin);
    page.search = '?capture=' + name;
    const navigation = await send('Page.navigate', { url: page.href });
    assert.equal(navigation.errorText, undefined);
    await waitFor(name + ' page', () => evaluate('location.href === ' + JSON.stringify(page.href)));
    assert.deepEqual(await evaluate('import("/src/data/navigation.chladni.json?raw").then(m => JSON.parse(m.default))'),
      preset, 'The local dev server must serve this checkout’s preset');
    const result = await waitFor(name + ' settled frame', () => evaluate(`(() => {
      const stage = document.querySelector('.chladni-player[data-presentation="ready"] .plate-stage');
      if (stage?.dataset.profile !== ${JSON.stringify(name)}) return null;
      const canvas = stage.querySelector('canvas');
      return { width: canvas.width, height: canvas.height, frame: canvas.toDataURL('image/webp', 0.84) };
    })()`));
    const packageVersion = await evaluate(`(() => {
      const entry = performance.getEntriesByType('resource').find(({ name }) =>
        new URL(name).pathname.includes('/node_modules/@duka/chladni/src/player.ts'));
      if (!entry) throw new Error('Run the pinned dev server to capture stills for the installed release');
      const manifest = new URL('../package.json?raw', entry.name);
      return import(manifest.href).then(module => JSON.parse(module.default).version);
    })()`);
    assert.equal(packageVersion, release.version, 'The preview must use this checkout’s pinned simulator version');
    assert.equal(result.width, width);
    assert.equal(result.height, height);
    assert.match(result.frame, /^data:image\/webp;base64,/);
    const image = Buffer.from(result.frame.split(',')[1], 'base64');
    assert.ok(image.byteLength > 2500, `The ${name} frame looks blank`);
    stills.push({ name, image });
  }
  const manifest = {
    presetSha256: createHash('sha256').update(presetBytes.toString('utf8').replaceAll('\r\n', '\n')).digest('hex'),
    simulatorIntegrity: release.integrity,
  };
  for (const name of ['desktop', 'mobile']) {
    const asset = new URL(`src/assets/navigation-${name}.webp`, site);
    const still = stills.find(still => still.name === name);
    if (!still) {
      await rm(asset, { force: true });
      continue;
    }
    await writeFile(asset, still.image);
    manifest[`${name}Sha256`] = createHash('sha256').update(still.image).digest('hex');
    console.log(`${name}: ${still.image.byteLength} bytes`);
  }
  await writeFile(new URL('src/data/navigation-stills.json', site), JSON.stringify(manifest, null, 2) + '\n');
} finally {
  socket?.close();
  chrome.kill();
}
