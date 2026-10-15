import { prototypes } from "../data/prototypes";
import type { PrototypeId } from "../types";

type Props = {
  onSelect: (id: PrototypeId, available: boolean) => void;
};

export function IntakeView({ onSelect }: Props) {
  return (
    <div className="workspace-inner">
      <p className="eyebrow">Intake</p>
      <h1 className="display text-[2.05rem]">Show me what you built.</h1>
      <p className="lede">
        I’ll work through it the way I would if we were taking it towards a pilot — purpose, data,
        architecture, and the decisions that tend to stall these things.
      </p>
      <div className="proto-list">
        {prototypes.map((prototype) => (
          <button
            key={prototype.id}
            type="button"
            className="proto-card"
            onClick={() => onSelect(prototype.id, prototype.available)}
          >
            <span>
              <span className="proto-name">{prototype.name}</span>
              <p className="proto-meta">{prototype.meta}</p>
            </span>
            <span className="proto-cta">{prototype.available ? "Look at this" : "Later"}</span>
          </button>
        ))}
      </div>
      <p className="note">A link or a folder works in the real product. This walkthrough starts with Matter Brief.</p>
    </div>
  );
}
