// Checks the built site: node _src/check.mjs
// Every internal link and image must point at a file that exists (and an #anchor at an id on
// that page), every page needs a title, a description and a share image, and every page in
// the list must be in sitemap.xml. Lists the outside links so they can be checked by hand.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, allPages, slugOf, ogName } from './site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const fileFor = (path) => path === '/404.html' ? join(ROOT, '404.html') : join(ROOT, slugOf(path) === 'index' ? '' : slugOf(path), 'index.html');
const problems = [];
const outside = new Set();
const html = new Map();
const pages = [...allPages().map((p) => p.path), '/404.html'];

for (const path of pages) html.set(path, readFileSync(fileFor(path), 'utf8'));

function target(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '') return null;
  const file = join(ROOT, decodeURIComponent(clean));
  if (existsSync(file) && statSync(file).isDirectory()) return existsSync(join(file, 'index.html')) ? join(file, 'index.html') : false;
  return existsSync(file) ? file : false;
}

for (const [path, page] of html) {
  if (!/<title>[^<]{5,}<\/title>/.test(page)) problems.push(`${path}: no title`);
  if (!/<meta name="description" content="[^"]{20,}">/.test(page)) problems.push(`${path}: no description`);
  if (!existsSync(join(ROOT, 'media', 'og', `${ogName(path)}.png`))) problems.push(`${path}: no share image`);
  const ids = new Set([...page.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, attr, raw] of page.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const url = raw.startsWith(SITE + '/') ? raw.slice(SITE.length) : raw;   // canonical links: our own pages
    if (/^(https?:)?\/\//.test(url)) { if (!url.startsWith('https://fonts.')) outside.add(url); continue; }
    if (/^(mailto|tel):/.test(url)) continue;
    if (url.startsWith('#')) { if (url.length > 1 && !ids.has(url.slice(1))) problems.push(`${path}: no #${url.slice(1)} on the page`); continue; }
    if (!url.startsWith('/')) { problems.push(`${path}: relative ${attr} ${url}`); continue; }
    const file = target(url);
    if (file === false) { problems.push(`${path}: broken ${attr} ${url}`); continue; }
    const hash = url.split('#')[1];
    if (hash && file && !new RegExp(`\\sid="${hash}"`).test(readFileSync(file, 'utf8'))) problems.push(`${path}: ${url} has no #${hash}`);
  }
}

const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
for (const p of allPages()) if (!sitemap.includes(`<loc>${SITE}${p.path}</loc>`)) problems.push(`sitemap.xml: missing ${p.path}`);

console.log(`Checked ${html.size} pages.`);
console.log(`Outside links (${outside.size}):\n  ${[...outside].sort().join('\n  ')}`);
if (problems.length) { console.log(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`); process.exit(1); }
console.log('\nNo broken links, and every page has a title, description and share image.');
