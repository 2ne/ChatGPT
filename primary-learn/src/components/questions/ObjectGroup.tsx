import { useEffect, useMemo, useState, type MouseEvent, type PointerEvent } from "react";
import { copy } from "../../data/copy";
import { OBJECT_GLYPH, OBJECT_WORDS, describeVisual } from "../../data/objects";
import { hashString, mulberry32 } from "../../lib/realize";
import { speakCount } from "../../lib/speech";
import type { ObjectAsset, ObjectItem, ObjectLayout } from "../../types/activity";
import { FlashReveal } from "./FlashReveal";

type Token = {
  key: string;
  item: ObjectItem;
  countable: boolean;
};

type ObjectGroupProps = {
  visual: ObjectAsset;
  extras?: ObjectAsset[];
  compact?: boolean;
  interactive?: boolean;
  layout?: ObjectLayout;
  /** Brief reveal then hide (subitising). */
  flashMs?: number;
};

/** Dice-face slots on a 3×3 grid (0–8). Used to glance a quantity without counting in a line. */
const DICE_SLOTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function sceneKey(visual: ObjectAsset, extras: ObjectAsset[] | undefined, layout: ObjectLayout | undefined) {
  const extra = (extras ?? []).map((asset) => `${asset.item}:${asset.count}`).join(",");
  return `${visual.item}:${visual.count}:${layout ?? "row"}:${extra}`;
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

function FrameCells({
  capacity,
  count,
  glyph,
  label,
}: {
  capacity: number;
  count: number;
  glyph: string;
  label: string;
}) {
  const cols = capacity === 10 ? 5 : capacity;
  return (
    <span
      className={`object-group is-frame is-frame-${capacity}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 36px)` }}
      aria-label={label}
    >
      {Array.from({ length: capacity }, (_, cell) => (
        <span key={cell} className={`object-frame-cell${cell < count ? " is-filled" : ""}`} aria-hidden>
          {cell < count ? glyph : null}
        </span>
      ))}
    </span>
  );
}

function FingerPattern({ count, label }: { count: number; label: string }) {
  return (
    <span className="object-group is-fingers" aria-label={label}>
      <span className="finger-hand" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`finger${index < count ? " is-up" : " is-down"}`}
          />
        ))}
      </span>
    </span>
  );
}

function StaticGroup({
  visual,
  extras,
  layout,
  tokens,
  scatter,
}: {
  visual: ObjectAsset;
  extras?: ObjectAsset[];
  layout?: ObjectLayout;
  tokens: Token[];
  scatter: boolean;
}) {
  const mixed = Boolean(extras && extras.length > 0);
  const glyph = OBJECT_GLYPH[visual.item];
  const dice = layout === "dice" && visual.count >= 1 && visual.count <= 6 && !mixed;

  if (layout === "fingers") {
    return <FingerPattern count={visual.count} label={`${visual.count} fingers`} />;
  }

  if (layout === "five-frame" && !mixed) {
    return (
      <FrameCells capacity={5} count={visual.count} glyph={glyph} label={describeVisual(visual)} />
    );
  }

  if (layout === "tens-frame" && !mixed) {
    return (
      <FrameCells capacity={10} count={visual.count} glyph={glyph} label={describeVisual(visual)} />
    );
  }

  if (dice) {
    const slots = DICE_SLOTS[visual.count] ?? [];
    return (
      <span className="object-group is-dice" aria-label={describeVisual(visual)}>
        {Array.from({ length: 9 }, (_, cell) => (
          <span key={cell} className="object-dice-cell" aria-hidden>
            {slots.includes(cell) ? glyph : null}
          </span>
        ))}
      </span>
    );
  }

  const extraLabel =
    extras?.length ? extras.map((asset) => describeVisual(asset)).join(" and ") : "";
  const label = extraLabel ? `${describeVisual(visual)} and ${extraLabel}` : describeVisual(visual);

  if (mixed && !scatter) {
    const parts = [visual, ...(extras ?? [])];
    return (
      <span className="object-group is-parts" aria-label={label}>
        {parts.map((asset, partIndex) => (
          <span key={`${asset.item}-${partIndex}`} className="object-part" aria-hidden>
            {Array.from({ length: asset.count }, (_, index) => (
              <span key={index} className="object-glyph">
                {OBJECT_GLYPH[asset.item]}
              </span>
            ))}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={`object-group is-tiled${scatter ? " is-scatter" : ""}`}
      aria-label={label}
    >
      {tokens.map((token) => (
        <span key={token.key} className="object-token" aria-hidden>
          <span className="object-glyph">{OBJECT_GLYPH[token.item]}</span>
        </span>
      ))}
    </span>
  );
}

export function ObjectGroup({
  visual,
  extras,
  compact,
  interactive = false,
  layout,
  flashMs,
}: ObjectGroupProps) {
  const key = sceneKey(visual, extras, layout);
  const mixed = Boolean(extras && extras.length > 0);
  const tokens = useMemo(() => {
    const raw = tokensFor(visual, extras);
    if (!mixed) return raw;
    if (layout === "scatter") return shuffleTokens(raw, key);
    return raw;
  }, [visual, extras, mixed, key, layout]);

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

  if (compact) {
    const glyph = OBJECT_GLYPH[visual.item];
    if (layout === "dice" && visual.count >= 1 && visual.count <= 6) {
      const slots = DICE_SLOTS[visual.count] ?? [];
      return (
        <span className="object-group is-dice is-compact-dice" aria-label={describeVisual(visual)}>
          {Array.from({ length: 9 }, (_, cell) => (
            <span key={cell} className="object-dice-cell" aria-hidden>
              {slots.includes(cell) ? glyph : null}
            </span>
          ))}
        </span>
      );
    }
    if (layout === "five-frame") {
      return (
        <FrameCells
          capacity={5}
          count={visual.count}
          glyph={glyph}
          label={describeVisual(visual)}
        />
      );
    }
    return (
      <span className="object-group is-compact" aria-label={describeVisual(visual)}>
        {Array.from({ length: visual.count }, (_, index) => (
          <span key={index} aria-hidden>
            {glyph}
          </span>
        ))}
      </span>
    );
  }

  const counted = Object.keys(lit).length;
  const scatter = layout === "scatter";
  const showFlash = layout === "hidden" || flashMs != null;

  if (!interactive) {
    const body = (
      <StaticGroup
        visual={visual}
        extras={extras}
        layout={layout === "hidden" ? "row" : layout}
        tokens={tokens}
        scatter={scatter}
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

  return (
    <div className="count-scene">
      <div
        className={`object-group is-tiled is-tappable${scatter ? " is-scatter" : ""}`}
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
          {copy.countAgain}
        </button>
      ) : null}
    </div>
  );
}

export function OptionContent({
  label,
  visual,
  layout,
}: {
  label?: string;
  visual?: ObjectAsset;
  layout?: ObjectLayout;
}) {
  return (
    <span className="option-content">
      {visual ? <ObjectGroup visual={visual} compact layout={layout} /> : null}
      {label ? <span>{label}</span> : null}
    </span>
  );
}
