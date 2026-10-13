# How to audit the maths path

Use this before writing a quest, and again after it ships. The path in [maths.md](./maths.md) is the source of names. Do not invent a second list of categories or quest titles.

## What “covered” means

The England primary maths curriculum here is:

- EYFS mathematics Early Learning Goals (Number, and Numerical patterns)
- National Curriculum mathematics programmes of study, Years 1 to 6, including number, calculation, fractions, ratio, algebra, measurement, geometry and statistics

Every statutory statement for those programmes is written under exactly one node in `maths.md`. Fluency, reasoning and problem solving are aims for every quest, not extra nodes.

A node is:

| Status | Meaning |
| --- | --- |
| `missing` | No quest yet |
| `partial` | A quest exists, but at least one bullet under that node is still untaught |
| `done` | The quest teaches every bullet under that node, and mastery is recorded |

Run `node curriculum/check-path.mjs` from the `primary-learn` folder. It checks that there are 124 nodes and 45 categories, that the numbers run 1 to 124, and that each node requires the one before it.

## Checks before creating quests

1. Open `maths.md` and find the first node whose status is `missing`. That is the only quest to build next. Do not skip to a later category.
2. Copy the node id and the child-facing title. The quest `curriculumRef` must be that id. The quest title should be that title, unless a shorter child-facing line is already written there.
3. Read the **Covers** bullets. The quest has to teach those, not a neighbouring topic.
4. Confirm the node’s **Requires** id is the previous node in the file. If it is not, the path is broken — fix `maths.md` before writing the quest.
5. Do not add a category, rename an id, or insert a node in the middle without updating the numbers, the requires chain, and the category index.

## Checks after a quest ships

1. Set the node status to `partial` or `done` in `maths.md`.
2. Put the activity id on that node’s **Quest** line.
3. Update the scoreboard in [coverage.md](./coverage.md).
4. Confirm `curriculumRef` on the activity equals the node id.
5. Leave later nodes locked in the product. A learner may open a node only after the previous node is mastered. The path screen that enforces this is not built yet; do not ship quests as a free-choice catalogue that ignores the order.

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

## What the next build should do with this

When the path screen is built:

- Show the categories in the index order, using the category id and title from `maths.md`.
- Inside a category, show nodes in number order, using the node id and title.
- Only node 1 (`eyfs-count-5`) starts unlocked.
- Unlock node *n* only when node *n − 1* is mastered.
- Do not offer a way to jump to a later category.

Until that screen exists, shipped quests can still appear on the home list. `number-bonds-to-10` is node 13. It is not the start of the path.
