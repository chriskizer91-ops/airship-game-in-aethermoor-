// raiders.js: the raiders, the Captain's enemies for now. They fly the Captain's four classes (Skiff, Cutter, Brig,
// Frigate) and the two only raiders sail (Galleon, Man-o'-war), built by the same code at the middle and far settings
// of the detail dial, and they fly by the same rules (flight.js), a little slower. Raiders are easy to tell apart:
// rust-red sails, darker planks and crimson pennants with a black hoist.
//   Skiffs and Cutters chase: attack runs, bow-first, peeling away side-on when close.
//   Brigs, Frigates and the Man-o'-war fight broadside: they come alongside a few hundred metres off and fire whole
//   sides. The Man-o'-war is a fortress: two decks of twelve guns a side, slow to turn and slower to climb.
//   The Galleon is a treasure ship: she sails by, runs once she's chased, covering her escape with her stern guns, and
//   strikes her colours when her sails are gone or her hull is down to a quarter. Left too far behind, she gets away.
// They come in waves, smallest first, and every fifth wave is led by a raider captain: tougher, harder-hitting and
// quicker to reload, with black sails and a gold pennant, and worth four times the shards. How sharp the raiders are
// depends on the skies the Captain chose (progress.js); on Fair Winds a captain is no tougher than her crew, hits no
// harder and reloads no faster.
// Before a raider's broadside goes off, her gun ports glow red for half a second (a little longer on the two big ships),
// brightening to gold: time to climb, dive or turn away. Then her side ripples off, bow to stern (guns.js).
import * as THREE from 'three';
import { buildShip, shipMotion } from '../ship/build.js';
import { makeLook, dress } from '../ship/dress.js';
import { FLEET, STATS } from '../ships/index.js';
import { makeFlyer } from './flight.js';
import { makeGunnery, intercept } from './guns.js';
import { hitZones, firstHit } from './damage.js';
import { CLOUD_Y } from './world.js';

// How the raiders compare with the Captain, before the skies' own settings: reload half as slowly again, and aim a
// little off (by this much for every metre to the target)
export const RAIDER = { slow: 1.5, aim: 0.02 };
// how long her gun ports glow before a broadside (seconds), and the glow's colours, from first to firing. The glow's
// time comes out of her next reload, so she fires her broadsides as often as she would without it
export const WARN = { time: 0.5, big: 0.65 }, WARN_FROM = new THREE.Color(0xff4636), WARN_TO = new THREE.Color(0xffc070);
// a raider captain's edge over her crew (times as tough, as hard-hitting, as long to reload), all of it on most skies
// and none on Fair Winds (the skies' `captain`), and her bounty
export const CAPTAIN = { toughness: 2, damage: 1.2, reload: 0.9, bounty: 4 };
// the colours of what a shot knocks off her (fx.js): her planks, and her sails (rust-red for the crews, black for
// their captains)
export const LOOKS = { crew: { wood: 0x6e5440, sail: 0xc8735c }, captain: { wood: 0x5a4838, sail: 0x3a3034 } };
// the big ships' heavy guns take their crews longer to reload
const HEAVY = { galleon: 1.15, manowar: 1.3 };
// Crystal Shards for bringing one down (before the skies' and the wave's bonus)
export const BOUNTY = { skiff: 15, cutter: 30, brig: 60, frigate: 100, galleon: 300, manowar: 400 };
const ROLE = { skiff: 'chaser', cutter: 'chaser', brig: 'broadside', frigate: 'broadside', galleon: 'prize', manowar: 'broadside' };
export const WAVES = [['skiff'], ['skiff', 'skiff'], ['cutter'], ['cutter', 'skiff'], ['brig'], ['galleon', 'cutter'], ['frigate'],
  ['frigate', 'cutter', 'cutter'], ['brig', 'brig', 'skiff', 'skiff'], ['frigate', 'brig', 'cutter', 'cutter', 'skiff'],
  ['galleon', 'frigate', 'cutter'], ['manowar', 'cutter', 'cutter'], ['frigate', 'frigate', 'brig'], ['galleon', 'galleon', 'frigate', 'cutter'],
  ['manowar', 'frigate', 'brig', 'cutter']];
