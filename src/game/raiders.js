// raiders.js: the raiders, the Captain's enemies for now. They fly the same four classes as the Captain (Skiff,
// Cutter, Brig, Frigate), built by the same code at the middle and far settings of the detail dial, and they fly by
// the same rules (flight.js), a little slower. Raiders are easy to tell apart: rust-red sails, darker planks and
// crimson pennants with a black hoist.
//   Skiffs and Cutters chase: they come at the Captain bow-first, fire their bow guns, and break away when close.
//   Brigs and Frigates fight broadside: they come alongside at a few hundred metres and fire whole sides.
// They come in waves, smallest first, and every fifth wave is led by a raider captain: tougher, harder-hitting and
// quicker to reload, with black sails and a gold pennant, and worth four times the shards. How sharp the raiders are
// depends on the skies the Captain chose (progress.js).
import * as THREE from 'three';
import { buildShip, shipMotion } from '../ship/build.js';
import { SHIPS, STATS } from '../ships/index.js';
import { makeFlyer } from './flight.js';
import { makeGunnery, intercept } from './guns.js';
import { hitZones, firstHit } from './damage.js';
import { CLOUD_Y } from './world.js';

// How the raiders compare with the Captain, before the skies' own settings: reload half as slowly again, and aim a
// little off (by this much for every metre to the target)
export const RAIDER = { slow: 1.5, aim: 0.02 };
export const CAPTAIN = { toughness: 2, damage: 1.2, reload: 0.9, bounty: 4 };
// Crystal Shards for bringing one down (before the skies' and the wave's bonus)
export const BOUNTY = { skiff: 15, cutter: 30, brig: 60, frigate: 100 };
const ROLE = { skiff: 'chaser', cutter: 'chaser', brig: 'broadside', frigate: 'broadside' };
export const WAVES = [['skiff'], ['skiff', 'skiff'], ['cutter'], ['cutter', 'skiff'], ['brig'], ['brig', 'cutter'], ['frigate'],
  ['frigate', 'cutter', 'cutter'], ['brig', 'brig', 'skiff', 'skiff'], ['frigate', 'brig', 'cutter', 'cutter', 'skiff']];
