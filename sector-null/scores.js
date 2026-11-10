const SCORES_API = typeof __SCORES_API__ !== 'undefined' ? __SCORES_API__ : '';

export function readPlayerName() {
  const raw = localStorage.getItem('sector-null-player-name');
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    return normalizeName(typeof parsed === 'string' ? parsed : '');
  } catch {
    return normalizeName(raw);
  }
}

export function writePlayerName(name) {
  const clean = normalizeName(name);
  try {
    localStorage.setItem('sector-null-player-name', JSON.stringify(clean));
  } catch { /* storage optional */ }
  return clean;
}

export function normalizeName(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3);
}

export async function fetchScores() {
  if (!SCORES_API) return { scores: [], offline: true };
  const res = await fetch(SCORES_API, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`scores ${res.status}`);
  return res.json();
}

export async function submitScore({ name, score, wave, kills, build, input, device }) {
  if (!SCORES_API) return { offline: true, entry: null, scores: [] };
  const res = await fetch(SCORES_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, score, wave, kills, build, input, device }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `submit ${res.status}`);
  }
  return res.json();
}

export { SCORES_API };
