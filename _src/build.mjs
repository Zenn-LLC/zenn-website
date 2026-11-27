// Builds the site: node _src/build.mjs
// Wraps each page body in _src/pages/ in the shared layout and writes plain HTML files to the
// repo root (where GitHub Pages serves them), plus sitemap.xml, robots.txt, 404.html and
// redirects for old addresses. Share images are made separately by _src/og.mjs.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, APP, EMAIL, SECTIONS, NOT_FOUND, MENU, allPages, slugOf, ogName } from './site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = join(ROOT, '_src', 'pages');
const TODAY = new Date().toISOString().slice(0, 10);
const VERSION = Date.now().toString(36);   // cache-buster for the stylesheet and script

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const outFile = (path) => path === '/404.html' ? join(ROOT, '404.html') : join(ROOT, slugOf(path) === 'index' ? '' : slugOf(path), 'index.html');

// A link to the app from a page, tagged so the app can count the sign-ups this site brings:
// utm_source=zenn, utm_medium=website, utm_campaign=<the page's slug> ('home' for the home page,
// 'games-chess' for /games/chess/). The app saves it on the visitor's first visit.
const appLink = (path) => `${APP}/?utm_source=zenn&amp;utm_medium=website&amp;utm_campaign=${path === '/' ? 'home' : ogName(path)}`;
const fill = (html, path) => html.replaceAll('{{APP}}', appLink(path)).replaceAll('{{EMAIL}}', EMAIL).replaceAll('{{SITE}}', SITE);
const idFor = (text) => text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const LOGO = '<img class="logo-mark" src="/media/logo.png" alt="" width="22" height="25">';

function head({ path, title, description, noindex = false }) {
  const url = SITE + (path === '/404.html' ? '/' : path);
  const og = `${SITE}/media/og/${ogName(path)}.png`;
  const fullTitle = path === '/' ? title : `${title} | Zentra Arena`;
  return `<!doctype html>
<html lang="en-NG">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#09090F">
<link rel="icon" href="/media/logo.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Zentra Arena">
<meta property="og:locale" content="en_NG">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@hellofromzenn">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
${path === '/' ? '<meta name="google-site-verification" content="yDr_aRxi8eD2abkz6lGHTPAvphuWYzvKdZe7hJhFxic">' : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Space+Grotesk:wght@500;600;700&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${VERSION}">
</head>`;
}

function header(path) {
  const current = (href) => path === href || (href !== '/' && path.startsWith(href)) ? ' aria-current="page"' : '';
  const links = MENU.map(([label, href]) => `<a href="${href}"${current(href)}>${label}</a>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top-in">
    <a class="brand" href="/">${LOGO}<span>Zentra Arena</span></a>
    <nav class="top-nav" aria-label="Main">${links}</nav>
    <a class="btn btn-sm top-play" href="${appLink(path)}">Play now</a>
    <details class="menu">
      <summary aria-label="Menu"><span></span><span></span><span></span></summary>
      <div class="menu-panel">
        ${SECTIONS.map((s) => `<div><p class="menu-head">${s.name}</p>${s.pages.filter(([p]) => p !== '/').map(([p, label]) => `<a href="${p}">${label}</a>`).join('')}</div>`).join('')}
      </div>
    </details>
  </div>
</header>`;
}

function footer() {
  const cols = SECTIONS.map((s) => `<div class="foot-col"><p class="foot-head">${s.name}</p>${s.pages.filter(([p]) => p !== '/').map(([p, label]) => `<a href="${p}">${label}</a>`).join('')}</div>`).join('');
  return `<footer class="foot">
  <div class="foot-in">
    <div class="foot-top">
      <a class="brand" href="/">${LOGO}<span>Zentra Arena</span></a>
      <p class="foot-18"><span class="pill-18">18+</span> Zentra Arena is for adults in Nigeria. Real money is staked. <a href="/responsible-gambling/">Play responsibly</a>.</p>
    </div>
    <div class="foot-cols">${cols}</div>
    <div class="foot-base">
      <p>Zentra Arena is run by Zenn Interactive Limited, RC 9153066, Lagos, Nigeria. <a href="mailto:${EMAIL}">${EMAIL}</a></p>
      <p class="foot-social"><a href="https://twitter.com/hellofromzenn" rel="me">X</a><a href="https://instagram.com/hellofromzenn" rel="me">Instagram</a><a href="https://tiktok.com/@hellofromzenn" rel="me">TikTok</a><a href="https://youtube.com/@hellofromzenn" rel="me">YouTube</a></p>
      <p>© 2026 Zenn Interactive Limited</p>
    </div>
  </div>
</footer>
<script src="/assets/site.js?v=${VERSION}" defer></script>
</body>
</html>
`;
}

const MONEY_NOTE = `<aside class="note-18" aria-label="Real money">
  <span class="pill-18">18+</span>
  <p>Zentra Arena is played for real money and is only for adults in Nigeria. Stake only what you can afford to lose. Limits, breaks and self-exclusion are in the app under Menu → Limits and breaks. <a href="/responsible-gambling/">Play responsibly</a></p>
</aside>`;

// adds ids to <h2>s that have none, and returns the list for "On this page"
function withIds(body) {
  const toc = [];
  const html = body.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (m, attrs = '', text) => {
    const has = /\sid="([^"]+)"/.exec(attrs);
    const id = has ? has[1] : idFor(text);
    toc.push([id, text.replace(/<[^>]+>/g, '')]);
    return has ? m : `<h2${attrs} id="${id}">${text}</h2>`;
  });
  return { html, toc };
}

