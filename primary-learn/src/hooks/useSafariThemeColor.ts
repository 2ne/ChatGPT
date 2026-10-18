import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAPER = "#FFF6E8";
const WHITE = "#FFFFFF";

/** Safari chrome (status bar / toolbar) tints to the screen behind it. */
export function useSafariThemeColor() {
  const { pathname } = useLocation();

  useEffect(() => {
    const color = pathname.startsWith("/activity") ? WHITE : PAPER;
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas.length === 0) {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      meta.setAttribute("content", color);
      document.head.appendChild(meta);
      return;
    }
    metas.forEach((meta) => meta.setAttribute("content", color));
  }, [pathname]);
}
