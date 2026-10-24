# Primary Maths path (Reception → Year 6)

This is the only map for quests. England only: the EYFS mathematics Early Learning Goals, then the National Curriculum mathematics programmes of study for Years 1 to 6.

Sources: [EYFS statutory framework](https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2) and the [mathematics programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study). These notes paraphrase those requirements for planning. They are not a reprint.

The aims that run through every quest are fluency, reasoning and problem solving. They are not separate categories.

This file is the **primary maths** path only. English or other subjects might come later as separate work. Do not add them here until asked.

## How the path works

- **Categories** are the chapters a learner will see, in the order below.
- **Nodes** are the levels inside a category, also in order. The home path map (`PathMap`) shows one stop per node.
- **Each node has three quests:** Easy (`difficulty: 1`), Medium (`2`), Hard (`3`). Each can earn up to three stars (nine in total). All nine awards a gold cup.
- Place a quest with `pathNode` = this node’s id and `difficulty` = `1` | `2` | `3`. Also set `curriculumRef` to the same id (audit only; the map does not read it).
- Everything is open. The path suggests an order but never blocks. A Year 4 child can jump straight in. You are here sits on the first stop that still has an Easy, Medium or Hard below 1 star. Stars show progress. They do not gate anything.
- Easy, Medium and Hard on a node are all playable in any order.
- **Ids are permanent.** Category ids (`cat-…`) and node ids (`eyfs-…`, `y1-…`) are the names the app and quests must use. Do not rename them. Do not reuse a retired id.
- Child-facing titles in this file are the titles to show. Do not invent a parallel set of names.
- Within each year, number work comes first, then a practical topic (shape or measures), then the next number strand. That mixes the year rather than saving all shape and measures for the end.
- **Later, not now:** add 2 or 3 extra Reception nodes for shape, repeating patterns and measures (Development Matters, not ELGs). Do not add them until asked.
- **When those nodes are built:** split `y1-time-hour`, `y3-time`, `y5-decimals`, `y6-decimals` and `y6-algebra` into smaller stops. Leave them whole until then.
- **Status:** `missing` (no Easy quest yet) · `partial` (a quest exists but does not yet cover every bullet) · `done` (the quests cover the bullets).

**Priority:** improve existing activities (write Medium / Hard for shipped nodes) before expanding. Nodes 1 to 16 (`eyfs-count-5` to `y1-shapes`) have Easy, Medium and Hard. The first `missing` node is `y1-turns`.

## Category index

| # | Category id | Title | Year | Nodes |
| --- | --- | --- | --- | --- |
| 1 | `cat-r-to-5` | Numbers to 5 | Reception | 1–4 |
| 2 | `cat-r-to-10` | Numbers to 10 | Reception | 5–9 |
| 3 | `cat-r-count-on` | Counting on | Reception | 10 |
| 4 | `cat-y1-to-20` | Numbers to 20 | Year 1 | 11–15 |
| 5 | `cat-y1-shape` | Shape and turns | Year 1 | 16–17 |
| 6 | `cat-y1-to-100` | Counting to 100 | Year 1 | 18–20 |
| 7 | `cat-y1-groups` | Groups and fractions | Year 1 | 21–22 |
| 8 | `cat-y1-measures` | Measures, money and time | Year 1 | 23–25 |
| 9 | `cat-y2-place` | Place value to 100 | Year 2 | 26–28 |
| 10 | `cat-y2-add` | Adding two-digit numbers | Year 2 | 29–30 |
| 11 | `cat-y2-measures` | Measures, money and time | Year 2 | 31–33 |
| 12 | `cat-y2-tables` | The 2, 5 and 10 times tables | Year 2 | 34–35 |
| 13 | `cat-y2-fractions` | Fractions | Year 2 | 36 |
| 14 | `cat-y2-shape` | Shape, position and charts | Year 2 | 37–39 |
| 15 | `cat-y3-place` | Numbers to 1,000 | Year 3 | 40–41 |
| 16 | `cat-y3-add` | Column addition and subtraction | Year 3 | 42–43 |
| 17 | `cat-y3-measures` | Measures, perimeter and time | Year 3 | 44–47 |
| 18 | `cat-y3-tables` | The 3, 4 and 8 times tables | Year 3 | 48–49 |
| 19 | `cat-y3-fractions` | Fractions and tenths | Year 3 | 50–53 |
| 20 | `cat-y3-shape` | Angles, lines and charts | Year 3 | 54–56 |
| 21 | `cat-y4-place` | Numbers beyond 1,000 | Year 4 | 57–60 |
| 22 | `cat-y4-add` | Adding four-digit numbers | Year 4 | 61 |
| 23 | `cat-y4-measures` | Measures, area and time | Year 4 | 62–65 |
| 24 | `cat-y4-tables` | All times tables | Year 4 | 66–67 |
| 25 | `cat-y4-multiply` | Written multiplication | Year 4 | 68 |
| 26 | `cat-y4-decimals` | Fractions and decimals | Year 4 | 69–72 |
| 27 | `cat-y4-shape` | Shape, symmetry and coordinates | Year 4 | 73–75 |
| 28 | `cat-y4-graphs` | Graphs | Year 4 | 76 |
| 29 | `cat-y5-place` | Numbers to one million | Year 5 | 77–79 |
| 30 | `cat-y5-add` | Adding large numbers | Year 5 | 80 |
| 31 | `cat-y5-factors` | Factors, primes and powers | Year 5 | 81–83 |
| 32 | `cat-y5-multiply` | Multiplying and dividing | Year 5 | 84–87 |
| 33 | `cat-y5-measures` | Measures, area and volume | Year 5 | 88–91 |
| 34 | `cat-y5-fractions` | Fractions | Year 5 | 92–95 |
| 35 | `cat-y5-decimals` | Decimals and percentages | Year 5 | 96–97 |
| 36 | `cat-y5-shape` | Angles and shape | Year 5 | 98–100 |
| 37 | `cat-y5-graphs` | Position and graphs | Year 5 | 101–102 |
| 38 | `cat-y6-place` | Numbers to ten million | Year 6 | 103–104 |
| 39 | `cat-y6-operations` | The four operations | Year 6 | 105–108 |
| 40 | `cat-y6-measures` | Measures, area and volume | Year 6 | 109–111 |
| 41 | `cat-y6-fractions` | Fractions, decimals and percentages | Year 6 | 112–116 |
| 42 | `cat-y6-ratio` | Ratio and proportion | Year 6 | 117–118 |
| 43 | `cat-y6-algebra` | Algebra | Year 6 | 119 |
| 44 | `cat-y6-shape` | Shape and circles | Year 6 | 120–122 |
| 45 | `cat-y6-graphs` | Position and statistics | Year 6 | 123–124 |

