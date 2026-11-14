# zenn.com.ng

The public Zenn / Zentra website. Plain static HTML, served by GitHub Pages from the root of
`main` (the `CNAME` file points zenn.com.ng at it). **A push to `main` goes live** within a couple
of minutes. GitHub Pages doesn't publish folders that start with `_`, so this folder stays private.

## Editing

- Every page's address, menu label, `<title>` and description are in `site.mjs`.
- Each page's body is in `pages/<address>.html` (`/games/chess/` → `pages/games/chess.html`,
  the home page is `pages/index.html`). The layout adds the header, menu, breadcrumbs, page title,
  "On this page", the 18+ note on money pages, next/previous links and the footer.
- `{{APP}}` (zentra.com.ng), `{{EMAIL}}` and `{{SITE}}` are filled in when the site is built.
- The look is in `../assets/site.css`. All colours are tokens at the top.

## Building

Needs Node 20 or newer, nothing to install.

```
node _src/build.mjs     # writes the HTML files, sitemap.xml, robots.txt, 404.html and old-address redirects
node _src/og.mjs        # makes share images for new pages in media/og/ (FORCE=1 remakes all; needs Edge or set EDGE)
node _src/check.mjs     # fails on any broken link, missing title, description or share image
node _src/serve.mjs     # look at it on http://localhost:4173
```

Run `og.mjs` with `FORCE=1` after changing a page's title or description, so its share image matches.

## App screenshots

Pages show real app screens. They come from zentra-web's own browser tests, which run the real app
against a fake server with sample players, so no real account or money appears. To refresh them:

```
cd ../zentra-web && npm run test:e2e     # writes tests/e2e/output/*.png
cd ../zenn-website && node _src/shots.mjs   # copies the chosen ones to media/app/ as WebP
node _src/build.mjs
```

`shots.mjs` lists which test screen becomes which site image, and notes the screens left out on
purpose (ones whose sample amounts don't match real Zentra rules). In a page body, put
`<!-- shot: name | alt text | caption -->`, or `<!-- shots: a | alt | caption ;; b | alt | caption -->`
for several side by side.
Commit the built files along with the sources.

## Keep accurate

Fees, limits and rules on these pages were written from the Zentra app and server code on
2026-11-14. When a number changes in the app (stakes, withdrawal limits, gift amounts, club fee,
league stake, clocks), change it here too. The terms page is copied from the app's
`TermsText.svelte`, so update both together.
