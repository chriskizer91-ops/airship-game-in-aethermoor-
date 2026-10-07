// dress.js: a ship's scars, worn on her own model, the same in the game and in the ships demo. Each ship has her own
// set of looks (makeLook: a few numbers her shaders read) and her own copies of the materials that show them (dress):
// her planks, deck, iron plates and brass bands; her sails; her crystals and their furnaces. The copies share the
// shaders three.js builds for them (each kind keeps one name for its shader), so a second ship of a class, or a sixth,
// costs no new shaders: only her own numbers. It's all drawn from those numbers on the graphics card, at every level of
// detail alike: no new triangles, no new draw calls.
//   the hull     a hit leaves a black hole with a ring of splintered pale wood and soot round it, glowing with embers
//                for a few seconds and then smouldering; the whole hull gets sooty and streaked as she weakens. Patched
//                (between waves), a hole becomes a square of fresh planks and its soot fades
//   the sails    a ragged hole where a shot went through, its edge scorched brown; patched, a darker square of new
//                canvas sewn on with a stitched edge. Torn sails fray from their free edges and flap harder
//   the crystals each cluster dims where it's hit and white cracks craze its crystals and darken its furnace windows;
//                failing, they all sputter together (and so do the ship's glows, sparks and lamps: build.js)
// Where a shot struck is put on the model here too (hullPoint, wingPoint): on the planks, or on the canvas itself.
// The game keeps each ship's scars up to date as she's hit, patched and sinks (src/game/looks.js); the ships demo
// shows them New, Battered or Wrecked (wearPreset).
import * as THREE from 'three';
import { clamp } from './kit.js';

// the clock every dressed ship's shaders read (seconds): one for all of them, set once a frame by the page
export const WTIME = { value: 0 };
// how many scars on a hull and holes in the sails each ship keeps (the worst kept when there are more), and clusters
export const SCARS = 6, HOLES = 6, CLUSTERS = 8;

// One ship's looks: what her shaders read
//   uScar   her hull's scars: where (her own frame) and how big (metres); negative once patched, 0 for none
//   uHeat   how hot each scar still is (embers), 0 to 1
//   uHole   her sails' holes: where and how big; negative once patched
//   uWear   x: soot and grime over the hull (0 to 1); y: how far her sails have frayed; z: how hard they flap (1 is a
//           sound sail); w: unused
//   uCrys   how bright each crystal cluster still is (1 whole, 0 dark); uCrack: how cracked (0 to 1)
//   uSpark  the sputter of failing crystals: 1 steady, lower as they gutter (the same for her glows and lamps)
export function makeLook() {
  return {
    uWTime: WTIME, uScar: { value: new Float32Array(SCARS * 4) }, uHeat: { value: new Float32Array(SCARS) }, uHole: { value: new Float32Array(HOLES * 4) },
    uWear: { value: new THREE.Vector4(0, 0, 1, 0) }, uCrys: { value: new Float32Array(CLUSTERS).fill(1) }, uCrack: { value: new Float32Array(CLUSTERS) }, uSpark: { value: 1 },
  };
}