124 nodes. Each node requires the node with the previous number. Node 1 requires nothing.

---

## 1. `cat-r-to-5` — Numbers to 5

Reception. This category is open at the start.

### 1. `eyfs-count-5` — Count to 5

Requires: none. Quests: `count-to-5` (Easy), `count-to-5-medium`, `count-to-5-hard`. Status: done.

- Say the count sequence to 5
- Recognise numerals 1 to 5
- Count up to 5 objects, one number name for each object

### 2. `eyfs-subitise-5` — See numbers to 5

Requires: `eyfs-count-5`. Quests: `see-numbers-to-5` (Easy), `see-numbers-to-5-medium`, `see-numbers-to-5-hard`. Status: done.

- Subitise (recognise a quantity without counting) up to 5
- See small numbers inside larger ones (for example 2 and 3 inside 5)
- Use dice, five-frame, fingers and brief flash so counting one by one is not needed

### 3. `eyfs-compose-5` — Make numbers to 5

Requires: `eyfs-subitise-5`. Quests: `make-numbers-to-5` (Easy), `make-numbers-to-5-medium`, `make-numbers-to-5-hard`. Status: done.

- Know the composition of each number to 5 (for example, 5 is 2 and 3, 4 and 1, 5 and 0)

### 4. `eyfs-bonds-5` — Bonds to 5

Requires: `eyfs-compose-5`. Quests: `bonds-to-5` (Easy), `bonds-to-5-medium`, `bonds-to-5-hard`. Status: done.

- Automatically recall number bonds to 5
- Recall the related subtraction facts within 5

## 2. `cat-r-to-10` — Numbers to 10

Reception.

### 5. `eyfs-count-10` — Count to 10

Requires: `eyfs-bonds-5`. Quests: `count-to-10` (Easy), `count-to-10-medium`, `count-to-10-hard`. Status: done.

- Count reliably within 10
- Recognise numerals to 10

### 6. `eyfs-compare-10` — More, less or the same

Requires: `eyfs-count-10`. Quests: `more-less-same` (Easy), `more-less-same-medium`, `more-less-same-hard`. Status: done.

- Compare quantities up to 10 using more than, less than and the same, in different contexts

### 7. `eyfs-compose-10` — Make numbers to 10

Requires: `eyfs-compare-10`. Quests: `make-numbers-to-10` (Easy), `make-numbers-to-10-medium`, `make-numbers-to-10-hard`. Status: done.

- Know the composition of each number to 10

### 8. `eyfs-bonds-10-some` — Doubles and bonds

Requires: `eyfs-compose-10`. Quests: `doubles-and-bonds` (Easy), `doubles-and-bonds-medium`, `doubles-and-bonds-hard`. Status: done.

- Automatically recall some number bonds to 10
- Automatically recall double facts within 10

### 9. `eyfs-patterns-10` — Odd, even and sharing

Requires: `eyfs-bonds-10-some`. Quests: `patterns-to-10` (Easy), `patterns-to-10-medium`, `patterns-to-10-hard`. Status: done.

- Explore and represent odds and evens within 10
- Explore how quantities to 10 can be shared equally

## 3. `cat-r-count-on` — Counting on

Reception.

### 10. `eyfs-count-20plus` — Count beyond 20

Requires: `eyfs-patterns-10`. Quests: `count-beyond-20` (Easy), `count-beyond-20-medium`, `count-beyond-20-hard`. Status: done.

- Verbally count beyond 20
- Notice the pattern of the counting system, including teen numbers

## 4. `cat-y1-to-20` — Numbers to 20

Year 1.

### 11. `y1-read-write-20` — Numbers to 20

Requires: `eyfs-count-20plus`. Quests: `numbers-to-20` (Easy), `numbers-to-20-medium`, `numbers-to-20-hard`. Status: done.

- Read and write numbers from 1 to 20 in numerals and in words
- Notice ten and a bit in the teen numbers (for example 14 is 10 and 4)

### 12. `y1-1-more-less` — One more, one less

Requires: `y1-read-write-20`. Quests: `one-more-one-less` (Easy), `one-more-one-less-medium`, `one-more-one-less-hard`. Status: done.

- Given a number, identify one more and one less

### 13. `y1-bonds-10` — Number bonds to 10

Requires: `y1-1-more-less`. Quests: `number-bonds-to-10` (Easy), `number-bonds-to-10-medium`, `number-bonds-to-10-hard`. Status: done.

- Recall number bonds to 10 in several forms (9 + 7 is not this node; pairs that make 10 are)
- Recall the related subtraction facts within 10

### 14. `y1-bonds-20` — Bonds within 20

Requires: `y1-bonds-10`. Quests: `bonds-within-20` (Easy), `bonds-within-20-medium`, `bonds-within-20-hard`. Status: done.

- Represent and use number bonds within 20
- Represent and use the related subtraction facts within 20

### 15. `y1-add-sub-20` — Add and subtract to 20

Requires: `y1-bonds-20`. Quests: `add-and-subtract-to-20` (Easy), `add-and-subtract-to-20-medium`, `add-and-subtract-to-20-hard`. Status: done.

- Read, write and interpret statements with addition (+), subtraction (−) and equals (=)
- Add and subtract one-digit and two-digit numbers to 20, including zero
- Solve one-step addition and subtraction problems
- Solve missing-number problems such as 7 = ? − 9

## 5. `cat-y1-shape` — Shape and turns

Year 1. A practical break after numbers to 20, before counting on to 100.

### 16. `y1-shapes` — Everyday shapes

Requires: `y1-add-sub-20`. Quests: `everyday-shapes` (Easy), `everyday-shapes-medium`, `everyday-shapes-hard`. Status: done.

