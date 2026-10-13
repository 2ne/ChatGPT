# Coverage tracker — Primary Maths

Update this when quests ship.  
Status: `done` · `partial` · `missing`

## Snapshot

| Area | Status | Notes |
| --- | --- | --- |
| EYFS maths | missing | Need subitising / composition before expanding Y1 |
| Y1 maths — bonds to 10 | **partial** | `number-bonds-to-10` quest live |
| Y1 maths — rest | missing | Bonds to 20, counting, +/− problems… |
| Y2+ maths | missing | |

## Quests in the app

| Activity id | Year | Curriculum node | Status |
| --- | --- | --- | --- |
| `number-bonds-to-10` | Year 1 | `y1-bonds-10` (also reinforces EYFS `eyfs-bonds-10-some`) | partial — deepen and add related subtraction |

## Highest-value missing nodes (build next)

1. `eyfs-subitise-5`
2. `eyfs-compose-10` / deepen `y1-bonds-10`
3. `y1-bonds-20`
4. `y1-add-sub-20` (missing number)
5. `y1-count-100` + `y1-1-more-less`
6. `y2-place-value-100`
7. `y2-tables-2-5-10`

## How to tick something off

1. Ship a quest following `../AGENTS.md` and `../DESIGN.md`
2. Point `curriculumRef` / `skills` at a skill ID from `maths.md`
3. Move the row above from `missing` → `partial`/`done`
4. Prefer finishing a prerequisite chain over scattering random topics