// ---------- the shaders: pieces added to three.js's own ----------
// a smooth noise in 3D (with a hash that needs no sine, so it holds up on a phone's graphics)
const NOISE = `
float wH(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float wN(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wH(i), wH(i + vec3(1.0, 0.0, 0.0)), f.x), mix(wH(i + vec3(0.0, 1.0, 0.0)), wH(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(wH(i + vec3(0.0, 0.0, 1.0)), wH(i + vec3(1.0, 0.0, 1.0)), f.x), mix(wH(i + vec3(0.0, 1.0, 1.0)), wH(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }
`;
// the hull, deck, plates and bands. Each scar: soot out to about twice its size, a black hole in its middle ringed with
// pale splintered wood, embers glowing round it while it's hot. Patched: fresh planks in a square where the hole was,
// with dark seams and nail heads round it, and the soot faded. Soot is matte (and dulls brass)
const HULL_FRAG = `
  float wSoot = 0.0, wHole = 0.0, wRim = 0.0, wEmber = 0.0, wFresh = 0.0, wSeam = 0.0, wn = 0.5;
  if (uScar[0].w != 0.0 || uWear.x > 0.0) {
    wn = wN(vLocal * 2.3) * 0.65 + wN(vLocal * 6.1) * 0.35;
    for (int i = 0; i < ${SCARS}; i++) {
      vec4 s = uScar[i];
      if (s.w == 0.0) break;
      float r = abs(s.w), e = length(vLocal - s.xyz) / r, d = e + (wn - 0.5) * 0.9, h = e + (wn - 0.5) * 0.3;
      if (s.w > 0.0) {
        wSoot = max(wSoot, 1.0 - smoothstep(0.55, 2.1, d));
        wHole = max(wHole, 1.0 - smoothstep(0.3, 0.34, h));
        wRim = max(wRim, (1.0 - smoothstep(0.36, 0.46, h)) * smoothstep(0.3, 0.34, h));
        wEmber = max(wEmber, uHeat[i] * sqrt(uHeat[i]) * (1.0 - smoothstep(0.3, 1.0, d)));
      } else {
        vec3 q = abs(vLocal - s.xyz) / r;
        float b = max(q.x, max(q.y, q.z));
        wSoot = max(wSoot, 0.4 * (1.0 - smoothstep(0.5, 1.6, d)));
        wFresh = max(wFresh, 1.0 - smoothstep(0.4, 0.43, b));
        wSeam = max(wSeam, (1.0 - smoothstep(0.43, 0.47, b)) * smoothstep(0.37, 0.4, b));
      }
    }
    wSoot = max(wSoot, uWear.x * smoothstep(0.5, 0.85, wn));
    diffuseColor.rgb *= mix(1.0, 0.15, wSoot);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.4, 0.25, 0.11), wRim * 0.75);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.01, 0.007, 0.005), wHole);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.3, 0.16, 0.07) * (0.8 + 0.4 * wn) * (0.75 + 0.25 * step(0.1, fract(vLocal.y * 3.6 + vLocal.x * 3.6))), wFresh);
    diffuseColor.rgb *= 1.0 - 0.65 * wSeam;
  }`;
const HULL_ROUGH = `
  roughnessFactor = mix(roughnessFactor, 1.0, wSoot);
  metalnessFactor *= 1.0 - 0.85 * max(wSoot, wHole);`;
const HULL_GLOW = `
  totalEmissiveRadiance *= 1.0 - 0.9 * max(max(wSoot, wHole), wFresh);
  totalEmissiveRadiance += vec3(1.0, 0.22, 0.04) * wEmber * (0.65 + 0.35 * sin(uWTime * 9.0 + wn * 25.0)) * 1.4 * (1.0 - 0.6 * wHole);`;