- Recognise and name common 2-D shapes, including rectangles (including squares), circles and triangles
- Recognise and name common 3-D shapes, including cuboids (including cubes), pyramids and spheres

### 17. `y1-turns` — Whole, half and quarter turns

Requires: `y1-shapes`. Quest: `whole-half-quarter-turns` / `whole-half-quarter-turns-medium` / `whole-half-quarter-turns-hard`. Status: done.

- Describe position, direction and movement, including whole, half, quarter and three-quarter turns
- Use position words such as left, right, in front, behind, above and below

## 6. `cat-y1-to-100` — Counting to 100

Year 1.

### 18. `y1-count-100` — Count to 100

Requires: `y1-turns`. Quest: `count-to-100`, `count-to-100-medium`, `count-to-100-hard`. Status: done.

- Count to and across 100, forwards and backwards, beginning with 0 or 1, or from any given number
- Count, read and write numbers to 100 in numerals

### 19. `y1-represent-100` — Show and compare numbers

Requires: `y1-count-100`. Quest: `show-and-compare-numbers`, `show-and-compare-numbers-medium`, `show-and-compare-numbers-hard`. Status: done.

- Identify and represent numbers using objects and pictorial representations, including the number line
- Use the language equal to, more than, less than (fewer), most and least

### 20. `y1-count-2-5-10` — Count in 2s, 5s and 10s

Requires: `y1-represent-100`. Quest: none. Status: missing.

- Count in multiples of twos, fives and tens

## 7. `cat-y1-groups` — Groups and fractions

Year 1.

### 21. `y1-groups-arrays` — Groups and arrays

Requires: `y1-count-2-5-10`. Quest: none. Status: missing.

- Solve one-step multiplication and division problems using concrete objects, pictorial representations and arrays, with the support of the teacher

### 22. `y1-halves-quarters` — Halves and quarters

Requires: `y1-groups-arrays`. Quest: none. Status: missing.

- Recognise, find and name a half as one of two equal parts of an object, shape or quantity
- Recognise, find and name a quarter as one of four equal parts of an object, shape or quantity

## 8. `cat-y1-measures` — Measures, money and time

Year 1.

### 23. `y1-compare-measures` — Longer, heavier, fuller

Requires: `y1-halves-quarters`. Quest: none. Status: missing.

- Compare, describe and solve practical problems for lengths and heights, mass/weight, capacity/volume, and time (quicker, slower, earlier, later)
- Measure and begin to record lengths and heights, mass/weight, and capacity/volume

### 24. `y1-coins` — Coins and notes

Requires: `y1-compare-measures`. Quest: none. Status: missing.

- Recognise and know the value of different denominations of coins and notes

### 25. `y1-time-hour` — O’clock and half past

Requires: `y1-coins`. Quest: none. Status: missing.

Split calendar language from telling the time when this node is built.

- Sequence events in chronological order using language such as before, after, next, first, today, yesterday, tomorrow, morning, afternoon and evening
- Recognise and use language relating to dates, including days of the week, weeks, months and years
- Measure and begin to record time (hours, minutes, seconds)
- Tell the time to the hour and half past the hour and draw the hands on a clock face to show these times

## 9. `cat-y2-place` — Place value to 100

Year 2.

### 26. `y2-count-steps` — Count in steps

Requires: `y1-time-hour`. Quest: none. Status: missing.

- Count in steps of 2, 3 and 5 from 0, and in tens from any number, forward and backward

### 27. `y2-place-value-100` — Tens and ones

Requires: `y2-count-steps`. Quest: none. Status: missing.

- Recognise the place value of each digit in a two-digit number (tens, ones)
- Identify, represent and estimate numbers using different representations, including the number line

### 28. `y2-order-100` — Order numbers to 100

Requires: `y2-place-value-100`. Quest: none. Status: missing.

- Compare and order numbers from 0 up to 100
- Use <, > and =
- Read and write numbers to at least 100 in numerals and in words
- Use place value and number facts to solve problems

## 10. `cat-y2-add` — Adding two-digit numbers

Year 2.

### 29. `y2-bonds-20-fluent` — Bonds to 20

Requires: `y2-order-100`. Quest: none. Status: missing.

- Recall and use addition and subtraction facts to 20 fluently
- Derive and use related facts up to 100

### 30. `y2-add-sub-mental` — Add and subtract two-digit numbers

Requires: `y2-bonds-20-fluent`. Quest: none. Status: missing.

- Solve problems with addition and subtraction, using objects and pictures, including numbers, quantities and measures, and using mental and written methods
- Add and subtract a two-digit number and ones, a two-digit number and tens, two two-digit numbers, and three one-digit numbers
- Show that addition of two numbers can be done in any order, and subtraction of one number from another cannot
- Recognise and use the inverse relationship between addition and subtraction to check calculations and solve missing-number problems

## 11. `cat-y2-measures` — Measures, money and time

Year 2. Money sits here so two-digit add and subtract is already in place.

### 31. `y2-money` — Pounds and pence

Requires: `y2-add-sub-mental`. Quest: none. Status: missing.

- Recognise and use symbols for pounds (£) and pence (p); combine amounts to make a particular value
- Find different combinations of coins that equal the same amounts of money
- Solve simple problems in a practical context involving addition and subtraction of money of the same unit, including giving change

### 32. `y2-standard-units` — Metres, grams and litres

Requires: `y2-money`. Quest: none. Status: missing.

- Choose and use appropriate standard units to estimate and measure length/height in any direction (m/cm), mass (kg/g), temperature (°C) and capacity (litres/ml) to the nearest appropriate unit, using rulers, scales, thermometers and measuring vessels
- Compare and order lengths, mass, volume/capacity and record the results using >, < and =

### 33. `y2-time-5-min` — Time to five minutes

Requires: `y2-standard-units`. Quest: none. Status: missing.

- Compare and sequence intervals of time
- Tell and write the time to five minutes, including quarter past/to the hour, and draw the hands on a clock face to show these times
- Know the number of minutes in an hour and the number of hours in a day

## 12. `cat-y2-tables` — The 2, 5 and 10 times tables

Year 2.

### 34. `y2-odd-even` — Odd and even

