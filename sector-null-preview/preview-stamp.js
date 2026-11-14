/**
 * Preview build label + version check, enabled by this project's Vite config.
 */

const IS_PREVIEW = typeof __PREVIEW__ !== 'undefined' && !!__PREVIEW__;
const PREVIEW_BUILD = typeof __PREVIEW_BUILD__ !== 'undefined' ? String(__PREVIEW_BUILD__) : '';
const PREVIEW_COMMIT = typeof __PREVIEW_COMMIT__ !== 'undefined' ? String(__PREVIEW_COMMIT__) : '';
const PREVIEW_TIME = typeof __PREVIEW_TIME__ !== 'undefined' ? String(__PREVIEW_TIME__) : '';
const PREVIEW_ID = typeof __PREVIEW_ID__ !== 'undefined' ? String(__PREVIEW_ID__) : '';

const RELOAD_KEY = 'sectorNullPreviewReload';

function stampText() {
  return `PREVIEW b${PREVIEW_BUILD} · ${PREVIEW_COMMIT} · ${PREVIEW_TIME}`;
}

let stampNote = '';

function mountStamp() {
  if (document.getElementById('previewStamp')) return;
  const el = document.createElement('div');
  el.id = 'previewStamp';
  el.setAttribute('aria-hidden', 'true');
  el.textContent = stampText();
  document.body.appendChild(el);
}

function paintStamp() {
  const el = document.getElementById('previewStamp');
  if (!el) return;
  el.textContent = stampNote ? `${stampText()}\n${stampNote}` : stampText();
}

/** Optional second line on the preview stamp (dev=bay build summary, etc.). */
export function setPreviewStampNote(note = '') {
  stampNote = String(note || '').trim();
  if (document.getElementById('previewStamp')) paintStamp();
  else if (IS_PREVIEW) {
    mountStamp();
    paintStamp();
  }
}

async function fetchVersion() {
  const url = `./version.json?t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

async function checkVersion() {
  if (!IS_PREVIEW || !PREVIEW_ID) return;
  try {
    const remote = await fetchVersion();
    if (!remote?.id) return;
    if (remote.id === PREVIEW_ID) {
      // Healthy: clear any prior reload guard for this id.
      if (sessionStorage.getItem(RELOAD_KEY) === PREVIEW_ID) sessionStorage.removeItem(RELOAD_KEY);
      return;
    }
    // Stale app shell. Reload once per target id to avoid loops if cache still sticky.
    if (sessionStorage.getItem(RELOAD_KEY) === remote.id) return;
    sessionStorage.setItem(RELOAD_KEY, remote.id);
    const url = new URL(location.href);
    url.searchParams.set('pv', remote.id);
    location.replace(url.toString());
  } catch {
    // Offline / Pages blip — leave the running preview alone.
  }
}

function registerPreviewWorker() {
  if (!('serviceWorker' in navigator)) return;
  // Preview SW only exists in PREVIEW builds; it forces no-store for index/version.
  navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {});
  navigator.serviceWorker.getRegistrations?.().then((regs) => {
    const scope = new URL('./', location.href).href;
    for (const reg of regs) if (reg.scope === scope) reg.update?.();
  }).catch(() => {});
}

export function initPreviewStamp() {
  if (!IS_PREVIEW) return;
  mountStamp();
  paintStamp();
  registerPreviewWorker();
  checkVersion();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkVersion();
  });
  window.addEventListener('focus', () => checkVersion());
}
