/** Native-app feel on phones: no long-press menus except in text fields. */
export function installAppFeel() {
  if (typeof document === "undefined") return;

  document.addEventListener(
    "contextmenu",
    (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, [contenteditable]:not([contenteditable='false'])")) {
        return;
      }
      event.preventDefault();
    },
    { capture: true },
  );

  document.addEventListener(
    "dragstart",
    (event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement || target instanceof SVGElement) {
        event.preventDefault();
      }
    },
    { capture: true },
  );
}