Requires: `y2-time-5-min`. Quest: none. Status: missing.

- Recognise odd and even numbers, including from the 2 times table

### 35. `y2-tables-2-5-10` — 2, 5 and 10 times tables

Requires: `y2-odd-even`. Quest: none. Status: missing.

- Recall and use multiplication and division facts for the 2, 5 and 10 multiplication tables, including recognising odd and even numbers from those facts
- Calculate mathematical statements for multiplication and division within the multiplication tables and write them using the multiplication (×), division (÷) and equals (=) signs
- Show that multiplication of two numbers can be done in any order, and division of one number by another cannot
- Solve problems involving multiplication and division, using materials, arrays, repeated addition, mental methods, and multiplication and division facts, including problems in contexts

## 13. `cat-y2-fractions` — Fractions

Year 2.

### 36. `y2-fractions-unit` — Fractions of amounts

Requires: `y2-tables-2-5-10`. Quest: none. Status: missing.

- Recognise, find, name and write fractions ⅓, ¼, ²⁄₄ and ¾ of a length, shape, set of objects or quantity
- Write simple fractions, for example ½ of 6 = 3, and recognise the equivalence of ²⁄₄ and ½
- Count in halves and quarters up to 10, using the number line

## 14. `cat-y2-shape` — Shape, position and charts

Year 2.

### 37. `y2-shape-properties` — Sides, faces and symmetry

Requires: `y2-fractions-unit`. Quest: none. Status: missing.

- Identify and describe the properties of 2-D shapes, including the number of sides and line symmetry in a vertical line
- Identify and describe the properties of 3-D shapes, including the number of edges, vertices and faces
- Identify 2-D shapes on the surface of 3-D shapes, for example a circle on a cylinder and a triangle on a pyramid
- Compare and sort common 2-D and 3-D shapes and everyday objects

### 38. `y2-position` — Position and turns

Requires: `y2-shape-properties`. Quest: none. Status: missing.

- Order and arrange combinations of mathematical objects in patterns and sequences
- Use mathematical vocabulary to describe position, direction and movement, including movement in a straight line and distinguishing between rotation as a turn and in terms of right angles for quarter, half and three-quarter turns (clockwise and anti-clockwise)

### 39. `y2-statistics` — Charts and tables

Requires: `y2-position`. Quest: none. Status: missing.

- Interpret and construct simple pictograms, tally charts, block diagrams and simple tables
- Ask and answer simple questions by counting the number of objects in each category and sorting the categories by quantity
- Ask and answer questions about totalling and comparing categorical data

## 15. `cat-y3-place` — Numbers to 1,000

Year 3.

### 40. `y3-count-4-8-50-100` — Count in 4s, 8s, 50s and 100s

Requires: `y2-statistics`. Quest: none. Status: missing.

- Count from 0 in multiples of 4, 8, 50 and 100
- Find 10 or 100 more or less than a given number

### 41. `y3-place-value-1000` — Hundreds, tens and ones

Requires: `y3-count-4-8-50-100`. Quest: none. Status: missing.

- Recognise the place value of each digit in a three-digit number (hundreds, tens, ones)
- Compare and order numbers up to 1,000
- Identify, represent and estimate numbers using different representations
- Read and write numbers up to 1,000 in numerals and in words
- Solve number problems and practical problems involving these ideas

## 16. `cat-y3-add` — Column addition and subtraction

Year 3.

### 42. `y3-add-sub-mental` — Add hundreds, tens and ones

Requires: `y3-place-value-1000`. Quest: none. Status: missing.

- Add and subtract numbers mentally, including a three-digit number and ones, a three-digit number and tens, and a three-digit number and hundreds

### 43. `y3-column-add-sub` — Column addition and subtraction

Requires: `y3-add-sub-mental`. Quest: none. Status: missing.

- Add and subtract numbers with up to three digits, using formal written methods of columnar addition and subtraction
- Estimate the answer to a calculation and use inverse operations to check answers
- Solve problems, including missing number problems, using number facts, place value, and more complex addition and subtraction

## 17. `cat-y3-measures` — Measures, perimeter and time

Year 3. Length and money sit here so column add is already in place.

### 44. `y3-measures` — Length, mass and capacity

Requires: `y3-column-add-sub`. Quest: none. Status: missing.

- Measure, compare, add and subtract lengths (m/cm/mm), mass (kg/g) and volume/capacity (l/ml)

### 45. `y3-perimeter` — Perimeter

Requires: `y3-measures`. Quest: none. Status: missing.

- Measure the perimeter of simple 2-D shapes

### 46. `y3-money` — Giving change

Requires: `y3-perimeter`. Quest: none. Status: missing.

- Add and subtract amounts of money to give change, using both £ and p in practical contexts

### 47. `y3-time` — Time to the minute

Requires: `y3-money`. Quest: none. Status: missing.

Split clock reading from duration and calendar facts when this node is built.

- Tell and write the time from an analogue clock, including using Roman numerals from I to XII, and 12-hour and 24-hour clocks
- Estimate and read time with increasing accuracy to the nearest minute
- Record and compare time in seconds, minutes and hours
- Use vocabulary such as o’clock, a.m./p.m., morning, afternoon, noon and midnight
- Know the number of seconds in a minute and the number of days in each month, year and leap year
- Compare durations of events, for example to calculate the time taken by particular events or tasks

## 18. `cat-y3-tables` — The 3, 4 and 8 times tables

Year 3.

### 48. `y3-tables-3-4-8` — 3, 4 and 8 times tables

Requires: `y3-time`. Quest: none. Status: missing.

- Recall and use multiplication and division facts for the 3, 4 and 8 multiplication tables

### 49. `y3-multiply-2-digit` — Multiply a two-digit number

Requires: `y3-tables-3-4-8`. Quest: none. Status: missing.

- Write and calculate mathematical statements for multiplication and division using the multiplication tables that they know, including for two-digit numbers times one-digit numbers, using mental and progressing to formal written methods
- Solve problems, including missing number problems, involving multiplication and division, including positive integer scaling problems and correspondence problems in which n objects are connected to m objects

## 19. `cat-y3-fractions` — Fractions and tenths

Year 3.

