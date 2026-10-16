import { useMemo, useRef, useState, type CSSProperties } from "react";
import { Lock, LocateFixed, Trophy } from "lucide-react";
import type { DifficultyState, LevelState } from "../lib/path";
import { DoodleShape, DoodleStar } from "./mascot/Doodles";
import { LevelSheet } from "./LevelSheet";

type PathMapProps = {
  levels: LevelState[];
  learnerEmoji: string;
  learnerName: string;
  onPlay: (activityId: string) => void;
};

const VIEW_W = 400;
const STEP = 96;
const SIGN_GAP = 140; // extra road length between sections (the sign sits in it)
const PAD_BOTTOM = 120;
const SIGN_NEAR = 104; // sign centre to the first level below it
const SIGN_FAR = 148; // same, when the "you are here" badge sits on that level
const SIGN_HALF_H = 40; // how far above and below its centre a sign can reach
const SIGN_CLEARANCE = 36; // px from the road's centre line to the sign (road edge is 18px out)
const FIRST_SIGN_TOP = 58; // centre of the first sign, measured from the top of the map
const SWING = 112;

const YEAR_COLOURS: Record<string, { ink: string; soft: string }> = {
  Reception: { ink: "#c98a00", soft: "#fff1c4" },
  "Year 1": { ink: "#0ca678", soft: "#d9f7e8" },
  "Year 2": { ink: "#0284c7", soft: "#dcf2fd" },
  "Year 3": { ink: "#e03131", soft: "#ffe4e1" },
  "Year 4": { ink: "#6d28d9", soft: "#eceaff" },
  "Year 5": { ink: "#db2777", soft: "#fbdff0" },
  "Year 6": { ink: "#ea580c", soft: "#ffead7" },
};

type PipFill = "empty" | "soft" | "gold";

function pipFill(entry: DifficultyState): PipFill {
  if (entry.bestStars >= 3) return "gold";
  if (entry.bestStars > 0 || entry.bestTotalCount > 0) return "soft";
  return "empty";
}

type Point = { x: number; y: number };

function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// Dense samples along the same curve smoothPath draws, so signs can find where the road really is.
function sampleRoad(points: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    for (let k = 0; k <= 16; k += 1) {
      const t = k / 16;
      const u = 1 - t;
      out.push({
        x: u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x,
        y: u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y,
      });
    }
  }
  return out;
}

type SignPlacement = { style: CSSProperties; shift: string };

// Puts a sign beside the road (on the roomier side) at a steady gap from the road's edge.
function placeSign(samples: Point[], signY: number): SignPlacement {
  const near = samples.filter((s) => Math.abs(s.y - signY) <= SIGN_HALF_H);
  if (near.length === 0) {
    return { style: { left: "50%", maxWidth: "86%" }, shift: "-50%" };
  }

  const minX = Math.min(...near.map((s) => s.x));
  const maxX = Math.max(...near.map((s) => s.x));
  const pct = (x: number) => (x / VIEW_W) * 100;

  // Road on the right: the sign hangs off its right edge, to the left of the road.
  if ((minX + maxX) / 2 >= VIEW_W / 2) {
    return {
      style: {
        right: `calc(${100 - pct(minX)}% + ${SIGN_CLEARANCE}px)`,
        maxWidth: `calc(${pct(minX)}% - ${SIGN_CLEARANCE + 8}px)`,
      },
      shift: "0%",
    };
  }
  // Road on the left: the sign starts to the right of it.
  return {
    style: {
      left: `calc(${pct(maxX)}% + ${SIGN_CLEARANCE}px)`,
      maxWidth: `calc(${100 - pct(maxX)}% - ${SIGN_CLEARANCE + 8}px)`,
    },
    shift: "0%",
  };
}

