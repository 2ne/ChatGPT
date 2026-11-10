const LIMIT = 25;
const NAME_RE = /^[A-Z0-9]{1,3}$/;
const BUILD_RE = /^[A-Za-z0-9._-]{1,32}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INPUT_OK = new Set(['touch', 'pointer', 'gamepad', 'mixed']);
const DEVICE_OK = new Set(['phone', 'tablet', 'desktop']);
const ALLOWED = new Set([
  'https://2ne.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);

// Generous anti-cheat floors/ceilings from Sector Null balancing.
// Wave 1 alone needs lead-in + banner + multi-spawn cadence; 8s/completed wave stays well under real clears.
const MIN_WAVE = 2; // must have finished wave 1
const MIN_SECONDS_PER_COMPLETED_WAVE = 8;
const MAX_SCORE_PER_SECOND = 6000;
const START_RATE_PER_MIN = 20;
const SUBMIT_RATE_PER_MIN = 5;

const ALLOWED_ORIGIN = 'https://2ne.github.io';

function cors(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED.has(origin) ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors(req),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

type Row = Record<string, unknown>;

async function query(text: string, params: unknown[] = []): Promise<Row[]> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL missing');
  const host = new URL(url).hostname;
  const endpoint = `https://${host.replace(/^[^.]+/, 'api')}/sql`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Neon-Connection-String': url,
    },
    body: JSON.stringify({ query: text, params }),
  });
  if (!res.ok) throw new Error(`sql ${res.status}: ${(await res.text()).slice(0, 240)}`);
  const data = await res.json() as { rows?: Array<Row | unknown[]>; fields?: Array<{ name: string }> } | Row[];
  if (Array.isArray(data)) return data;
  return (data.rows || []).map((row) => {
    if (row && typeof row === 'object' && !Array.isArray(row)) return row as Row;
    const out: Row = {};
    (data.fields || []).forEach((field, i) => { out[field.name] = (row as unknown[])[i]; });
    return out;
  });
}

function mapRow(row: Row) {
  return {
    id: String(row.id),
    name: String(row.name),
    score: Number(row.score),
    wave: Number(row.wave),
    kills: Number(row.kills),
    build: String(row.build_version),
    createdAt: String(row.created_at),
    rank: Number(row.rank),
  };
}

function optEnum(value: unknown, allowed: Set<string>): string | null {
  const v = String(value ?? '').trim().toLowerCase();
  return allowed.has(v) ? v : null;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  const first = fwd.split(',')[0]?.trim();
  return first
    || req.headers.get('cf-connecting-ip')
    || req.headers.get('x-real-ip')
    || '0.0.0.0';
}

let saltCache: string | null = null;
async function ipSalt(): Promise<string> {
  if (saltCache) return saltCache;
  const rows = await query(`SELECT value FROM app_secrets WHERE key = 'ip_hash_salt' LIMIT 1`);
  saltCache = String(rows[0]?.value || 'sector-null');
  return saltCache;
}

