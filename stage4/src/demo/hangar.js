// hangar.js: the demo page. All six ships the Captain can sail (the Galleon and the Man-o'-war late in the game), one
// at a time or all together, above a sea of cloud at sunset with peaks breaking through, the way Chris's painting of
// the Brig shows it. Drag to turn round a ship,
// pinch to zoom; switch ships, views and the detail dial at the bottom, and how she looks after a fight: New, Battered
// (scorched holes in her planks, holes in her sails, a cluster of crystals dimmed and cracked) or Wrecked (holed all
// along, burning, her sails in rags and her crystals sputtering), drawn as the game draws them (src/ship/dress.js).
// And in whose colours (src/ship/livery.js): Yours, a Raider's, a raider Captain's or a Treasure ship's; with her
// wings spread (Sails set) or folded back (Sails in), and her guns: Ports shut, Guns out (the lids swing open bow first
// and the guns run out), or Fire! (both sides ripple off, bow to stern, each gun kicking back in, and run out again once
// they're loaded), as the game moves them.
import * as THREE from 'three';
import { loadShipArt } from '../ship/materials.js';
import { buildShip } from '../ship/build.js';
import { WTIME, makeWear, wearPreset, sputter, foldPoint } from '../ship/dress.js';
import { liveryArt, liveryOpts, wearLivery } from '../ship/livery.js';
import { RIPPLE } from '../ship/parts.js';
import { makeFlames, shipFlames } from '../ship/flames.js';
import { FLEET as SHIPS, STATS } from '../ships/index.js';

const $ = (id) => document.getElementById(id);
// what each of the raiders' colours means, for the card
const LIVERY_WORDS = {
  crew: 'A raider crew\'s colours: rust-red sails, darker planks and crimson pennants with a black hoist.',
  captain: 'A raider captain leads every fifth wave: black sails edged in crimson, blackened iron, crimson crystals, red eyes at her bow and a great swallow-tailed banner.',
  treasure: 'A treasure ship, laden with shards: wine-red sails edged in gold, gilded brass that glints, and chests of gold on her deck. She runs; shoot her sails to catch her.',
};
const SUN = new THREE.Vector3(-0.62, 0.16, -0.77).normalize();

// ---------- the sky: night blue overhead, gold and rose at the horizon, the low sun, a few stars ----------
// One sky colour for every direction, shared by the sky and by the far edge of the cloud sea, so they meet with no seam
const SKY_GLSL = `
  vec3 skyColor(vec3 d, vec3 sun) {
    float h = d.y, s = max(dot(normalize(vec3(d.x, max(d.y, 0.0), d.z)), sun), 0.0);
    vec3 zen = vec3(0.05, 0.07, 0.22), mid = vec3(0.27, 0.25, 0.53), low = vec3(0.93, 0.55, 0.47), hor = vec3(1.0, 0.74, 0.52);
    vec3 c = mix(hor, low, smoothstep(0.0, 0.08, h));
    c = mix(c, mid, smoothstep(0.06, 0.34, h));
    c = mix(c, zen, smoothstep(0.3, 0.95, h));
    c = mix(c, vec3(0.86, 0.6, 0.62), (1.0 - s) * (1.0 - smoothstep(0.0, 0.1, h)) * 0.6);
    c += vec3(1.0, 0.6, 0.3) * pow(s, 8.0) * 0.32 * (1.0 - smoothstep(0.1, 0.6, h));
    return c;
  }`;