### 50. `y3-tenths` — Tenths

Requires: `y3-multiply-2-digit`. Quest: none. Status: missing.

- Count up and down in tenths
- Recognise that tenths arise from dividing an object into 10 equal parts and in dividing one-digit numbers or quantities by 10

### 51. `y3-fractions-of-sets` — Fractions of a set

Requires: `y3-tenths`. Quest: none. Status: missing.

- Recognise, find and write fractions of a discrete set of objects: unit fractions and non-unit fractions with small denominators
- Recognise and use fractions as numbers: unit fractions and non-unit fractions with small denominators

### 52. `y3-equivalent-fractions` — Equivalent fractions

Requires: `y3-fractions-of-sets`. Quest: none. Status: missing.

- Recognise and show, using diagrams, equivalent fractions with small denominators
- Compare and order unit fractions, and fractions with the same denominators

### 53. `y3-add-fractions` — Add and subtract fractions

Requires: `y3-equivalent-fractions`. Quest: none. Status: missing.

- Add and subtract fractions with the same denominator within one whole, for example ⁵⁄₇ + ¹⁄₇ = ⁶⁄₇
- Solve problems that involve the Year 3 fraction statements above

## 20. `cat-y3-shape` — Angles, lines and charts

Year 3.

### 54. `y3-draw-shapes` — Draw and make shapes

Requires: `y3-add-fractions`. Quest: none. Status: missing.

- Draw 2-D shapes and make 3-D shapes using modelling materials
- Recognise 3-D shapes in different orientations and describe them
- Identify horizontal and vertical lines and pairs of perpendicular and parallel lines

### 55. `y3-angles` — Right angles

Requires: `y3-draw-shapes`. Quest: none. Status: missing.

- Recognise angles as a property of shape or a description of a turn
- Identify right angles, and recognise that two right angles make a half-turn, three make three quarters of a turn and four a complete turn
- Identify whether angles are greater than or less than a right angle

### 56. `y3-statistics` — Bar charts and pictograms

Requires: `y3-angles`. Quest: none. Status: missing.

- Interpret and present data using bar charts, pictograms and tables
- Solve one-step and two-step questions using information presented in scaled bar charts and pictograms and tables

## 21. `cat-y4-place` — Numbers beyond 1,000

Year 4.

### 57. `y4-count-6-7-9-25-1000` — Count in 6s, 7s, 9s, 25s and 1,000s

Requires: `y3-statistics`. Quest: none. Status: missing.

- Count in multiples of 6, 7, 9, 25 and 1,000
- Find 1,000 more or less than a given number

### 58. `y4-place-value-10000` — Thousands

Requires: `y4-count-6-7-9-25-1000`. Quest: none. Status: missing.

- Recognise the place value of each digit in a four-digit number (thousands, hundreds, tens and ones)
- Order and compare numbers beyond 1,000
- Identify, represent and estimate numbers using different representations
- Round any number to the nearest 10, 100 or 1,000
- Solve number and practical problems that involve all of the above and with increasingly large positive numbers

### 59. `y4-negative-numbers` — Below zero

Requires: `y4-place-value-10000`. Quest: none. Status: missing.

- Count backwards through zero to include negative numbers

### 60. `y4-roman-100` — Roman numerals to 100

Requires: `y4-negative-numbers`. Quest: none. Status: missing.

- Read Roman numerals to 100 (I to C) and know that over time, the numeral system changed to include the concept of zero and place value

## 22. `cat-y4-add` — Adding four-digit numbers

Year 4.

### 61. `y4-column-add-sub` — Four-digit addition and subtraction

Requires: `y4-roman-100`. Quest: none. Status: missing.

- Add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate
- Estimate and use inverse operations to check answers to a calculation
- Solve addition and subtraction two-step problems in contexts, deciding which operations and methods to use and why

## 23. `cat-y4-measures` — Measures, area and time

Year 4. Area and money sit after four-digit add.

### 62. `y4-convert-units` — Convert units

Requires: `y4-column-add-sub`. Quest: none. Status: missing.

- Convert between different units of measure, for example kilometre to metre, and hour to minute

### 63. `y4-perimeter-area` — Perimeter and area

Requires: `y4-convert-units`. Quest: none. Status: missing.

- Measure and calculate the perimeter of a rectilinear figure, including squares, in centimetres and metres
- Find the area of rectilinear shapes by counting squares

### 64. `y4-money-measures` — Money and other measures

Requires: `y4-perimeter-area`. Quest: none. Status: missing.

- Estimate, compare and calculate different measures, including money in pounds and pence
- Solve simple measure and money problems involving fractions and decimals to two decimal places

### 65. `y4-time-convert` — Analogue and digital time

Requires: `y4-money-measures`. Quest: none. Status: missing.

- Read, write and convert time between analogue and digital 12- and 24-hour clocks
- Solve problems involving converting from hours to minutes, minutes to seconds, years to months, and weeks to days

## 24. `cat-y4-tables` — All times tables

Year 4. By the end of this category, multiplication tables up to 12 × 12 should be memorised.

### 66. `y4-tables-to-12` — Times tables to 12 × 12

Requires: `y4-time-convert`. Quest: none. Status: missing.

- Recall multiplication and division facts for multiplication tables up to 12 × 12

### 67. `y4-mental-multiply` — Multiply in your head

Requires: `y4-tables-to-12`. Quest: none. Status: missing.

- Use place value, known and derived facts to multiply and divide mentally, including multiplying by 0 and 1, dividing by 1, and multiplying together three numbers
- Recognise and use factor pairs and commutativity in mental calculations

## 25. `cat-y4-multiply` — Written multiplication

Year 4.

### 68. `y4-written-multiply` — Short multiplication

Requires: `y4-mental-multiply`. Quest: none. Status: missing.

- Multiply two-digit and three-digit numbers by a one-digit number using formal written layout
- Solve problems involving multiplying and adding, including using the distributive law to multiply two-digit numbers by one digit, integer scaling problems and harder correspondence problems such as n objects are connected to m objects

## 26. `cat-y4-decimals` — Fractions and decimals

Year 4.

### 69. `y4-equivalent-fractions` — Families of equivalent fractions

Requires: `y4-written-multiply`. Quest: none. Status: missing.

