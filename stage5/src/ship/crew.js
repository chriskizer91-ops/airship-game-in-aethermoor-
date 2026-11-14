// crew.js: the people aboard (stage 5). Every ship carries a small crew on her deck, placed from her recipe, so she
// reads as a ship with people on her and has a sense of scale, like the figure in Chris's pictures:
//   the Captain   at the wheel, hands on its rim: a long coat and a three-cornered hat edged in gold
//   a lookout     at the bow, a brass spyglass to her eye
//   gunners       one behind each bow gun, a hand on it
//   deckhands     along the rails looking out, one at the capstan, more of them the longer the ship
// They wear the ship's colour (the Captain's ships: her pennants' colour, src/game/paint.js; a raider's by her livery,
// livery.js), with cream or dark breeches and caps of their own. They sway a little as they stand (materials.js).
// A figure is a few hundred triangles at full detail and about sixty at middle; far off there are none. All of a
// ship's crew is one mesh ('crew'), so one more draw call.
// Each corner's colour is its own; its uv says what it is: x = 1 + the figure's own beat (0 to 0.9) on her coat (so it
// can be dyed), the beat alone elsewhere; y = how high it is above her feet (she sways from the feet up).
import * as THREE from 'three';
import { lathe, place, rod, clamp } from './kit.js';

