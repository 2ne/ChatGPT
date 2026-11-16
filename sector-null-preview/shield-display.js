import * as THREE from 'three';
import './shield-display.css';

// Screen-space icons stay legible on phones without adding lights or draw calls.
export function createShieldDisplay() {
  const row = document.createElement('div');
  row.className = 'operator-shields';
  row.setAttribute('aria-hidden', 'true'); // The existing HUD supplies the accessible count.
  document.body.appendChild(row);
  const point = new THREE.Vector3();
  let slots = [], hp = null, hold = 0;
  const path = 'M3 2H17V9C17 14 10 18 10 18S3 14 3 9Z';
  function reset() {
    hp = null;
    hold = 0;
    slots.forEach(s => { s.time = 0; });
    row.hidden = true;
  }
  function sync(next, max, kind = 'spend') {
    const previous = hp ?? next;
    while (slots.length < max) {
      const el = document.createElement('span');
      el.innerHTML = `<svg viewBox="0 0 20 20"><path class="shield-shell" d="${path}"/><svg y="0" height="20" viewBox="0 0 20 20"><path class="shield-charge" d="${path}"/></svg><path class="shield-echo" d="${path}"/><path class="shield-crack" d="M11 3L8 8L12 10L9 16"/></svg>`;
      row.appendChild(el);
      slots.push({ el, fill: el.querySelector('svg svg'), time: 0, kind: '' });
    }
    while (slots.length > max) slots.pop().el.remove();
    if (hp === null || next !== previous) hold = 2.4;
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
    const charging = !!state.upgrades.regen && state.hp < state.maxHp;
    const progress = charging ? Math.min(1, safe / (state.upgrades.regen === 2 ? 8 : 12)) : 0;
    if (ticking) hold = Math.max(0, hold - dt);
    row.hidden = !shown || (!charging && hold <= 0);
    if (row.hidden) return;
    row.style.opacity = charging ? '1' : String(Math.min(1, hold / 0.4));
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
      const amount = i < hp ? 1 : i === hp ? progress : 0;
      // Nested SVG viewport crops the same shield from bottom to top.
      slot.fill.setAttribute('y', 20 * (1 - amount));
      slot.fill.setAttribute('height', 20 * amount);
      slot.fill.setAttribute('viewBox', `0 ${20 * (1 - amount)} 20 ${Math.max(0.001, 20 * amount)}`);
      slot.el.className = `${i < hp ? 'full' : 'empty'} ${charging && i === hp ? 'charging' : ''} ${slot.time > 0 ? slot.kind : ''}`;
      slot.el.style.setProperty('--echo', slot.time / 0.6);
    });
  }
  return { reset, sync, update };
}