// the sails: frayed from the free edge (vEdge 0 there) as they're torn, charred brown along the frays; each hole ragged
// and scorched round its edge; each patch a darker square of new canvas, laid in the sail's own plane, its edge stitched
const SAIL_FRAG = `
  float wChar = 0.0, wPatch = 0.0, wStitch = 0.0;
  float wn = wN(vLocal * 3.1) * 0.6 + wN(vLocal * 9.0) * 0.4;
  if (uWear.y > 0.0) {
    float fe = vEdge - uWear.y * (0.35 + 0.9 * wn);
    if (fe < 0.0) discard;
    wChar = 0.75 * (1.0 - smoothstep(0.0, 0.07, fe));
  }
  if (uHole[0].w != 0.0) {
    vec3 N = normalize(vLocalN), ax = normalize(cross(N, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.0, 1e-4)), ay = cross(N, ax);
    for (int i = 0; i < ${HOLES}; i++) {
      vec4 h = uHole[i];
      if (h.w == 0.0) break;
      vec3 q = vLocal - h.xyz;
      if (h.w > 0.0) {
        float d = length(q) / h.w + (wn - 0.5) * 0.8;
        if (d < 0.5) discard;
        wChar = max(wChar, 1.0 - smoothstep(0.5, 0.78, d));
      } else {
        float r = -h.w, px = dot(q, ax) / r, py = dot(q, ay) / r, b = max(abs(px), abs(py)), e = abs(px) > abs(py) ? py : px;
        if (abs(dot(q, N)) < r * 1.2) {
          wPatch = max(wPatch, 1.0 - smoothstep(0.6, 0.62, b));
          wStitch = max(wStitch, (1.0 - smoothstep(0.55, 0.57, b)) * smoothstep(0.5, 0.52, b) * step(0.5, fract(e * 7.0)));
          wChar = max(wChar, 0.35 * smoothstep(0.62, 0.66, b) * (1.0 - smoothstep(0.66, 0.9, b)));
        }
      }
    }
  }
  diffuseColor.rgb *= mix(1.0, 0.1, wChar);
  diffuseColor.rgb *= mix(vec3(1.0), vec3(0.72, 0.62, 0.48), wPatch);
  diffuseColor.rgb *= 1.0 - 0.7 * wStitch;`;
const SAIL_GLOW = `
  totalEmissiveRadiance *= (1.0 - wChar) * (1.0 - 0.45 * wPatch);`;
// the crystals: each cluster's own brightness and cracks (read in the vertex shader by the cluster's number, so the
// pixels need no lookups), dull and grey as they die; the slow pulse they always had, and white-violet cracks that
// flash as they sputter
const GEM_FRAG = `
  float wLine = (1.0 - smoothstep(0.0, 0.06, abs(wN(vLocal * 5.0) - 0.5))) * vCrack;
  diffuseColor.rgb = mix(vec3(dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11))) * vec3(0.3, 0.27, 0.38), diffuseColor.rgb, 0.2 + 0.8 * vCrys);
  diffuseColor.rgb *= 1.0 - 0.8 * wLine;
  totalEmissiveRadiance *= vCrys * uSpark * (1.0 - 0.85 * wLine) * (1.0 + 0.164 * sin(uWTime * 2.4));
  totalEmissiveRadiance += vec3(0.75, 0.55, 1.0) * wLine * (uSpark < 0.99 ? 1.8 : 0.7);`;
// the furnace windows under a cluster go dark with it
const PARTS_GLOW = `
  totalEmissiveRadiance *= mix(1.0, vCrys * uSpark, vClu);`;
// a cluster's numbers, read in the vertex shader from its rig ([5, which cluster])
const CLUSTER_VERT = `
  int wCi = clamp(int(rig.y + 0.5), 0, ${CLUSTERS - 1});
  vClu = rig.x > 4.5 ? 1.0 : 0.0;
  vCrys = rig.x > 4.5 ? uCrys[wCi] : 1.0;
  vCrack = rig.x > 4.5 ? uCrack[wCi] : 0.0;`;

