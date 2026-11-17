import * as THREE from 'three';
import './shield-display.css';

// Screen-space icons stay legible on phones without adding lights or draw calls.
export function createShieldDisplay(onBuild = () => {}) {
  const row = document.createElement('div');
  row.className = 'operator-shields';
  row.hidden = true;
  row.setAttribute('aria-hidden', 'true'); // The existing HUD supplies the accessible count.
  // Share the banner's stacking context: HUD is fixed and forms its own layer.
  // A body-level shield row would sit above that entire layer on desktop.
  document.getElementById('hud').appendChild(row);
  const point = new THREE.Vector3();
  let slots = [], hp = null, hold = 0, entranceDelay = 0.9;
  let openingBuild = true;
  const sounded = new Set();
  // Same six-point silhouette as the HUD shield-pip clip-path.
  const path = 'M10 0L20 3.6L18 13.6L10 20L2 13.6L0 3.6Z';
  function reset() {
    hp = null;
    hold = 0;
    entranceDelay = 0.9;
    openingBuild = true;
    sounded.clear();
    slots.forEach(s => { s.time = 0; });
    row.hidden = true;
  }
  function sync(next, max, kind = 'spend') {
    const previous = hp ?? next;
    while (slots.length < max) {
      const el = document.createElement('span');
      const index = slots.length;
      el.style.setProperty('--shield-order', index);
      // CSS dispatches this after each icon's stagger delay, keeping audio in
      // step with the visible reveal without timers surviving a restart.
      el.addEventListener('animationstart', e => {
        if (e.animationName !== 'operator-shield-enter' || !openingBuild || row.hidden || index >= hp || sounded.has(index)) return;
        sounded.add(index);
        onBuild(index);
      });
      el.innerHTML = `<svg viewBox="0 0 20 20" preserveAspectRatio="none"><path class="shield-shell" d="${path}"/><svg y="0" height="20" viewBox="0 0 20 20"><path class="shield-charge" d="${path}"/></svg><path class="shield-echo" d="${path}"/><path class="shield-crack" d="M11 3L8 8L12 10L9 16"/></svg>`;
      row.appendChild(el);
      slots.push({ el, fill: el.querySelector('svg svg'), time: 0, kind: '' });
    }
    while (slots.length > max) slots.pop().el.remove();
    // Opening: 0.9s delay + 1.3s reveal/hold/fade, before the title at 2.3s.
    // Later shield changes retain their longer feedback hold.
    if (hp === null) hold = 1.3;
    else if (next !== previous) { hold = 2.4; openingBuild = false; }
    slots.forEach((slot, i) => {
      if ((i >= previous && i < next) || (i >= next && i < previous)) {
        slot.kind = next > previous ? 'gain' : kind;
        slot.time = 0.6;
        hold = 2.4;
      }
    });
    hp = next;
  }
  function update(dt, state, safe, player, camera, shown, ticking) {
    sync(state.hp, state.maxHp);
    // Start the opening reveal only once gameplay is visible, not behind the title.
    if (shown && entranceDelay > 0) {
      entranceDelay = Math.max(0, entranceDelay - dt);
      row.hidden = true;
      return;
    }
    if (shown && ticking) hold = Math.max(0, hold - dt);
    row.hidden = !shown || hold <= 0;
    if (row.hidden) return;
    row.style.opacity = String(Math.min(1, hold / 0.4));
    point.copy(player.position);
    point.y += 2.65;
    point.project(camera);
    if (point.z < -1 || point.z > 1) { row.hidden = true; return; }
    const vv = window.visualViewport;
    const x = (point.x * 0.5 + 0.5) * (vv?.width || innerWidth) + (vv?.offsetLeft || 0);
    const y = (-point.y * 0.5 + 0.5) * (vv?.height || innerHeight) + (vv?.offsetTop || 0);
    row.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-100%)`;
    slots.forEach((slot, i) => {
      if (ticking) slot.time = Math.max(0, slot.time - dt);
      const amount = i < hp ? 1 : 0;
      // Nested SVG viewport crops the same shield from bottom to top.
      slot.fill.setAttribute('y', 20 * (1 - amount));
      slot.fill.setAttribute('height', 20 * amount);
      slot.fill.setAttribute('viewBox', `0 ${20 * (1 - amount)} 20 ${Math.max(0.001, 20 * amount)}`);
      slot.el.className = `${i < hp ? 'full' : 'empty'} ${slot.time > 0 ? slot.kind : ''}`;
      slot.el.style.setProperty('--echo', slot.time / 0.6);
    });
  }
  function dismiss() {
    openingBuild = false;
    hold = 0;
    row.hidden = true;
  }
  return { reset, sync, update, dismiss };
}
