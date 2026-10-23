/** Soft fill + outline ink per curriculum year. Shared by the path map and quest intro. */
export const YEAR_COLOURS: Record<string, { ink: string; soft: string }> = {
  Reception: { ink: "#c98a00", soft: "#fff1c4" },
  "Year 1": { ink: "#0ca678", soft: "#d9f7e8" },
  "Year 2": { ink: "#0284c7", soft: "#dcf2fd" },
  "Year 3": { ink: "#e03131", soft: "#ffe4e1" },
  "Year 4": { ink: "#6d28d9", soft: "#eceaff" },
  "Year 5": { ink: "#db2777", soft: "#fbdff0" },
  "Year 6": { ink: "#ea580c", soft: "#ffead7" },
};

export function yearColours(year: string): { ink: string; soft: string } {
  return YEAR_COLOURS[year] ?? YEAR_COLOURS["Year 1"];
}
