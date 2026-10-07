// world.js: Aethermoor to fly over. Chris's map (nine tiles, 5 m to a pixel, 23 km across) lies flat far below as the
// ground, the open sea runs on past its edges, a broken deck of cloud floats between, and big clouds drift at the
// ship's height. The sky is late afternoon with the sun low in the west. A wreck falling through the cloud deck tears
// a hole in it (tear), which closes again over a few seconds (update).
// The sky's look (its colours, the sun, how cloudy it is, the light) is a LOOK, kept in uniforms that every shader
// drawing it shares (setLook): the voyages keep DAY, the late afternoon exactly as it has always been; the title screen
// has a sunset of its own (title.js), with rays fanning out of the low sun.
import * as THREE from 'three';
import tile1 from '../../assets/map/tile-1.avif';
import tile2 from '../../assets/map/tile-2.avif';
import tile3 from '../../assets/map/tile-3.avif';
import tile4 from '../../assets/map/tile-4.avif';
import tile5 from '../../assets/map/tile-5.avif';
import tile6 from '../../assets/map/tile-6.avif';
import tile7 from '../../assets/map/tile-7.avif';
import tile8 from '../../assets/map/tile-8.avif';
import tile9 from '../../assets/map/tile-9.avif';

export const MAP = { w: 23040, h: 15360, px: 5 }; // metres; x runs east, z runs south, the map's centre at the origin
export const SUN = new THREE.Vector3(-0.55, 0.52, 0.25).normalize(); // (where the sun is: set by the look, setLook)
export const CLOUD_Y = 430, THINNING = 2400;

// The regions, a 12 x 8 grid over the map read off Chris's painting (names from the Magpie page)
const GRID = ['sssswwsppppp', 'sssswwhppppp', 'swwwwhhppppp', 'swwwwhhppkks', 'sggwwhhkkkks', 'sggwwfhkkkks', 'sswfffkkkkss', 'ssssssssssss'];
const NAMES = { s: 'The Open Sea', w: 'The Verdant Wilds', g: 'The Gloamwood', f: 'The Gloomfen', h: 'The Hearthsea', p: 'The Ironspire Peaks', k: 'The Sunscorch Wastes' };
// each region's name and the middle of its cells on the map (0 to 1 across and down), for the big map's labels
export const REGIONS = Object.entries(NAMES).filter(([k]) => k !== 's').map(([k, name]) => {
  let u = 0, v = 0, n = 0;
  GRID.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === k) { u += (c + 0.5) / 12; v += (r + 0.5) / 8; n++; } }));
  return { name, u: u / n, v: v / n };
});
export function regionAt(x, z) {
  const c = Math.floor((x / MAP.w + 0.5) * 12), r = Math.floor((z / MAP.h + 0.5) * 8);
  if (c < 0 || c > 11 || r < 0 || r > 7) return NAMES.s;
  return NAMES[GRID[r][c]];
}

