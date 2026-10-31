import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Restore the pathway on return. Other pages start at the top. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const pathwayScroll = useRef(0);

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (pathname === "/onboarding") pathwayScroll.current = 0;
    const isPathway = pathname === "/pathway";
    window.scrollTo({ top: isPathway ? pathwayScroll.current : 0, left: 0, behavior: "instant" });

    if (!isPathway) return;
    const rememberPosition = () => {
      pathwayScroll.current = window.scrollY;
    };
    window.addEventListener("scroll", rememberPosition, { passive: true });
    return () => window.removeEventListener("scroll", rememberPosition);
  }, [pathname]);

  return null;
}