- Recognise and show, using diagrams, families of common equivalent fractions

### 70. `y4-hundredths` — Hundredths

Requires: `y4-equivalent-fractions`. Quest: none. Status: missing.

- Count up and down in hundredths
- Recognise that hundredths arise when dividing an object by one hundred and dividing tenths by ten

### 71. `y4-fraction-quantities` — Fractions of quantities

Requires: `y4-hundredths`. Quest: none. Status: missing.

- Solve problems involving increasingly harder fractions to calculate quantities, and fractions to divide quantities, including non-unit fractions where the answer is a whole number
- Add and subtract fractions with the same denominator

### 72. `y4-decimals` — Tenths and hundredths as decimals

Requires: `y4-fraction-quantities`. Quest: none. Status: missing.

- Recognise and write decimal equivalents of any number of tenths or hundredths
- Recognise and write decimal equivalents to ¼, ½ and ¾
- Find the effect of dividing a one- or two-digit number by 10 and 100, identifying the value of the digits in the answer as ones, tenths and hundredths
- Round decimals with one decimal place to the nearest whole number
- Compare numbers with the same number of decimal places up to two decimal places

## 27. `cat-y4-shape` — Shape, symmetry and coordinates

Year 4.

### 73. `y4-classify-shapes` — Triangles, quadrilaterals and angles

Requires: `y4-decimals`. Quest: none. Status: missing.

- Compare and classify geometric shapes, including quadrilaterals and triangles, based on their properties and sizes
- Identify acute and obtuse angles and compare and order angles up to two right angles by size

### 74. `y4-symmetry` — Lines of symmetry

Requires: `y4-classify-shapes`. Quest: none. Status: missing.

- Identify lines of symmetry in 2-D shapes presented in different orientations
- Complete a simple symmetric figure with respect to a specific line of symmetry

### 75. `y4-coordinates` — First-quadrant coordinates

Requires: `y4-symmetry`. Quest: none. Status: missing.

- Describe positions on a 2-D grid as coordinates in the first quadrant
- Describe movements between positions as translations of a given unit to the left/right and up/down
- Plot specified points and draw sides to complete a given polygon

## 28. `cat-y4-graphs` — Graphs

Year 4.

### 76. `y4-statistics` — Bar charts and time graphs

Requires: `y4-coordinates`. Quest: none. Status: missing.

- Interpret and present discrete and continuous data using appropriate graphical methods, including bar charts and time graphs
- Solve comparison, sum and difference problems using information presented in bar charts, pictograms, tables and other graphs

## 29. `cat-y5-place` — Numbers to one million

Year 5.

### 77. `y5-place-value-1000000` — Place value to 1,000,000

Requires: `y4-statistics`. Quest: none. Status: missing.

- Read, write, order and compare numbers to at least 1,000,000 and determine the value of each digit
- Count forwards or backwards in steps of powers of 10 for any given number up to 1,000,000
- Round any number up to 1,000,000 to the nearest 10, 100, 1,000, 10,000 and 100,000
- Solve number problems and practical problems that involve all of the above

### 78. `y5-negative-numbers` — Negative numbers in context

Requires: `y5-place-value-1000000`. Quest: none. Status: missing.

- Interpret negative numbers in context
- Count forwards and backwards with positive and negative whole numbers, including through zero

### 79. `y5-roman-1000` — Roman numerals to 1,000

Requires: `y5-negative-numbers`. Quest: none. Status: missing.

- Read Roman numerals to 1,000 (M) and recognise years written in Roman numerals

## 30. `cat-y5-add` — Adding large numbers

Year 5.

### 80. `y5-add-sub` — Add and subtract large numbers

Requires: `y5-roman-1000`. Quest: none. Status: missing.

- Add and subtract whole numbers with more than 4 digits, including using formal written methods (columnar addition and subtraction)
- Add and subtract numbers mentally with increasingly large numbers
- Use rounding to check answers to calculations and determine, in the context of a problem, levels of accuracy
- Solve addition and subtraction multi-step problems in contexts, deciding which operations and methods to use and why

## 31. `cat-y5-factors` — Factors, primes and powers

Year 5.

### 81. `y5-factors-multiples` — Factors and multiples

Requires: `y5-add-sub`. Quest: none. Status: missing.

- Identify multiples and factors, including finding all factor pairs of a number, and common factors of two numbers

### 82. `y5-primes` — Prime numbers

Requires: `y5-factors-multiples`. Quest: none. Status: missing.

- Know and use the vocabulary of prime numbers, prime factors and composite (non-prime) numbers
- Establish whether a number up to 100 is prime and recall prime numbers up to 19

### 83. `y5-squares-cubes` — Square and cube numbers

Requires: `y5-primes`. Quest: none. Status: missing.

- Recognise and use square numbers and cube numbers, and the notation for squared (²) and cubed (³)

## 32. `cat-y5-multiply` — Multiplying and dividing

Year 5.

### 84. `y5-multiply` — Long multiplication

Requires: `y5-squares-cubes`. Quest: none. Status: missing.

- Multiply numbers up to 4 digits by a one- or two-digit number using a formal written method, including long multiplication for two-digit numbers

### 85. `y5-divide` — Short division

Requires: `y5-multiply`. Quest: none. Status: missing.

- Divide numbers up to 4 digits by a one-digit number using the formal written method of short division and interpret remainders appropriately for the context

### 86. `y5-multiply-powers-10` — Multiply and divide by 10, 100 and 1,000

Requires: `y5-divide`. Quest: none. Status: missing.

- Multiply and divide numbers mentally, drawing upon known facts
- Multiply and divide whole numbers and those involving decimals by 10, 100 and 1,000

### 87. `y5-mixed-problems` — Mixed problems

Requires: `y5-multiply-powers-10`. Quest: none. Status: missing.

- Solve problems involving multiplication and division, including using knowledge of factors and multiples, squares and cubes
- Solve problems involving addition, subtraction, multiplication and division and a combination of these, including understanding the meaning of the equals sign
- Solve problems involving multiplication and division, including scaling by simple fractions and problems involving simple rates

## 33. `cat-y5-measures` — Measures, area and volume

Year 5. Area and volume sit after written multiply and divide.

