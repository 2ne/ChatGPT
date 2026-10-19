# How to audit the maths path

Use this before writing a quest, and again after it ships. The path in [maths.md](./maths.md) is the source of names. Do not invent a second list of categories or quest titles.

The home screen **is** the path map (`PathMap` + `LevelSheet`, driven by `buildLevels` in `src/lib/path.ts`). Categories and order come from `maths.md` via `src/data/path.generated.ts`. Everything is open. The path suggests an order but never blocks.

## Vision for this file

This audit is for the **primary maths** path only. English or other subjects might come later as separate work. Do not add them here until asked.

Every node has **three levels**: Easy (`difficulty: 1`), Medium (`2`), Hard (`3`). Mastering all three means the child can do that skill. Prefer writing the missing Medium / Hard quests on shipped nodes before adding a new node.

## What “covered” means

The England primary maths curriculum here is:

- EYFS mathematics Early Learning Goals (Number, and Numerical patterns)
- National Curriculum mathematics programmes of study, Years 1 to 6, including number, calculation, fractions, ratio, algebra, measurement, geometry and statistics

Every statutory statement for those programmes is written under exactly one node in `maths.md`. Fluency, reasoning and problem solving are aims for every quest, not extra nodes.

A node is:

| Status | Meaning |
| --- | --- |
| `missing` | No Easy quest yet |
| `partial` | At least one quest exists, but at least one bullet under that node is still untaught |
| `done` | A quest teaches every bullet under that node, and mastery is recorded |

Node status in this file is about **curriculum coverage**, not map stars. The map marks a node `done` once Easy has at least one star. Medium and Hard still earn the rest of the stars. Nothing is gated.

Run `node curriculum/check-path.mjs` from the `primary-learn` folder. It checks that there are 124 nodes and 45 categories, that the numbers run 1 to 124, and that each node requires the one before it.

## How the map finds a quest

`buildLevels` looks up `${activity.pathNode}:${activity.difficulty}`.

- Set `pathNode` to the node id (for example `eyfs-count-5`).
- Set `difficulty` to `1`, `2`, or `3`.
- Set `curriculumRef` to the same node id (audit / coverage). The map does not read `curriculumRef`.

If those two map fields are missing, the quest will not appear even if it is registered.

Open path in the product:

- Every node and every Easy / Medium / Hard quest that exists is playable.
- You are here sits on the first stop, in path order, that has any Easy, Medium or Hard below 1 star.
- A node with no Easy quest shows as coming soon on that row. The stop is still tappable.

## Checks before creating quests

1. Prefer a missing Medium or Hard on a node that already has Easy. Shipped full Easy / Medium / Hard nodes first. Next expand with Easy for the first `missing` node (`eyfs-count-10`), or improve See numbers to 5. Do not skip ahead to a later category when the job is to improve what exists.
2. When expanding, open `maths.md` and find the first node whose status is `missing`. That is the only *new* node to build, and you should start with Easy. Do not skip to a later category.
3. Copy the node id and the child-facing title. `pathNode` and `curriculumRef` must be that id. The quest title should be that title, unless a shorter child-facing line is already written there.
4. Read the **Covers** bullets. The Easy / Medium / Hard set for that node has to teach those, not a neighbouring topic. Harder levels go deeper on the same bullets.
5. Confirm the node’s **Requires** id is the previous node in the file. If it is not, the path is broken — fix `maths.md` before writing the quest.
6. Do not add a category, rename an id, or insert a node in the middle without updating the numbers, the requires chain, and the category index.

## Checks after a quest ships

1. Set the node status to `partial` or `done` in `maths.md` when Easy exists. Note which difficulties exist on the **Quest** line.
2. Put the activity id on that node’s **Quest** line.
3. Update the scoreboard in [coverage.md](./coverage.md).
4. Confirm `pathNode` and `curriculumRef` equal the node id, and `difficulty` is `1`, `2`, or `3`.
5. Confirm the quest appears on the path map in the right Easy / Medium / Hard row, and that it is playable at once.

## Domain checklist

Use this to see which categories hold each official block. If a programme-of-study statement cannot be found under those nodes, it is a gap: add a node in `maths.md` in path order before writing a quest.