// wave n (from 0): which ships, the biggest first, and whether it's led by a captain (every fifth wave: the biggest
// ship but a Man-o'-war, which needs no captain); Maelstrom skies add `extra` Skiffs or Cutters from the third wave on
const SIZE = { skiff: 0, cutter: 1, brig: 2, frigate: 3, galleon: 4, manowar: 5 };
export function waveAt(n, extra = 0) {
  const pool = ['skiff', 'skiff', 'cutter', 'cutter', 'cutter', 'brig', 'brig', 'frigate', 'frigate', 'galleon', 'manowar'];
  let ids = [...(WAVES[n] ?? [])];
  if (!ids.length) {
    ids = Array.from({ length: Math.min(6, 3 + ((n - WAVES.length) >> 1)) }, () => pool[Math.floor(Math.random() * pool.length)]);
    ids = ids.filter((id, i) => id !== 'manowar' || ids.indexOf('manowar') === i); // one Man-o'-war at a time
  }
  if (n >= 2) for (let i = 0; i < extra && ids.length < 6; i++) ids.push(n % 2 ? 'cutter' : 'skiff');
  ids.sort((a, b) => SIZE[b] - SIZE[a]);
  return { ids, captain: (n + 1) % 5 === 0 ? ids.findIndex((id) => id !== 'manowar') : -1 };
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// the raiders' colours, on copies of the ship materials: rust-red sails for the crews, black for their captains
function raiderArt(art, captain) {
  const M = { ...art.M };
  M.hull = art.M.hull.clone(); M.hull.color.set(captain ? 0x7d6f72 : 0x9a8781);
  M.canvas = art.M.canvas.clone();
  if (captain) { M.canvas.color.set(0x3a3034); M.canvas.emissive.set(0x1c1216); } else { M.canvas.color.set(0xc8735c); M.canvas.emissive.set(0x7a3020); }
  M.canvas.onBeforeCompile = art.M.canvas.onBeforeCompile; M.canvas.customProgramCacheKey = art.M.canvas.customProgramCacheKey;
  return { ...art, M };
}
// crimson pennants with a black hoist; a captain's are gold with a black hoist
function recolourPennants(ship, captain) {
  ship.body.traverse((o) => {
    if (!o.isMesh || o.name !== 'flag') return;
    const c = o.geometry.attributes.color;
    for (let i = 0; i < c.count; i++) {
      if (c.getX(i) > 0.8) c.setXYZ(i, 0.09, 0.07, 0.06);
      else if (captain) c.setXYZ(i, 0.95, 0.72, 0.28); else c.setXYZ(i, 0.72, 0.09, 0.07);
    }
    c.needsUpdate = true;
  });
}

// The masts, cut out of a class's middle model once, as it's built (on a laptop: wrecks.js topples them when she's blown
// apart). For each of her meshes of wood, brass and canvas: the triangles that stay with the hull, and for each mast,
// the ones that fall with it (her pennants and all her rigging just go: snapped). A mast is everything a metre above
// the deck round its foot, and everything from just under its lowest yard up, fore and aft of it as far as its sails
// reach. The pieces share the model's own vertices, so they're only lists of numbers
const CUT = ['wood', 'brass', 'canvas', 'flag', 'rope'], FALL = ['wood', 'brass', 'canvas'];
function cutMasts(R, model) {
  const hull = model.hull, masts = R.masts.map((M) => {
    const y0 = hull.deckY(M.z), sweep = Math.max(...M.tiers.map((t) => t.sweep)), foot = 1 + (0.11 + 0.0045 * R.length) * 3;
    return { y0, low: y0 + Math.min(...M.tiers.map((t) => t.at)) * M.height - 0.4, z: M.z, z0: M.z - sweep - 1.5, z1: M.z + 0.9, foot, H: M.height };
  });
  const which = (x, y, z) => {
    for (let i = 0; i < masts.length; i++) {
      const m = masts[i];
      if (y > m.y0 + 1 && (y >= m.low ? z > m.z0 && z < m.z1 : Math.abs(x) < m.foot && Math.abs(z - m.z) < m.foot)) return i;
    }
    return -1;
  };
  const share = (src, list) => {
    const g = new THREE.BufferGeometry();
    for (const k in src.attributes) g.setAttribute(k, src.attributes[k]);
    g.setIndex(new THREE.BufferAttribute(Uint32Array.from(list), 1)); g.boundingSphere = src.boundingSphere;
    return g;
  };
  const keep = {}, fall = masts.map(() => ({}));
  for (const o of model.body.children) {
    if (!o.isMesh || !CUT.includes(o.name)) continue;
    const p = o.geometry.attributes.position.array, lists = [[], ...masts.map(() => [])];
    for (let t = 0, n = p.length / 9; t < n; t++) {
      const a = t * 9, i = which((p[a] + p[a + 3] + p[a + 6]) / 3, (p[a + 1] + p[a + 4] + p[a + 7]) / 3, (p[a + 2] + p[a + 5] + p[a + 8]) / 3);
      lists[i + 1].push(t * 3, t * 3 + 1, t * 3 + 2);
    }
    keep[o.name] = share(o.geometry, FALL.includes(o.name) ? lists[0] : []);
    if (FALL.includes(o.name)) masts.forEach((m, i) => { if (lists[i + 1].length) fall[i][o.name] = share(o.geometry, lists[i + 1]); });
  }
  // (stern first, the way the blasts walk)
  return { keep, masts: masts.map((m, i) => ({ pivot: new THREE.Vector3(0, m.y0 + 1, m.z), height: m.H, geo: fall[i] })).sort((a, b) => a.pivot.z - b.pivot.z) };
}

// One raider ship: copies of its class's middle and far models (sharing their shapes), swapped by how big it looks.
// Her parts that a wreck changes (wrecks.js) are her own: her crystals' glows and embers, her sails and her pennants,
// her middle and far models' meshes by name, and her far model's rigging (hidden when her masts fall). So are her
// looks (her scars, src/ship/dress.js): one set for both models, read by her own copies of the materials that show
// them (which share their shaders with every other ship's), and by her own glows and embers
function raiderShip(T) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const mid = T.mid.body.clone(), far = T.far.body.clone(); far.visible = false; body.add(mid, far);
  const U = makeLook();
  dress([mid, far], T.mid.M, U);
  const rudders = [], glows = [], embers = [], canvas = [], flags = [], meshes = {}, farMeshes = {}, farRig = [];
  body.traverse((o) => {
    if (o.name === 'rudder') rudders.push(o); else if (o.name === 'glow') glows.push(o); else if (o.name === 'embers') embers.push(o);
    else if (o.name === 'canvas') canvas.push(o); else if (o.name === 'flag') flags.push(o);
    if (o.name === 'glow' || o.name === 'embers') { o.material = o.material.clone(); o.material.uniforms.uCrys = U.uCrys; o.material.uniforms.uSpark = U.uSpark; }
  });
  for (const o of mid.children) if (o.isMesh) meshes[o.name] = o;
  for (const o of far.children) if (o.isMesh) { farMeshes[o.name] = o; if (CUT.includes(o.name) && o.name !== 'wood' && o.name !== 'brass') farRig.push(o); }
  const move = shipMotion(T.R, body, rudders);
  return {
    root, body, recipe: T.R, hull: T.mid.hull, length: T.R.length, level: 'middle', masts: T.masts ?? null, U, wings: T.mid.wings,
    parts: { glows, embers, canvas, flags, meshes, farMeshes, farRig },
    update(dt, opts) {
      const t = move(dt, opts);
      for (const g of glows) g.material.uniforms.uTime.value = t;
      for (const e of embers) e.material.uniforms.uTime.value = t;
    },
    detail(level, pixelScale) {
      mid.visible = level === 'middle'; far.visible = level === 'far'; this.level = level;
      for (const g of glows) g.material.uniforms.uScale.value = pixelScale;
      for (const e of embers) e.material.uniforms.uScale.value = pixelScale;
    },
  };
}

