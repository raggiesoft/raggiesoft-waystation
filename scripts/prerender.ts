/**
 * @license MIT
 * ============================================================================
 * scripts/prerender.ts — Node Static Site Generator Using `mithril-node-render`
 * Property: https://waystation.raggiesoft.com (raggiesoft-waystation)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL STATIC SITE GENERATION GUIDE):
 *   How does Mithril.js pre-render static HTML on the server?
 *     1. `renderMithrilVnode` walks the exact same `createWaystationApp(...)`
 *        Hyperscript component tree used in the browser and serializes its
 *        Virtual-DOM Vnodes into an HTML string right inside Node.js!
 *     2. We wrap that HTML inside our accessible document shell—using ABSOLUTE
 *        `https://waystation.raggiesoft.com/assets/...` asset URLs inside
 *        `dist/404.html` as extra defense-in-depth alongside Nginx's `/assets/`
 *        location block so even if any proxy or sub-path serves `404.html`,
 *        CSS and Mithril JS load 100% reliably!
 *     3. Writes `/index.html`, `/guides/index.html`, `/realms/index.html`,
 *        `/404.html` (`noindex, follow`), `/sitemap.xml`, `/robots.txt`, and
 *        our IndexNow verification file, enforcing `<title>` <= 60 chars and
 *        `<meta description>` <= 155 chars!
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import m from 'mithril';
import { createWaystationApp } from '../src/components/WaystationApp.js';
import { renderMithrilVnode } from '../src/ssg/renderMithrilVnode.js';
import {
  INDEXNOW_KEY,
  SITE_ORIGIN,
  WAYSTATION_ROUTES,
  type PageRouteSpec
} from '../src/data/realms.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtmlDocument(opts: {
  route: PageRouteSpec;
  appHtml: string;
  is404: boolean;
}): string {
  const { route, appHtml, is404 } = opts;

  if (route.seoTitle.length > 60) {
    throw new Error(`SEO Title exceeds 60 chars (${route.seoTitle.length}): ${route.seoTitle}`);
  }
  if (route.seoDescription.length > 155) {
    throw new Error(
      `SEO Description exceeds 155 chars (${route.seoDescription.length}): ${route.seoDescription}`
    );
  }

  const canonicalUrl = `${SITE_ORIGIN}${route.path === '/' ? '/' : route.path}`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    name: route.seoTitle,
    description: route.seoDescription,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: 'The Uncharted Waystation (RaggieSoft Universe)',
      url: `${SITE_ORIGIN}/`
    }
  });

  return `<!doctype html>
<!--
  The Uncharted Waystation (https://waystation.raggiesoft.com)
  Pre-rendered with Mithril.js Hyperscript Static SSG and TypeScript.
-->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light dark" />
    <script>
      try {
        var s = localStorage.getItem('color-scheme');
        if (s === 'light' || s === 'dark') {
          document.querySelector('meta[name="color-scheme"]').content = s;
        }
      } catch (e) {}
    </script>
    <meta name="theme-color" content="#f8f3e6" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#090817" media="(prefers-color-scheme: dark)" />

    <title>${escapeHtml(route.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(route.seoDescription)}" />
    ${
      is404
        ? '<meta name="robots" content="noindex, follow" />'
        : `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    }

    <meta property="og:site_name" content="The Uncharted Waystation" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(route.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(route.seoDescription)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(route.ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="675" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(route.seoDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(route.ogImage)}" />

    <link rel="stylesheet" href="https://assets.raggiesoft.com/common/css/raggiesoft-network.css?v=20261120b" />
    <link rel="stylesheet" href="/assets/waystation.css" />
    ${is404 ? '' : `<script type="application/ld+json">${jsonLd}</script>`}
  </head>
  <body>
    <a href="#main-content" class="ws-skip-link">Skip to Waystation Astrolabe</a>

    <nav class="rs-network-bar" aria-label="RaggieSoft Ecosystem Network">
      <div class="rs-network-bar-inner">
        <span class="rs-network-label">✦ RaggieSoft Network:</span>
        <ul class="rs-network-links">
          <li><a href="https://raggiesoft.com">🌐 Hub</a></li>
          <li><a href="https://books.raggiesoft.com">📚 Ocean View Archives</a></li>
          <li><a href="https://crossroads.raggiesoft.com">🧭 Story Crossroads</a></li>
          <li><a href="https://cedarrun.raggiesoft.com">🌲 Cedar Run</a></li>
          <li><a href="https://music.raggiesoft.com">🎧 The Listening Room</a></li>
          <li><a href="https://waystation.raggiesoft.com" aria-current="page" class="is-active">🔮 Waystation</a></li>
        </ul>
      </div>
    </nav>

    <div id="app" data-waystation-path="${escapeHtml(route.path)}" data-waystation-404="${
      is404 ? 'true' : 'false'
    }">${appHtml}</div>

    <script src="https://assets.raggiesoft.com/common/js/raggiesoft-network.js?v=20261120b" defer></script>
    <script type="module" src="/assets/waystation-app.js"></script>
  </body>
</html>
`;
}

async function main(): Promise<void> {
  fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
  fs.copyFileSync(
    path.join(rootDir, 'src/styles/waystation.css'),
    path.join(distDir, 'assets/waystation.css')
  );

  for (const route of WAYSTATION_ROUTES) {
    const appHtml = renderMithrilVnode(
      m(createWaystationApp({ initialPath: route.path, force404Mode: false }))
    );
    const fullHtml = buildHtmlDocument({ route, appHtml, is404: false });

    if (route.path === '/') {
      fs.writeFileSync(path.join(distDir, 'index.html'), fullHtml, 'utf8');
    } else {
      const clean = route.path.replace(/^\//, '');
      const subDir = path.join(distDir, clean);
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(subDir, 'index.html'), fullHtml, 'utf8');
      fs.writeFileSync(path.join(distDir, `${clean}.html`), fullHtml, 'utf8');
    }
    console.log(`  ✓ Prerendered ${route.path} -> ${SITE_ORIGIN}${route.path}`);
  }

  // Prerender genuine 404 Rift Catch-All Page (`dist/404.html` with `noindex, follow`)
  const route404: PageRouteSpec = {
    path: '/',
    navLabel: '404 Rift',
    seoTitle: '404 Uncharted Rift | The Uncharted Waystation',
    seoDescription:
      'That subdomain or trail is unmapped—Nolan and Gwen Lennox welcome you to our 1980s fantasy Waystation to point you across the RaggieSoft universe.',
    ogImage: WAYSTATION_ROUTES[0].ogImage
  };
  const app404Html = renderMithrilVnode(
    m(createWaystationApp({ initialPath: '/', force404Mode: true }))
  );
  fs.writeFileSync(
    path.join(distDir, '404.html'),
    buildHtmlDocument({ route: route404, appHtml: app404Html, is404: true }),
    'utf8'
  );
  console.log('  ✓ Prerendered /404.html (1980s Fantasy Rift Catch-All, noindex)');

  // Sitemap, robots.txt, and IndexNow verification key
  const todayIso = new Date().toISOString().slice(0, 10);
  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...WAYSTATION_ROUTES.map(
      (r) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>\n    <lastmod>${todayIso}</lastmod>\n  </url>`
    ),
    '</urlset>',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

  const robotsTxt = [
    `# The Uncharted Waystation (${SITE_ORIGIN})`,
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(distDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf8');

  fs.rmSync(path.join(rootDir, '.ssg-temp'), { recursive: true, force: true });
  console.log('✅ Mithril.js Static SSG build complete for waystation.raggiesoft.com!');
}

main().catch((err) => {
  console.error('❌ Waystation Mithril SSG failed:', err);
  process.exit(1);
});
