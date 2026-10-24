import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, RotateCw, X } from "lucide-react";
import { copy } from "../data/copy";

export function QuestExitSheet({ title, onClose, onRetry, onExit }: {
  title: string; onClose: () => void; onRetry: () => void; onExit: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const element = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return <dialog ref={dialog} className="sheet-layer quest-exit-dialog" aria-labelledby="quest-exit-title" aria-describedby="quest-exit-note" onCancel={event => {event.preventDefault();onClose();}} onClick={event => {if (event.target === event.currentTarget) onClose();}}>
    <div className="sheet">
      <button type="button" className="sheet-close" onClick={onClose} aria-label={copy.keepPlaying}><X size={20} aria-hidden /></button>
      <p className="sheet-crumb">{title}</p>
      <h2 id="quest-exit-title" className="sheet-title">{copy.questOptions}</h2>
      <p id="quest-exit-note" className="t-body">{copy.questRestartNote}</p>
      <div className="quest-exit-actions">
        <button type="button" className="btn btn-primary btn-block" onClick={onRetry}><RotateCw size={20} aria-hidden />{copy.tryAgain}</button>
        <button type="button" className="btn btn-secondary btn-block" onClick={onExit}><ArrowLeft size={20} aria-hidden />{copy.backToQuests}</button>
      </div>
    </div>
  </dialog>;
}
