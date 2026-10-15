import type { DiffHunk } from "../types";

export const diffSummarise: DiffHunk = {
  path: "src/api/summarise.ts",
  lines: [
    { kind: "del", text: 'export async function summarise(text: string) {' },
    { kind: "del", text: '  return fetch("https://api.openai.com/v1/chat/completions", {' },
    { kind: "del", text: "    method: \"POST\"," },
    { kind: "del", text: "    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }," },
    { kind: "del", text: "    body: JSON.stringify({ model: \"gpt-4o\", messages: [{ role: \"user\", content: text }] })," },
    { kind: "del", text: "  });" },
    { kind: "del", text: "}" },
    { kind: "add", text: 'export async function summarise(text: string, user: Session) {' },
    { kind: "add", text: "  await requireSso(user);" },
    { kind: "add", text: '  const result = await fetch("https://models.internal.firm/v1/summarise", {' },
    { kind: "add", text: "    method: \"POST\"," },
    { kind: "add", text: "    headers: { Authorization: `Bearer ${user.token}` }," },
    { kind: "add", text: "    body: JSON.stringify({ matterId: user.matterId, text })," },
    { kind: "add", text: "  });" },
    { kind: "add", text: '  audit.log({ actor: user.id, action: "summarise", boundary: "approved" });' },
    { kind: "add", text: "  return result;" },
    { kind: "add", text: "}" },
  ],
};

export const diffAuth: DiffHunk = {
  path: "src/middleware/auth.ts",
  lines: [
    { kind: "add", text: "export async function requireSso(user: Session) {" },
    { kind: "add", text: "  if (!user?.token) throw new AuthError(\"SSO required\");" },
    { kind: "add", text: "  return user;" },
    { kind: "add", text: "}" },
  ],
};

export const diffBrief: DiffHunk = {
  path: "src/components/Brief.tsx",
  lines: [
    { kind: "del", text: "export function Brief({ summary }: Props) {" },
    { kind: "del", text: "  return <article>{summary}</article>;" },
    { kind: "del", text: "}" },
    { kind: "add", text: "export function Brief({ claims }: Props) {" },
    { kind: "add", text: "  return (" },
    { kind: "add", text: "    <article>" },
    { kind: "add", text: "      {claims.map((claim) => (" },
    { kind: "add", text: "        <span key={claim.id}>" },
    { kind: "add", text: "          {claim.text}" },
    { kind: "add", text: "          <Cite n={claim.source} onOpen={() => openPassage(claim.source)} />" },
    { kind: "add", text: "        </span>" },
    { kind: "add", text: "      ))}" },
    { kind: "add", text: "    </article>" },
    { kind: "add", text: "  );" },
    { kind: "add", text: "}" },
  ],
};

export const diffConfidence: DiffHunk = {
  path: "src/components/Brief.tsx",
  lines: [
    { kind: "ctx", text: "          {claim.text}" },
    { kind: "add", text: "          {claim.confidence === \"low\" && (" },
    { kind: "add", text: '            <Flag>Low confidence — check source</Flag>' },
    { kind: "add", text: "          )}" },
    { kind: "ctx", text: "          <Cite n={claim.source} onOpen={() => openPassage(claim.source)} />" },
  ],
};

export const diffAnalytics: DiffHunk = {
  path: "src/lib/pilot.ts",
  lines: [
    { kind: "add", text: 'export const PILOT_FLAGS = { sourceChoice: true };' },
    { kind: "add", text: "" },
    { kind: "add", text: "export function trackSourceChoice(mode: \"documents\" | \"matter\") {" },
    { kind: "add", text: '  fetch("/pilot/track", { method: "POST", body: JSON.stringify({ mode }) });' },
    { kind: "add", text: "}" },
  ],
};
