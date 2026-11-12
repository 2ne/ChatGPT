import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function sectorNullBuild() {
  if (process.env.SECTOR_NULL_BUILD) return String(process.env.SECTOR_NULL_BUILD).trim();
  try {
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
const scoresApi = process.env.SECTOR_NULL_SCORES_API
  || 'https://br-calm-glitter-baz708ss-scores.compute.c-8.eu-central-1.aws.neon.tech/';

export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
    __SCORES_API__: JSON.stringify(scoresApi),
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(projectRoot, 'index.html'),
        upgradeCards3d: path.resolve(projectRoot, 'upgrade-cards-3d.html'),
      },
    },
  },
});