async function hashIp(req: Request): Promise<string> {
  const salt = await ipSalt();
  const raw = `${salt}:${clientIp(req)}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function listScores() {
  return query(
    `SELECT id, name, score, wave, kills, build_version, created_at,
            RANK() OVER (ORDER BY score DESC, created_at ASC) AS rank
     FROM scores
     ORDER BY score DESC, created_at ASC
     LIMIT $1`,
    [LIMIT],
  );
}

async function pruneOldRuns() {
  await query(`DELETE FROM runs WHERE started_at < now() - interval '24 hours'`);
}

async function startRun(req: Request): Promise<Response> {
  const ipHash = await hashIp(req);
  // Opportunistic prune; ignore failures so starts stay cheap.
  try { await pruneOldRuns(); } catch { /* non-fatal */ }

  const recent = await query(
    `SELECT COUNT(*)::int AS n FROM runs
     WHERE ip_hash = $1 AND started_at > now() - interval '1 minute'`,
    [ipHash],
  );
  if (Number(recent[0]?.n || 0) >= START_RATE_PER_MIN) {
    return json(req, { error: 'rate_limited' }, 429);
  }

  const rows = await query(
    `INSERT INTO runs (ip_hash) VALUES ($1) RETURNING id::text AS id`,
    [ipHash],
  );
  return json(req, { runId: String(rows[0]?.id) }, 201);
}

async function submitScore(req: Request, body: Record<string, unknown>): Promise<Response> {
  const runId = String(body.runId || body.run_id || '').trim();
  const name = String(body.name || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  const score = Math.round(Number(body.score));
  const wave = Math.max(1, Math.round(Number(body.wave) || 1));
  const kills = Math.max(0, Math.round(Number(body.kills) || 0));
  const build = String(body.build || body.build_version || 'dev').slice(0, 32);
  const input = optEnum(body.input, INPUT_OK);
  const device = optEnum(body.device, DEVICE_OK);

  if (!UUID_RE.test(runId)) return json(req, { error: 'invalid_run' }, 400);
  if (!NAME_RE.test(name)) return json(req, { error: 'invalid_name' }, 400);
  if (!Number.isFinite(score) || score <= 0 || score > 100_000_000) return json(req, { error: 'invalid_score' }, 400);
  if (wave > 10_000 || kills > 1_000_000) return json(req, { error: 'invalid_run' }, 400);
  if (!BUILD_RE.test(build)) return json(req, { error: 'invalid_build' }, 400);

  if (wave < MIN_WAVE) return json(req, { error: 'too_short' }, 400);

  const ipHash = await hashIp(req);
  const submitRecent = await query(
    `SELECT COUNT(*)::int AS n FROM runs
     WHERE ip_hash = $1 AND used = true AND used_at > now() - interval '1 minute'`,
    [ipHash],
  );
  if (Number(submitRecent[0]?.n || 0) >= SUBMIT_RATE_PER_MIN) {
    return json(req, { error: 'rate_limited' }, 429);
  }

  const runRows = await query(
    `SELECT id::text AS id, used, EXTRACT(EPOCH FROM (now() - started_at))::float AS elapsed
     FROM runs WHERE id = $1::uuid LIMIT 1`,
    [runId],
  );
  const run = runRows[0];
  if (!run) return json(req, { error: 'invalid_run' }, 400);
  if (run.used === true || run.used === 't' || run.used === 'true') {
    return json(req, { error: 'invalid_run' }, 400);
  }

  const elapsed = Math.max(0, Number(run.elapsed) || 0);
  const completedWaves = Math.max(0, wave - 1);
  const minElapsed = completedWaves * MIN_SECONDS_PER_COMPLETED_WAVE;
  if (elapsed < minElapsed) return json(req, { error: 'implausible' }, 400);
  if (elapsed > 0 && score / elapsed > MAX_SCORE_PER_SECOND) {
    return json(req, { error: 'implausible' }, 400);
  }

  const claimed = await query(
    `UPDATE runs SET used = true, used_at = now()
     WHERE id = $1::uuid AND used = false
     RETURNING id`,
    [runId],
  );
  if (!claimed.length) return json(req, { error: 'invalid_run' }, 400);

  const inserted = await query(
    `INSERT INTO scores (name, score, wave, kills, build_version, input, device)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, score, wave, kills, build_version, created_at, input, device`,
    [name, score, wave, kills, build, input, device],
  );
  const row = inserted[0];
  const rankRows = await query(
    `SELECT 1 + COUNT(*)::int AS rank FROM scores
     WHERE score > $1 OR (score = $1 AND created_at < $2::timestamptz)`,
    [Number(row.score), String(row.created_at)],
  );
  return json(req, {
    entry: {
      ...mapRow({ ...row, rank: rankRows[0]?.rank || 1 }),
      input: row.input == null ? null : String(row.input),
      device: row.device == null ? null : String(row.device),
    },
    scores: (await listScores()).map(mapRow),
  }, 201);
}

export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
    try {
      if (req.method === 'GET') {
        return json(req, { scores: (await listScores()).map(mapRow) });
      }
      if (req.method === 'POST') {
        let body: Record<string, unknown>;
        try { body = await req.json() as Record<string, unknown>; }
        catch { return json(req, { error: 'invalid_json' }, 400); }

        const action = String(body.action || 'submit').toLowerCase();
        if (action === 'start_run' || action === 'start') return startRun(req);
        if (action === 'submit' || action === 'submit_score') return submitScore(req, body);
        return json(req, { error: 'invalid_action' }, 400);
      }
      return json(req, { error: 'method_not_allowed' }, 405);
    } catch (err) {
      console.error(err);
      return json(req, { error: 'server_error' }, 500);
    }
  },
};