function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uSun: { value: SUN } },
    vertexShader: 'varying vec3 vDir; void main() { vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }',
    fragmentShader: `varying vec3 vDir; uniform vec3 uSun; ${SKY_GLSL}
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      void main() {
        vec3 d = normalize(vDir); float s = max(dot(d, uSun), 0.0);
        vec3 c = skyColor(d, uSun);
        c += vec3(1.0, 0.8, 0.55) * pow(s, 90.0) * 0.7 + vec3(1.0, 0.93, 0.78) * smoothstep(0.9994, 0.9997, s) * 3.0;
        vec3 q = floor(d * 380.0); float st = step(0.9965, hash(q)) * smoothstep(0.3, 0.75, d.y);
        c += vec3(0.9, 0.9, 1.0) * st * 0.8;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), mat);
  m.scale.setScalar(30000); m.frustumCulled = false; m.renderOrder = -10;
  return m;
}

// ---------- the sea of cloud below: lit gold and rose towards the sun, lavender in its own shade ----------
function makeClouds() {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSun: { value: SUN } },
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `varying vec3 vW; uniform float uTime; uniform vec3 uSun; ${SKY_GLSL}
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return v; }
      void main() {
        vec2 p = vW.xz * 0.0042 + vec2(uTime * 0.004, uTime * 0.0015);
        float n = fbm(p), n2 = fbm(p * 3.1 + 5.0);
        float puff = smoothstep(0.28, 0.78, n * 0.75 + n2 * 0.35);
        float toward = fbm(p - uSun.xz * 0.035);
        float lit = clamp(0.55 + (n - toward) * 5.5, 0.0, 1.0);
        vec3 shade = vec3(0.37, 0.34, 0.6), sunlit = vec3(1.0, 0.82, 0.7), rim = vec3(1.0, 0.64, 0.5);
        vec3 c = mix(shade, sunlit, lit * 0.85 + 0.15 * puff);
        c = mix(c, rim, pow(lit, 6.0) * 0.35);
        c = mix(vec3(0.3, 0.27, 0.5), c, 0.45 + 0.55 * puff);
        vec3 toCam = vW - cameraPosition; float d = length(toCam.xz);
        vec3 haze = skyColor(normalize(vec3(toCam.x, 0.0, toCam.z)), uSun);
        c = mix(c, haze, smoothstep(300.0, 5000.0, d));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000, 1, 1).rotateX(-Math.PI / 2), mat);
  m.position.y = -70; m.frustumCulled = false;
  return m;
}

// ---------- peaks breaking through the clouds far off, snow on their tops ----------
function makePeaks() {
  const group = new THREE.Group();
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 });
  for (let i = 0; i < 34; i++) {
    const a = rnd() * Math.PI * 2, d = 1500 + rnd() * 3600, h = 200 + rnd() * 560, r = h * (0.32 + rnd() * 0.22);
    const g = new THREE.ConeGeometry(r, h, 9, 8);
    const p = g.attributes.position, col = [];
    for (let k = 0; k < p.count; k++) {
      const y = p.getY(k), t = (y + h / 2) / h;
      if (t < 0.99) {
        const j = 0.6 + rnd() * 0.8;
        p.setX(k, p.getX(k) * j); p.setZ(k, p.getZ(k) * (0.6 + rnd() * 0.8)); p.setY(k, y + (rnd() - 0.5) * h * 0.1);
      }
      const snow = t > 0.6 + rnd() * 0.15;
      col.push(...(snow ? [0.86, 0.84, 0.98] : [0.2 + t * 0.14, 0.19 + t * 0.12, 0.34 + t * 0.12]));
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.position.set(Math.cos(a) * d, -70 + h * 0.3, Math.sin(a) * d);
    m.rotation.y = rnd() * 6;
    group.add(m);
  }
  return group;
}

