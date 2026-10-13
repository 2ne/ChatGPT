import { Pip } from "./mascot/Pip";

/** Inline brand lockup (non-sticky). Prefer AppHeader on main screens. */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div className="brand-row">
      <span className="brand-pip" style={{ width: size + 10, height: size + 10 }}>
        <Pip size={size} />
      </span>
      <span className="brand-text">
        <span className="brand-name">
          Primary <em>Path</em>
        </span>
      </span>
    </div>
  );
}