const pre = (sh, vert, frag) => { sh.vertexShader = vert + sh.vertexShader; sh.fragmentShader = frag + sh.fragmentShader; };
const after = (src, chunk, add) => src.replace(`#include <${chunk}>`, `#include <${chunk}>\n${add}`);
// each kind's shader edits: plain functions, each reading its own material's ship (this.userData.U), so every copy
// gets its ship's numbers while sharing one shader
const DRESS = {
  hull: { key: 'hull-wear', compile(sh) {
    const U = this.userData.U;
    Object.assign(sh.uniforms, { uScar: U.uScar, uHeat: U.uHeat, uWear: U.uWear, uWTime: U.uWTime });
    pre(sh, 'varying vec3 vLocal;\n', `varying vec3 vLocal;\nuniform vec4 uScar[${SCARS}];\nuniform float uHeat[${SCARS}];\nuniform vec4 uWear;\nuniform float uWTime;\n${NOISE}`);
    sh.vertexShader = after(sh.vertexShader, 'begin_vertex', 'vLocal = position;');
    sh.fragmentShader = after(after(after(sh.fragmentShader, 'map_fragment', HULL_FRAG), 'metalnessmap_fragment', HULL_ROUGH), 'emissivemap_fragment', HULL_GLOW);
  } },
  sail: { key: 'sail-wear', compile(sh) {
    const U = this.userData.U;
    Object.assign(sh.uniforms, { uHole: U.uHole, uWear: U.uWear, uWTime: U.uWTime });
    pre(sh, 'attribute float billow;\nattribute vec4 rig;\nuniform float uWTime;\nuniform vec4 uWear;\nvarying vec3 vLocal;\nvarying vec3 vLocalN;\nvarying float vEdge;\n',
      `varying vec3 vLocal;\nvarying vec3 vLocalN;\nvarying float vEdge;\nuniform vec4 uHole[${HOLES}];\nuniform vec4 uWear;\n${NOISE}`);
    // (the ripple in the wind, harder as the sails are torn)
    sh.vertexShader = after(sh.vertexShader, 'begin_vertex', `vLocal = position; vLocalN = normal; vEdge = rig.w;
      transformed += normal * billow * uWear.z * (sin(uWTime * 2.3 + position.x * 0.9 + position.y * 0.6) * 0.05 + sin(uWTime * 3.7 + position.z * 1.3) * 0.025);`);
    sh.fragmentShader = after(after(sh.fragmentShader, 'map_fragment', SAIL_FRAG), 'emissivemap_fragment', SAIL_GLOW);
  } },
  gem: { key: 'gem-wear', compile(sh) {
    const U = this.userData.U;
    Object.assign(sh.uniforms, { uCrys: U.uCrys, uCrack: U.uCrack, uSpark: U.uSpark, uWTime: U.uWTime });
    pre(sh, `attribute vec4 rig;\nuniform float uCrys[${CLUSTERS}];\nuniform float uCrack[${CLUSTERS}];\nvarying vec3 vLocal;\nvarying float vCrys;\nvarying float vCrack;\nvarying float vClu;\n`,
      `varying vec3 vLocal;\nvarying float vCrys;\nvarying float vCrack;\nvarying float vClu;\nuniform float uSpark;\nuniform float uWTime;\n${NOISE}`);
    sh.vertexShader = after(sh.vertexShader, 'begin_vertex', 'vLocal = position;' + CLUSTER_VERT);
    sh.fragmentShader = after(sh.fragmentShader, 'emissivemap_fragment', GEM_FRAG);
  } },
  parts: { key: 'parts-wear', compile(sh) {
    const U = this.userData.U;
    Object.assign(sh.uniforms, { uCrys: U.uCrys, uCrack: U.uCrack, uSpark: U.uSpark });
    pre(sh, `attribute vec4 rig;\nuniform float uCrys[${CLUSTERS}];\nuniform float uCrack[${CLUSTERS}];\nvarying float vCrys;\nvarying float vCrack;\nvarying float vClu;\n`,
      'varying float vCrys;\nvarying float vCrack;\nvarying float vClu;\nuniform float uSpark;\n');
    sh.vertexShader = after(sh.vertexShader, 'begin_vertex', CLUSTER_VERT);
    sh.fragmentShader = after(sh.fragmentShader, 'emissivemap_fragment', PARTS_GLOW);
  } },
};
// which of a ship's materials (by her meshes' names) are dressed, and how
const KIND = { hull: 'hull', plates: 'hull', deck: 'hull', band: 'hull', canvas: 'sail', gem: 'gem', parts: 'parts' };
const RIGGED = new Set(['sail', 'gem', 'parts']);
const keys = {}; for (const k in DRESS) keys[k] = () => DRESS[k].key;