// The title screen's raiders (title.js) sail far off, so each is her far model in one piece, drawn in one go (a phone
// draws the title first, and each raider's dozen or so materials would cost it a dozen draws). Each corner of her takes
// the colour her own material gives it there: the material's colour, times its painting under that corner (for the tiled
// planks, deck and bands, their average colour), times its own colour (the pennants and crystals have their own), and
// glows as it does (the lamplight, the crystals, the sails' warmth). Her cut-out parts (the painted rails) keep only the
// triangles that are mostly painted, and her sails glow (SAIL_GLOW, of their own colour) as canvas does with the low
// sun behind it: the title looks toward the sun, so it's their shaded side that shows. The paintings are read small,
// and their pixels let go as soon as the ships being put together then are done (the title's opening puts its two or
// three together at once): kept, the two big picture sheets' would hold about 2 MB for the whole game, on a phone too.
// A class put together later reads them again
const SAIL_GLOW = 0.5;
const LIN = Array.from({ length: 256 }, (_, i) => { const c = i / 255; return c < 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); // (a byte of a painting, as light)
const paintings = new Map(); // (a texture's pixels, while they're wanted, and the average colour of what's painted)
let letGo = false; // (the pixels' letting go is waiting for the work in hand to finish)
function painting(tex) {
  let p = paintings.get(tex);
  if (!p?.d) {
    if (!letGo) { letGo = true; queueMicrotask(() => { letGo = false; for (const q of paintings.values()) q.d = null; }); }
    const img = tex.image, w = Math.min(512, img.width), h = Math.min(512, img.height), c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h).data, mean = [0, 0, 0];
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 115) { mean[0] += LIN[d[i]]; mean[1] += LIN[d[i + 1]]; mean[2] += LIN[d[i + 2]]; n++; }
    p = { w, h, d, mean: mean.map((v) => v / Math.max(1, n)), tiled: tex.wrapS === THREE.RepeatWrapping };
    paintings.set(tex, p);
  }
  return p;
}
// a painting's colour (linear) and how opaque it is at a corner's place on it (uv), into out; its average if it's tiled,
// or where it isn't painted
function paintAt(tex, uv, i, out) {
  const p = painting(tex);
  out[3] = 1;
  if (!p.tiled && uv) {
    const x = Math.min(p.w - 1, Math.max(0, Math.floor(uv.getX(i) * p.w))), y = Math.min(p.h - 1, Math.max(0, Math.floor((1 - uv.getY(i)) * p.h))), k = (y * p.w + x) * 4;
    out[3] = p.d[k + 3] / 255;
    if (out[3] > 0.45) { out[0] = LIN[p.d[k]]; out[1] = LIN[p.d[k + 1]]; out[2] = LIN[p.d[k + 2]]; return out; }
  }
  out[0] = p.mean[0]; out[1] = p.mean[1]; out[2] = p.mean[2];
  return out;
}
function onePiece(body) {
  body.updateMatrixWorld(true);
  const inv = body.matrixWorld.clone().invert(), m = new THREE.Matrix4(), nm = new THREE.Matrix3(), v = new THREE.Vector3(), c = new THREE.Color(), e = new THREE.Color(), px = [0, 0, 0, 1];
  const pos = [], nor = [], col = [], glow = [], idx = [];
  body.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry, M = o.material, P = g.attributes.position, N = g.attributes.normal, UV = g.attributes.uv, C = M.vertexColors ? g.attributes.color : null, I = g.index;
    m.multiplyMatrices(inv, o.matrixWorld); nm.getNormalMatrix(m);
    const base = pos.length / 3, alpha = new Float32Array(P.count).fill(1);
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(m); pos.push(v.x, v.y, v.z);
      if (N) v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); else v.set(0, 1, 0);
      nor.push(v.x, v.y, v.z);
      c.copy(M.color);
      if (M.map) { paintAt(M.map, UV, i, px); c.r *= px[0]; c.g *= px[1]; c.b *= px[2]; alpha[i] = px[3]; }
      if (C) { c.r *= C.getX(i); c.g *= C.getY(i); c.b *= C.getZ(i); }
      e.copy(M.emissive).multiplyScalar(M.emissiveIntensity);
      if (M.emissiveMap) { paintAt(M.emissiveMap, UV, i, px); e.r *= px[0]; e.g *= px[1]; e.b *= px[2]; }
      if (o.name === 'canvas') { e.r += c.r * SAIL_GLOW; e.g += c.g * SAIL_GLOW; e.b += c.b * SAIL_GLOW; }
      col.push(c.r, c.g, c.b); glow.push(e.r, e.g, e.b);
    }
    const n = I ? I.count : P.count, at = (k) => (I ? I.getX(k) : k);
    for (let t = 0; t + 2 < n; t += 3) {
      const a = at(t), b = at(t + 1), d = at(t + 2);
      if (M.alphaTest && (alpha[a] + alpha[b] + alpha[d]) / 3 < M.alphaTest) continue;
      idx.push(base + a, base + b, base + d);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setAttribute('aGlow', new THREE.Float32BufferAttribute(glow, 3));
  geo.setIndex(idx); geo.computeBoundingSphere();
  return geo;
}
let farMaterial = null;
function onePieceMaterial() {
  if (farMaterial) return farMaterial;
  const M = farMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, metalness: 0.15, side: THREE.DoubleSide });
  M.onBeforeCompile = (sh) => {
    sh.vertexShader = 'attribute vec3 aGlow;\nvarying vec3 vGlow;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlow = aGlow;');
    sh.fragmentShader = 'varying vec3 vGlow;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vGlow;');
  };
  M.customProgramCacheKey = () => 'raider-one-piece';
  return M;
}

