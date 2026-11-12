import { UPGRADE_CATS } from './upgrades.js';

export const CARD_FRAME_SVG =
  '<svg class="card-frame" viewBox="0 0 320 360" preserveAspectRatio="none" aria-hidden="true">' +
  '<path class="frame-edge" d="M16 1H304L319 16V344L304 359H16L1 344V16Z"/>' +
  '<path class="frame-inner" d="M18 6H302L314 18V342L302 354H18L6 342V18Z"/>' +
  '<path class="frame-rail" d="M16 1H304L313 10H150L145 14H4Z"/></svg>';

export function upgradeIconCanvas(u, owned, { label = false } = {}) {
  const aria = label
    ? ` aria-label="${u.name} rank ${owned + 1} 3D icon"`
    : ' aria-hidden="true"';
  return `<canvas class="icon-stage" width="512" height="320" data-id="${u.id}" data-cat="${u.cat}" data-owned="${owned}"${aria}></canvas>`;
}

export function upgradeCardPips(u, owned) {
  if (u.max === Infinity) return '';
  return Array.from({ length: u.max }, (_, k) =>
    `<i class="${k < owned ? 'own' : k === owned ? 'next' : ''}"></i>`
  ).join('');
}

/**
 * Card markup shared by the in-game picker and the 3D preview catalog.
 * `state` must be the simulated/live run state passed to u.stat(state).
 */
export function renderUpgradeCard({
  u,
  state,
  owned = state?.upgrades?.[u.id] || 0,
  recommended = false,
  slot = null,
  tag = 'button',
  attrs = '',
  extra = '',
  animationDelayMs = null,
  iconLabel = false,
} = {}) {
  const botUpgrade = u.id === 'bot' && owned > 0;
  const name = botUpgrade ? 'UPGRADE BOT' : u.name;
  const desc = botUpgrade ? 'Stronger companion shots' : u.desc;
  const [now, after] = u.stat(state);
  const pips = upgradeCardPips(u, owned);
  const top = recommended ? 'RECOMMENDED' : u.cat.toUpperCase();
  const key = slot == null ? '' : `<span class="ckey">${slot}</span>`;
  const delay = animationDelayMs == null ? '' : `;animation-delay:${animationDelayMs}ms`;
  const classes = `card upgrade-card${recommended ? ' recommended' : ''}`;
  return (
    `<${tag} class="${classes}" style="--accent:${UPGRADE_CATS[u.cat]}${delay}"${attrs}>` +
    CARD_FRAME_SVG +
    `<div class="ctop"><span>${top}</span>${key}</div>` +
    upgradeIconCanvas(u, owned, { label: iconLabel }) +
    `<div class="cname">${name}</div><div class="cdesc">${desc}</div>` +
    `<div class="cstat">${now} → <b>${after}</b></div>` +
    `<div class="clvl" aria-hidden="true">${pips}</div>` +
    extra +
    `</${tag}>`
  );
}