// Dress a ship's bodies (her middle and far models share one set) in her own copies of the materials M, reading her
// looks U. Each mesh is matched by its name (its material's); the rest keep the shared materials
export function dress(bodies, M, U) {
  const made = {};
  for (const body of [].concat(bodies)) body.traverse((o) => {
    const kind = o.isMesh && KIND[o.name];
    if (!kind || !M[o.name]) return;
    o.material = made[o.name] ??= wear(M[o.name], kind, U);
    // (a piece made without a rig, such as the rudder's painted board, reads it as all zeros: nothing in particular)
    if (RIGGED.has(kind) && !o.geometry.attributes.rig) o.geometry.setAttribute('rig', new THREE.Float32BufferAttribute(new Float32Array(o.geometry.attributes.position.count * 4), 4));
  });
  return made;
}
function wear(base, kind, U) {
  const m = base.clone();
  m.userData.U = U; // (after the copy: a copy's userData goes through JSON)
  if (kind === 'gem') m.emissiveIntensity = 0.55; // (it pulses in the shader now)
  m.onBeforeCompile = DRESS[kind].compile; m.customProgramCacheKey = keys[kind];
  return m;
}

// ---------- where a shot struck, on the model ----------
// how far out from the middle the hull is at height y, station z (the section's own curve, without its slight lean)
function sectionHalf(hull, z, y) {
  const w = hull.wale(z);
  if (y >= w) return hull.half(z);
  const s = clamp((w - y) / hull.bowlD(z), 0, 1), p = hull.R.hull.fullness ?? 0.75;
  return hull.half(z) * Math.cos(Math.asin(Math.pow(s, 1 / p)));
}
const inside = (hull, x, y, z) => z > hull.zs && z < hull.zb && y > hull.keel(z) && y < hull.deckY(z) && Math.abs(x) <= sectionHalf(hull, z, y);
const _a = new THREE.Vector3(), _b = new THREE.Vector3();
// A shot that struck the hull: from p (the ship's own frame: where it came into her hull's outline, which reaches a
// little past her planks, up to her rail), flying along d, on to her planks or her deck. The point into `out`, the way
// the surface faces into `n`
export function hullPoint(hull, p, d, out, n) {
  // (back along its path a little, then on through her, until it's inside her planks; then halved down to the surface)
  let prev = -1.2, hit = null;
  for (let s = -1.2; s <= 8; s += 0.1) {
    _a.copy(p).addScaledVector(d, s);
    if (inside(hull, _a.x, _a.y, _a.z)) { hit = s; break; }
    prev = s;
  }
  if (hit === null) {
    // it passed through her rail or ram without meeting her planks: put it on her deck edge, or leave it where it was
    const z = clamp(p.z, hull.zs + 0.05, hull.zb - 0.05);
    if (p.z > hull.zb || p.z < hull.zs) { out.copy(p); n.copy(d).negate(); return out; }
    const y = hull.deckY(z), x = Math.sign(p.x || 1) * Math.min(Math.abs(p.x), hull.deckHalf(z) * 0.98);
    out.set(x, y, z); n.set(0, 1, 0);
    return out;
  }
  let a = prev, b = hit;
  for (let i = 0; i < 6; i++) { const m = (a + b) / 2; _a.copy(p).addScaledVector(d, m); if (inside(hull, _a.x, _a.y, _a.z)) b = m; else a = m; }
  out.copy(p).addScaledVector(d, b);
  const z = out.z;
  if (out.y > hull.deckY(z) - 0.12 && d.y < 0) { out.y = hull.deckY(z); n.set(0, 1, 0); return out; } // (on the deck, from above)
  const side = out.x >= 0 ? 1 : -1, t = hull.tAt(z, clamp(out.y, hull.keel(z), hull.rim(z))), q = hull.at(z, t, side);
  out.set(q[0], q[1], z); n.copy(hull.normal(z, t, side));
  return out;
}
// A shot through the sails, from p along d (the ship's own frame): where it goes through the canvas, into `out` (the
// canvas bellies, so it's put on the bellied sail where it crossed the flat one), or on the nearest wing if it only
// grazed the rigging. Returns that wing
export function wingPoint(wings, p, d, out) {
  let best = null, bt = Infinity, bw = [0, 0, 0];
  for (const w of wings) {
    const e1 = _a.copy(w.B).sub(w.A), e2 = _b.copy(w.C).sub(w.A);
    // (the line through the triangle: Moller and Trumbore's way, along it both ways a little)
    const px = d.y * e2.z - d.z * e2.y, py = d.z * e2.x - d.x * e2.z, pz = d.x * e2.y - d.y * e2.x, det = e1.x * px + e1.y * py + e1.z * pz;
    if (Math.abs(det) < 1e-9) continue;
    const tx = p.x - w.A.x, ty = p.y - w.A.y, tz = p.z - w.A.z, u = (tx * px + ty * py + tz * pz) / det;
    if (u < 0 || u > 1) continue;
    const qx = ty * e1.z - tz * e1.y, qy = tz * e1.x - tx * e1.z, qz = tx * e1.y - ty * e1.x, v = (d.x * qx + d.y * qy + d.z * qz) / det;
    if (v < 0 || u + v > 1) continue;
    const t = (e2.x * qx + e2.y * qy + e2.z * qz) / det;
    if (t > -3 && Math.abs(t) < bt) { bt = Math.abs(t); best = w; bw = [1 - u - v, u, v]; }
  }
  if (!best) {
    // the nearest wing, by its middle, and the nearest corner weights on it
    let bd = Infinity;
    for (const w of wings) {
      const c = _a.copy(w.A).add(w.B).add(w.C).divideScalar(3), dd = c.distanceToSquared(p);
      if (dd < bd) { bd = dd; best = w; }
    }
    if (!best) return null;
    const tri = new THREE.Triangle(best.A, best.B, best.C), q = tri.closestPointToPoint(p, _b), bc = tri.getBarycoord(q, _a);
    bw = [bc.x, bc.y, bc.z];
  }
  sailPoint(best, bw[0], bw[1], bw[2], out);
  return best;
}
// the point on a wing sail with corner weights a, b, c, bellied as parts.js bellies it
export function sailPoint(w, a, b, c, out) {
  const bw = Math.max(0, 27 * a * b * c);
  return out.set(0, 0, 0).addScaledVector(w.A, a).addScaledVector(w.B, b).addScaledVector(w.C, c).addScaledVector(w.n, w.belly * Math.pow(bw, 0.8));
}

