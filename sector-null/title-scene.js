import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const NOISE = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1)), u.x), u.y);
  }
  float cloud(vec2 p) {
    return noise(p) * .54 + noise(p * 2.1) * .28
      + noise(p * 4.4) * .13 + noise(p * 9.1) * .05;
  }
`;

const DECK_SHADER = {
  ...Reflector.ReflectorShader,
  name: 'WetDeck',
  vertexShader: Reflector.ReflectorShader.vertexShader
    .replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec3 vWorld;')
    .replace('void main() {', 'void main() { vWorld = (modelMatrix * vec4(position, 1.0)).xyz;'),
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec4 vUv;
    varying vec3 vWorld;
    ${NOISE}
    void main() {
      vec2 p = vWorld.xz;
      vec2 grid = p * vec2(.51, .71);
      vec2 edge = min(fract(grid), 1.0 - fract(grid));
      float seam = smoothstep(.004, .022, min(edge.x, edge.y));
      float grain = noise(p * 14.0);
      float wet = smoothstep(.28, .74, cloud(p * vec2(.86, 1.74)) * .84 + grain * .21);
      vec2 uv = vUv.xy / vUv.w;
      uv += vec2((noise(p * 3.0) - .5) * .013, (grain - .5) * .021) * (.55 + wet);
      vec3 mirror = texture2D(tDiffuse, uv).rgb;
      float plate = hash(floor(grid));
      float distant = smoothstep(3.0, 45.0, distance(vWorld, cameraPosition));
      vec3 base = vec3(.008, .017, .027) * (.55 + plate * .7 + grain * .25);
      vec3 reflected = mirror * mix(.17, 1.05, wet) * mix(.74, 1.0, distant);
      gl_FragColor = vec4((base + reflected) * mix(.22, 1.0, seam), 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};

function makeSky() {
  return new THREE.Mesh(new THREE.SphereGeometry(145, 28, 18), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { time: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vDirection;
      void main() {
        vDirection = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float time;
      varying vec3 vDirection;
      ${NOISE}
      void main() {
        vec3 d = normalize(vDirection);
        vec2 p = vec2(d.x, d.y) * 8.0 + vec2(time * .018, 0.0);
        float low = exp(-abs(d.y + .02) * 4.0);
        float mist = smoothstep(.29, .76, cloud(p + vec2(1.4, 2.3))) * low;
        float pink = exp(-length((d.xy - vec2(-.36, .19)) * vec2(3.4, 4.1)));
        float star = step(.9986, hash(floor(d.xy * 490.0))) * smoothstep(.04, .29, d.y);
        vec3 sky = vec3(.001, .006, .014) + low * vec3(.003, .016, .034);
        sky += mist * vec3(.007, .071, .119) + pink * mist * vec3(.25, .018, .115);
        sky += star * vec3(.047, .15, .23);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }
    `,
  }));
}

function makeTexture(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext('2d'));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeHazeTexture() {
  return makeTexture(256, 128, context => {
    for (let i = 0; i < 32; i++) {
      const x = 128 + Math.sin(i * 7.34) * 77;
      const y = 64 + Math.cos(i * 11.2) * 23;
      const radius = 19 + (i * 13 % 42);
      const fade = context.createRadialGradient(x, y, 0, x, y, radius);
      fade.addColorStop(0, 'rgba(255,255,255,.17)');
      fade.addColorStop(.55, 'rgba(255,255,255,.064)');
      fade.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = fade;
      context.fillRect(0, 0, 256, 128);
    }
  });
}

