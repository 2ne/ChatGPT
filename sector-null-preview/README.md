# Sector Null preview — retired

The preview application has been removed. This directory only keeps static
redirect pages so existing links continue to work:

- `/ChatGPT/sector-null-preview/`
- `/ChatGPT/sector-null-preview/upgrade-cards-3d.html`

Both redirect immediately to **https://www.sectornull.dev/**, with an ordinary
link as a fallback. There are no dependencies, installation or compilation steps.
The shared Pages workflow copies the redirect HTML directly into its artifact.
The small `sw.js` retirement worker unregisters the former preview worker and
reloads only preview-scoped windows into the redirect. `version.json` also nudges
already-open preview sessions to reload when their old version check runs.
Neither file contains or rebuilds a preview game.

Active game source: https://github.com/2ne/sector-null.
Do not recreate a preview application or restore the old QA shortcuts here.
