# UK primary maths map (England)

Working notes for **Primary Maths**, distilled from official DfE sources so we can build quests in the right order and see gaps.

**Current phase:** mathematics only. The long-term product is a pathway for every UK curriculum subject — do not add English, science, or foundation-subject pathways until asked.

Each node has **three levels** (Easy / Medium / Hard). Prefer finishing those on shipped nodes before adding a new node. See `../AGENTS.md`.

## How to use these files

1. Prefer a missing Medium or Hard on a node that already has Easy. When expanding, open `maths.md` and take the first node marked `missing`.
2. Follow `audit.md` before and after writing that quest.
3. Use that node’s id as `pathNode` and `curriculumRef`, set `difficulty` to `1` / `2` / `3`, and use its title as the quest name. Write the quest as JSON in `src/data/activities/`. The map looks up `pathNode` + `difficulty`.
4. Update the node status in `maths.md` and the scoreboard in `coverage.md`.

Agents: when creating quests, set `pathNode`, `difficulty`, `curriculumRef` and `skills` to match a node in these files.

## Files

| File | What it covers |
| --- | --- |
| [overview.md](./overview.md) | Stages and ages |
| [eyfs.md](./eyfs.md) | Reception maths (before Year 1) |
| [maths.md](./maths.md) | The path: 45 categories, 124 quest nodes, Reception → Year 6 |
| [audit.md](./audit.md) | How to check the path before creating quests |
| [coverage.md](./coverage.md) | How many nodes are missing, partial or done |

## Jurisdiction

This map follows the **England** National Curriculum mathematics programmes of study and the EYFS mathematics Early Learning Goals.  
Wales, Scotland and Northern Ireland use different systems — do not mix them in without an explicit request.

## Sources (official)

- [EYFS statutory framework](https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2)
- [Development Matters (non-statutory EYFS guidance)](https://www.gov.uk/government/publications/development-matters--2)
- [Mathematics programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study)

These MD files are **summaries for product planning**, not a full legal reprint of the statutory documents.