function makeBillboard() {
  return makeTexture(256, 400, c => {
    const fill = c.createLinearGradient(0, 0, 170, 400);
    fill.addColorStop(0, '#750354');
    fill.addColorStop(.57, '#131a4c');
    fill.addColorStop(1, '#074459');
    c.fillStyle = fill;
    c.fillRect(0, 0, 256, 400);
    c.strokeStyle = '#fc35ad';
    c.lineWidth = 5;
    c.strokeRect(3, 3, 250, 394);

    function shape(fill, stroke, points) {
      c.beginPath();
      points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
      c.closePath();
      c.fillStyle = fill;
      c.fill();
      c.strokeStyle = stroke;
      c.lineWidth = 2;
      c.stroke();
    }

    shape('#182751', '#0cf3ff', [[20, 333], [32, 263], [86, 223], [123, 225], [149, 248], [189, 269], [229, 329], [229, 350], [23, 350]]);
    shape('#261e50', '#e54fd4', [[79, 157], [90, 108], [125, 81], [168, 84], [198, 107], [215, 157], [202, 183], [207, 208], [166, 237], [119, 224], [109, 197]]);
    shape('#13213f', '#769aff', [[118, 117], [145, 96], [173, 101], [192, 126], [201, 164], [175, 177], [125, 159]]);
    shape('#ff30b3', '#ff9ae4', [[151, 150], [203, 154], [207, 165], [160, 168]]);
    shape('#293967', '#49d9f4', [[99, 258], [126, 250], [164, 274], [158, 299], [94, 281]]);
    c.fillStyle = '#ec7bd6';
    c.font = 'bold 15px monospace';
    c.fillText('OS / 07', 15, 29);
    c.fillText('SECURITY', 149, 29);
    c.fillStyle = '#71eaff';
    c.font = 'bold 14px monospace';
    c.fillText('ORBITAL SYSTEMS / NUL', 15, 378);
    for (let y = 5; y < 397; y += 4) {
      c.fillStyle = y % 16 === 1 ? '#02091e55' : '#06061c30';
      c.fillRect(5, y, 246, 1);
    }
  });
}

