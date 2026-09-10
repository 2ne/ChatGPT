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
  const latitudeRings = 11;
  const longitudeDensity = 26;
  const radius = 26.5;

  for (let lat = 0; lat <= latitudeRings; lat += 1) {
    const phi = Math.PI * lat / latitudeRings;
    const latitudeRadius = Math.sin(phi);
    const longitudeCount = Math.max(1, Math.round(latitudeRadius * longitudeDensity));

    for (let lon = 0; lon < longitudeCount; lon += 1) {
      const theta = Math.PI * 2 * lon / longitudeCount + (lat % 2) * .11;
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.cos(phi) * radius;
      const z = Math.sin(phi) * Math.sin(theta) * radius;
      const depth = (z + radius) / (radius * 2);
      const scale = .68 + depth * .38;
      const scanPhase = -(theta / (Math.PI * 2)) * 2.1 - lat * .018;
      field.append(point({
        x: round(x), y: round(y), z: round(z),
        size: `${round(1.45 + depth * 1.15)}px`,
        scale: round(scale),
        'scale-low': round(scale * .78),
        'scale-mid': round(scale * 1.12),
        'scale-high': round(scale * 1.62),
        opacity: round(.5 + depth * .48),
        'opacity-low': round(.28 + depth * .42),
        'scan-delay': `${round(scanPhase)}s`
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
