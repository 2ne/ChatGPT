import { readFileSync, writeFileSync } from "node:fs";

const text = readFileSync(new URL("./maths.md", import.meta.url), "utf8");

const years = new Map(
  [...text.matchAll(/^\| \d+ \| `(cat-[^`]+)` \| [^|]+ \| ([^|]+) \|/gm)].map((m) => [
    m[1],
    m[2].trim(),
  ]),
);

const categories = [];
let current = null;

for (const line of text.split(/\r?\n/)) {
  const cat = line.match(/^## \d+\. `(cat-[^`]+)` — (.+)$/);
  if (cat) {
    current = { id: cat[1], title: cat[2].trim(), year: years.get(cat[1]) ?? "", nodes: [] };
    categories.push(current);
    continue;
  }
  const node = line.match(/^### (\d+)\. `([^`]+)` — (.+)$/);
  if (node && current) {
    current.nodes.push({ number: Number(node[1]), id: node[2], title: node[3].trim() });
  }
}

const nodeCount = categories.reduce((sum, c) => sum + c.nodes.length, 0);
if (categories.length !== 45 || nodeCount !== 124) {
  throw new Error(`Expected 45 categories and 124 nodes, found ${categories.length} and ${nodeCount}`);
}

const out = `// Generated from curriculum/maths.md by curriculum/build-path-data.mjs. Do not edit by hand.
import type { PathCategory } from "../types/path";

export const PATH_CATEGORIES: PathCategory[] = ${JSON.stringify(categories, null, 2)};
`;

writeFileSync(new URL("../src/data/path.generated.ts", import.meta.url), out);
console.log(`Wrote ${categories.length} categories and ${nodeCount} levels.`);
