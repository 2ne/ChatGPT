const SCORES_API = typeof __SCORES_API__ !== 'undefined' ? __SCORES_API__ : '';

// Must match functions/scores MIN_WAVE: finish wave 1 before a board submit is offered.
export const MIN_SUBMIT_WAVE = 2;

const REJECT_COPY = {
  too_short: 'SCORE NOT SUBMITTED — FINISH WAVE 1 FIRST',
  rate_limited: 'TOO MANY SUBMISSIONS — TRY AGAIN SHORTLY',
  invalid_run: 'SCORE NOT SUBMITTED — INVALID RUN',
  implausible: 'SCORE NOT SUBMITTED — INVALID RUN',
  invalid_name: 'SCORE NOT SUBMITTED — INVALID CALLSIGN',
  invalid_score: 'SCORE NOT SUBMITTED — INVALID SCORE',
  invalid_build: 'SCORE NOT SUBMITTED — INVALID BUILD',
  server_error: 'COULDN’T REACH LEADERBOARD',
  offline: 'COULDN’T REACH LEADERBOARD',
};

export function rejectMessage(code) {
  return REJECT_COPY[code] || 'COULDN’T REACH LEADERBOARD';
}

/** Same eligibility the server uses for too_short (wave ≥ 2) plus a positive score. */
export function canSubmitScore(wave, score) {
  return Number(score) > 0 && Number(wave) >= MIN_SUBMIT_WAVE;
}

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

/** Fire-and-forget run token. Never throws; returns null when offline/failed. */
export async function startRun() {
  if (!SCORES_API) return null;
  try {
    const res = await fetch(SCORES_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'start_run' }),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return typeof data.runId === 'string' ? data.runId : null;
  } catch {
    return null;
  }
}

export async function submitScore({ runId, name, score, wave, kills, build, input, device }) {
  if (!SCORES_API) return { offline: true, entry: null, scores: [], error: 'offline' };
  try {
    const res = await fetch(SCORES_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit',
        runId,
        name,
        score,
        wave,
        kills,
        build,
        input,
        device,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        offline: false,
        rejected: true,
        error: data.error || 'server_error',
        entry: null,
        scores: data.scores || [],
      };
    }
    return data;
  } catch {
    return { offline: true, entry: null, scores: [], error: 'offline' };
  }
}

export { SCORES_API };
