// Native wheel, touch and scrollbar behaviour, with position-aware edge fades.
export function enhanceScrollArea(element) {
  element.classList.add('game-scroll-area');
  let frame = 0;
  const update = () => {
    frame = 0;
    const overflow = Math.max(0, element.scrollHeight - element.clientHeight);
    const top = Math.max(0, Math.min(overflow, element.scrollTop));
    const visible = element.clientHeight > 0 && overflow > 1;
    element.style.setProperty('--fade-top', `${visible ? Math.min(24, top) : 0}px`);
    element.style.setProperty('--fade-bottom', `${visible ? Math.min(24, overflow - top) : 0}px`);
  };
  const refresh = () => { if (!frame) frame = requestAnimationFrame(update); };
  element.addEventListener('scroll', refresh, { passive: true });
  const resize = new ResizeObserver(refresh);
  resize.observe(element);
  const changes = new MutationObserver(refresh);
  changes.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  document.fonts.ready.then(refresh);
  refresh();
  return refresh;
}