| Stage | Official block | Categories |
| --- | --- | --- |
| Reception | Number (to 10, composition, subitising, bonds to 5, some bonds to 10, doubles) | `cat-r-to-5`, `cat-r-to-10` |
| Reception | Numerical patterns (count beyond 20, compare to 10, odds/evens, doubles, equal sharing) | `cat-r-to-10`, `cat-r-count-on` |
| Year 1 | Number and place value | `cat-y1-to-20`, `cat-y1-to-100` |
| Year 1 | Addition and subtraction | `cat-y1-to-20` |
| Year 1 | Multiplication and division | `cat-y1-groups` |
| Year 1 | Fractions | `cat-y1-groups` |
| Year 1 | Measurement | `cat-y1-measures` |
| Year 1 | Geometry: properties of shapes | `cat-y1-shape` |
| Year 1 | Geometry: position and direction | `cat-y1-shape` |
| Year 2 | Number and place value | `cat-y2-place` |
| Year 2 | Addition and subtraction | `cat-y2-add` |
| Year 2 | Multiplication and division | `cat-y2-tables` |
| Year 2 | Fractions | `cat-y2-fractions` |
| Year 2 | Measurement | `cat-y2-measures` |
| Year 2 | Geometry: properties of shapes | `cat-y2-shape` |
| Year 2 | Geometry: position and direction | `cat-y2-shape` |
| Year 2 | Statistics | `cat-y2-shape` |
| Year 3 | Number and place value | `cat-y3-place` |
| Year 3 | Addition and subtraction | `cat-y3-add` |
| Year 3 | Multiplication and division | `cat-y3-tables` |
| Year 3 | Fractions | `cat-y3-fractions` |
| Year 3 | Measurement | `cat-y3-measures` |
| Year 3 | Geometry: properties of shapes | `cat-y3-shape` |
| Year 3 | Statistics | `cat-y3-shape` |
| Year 4 | Number and place value | `cat-y4-place` |
| Year 4 | Addition and subtraction | `cat-y4-add` |
| Year 4 | Multiplication and division | `cat-y4-tables`, `cat-y4-multiply` |
| Year 4 | Fractions, including decimals | `cat-y4-decimals` |
| Year 4 | Measurement | `cat-y4-measures` |
| Year 4 | Geometry: properties of shapes | `cat-y4-shape` |
| Year 4 | Geometry: position and direction | `cat-y4-shape` |
| Year 4 | Statistics | `cat-y4-graphs` |
| Year 5 | Number and place value | `cat-y5-place` |
| Year 5 | Addition and subtraction | `cat-y5-add` |
| Year 5 | Multiplication and division | `cat-y5-factors`, `cat-y5-multiply` |
| Year 5 | Fractions, including decimals and percentages | `cat-y5-fractions`, `cat-y5-decimals` |
| Year 5 | Measurement | `cat-y5-measures` |
| Year 5 | Geometry: properties of shapes | `cat-y5-shape` |
| Year 5 | Geometry: position and direction | `cat-y5-graphs` |
| Year 5 | Statistics | `cat-y5-graphs` |
| Year 6 | Number and place value | `cat-y6-place` |
| Year 6 | Addition, subtraction, multiplication and division | `cat-y6-operations` |
| Year 6 | Fractions, including decimals and percentages | `cat-y6-fractions` |
| Year 6 | Ratio and proportion | `cat-y6-ratio` |
| Year 6 | Algebra | `cat-y6-algebra` |
| Year 6 | Measurement | `cat-y6-measures` |
| Year 6 | Geometry: properties of shapes | `cat-y6-shape` |
| Year 6 | Geometry: position and direction | `cat-y6-graphs` |
| Year 6 | Statistics | `cat-y6-graphs` |

Year 1 has no statistics programme, and position and direction returns in Year 4. That matches the statutory programmes, so those are not gaps.

Shape and measures sit after the first number block of the year, not in one dump at the end. Year 1 does shape before counting to 100. Year 2 and Year 3 do money and measures after add, before tables. Year 4 does measures after four-digit add. Year 5 does measures after written multiply. Year 6 does units after the four operations.

## Path audit notes

Checked against the EYFS mathematics ELGs (Number and Numerical patterns) and the Y1–Y6 statutory programmes of study, plus a few non-statutory steps that make a quest teachable.

James agreed (not now):

- Add 2 or 3 extra Reception nodes later for shape, repeating patterns and measures (Development Matters, not ELGs).
- Split `y1-time-hour`, `y3-time`, `y5-decimals`, `y6-decimals` and `y6-algebra` when those nodes are built. Leave them whole until then.

## What the path screen already does

Home shows categories in index order, using the category id and title from `maths.md`. Inside a category, nodes appear in number order. Everything is open. You are here starts on node 1. A Year 4 child can jump to a later category at once.

`number-bonds-to-10` is node 13. It is playable even if earlier Easy quests are still unplayed.
