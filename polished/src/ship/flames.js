// flames.js: real flames licking from a ship's worst wounds, for every ship in the sky in one batch (one draw). Each
// flame is a tongue of fire on a flat card that turns to face the camera round the upright only (so it always rises),
// flickering and swaying, streaming back along the ship as she flies, white-gold at its root and orange at its tips.
// The ship's scarred planks glow round it (dress.js), so it needs no light of its own. The game feeds it each frame
// (src/game/looks.js) from the scars of ships badly holed; the ships demo from a Wrecked ship's.
import * as THREE from 'three';
import { WTIME } from './dress.js';

// `max` flames at most (fewer on a phone)
export function makeFlames(max = 28) {
  const card = new THREE.PlaneGeometry(1, 1, 1, 4).translate(0, 0.5, 0), geo = new THREE.InstancedBufferGeometry();
  geo.setIndex(card.index); geo.setAttribute('position', card.attributes.position); geo.setAttribute('uv', card.attributes.uv);
  const pos = new Float32Array(max * 3), size = new Float32Array(max * 2), lean = new Float32Array(max * 3), seed = new Float32Array(max), heat = new Float32Array(max);
  const attrs = [['iPos', pos, 3], ['iSize', size, 2], ['iLean', lean, 3], ['iSeed', seed, 1], ['iHeat', heat, 1]].map(([name, a, n]) => {
    const at = new THREE.InstancedBufferAttribute(a, n).setUsage(THREE.DynamicDrawUsage); geo.setAttribute(name, at); return at;
  });
  geo.instanceCount = 0;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: WTIME }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
    vertexShader: `attribute vec3 iPos; attribute vec2 iSize; attribute vec3 iLean; attribute float iSeed; attribute float iHeat;
      uniform float uTime; varying vec2 vUv; varying float vSeed; varying float vHeat;
      void main() {
        vec3 up = vec3(0.0, 1.0, 0.0), right = normalize(cross(up, cameraPosition - iPos) + vec3(1e-5, 0.0, 0.0));
        float y = position.y, sway = sin(uTime * 7.0 + iSeed * 13.0 + y * 3.0) * 0.12 * y * y;
        vec3 w = iPos + right * (position.x * iSize.x * (1.0 - 0.6 * y) + sway * iSize.y) + up * y * iSize.y + iLean * y * y;
        vUv = uv; vSeed = iSeed; vHeat = iHeat;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: `uniform float uTime; varying vec2 vUv; varying float vSeed; varying float vHeat;
      float fH(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      float fN(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(fH(i), fH(i + vec2(1.0, 0.0)), f.x), mix(fH(i + vec2(0.0, 1.0)), fH(i + vec2(1.0, 1.0)), f.x), f.y); }
      void main() {
        float u = vUv.x, v = vUv.y;
        float n = fN(vUv * vec2(3.0, 5.0) - vec2(vSeed, 3.5 * uTime + vSeed)) * 0.65 + fN(vUv * vec2(7.0, 9.0) - vec2(vSeed * 1.7, 6.0 * uTime)) * 0.35;
        float shape = (1.0 - smoothstep(0.0, 0.5, abs(u - 0.5) * (1.2 + 1.5 * v) + 0.35 * n * v)) * (1.0 - smoothstep(0.55, 1.0, v + 0.3 * n)) * smoothstep(0.0, 0.1, v);
        if (shape < 0.01) discard;
        vec3 c = mix(vec3(1.0, 0.9, 0.55), vec3(1.0, 0.3, 0.05), clamp(v + 0.2 * n, 0.0, 1.0)) * vHeat;
        gl_FragColor = vec4(c * shape * 1.5, shape);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'flames'; mesh.frustumCulled = false; mesh.renderOrder = 3; mesh.visible = false;
  let n = 0;
  const tip = new THREE.Vector3();
  const api = {
    mesh, max, get count() { return n; },
    begin() { n = 0; },
    // a flame rooted at p (the world), w wide and h tall (metres), leaning by (lx, ly, lz) metres at its tip, its own
    // flicker (seed) and how hot (0 to 1); false when there's no room for more
    add(p, w, h, lx, ly, lz, s, k = 1) {
      if (n >= max) return false;
      pos[n * 3] = p.x; pos[n * 3 + 1] = p.y; pos[n * 3 + 2] = p.z; size[n * 2] = w; size[n * 2 + 1] = h;
      lean[n * 3] = lx; lean[n * 3 + 1] = ly; lean[n * 3 + 2] = lz; seed[n] = s; heat[n] = k; n++;
      return true;
    },
    // where flame i's tip is (for smoke from it), into out
    tip(i, out = tip) { return out.set(pos[i * 3] + lean[i * 3], pos[i * 3 + 1] + size[i * 2 + 1] + lean[i * 3 + 1], pos[i * 3 + 2] + lean[i * 3 + 2]); },
    // this frame's flames to the graphics card (only those there are)
    end() {
      geo.instanceCount = n; mesh.visible = n > 0;
      if (!n) return;
      for (const at of attrs) { const r = (at.userRange ??= { start: 0, count: 0 }); r.count = n * at.itemSize; at.updateRanges.length = 0; at.updateRanges.push(r); at.needsUpdate = true; }
    },
    clear() { n = 0; api.end(); },
  };
  return api;
}

// The flames of one ship (build.js's or raiders.js's, with her scars W from dress.js's makeWear): from her `count`
// worst scars (the biggest, then the hottest), each a quarter metre off her planks, sized to her, leaning back from
// `vel` (her velocity, m/s; or none). Returns how many were added. (Her open scars are put in order by hand into one
// list kept for good: nothing is made new each frame)
const _p = new THREE.Vector3(), order = [], worst = (a, b) => b.r - a.r || b.heat - a.heat;
export function shipFlames(flames, W, count, vel = null) {
  for (const s of W.scars) s.burning = false;
  W.firstFlame = flames.count;
  if (count <= 0) return 0;
  let n = 0;
  for (const s of W.scars) if (s.on && !s.patched && s.r > 0.05) {
    let i = n++;
    while (i > 0 && worst(s, order[i - 1]) < 0) { order[i] = order[i - 1]; i--; }
    order[i] = s;
  }
  const body = W.ship.body, L = W.ship.recipe.length, k = Math.min(1.8, Math.max(0.6, L / 25));
  let lx = 0, ly = 0, lz = 0;
  if (vel) { lx = -vel.x * 0.025; ly = -vel.y * 0.025; lz = -vel.z * 0.025; const m = Math.hypot(lx, ly, lz); if (m > 1.5) { lx *= 1.5 / m; ly *= 1.5 / m; lz *= 1.5 / m; } }
  let added = 0;
  for (let i = 0; i < n && i < count; i++) {
    const s = order[i];
    _p.set(s.x + s.nx * 0.25, s.y + s.ny * 0.25, s.z + s.nz * 0.25).applyMatrix4(body.matrixWorld);
    if (!flames.add(_p, 1.25 * k * (0.8 + 0.2 * s.r), 2.6 * k * (0.8 + 0.2 * s.r), lx, ly, lz, (s.x * 7.3 + s.z * 3.1) % 6.28, 1)) break;
    s.burning = true; added++;
  }
  return added;
}