// wave n (from 0): which ships, the biggest first, and whether it's led by a captain; Maelstrom skies add `extra`
// Skiffs or Cutters from the third wave on
const SIZE = { skiff: 0, cutter: 1, brig: 2, frigate: 3 };
export function waveAt(n, extra = 0) {
  const pool = ['skiff', 'skiff', 'cutter', 'cutter', 'cutter', 'brig', 'brig', 'frigate'];
  const ids = n < WAVES.length ? [...WAVES[n]] : Array.from({ length: Math.min(6, 3 + ((n - WAVES.length) >> 1)) }, () => pool[Math.floor(Math.random() * pool.length)]);
  if (n >= 2) for (let i = 0; i < extra && ids.length < 6; i++) ids.push(n % 2 ? 'cutter' : 'skiff');
  ids.sort((a, b) => SIZE[b] - SIZE[a]);
  return { ids, captain: (n + 1) % 5 === 0 };
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

// One raider ship: copies of its class's middle and far models (sharing their shapes), swapped by how big it looks
function raiderShip(T) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const mid = T.mid.body.clone(), far = T.far.body.clone(); far.visible = false; body.add(mid, far);
  const rudders = [], glows = [], embers = [];
  body.traverse((o) => { if (o.name === 'rudder') rudders.push(o); else if (o.name === 'glow') glows.push(o); else if (o.name === 'embers') embers.push(o); });
  const move = shipMotion(T.R, body, rudders);
  return {
    root, body, recipe: T.R, hull: T.mid.hull, length: T.R.length, level: 'middle',
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

// `skies()` gives the current skies' settings (progress.js)
export function makeRaiders(scene, art, bolts, skies) {
  const arts = { crew: raiderArt(art, false), captain: raiderArt(art, true) }, T = {};
  // one middle and one far model per class (and per colours: the captains' are built when first needed)
  function template(id, captain) {
    const key = id + (captain ? ':captain' : '');
    if (!T[key]) {
      const R = SHIPS.find((s) => s.id === id), mid = buildShip(R, 'middle', arts[captain ? 'captain' : 'crew']), far = buildShip(R, 'far', arts[captain ? 'captain' : 'crew']);
      recolourPennants(mid, captain); recolourPennants(far, captain);
      T[key] = { R, mid, far, zones: hitZones(mid) };
    }
    return T[key];
  }
  for (const R of SHIPS) template(R.id, false);
  const list = [];
  let ai = true;

  function spawn(id, pos, heading, frozen = false, captain = false) {
    const S = skies(), Tm = template(id, captain), tough = S.toughness * (captain ? CAPTAIN.toughness : 1);
    const ship = raiderShip(Tm), st = STATS[id];
    const stats = { ...st, hull: Math.round(st.hull * tough), sails: Math.round(st.sails * tough), crystals: Math.round(st.crystals * tough) };
    const f = makeFlyer(ship, stats, { pos, heading }, { speed: S.pace });
    f.sail = 0.85; f.speed = f.H.vmax * 0.6; f.aimY = Tm.zones.aim.y;
    ship.root.position.copy(pos); ship.root.rotation.y = heading;
    scene.add(ship.root);
    const role = ROLE[id];
    const gun = makeGunnery(ship, { reload: RAIDER.slow * S.reload * (captain ? CAPTAIN.reload : 1), damage: S.damage * (captain ? CAPTAIN.damage : 1) });
    const r = { id, R: Tm.R, name: `Raider ${captain ? 'captain\'s ' + Tm.R.cls : Tm.R.cls}`, captain, ship, f, gun, zones: Tm.zones, role, frozen,
      bounty: BOUNTY[id] * (captain ? CAPTAIN.bounty : 1), aim: RAIDER.aim * S.aim,
      mode: 'attack', timer: 0, side: 1, alt: (Math.random() - 0.5) * (role === 'chaser' ? 50 : 20), counted: false, gone: false };
    ship.update(0, {}); ship.root.updateMatrixWorld(true);
    list.push(r);
    return r;
  }

  // a wave of raiders, 1.5 to 1.9 km ahead of the Captain, more or less, coming in; the first is the captain, if any
  function spawnWave(wave, foe) {
    const base = foe.heading + (Math.random() - 0.5) * 1.4, ids = wave.ids;
    ids.forEach((id, i) => {
      const a = base + (i - (ids.length - 1) / 2) * 0.24, d = 1500 + Math.random() * 400;
      const pos = new THREE.Vector3(foe.pos.x + Math.sin(a) * d, clamp(foe.pos.y + (Math.random() - 0.5) * 160, 200, 2000), foe.pos.z + Math.cos(a) * d);
      spawn(id, pos, a + Math.PI, false, wave.captain && i === 0);
    });
    return base;
  }

  // where to steer: chasers come at the foe bow-first and break away when close; broadside ships keep it abeam
  function steer(r, foe, dt) {
    const me = r.f, L = r.R.length, P = foe.pos, dx = P.x - me.pos.x, dz = P.z - me.pos.z, d = Math.hypot(dx, dz, P.y - me.pos.y);
    const bearing = Math.atan2(dx, dz), rel = wrap(bearing - me.heading);
    r.timer -= dt;
    let want, sailTo = 1;
    if (r.mode === 'break') {
      want = r.breakH;
      if (r.timer <= 0) r.mode = 'attack';
    } else if (r.role === 'chaser' || d > 1500) {
      // an attack run: come at the foe, then peel away, side-on, when close or after 10-15 seconds of chasing
      const ahead = P.clone().addScaledVector(foe.velocity, Math.min(3, d / 250));
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
    return { turn: clamp(-err * 2.2, -1, 1), climb: clamp((wantY - me.pos.y) / 60, -1, 1), sailTo };
  }

  // fire every battery that can reach where the foe will be, a little off
  const off = new THREE.Vector3();
  function shoot(r, foe) {
    for (const b of ['bow', 'port', 'starboard', 'stern']) {
      if (r.gun.ready[b] > 0 || !r.gun.count(b)) continue;
      const m = r.gun.muzzle(b);
      const aim = intercept(m.p, r.f.velocity, foe.aimAt(), foe.velocity, m.K.speed);
      const dist = aim.distanceTo(m.p);
      if (dist > m.K.speed * m.K.life * 0.7 || !r.gun.reaches(b, aim)) continue; // they hold fire till it's worth it
      const e = dist * r.aim + 1.5;
      aim.add(off.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(2 * e));
      r.gun.fire(b, aim, bolts, 'raider', r.f.velocity);
    }
  }

  // every frame: steer, fly, fire, pick the detail level; returns the raiders that went down this frame
  function update(dt, foe, camera) {
    const downed = [];
    const toScreen = 1 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const r of list) {
      const live = !r.f.down;
      if (r.frozen && live) r.ship.update(dt, { calm: true });
      else r.f.update(dt, live && ai && !foe.down ? steer(r, foe, dt) : { turn: 0, climb: 0, sailTo: 0.6 });
      r.ship.root.updateMatrixWorld(true);
      r.gun.update(dt);
      if (live && ai && !r.frozen && !foe.down) shoot(r, foe);
      if (r.f.down && !r.counted) { r.counted = true; downed.push(r); }
      if (r.f.down && (r.f.pos.y < CLOUD_Y - 140 || r.f.down.t > 16)) r.gone = true;
      const size = (r.R.length / Math.max(1, camera.position.distanceTo(r.f.pos))) * toScreen;
      r.ship.detail(size < 0.06 ? 'far' : 'middle', camera.userData.pixelScale ?? 500);
    }
    for (let i = list.length - 1; i >= 0; i--) if (list[i].gone) { scene.remove(list[i].ship.root); list.splice(i, 1); }
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

  function clear() { for (const r of list) scene.remove(r.ship.root); list.length = 0; }
  return { list, spawn, spawnWave, update, hitBy, clear, templates: T, setAI: (on) => { ai = on; } };
}
