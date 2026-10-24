import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const PAPER = "#FFF6E8";
const WHITE = "#FFFFFF";

/** Keep the document tint in sync with routes AND activity phase changes. */
export function useSafariThemeColor() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    let lastColor: string | undefined;

    function syncSurface() {
      const screen = document.querySelector<HTMLElement>("[data-browser-color]");
      const color = screen?.dataset.browserColor ?? (pathname.startsWith("/activity/") ? WHITE : PAPER);
      if (color === lastColor) return;
      lastColor = color;

      // Safari can retain the old document tint across client-side navigation.
      // Update the actual html/body surface as well as the legacy theme meta.
      root.style.setProperty("--browser-surface", color);
      if (color === WHITE) root.setAttribute("data-surface", "white");
      else root.removeAttribute("data-surface");
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = color;
    }

    syncSurface();
    // Intro, questions and results share one route. Observe their rendered
    // surface marker too, including when React reuses an existing main element.
    const observer = new MutationObserver(syncSurface);
    const app = document.getElementById("root");
    if (app) observer.observe(app, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-browser-color"] });
    const restore = () => { lastColor = undefined; syncSurface(); };
    window.addEventListener("pageshow", restore);
    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", restore);
    };
  }, [pathname]);
}