function article(page, body) {
  const { section } = page;
  const list = section.pages;
  const i = list.findIndex(([p]) => p === page.path);
  const prev = list[i - 1]?.[0] === '/' ? null : list[i - 1];
  const next = list[i + 1];
  const { html, toc } = withIds(body);
  const side = `<nav class="side" aria-label="${section.name}">
      <p class="side-head">${section.name}</p>
      ${list.filter(([p]) => p !== '/').map(([p, label]) => `<a href="${p}"${p === page.path ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>`;
  const crumbs = `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span>${section.id === 'start' ? '' : `<a href="${list[0][0] === '/' ? '/' : list[0][0]}">${section.name}</a><span>/</span>`}<span aria-current="page">${page.label}</span></nav>`;
  const onPage = toc.length >= 3 ? `<details class="toc" open><summary>On this page</summary><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ol></details>` : '';
  const pager = (prev || next) ? `<nav class="pager" aria-label="Next and previous">
      ${prev ? `<a class="pager-prev" href="${prev[0]}"><small>Previous</small>${prev[1]}</a>` : '<span></span>'}
      ${next ? `<a class="pager-next" href="${next[0]}"><small>Next</small>${next[1]}</a>` : '<span></span>'}
    </nav>` : '';
  return `<main id="main" class="page">
  <div class="page-in">
    ${side}
    <article class="doc">
      ${crumbs}
      <header class="doc-head">
        <p class="eyebrow">${section.name}</p>
        <h1>${esc(page.title)}</h1>
        <p class="lede">${esc(page.description)}</p>
      </header>
      ${onPage}
      ${html}
      ${page.money && !page.path.startsWith('/responsible-gambling/') ? MONEY_NOTE : ''}
      ${pager}
    </article>
  </div>
</main>`;
}

// App screenshots (made by _src/shots.mjs into media/app/). In a page body:
//   <!-- shot: whot-turn | what the picture shows | caption -->              one phone
//   <!-- shots: a | alt | caption ;; b | alt | caption -->                  phones side by side
const SIZES = existsSync(join(ROOT, 'media', 'app', 'sizes.json')) ? JSON.parse(readFileSync(join(ROOT, 'media', 'app', 'sizes.json'), 'utf8')) : {};
function figure(spec, page) {
  const [name, alt, caption = ''] = spec.split('|').map((s) => s.trim());
  if (!SIZES[name] || !existsSync(join(ROOT, 'media', 'app', `${name}.webp`))) throw new Error(`${page}: no screenshot media/app/${name}.webp (add it to _src/shots.mjs)`);
  return `<figure class="shot"><img src="/media/app/${name}.webp" alt="${esc(alt)}" width="${SIZES[name][0] / 2}" height="${SIZES[name][1] / 2}" loading="lazy" decoding="async">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}
function screenshots(html, page) {
  return html
    .replace(/<!--\s*shots:([\s\S]*?)-->/g, (m, list) => `<div class="shots">${list.split(';;').map((s) => figure(s, page)).join('')}</div><p class="shots-note">Screens from the Zentra Arena app, with sample players and amounts.</p>`)
    .replace(/<!--\s*shot:([\s\S]*?)-->/g, (m, spec) => `<div class="shots shots-one">${figure(spec, page)}</div><p class="shots-note">A screen from the Zentra Arena app, with sample players and amounts.</p>`);
}

function read(path) {
  const file = join(PAGES, slugOf(path) + '.html');
  if (!existsSync(file)) throw new Error(`Missing page body: ${file}`);
  return screenshots(fill(readFileSync(file, 'utf8'), path), path);
}

function write(path, html) {
  const file = outFile(path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function redirect(from, to) {
  const file = join(ROOT, from.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `<!doctype html><html lang="en-NG"><head><meta charset="utf-8"><title>Moved</title><meta name="robots" content="noindex"><link rel="canonical" href="${SITE}${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><p>This page has moved to <a href="${to}">${SITE}${to}</a>.</p></body></html>\n`);
}

const pages = allPages();
for (const page of pages) {
  const body = read(page.path);
  const main = page.path === '/' ? `<main id="main" class="home">${body}${MONEY_NOTE.replace('note-18', 'note-18 home-note')}</main>` : article(page, body);
  write(page.path, `${head(page)}\n<body>\n${header(page.path)}\n${main}\n${footer()}`);
}

// 404: GitHub Pages serves /404.html for any missing address
{
  const [path, label, title, description] = NOT_FOUND;
  write(path, `${head({ path, title, description, noindex: true })}\n<body>\n${header(path)}\n<main id="main" class="page"><div class="page-in narrow"><article class="doc">${read(path)}</article></div></main>\n${footer()}`);
}

// old addresses from the first site
redirect('/how-zentra-works/', '/matches/');
redirect('/how-zentra-works/creating-a-match/', '/matches/create/');

const priority = (p) => p === '/' ? '1.0' : p.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6';
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${TODAY}</lastmod><priority>${priority(p.path)}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages, 404.html, 2 redirects, sitemap.xml and robots.txt.`);
