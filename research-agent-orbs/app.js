const root = document.documentElement;
const themeInputs = document.querySelectorAll('input[name="theme"]');
const motionButton = document.querySelector('.motion-button');
const motionLabel = document.querySelector('.motion-label');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let elapsed = 0;
let previousTime = null;
let frame = null;

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    root.dataset.theme = input.value;
    document.querySelector('meta[name="theme-color"]').content = input.value === 'dark' ? '#080b0a' : '#f3f5f2';
  });
});

// Staggered latitude rings retain the original lattice, without doubled poles.
const spheres = [...document.querySelectorAll('.pixel-orb')].map((orb) => {
  const field = document.createElement('div');
  field.className = 'pixel-field';
  const particles = [];
  for (let lat = 0; lat <= 11; lat += 1) {
    const phi = Math.PI * lat / 11;
    const count = Math.max(1, Math.round(Math.sin(phi) * 18));
    for (let lon = 0; lon < count; lon += 1) {
      const theta = Math.PI * 2 * lon / count + (lat % 2) * .11;
      const dot = document.createElement('span');
      dot.className = 'pixel';
      field.append(dot);
      particles.push({ dot, x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta), phi, theta });
    }
  }
  field.setAttribute('aria-hidden', 'true');
  orb.append(field);
  return particles;
});

function render(time) {
  // A continuous turn avoids the old stop-start rocking. Tilt changes slowly.
  const turn = time * .34 - .52;
  const tilt = -.24 + Math.sin(time * .29) * .09;
  const ct = Math.cos(turn), st = Math.sin(turn);
  const cx = Math.cos(tilt), sx = Math.sin(tilt);
  // One deliberate gathering gesture every 8 seconds: draw in, then ease out.
  // Quintic easing has zero velocity and acceleration at each join.
  const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const phase = time % 8;
  const contraction = phase < 4.8 ? 0
    : phase < 5.8 ? ease((phase - 4.8) / 1.0)
    : phase < 7.6 ? 1 - ease((phase - 5.8) / 1.8) : 0;
  const radius = 26.5 * (1 - contraction * .18);
  for (const particles of spheres) {
    for (const p of particles) {
      const x = p.x * ct + p.z * st;
      const rotatedZ = p.z * ct - p.x * st;
      const y = p.y * cx - rotatedZ * sx;
      const z = p.y * sx + rotatedZ * cx;
      const depth = (z + 1) / 2;
      const perspective = 180 / (180 - z * radius);
      // A soft travelling meridian, defined on the sphere rather than the screen.
      const scan = Math.pow((1 + Math.cos(p.theta - time * 1.65 + p.phi * .65)) / 2, 12);
      const size = (1.25 + depth * .85 + scan * .55) * perspective;
      p.dot.style.transform = `translate3d(${(x * radius * perspective).toFixed(3)}px, ${(y * radius * perspective).toFixed(3)}px, 0) scale(${size.toFixed(3)})`;
      // Solid colour, lit from above-left; rear dots remain opaque and darker.
      const light = Math.max(0, x * -.35 + y * -.45 + z * .82);
      const shade = Math.min(1, .12 + depth * .48 + light * .28 + scan * .12);
      p.dot.style.setProperty('--shade', `${(shade * 100).toFixed(2)}%`);
      p.dot.style.zIndex = String(Math.round(depth * 100));
    }
  }
}

function tick(timestamp) {
  frame = null;
  if (previousTime !== null) elapsed += Math.min((timestamp - previousTime) / 1000, .05);
  previousTime = timestamp;
  render(elapsed);
  frame = requestAnimationFrame(tick);
}

function syncMotion() {
  motionButton.setAttribute('aria-pressed', String(paused));
  motionLabel.textContent = paused ? 'Play motion' : 'Pause motion';
  root.dataset.motion = paused ? 'paused' : 'playing';
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  previousTime = null;
  if (!paused && !document.hidden) frame = requestAnimationFrame(tick);
}

motionButton.addEventListener('click', () => {
  paused = !paused;
  syncMotion();
});
reducedMotion.addEventListener('change', () => {
  paused = reducedMotion.matches;
  syncMotion();
});
document.addEventListener('visibilitychange', syncMotion);
render(0);
syncMotion();
