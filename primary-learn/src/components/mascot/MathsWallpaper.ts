import type { PathCategory } from "../../types/path";

// Decorative SVG tiles, selected from the existing curriculum category IDs.
// Fixed tile size keeps the drawings legible on both phones and wide screens.
const drawings = {
  dots: '<circle cx="8" cy="8" r="3"/><circle cx="24" cy="8" r="3"/><circle cx="8" cy="24" r="3"/><circle cx="24" cy="24" r="3"/>',
  dice: '<rect x="1" y="1" width="32" height="32" rx="7"/><circle cx="9" cy="9" r="2"/><circle cx="25" cy="9" r="2"/><circle cx="17" cy="17" r="2"/><circle cx="9" cy="25" r="2"/><circle cx="25" cy="25" r="2"/>',
  triangle: '<path d="M17 1L34 31H0Z"/>',
  cube: '<path d="M17 0L33 9V27L17 36L1 27V9ZM1 9L17 18L33 9M17 18V36"/>',
  circle: '<circle cx="17" cy="17" r="16"/><path d="M17 17L30 7M17 17H33"/>',
  ruler: '<rect x="0" y="7" width="42" height="18" rx="3"/><path d="M8 7V16M16 7V13M24 7V16M32 7V13"/>',
  clock: '<circle cx="17" cy="17" r="16"/><path d="M17 5V8M29 17H26M17 29V26M5 17H8M17 10V17L23 21"/>',
  coin: '<circle cx="17" cy="17" r="16"/><circle cx="17" cy="17" r="12"/>',
  half: '<circle cx="17" cy="17" r="16"/><path d="M17 1V33M5 7L17 19M2 15L17 30M11 2L17 8"/>',
  quarters: '<rect x="1" y="1" width="32" height="32" rx="3"/><path d="M17 1V33M1 17H33M3 3L15 15M3 10L8 15M10 3L15 8"/>',
  graph: '<path d="M1 1V34H38M8 27V18H14V27M20 27V10H26V27M32 27V3H38V27"/>',
  line: '<path d="M1 1V34H38M6 26L16 16L25 21L36 5"/><circle cx="16" cy="16" r="2"/><circle cx="25" cy="21" r="2"/>',
  groups: '<circle cx="8" cy="8" r="7"/><circle cx="26" cy="8" r="7"/><circle cx="8" cy="26" r="7"/><circle cx="26" cy="26" r="7"/>',
  steps: '<path d="M0 30H10V20H20V10H30V0M0 36H38"/>',
};

function lettering(value: string): string {
  return `<text x="17" y="28" text-anchor="middle" font-family="Arial Rounded MT Bold,Arial,sans-serif" font-size="32" font-weight="700" stroke-width="1.1">${value}</text>`;
}

function motifs(category: PathCategory): string[] {
  const id = category.id;
  const text = lettering;
  if (id.endsWith("-graphs")) return [drawings.graph, drawings.line, text("1"), text("2"), drawings.dots];
  if (id.endsWith("-shape")) return [drawings.triangle, drawings.cube, drawings.circle, '<rect x="1" y="1" width="32" height="32" rx="4"/>'];
  if (id.endsWith("-measures")) return [drawings.ruler, drawings.clock, drawings.coin, drawings.cube];
  if (id.endsWith("-algebra")) return [text("x"), text("y"), text("="), text("+"), drawings.steps];
  if (id.endsWith("-ratio")) return [drawings.groups, text("2:3"), drawings.dots, text("×")];
  if (id.endsWith("-decimals")) return [text("0.5"), drawings.half, text("%"), drawings.quarters];
  if (id.endsWith("-fractions") || id.endsWith("-groups")) return [drawings.half, drawings.quarters, text("½"), drawings.groups];
  if (id.endsWith("-tables") || id.endsWith("-multiply") || id.endsWith("-factors")) return [text("×"), drawings.groups, text("÷"), drawings.dots, text("2")];
  if (id.endsWith("-add") || id.endsWith("-operations")) return [text("+"), text("−"), text("="), drawings.dice, text("3")];
  if (id.endsWith("-place")) return [text("10"), text("100"), drawings.dots, text("1"), drawings.cube];
  if (id.endsWith("-count-on")) return [text("1"), drawings.steps, text("2"), text("+"), text("3")];
  if (id.endsWith("-to-100")) return [text("10"), text("20"), text("50"), text("100"), drawings.dots];
  if (id.endsWith("-to-20")) return [text("11"), text("12"), text("20"), drawings.dice, drawings.dots];
  if (id.endsWith("-to-10")) return [text("6"), text("7"), text("8"), text("9"), text("10"), drawings.dice];
  return [text("1"), text("2"), text("3"), text("4"), text("5"), drawings.dots, drawings.dice];
}

const cache = new Map<string, string>();

const TILE_POSITIONS: [number, number, number][] = [
  [18, 18, -14], [100, 8, 12], [205, 28, -18], [277, 6, 10],
  [52, 87, 16], [157, 76, -9], [256, 100, 19],
  [9, 169, -12], [110, 151, 15], [207, 183, -16],
  [55, 246, 9], [162, 248, -18], [279, 242, 14],
];

function wallpaperFromShapes(shapes: string[], ink: string, cacheKey: string): string {
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  const artwork = TILE_POSITIONS.map(([x, y, angle], index) =>
    `<g transform="translate(${x} ${y}) rotate(${angle} 17 17)">${shapes[index % shapes.length]}</g>`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="310" viewBox="0 0 340 310"><g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.17">${artwork}<circle cx="79" cy="66" r="2"/><circle cx="240" cy="165" r="3"/><circle cx="43" cy="227" r="2"/><path d="M193 132h8m-4-4v8M309 207h8m-4-4v8"/></g></svg>`;
  const result = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  cache.set(cacheKey, result);
  return result;
}

export function mathsWallpaper(category: PathCategory, ink: string): string {
  return wallpaperFromShapes(motifs(category), ink, `${category.id}:${ink}`);
}

/** Soft numbers-and-dice doodles for onboarding (warm paper stays underneath). */
export function welcomeWallpaper(ink = "#4F46E5"): string {
  const shapes = [
    lettering("1"),
    lettering("2"),
    lettering("3"),
    lettering("4"),
    lettering("5"),
    drawings.dots,
    drawings.dice,
  ];
  return wallpaperFromShapes(shapes, ink, `welcome:${ink}`);
}
