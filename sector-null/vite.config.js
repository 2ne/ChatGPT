import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function sectorNullBuild() {
  if (process.env.SECTOR_NULL_BUILD) return String(process.env.SECTOR_NULL_BUILD).trim();
  try {
    // Count commits that touched this project folder. Path is `.` with cwd set to
    // sector-null so it works whether Vite is launched from the repo root or here.
    return execSync('git rev-list --count HEAD -- .', {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || 'dev';
  } catch {
    return 'dev';
  }
}

const buildVersion = sectorNullBuild();

export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
});
