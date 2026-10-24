import { Sheet, SheetTitle } from "./Sheet";
import { ArrowLeft, RotateCw, X } from "lucide-react";
import { copy } from "../data/copy";

export function QuestExitSheet({ open, title, onClose, onRetry, onExit }: {
  open: boolean; title: string; onClose: () => void; onRetry: () => void; onExit: () => void;
}) {
  return <Sheet open={open} onClose={onClose} descriptionId="quest-exit-note" className="quest-exit-sheet">
      <button type="button" className="sheet-close" onClick={onClose} aria-label={copy.keepPlaying}><X size={20} aria-hidden /></button>
      <p className="sheet-crumb">{title}</p>
      <SheetTitle className="sheet-title">{copy.questOptions}</SheetTitle>
      <p id="quest-exit-note" className="t-body">{copy.questRestartNote}</p>
      <div className="quest-exit-actions">
        <button type="button" className="btn btn-primary btn-block" onClick={onRetry}><RotateCw size={20} aria-hidden />{copy.tryAgain}</button>
        <button type="button" className="btn btn-secondary btn-block" onClick={onExit}><ArrowLeft size={20} aria-hidden />{copy.backToQuests}</button>
      </div>
  </Sheet>;
}