// ---------- the look of the sky ----------
// A look: where the sun is; the sky's colours (overhead, halfway up, at the horizon, warm round the sun, the sun itself,
// and under the horizon); rays fanning out of the sun (0: none); the cloud deck's colours (lit, shaded, seen from
// under it) and the big clouds' (lit, shaded); how much cloud there is (0 as ever, more above 0); a tint on the ground
// (1: as Chris painted it); and the lights that go with it: the haze (its colour, where it starts and is thickest),
// the sun's light, the sky's (overhead and from the ground) and the sky's light on the brass. Lights and haze are
// written as colours are in CSS, and turned into the numbers the lights take once (look)
const lin = (hex) => new THREE.Color(hex).toArray();
const look = (o) => { for (const k of ['fog', 'light', 'hemiSky', 'hemiGround']) if (typeof o[k] === 'number') o[k] = lin(o[k]); return o; };
export const DAY = look({
  sun: [-0.55, 0.52, 0.25], zen: [0.13, 0.3, 0.66], mid: [0.36, 0.58, 0.88], hor: [0.84, 0.88, 0.93], warm: [1.0, 0.86, 0.66], sunCol: [1.0, 0.92, 0.75], below: [0.78, 0.84, 0.92], rays: 0,
  deckLit: [1.0, 0.97, 0.92], deckShade: [0.74, 0.77, 0.86], deckUnder: [0.62, 0.65, 0.72], puffLit: [1.06, 1.06, 1.06], puffShade: [0.82, 0.82, 0.82], cover: 0, ground: [1, 1, 1],
  fog: 0xc9d6e6, fogNear: 4000, fogFar: 34000, light: 0xfff0d6, lightI: 2.6, hemiSky: 0xc3dcff, hemiGround: 0x7c8a5c, hemiI: 0.75, env: 0.9,
});
// the title screen's sunset: the sun just over the horizon in the west-south-west, the sky burning orange into violet,
// the clouds peach and gold-edged, the ground in warm shadow
export const SUNSET = look({
  sun: [-0.69, 0.1, 0.32], zen: [0.1, 0.14, 0.34], mid: [0.55, 0.38, 0.5], hor: [1.0, 0.58, 0.32], warm: [1.0, 0.45, 0.18], sunCol: [1.0, 0.62, 0.32], below: [0.45, 0.32, 0.36], rays: 1,
  deckLit: [0.96, 0.52, 0.34], deckShade: [0.42, 0.27, 0.38], deckUnder: [0.3, 0.22, 0.3], puffLit: [1.08, 0.64, 0.46], puffShade: [0.42, 0.29, 0.4], cover: -0.06, ground: [0.72, 0.54, 0.5],
  fog: 0xb27a68, fogNear: 3000, fogFar: 30000, light: 0xffa060, lightI: 2.2, hemiSky: 0xffa888, hemiGround: 0x3a2a30, hemiI: 0.55, env: 0.6,
});
// and in the Maelstrom's skies: storm cloud rolling in over the sunset, darker and heavier
export const STORMY = look({
  sun: [-0.69, 0.1, 0.32], zen: [0.06, 0.06, 0.11], mid: [0.26, 0.2, 0.27], hor: [0.66, 0.36, 0.24], warm: [0.82, 0.32, 0.13], sunCol: [0.86, 0.42, 0.22], below: [0.26, 0.2, 0.24], rays: 0.45,
  deckLit: [0.17, 0.11, 0.11], deckShade: [0.045, 0.04, 0.06], deckUnder: [0.04, 0.035, 0.05], puffLit: [0.34, 0.21, 0.19], puffShade: [0.07, 0.06, 0.09], cover: 0.1, ground: [0.42, 0.35, 0.36],
  fog: 0x4a3440, fogNear: 2000, fogFar: 22000, light: 0xff7a44, lightI: 1.3, hemiSky: 0x8a6878, hemiGround: 0x201820, hemiI: 0.42, env: 0.35,
});
// a look part way from a to b (k: 0 to 1), written into `out` (made once, and kept)
export function mixLook(a, b, k, out = {}) {
  for (const key in a) {
    const x = a[key], y = b[key];
    if (typeof x === 'number') out[key] = x + (y - x) * k;
    else { const o = (out[key] ??= [0, 0, 0]); for (let i = 0; i < 3; i++) o[i] = x[i] + (y[i] - x[i]) * k; }
  }
  return out;
}
// the look's uniforms, shared by the sky, the cloud deck, the big clouds and the ground's cloud shadows
const V = (a) => new THREE.Vector3(...a);
const MOOD = {
  uZen: { value: V(DAY.zen) }, uMid: { value: V(DAY.mid) }, uHor: { value: V(DAY.hor) }, uWarm: { value: V(DAY.warm) }, uSunCol: { value: V(DAY.sunCol) }, uBelow: { value: V(DAY.below) },
  uRays: { value: 0 }, uDeckLit: { value: V(DAY.deckLit) }, uDeckShade: { value: V(DAY.deckShade) }, uDeckUnder: { value: V(DAY.deckUnder) },
  uPuffLit: { value: V(DAY.puffLit) }, uPuffShade: { value: V(DAY.puffShade) }, uCover: { value: 0 }, uDrift: { value: new THREE.Vector2() },
};
const SKY_GLSL = `
  uniform vec3 uZen; uniform vec3 uMid; uniform vec3 uHor; uniform vec3 uWarm;
  vec3 skyColor(vec3 d, vec3 sun) {
    float h = d.y, s = max(dot(normalize(vec3(d.x, max(d.y, 0.0), d.z)), sun), 0.0);
    vec3 c = mix(uHor, uMid, smoothstep(0.0, 0.22, h));
    c = mix(c, uZen, smoothstep(0.2, 0.9, h));
    c = mix(c, uWarm, pow(s, 5.0) * 0.55 * (1.0 - smoothstep(0.0, 0.5, h)));
    return c;
  }`;
