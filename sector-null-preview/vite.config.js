import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
// This project only publishes to /sector-null-preview/.
const isPreview = true;

function sectorNullBuild() {
  if (process.env.SECTOR_NULL_BUILD) return String(process.env.SECTOR_NULL_BUILD).trim();
  try {
    return String(236 + Math.max(1, Number(execSync('git rev-list --count 8dd21e3..HEAD -- .', {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || 0)));
  } catch {
    return 'dev';
  }
}

function gitShort() {
  if (process.env.PREVIEW_COMMIT) return String(process.env.PREVIEW_COMMIT).trim().slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim().slice(0, 7) || 'local';
  } catch {
    return 'local';
  }
}

/** UK local time HH:MM for the stamp (Europe/London). */
function ukTimeNow() {
  if (process.env.PREVIEW_TIME) return String(process.env.PREVIEW_TIME).trim();
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    const d = new Date();
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  }
}

const buildVersion = sectorNullBuild();
const previewCommit = gitShort();
const previewTime = ukTimeNow();
const previewId = `b${buildVersion}-${previewCommit}-${previewTime.replace(':', '')}`;

const scoresApi = process.env.SECTOR_NULL_SCORES_API
  || 'https://br-calm-glitter-baz708ss-scores.compute.c-8.eu-central-1.aws.neon.tech/';

const CACHE_META = `
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta name="sector-null-preview" content="${previewId}" />
`.trim();

function previewBuildPlugin() {
  return {
    name: 'sector-null-preview',
    transformIndexHtml(html) {
      if (!isPreview) return html;
      if (html.includes('Cache-Control')) return html;
      return html.replace('</head>', `  ${CACHE_META}\n</head>`);
    },
    writeBundle(options) {
      if (!isPreview) return;
      const outDir = options.dir || path.resolve(projectRoot, 'dist');
      const version = {
        id: previewId,
        build: buildVersion,
        commit: previewCommit,
        time: previewTime,
        preview: true,
      };
      fs.writeFileSync(path.join(outDir, 'version.json'), `${JSON.stringify(version, null, 2)}\n`);
      // Keep Apple Home Screen / any future SW from treating the shell as immutable.
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
      const sw = `/* Preview: never cache the app shell. Generated; do not use on live. */
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  // This preview never creates caches. Leave other projects' caches untouched.
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/version.json')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
  }
});
`;
      fs.writeFileSync(path.join(outDir, 'sw.js'), sw);
    },
  };
}

export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
    __SCORES_API__: JSON.stringify(scoresApi),
    __PREVIEW__: JSON.stringify(isPreview),
    __PREVIEW_BUILD__: JSON.stringify(isPreview ? buildVersion : ''),
    __PREVIEW_COMMIT__: JSON.stringify(isPreview ? previewCommit : ''),
    __PREVIEW_TIME__: JSON.stringify(isPreview ? previewTime : ''),
    __PREVIEW_ID__: JSON.stringify(isPreview ? previewId : ''),
  },
  plugins: [previewBuildPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(projectRoot, 'index.html'),
        upgradeCards3d: path.resolve(projectRoot, 'upgrade-cards-3d.html'),
      },
    },
  },
});
