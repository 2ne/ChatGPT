/**
 * Cheap content check: path integrity + load/validate every activity JSON
 * via Vite SSR (runs validateActivity without a full production build).
 *
 * Usage: node curriculum/check-activities.mjs
 * Or:    npm run check:activities
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createServer } from "vite";
import { lintActivities, pedagogyAllowlistNote } from "./pedagogy-lint.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pathCheck = spawnSync(process.execPath, [join(root, "curriculum", "check-path.mjs")], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});
if (pathCheck.stdout) process.stdout.write(pathCheck.stdout);
if (pathCheck.stderr) process.stderr.write(pathCheck.stderr);
if (pathCheck.status !== 0) {
  console.error("check-path failed");
  process.exit(pathCheck.status ?? 1);
}

const server = await createServer({
  root,
  configFile: join(root, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const mod = await server.ssrLoadModule("/src/data/activities/index.ts");
  const realizeMod = await server.ssrLoadModule("/src/lib/realize.ts");
  const list = mod.activities;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("No activities loaded");
  }
  const ids = new Set();
  const slots = new Set();
  for (const activity of list) {
    if (ids.has(activity.id)) throw new Error(`Duplicate activity id: ${activity.id}`);
    ids.add(activity.id);
    const slot = `${activity.pathNode}:${activity.difficulty}`;
    if (slots.has(slot)) throw new Error(`Duplicate map slot: ${slot} (${activity.id})`);
    slots.add(slot);
  }
  const pedagogy = lintActivities(list);
  const leftover = [];
  for (const activity of list) {
    const realized = realizeMod.realizeActivity(activity, activity.id);
    for (const question of realized.questions) {
      const found = realizeMod.leftoverPlaceholders(realizeMod.questionChildText(question));
      if (found.length) {
        leftover.push(`${activity.id}/${question.id}: leftover placeholder ${found.join(" ")}`);
      }
    }
  }
  pedagogy.push(...leftover);
  if (pedagogy.length) {
    for (const line of pedagogy) console.error(line);
    console.error(`\n${pedagogy.length} pedagogy checks failed. ${pedagogyAllowlistNote}`);
    throw new Error("pedagogy lint failed");
  }
  console.log(`OK ${list.length} activities validated`);
  console.log(pedagogyAllowlistNote);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  await server.close();
  process.exit(1);
}

await server.close();
