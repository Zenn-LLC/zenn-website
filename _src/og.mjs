// Makes a 1200×630 share image for every page: node _src/og.mjs
// Draws each one as a small HTML card and screenshots it with Microsoft Edge in headless mode
// (set EDGE to another Chromium browser's path if Edge isn't at the usual place). Writes
// media/og/<page>.png, the files build.mjs points og:image at.
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { allPages, NOT_FOUND, ogName } from './site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'media', 'og');
const EDGE = process.env.EDGE ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (!existsSync(EDGE)) throw new Error(`No browser at ${EDGE}; set EDGE to a Chromium browser.`);
mkdirSync(OUT, { recursive: true });
const work = join(tmpdir(), 'zenn-og');
mkdirSync(work, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const logo = pathToFileURL(join(ROOT, 'media', 'logo.png')).href;

function card({ title, description, section, path }) {
  const home = path === '/';
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400&family=Space+Grotesk:wght@600;700&display=block">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; background: #09090F; overflow: hidden; }
  body { box-sizing: border-box; padding: 72px 80px; display: flex; flex-direction: column; color: #F4F2FB; font-family: "DM Sans", sans-serif;
         background: radial-gradient(900px 500px at 100% 0%, rgba(240,54,110,0.10), transparent 70%), #09090F; }
  .top { display: flex; align-items: center; gap: 16px; font: 700 34px "Space Grotesk", sans-serif; }
  .top img { width: 40px; height: 45px; }
  .eyebrow { margin-top: auto; font: 600 22px "Space Grotesk", sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: #F0366E; }
  h1 { margin: 14px 0 0; font: 700 ${home ? 76 : 64}px/1.08 "Space Grotesk", sans-serif; letter-spacing: -0.02em; max-width: 1000px; }
  p { margin: 22px 0 0; font-size: 28px; line-height: 1.4; color: #B7B5CC; max-width: 960px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .foot { margin-top: 44px; display: flex; justify-content: space-between; align-items: center; font-size: 22px; color: #8886A4; }
  .pill { border: 1.5px solid rgba(255,255,255,0.18); border-radius: 99px; padding: 4px 14px; font: 700 18px "Space Grotesk", sans-serif; color: #F4F2FB; }
</style></head><body>
  <div class="top"><img src="${logo}" alt="">Zentra Arena</div>
  <div class="eyebrow">${esc(home ? 'Zentra Arena by Zenn' : section)}</div>
  <h1>${esc(title)}</h1>
  <p>${esc(description)}</p>
  <div class="foot"><span>zenn.com.ng</span><span class="pill">18+ · Nigeria</span></div>
</body></html>`;
}

const pages = [...allPages().map((p) => ({ ...p, section: p.section.name })), { path: NOT_FOUND[0], title: NOT_FOUND[2], description: NOT_FOUND[3], section: 'Zentra Arena' }];

// One Edge for every card, driven over its DevTools connection: starting Edge once per image is
// slow. It gets its own profile, so it never joins an Edge that's already open.
const PORT = 9333;
const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${join(work, 'profile')}`,
  `--remote-debugging-port=${PORT}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pageSocket() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(300);
  }
  throw new Error('Edge did not start');
}

try {
  const ws = new WebSocket(await pageSocket());
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let next = 0;
  const waiting = new Map();
  const events = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); } else if (msg.method) events.push(msg.method);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++next;
    waiting.set(id, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

  let made = 0;
  for (const page of pages) {
    const name = ogName(page.path);
    const png = join(OUT, `${name}.png`);
    if (existsSync(png) && !process.env.FORCE) { process.stdout.write('-'); continue; }   // FORCE=1 remakes them all
    const html = join(work, `${name}.html`);
    writeFileSync(html, card(page));
    events.length = 0;
    await send('Page.navigate', { url: pathToFileURL(html).href });
    for (let i = 0; i < 100 && !events.includes('Page.loadEventFired'); i++) await sleep(100);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
    writeFileSync(png, Buffer.from(shot.data, 'base64'));
    made++;
    process.stdout.write('.');
  }
  ws.close();
  console.log(`
Made ${made} share images (${pages.length} pages) in media/og/.`);
} finally {
  edge.kill();
  await sleep(500);
  // best effort: Edge can hold its profile a moment after it's told to stop
  try { rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* left in the temp folder */ }
}