// `skies()` gives the current skies' settings (progress.js); `fx` draws the gun ports' glow (fx.js). On a laptop each
// class's masts are cut out of its model as it's built, so they can fall when she's blown apart (a phone skips that)
export function makeRaiders(scene, art, bolts, skies, fx) {
  const falling = !fx.touch;
  const arts = { crew: raiderArt(art, false), captain: raiderArt(art, true) }, T = {};
  // one middle and one far model per class (and per colours: the captains' are built when first needed)
  function template(id, captain) {
    const key = id + (captain ? ':captain' : '');
    if (!T[key]) {
      const R = FLEET.find((s) => s.id === id), mid = buildShip(R, 'middle', arts[captain ? 'captain' : 'crew']), far = buildShip(R, 'far', arts[captain ? 'captain' : 'crew']);
      recolourPennants(mid, captain); recolourPennants(far, captain);
      // (her far model's masts are cut out too, only to be left out of it as her middle model's fall)
      T[key] = { R, mid, far, zones: hitZones(mid), masts: falling ? { ...cutMasts(R, mid), farKeep: cutMasts(R, far).keep } : null };
    }
    return T[key];
  }
  for (const R of FLEET) template(R.id, false);
  const list = [], escaped = [];
  let ai = true, foeNow = null; // (the ship they're fighting this frame, for working out each gun's aim)
  let detailAt = 0.06; // how big on screen (her length over the view's height) a raider is drawn with her middle model (Settings: picture)

  function spawn(id, pos, heading, frozen = false, captain = false) {
    const S = skies(), Tm = template(id, captain), edge = (k) => (captain ? 1 + (CAPTAIN[k] - 1) * S.captain : 1), tough = S.toughness * edge('toughness');
    const ship = raiderShip(Tm), st = STATS[id];
    const stats = { ...st, hull: Math.round(st.hull * tough), sails: Math.round(st.sails * tough), crystals: Math.round(st.crystals * tough) };
    const f = makeFlyer(ship, stats, { pos, heading }, { speed: S.pace });
    const role = ROLE[id];
    f.sail = 0.85; f.speed = f.H.vmax * 0.6;
    // where the Captain's guns aim at her: her hull's middle, or a treasure ship's fore sails (shoot them to catch her)
    f.aimY = Tm.zones.aim.y;
    const sails = Tm.zones.sails.filter((b) => !b.isEmpty());
    if (role === 'prize' && sails.length) {
      const c = sails[0].getCenter(new THREE.Vector3()), at = new THREE.Vector3();
      f.aimAt = () => at.copy(c).applyMatrix4(ship.body.matrixWorld);
    }
    f.strikes = role === 'prize';
    ship.root.position.copy(pos); ship.root.rotation.y = heading;
    scene.add(ship.root);
    const gun = makeGunnery(ship, { reload: RAIDER.slow * S.reload * (HEAVY[id] ?? 1) * edge('reload'), damage: S.damage * edge('damage') }, f);
    const r = { id, R: Tm.R, name: `Raider ${captain ? 'captain\'s ' + Tm.R.cls : Tm.R.cls}`, captain, ship, f, gun, zones: Tm.zones, role, frozen,
      bounty: BOUNTY[id] * (captain ? CAPTAIN.bounty : 1), aim: RAIDER.aim * S.aim, looks: LOOKS[captain ? 'captain' : 'crew'],
      mode: 'attack', timer: 0, side: 1, alt: (Math.random() - 0.5) * (role === 'chaser' ? 50 : 20), counted: false, gone: false,
      course: heading, fleeing: false, weave: Math.random() * 6,
      // a broadside being readied: which battery (null when none), seconds left of how many, the volley's aiming error,
      // and when next to ask if the foe is still in reach
      charge: { b: null, t: 0, T: 0, off: new THREE.Vector3(), ask: 0 } };
    // where a gun at `from` aims: where the foe will be when its shot gets there (each gun of a rippling broadside
    // works it out again as its turn comes, so the last guns still lead her)
    r.lead = (from, K, out) => intercept(from, f.velocity, foeNow.aimAt(), foeNow.velocity, K.speed, out);
    gun.from = r; // (each of her bolts remembers her, so a hit on the Captain can tell who fired it)
    ship.update(0, {}); ship.root.updateMatrixWorld(true);
    list.push(r);
    return r;
  }

  // a wave of raiders, 1.5 to 1.9 km ahead of the Captain, more or less, coming in, its captain (if any) leading; a
  // treasure ship is closer, about 1.2 km, sailing across the Captain's path
  function spawnWave(wave, foe) {
    const base = foe.heading + (Math.random() - 0.5) * 1.4, ids = wave.ids;
    ids.forEach((id, i) => {
      const prize = ROLE[id] === 'prize', a = base + (i - (ids.length - 1) / 2) * 0.24, d = prize ? 1100 + Math.random() * 250 : 1500 + Math.random() * 400;
      const pos = new THREE.Vector3(foe.pos.x + Math.sin(a) * d, clamp(foe.pos.y + (Math.random() - 0.5) * 160, 200, 2000), foe.pos.z + Math.cos(a) * d);
      spawn(id, pos, prize ? a + (Math.random() < 0.5 ? 1 : -1) * Math.PI / 2 : a + Math.PI, false, i === wave.captain);
    });
    return base;
  }

  // where to steer: chasers come at the foe bow-first and break away when close; broadside ships keep it abeam.
  // (The answer is one kept object, read straight away by flight.js)
  const ahead = new THREE.Vector3(), wish = { turn: 0, climb: 0, sailTo: 1 };
  function steer(r, foe, dt) {
    const me = r.f, L = r.R.length, P = foe.pos, dx = P.x - me.pos.x, dz = P.z - me.pos.z, d = Math.hypot(dx, dz, P.y - me.pos.y);
    const bearing = Math.atan2(dx, dz), rel = wrap(bearing - me.heading);
    r.timer -= dt;
    let want, sailTo = 1;
    if (r.role === 'prize') {
      // a treasure ship sails her course until she's chased or hit, then runs, weaving, under every sail she has
      if (!r.fleeing && (d < 1000 || me.frac('hull') < 1 || me.frac('sails') < 1)) r.fleeing = true;
      r.weave += dt * 0.3;
      want = r.fleeing ? bearing + Math.PI + Math.sin(r.weave) * 0.45 : r.course;
      sailTo = r.fleeing ? 1 : 0.7;
    } else if (r.mode === 'break') {
      want = r.breakH;
      if (r.timer <= 0) r.mode = 'attack';
    } else if (r.role === 'chaser' || d > 1500) {
      // an attack run: come at the foe, then peel away, side-on, when close or after 10-15 seconds of chasing
      ahead.copy(P).addScaledVector(foe.velocity, Math.min(3, d / 250));
      want = Math.atan2(ahead.x - me.pos.x, ahead.z - me.pos.z);
      sailTo = d < 300 ? 0.6 : 1;
      if (d < 900) r.run = (r.run ?? 0) + dt;
      if (r.role === 'chaser' && (d < 70 + L * 4 || r.run > (r.runFor ??= 10 + Math.random() * 5))) {
        r.run = 0; r.runFor = 10 + Math.random() * 5;
        r.mode = 'break'; r.timer = 3 + Math.random() * 2.5;
        r.breakH = bearing + (Math.random() < 0.5 ? 1 : -1) * (1.8 + Math.random() * 0.7); r.alt = (Math.random() - 0.5) * 70;
      }
    } else {
      if (Math.abs(rel) > 0.35 && Math.abs(rel) < Math.PI - 0.35) r.side = Math.sign(rel);
      const ideal = 260 + L * 4, k = clamp((d - ideal) / 300, -1, 1);
      want = bearing - r.side * (Math.PI / 2 - k * 0.9);
      sailTo = 0.75;
    }
    // keep clear of the other raiders
    let vx = Math.sin(want), vz = Math.cos(want);
    for (const o of list) {
      if (o === r || o.f.down) continue;
      const ox = me.pos.x - o.f.pos.x, oz = me.pos.z - o.f.pos.z, dd = Math.hypot(ox, oz), keep = (L + o.R.length) * 3 + 40;
      if (dd < keep && dd > 0.1) { const w = ((keep - dd) / keep) * 1.5; vx += (ox / dd) * w; vz += (oz / dd) * w; }
    }
    const err = wrap(Math.atan2(vx, vz) - me.heading), wantY = clamp(P.y + r.alt, 150, 2200);
    wish.turn = clamp(-err * 2.2, -1, 1); wish.climb = clamp((wantY - me.pos.y) / 60, -1, 1); wish.sailTo = sailTo;
    return wish;
  }

  // fire every battery that can reach where the foe will be, a little off. A broadside of three guns or more is readied
  // first, her ports glowing, and fires when the glow is full (or stands down if the foe slips out of its reach)
  const off = new THREE.Vector3(), aim = new THREE.Vector3(), SIDES = ['bow', 'port', 'starboard', 'stern'], drift = { turn: 0, climb: 0, sailTo: 0.6 }, CALM = { calm: true };
  const canReach = (r, b, foe) => {
    const m = r.gun.muzzle(b);
    intercept(m.p, r.f.velocity, foe.aimAt(), foe.velocity, m.K.speed, aim);
    const dist = aim.distanceTo(m.p);
    return dist <= m.K.speed * m.K.life * 0.7 && r.gun.reaches(b, aim, m) ? dist : -1; // they hold fire till it's worth it
  };
  function shoot(r, foe, dt) {
    const ch = r.charge;
    if (ch.b) {
      // (whether the foe is still in reach is asked six times a second, and as she fires)
      const ask = (ch.ask -= dt) <= 0 || ch.t - dt <= 0;
      if (ask) ch.ask = 1 / 6;
      if (ask && canReach(r, ch.b, foe) < 0) ch.b = null;
      else if ((ch.t -= dt) <= 0) {
        r.gun.fire(ch.b, r.lead, bolts, 'raider', r.f.velocity, ch.off);
        r.gun.ready[ch.b] = Math.max(0, r.gun.ready[ch.b] - ch.T); ch.b = null;
      }
    }
    for (const b of SIDES) {
      if (b === ch.b || r.gun.ready[b] > 0 || !r.gun.count(b)) continue;
      const dist = canReach(r, b, foe);
      if (dist < 0) continue;
      const e = dist * r.aim + 1.5;
      off.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(2 * e);
      if (r.gun.B[b][0].kind === 'broadside' && r.gun.count(b) >= 3) {
        if (!ch.b) { ch.b = b; ch.t = ch.T = r.R.length >= 50 ? WARN.big : WARN.time; ch.off.copy(off); ch.ask = 1 / 6; }
        continue;
      }
      r.gun.fire(b, r.lead, bolts, 'raider', r.f.velocity, off);
    }
  }
  // her gun ports glowing as a broadside is readied: red and small at first, swelling to hot gold as it's about to fire
  const port = new THREE.Vector3();
  function glowPorts(r) {
    const ch = r.charge, k = 1 - Math.max(0, ch.t) / ch.T, M = r.ship.body.matrixWorld, size = 2 + 6 * k;
    const cr = WARN_FROM.r + (WARN_TO.r - WARN_FROM.r) * k, cg = WARN_FROM.g + (WARN_TO.g - WARN_FROM.g) * k, cb = WARN_FROM.b + (WARN_TO.b - WARN_FROM.b) * k;
    const guns = r.gun.B[ch.b];
    for (let i = 0; i < guns.length; i++) fx.glowAt(port.copy(guns[i].p).applyMatrix4(M), cr, cg, cb, size);
  }

  // every frame: steer, fly, fire, pick the detail level; returns the raiders that went down this frame
  const downed = []; // (kept, and read straight away by main.js)
  function update(dt, foe, camera) {
    downed.length = 0; escaped.length = 0; foeNow = foe;
    const toScreen = 1 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const r of list) {
      const live = !r.f.down;
      if (r.frozen && live) r.ship.update(dt, CALM);
      else r.f.update(dt, live && ai && !foe.down ? steer(r, foe, dt) : drift);
      r.ship.root.updateMatrixWorld(true);
      // a ship going down fires no more (not even the guns still waiting their turn: they're stood down before her
      // guns are asked whose turn has come, as the shot that downed her may have landed after she last fired)
      if (r.f.down && !r.counted) { r.counted = true; r.gun.cancel(); downed.push(r); }
      r.gun.update(dt);
      if (live && ai && !r.frozen && !foe.down) { shoot(r, foe, dt); if (r.charge.b) glowPorts(r); } else r.charge.b = null;
      // a treasure ship that gets far enough away has escaped
      if (r.role === 'prize' && r.fleeing && !r.f.down && r.f.pos.distanceTo(foe.pos) > 3600) { r.gone = true; r.escaped = true; escaped.push(r); }
      // a wreck falls away below the clouds before it's taken away (140 m under them), or at least 150 m if she went
      // down low, never vanishing in the open sky (every wreck falls faster and faster: flight.js); 40 s at the most
      const D = r.f.down;
      if (D) { D.y0 ??= r.f.pos.y; if (D.t > 40 || r.f.pos.y < Math.max(15, Math.min(CLOUD_Y - 140, D.y0 - 150))) r.gone = true; }
      const size = (r.R.length / Math.max(1, camera.position.distanceTo(r.f.pos))) * toScreen;
      r.ship.detail(size < detailAt ? 'far' : 'middle', camera.userData.pixelScale ?? 500);
    }
    for (let i = list.length - 1; i >= 0; i--) if (list[i].gone) { drop(list[i]); list.splice(i, 1); }
    return downed;
  }

  // the first raider a shot from a to b (world) hits, and where
  function hitBy(a, b) {
    let best = null;
    for (const r of list) {
      if (r.f.down) continue;
      const h = firstHit(r.zones, r.ship.body, a, b);
      if (h && (!best || h.t < best.h.t)) best = { r, h };
    }
    return best;
  }

  // a raider taken away, with her tag on screen (main.js) if she has one; cleared away (a fresh voyage, or a test),
  // she's marked so, and her wreck (wrecks.js) stops at once
  function drop(r) { scene.remove(r.ship.root); r.tag?.remove(); }
  function clear() { for (const r of list) { r.gone = r.cleared = true; drop(r); } list.length = 0; }
  // build a class's models ahead of time (a captain's, before her wave), so nothing is built mid-fight
  const prepare = (id, captain = false) => { template(id, captain); };
  // a raider's ship and nothing more, for the title screen to fly across its sky far off: not one of the raiders, never
  // fighting. Her far model in one piece (made the first time it's wanted, and shared by every one of her class there)
  const pieces = {};
  function model(id) {
    const Tm = template(id, false), root = new THREE.Group(), body = new THREE.Mesh(pieces[id] ??= onePiece(Tm.far.body), onePieceMaterial());
    body.name = 'raider far, in one piece'; root.add(body);
    const move = shipMotion(Tm.R, body, []);
    return { root, body, recipe: Tm.R, length: Tm.R.length, level: 'far', update: (dt, opts) => { move(dt, opts); } };
  }
  // (for the check: how many paintings the title's raiders were coloured from, and how many still hold their pixels)
  const read = () => ({ read: paintings.size, held: [...paintings.values()].filter((p) => p.d).length });
  return { list, escaped, spawn, spawnWave, update, hitBy, clear, prepare, model, paintings: read, templates: T, setAI: (on) => { ai = on; }, setDetail: (k) => { detailAt = k; }, get detailAt() { return detailAt; } };
}
