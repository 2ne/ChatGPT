import { useEffect, useRef, useState } from "react";
import type { ShapeAsset } from "../../types/shapes";
import { describeShape, isSolidShape } from "../../lib/shapes";
import { ShapeSvg } from "./ShapeSvg";

type SolidView = ReturnType<typeof import("../../lib/solidShapes").mountSolid>;

export function ShapePicture({ shape, interactive = false, compact = false }: { shape: ShapeAsset; interactive?: boolean; compact?: boolean }) {
  const frame = useRef<HTMLSpanElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<SolidView | null>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const [image, setImage] = useState<string>();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const solid = isSolidShape(shape);
  const key = JSON.stringify(shape);

  useEffect(() => {
    if (!frame.current || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)));
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let mounted: SolidView | undefined;
    setReady(false);
    setFailed(false);
    setImage(undefined);
    if (!solid || !visible) return;
    const asset: ShapeAsset = JSON.parse(key);
    import("../../lib/solidShapes").then((module) => {
      if (cancelled) return;
      if (interactive && host.current) {
        try {
          mounted = module.mountSolid(host.current, asset);
          view.current = mounted;
          setReady(true);
        } catch { setFailed(true); }
      } else {
        const snapshot = module.solidSnapshot(asset);
        setImage(snapshot);
        setFailed(!snapshot);
      }
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; mounted?.dispose(); view.current = null; };
  }, [key, solid, interactive, visible]);

  return (
    <span ref={frame} className={`shape-picture${compact ? " is-compact" : ""}`}>
      <span className="shape-art" role="img" aria-label={describeShape(shape)}>
        {!solid ? <ShapeSvg shape={shape} /> : null}
        {solid && !ready && !image ? <span className="shape-load-status" role={failed ? "alert" : "status"}>{failed ? "The shape could not load. Please reload this page." : "Loading shape."}</span> : null}
        {image ? <img src={image} alt="" draggable={false} /> : null}
        {solid && interactive ? (
          <div
            ref={host}
            className={`shape-canvas${ready ? " is-ready" : ""}`}
            tabIndex={ready ? 0 : undefined}
            role="img"
            aria-label={`${describeShape(shape)} Use arrow keys to rotate. Press Home to reset.`}
            onKeyDown={(event) => {
              const turns: Record<string, [number, number]> = {
                ArrowLeft: [0, -Math.PI / 6], ArrowRight: [0, Math.PI / 6],
                ArrowUp: [-Math.PI / 6, 0], ArrowDown: [Math.PI / 6, 0],
              };
              const turn = turns[event.key];
              if (turn) { event.preventDefault(); view.current?.rotate(...turn); }
              else if (event.key === "Home") { event.preventDefault(); view.current?.reset(); }
            }}
            onPointerDown={(event) => {
              if (!ready || (event.pointerType === "mouse" && event.button !== 0)) return;
              drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const previous = drag.current;
              if (!previous || previous.id !== event.pointerId) return;
              view.current?.rotate((event.clientY - previous.y) * 0.01, (event.clientX - previous.x) * 0.01);
              drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
            }}
            onPointerUp={() => { drag.current = null; }}
            onPointerCancel={() => { drag.current = null; }}
            onLostPointerCapture={() => { drag.current = null; }}
          />
        ) : null}
      </span>
    </span>
  );
}
