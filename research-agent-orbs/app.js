const root = document.documentElement;
const themeInputs = document.querySelectorAll('input[name="theme"]');
const motionButton = document.querySelector('.motion-button');
const motionLabel = document.querySelector('.motion-label');

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    root.dataset.theme = input.value;
    document.querySelector('meta[name="theme-color"]').content = input.value === 'dark' ? '#080b0a' : '#f3f5f2';
  });
});

motionButton.addEventListener('click', () => {
  const paused = motionButton.getAttribute('aria-pressed') !== 'true';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionLabel.textContent = paused ? 'Play motion' : 'Pause motion';
  root.dataset.motion = paused ? 'paused' : 'playing';
});

const round = (value) => Math.round(value * 100) / 100;
const point = (styles) => {
  const dot = document.createElement('span');
  dot.className = 'pixel';
  dot.style.cssText = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';');
  return dot;
};

function buildSphere(field) {
  for (let lat = 1; lat < 7; lat += 1) {
    const phi = Math.PI * lat / 7;
    for (let lon = 0; lon < 10; lon += 1) {
      const theta = Math.PI * 2 * lon / 10 + (lat % 2) * .22;
      const radius = 27;
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.cos(phi) * radius;
      const z = Math.sin(phi) * Math.sin(theta) * radius;
      const depth = (z + radius) / (radius * 2);
      field.append(point({
        x: round(x), y: round(y), z: round(z),
        size: `${round(2.3 + depth * .9)}px`,
        scale: round(.72 + depth * .34),
        opacity: round(.54 + depth * .44),
        'opacity-low': round(.42 + depth * .34),
        glow: round(.08 + depth * .24),
        duration: `${round(2.4 + (lat % 3) * .45)}s`,
        delay: `${round(-(lat * .21 + lon * .08))}s`
      }));
    }
  }
}
document.querySelectorAll('.pixel-orb').forEach((orb) => {
  const field = document.createElement('div');
  field.className = 'pixel-field';
  buildSphere(field);
  orb.append(field);
});