// the Captain's plum, as her pennants (as light, not as painted); a coat is dyed deeper than a pennant (DEEP), so a
// deck of them isn't garish
export const DEEP = 0.55, COAT = [0.42 * DEEP, 0.1 * DEEP, 0.3 * DEEP];
const GOLD = [0.95, 0.72, 0.28], DARK = [0.05, 0.045, 0.05], BRASS = [0.8, 0.58, 0.22];
const SKIN = [[0.78, 0.52, 0.38], [0.6, 0.38, 0.26], [0.4, 0.25, 0.17], [0.84, 0.6, 0.46]];
const BREECHES = [[0.8, 0.74, 0.6], [0.1, 0.1, 0.16], [0.28, 0.19, 0.12]];
const CAPS = [[0.8, 0.74, 0.6], [0.14, 0.22, 0.36], [0.3, 0.19, 0.11], [0.62, 0.56, 0.5]];
const V = (x, y, z) => new THREE.Vector3(x, y, z);
// (a little dice of its own, so a ship's crew is the same every time she's built)
const dice = (seed) => { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// a piece of a figure: coloured, and marked (its coat can be dyed; how high each corner is; the figure's beat)
function piece(g, rgb, beat, coat = false) {
  if (g.index) g = g.toNonIndexed();
  const n = g.attributes.position.count, col = new Float32Array(n * 3), uv = new Float32Array(n * 2), P = g.attributes.position;
  for (let i = 0; i < n; i++) { col.set(rgb, i * 3); uv[i * 2] = (coat ? 1 : 0) + beat; uv[i * 2 + 1] = Math.max(0, P.getY(i)); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}
const limb = (a, b, r0, r1, radial) => { const { geometry, matrix } = rod(a.toArray(), b.toArray(), r0, r1, radial); return geometry.applyMatrix4(matrix); };

// where each pose puts her hands (her own frame: facing +z, feet at y = 0), right hand then left; `at`: the wheel's rim
const POSE = {
  idle: () => [V(0.26, 0.86, 0.03), V(-0.26, 0.86, 0.03)],
  rail: () => [V(0.2, 1.0, 0.3), V(-0.2, 1.0, 0.3)],
  hips: () => [V(0.21, 1.0, 0.04), V(-0.21, 1.0, 0.04)],
  spy: () => [V(0.1, 1.58, 0.27), V(-0.21, 1.0, 0.04)],
  gun: () => [V(0.2, 1.06, 0.4), V(-0.26, 0.86, 0.03)],
  push: () => [V(0.17, 1.02, 0.42), V(-0.17, 1.02, 0.42)],
  helm: (at) => [V(at.x, at.y, at.z), V(-at.x, at.y, at.z)],
};

// One figure, into the batch at matrix m (her feet, the way she faces). opts: pose, captain (the long coat and hat),
// seed, low (the middle model's: a body, a head and legs), at (the wheel's rim for her hands)
function figure(batch, m, { pose = 'idle', captain = false, seed = 1, low = false, at = null }) {
  const rnd = dice(seed * 7919 + 13), beat = Math.floor(rnd() * 9) / 10;
  const skin = SKIN[Math.floor(rnd() * SKIN.length)], legs = captain ? BREECHES[0] : BREECHES[Math.floor(rnd() * BREECHES.length)], cap = CAPS[Math.floor(rnd() * CAPS.length)];
  const add = (g, rgb, coat) => batch.add('crew', piece(g, rgb, beat, coat), m);
  if (low) {
    add(lathe([[0.2, 0.72], [0.21, 1.1], [0.2, 1.4], [0.07, 1.5]], 5).scale(1, 1, 0.72), COAT, true);
    add(new THREE.CylinderGeometry(0.15, 0.12, 0.74, 4, 1, true).translate(0, 0.37, 0), captain ? DARK : legs);
    add(new THREE.SphereGeometry(0.125, 5, 3).translate(0, 1.61, 0), captain ? DARK : skin);
    return;
  }
  // legs and boots
  for (const s of [1, -1]) {
    add(new THREE.CylinderGeometry(0.085, 0.07, 0.5, 6, 1, true).translate(s * 0.095, 0.57, 0), legs);
    add(new THREE.CylinderGeometry(0.08, 0.09, 0.34, 6, 1, false).translate(s * 0.095, 0.17, 0.01), DARK);
  }
  // the coat (the Captain's reaches her knees), flattened front to back
  const coat = captain ? [[0.27, 0.4], [0.25, 0.62], [0.215, 0.86], [0.18, 1.08], [0.22, 1.34], [0.2, 1.44], [0.075, 1.5]] : [[0.19, 0.72], [0.215, 0.86], [0.18, 1.08], [0.215, 1.34], [0.2, 1.44], [0.075, 1.5]];
  add(lathe(coat, 8).scale(1, 1, 0.72), COAT, true);
  if (captain) add(lathe([[0.185, 1.03], [0.2, 1.08], [0.185, 1.13]], 8).scale(1, 1, 0.74), GOLD); // (her sash)
  // head, and a cap or hair; the Captain's three-cornered hat, its brim turned up and edged in gold
  add(new THREE.SphereGeometry(0.118, 7, 5).translate(0, 1.615, 0), skin);
  for (const e of [1, -1]) add(new THREE.BoxGeometry(0.026, 0.03, 0.02).translate(e * 0.043, 1.635, 0.108), DARK); // (her eyes)
  if (captain) {
    add(new THREE.CylinderGeometry(0.1, 0.125, 0.1, 6, 1, false).translate(0, 1.76, 0), DARK);
    add(lathe([[0.1, 1.7], [0.3, 1.7], [0.27, 1.79]], 3, Math.PI).translate(0, 0, 0), DARK);
    add(lathe([[0.27, 1.79], [0.262, 1.815]], 3, Math.PI), GOLD);
  } else add(new THREE.SphereGeometry(0.128, 7, 3, 0, Math.PI * 2, 0, Math.PI * 0.56).translate(0, 1.625, -0.006), rnd() < 0.3 ? DARK : cap);
  // arms: shoulder to elbow to hand, and the hands
  const hands = POSE[pose](at);
  hands.forEach((h, i) => {
    const s = i ? -1 : 1, sh = V(s * 0.215, 1.37, 0), el = sh.clone().lerp(h, 0.5).add(V(s * (pose === 'hips' ? 0.17 : 0.05), -0.09, pose === 'hips' ? -0.08 : -0.07));
    add(limb(sh, el, 0.062, 0.052, 5), COAT, true); add(limb(el, h, 0.05, 0.042, 5), COAT, true);
    add(new THREE.SphereGeometry(0.048, 4, 3).translate(h.x, h.y, h.z), skin);
  });
  if (pose === 'spy') add(limb(V(0.085, 1.625, 0.12), V(0.11, 1.64, 0.62), 0.02, 0.032, 6), BRASS);
}

// The crew, placed about her deck from her recipe. Returns where each stands (for the checks): { role, x, y, z, yaw }
export function crew(hull, batch, R, q, opts = {}) {
  if (q.level === 'far') return [];
  const low = q.level !== 'full', L = R.length, k = clamp(L / 25, 0.6, 1.3), out = [];
  // what's in the way on her deck: [x, z, radius, whose] (a gunner may stand by her own gun)
  const block = [], fr = (0.11 + 0.0045 * L) * 4.2; // (the rail round each mast's foot is that far out)
  for (const C of R.clusters ?? []) block.push([0, C.z, R.cluster.r * 1.2 * (C.scale ?? 1) + 0.12]);
  for (const M of R.masts ?? []) block.push([0, M.z, fr * 1.25]);
  for (const H of R.hatches ?? []) block.push([0, H.z, Math.max(H.len, H.wid) / 2 + 0.15]);
  const cap = clamp(L / 25, 0.7, 1.2);
  if (R.capstan) block.push([0, R.capstan.z, 0.9 * cap + 0.05, 'capstan']);
  if (R.wheel) block.push([0, R.wheel.z, R.wheel.r + 0.3]);
  const C = R.cargo ?? {}, ck = clamp(L / 25, 0.65, 1.1);
  for (const [x, z] of [...(C.barrels ?? []), ...(R.treasure ?? [])]) block.push([x, z, 0.78 * ck]);
  for (const [x, z] of C.coils ?? []) block.push([x, z, 0.3 * ck + 0.1]);
  for (const [x, z] of C.crates ?? []) block.push([x, z, 0.45 * ck + 0.1]);
  for (const G of [...(R.bowGuns ?? []), ...(R.swivels ?? [])]) for (const t of [0, 0.5, 1]) block.push([G.x, G.z + t * G.len * 0.6, 0.35, G]);
  for (const Lt of R.lanterns ?? []) if (Lt.post) block.push([Lt.at[0], Lt.at[2], 0.2]);
  // the stairs up to her castles, and the step itself
  const steps = [];
  for (const [edge, St, dir] of [[R.quarterdeck?.front, R.quarterdeck?.stairs, 1], [R.forecastle?.back, R.forecastle?.stairs, -1]]) {
    if (edge == null) continue;
    steps.push([Math.min(edge - dir * 0.6, St ? St.bottom + dir * 0.4 : edge + dir * 0.6), Math.max(edge - dir * 0.6, St ? St.bottom + dir * 0.4 : edge + dir * 0.6)]);
  }
  const taken = [];
  // whether someone can stand at (x, z): on her deck inside her rail, off her steps, clear of what's in the way (but
  // for `own`, whose it is) and a pace from everyone else
  const free = (x, z, r = 0.28, own = null) => {
    if (z < hull.zs + 0.4 || z > hull.zb - 0.4 || Math.abs(x) > hull.deckHalf(z) - 0.3) return false;
    if (Math.abs(hull.deckY(z + 0.3) - hull.deckY(z - 0.3)) > 0.12) return false;
    for (const [a, b] of steps) if (z > a && z < b) return false;
    for (const [bx, bz, br, whose] of block) if (!(own && whose === own) && Math.hypot(x - bx, z - bz) < br + r) return false;
    for (const [tx, tz] of taken) if (Math.hypot(x - tx, z - tz) < 1.0) return false;
    return true;
  };
  let n = 0;
  const stand = (role, x, z, yaw, o = {}) => {
    const y = hull.deckY(z) + 0.01, s = 0.96 + ((n * 0.37) % 1) * 0.1;
    figure(batch, place([x, y, z], { euler: [0, yaw, 0], scale: s }), { seed: n + 1 + L, low, ...o });
    taken.push([x, z]); out.push({ role, x, y, z, yaw }); n++;
  };
  // the Captain at the wheel (always: her place is made for her), her hands on its rim
  if (R.wheel) {
    const W = R.wheel, z = Math.max(hull.zs + 0.3, W.z - 0.42 - 0.35 * W.r), cy = 1.55 * W.r;
    const reach = clamp(W.z + 0.02 - z, 0.25, 0.5);
    stand('captain', 0, z, 0, { pose: 'helm', captain: true, at: V(clamp(0.62 * W.r, 0.14, 0.3), clamp(cy + 0.42 * W.r, 0.8, 1.38), reach) });
  }
  // a gunner at each bow gun (two at most): behind it, or beside it where there's no room behind
  for (const G of (R.bowGuns ?? []).slice(0, 2)) {
    const out0 = G.x >= 0 ? 1 : -1;
    for (const [dx, dz, yaw] of [[0.42 * out0 * (G.x ? 1 : 0), -0.75, 0], [0.42 * out0 * (G.x ? 1 : 0), -1.15, 0], [-0.42 * out0, -0.75, 0], [0.5, -0.15, -0.5], [-0.5, -0.15, 0.5], [0.55, 0.3, -0.9], [-0.55, 0.3, 0.9]]) {
      if (free(G.x + dx, G.z + dz, 0.2, dx ? G : null)) { stand('gunner', G.x + dx, G.z + dz, yaw, { pose: 'gun' }); break; }
    }
  }
  // the lookout, as far forward as there's room, a little to one side, her spyglass ahead
  look: for (let z = hull.zb - 0.45; z > hull.zb - 0.22 * L; z -= 0.3) for (const x of [0.55 * k, -0.55 * k, 0, 0.9 * k, -0.9 * k]) if (free(x, z)) { stand('lookout', x, z, x * 0.25, { pose: 'spy' }); break look; }
  // one at the capstan, pushing a bar
  if (R.capstan) { const r = 0.9 * cap + 0.32; for (const a of [2.2, -0.9, 0.7, -2.4, 1.5, -1.6]) { const x = Math.sin(a) * r, z = R.capstan.z + Math.cos(a) * r; if (free(x, z, 0.1, 'capstan')) { stand('hand', x, z, a + Math.PI, { pose: 'push' }); break; } } }
  // deckhands along her rails, looking out: more of them the longer she is, on alternate sides
  const hands = Math.max(1, Math.round(L / 9)), z0 = hull.zs + 0.14 * L, z1 = hull.zb - 0.16 * L;
  for (let i = 0; i < hands; i++) {
    const side = i % 2 ? -1 : 1, zc = z0 + ((i + 0.5) / hands) * (z1 - z0);
    place: for (const dz of [0, 0.5, -0.5, 1, -1, 1.5, -1.5, 2.2, -2.2]) for (const sd of [side, -side]) {
      const z = zc + dz, x = sd * (hull.deckHalf(clamp(z, hull.zs, hull.zb)) - 0.42);
      if (free(x, z)) { stand('hand', x, z, sd * Math.PI / 2, { pose: i % 3 === 1 ? 'hips' : 'rail' }); break place; }
    }
  }
  // an officer of the watch beside the Captain, on ships with a quarterdeck
  if (R.quarterdeck && R.wheel) for (const [dx, dz] of [[1.3, 1.5], [-1.3, 1.5], [1.6, 0.4], [-1.6, 0.4]]) {
    const x = dx * Math.max(1, k * 0.9), z = R.wheel.z + dz * Math.max(1, k * 0.9);
    if (free(x, z)) { stand('officer', x, z, -dx * 0.12, { pose: 'hips' }); break; }
  }
  // (the smallest ships: three aboard at least, wherever there's room, stern to bow)
  for (let z = hull.zs + 0.6; n < 3 && z < hull.zb - 0.4; z += 0.3) for (const x of [0.5, -0.5, 0.9, -0.9, 0]) if (free(x, z)) { stand('hand', x, z, x ? Math.sign(x) * 1.2 : 0, { pose: 'hips' }); break; }
  return out;
}