// ---------- a ship's scars, kept ----------
// The scars, holes and cracked crystals behind a ship's looks, as plain numbers, written into her looks (write) for
// her shaders. The game (src/game/looks.js) adds to them as she's hit; the ships demo sets them all at once
export function makeWear(ship) {
  const S = () => ({ on: false, x: 0, y: 0, z: 0, nx: 0, ny: 1, nz: 0, r: 0, r0: 0, heat: 0, patched: false, cap: 3, burning: false, sewn: 0 });
  const W = {
    U: ship.U, ship, scars: Array.from({ length: SCARS }, S), holes: Array.from({ length: HOLES }, S),
    clusters: ship.recipe.clusters.length, dmg: new Float32Array(CLUSTERS), crys: new Float32Array(CLUSTERS).fill(1), crack: new Float32Array(CLUSTERS),
    grime: 0, fray: 0, flap: 1, spark: 1, list: 0,
    // (for the game: her flames this frame, the first one's place in the batch and their tips in the world; how hot her
    // hottest open scar is; her hull's share when the crew began patching her; her own beat for sputtering; her beam)
    fires: 0, firstFlame: 0, tips: new Float32Array(SCARS * 3), hot: 0, from: -1, mending: 0, seed: Math.random() * 100, half: ship.hull.half((ship.hull.zs + ship.hull.zb) / 2),
    // a scar on the hull at p (her own frame), facing n, `r` metres, `heat` 0 to 1: one close by grows instead (up to 3
    // m); with six already, the coolest, smallest goes
    scar(p, n, r, heat = 1) {
      let s = near(W.scars, p, 0.9 * r);
      if (s) { s.r = s.r0 = Math.min(s.cap, Math.hypot(s.r0, r * 0.5)); s.heat = Math.max(s.heat, heat); s.patched = false; return s; }
      s = W.scars.find((x) => !x.on) ?? W.scars.reduce((a, b) => (b.heat + b.r * 0.3 < a.heat + a.r * 0.3 ? b : a));
      Object.assign(s, { on: true, x: p.x, y: p.y, z: p.z, nx: n.x, ny: n.y, nz: n.z, r, r0: r, heat, patched: false, cap: 3 });
      return s;
    },
    // a hole in a sail at p, `r` metres, on wing w (a hole grows to at most 0.4 of its yard); with six, the smallest goes
    hole(p, r, w) {
      const cap = w ? 0.4 * w.B.distanceTo(w.C) : 3;
      let h = near(W.holes, p, 1.2 * r);
      if (h) { h.r = h.r0 = Math.min(h.cap, Math.hypot(h.r0, r)); h.patched = false; h.sewn = 0; return h; }
      h = W.holes.find((x) => !x.on) ?? W.holes.reduce((a, b) => (b.r0 < a.r0 ? b : a));
      Object.assign(h, { on: true, x: p.x, y: p.y, z: p.z, r: Math.min(r, cap), r0: Math.min(r, cap), heat: 0, patched: false, cap, sewn: 0 });
      return h;
    },
    // which cluster a point (her own frame) belongs to: the nearest along her length
    cluster(p) {
      const C = ship.recipe.clusters;
      let best = 0;
      for (let i = 1; i < C.length; i++) if (Math.abs(C[i].z - p.z) < Math.abs(C[best].z - p.z)) best = i;
      return best;
    },
    // back to new
    reset() {
      for (const s of W.scars) { s.on = false; s.burning = false; }
      for (const h of W.holes) { h.on = false; h.sewn = 0; }
      W.dmg.fill(0); W.crys.fill(1); W.crack.fill(0); W.grime = 0; W.fray = 0; W.flap = 1; W.spark = 1; W.list = 0;
      W.write();
    },
    // into her looks: the scars and holes packed from the first (her shaders stop at the first empty one)
    write() {
      const U = W.U, sc = U.uScar.value, he = U.uHeat.value, ho = U.uHole.value;
      let k = 0;
      for (const s of W.scars) if (s.on && s.r > 0.01) { sc[k * 4] = s.x; sc[k * 4 + 1] = s.y; sc[k * 4 + 2] = s.z; sc[k * 4 + 3] = s.patched ? -s.r : s.r; he[k] = s.patched ? 0 : s.heat; k++; }
      for (; k < SCARS; k++) { sc[k * 4 + 3] = 0; he[k] = 0; }
      k = 0;
      for (const h of W.holes) if (h.on && h.r > 0.01) { ho[k * 4] = h.x; ho[k * 4 + 1] = h.y; ho[k * 4 + 2] = h.z; ho[k * 4 + 3] = h.patched ? -h.r : h.r; k++; }
      for (; k < HOLES; k++) ho[k * 4 + 3] = 0;
      U.uWear.value.set(W.grime, W.fray, W.flap, 0);
      U.uCrys.value.set(W.crys); U.uCrack.value.set(W.crack); U.uSpark.value = W.spark;
    },
  };
  return W;
}
function near(list, p, within) {
  let best = null, bd = within * within;
  for (const s of list) { if (!s.on) continue; const d = (s.x - p.x) ** 2 + (s.y - p.y) ** 2 + (s.z - p.z) ** 2; if (d < bd) { bd = d; best = s; } }
  return best;
}

