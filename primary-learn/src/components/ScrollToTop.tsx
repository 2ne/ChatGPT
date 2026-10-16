import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Jump to the top on every path change so headers and names stay in view. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