export const HAZE = new THREE.Color(0xc9d6e6);

function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uSun: { value: SUN }, ...MOOD },
    vertexShader: 'varying vec3 vDir; void main() { vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }',
    // (the rays: a fan of light and shade round the sun, lowest near the horizon; worked out only when there are any)
    fragmentShader: `varying vec3 vDir; uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uBelow; uniform float uRays; ${SKY_GLSL}
      void main() { vec3 d = normalize(vDir); float s = max(dot(d, uSun), 0.0);
        vec3 c = skyColor(d, uSun) + uSunCol * (pow(s, 120.0) * 0.9 + smoothstep(0.9993, 0.9996, s) * 4.0);
        if (uRays > 0.0) {
          vec3 t1 = normalize(cross(uSun, vec3(0.0, 1.0, 0.0))), t2 = cross(t1, uSun);
          float ang = atan(dot(d, t2), dot(d, t1));
          float fan = (0.5 + 0.5 * sin(ang * 17.0 + sin(ang * 5.0) * 2.0)) * (0.5 + 0.5 * sin(ang * 7.0 - 1.3));
          c += uSunCol * fan * pow(s, 5.0) * (1.0 - smoothstep(-0.05, 0.45, d.y)) * uRays * 0.45;
        }
        c = mix(c, uBelow, smoothstep(0.0, -0.2, d.y));
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), mat);
  m.scale.setScalar(50000); m.frustumCulled = false; m.renderOrder = -10;
  return m;
}

// cloud shadows on the ground, and the deck of cloud itself, share one pattern so the shadows line up. The pattern
// (two layers of soft noise, each five octaves deep) is worked out once, on the graphics card, into a picture that
// repeats every 16 units (about 35 km), so each pixel of the ground and the deck reads it from the picture instead of
// working it out again: the deck and the ground used to work it out four times for every pixel, the biggest cost on a
// phone. The picture keeps 16 bits in two channels, so cloud edges stay smooth.
const CLOUD_P = 16, CLOUD_N = 1024, HOLES = 3;
// (uCover: more cloud above 0, the look's)
const CLOUD_GLSL = `
  uniform sampler2D uCloud; uniform float uCover;
  float cloudAt(vec2 uv) { return dot(texture2D(uCloud, uv).rg, vec2(255.0 * 256.0, 255.0) / 65535.0); }
  float cover(vec2 xz, float t) { vec2 p = xz * 0.00045 + vec2(t * 0.0022, t * 0.0009);
    return smoothstep(0.44 - uCover, 0.64 - uCover, cloudAt(p / ${CLOUD_P.toFixed(1)}) * 0.85 + cloudAt((p * 3.3 + 7.0) / ${CLOUD_P.toFixed(1)}) * 0.25); }`;
// the pattern itself: value noise, octaves 2.07 times finer each, on lattices that wrap round so the picture tiles
function makeCloudBake(renderer) {
  const target = new THREE.WebGLRenderTarget(CLOUD_N, CLOUD_N, { format: THREE.RGFormat, type: THREE.UnsignedByteType, depthBuffer: false,
    wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, magFilter: THREE.LinearFilter, minFilter: THREE.LinearMipmapLinearFilter, generateMipmaps: true });
  target.texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const cells = Array.from({ length: 5 }, (_, k) => Math.round(CLOUD_P * Math.pow(2.07, k)).toFixed(1));
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `varying vec2 vUv;
      // (shifted to a part of the lattice whose values spread evenly, so the sky is exactly as cloudy as before)
      float h2(vec2 p) { p += vec2(111.0, 113.0); vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      float n2(vec2 q, float n) { vec2 i = floor(q), f = fract(q); f = f * f * (3.0 - 2.0 * f);
        vec2 a = mod(i, n), b = mod(i + 1.0, n);
        return mix(mix(h2(a), h2(vec2(b.x, a.y)), f.x), mix(h2(vec2(a.x, b.y)), h2(b), f.x), f.y); }
      void main() {
        float N[5]; N[0] = ${cells[0]}; N[1] = ${cells[1]}; N[2] = ${cells[2]}; N[3] = ${cells[3]}; N[4] = ${cells[4]};
        float v = 0.0, a = 0.5;
        for (int k = 0; k < 5; k++) { v += a * n2(vUv * N[k] + 13.3 * float(k), N[k]); a *= 0.5; }
        float w = floor(clamp(v, 0.0, 1.0) * 65535.0 + 0.5), hi = floor(w / 256.0);
        gl_FragColor = vec4(hi / 255.0, (w - hi * 256.0) / 255.0, 0.0, 1.0);
      }`,
  }));
  quad.frustumCulled = false; scene.add(quad);
  // drawn at start-up, and again if the phone drops the drawing context (main.js)
  const bake = () => { const was = renderer.getRenderTarget(); renderer.setRenderTarget(target); renderer.render(scene, camera); renderer.setRenderTarget(was); };
  bake();
  return { target, texture: target.texture, bake };
}

function loadTexture(url, renderer) {
  return new Promise((res, rej) => new THREE.TextureLoader().load(url, (t) => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; res(t);
  }, undefined, rej));
}

export async function makeWorld(renderer) {
  const group = new THREE.Group();
  const time = { value: 0 };
  group.add(makeSky());

  // the map: nine tiles, each 7.68 x 5.12 km, painted colours kept as Chris painted them, with cloud shadows passing over
  const urls = [tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9];
  const textures = await Promise.all(urls.map((u) => loadTexture(u, renderer)));
  const tw = MAP.w / 3, th = MAP.h / 3;
  const clouds = makeCloudBake(renderer), uCloud = { value: clouds.texture };
  const shade = (mat) => {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = time; sh.uniforms.uSun = { value: SUN }; sh.uniforms.uCloud = uCloud; sh.uniforms.uCover = MOOD.uCover;
      sh.vertexShader = 'varying vec3 vWorld;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vWorld;\nuniform float uTime;\nuniform vec3 uSun;\n' + CLOUD_GLSL + '\n' + sh.fragmentShader.replace('#include <map_fragment>',
        '#include <map_fragment>\nvec2 sp = vWorld.xz - uSun.xz / uSun.y * ' + CLOUD_Y.toFixed(1) + ';\ndiffuseColor.rgb *= 1.0 - 0.38 * cover(sp, uTime);');
    };
    mat.customProgramCacheKey = () => 'ground-cloud-shadow-3';
    return mat;
  };
  const ground = []; // (their materials, tinted by the look)
  textures.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(tw, th).rotateX(-Math.PI / 2), shade(new THREE.MeshBasicMaterial({ map: t, toneMapped: false })));
    m.position.set(-MAP.w / 2 + tw * (col + 0.5), 0, -MAP.h / 2 + th * (row + 0.5));
    group.add(m); ground.push(m.material);
  });
  // the open sea past the map's edges, the same deep blue as its painted sea. It's drawn first and the map over it:
  // laid just under the map instead, the two would flicker where the far ground is too far off to tell them apart
  const SEA = new THREE.Color(0x0a3b80);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000).rotateX(-Math.PI / 2), shade(new THREE.MeshBasicMaterial({ color: SEA, toneMapped: false, depthWrite: false })));
  sea.renderOrder = -5; group.add(sea);

  // the deck of cloud: white and gold-edged from above, grey from beneath, gaps where the ground shows through, and the
  // holes torn by wrecks falling through it (x, z, how wide, how open: 0 is closed, and then it costs nothing)
  const holes = Array.from({ length: HOLES }, () => new THREE.Vector4(0, 0, 1, 0)), torn = holes.map(() => ({ r: 1, age: 9 }));
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
    uniforms: { uTime: time, uSun: { value: SUN }, uCloud, uHoles: { value: holes }, ...MOOD },
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `varying vec3 vW; uniform float uTime; uniform vec3 uSun; uniform vec4 uHoles[${HOLES}]; uniform vec3 uDeckLit; uniform vec3 uDeckShade; uniform vec3 uDeckUnder; ${SKY_GLSL} ${CLOUD_GLSL}
      void main() {
        float c = cover(vW.xz, uTime);
        for (int i = 0; i < ${HOLES}; i++) { vec4 h = uHoles[i]; if (h.w > 0.0) c *= 1.0 - h.w * (1.0 - smoothstep(h.z * 0.4, h.z, length(vW.xz - h.xy))); }
        float lit = cover(vW.xz + uSun.xz * 160.0, uTime);
        vec3 top = mix(uDeckLit, uDeckShade, lit * 0.6);
        vec3 under = uDeckUnder;
        vec3 col = cameraPosition.y > vW.y ? top : under;
        vec3 toCam = vW - cameraPosition; float d = length(toCam);
        vec3 haze = skyColor(normalize(vec3(toCam.x, 0.0, toCam.z)), uSun);
        float fade = smoothstep(9000.0, 38000.0, d);
        col = mix(col, haze, fade);
        gl_FragColor = vec4(col, c * 0.94 * (1.0 - fade * 0.25));
        #include <colorspace_fragment>
      }`,
  }));
  deck.position.y = CLOUD_Y; deck.renderOrder = 1; group.add(deck);

  // big drifting clouds at the ship's height, kept round the ship as it flies
  const puffs = makePuffs();
  group.add(puffs.mesh);

  // a hole torn in the deck at (x, z), `r` metres across at its widest: it opens in a moment, holds, and closes over
  // about five seconds (the oldest is reused for a fourth)
  function tear(x, z, r) {
    let k = 0;
    for (let i = 1; i < HOLES; i++) if (torn[i].age > torn[k].age) k = i;
    holes[k].set(x, z, r * 0.5, 0); torn[k].r = r; torn[k].age = 0;
  }
  function update(dt) {
    for (let i = 0; i < HOLES; i++) {
      const t = (torn[i].age += dt), h = holes[i];
      h.w = t < 0.25 ? t / 0.25 : Math.min(1, Math.max(0, 1 - (t - 1.5) / 5));
      h.z = torn[i].r * (0.5 + 0.5 * Math.min(1, t / 0.8));
    }
  }
  // a fresh voyage (or back to port): every hole closed at once, so none is left open from the last fight
  function clear() { for (let i = 0; i < HOLES; i++) { holes[i].w = 0; torn[i].age = 9; } }

  // the look (DAY, SUNSET or between): the sky, the clouds, the sun and the tint on the ground, and if they're given,
  // the lights and the haze (the sun's light, the sky's light, and the scene they're in)
  const tint = new THREE.Color(), now = mixLook(DAY, DAY, 0), back = {}; // (the look now, and one kept aside)
  function setLook(L, lights) {
    if (L !== now) mixLook(L, L, 0, now);
    SUN.set(L.sun[0], L.sun[1], L.sun[2]).normalize();
    for (const k of ['zen', 'mid', 'hor', 'warm', 'sunCol', 'below', 'deckLit', 'deckShade', 'deckUnder', 'puffLit', 'puffShade']) MOOD['u' + k[0].toUpperCase() + k.slice(1)].value.fromArray(L[k]);
    MOOD.uRays.value = L.rays; MOOD.uCover.value = L.cover;
    tint.fromArray(L.ground);
    for (const m of ground) m.color.copy(tint);
    sea.material.color.copy(SEA).multiply(tint);
    if (!lights) return;
    const { sun, hemi, scene } = lights;
    sun.color.fromArray(L.light); sun.intensity = L.lightI;
    hemi.color.fromArray(L.hemiSky); hemi.groundColor.fromArray(L.hemiGround); hemi.intensity = L.hemiI;
    scene.fog.color.fromArray(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
    scene.environmentIntensity = L.env;
  }
  // the sky's light on the brass in a look: a blurred picture of its sky (`size`: how fine), drawn once (and again if the
  // drawing context is lost). The sky is put back as it was
  const envScene = new THREE.Scene(); envScene.add(group.children[0].clone());
  function skyLight(L, size = 256) {
    mixLook(now, now, 0, back); setLook(L);
    const pmrem = new THREE.PMREMGenerator(renderer), t = pmrem.fromScene(envScene, 0.04, 1, 60000, { size }).texture;
    pmrem.dispose(); setLook(back);
    return t;
  }
  return { group, time, puffs, deck, clouds, tear, update, clear, holes, setLook, skyLight, mood: MOOD };
}

// A soft cumulus picture drawn once, and instanced billboards of it
function cloudTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 26; i++) {
    const x = 60 + rnd() * 136, y = 92 + rnd() * 90 - (i < 8 ? 30 : 0), r = 28 + rnd() * 44;
    const grd = g.createRadialGradient(x, y - r * 0.2, r * 0.1, x, y, r);
    const shade = 225 + Math.round(rnd() * 30);
    grd.addColorStop(0, `rgba(${shade},${shade},${Math.min(255, shade + 8)},0.85)`); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function makePuffs() {
  const N = 110, SPAN = 14000;
  const geo = new THREE.PlaneGeometry(1, 1);
  const offs = new Float32Array(N * 3), sizes = new Float32Array(N);
  let seed = 9; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < N; i++) { offs.set([rnd() * SPAN, 520 + rnd() * 1500, rnd() * SPAN], i * 3); sizes[i] = 260 + rnd() * 520; }
  geo.setAttribute('offset', new THREE.InstancedBufferAttribute(offs, 3));
  geo.setAttribute('size', new THREE.InstancedBufferAttribute(sizes, 1));
  const ig = new THREE.InstancedBufferGeometry().copy(geo); ig.instanceCount = N;
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, fog: false,
    uniforms: { uMap: { value: cloudTexture() }, uCenter: { value: new THREE.Vector3() }, uSpan: { value: SPAN }, uSun: { value: SUN }, uPuffLit: MOOD.uPuffLit, uPuffShade: MOOD.uPuffShade, uDrift: MOOD.uDrift },
    // (uDrift: how far the wind has carried them, on the title screen)
    vertexShader: `attribute vec3 offset; attribute float size; uniform vec3 uCenter; uniform float uSpan; uniform vec2 uDrift; varying vec2 vUv; varying float vFade;
      void main() {
        vec3 p = offset; p.xz = uCenter.xz + mod(offset.xz + uDrift - uCenter.xz + uSpan * 0.5, uSpan) - uSpan * 0.5;
        vec4 mv = viewMatrix * vec4(p, 1.0);
        mv.xy += position.xy * vec2(size * 1.6, size);
        float d = length(p.xz - uCenter.xz);
        vFade = 1.0 - smoothstep(uSpan * 0.32, uSpan * 0.5, d);
        vFade *= smoothstep(60.0, 260.0, -mv.z);
        vUv = uv; gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform sampler2D uMap; uniform vec3 uPuffLit; uniform vec3 uPuffShade; varying vec2 vUv; varying float vFade;
      void main() { vec4 c = texture2D(uMap, vUv); c.rgb *= mix(uPuffShade, uPuffLit, vUv.y); c.a *= vFade * 0.9; if (c.a < 0.01) discard; gl_FragColor = c;
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(ig, mat);
  mesh.frustumCulled = false; mesh.renderOrder = 2;
  // (fewer of them for the Settings card's Smooth or Balanced picture: count(n))
  return { mesh, N, follow: (p) => mat.uniforms.uCenter.value.copy(p), count: (n) => { ig.instanceCount = Math.max(0, Math.min(N, n)); } };
}