export function createTitleScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071828, .015);
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 190);
  const sky = makeSky();
  scene.add(sky);

  const standard = (color, metalness = .27) => new THREE.MeshStandardMaterial({ color, metalness, roughness: .62 });
  const neon = color => new THREE.MeshBasicMaterial({ color, toneMapped: false });
  const steel = standard(0x27394b);
  const dark = standard(0x142130);
  const trim = standard(0x3e5267);
  const black = standard(0x101520);
  const cyan = neon(0x37edff);
  const pink = neon(0xff2e91);
  const amber = neon(0xffad57);
  const ice = neon(0xb7faff);
  const brightPink = neon(0xffa6d3);
  const brightAmber = neon(0xffdf9c);
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const armour = new RoundedBoxGeometry(1, 1, 1, 2, .045);
  const batches = new Map();
  const transform = new THREE.Object3D();

  function box(material, x, y, z, w, h, d, angle = 0) {
    if (!batches.has(material)) batches.set(material, []);
    transform.position.set(x, y, z);
    transform.scale.set(w, h, d);
    transform.rotation.y = angle;
    transform.updateMatrix();
    batches.get(material).push(transform.matrix.clone());
  }

  function mesh(parent, geometry, material, x = 0, y = 0, z = 0) {
    const part = new THREE.Mesh(geometry, material);
    part.position.set(x, y, z);
    parent.add(part);
    return part;
  }

  function block(parent, material, x, y, z, w, h, d, geometry = cube) {
    const part = mesh(parent, geometry, material, x, y, z);
    part.scale.set(w, h, d);
    return part;
  }

  const floor = new Reflector(new THREE.PlaneGeometry(126, 116), {
    textureWidth: 704, textureHeight: 416, multisample: 0, clipBias: .002, shader: DECK_SHADER,
  });
  floor.position.set(0, -.04, -22);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const haloTexture = makeTexture(96, 96, c => {
    const gradient = c.createRadialGradient(48, 48, 0, 48, 48, 48);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(.17, 'rgba(255,255,255,.63)');
    gradient.addColorStop(.4, 'rgba(255,255,255,.18)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gradient;
    c.fillRect(0, 0, 96, 96);
  });
  const haloMaterials = new Map();
  function halo(parent, color, x, y, z, width, height, opacity) {
    const key = color + ':' + opacity;
    if (!haloMaterials.has(key)) {
      haloMaterials.set(key, new THREE.SpriteMaterial({
        map: haloTexture, color, opacity, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
      }));
    }
    const glow = new THREE.Sprite(haloMaterials.get(key));
    glow.position.set(x, y, z);
    glow.scale.set(width, height, 1);
    parent.add(glow);
  }
  const cyanHue = 0x0cceff, pinkHue = 0xff197c, amberHue = 0xff8122;

  function rail(z, start, end, height, spacing = 3.2, lit = false) {
    for (const y of [height, height * .54]) box(trim, (start + end) / 2, y, z, end - start, .09, .1);
    for (let x = start, i = 0; x <= end + .05; x += spacing, i++) {
      box(steel, x, height * .53, z, .15, height * 1.15, .16);
      if (!lit) continue;
      box(black, x, .32, z + .1, .33, .67, .32);
      const stripe = [pink, amber, pink, cyan][i % 4];
      const hue = [pinkHue, amberHue, pinkHue, cyanHue][i % 4];
      const center = Math.min(x + spacing * .43, end - .25);
      box(stripe, center, .09, z + .23, 1.12, .092, .09);
      box(stripe === pink ? brightPink : stripe === amber ? brightAmber : ice, center, .098, z + .284, .94, .038, .014);
      halo(scene, hue, center, .11, z + .32, 3.2, .82, .72);
    }
  }
  rail(-3.6, -29, 29, 1.04, 3.2, true);
  rail(-17.2, -31, 33, 3.65, 2.9);
  for (const [x, z, stripe, hue] of [[-8, 8.2, pink, pinkHue], [8.9, 5.1, cyan, cyanHue], [13.1, 2.8, pink, pinkHue]]) {
    box(black, x, .065, z, 2.42, .16, .33, .18);
    box(stripe, x, .116, z + .18, 2.17, .048, .04, .18);
    halo(scene, hue, x, .15, z + .2, 4.9, 1.3, .53);
  }

  // Station bulkheads, vents, cable trenches and service towers.
  for (let x = -35, i = 0; x <= 35; x += 4.4, i++) {
    const h = 5.8 + (i * 17 % 6) + (x > 7 ? 2.3 : 0);
    const z = -23.2 - (i % 4) * 1.65;
    box(dark, x, h * .5, z, 4.36, h, 4.1);
    box(steel, x, h - .23, z, 4.58, .46, 4.35);
    box(trim, x, h * .52, z + 2.1, 3.72, h * .51, .22);
    box(dark, x, h * .55, z + 2.25, 3.43, h * .48, .25);
    box(i % 3 ? pink : cyan, x, h * .74, z + 2.42, 2.75, .095, .1);
    box(i % 3 ? brightPink : ice, x, h * .74, z + 2.48, 2.43, .034, .028);
    halo(scene, i % 3 ? pinkHue : cyanHue, x, h * .74, z + 2.59, 5.2, 2.25, .35);
    for (let j = 0; j < 6; j++) box(steel, x, .62 + j * .22, z + 2.42, 1.84, .065, .19);
  }
  for (const [x, z, h, width] of [[-14.8, -18, 13, 3.45], [-22, -28, 16, 4.4], [13.5, -28, 21, 4.1], [26, -27, 15, 3.8], [-4, -42, 10, 5]]) {
    box(dark, x, h / 2, z, width, h, width * .86);
    box(steel, x, h * .9, z, width * 1.13, .38, width);
    for (const side of [-1, 1]) {
      box(trim, x + side * width * .45, h * .48, z + width * .45, .2, h * .96, .27);
      box(dark, x + side * width * .34, h + .98, z, .16, 2.8, .17);
      box(pink, x + side * width * .34, h + 2.43, z, .15, .14, .15);
      halo(scene, pinkHue, x + side * width * .34, h + 2.44, z, 1.4, 1.4, .7);
      for (let y = h * .45; y < h * .88; y += 1.4) {
        box(side < 0 ? cyan : pink, x + side * width * .37, y, z + width * .46, .08, .34, .09);
      }
    }
  }
  for (const x of [-11.5, 2.2, 17.4]) {
    box(black, x, .005, 4, .46, .025, 21);
    for (const side of [-1, 1]) box(trim, x + side * .23, .012, 4, .065, .035, 21);
    for (let z = -5; z < 15; z += .28) box(steel, x, .025, z, .39, .035, .05);
  }
  for (const [x, z, scale] of [[9.8, -1.8, 1.1], [12.4, 1.2, 1.2], [14.8, 2.4, .85], [-11, -1, .9]]) {
    box(dark, x, scale * .55, z, 1.75 * scale, 1.1 * scale, 1.38 * scale);
    box(trim, x, scale * 1.11, z, 1.83 * scale, .11 * scale, 1.4 * scale);
    box(black, x, scale * .59, z + .71 * scale, 1.34 * scale, .76 * scale, .12);
    box(cyan, x, scale * .87, z + .79 * scale, .77 * scale, .047, .055);
    halo(scene, cyanHue, x, scale * .86, z + .89 * scale, 2.4, .6, .43);
  }

  const board = mesh(scene, new THREE.PlaneGeometry(2.38, 3.72), new THREE.MeshBasicMaterial({
    map: makeBillboard(), toneMapped: false, side: THREE.DoubleSide,
  }), -14.25, 7.0, -16.27);
  board.rotation.y = .09;
  box(black, -14.25, 7, -16.42, 2.51, 3.91, .23, .09);
  halo(scene, pinkHue, -14.25, 7, -16.39, 5.7, 6.5, .27);
  const deckDisplay = board.clone();
  deckDisplay.position.set(-5.1, 8.1, -20.1);
  deckDisplay.scale.setScalar(.92);
  deckDisplay.rotation.y = -.11;
  scene.add(deckDisplay);
  box(black, -5.1, 8.1, -20.27, 2.32, 3.6, .19, -.11);
  box(dark, -5.1, 6.35, -20.7, 2.46, 12.7, 1.1);
  box(trim, -6.21, 6.35, -20.13, .12, 12.7, .16);
  box(dark, -5.1, 13.1, -20.4, .1, 1.15, .1);
  box(pink, -5.1, 13.69, -20.4, .14, .15, .16);
  halo(scene, pinkHue, -5.1, 13.69, -20.25, 1.9, 1.9, .65);
  const deckNumber = makeTexture(192, 128, c => {
    c.fillStyle = '#97c9e0';
    c.font = 'bold 106px monospace';
    c.textAlign = 'center';
    c.fillText('07', 96, 105);
  });
  mesh(scene, new THREE.PlaneGeometry(3.5, 2.33), new THREE.MeshBasicMaterial({
    map: deckNumber, transparent: true, opacity: .55, depthWrite: false,
  }), 20.1, 6.7, -18.56);

  // The two title cameras look across the same physical scene.
  const reactor = new THREE.Group();
  reactor.position.set(10.4, 0, -13);
  reactor.scale.y = 1.15;
  scene.add(reactor);
  function cylinder(radius, height, y, material, open = false) {
    return mesh(reactor, new THREE.CylinderGeometry(radius, radius, height, 48, 1, open), material, 0, y, 0);
  }
  function torus(radius, tube, y, material) {
    const ring = mesh(reactor, new THREE.TorusGeometry(radius, tube, 7, 88), material, 0, y, 0);
    ring.rotation.x = Math.PI / 2;
    return ring;
  }
  cylinder(2.95, 2.3, 1.15, dark);
  cylinder(3.15, .55, 2.42, steel);
  cylinder(2.94, .24, 2.72, cyan);
  cylinder(2.9, .37, 2.93, black);
  cylinder(2.62, 6.25, 6.2, new THREE.MeshPhysicalMaterial({
    color: 0x1b6782, transparent: true, opacity: .2, side: THREE.DoubleSide, roughness: .24,
    metalness: .22, depthWrite: false,
  }), true);
  cylinder(3.04, .7, 9.38, dark);
  cylinder(3.14, .22, 9.81, steel);
  cylinder(2.9, .28, 10.05, black);
  for (const y of [3.05, 8.97, 9.45, 9.9]) torus(y < 9 ? 2.67 : 3.04, .047, y, cyan);
  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI / 5;
    const x = Math.cos(a), z = Math.sin(a);
    block(reactor, black, x * 2.68, 6.19, z * 2.68, .16, 6.2, .2).rotation.y = -a;
    block(reactor, trim, x * 2.94, 1.25, z * 2.94, .19, 2.2, .17).rotation.y = -a;
    block(reactor, cyan, x * 3.05, 1.7, z * 3.05, .34, .115, .08).rotation.y = Math.PI / 2 - a;
  }
  const core = mesh(reactor, new THREE.IcosahedronGeometry(1.06, 3), new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        vec3 n = normalize(vNormal);
        float light = max(0.0, dot(n, normalize(vec3(-.55, .7, .5))));
        float rim = pow(1.0 - max(0.0, n.z), 2.4);
        gl_FragColor = vec4(mix(vec3(.003, .16, .28), vec3(.08, .92, 1.0), max(light, rim * .7)), 1.0);
        #include <colorspace_fragment>
      }
    `,
  }), 0, 6.06);
  const orbital = torus(1.9, .048, 6.06, cyan);
  const innerOrbit = torus(1.75, .015, 6.06, ice);
  const energy = mesh(reactor, new THREE.CylinderGeometry(.024, .05, 5.1, 8), amber, -.08, 5.7);
  energy.rotation.z = -.24;
  halo(reactor, cyanHue, 0, 5.95, .11, 8.8, 8.8, .61);
  halo(reactor, cyanHue, 0, 3.1, .85, 10.4, 5.1, .91);
  halo(reactor, cyanHue, 0, 9.86, .5, 10.2, 4.6, .52);

  const sparks = new THREE.BufferGeometry();
  const sparksPosition = new Float32Array(180 * 3);
  for (let i = 0; i < sparksPosition.length; i += 3) {
    const angle = i * 2.39996;
    const radius = .7 + (i * 17 % 43) * .043;
    sparksPosition[i] = Math.cos(angle) * radius;
    sparksPosition[i + 1] = 3.16 + (i * 13 % 101) * .036;
    sparksPosition[i + 2] = Math.sin(angle) * radius;
  }
  sparks.setAttribute('position', new THREE.BufferAttribute(sparksPosition, 3));
  reactor.add(new THREE.Points(sparks, new THREE.PointsMaterial({
    size: .085, map: haloTexture, transparent: true, color: 0x62f9ff,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  })));

  function drone(x, z, size, heading) {
    const robot = new THREE.Group();
    robot.position.set(x, 0, z);
    robot.scale.setScalar(size);
    robot.rotation.y = heading;
    scene.add(robot);
    block(robot, black, 0, 1.28, 0, .76, .28, .59);
    block(robot, steel, 0, 1.87, 0, .95, .92, .63, armour);
    block(robot, trim, 0, 1.97, -.36, .72, .73, .19, armour);
    block(robot, dark, 0, 2.41, 0, .37, .28, .41);
    const head = new THREE.Group();
    head.position.set(0, 2.83, 0);
    robot.add(head);
    block(head, steel, 0, 0, 0, .88, .73, .75, armour);
    block(head, trim, 0, .35, -.04, .75, .08, .59);
    block(head, black, 0, -.02, .38, .75, .46, .1);
    block(head, pink, .04, .02, .444, .6, .146, .054);
    block(head, brightPink, .04, .034, .474, .51, .059, .013);
    halo(head, pinkHue, .04, .03, .51, 1.34, .55, .63);
    for (const side of [-1, 1]) {
      const x = side * .26;
      block(robot, steel, x, .88, 0, .36, .57, .4);
      block(robot, black, x, .58, 0, .29, .19, .35);
      block(robot, trim, x, .33, .02, .37, .46, .39);
      block(robot, black, x, .105, .13, .42, .21, .64);
      const arm = new THREE.Group();
      arm.position.set(side * .61, 2.11, 0);
      arm.rotation.z = side * .12;
      robot.add(arm);
      block(arm, steel, 0, -.04, 0, .38, .44, .49, armour);
      block(arm, black, 0, -.35, 0, .25, .17, .28);
      block(arm, trim, 0, -.56, .04, .34, .35, .41, armour);
      block(arm, pink, side * .173, -.62, .045, .026, .06, .33);
      block(arm, black, 0, -.79, .04, .26, .16, .29);
    }
    return { robot, head, heading };
  }
  const patrol = [drone(-4.42, 5.35, 1.05, 1.01), drone(-4.9, -.2, .82, 1.45)];

  const hazeMap = makeHazeTexture();
  const clouds = [];
  for (let i = 0; i < 11; i++) {
    const mist = new THREE.Sprite(new THREE.SpriteMaterial({
      map: hazeMap, color: i === 2 ? 0x604073 : 0x298bb9, opacity: i < 6 ? .35 : .22,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    mist.position.set((i % 6 - 2.6) * 9.2, .9 + (i % 4) * .42, -8 - i * 1.45);
    mist.scale.set(19 + i % 3 * 6, 4.5 + i % 4 * .65, 1);
    scene.add(mist);
    clouds.push({ mist, x: mist.position.x });
  }

  for (const [material, matrices] of batches) {
    const batch = new THREE.InstancedMesh(cube, material, matrices.length);
    matrices.forEach((matrix, i) => batch.setMatrixAt(i, matrix));
    scene.add(batch);
  }

  scene.add(new THREE.HemisphereLight(0x7ca9e1, 0x68417a, 1.75));
  const key = new THREE.DirectionalLight(0x6bafff, 1.75);
  key.position.set(-12, 16, -9);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff379a, .72);
  rim.position.set(-15, 6, 9);
  scene.add(rim);
  const reactorLight = new THREE.PointLight(0x0bbfe9, 195, 26);
  reactorLight.position.set(10.4, 3.5, -10);
  scene.add(reactorLight);
  const foregroundLight = new THREE.PointLight(0xff2c9d, 19, 12);
  foregroundLight.position.set(-4.1, 2.8, 7.4);
  scene.add(foregroundLight);

  let menuMix = 0;
  return {
    render(renderer, time, dt, intro, aspect, reducedMotion) {
      menuMix = THREE.MathUtils.damp(menuMix, intro ? 0 : 1, 4, dt);
      if (reducedMotion) menuMix = intro ? 0 : 1;
      const t = reducedMotion ? 0 : time;
      const portrait = aspect < 1.15;
      camera.aspect = aspect;
      camera.fov = portrait ? 57 : 45;
      camera.updateProjectionMatrix();
      const x = 0.15 - menuMix * 1.4 + Math.sin(t * .25) * .16;
      camera.position.set(x, 2.56 + menuMix * .35, 14.35 + menuMix * .45);
      camera.lookAt(portrait ? 7.2 : menuMix * .65, 4.78 - menuMix * .32, -10);
      sky.position.copy(camera.position);
      sky.material.uniforms.time.value = t;
      core.rotation.set(t * .18, t * .31, .12);
      orbital.rotation.set(1.02 + Math.sin(t * .35) * .17, .66, -.32);
      innerOrbit.rotation.copy(orbital.rotation);
      reactorLight.intensity = 187 + Math.sin(t * 2.7) * 13;
      clouds.forEach(({ mist, x }, i) => { mist.position.x = x + Math.sin(t * .19 + i) * 2; });
      patrol.forEach(({ robot, head, heading }, i) => {
        robot.visible = menuMix < .72;
        robot.rotation.y = heading + Math.sin(t * .6 + i) * .12;
        head.rotation.y = Math.sin(t * .9 + i) * .16;
      });
      renderer.render(scene, camera);
    },
  };
}
