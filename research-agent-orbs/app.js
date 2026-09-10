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

function buildWave(field) {
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const x = -24 + col * 8;
      const y = -24 + row * 8;
      const phase = col * .78 + row * .42;
      field.append(point({ x, y, z0: round(Math.sin(phase) * 9), z1: round(Math.sin(phase + 2.1) * 11), size: `${2.7 + ((row + col) % 3) * .35}px`, scale: round(.78 + row * .035), duration: `${2.4 + (col % 3) * .35}s`, delay: `${round((row + col) * -.11)}s`, 'opacity-low': round(.35 + row * .07), glow: round(.1 + row * .025) }));
    }
  }
}

function buildSphere(field) {
  for (let lat = 1; lat < 7; lat += 1) {
    const phi = Math.PI * lat / 7;
    for (let lon = 0; lon < 10; lon += 1) {
      const theta = Math.PI * 2 * lon / 10 + (lat % 2) * .22;
      const radius = 27;
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.cos(phi) * radius;
      const z = Math.sin(phi) * Math.sin(theta) * radius;
      field.append(point({ x: round(x), y: round(y), z: round(z), size: `${round(2.4 + (z + radius) / 60)}px`, scale: round(.7 + (z + radius) / 90), opacity: round(.42 + (z + radius) / 100), glow: round(.1 + (z + radius) / 150) }));
    }
  }
}

function buildVortex(field) {
  for (let index = 0; index < 62; index += 1) {
    const progress = index / 61;
    const angle = progress * Math.PI * 5.4;
    const radius = 4 + progress * 27;
    field.append(point({ x0: round(Math.cos(angle) * radius), y0: round(Math.sin(angle) * radius), z0: round((progress - .5) * 28), x1: round(Math.cos(angle + .5) * radius * .88), y1: round(Math.sin(angle + .5) * radius * .88), z1: round(Math.sin(angle * .45) * 15), size: `${round(2.3 + progress * 1.25)}px`, duration: `${round(2.5 + progress * 1.2)}s`, delay: `${round(-progress * 2.4)}s`, glow: round(.12 + progress * .18) }));
  }
}

function buildFold(field) {
  for (let plane = 0; plane < 2; plane += 1) {
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const x = -22 + col * 8.8;
        const y = -22 + row * 8.8;
        const base = plane === 0 ? -Math.abs(x) * .44 + 10 : Math.abs(y) * .44 - 10;
        field.append(point({ x, y, z0: round(base + Math.sin((row + col) * .7) * 3), z1: round(-base + Math.cos((row + col) * .62) * 4), size: plane === 0 ? '2.8px' : '2.4px', scale: plane === 0 ? 1 : .82, duration: `${2.8 + plane * .7}s`, delay: `${round(((plane === 0 ? x : y) + row) * -.035)}s`, opacity: plane === 0 ? .9 : .62, glow: .18 }));
      }
    }
  }
}

function buildPulse(field) {
  [6, 12, 18, 24, 29].forEach((radius, ringIndex) => {
    const count = 7 + ringIndex * 5;
    for (let index = 0; index < count; index += 1) {
      const angle = Math.PI * 2 * index / count;
      field.append(point({ x: round(Math.cos(angle) * radius), y: round(Math.sin(angle) * radius), z: 8 + ringIndex * 4, size: `${round(3.2 - ringIndex * .16)}px`, duration: '3.6s', delay: `${round(-ringIndex * .42 - index * .025)}s`, glow: round(.25 - ringIndex * .025) }));
    }
  });
}

function buildVolume(field) {
  for (let layer = 0; layer < 5; layer += 1) {
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        if ((row + col + layer) % 3 === 0 && layer !== 2) continue;
        const x = -20 + col * 10;
        const y = -20 + row * 10;
        const z = -20 + layer * 10;
        const distance = Math.sqrt(x*x + y*y + z*z);
        if (distance > 32) continue;
        field.append(point({ x, y, z, size: `${round(3.5 - distance * .025)}px`, scale: round(.72 + (z + 20) / 75), opacity: round(.38 + (z + 20) / 72), 'opacity-low': round(.25 + layer * .08), duration: `${2.1 + ((row + col) % 4) * .38}s`, delay: `${round(-(row + col + layer) * .14)}s`, glow: .17 }));
      }
    }
  }
}

const builders = { wave: buildWave, sphere: buildSphere, vortex: buildVortex, fold: buildFold, pulse: buildPulse, volume: buildVolume };
document.querySelectorAll('.pixel-orb').forEach((orb) => {
  const field = document.createElement('div');
  field.className = 'pixel-field';
  builders[orb.dataset.variant](field);
  orb.append(field);
});