### 88. `y5-convert-units` — Metric and imperial units

Requires: `y5-mixed-problems`. Quest: none. Status: missing.

- Convert between different units of metric measure, for example kilometre and metre; centimetre and metre; centimetre and millimetre; gram and kilogram; litre and millilitre
- Understand and use approximate equivalences between metric units and common imperial units such as inches, pounds and pints

### 89. `y5-perimeter-area` — Perimeter and area of rectangles

Requires: `y5-convert-units`. Quest: none. Status: missing.

- Measure and calculate the perimeter of composite rectilinear shapes in centimetres and metres
- Calculate and compare the area of rectangles (including squares), including using standard units, square centimetres (cm²) and square metres (m²), and estimate the area of irregular shapes

### 90. `y5-volume` — Volume and capacity

Requires: `y5-perimeter-area`. Quest: none. Status: missing.

- Estimate volume, for example using 1 cm³ blocks to build cuboids, and capacity, for example using water

### 91. `y5-time-measure-problems` — Time and measure problems

Requires: `y5-volume`. Quest: none. Status: missing.

- Solve problems involving converting between units of time
- Use all four operations to solve problems involving measure using decimal notation, including scaling

## 34. `cat-y5-fractions` — Fractions

Year 5.

### 92. `y5-compare-fractions` — Compare and match fractions

Requires: `y5-time-measure-problems`. Quest: none. Status: missing.

- Compare and order fractions whose denominators are all multiples of the same number
- Identify, name and write equivalent fractions of a given fraction, represented visually, including tenths and hundredths

### 93. `y5-mixed-numbers` — Mixed numbers

Requires: `y5-compare-fractions`. Quest: none. Status: missing.

- Recognise mixed numbers and improper fractions and convert from one form to the other
- Write mathematical statements greater than 1 as a mixed number, for example ²⁄₅ + ⁴⁄₅ = ⁶⁄₅ = 1 ¹⁄₅

### 94. `y5-add-fractions` — Add and subtract fractions

Requires: `y5-mixed-numbers`. Quest: none. Status: missing.

- Add and subtract fractions with the same denominator and denominators that are multiples of the same number

### 95. `y5-multiply-fractions` — Multiply fractions by whole numbers

Requires: `y5-add-fractions`. Quest: none. Status: missing.

- Multiply proper fractions and mixed numbers by whole numbers, supported by materials and diagrams

## 35. `cat-y5-decimals` — Decimals and percentages

Year 5.

### 96. `y5-decimals` — Decimals to three places

Requires: `y5-multiply-fractions`. Quest: none. Status: missing.

Split place value of decimals from rounding and comparing when this node is built.

- Read and write decimal numbers as fractions, for example 0.71 = ⁷¹⁄₁₀₀
- Recognise and use thousandths and relate them to tenths, hundredths and decimal equivalents
- Round decimals with two decimal places to the nearest whole number and to one decimal place
- Read, write, order and compare numbers with up to three decimal places
- Solve problems involving number up to three decimal places

### 97. `y5-percentages` — Percentages

Requires: `y5-decimals`. Quest: none. Status: missing.

- Recognise the per cent symbol (%) and understand that per cent relates to “number of parts per hundred”
- Write percentages as a fraction with denominator 100, and as a decimal
- Solve problems which require knowing percentage and decimal equivalents of ½, ¼, ⅕, ⅖, ⅘ and those fractions with a denominator of a multiple of 10 or 25

## 36. `cat-y5-shape` — Angles and shape

Year 5.

### 98. `y5-3d-from-2d` — 3-D shapes from drawings

Requires: `y5-percentages`. Quest: none. Status: missing.

- Identify 3-D shapes, including cubes and other cuboids, from 2-D representations

### 99. `y5-angles` — Degrees

Requires: `y5-3d-from-2d`. Quest: none. Status: missing.

- Know angles are measured in degrees: estimate and compare acute, obtuse and reflex angles
- Draw given angles, and measure them in degrees (°)
- Identify angles at a point and one whole turn (total 360°), angles at a point on a straight line and half a turn (total 180°), and other multiples of 90°

### 100. `y5-polygons` — Rectangles and polygons

Requires: `y5-angles`. Quest: none. Status: missing.

- Use the properties of rectangles to deduce related facts and find missing lengths and angles
- Distinguish between regular and irregular polygons based on reasoning about equal sides and angles

## 37. `cat-y5-graphs` — Position and graphs

Year 5.

### 101. `y5-reflection-translation` — Reflection and translation

Requires: `y5-polygons`. Quest: none. Status: missing.

- Identify, describe and represent the position of a shape following a reflection or translation, using the appropriate language, and know that the shape has not changed

### 102. `y5-statistics` — Line graphs and timetables

Requires: `y5-reflection-translation`. Quest: none. Status: missing.

- Solve comparison, sum and difference problems using information presented in a line graph
- Complete, read and interpret information in tables, including timetables

## 38. `cat-y6-place` — Numbers to ten million

Year 6.

### 103. `y6-place-value-10000000` — Place value to 10,000,000

Requires: `y5-statistics`. Quest: none. Status: missing.

- Read, write, order and compare numbers up to 10,000,000 and determine the value of each digit
- Round any whole number to a required degree of accuracy
- Solve number and practical problems that involve all of the above

### 104. `y6-negative-intervals` — Intervals across zero

Requires: `y6-place-value-10000000`. Quest: none. Status: missing.

- Use negative numbers in context, and calculate intervals across zero

## 39. `cat-y6-operations` — The four operations

Year 6.

### 105. `y6-long-multiply` — Long multiplication

Requires: `y6-negative-intervals`. Quest: none. Status: missing.

- Multiply multi-digit numbers up to 4 digits by a two-digit whole number using the formal written method of long multiplication

### 106. `y6-long-divide` — Long and short division

Requires: `y6-long-multiply`. Quest: none. Status: missing.

- Divide numbers up to 4 digits by a two-digit whole number using the formal written method of long division, and interpret remainders as whole number remainders, fractions, or by rounding, as appropriate for the context
- Divide numbers up to 4 digits by a two-digit number using the formal written method of short division where appropriate, interpreting remainders according to the context