async function main() {
  const canvas = $('stage');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // (three.js no longer has the soft kind, and used this anyway)

  const scene = new THREE.Scene();
  const sky = makeSky(), clouds = makeClouds(), peaks = makePeaks();
  scene.add(sky, clouds, peaks);
  scene.fog = new THREE.Fog(0xd9958c, 900, 5200);

  // the sky itself lights the brass: reflections come from a blurred copy of it, drawn again if the phone drops the
  // drawing context (three.js puts everything else back by itself)
  const envScene = new THREE.Scene(); envScene.add(makeSky());
  const cl = makeClouds(); cl.position.y = -40; envScene.add(cl);
  const skyLight = () => { const pmrem = new THREE.PMREMGenerator(renderer), t = pmrem.fromScene(envScene, 0.04, 1, 4000).texture; pmrem.dispose(); return t; };
  scene.environment = skyLight();
  canvas.addEventListener('webglcontextrestored', () => { scene.environment = skyLight(); });
  scene.environmentIntensity = 0.85;

  const hemi = new THREE.HemisphereLight(0x8d9cff, 0xe39a7c, 0.55);
  const sun = new THREE.DirectionalLight(0xffc28a, 3.0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  const fill = new THREE.DirectionalLight(0x8f9cff, 0.55);
  scene.add(hemi, sun, sun.target, fill);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 70000);
  const art = await loadShipArt(renderer);

  // ships are built when first wanted, and kept in the Captain's colours. In a raider's colours only the colours shown
  // now are kept: picking other colours lets the ships built in the last ones go (their shapes freed from the graphics
  // card too), so a phone never holds more than two sets of six full ships (about 100,000 triangles each)
  const built = new Map(), arts = {};
  const getShip = (R, level, livery = 'yours') => {
    const key = R.id + ':' + level + ':' + livery;
    if (!built.has(key)) built.set(key, wearLivery(buildShip(R, level, arts[livery] ??= liveryArt(art, livery), liveryOpts(livery)), livery));
    return built.get(key);
  };
  function letGo(keep) {
    for (const [key, s] of built) {
      const livery = key.slice(key.lastIndexOf(':') + 1);
      if (livery === 'yours' || livery === keep) continue;
      s.root.removeFromParent();
      s.root.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      built.delete(key);
    }
  }

  const state = { ship: 'brig', level: 'full', view: 'turn', yaw: 0.9, pitch: 0.28, dist: 30, target: new THREE.Vector3(), aim: null, idle: 0, all: false, wear: 'new', livery: 'yours' };
  // her sails and guns, worked by hand: how far her wings fold (0 set, 1 in), her lids (0 shut .. 2 all open and the
  // guns run out), and a broadside waiting for the guns to be out (Fire! with the ports shut opens them first)
  const rig = { fold: 0, open: 0, fire: false, wantFold: 0, wantOpen: 0 };
  // the flames of a Wrecked ship (one draw for all of them), and her list towards her holed side
  const flames = makeFlames(40); scene.add(flames.mesh);
  const listed = { list: 0 };
  // each ship shown in the look chosen (New, Battered or Wrecked): her scars set out the same every time
  function scar(s) { s.wear ??= makeWear(s); s.burn = wearPreset(s.wear, state.wear); }
  const shown = [];
  const holder = new THREE.Group(); scene.add(holder);

  function frameFor(list) {
    const box = new THREE.Box3();
    for (const s of list) { s.root.updateMatrixWorld(true); box.expandByObject(s.root); }
    const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    return { c, size, r: Math.max(size.x, size.z, size.y) };
  }
  function show() {
    holder.clear(); shown.length = 0; letGo(state.livery);
    const list = state.all ? SHIPS : SHIPS.filter((R) => R.id === state.ship);
    let x = 0, y = 0;
    const tall = camera.aspect < 0.9;
    list.forEach((R, i) => {
      const s = getShip(R, state.level, state.livery);
      s.root.position.set(0, 0, 0);
      if (state.all && tall) {
        // on a tall screen, one above another, smallest at the bottom
        s.root.position.set(0, y, 0);
        y += R.length * 0.5 + 4;
      } else if (state.all) {
        // in echelon, smallest nearest, each a little higher and further back
        s.root.position.set(x, i * 2.5, -i * 7);
        x += 16 + R.length * 0.35;
      }
      holder.add(s.root); shown.push(s); scar(s);
    });
    updateCard(); updateTri(); // (first: the triangle count's line is in the buttons' dock, and sets how tall it is)
    framing(); setView(state.view, true);
  }
  // the view framed on what's shown: far enough back that the whole ship fits across the screen (which matters on a tall
  // phone), and up and down between the title and the buttons (fitHeight), as tall as they are with every line in them
  // filled; the sun's shadow over it. Done again if the fonts come in late and change how tall the buttons are
  let framedFor = null;
  function framing() {
    const f = frameFor(shown);
    state.target.copy(f.c);
    const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
    state.dist = Math.max(f.r * (state.all ? 1.35 : 1.25), (f.r * (state.all ? 0.66 : 0.56)) / Math.tan(hfov / 2));
    const fit = fitHeight(shown, state.target, state.dist);
    state.dist = fit.dist; state.middle = f.c; state.target.y -= fit.dy; // (and the middle of her box kept, for the checks)
    state.minDist = (state.all ? f.r * 0.25 : f.r * 0.35); state.maxDist = f.r * 3;
    framedFor = free();
    // the sun's shadow covers what is shown
    const r = f.r * 0.75;
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 6 });
    sun.shadow.camera.updateProjectionMatrix();
    sun.target.position.copy(f.c);
    sun.position.copy(f.c).addScaledVector(SUN.clone().setY(0.55).normalize(), r * 3);
    fill.position.copy(f.c).add(new THREE.Vector3(30, 20, 40));
  }

  // and far enough back that she shows whole up and down, from every side as she turns: her keel and ram tip above the
  // buttons at the bottom (on a phone held sideways they take half the height), her mast heads on the screen. Tried
  // with a sample of her own corners (about 4,000, spread over all her pieces), seen from a little above as she turns,
  // the view's middle being the middle of the room between the title and the buttons (room). Where she only fits looked
  // at a little lower down (her tall masts reaching up past the title's line, her hull clear of the buttons), the view
  // is turned that way (`dy`: how far down from the middle of her box, in metres) before she's moved further off. The
  // sample is kept for what's shown (the ships, their detail and colours, and how all six are laid out), as their shapes
  // never change: a tap on a ship, a detail level or colours shown before, or turning the phone, only looks again. The
  // nearest distance that fits is found by halves (the further off, the smaller she is)
  const samples = new Map();
  function fitHeight(list, c, dist) {
    const F = free(), lo = -((F.bottom - F.top) / F.h) * 0.99, hi = ((F.top + F.bottom) / F.h) * 0.99, t = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const key = `${list.map((s) => s.recipe.id).join()}|${state.level}|${state.livery}|${state.all && camera.aspect < 0.9}`;
    let pts = samples.get(key);
    if (!pts) { pts = sample(list, c); if (samples.size > 40) samples.clear(); samples.set(key, pts); }
    const p = Math.min(0.5, Math.max(0.2, state.pitch)), cp = Math.cos(p), sp = Math.sin(p);
    // (how far up and down the screen she reaches from every side, at distance D, looked at dy metres lower)
    const span = (D, dy) => {
      let a = Infinity, b = -Infinity;
      for (let k = 0; k < 16; k++) {
        const sy = Math.sin(k * Math.PI / 8), cy = Math.cos(k * Math.PI / 8);
        for (let i = 0; i < pts.length; i += 3) {
          const u = pts[i] * sy + pts[i + 2] * cy, y = pts[i + 1] + dy, z = D - u * cp - y * sp, ndc = (y * cp - u * sp) / (Math.max(z, 1e-3) * t);
          if (ndc < a) a = ndc; if (ndc > b) b = ndc;
        }
      }
      return [a, b];
    };
    // (at the n-th step further off, 4% a step: whether she fits, and looked at how much lower)
    const at = (n) => {
      const D = dist * Math.pow(1.04, n);
      let [a, b] = span(D, 0);
      if (a >= lo && b <= hi) return 0;
      if (b - a > hi - lo) return null;
      const dy = ((lo + hi) / 2 - (a + b) / 2) * D * t / cp;
      [a, b] = span(D, dy);
      return a >= lo && b <= hi ? dy : null;
    };
    let dy = at(0);
    if (dy !== null) return { dist, dy };
    let a = 0, b = 39, last = at(b);
    if (last === null) return { dist: dist * Math.pow(1.04, 40), dy: 0 };
    while (b - a > 1) { const m = (a + b) >> 1, r = at(m); if (r !== null) { b = m; last = r; } else a = m; }
    return { dist: dist * Math.pow(1.04, b), dy: last };
  }
  // (a sample of what's shown, its points from c: every so many of its own corners, and each piece's furthest corners)
  function sample(list, c) {
    const pts = [], v = new THREE.Vector3(), meshes = [];
    for (const s of list) s.body.traverse((o) => { if (o.isMesh && o.visible) meshes.push(o); });
    const step = Math.max(1, Math.ceil(meshes.reduce((n, o) => n + o.geometry.attributes.position.count, 0) / 4000));
    // (and each piece's furthest corners, low and high, every 45 degrees round her, and her lowest and highest: the
    // keel, the ram's tip and the mast heads are never missed by the sample)
    const far = new Float32Array(18), at = new Float32Array(54), cs = Array.from({ length: 8 }, (_, k) => [Math.cos(k * Math.PI / 4), Math.sin(k * Math.PI / 4)]);
    for (const o of meshes) {
      const P = o.geometry.attributes.position;
      far.fill(-Infinity);
      for (let i = 0; i < P.count; i++) {
        v.fromBufferAttribute(P, i).applyMatrix4(o.matrixWorld).sub(c);
        if (i % step === 0) pts.push(v.x, v.y, v.z);
        for (let k = 0; k < 18; k++) {
          const e = k < 16 ? v.x * cs[k >> 1][0] + v.z * cs[k >> 1][1] + (k & 1 ? 0.5 : -0.5) * v.y : k === 16 ? -v.y : v.y;
          if (e > far[k]) { far[k] = e; at[k * 3] = v.x; at[k * 3 + 1] = v.y; at[k * 3 + 2] = v.z; }
        }
      }
      for (let k = 0; k < 18; k++) if (far[k] > -Infinity) pts.push(at[k * 3], at[k * 3 + 1], at[k * 3 + 2]);
    }
    return new Float32Array(pts);
  }

  // ---------- the camera: drag round the ship, pinch or scroll to zoom; views snap it ----------
  const VIEWS = { turn: null, side: [Math.PI / 2, 0.04], front: [0, 0.06], back: [Math.PI, 0.1], top: [Math.PI / 2, 1.45], deck: [0.6, 0.55] };
  function setView(v, quiet) {
    state.view = v;
    for (const b of $('views').children) b.setAttribute('aria-pressed', String(b.dataset.view === v));
    if (VIEWS[v]) state.aim = { yaw: VIEWS[v][0], pitch: VIEWS[v][1], dist: v === 'deck' ? state.dist * 0.62 : state.dist };
    else state.aim = null;
    if (!quiet) state.idle = 0;
  }
  const pointers = new Map();
  let pinch = null;
  canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); state.idle = 0; state.aim = null; });
  canvas.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId); if (!p) return;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()], d0 = Math.hypot(a.x - b.x, a.y - b.y);
      p.x = e.clientX; p.y = e.clientY;
      const [c, d] = [...pointers.values()], d1 = Math.hypot(c.x - d.x, c.y - d.y);
      if (d0 > 0) state.dist = THREE.MathUtils.clamp(state.dist * d0 / d1, state.minDist, state.maxDist);
      return;
    }
    state.yaw -= (e.clientX - p.x) * 0.006; state.pitch = THREE.MathUtils.clamp(state.pitch + (e.clientY - p.y) * 0.004, -0.55, 1.5);
    p.x = e.clientX; p.y = e.clientY; state.idle = 0;
    if (state.view !== 'turn') setView('turn', true);
  });
  for (const ev of ['pointerup', 'pointercancel']) canvas.addEventListener(ev, (e) => pointers.delete(e.pointerId));
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); state.dist = THREE.MathUtils.clamp(state.dist * Math.exp(e.deltaY * 0.001), state.minDist, state.maxDist); state.idle = 0; }, { passive: false });

  // ---------- the buttons ----------
  const shipsEl = $('ships');
  for (const R of SHIPS) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.ship = R.id;
    b.innerHTML = `<b>${R.name}</b><small>${R.cls}</small>`;
    b.addEventListener('click', () => { state.all = false; state.ship = R.id; mark(); show(); });
    shipsEl.append(b);
  }
  const allB = document.createElement('button');
  allB.type = 'button'; allB.dataset.ship = 'all'; allB.innerHTML = '<b>All six</b><small>Together</small>';
  allB.addEventListener('click', () => { state.all = true; mark(); show(); });
  shipsEl.append(allB);
  function mark() { for (const b of shipsEl.children) b.setAttribute('aria-pressed', String(state.all ? b.dataset.ship === 'all' : b.dataset.ship === state.ship)); }
  for (const b of $('views').children) b.addEventListener('click', () => setView(b.dataset.view));
  for (const b of $('levels').children) b.addEventListener('click', () => {
    state.level = b.dataset.level;
    for (const x of $('levels').children) x.setAttribute('aria-pressed', String(x === b));
    show();
  });
  function setWear(w) {
    state.wear = w;
    for (const x of $('wear').children) x.setAttribute('aria-pressed', String(x.dataset.wear === w));
    for (const s of shown) scar(s);
  }
  for (const b of $('wear').children) b.addEventListener('click', () => setWear(b.dataset.wear));
  const press = (row, b) => { for (const x of $(row).children) x.setAttribute('aria-pressed', String(x === b)); };
  for (const b of $('livery').children) b.addEventListener('click', () => { state.livery = b.dataset.livery; press('livery', b); show(); });
  for (const b of $('sails').children) b.addEventListener('click', () => { rig.wantFold = +b.dataset.fold; press('sails', b); });
  for (const b of $('guns').children) b.addEventListener('click', () => {
    const g = b.dataset.guns;
    rig.wantOpen = g === 'shut' ? 0 : 2; if (g === 'fire') rig.fire = true;
    press('guns', g === 'fire' ? $('guns').children[1] : b);
  });
  // a broadside from every battery at once (the ripple and the reload as the game's: 2.6 s for a broadside, 1.1 s for
  // the bow and stern guns)
  function fire(time) {
    for (const s of shown) { s.U.uFire.value.setScalar(time); s.U.uReady.value.set(time + 2.6, time + 2.6, time + 1.1, time + 1.1); }
  }
  $('btn-card').addEventListener('click', () => {
    const open = $('card').hidden; $('card').hidden = !open; room();
    $('btn-card').textContent = open ? 'Hide stats' : 'Stats'; $('btn-card').setAttribute('aria-expanded', String(open));
  });
  function updateCard() {
    const R = SHIPS.find((s) => s.id === state.ship), St = STATS[R.id];
    if (state.all) {
      $('card-name').textContent = 'The fleet'; $('card-cls').textContent = SHIPS.map((S) => S.cls).join(' · ');
      $('card-blurb').textContent = 'The six ships the Captain moves up through, from the little Skiff to the Man-o\'-war, at the same scale.';
      $('card-stats').innerHTML = SHIPS.map((S) => `<dt>${S.name}</dt><dd>${S.cls}, ${S.length} m</dd>`).join('');
      return;
    }
    // (in a raider's colours she's no longer the Captain's ship, so she goes by what she is)
    const L = state.livery, who = { crew: `Raider ${R.cls}`, captain: `Raider captain's ${R.cls}`, treasure: `Treasure ${R.cls}` }[L];
    $('card-name').textContent = who ?? R.name; $('card-cls').textContent = `${R.cls} · ${R.length} m long`;
    $('card-blurb').textContent = LIVERY_WORDS[L] ?? St.blurb;
    const bar = (v) => `<span class="bar" style="width:${v * 5}px"></span>${v}`;
    $('card-stats').innerHTML = [
      ['Hull', St.hull.toLocaleString()], ['Sails', St.sails.toLocaleString()], ['Crystals', St.crystals.toLocaleString()], ['Crew', St.crew],
      ['Speed', bar(St.speed)], ['Turning', bar(St.turning)], ['Climbing', bar(St.climbing)],
      ['Guns', `${St.bow} bow · ${St.stern} stern · ${St.side} a side`],
    ].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  }
  function updateTri() {
    const tri = shown.reduce((n, s) => n + s.stats.triangles, 0), dc = shown.reduce((n, s) => n + s.stats.drawCalls, 0);
    const name = { full: 'Full detail', middle: 'Middle detail', far: 'Far detail' }[state.level];
    $('tri').textContent = `${name}: ${tri.toLocaleString()} triangles${state.all ? ' for all six' : ''} · ${dc} draw calls`;
  }

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // on a tall phone screen the ship needs more room across
    camera.fov = w < h ? 52 : 38;
    camera.updateProjectionMatrix();
    const scale = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const s of built.values()) s.glow.material.uniforms.uScale.value = scale;
    state.glowScale = scale;
    room();
  }
  // (the room between the title and the buttons, in pixels down the screen)
  function free() {
    const d = $('dock').getBoundingClientRect(), t = $('title').getBoundingClientRect(), h = innerHeight;
    return { top: t.height ? t.bottom : 0, bottom: d.height ? d.top : h, h };
  }
  // the ship framed in the sky between the title and the buttons at the bottom (three rows of them on a laptop), not
  // behind them: the view's middle moved up to the middle of that space. The stats card stops short of the buttons
  // (scrolling if it must, on a small phone held sideways)
  function room() {
    const { top, bottom, h } = free(), off = Math.max(0, Math.round(h / 2 - (top + bottom) / 2));
    if (off > 1) camera.setViewOffset(innerWidth, h, 0, off, innerWidth, h); else camera.clearViewOffset();
    const card = $('card'), room = Math.max(90, Math.floor(bottom - 8 - (parseFloat(getComputedStyle(card).top) || 0))) + 'px';
    if (card.style.maxHeight !== room) card.style.maxHeight = room;
  }
  // (the fonts in: the buttons may have grown, so the view is framed again if the room between them and the title changed)
  const refit = () => { room(); const F = free(); if (framedFor && (Math.abs(F.top - framedFor.top) > 0.5 || Math.abs(F.bottom - framedFor.bottom) > 0.5)) { framing(); setView(state.view, true); } };
  document.fonts?.ready.then(refit);
  addEventListener('resize', () => { resize(); show(); });

  // (on a phone, upright or sideways, the stats start folded away: Stats brings them out)
  if (innerWidth < 640 || innerHeight < 480) { $('card').hidden = true; $('btn-card').textContent = 'Stats'; $('btn-card').setAttribute('aria-expanded', 'false'); }
  // (the first view framed once the page's fonts are in, as they set how tall the buttons are: on a phone held sideways
  // they take half the height)
  void $('dock').offsetHeight; await document.fonts?.ready;
  resize(); mark(); show();
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now(), time = 0, roomT = 0, held = false;
  // each frame: the view eased, her sails and guns, her scars' fires, the clouds' clock, then drawn. (For the checks,
  // the page's own frames can be held, and the demo moved on and drawn only when asked: hold, step, draw)
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!held) { advance(dt); renderer.render(scene, camera); }
    requestAnimationFrame(frame);
  }
  function advance(dt) {
    time += dt;
    state.idle += dt;
    if ((roomT -= dt) <= 0) { roomT = 1; room(); } // (once a second: the buttons may have moved, or been hidden for pictures)
    if (state.view === 'turn' && state.idle > 2.5 && pointers.size === 0 && !calm) state.yaw += dt * 0.12;
    if (state.aim) {
      const k = 1 - Math.exp(-dt * 4);
      let dy = state.aim.yaw - state.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      state.yaw += dy * k; state.pitch += (state.aim.pitch - state.pitch) * k; state.dist += (state.aim.dist - state.dist) * k;
    }
    place();
    // her sails and guns, eased to what's asked (the lids open bow first; Fire! waits for the guns to be out)
    rig.fold += (rig.wantFold - rig.fold) * (1 - Math.exp(-dt * 2));
    rig.open = rig.wantOpen > rig.open ? Math.min(rig.wantOpen, rig.open + dt * 1.4) : Math.max(rig.wantOpen, rig.open - dt * 0.9);
    if (rig.fire && rig.open >= 2) { rig.fire = false; fire(time); }
    flames.begin();
    for (const s of shown) {
      s.U.uFold.value.x = rig.fold; s.U.uGun.value.set(rig.open, rig.open, 0, 0);
      // (a Wrecked ship lists, her crystals sputter and her worst holes burn)
      listed.list = s.wear.list; s.update(dt, listed);
      if (state.glowScale) s.glow.material.uniforms.uScale.value = state.glowScale;
      s.U.uSpark.value = state.wear === 'wrecked' ? sputter(time) : 1;
      s.root.updateMatrixWorld(true); shipFlames(flames, s.wear, s.burn);
    }
    flames.end();
    clouds.material.uniforms.uTime.value = time;
    WTIME.value = time;
    art.M.crystal.emissiveIntensity = 1.05 + Math.sin(time * 2.4) * 0.15;
  }
  // the camera where the view says, looking at the ship
  function place() {
    const cp = Math.cos(state.pitch);
    camera.position.set(Math.sin(state.yaw) * cp, Math.sin(state.pitch), Math.cos(state.yaw) * cp).multiplyScalar(state.dist).add(state.target);
    camera.lookAt(state.target); camera.updateMatrixWorld();
  }
  requestAnimationFrame(frame);
  document.body.classList.add('ready');

  // for the checks in tools/check.mjs
  window.__hangar = {
    ready: true, renderer, scene, camera, state,
    stats(id, level) { const R = SHIPS.find((s) => s.id === id); return getShip(R, level).stats; },
    select(id) { if (id === 'all') { state.all = true; } else { state.all = false; state.ship = id; } mark(); show(); },
    level(l) { state.level = l; for (const x of $('levels').children) x.setAttribute('aria-pressed', String(x.dataset.level === l)); show(); },
    view(v, yaw, pitch, dist) { setView(v); if (yaw != null) { state.aim = null; state.yaw = yaw; state.pitch = pitch; if (dist) state.dist = dist; } },
    // her scars: 'new', 'battered' or 'wrecked'; the ships shown; the flames burning
    wear: setWear, shown, flames,
    // her colours ('yours', 'crew', 'captain', 'treasure'); her sails and guns at once ({ fold: 0..1, open: 0..2, fire:
    // true fires every battery now }), and the clock they're read on
    livery(l) { state.livery = l; for (const x of $('livery').children) x.setAttribute('aria-pressed', String(x.dataset.livery === l)); show(); },
    rig(o) {
      if (o.fold != null) rig.fold = rig.wantFold = o.fold;
      if (o.open != null) rig.open = rig.wantOpen = o.open;
      for (const s of shown) { s.U.uFold.value.x = rig.fold; s.U.uGun.value.set(rig.open, rig.open, 0, 0); }
      if (o.fire) fire(WTIME.value);
      press('sails', $('sails').children[rig.wantFold >= 0.5 ? 1 : 0]); press('guns', $('guns').children[rig.wantOpen > 0 ? 1 : 0]);
    },
    get time() { return WTIME.value; }, ripple: RIPPLE, foldPoint,
    // the camera placed at once where the view says (without waiting for a frame), and the room between the title and
    // the buttons
    place, free,
    // the page's own frames held (or let go), the demo moved on by `seconds` in frames of `dt` without drawing, and
    // drawn once now: a software-drawn frame takes a second or more, so the checks draw only the frames they look at
    hold(on = true) { held = on; },
    step(seconds, dt = 0.05) { for (let t = 0; t < seconds - 1e-9; t += dt) advance(dt); },
    draw() { room(); place(); renderer.render(scene, camera); },
  };
}

main().catch((err) => {
  console.error(err);
  const e = $('error'); e.hidden = false; e.textContent = `The ships couldn't load: ${err.message}`;
});
