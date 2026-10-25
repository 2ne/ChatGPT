import { useEffect, useMemo, useState, type MouseEvent, type PointerEvent } from "react";
import { RotateCw } from "lucide-react";
import { copy } from "../../data/copy";
import { OBJECT_GLYPH, OBJECT_WORDS, describeVisual } from "../../data/objects";
import { hashString, mulberry32 } from "../../lib/realize";
import { speakCount } from "../../lib/speech";
import type { BaseTenAsset, DiceAsset, ObjectAsset, ObjectItem, ObjectLayout, TenFrameAsset } from "../../types/activity";
import { BaseTen } from "./BaseTen";
import { DiceFace } from "./DiceFace";
import { FingerHand } from "./FingerHand";
import { FlashReveal } from "./FlashReveal";
import { TenFrame } from "./TenFrame";

type Token = {
  key: string;
  item: ObjectItem;
  countable: boolean;
};

type ObjectGroupProps = {
  visual: ObjectAsset;
  extras?: ObjectAsset[];
  /** Smaller tiles for A/B/C/D and match-pair cards. Stems never pass this. */
  compact?: boolean;
  /** Neat rows of at most 5 for the 2x2 amount-pick cards. */
  pack?: boolean;
  interactive?: boolean;
  layout?: ObjectLayout;
  /** Brief reveal then hide (subitising). */
  flashMs?: number;
};

function sceneKey(visual: ObjectAsset, extras: ObjectAsset[] | undefined, layout: ObjectLayout | undefined) {
  const extra = (extras ?? []).map((asset) => `${asset.item}:${asset.count}`).join(",");
  const added = visual.added == null ? "" : `+${visual.added}`;
  const removed = visual.removed == null ? "" : `-${visual.removed}`;
  return `${visual.item}:${visual.count}${added}${removed}:${layout ?? "row"}:${extra}`;
}

function tokensFor(visual: ObjectAsset, extras: ObjectAsset[] | undefined): Token[] {
  const tokens: Token[] = [];
  for (let index = 0; index < visual.count; index += 1) {
    tokens.push({ key: `c-${index}`, item: visual.item, countable: true });
  }
  (extras ?? []).forEach((asset, extraIndex) => {
    for (let index = 0; index < asset.count; index += 1) {
      tokens.push({
        key: `e-${extraIndex}-${index}`,
        item: asset.item,
        countable: false,
      });
    }
  });
  return tokens;
}

