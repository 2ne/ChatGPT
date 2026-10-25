import { copy } from "../../data/copy";

type BaseTenKeyProps = {
  /** Easy and Medium say what the pieces mean. Hard uses the pictures only. */
  explain?: boolean;
};

/** One compact key for a question. Not tappable. Never sit this inside an option. */
export function BaseTenKey({ explain }: BaseTenKeyProps) {
  return (
    <div className="base-ten-key" aria-label={copy.baseTenKeyAria}>
      <span className="base-ten-key-line" aria-hidden>
        <span className="base-ten-key-rod" />
        <span className="base-ten-key-eq">= 10</span>
        <span className="base-ten-key-one" />
        <span className="base-ten-key-eq">= 1</span>
      </span>
      {explain ? <p className="base-ten-key-hint">{copy.baseTenKeyHint}</p> : null}
    </div>
  );
}
