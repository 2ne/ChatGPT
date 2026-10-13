import { readFileSync } from "node:fs";

const text = readFileSync(new URL("./maths.md", import.meta.url), "utf8");
const nodes = [...text.matchAll(/^### (\d+)\. `([^`]+)` — (.+)$/gm)].map((m) => ({
  n: Number(m[1]),
  id: m[2],
  title: m[3],
}));
const reqs = [...text.matchAll(/^Requires: (.+)\. Quest:/gm)].map((m) =>
  m[1].replaceAll("`", "").trim(),
);
const cats = [...text.matchAll(/^## (\d+)\. `([^`]+)` — /gm)];
const problems = [];
const ids = new Set();

nodes.forEach((node, i) => {
  if (node.n !== i + 1) problems.push(`number ${node.n} expected ${i + 1}`);
  if (ids.has(node.id)) problems.push(`duplicate ${node.id}`);
  ids.add(node.id);
});

if (nodes.length !== 124) problems.push(`node count ${nodes.length}`);
if (cats.length !== 45) problems.push(`category count ${cats.length}`);
if (reqs.length !== nodes.length) problems.push(`requires ${reqs.length}`);

nodes.forEach((node, i) => {
  const req = reqs[i];
  if (i === 0) {
    if (!req?.startsWith("none")) problems.push(`start requires ${req}`);
  } else if (req !== nodes[i - 1].id) {
    problems.push(`${node.n} ${node.id} requires ${req}, previous is ${nodes[i - 1].id}`);
  }
});

const statuses = [...text.matchAll(/Status: (missing|partial|done)/g)].map((m) => m[1]);
const partial = statuses.filter((s) => s === "partial").length;
const missing = statuses.filter((s) => s === "missing").length;
const done = statuses.filter((s) => s === "done").length;

console.log(
  JSON.stringify(
    {
      nodes: nodes.length,
      categories: cats.length,
      requires: reqs.length,
      missing,
      partial,
      done,
      problems,
    },
    null,
    2,
  ),
);