function shuffleTokens(list: Token[], salt: string): Token[] {
  const rng = mulberry32(hashString(salt));
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function groupLabel(visual: ObjectAsset, extras: ObjectAsset[] | undefined, interactive: boolean): string {
  const words = OBJECT_WORDS[visual.item];
  if (!interactive) return describeVisual(visual);
  if (extras && extras.length > 0) {
    return `${words.plural}. Tap each ${words.singular} to count.`;
  }
  return `${words.plural}. Tap each one to count.`;
}

function groupClass(scatter: boolean, compact: boolean, tappable: boolean, pack?: boolean): string {
  const bits = ["object-group", "is-tiled"];
  if (tappable) bits.push("is-tappable");
  if (scatter) bits.push("is-scatter");
  if (compact) bits.push("is-option");
  if (pack) bits.push("is-amount");
  return bits.join(" ");
}

function rowLengths(count: number, max = 5): number[] {
  if (count <= max) return [count];
  const rows = Math.ceil(count / max);
  const base = Math.floor(count / rows);
  const extra = count % rows;
  return Array.from({ length: rows }, (_, index) => base + (index < extra ? 1 : 0));
}

function fingerLabel(count: number): string {
  return count === 1 ? "1 finger" : `${count} fingers`;
}

function FingerPattern({
  count,
  compact,
}: {
  count: number;
  compact?: boolean;
}) {
  return (
    <span
      className={`object-group is-fingers${compact ? " is-option" : ""}`}
      aria-label={fingerLabel(count)}
    >
      <span className="finger-hand" aria-hidden>
        <FingerHand count={count} />
      </span>
    </span>
  );
}

function PictureTiles({
  tokens,
  scatter,
  compact,
  pack,
  label,
}: {
  tokens: Token[];
  scatter: boolean;
  compact: boolean;
  pack?: boolean;
  label: string;
}) {
  const className = groupClass(scatter, compact, false, pack);
  if (pack) {
    const rows = rowLengths(tokens.length);
    let offset = 0;
    return (
      <span className={className} aria-label={label}>
        {rows.map((size, row) => {
          const slice = tokens.slice(offset, offset + size);
          offset += size;
          return (
            <span key={`r-${row}`} className="object-row" aria-hidden>
              {slice.map((token) => (
                <span key={token.key} className="object-token">
                  <span className="object-glyph">{OBJECT_GLYPH[token.item]}</span>
                </span>
              ))}
            </span>
          );
        })}
      </span>
    );
  }
  return (
    <span className={className} aria-label={label}>
      {tokens.map((token) => (
        <span key={token.key} className="object-token" aria-hidden>
          <span className="object-glyph">{OBJECT_GLYPH[token.item]}</span>
        </span>
      ))}
    </span>
  );
}

const STORY_ROW = 10;

function chunkRows<T>(items: T[], size = STORY_ROW): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function StoryTileRows({
  count,
  glyph,
  tokenClass,
  goneFrom,
}: {
  count: number;
  glyph: string;
  tokenClass: string;
  goneFrom?: number;
}) {
  const indexes = Array.from({ length: count }, (_, index) => index);
  const rows = chunkRows(indexes);
  const ten = count > STORY_ROW;
  return (
    <span className={`story-rows${ten ? " is-ten" : ""}`} aria-hidden>
      {rows.map((row, rowIndex) => (
        <span key={`r-${rowIndex}`} className="story-row">
          {row.map((index) => {
            const gone = goneFrom != null && index >= goneFrom;
            return (
              <span key={index} className={`story-tile ${tokenClass}${gone ? " is-gone" : ""}`}>
                <span className="object-glyph">{glyph}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function TakeAwayTiles({ visual, compact }: { visual: ObjectAsset; compact?: boolean }) {
  const removed = visual.removed ?? 0;
  const keep = Math.max(0, visual.count - removed);
  const glyph = OBJECT_GLYPH[visual.item];
  const label = describeVisual(visual);
  const fitTen = visual.count >= STORY_ROW;
  return (
    <span
      className={`take-away-strip${compact ? " is-option" : ""}${fitTen ? " is-fit-ten" : ""}`}
      aria-label={label}
    >
      <StoryTileRows count={visual.count} glyph={glyph} tokenClass="take-away-token" goneFrom={keep} />
    </span>
  );
}

function JoinTiles({ visual, compact }: { visual: ObjectAsset; compact?: boolean }) {
  const added = visual.added ?? 0;
  const glyph = OBJECT_GLYPH[visual.item];
  const label = describeVisual(visual);
  const fitTen = visual.count >= STORY_ROW || added >= STORY_ROW;
  return (
    <span className={`join-story${compact ? " is-option" : ""}${fitTen ? " is-fit-ten" : ""}`} aria-label={label}>
      <span className="join-story-start">
        <StoryTileRows count={visual.count} glyph={glyph} tokenClass="object-token" />
      </span>
      <span className="join-story-more" aria-hidden>
        <span className="join-story-plus">+</span>
        <span className="join-story-added">
          <StoryTileRows count={added} glyph={glyph} tokenClass="object-token is-added" />
        </span>
      </span>
    </span>
  );
}

export function ObjectGroup({
  visual,
  extras,
  compact,
  pack,
  interactive = false,
  layout,
  flashMs,
}: ObjectGroupProps) {
  const key = sceneKey(visual, extras, layout);
  const mixed = Boolean(extras && extras.length > 0);
  const scatter = layout === "scatter";
  const tokens = useMemo(() => {
    const raw = tokensFor(visual, extras);
    if (mixed && scatter) return shuffleTokens(raw, key);
    return raw;
  }, [visual, extras, mixed, scatter, key]);

  const [lit, setLit] = useState<Record<string, number>>({});
  const [miss, setMiss] = useState<string | null>(null);

  useEffect(() => {
    setLit({});
    setMiss(null);
  }, [key]);

  function tapToken(token: Token) {
    if (!token.countable) {
      setMiss(token.key);
      return;
    }
    const already = lit[token.key];
    if (already != null) {
      speakCount(already);
      return;
    }
    const nextNumber = Object.keys(lit).length + 1;
    speakCount(nextNumber);
    setLit({ ...lit, [token.key]: nextNumber });
  }

  function activate(token: Token, event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
    if ("button" in event && event.button !== 0 && event.button !== undefined) {
      if (event.type === "pointerdown") return;
    }
    if (event.type === "pointerdown") event.preventDefault();
    tapToken(token);
  }

  const extraLabel =
    extras?.length ? extras.map((asset) => describeVisual(asset)).join(" and ") : "";
  const lookLabel = extraLabel ? `${describeVisual(visual)} and ${extraLabel}` : describeVisual(visual);
  const showFlash = layout === "hidden" || flashMs != null;
  const isJoin = visual.added != null && visual.added > 0;
  const isTakeAway = visual.removed != null && visual.removed > 0;

  if (isJoin) {
    return <JoinTiles visual={visual} compact={compact} />;
  }

  if (isTakeAway) {
    return <TakeAwayTiles visual={visual} compact={compact} />;
  }

  if (layout === "fingers") {
    const body = <FingerPattern count={visual.count} compact={compact} />;
    if (showFlash) {
      return <FlashReveal flashMs={flashMs ?? 1200}>{body}</FlashReveal>;
    }
    return body;
  }

  if (!interactive) {
    const body = (
      <PictureTiles
        tokens={tokens}
        scatter={scatter}
        compact={Boolean(compact)}
        pack={pack}
        label={lookLabel}
      />
    );
    if (showFlash) {
      return (
        <FlashReveal flashMs={flashMs ?? 1200}>
          {layout === "hidden" ? <div className="hidden-quantity">{body}</div> : body}
        </FlashReveal>
      );
    }
    return body;
  }

  const counted = Object.keys(lit).length;

  return (
    <div className="count-scene">
      <div
        className={groupClass(scatter, false, true)}
        role="group"
        aria-label={groupLabel(visual, extras, true)}
      >
        {tokens.map((token) => {
          const order = lit[token.key];
          const isLit = order != null;
          return (
            <button
              key={token.key}
              type="button"
              className={`object-token${isLit ? " is-lit" : ""}${
                !token.countable ? " is-extra" : ""
              }${miss === token.key ? " is-miss" : ""}`}
              aria-label={
                token.countable
                  ? isLit
                    ? `${OBJECT_WORDS[token.item].singular}, ${order}`
                    : OBJECT_WORDS[token.item].singular
                  : `Not a ${OBJECT_WORDS[visual.item].singular}`
              }
              aria-pressed={isLit}
              onPointerDown={(event) => activate(token, event)}
              onClick={(event) => {
                if (event.detail === 0) activate(token, event);
              }}
              onAnimationEnd={() => {
                if (miss === token.key) setMiss(null);
              }}
            >
              <span className="object-glyph" aria-hidden>
                {OBJECT_GLYPH[token.item]}
              </span>
              {order != null ? (
                <span className="object-num" aria-hidden>
                  {order}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {counted > 0 ? String(counted) : ""}
      </p>
      {counted > 0 ? (
        <button type="button" className="btn-text" onClick={() => setLit({})}>
          <RotateCw size={20} style={{ flexShrink: 0 }} aria-hidden />
          {copy.countAgain}
        </button>
      ) : null}
    </div>
  );
}

export function OptionContent({
  label,
  visual,
  tenFrame,
  baseTen,
  dice,
  layout,
  pack,
}: {
  label?: string;
  visual?: ObjectAsset;
  tenFrame?: TenFrameAsset;
  baseTen?: BaseTenAsset;
  dice?: DiceAsset;
  layout?: ObjectLayout;
  pack?: boolean;
}) {
  return (
    <span className="option-content">
      {tenFrame ? <TenFrame frame={tenFrame} compact /> : null}
      {baseTen ? <BaseTen model={baseTen} compact /> : null}
      {dice ? <DiceFace face={dice} compact /> : null}
      {visual ? <ObjectGroup visual={visual} compact pack={pack} layout={layout} /> : null}
      {label ? <span>{label}</span> : null}
    </span>
  );
}
