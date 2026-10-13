import type { ReactNode } from "react";
import { usePipMood } from "./PipMood";
import { PipScene } from "./mascot/PipScene";

type AppHeaderProps = {
  right?: ReactNode;
};

export function AppHeader({ right }: AppHeaderProps) {
  const { mood } = usePipMood();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand-row">
          <PipScene size={48} mood={mood} />
          <span className="brand-name">Primary Path</span>
        </div>
        {right ? <div className="app-header-right">{right}</div> : null}
      </div>
    </header>
  );
}
