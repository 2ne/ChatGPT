const root = document.documentElement;
const themeInputs = document.querySelectorAll('input[name="theme"]');
const motionButton = document.querySelector('.motion-button');
const motionLabel = document.querySelector('.motion-label');

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    root.dataset.theme = input.value;
    document.querySelector('meta[name="theme-color"]').content = input.value === 'dark' ? '#080c0a' : '#f4f6f3';
  });
});

motionButton.addEventListener('click', () => {
  const paused = motionButton.getAttribute('aria-pressed') !== 'true';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionLabel.textContent = paused ? 'Play motion' : 'Pause motion';
  root.dataset.motion = paused ? 'paused' : 'playing';
});

const constellation = document.querySelector('.constellation-field');
const stars = [
  [18, 31, 3, .64, 2.7, -.4], [31, 18, 2, .44, 3.1, -1.8], [51, 26, 4, .78, 2.4, -.7],
  [68, 14, 2, .48, 3.4, -2.2], [80, 32, 3, .72, 2.9, -1.1], [23, 54, 2, .51, 2.5, -1.5],
  [39, 45, 3, .72, 3.2, -.3], [63, 50, 2, .56, 2.8, -2.0], [76, 61, 4, .78, 3.5, -.9],
  [16, 73, 3, .6, 3.3, -1.7], [37, 69, 2, .47, 2.6, -.2], [54, 79, 3, .7, 3.0, -1.4],
  [72, 82, 2, .54, 2.3, -.8], [87, 47, 2, .5, 3.6, -1.9], [48, 58, 2, .5, 2.5, -.6]
];

stars.forEach(([x, y, size, alpha, speed, delay]) => {
  const dot = document.createElement('span');
  dot.className = 'constellation-dot';
  dot.style.cssText = `--x:${x}%;--y:${y}%;--size:${size}px;--alpha:${alpha};--speed:${speed}s;--delay:${delay}s`;
  constellation.append(dot);
});

const bars = document.querySelector('.spectrum-bars');
[34, 57, 76, 96, 72, 50, 84, 112, 82, 61, 42, 67, 93, 71, 48, 31].forEach((height, index) => {
  const bar = document.createElement('span');
  bar.className = 'spectrum-bar';
  bar.style.cssText = `--height:${height}px;--speed:${1.3 + (index % 5) * .22}s;--delay:${-index * .11}s`;
  bars.append(bar);
});
