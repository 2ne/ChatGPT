import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const PAPER = "#FFF6E8";
const WHITE = "#FFFFFF";

function applySurface(white: boolean) {
  const root = document.documentElement;
  if (white) root.setAttribute("data-surface", "white");
  else root.removeAttribute("data-surface");

  const color = white ? WHITE : PAPER;
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  if (metas.length === 0) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", color);
    document.head.appendChild(meta);
    return;
  }
  metas.forEach((meta) => meta.setAttribute("content", color));
}

/**
 * Safari chrome tints to the page behind it. Quest screens are white, so
 * html/body and theme-color must switch together before paint.
 */
export function useSafariThemeColor() {
  const { pathname } = useLocation();
  const white = pathname.startsWith("/activity");

  useLayoutEffect(() => {
    applySurface(white);
    return () => applySurface(false);
  }, [white]);
}
