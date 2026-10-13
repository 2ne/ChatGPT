import { Pip } from "./mascot/Pip";

/** Inline brand lockup (non-sticky). Prefer AppHeader on main screens. */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div className="brand-row">
      <Pip size={size} />
      <span className="brand-name">Primary Path</span>
    </div>
  );
}
