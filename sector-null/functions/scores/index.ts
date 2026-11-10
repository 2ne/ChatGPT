const LIMIT = 8;
const NAME_RE = /^[A-Z0-9]{1,3}$/;
const BUILD_RE = /^[A-Za-z0-9._-]{1,32}$/;
const INPUT_OK = new Set(['touch', 'pointer', 'gamepad', 'mixed']);
const DEVICE_OK = new Set(['phone', 'tablet', 'desktop']);
const ALLOWED = new Set([
  'https://2ne.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);

function cors(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED.has(origin) ? origin : 'https://2ne.github.io',
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
  // Board UI stays name/score/wave/kills only; input/device are stored but hidden.
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

        const name = String(body.name || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
        const score = Math.round(Number(body.score));
        const wave = Math.max(1, Math.round(Number(body.wave) || 1));
        const kills = Math.max(0, Math.round(Number(body.kills) || 0));
        const build = String(body.build || body.build_version || 'dev').slice(0, 32);
        const input = optEnum(body.input, INPUT_OK);
        const device = optEnum(body.device, DEVICE_OK);

        if (!NAME_RE.test(name)) return json(req, { error: 'invalid_name' }, 400);
        if (!Number.isFinite(score) || score <= 0 || score > 100_000_000) return json(req, { error: 'invalid_score' }, 400);
        if (wave > 10_000 || kills > 1_000_000) return json(req, { error: 'invalid_run' }, 400);
        if (!BUILD_RE.test(build)) return json(req, { error: 'invalid_build' }, 400);

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
      return json(req, { error: 'method_not_allowed' }, 405);
    } catch (err) {
      console.error(err);
      return json(req, { error: 'server_error' }, 500);
    }
  },
};