export function PathMap({ levels, learnerEmoji, learnerName, onPlay }: PathMapProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [openLevel, setOpenLevel] = useState<LevelState | null>(null);

  const currentIndex = useMemo(() => {
    const current = levels.findIndex((level) => level.status === "current");
    if (current >= 0) return current;
    for (let i = levels.length - 1; i >= 0; i -= 1) {
      if (levels[i].status === "done") return i;
    }
    return 0;
  }, [levels]);

  // The "you are here" badge floats above the current level, so a sign needs more room there.
  const markerIndex = levels[currentIndex].status === "current" ? currentIndex : -1;

  const layout = useMemo(() => {
    // Level 1 sits at the top; the road runs down the page.
    const signDistance = (nodeIndex: number) =>
      nodeIndex === markerIndex ? SIGN_FAR : SIGN_NEAR;
    // Keeps the first sign a fixed distance from the top edge, whatever its own gap is.
    const padTop = FIRST_SIGN_TOP + signDistance(0) - SIGN_GAP;
    const drop = (index: number, categoryIndex: number) =>
      padTop + (categoryIndex + 1) * SIGN_GAP + index * STEP;
    const last = levels[levels.length - 1];
    const height = drop(levels.length - 1, last.categoryIndex) + PAD_BOTTOM;

    const points: Point[] = levels.map((level, index) => ({
      x: VIEW_W / 2 + SWING * Math.sin(index * 0.9),
      y: drop(index, level.categoryIndex),
    }));

    const zones = levels.reduce<
      { categoryIndex: number; first: number; last: number }[]
    >((acc, level, index) => {
      const zone = acc[acc.length - 1];
      if (zone && zone.categoryIndex === level.categoryIndex) zone.last = index;
      else acc.push({ categoryIndex: level.categoryIndex, first: index, last: index });
      return acc;
    }, []);

    const half = (SIGN_GAP + STEP) / 2;
    const samples = sampleRoad(points);
    const bands = zones.map((zone, i) => {
      const top = i === 0 ? 0 : points[zone.first].y - half;
      const bottom = i === zones.length - 1 ? height : points[zone.last].y + half;
      const signY = points[zone.first].y - signDistance(zone.first);
      return {
        ...zone,
        top,
        height: bottom - top,
        signY,
        sign: placeSign(samples, signY),
      };
    });

    return { height, points, bands };
  }, [levels, markerIndex]);

  const fullPath = useMemo(() => smoothPath(layout.points), [layout.points]);
  const travelledPath = useMemo(
    () => smoothPath(layout.points.slice(0, currentIndex + 1)),
    [layout.points, currentIndex],
  );

  // The map is part of the page, so the page itself scrolls to the learner's level.
  function scrollToCurrent(smooth: boolean) {
    const frame = frameRef.current;
    if (!frame) return;
    const frameTop = frame.getBoundingClientRect().top + window.scrollY;
    const target = frameTop + layout.points[currentIndex].y - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
  }

  const currentLevel = levels[currentIndex];

  return (
    <section className="map-section" aria-label="Your maths map">
      <div className="map-frame" ref={frameRef}>
        <div className="map-world" style={{ height: layout.height }}>
          {layout.bands.map((band) => {
            const category = levels[band.first].category;
            const colours = YEAR_COLOURS[category.year] ?? YEAR_COLOURS["Year 1"];
            return (
              <div
                key={category.id}
                className="map-zone"
                style={{ top: band.top, height: band.height, background: colours.soft }}
                aria-hidden
              />
            );
          })}

          <div className="map-track">
            <svg
              className="map-road"
              viewBox={`0 0 ${VIEW_W} ${layout.height}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d={fullPath} className="road-edge" vectorEffect="non-scaling-stroke" />
              <path d={fullPath} className="road-base" vectorEffect="non-scaling-stroke" />
              <path d={travelledPath} className="road-done" vectorEffect="non-scaling-stroke" />
              <path d={fullPath} className="road-dots" vectorEffect="non-scaling-stroke" />
            </svg>

            {layout.points.map((point, index) =>
              index % 3 === 1 ? (
                <span
                  key={`doodle-${levels[index].node.id}`}
                  className="map-doodle"
                  style={{
                    left: `${(point.x > VIEW_W / 2 ? 9 : 91)}%`,
                    top: point.y,
                  }}
                  aria-hidden
                >
                  {index % 2 ? <DoodleStar size={18} /> : <DoodleShape size={16} />}
                </span>
              ) : null,
            )}

            {layout.bands.map((band) => {
              const category = levels[band.first].category;
              const colours = YEAR_COLOURS[category.year] ?? YEAR_COLOURS["Year 1"];
              return (
                <div
                  key={`sign-${category.id}`}
                  className="map-sign"
                  style={
                    {
                      top: band.signY,
                      ...band.sign.style,
                      transform: `translate(${band.sign.shift}, -50%) rotate(-2deg)`,
                      "--zone-ink": colours.ink,
                    } as CSSProperties
                  }
                >
                  <span className="map-sign-year">{category.year}</span>
                  <span className="map-sign-title">{category.title}</span>
                </div>
              );
            })}

            {levels.map((level, index) => {
              const point = layout.points[index];
              const isCurrent = index === currentIndex && level.status === "current";
              const started = level.difficulties.some(
                (entry) => entry.bestStars > 0 || entry.bestTotalCount > 0,
              );
              const showPips =
                started && !level.cup && level.status !== "soon" && level.status !== "locked";
              const label = [
                `Level ${level.node.number}`,
                level.node.title,
                level.status === "soon" ? "coming soon" : null,
                level.cup ? "gold cup" : null,
                showPips ? "in progress" : null,
                level.status === "locked" ? "locked" : null,
                isCurrent ? "play next" : null,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <div
                  key={level.node.id}
                  className={`map-stop is-${level.status}${isCurrent ? " is-here" : ""}${level.cup ? " is-cup" : ""}`}
                  style={{ left: `${(point.x / VIEW_W) * 100}%`, top: point.y }}
                >
                  {isCurrent ? (
                    <span className="map-you" aria-hidden>
                      <span className="map-you-face">{learnerEmoji}</span>
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className="map-node"
                    aria-label={label}
                    onClick={() => setOpenLevel(level)}
                  >
                    {level.status === "locked" ? (
                      <Lock size={20} aria-hidden />
                    ) : level.cup ? (
                      <Trophy size={22} aria-hidden />
                    ) : (
                      <span className="map-node-num">{level.node.number}</span>
                    )}
                  </button>
                  {showPips ? (
                    <span className="map-pips" aria-hidden>
                      {level.difficulties.map((entry) => (
                        <span
                          key={entry.difficulty}
                          className={`map-pip is-${pipFill(entry)}`}
                        />
                      ))}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="map-jump"
        onClick={() => scrollToCurrent(true)}
      >
        <LocateFixed size={16} aria-hidden /> Go to my level
      </button>

      <LevelSheet
        level={openLevel}
        learnerName={learnerName}
        currentLevel={currentLevel}
        onClose={() => setOpenLevel(null)}
        onPlay={(activityId) => {
          setOpenLevel(null);
          onPlay(activityId);
        }}
      />
    </section>
  );
}