### 107. `y6-mental-order` — Order of operations

Requires: `y6-long-divide`. Quest: none. Status: missing.

- Perform mental calculations, including with mixed operations and large numbers
- Identify common factors, common multiples and prime numbers
- Use knowledge of the order of operations to carry out calculations involving the four operations

### 108. `y6-multi-step` — Multi-step problems

Requires: `y6-mental-order`. Quest: none. Status: missing.

- Solve addition and subtraction multi-step problems in contexts, deciding which operations and methods to use and why
- Solve problems involving addition, subtraction, multiplication and division
- Use estimation to check answers to calculations and determine, in the context of a problem, an appropriate degree of accuracy

## 40. `cat-y6-measures` — Measures, area and volume

Year 6. Convert units after the four operations.

### 109. `y6-convert-units` — Miles, kilometres and units

Requires: `y6-multi-step`. Quest: none. Status: missing.

- Solve problems involving the calculation and conversion of units of measure, using decimal notation up to three decimal places where appropriate
- Use, read, write and convert between standard units, converting measurements of length, mass, volume and time from a smaller unit of measure to a larger unit, and vice versa, using decimal notation to up to three decimal places
- Convert between miles and kilometres

### 110. `y6-area` — Area of parallelograms and triangles

Requires: `y6-convert-units`. Quest: none. Status: missing.

- Recognise that shapes with the same areas can have different perimeters and vice versa
- Recognise when it is possible to use formulae for area and volume of shapes
- Calculate the area of parallelograms and triangles

### 111. `y6-volume` — Volume of cubes and cuboids

Requires: `y6-area`. Quest: none. Status: missing.

- Calculate, estimate and compare volume of cubes and cuboids using standard units, including cubic centimetres (cm³) and cubic metres (m³), and extending to other units such as mm³ and km³

## 41. `cat-y6-fractions` — Fractions, decimals and percentages

Year 6.

### 112. `y6-simplify-fractions` — Simplify and order fractions

Requires: `y6-volume`. Quest: none. Status: missing.

- Use common factors to simplify fractions
- Use common multiples to express fractions in the same denomination
- Compare and order fractions, including fractions greater than 1

### 113. `y6-add-fractions` — Add and subtract fractions

Requires: `y6-simplify-fractions`. Quest: none. Status: missing.

- Add and subtract fractions with different denominators and mixed numbers, using the concept of equivalent fractions

### 114. `y6-multiply-divide-fractions` — Multiply and divide fractions

Requires: `y6-add-fractions`. Quest: none. Status: missing.

- Multiply simple pairs of proper fractions, writing the answer in its simplest form, for example ¼ × ½ = ⅛
- Divide proper fractions by whole numbers, for example ⅓ ÷ 2 = ⅙

### 115. `y6-decimals` — Decimals to three places

Requires: `y6-multiply-divide-fractions`. Quest: none. Status: missing.

Split decimal place value from written multiply and divide of decimals when this node is built.

- Associate a fraction with division and calculate decimal fraction equivalents for a simple fraction, for example 0.375 for ⅜
- Identify the value of each digit in numbers given to three decimal places, and multiply and divide numbers by 10, 100 and 1,000 giving answers up to three decimal places
- Multiply one-digit numbers with up to two decimal places by whole numbers
- Use written division methods in cases where the answer has up to two decimal places
- Solve problems which require answers to be rounded to specified degrees of accuracy

### 116. `y6-fdp-equivalence` — Fraction, decimal and percentage equivalents

Requires: `y6-decimals`. Quest: none. Status: missing.

- Recall and use equivalences between simple fractions, decimals and percentages, including in different contexts

## 42. `cat-y6-ratio` — Ratio and proportion

Year 6.

### 117. `y6-ratio` — Ratio and scale

Requires: `y6-fdp-equivalence`. Quest: none. Status: missing.

- Solve problems involving the relative sizes of two quantities where missing values can be found by using integer multiplication and division facts
- Solve problems involving similar shapes where the scale factor is known or can be found
- Solve problems involving unequal sharing and grouping using knowledge of fractions and multiples

### 118. `y6-percentage-problems` — Percentage problems

Requires: `y6-ratio`. Quest: none. Status: missing.

- Solve problems involving the calculation of percentages, for example of measures, and such as 15% of 360, and the use of percentages for comparison

## 43. `cat-y6-algebra` — Algebra

Year 6.

### 119. `y6-algebra` — Formulae and sequences

Requires: `y6-percentage-problems`. Quest: none. Status: missing.

Split formulae and sequences from two-unknowns when this node is built.

- Use simple formulae
- Generate and describe linear number sequences
- Express missing number problems algebraically
- Find pairs of numbers that satisfy an equation with two unknowns
- Enumerate possibilities of combinations of two variables

## 44. `cat-y6-shape` — Shape and circles

Year 6.

### 120. `y6-draw-shapes` — Draw shapes and nets

Requires: `y6-algebra`. Quest: none. Status: missing.

- Draw 2-D shapes using given dimensions and angles
- Recognise, describe and build simple 3-D shapes, including making nets

### 121. `y6-missing-angles` — Missing angles

Requires: `y6-draw-shapes`. Quest: none. Status: missing.

- Compare and classify geometric shapes based on their properties and sizes and find unknown angles in any triangles, quadrilaterals and regular polygons
- Recognise angles where they meet at a point, are on a straight line, or are vertically opposite, and find missing angles

### 122. `y6-circles` — Radius and diameter

Requires: `y6-missing-angles`. Quest: none. Status: missing.

- Illustrate and name parts of circles, including radius, diameter and circumference, and know that the diameter is twice the radius

## 45. `cat-y6-graphs` — Position and statistics

Year 6. This is the end of the path.

### 123. `y6-coordinates` — Four quadrants

Requires: `y6-circles`. Quest: none. Status: missing.

- Describe positions on the full coordinate grid (all four quadrants)
- Draw and translate simple shapes on the coordinate plane, and reflect them in the axes

### 124. `y6-statistics` — Pie charts, line graphs and the mean

Requires: `y6-coordinates`. Quest: none. Status: missing.

- Interpret and construct pie charts and line graphs and use these to solve problems
- Calculate and interpret the mean as an average

