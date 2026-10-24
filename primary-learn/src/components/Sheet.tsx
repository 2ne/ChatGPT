import { useRef, type ReactNode } from "react";
import { Drawer } from "vaul";

export const SheetTitle = Drawer.Title;

/** Shared gesture-driven drawer. Keep mounted so closing can animate. */
export function Sheet({ open, onClose, children, className = "", descriptionId, onAfterClose }: {
  open: boolean; onClose: () => void; children: ReactNode; className?: string; descriptionId?: string; onAfterClose?: () => void;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return <Drawer.Root open={open} onOpenChange={next => {if (!next) onClose();}} onAnimationEnd={isOpen => { if (!isOpen) onAfterClose?.(); }} shouldScaleBackground={false} setBackgroundColorOnScale={false} autoFocus>
    <Drawer.Portal>
      <Drawer.Overlay className="app-drawer-overlay" />
      <Drawer.Content className={`sheet app-drawer ${className}`} aria-describedby={descriptionId}
        onOpenAutoFocus={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }}
        onCloseAutoFocus={event => { event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true }); }}>
        <Drawer.Handle className="app-drawer-handle" aria-label="Drag to close" />
        {children}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>;
}
