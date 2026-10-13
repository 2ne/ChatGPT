import type { ReactNode } from "react";
import { Pip } from "./mascot/Pip";

type AppHeaderProps = {
  right?: ReactNode;
};

export function AppHeader({ right }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand-row">
          <Pip size={36} mood="happy" />
          <span className="brand-name">Primary Path</span>
        </div>
        {right ? <div className="app-header-right">{right}</div> : null}
      </div>
    </header>
  );
}