// The sputter of failing crystals at time t (seconds): mostly bright, guttering low now and then, the same at any frame
// rate (a smooth noise, worked out here so her crystals, glows, sparks and lamps all gutter together)
export function sputter(t) {
  const x = t * 11, i = Math.floor(x), f = x - i, k = f * f * (3 - 2 * f);
  const h = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
  return h(i) + (h(i + 1) - h(i)) * k > 0.35 ? 1 : 0.25;
}

// ---------- the ships demo's three looks ----------
// New, Battered (a few scorched holes along her sides, holes in her sails, one cluster dimmed and cracked, a little
// grime and fray) or Wrecked (holes all along her, still burning, rags for sails, every crystal dim, cracked and
// sputtering). The same every time, for pictures to compare. Returns the scars that burn (Wrecked: the worst three)
export function wearPreset(W, name) {
  W.reset();
  if (name === 'new') return 0;
  const ship = W.ship, hull = ship.hull, L = hull.zb - hull.zs, wrecked = name === 'wrecked', p = new THREE.Vector3(), n = new THREE.Vector3();
  // along her sides: just under her gun ports (where a broadside's shots land, and her ports and their lids don't hide
  // them), on her gun deck between two ports, or lower down her belly
  const spots = wrecked ? [[0.18, 'under', 1], [0.35, 0.62, -1], [0.5, 'between', 1], [0.64, 'under', -1], [0.78, 0.62, 1], [0.9, 'between', -1]]
    : [[0.22, 0.6, 1], [0.42, 'under', 1], [0.6, 'between', -1], [0.78, 'under', 1]]; // (battered on her port side most)
  const P = ship.recipe.ports, ports = P ? [...P.z].sort((a, b) => a - b) : [], gy = P ? [].concat(P.y)[0] : 0;
  const r = 1.9 * clamp(L / 25, 0.55, 1.3); // (a broadside's shot)
  for (const [f, at, side] of spots) {
    let z = hull.zs + L * f, t = typeof at === 'number' ? at : 0.3;
    if (at === 'under' && P) t = hull.tAt(z, gy - P.h * 0.85);
    else if (at === 'between' && ports.length > 1) {
      let i = 0;
      for (let k = 1; k < ports.length; k++) if (Math.abs(ports[k] - z) < Math.abs(ports[i] - z)) i = k;
      const j = i === ports.length - 1 || (i > 0 && z < ports[i]) ? i - 1 : i + 1;
      z = (ports[i] + ports[j]) / 2; t = hull.tAt(z, gy);
    }
    const q = hull.at(z, t, side);
    W.scar(p.set(q[0], q[1], z), n.copy(hull.normal(z, t, side)), r * (wrecked ? 1.2 : 1.1), wrecked ? 1 : 0.35);
  }
  const wings = ship.wings ?? [];
  const holes = wrecked ? [[0.3, 0.35, 0.35], [0.5, 0.3, 0.2], [0.25, 0.5, 0.25]] : [[0.33, 0.33, 0.34]];
  wings.forEach((w, i) => {
    if (!wrecked && i % 2) return;
    const [a, b, c] = holes[i % holes.length];
    W.hole(sailPoint(w, a, b, c, p), 1.2 * clamp(L / 25, 0.55, 1.3) * (wrecked ? 1.2 : 1), w);
  });
  W.grime = wrecked ? 0.85 : 0.5; W.fray = wrecked ? 0.5 : 0.15; W.flap = wrecked ? 3 : 1.4;
  for (let i = 0; i < W.clusters; i++) { W.crys[i] = wrecked ? 0.25 : i === 0 ? 0.55 : 1; W.crack[i] = wrecked ? 0.9 : i === 0 ? 0.6 : 0; }
  W.list = wrecked ? -0.05 : 0;
  W.write();
  return wrecked ? 3 : 0;
}
