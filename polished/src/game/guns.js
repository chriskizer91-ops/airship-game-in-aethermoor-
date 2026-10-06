// guns.js: a ship's guns as the game sees them. Every gun fires from where it really sits on the model, in the
// direction it really points, and only tilts a little; the camera's direction picks which battery fires (bow,
// port broadside, starboard broadside or stern), and the shots are glowing crystal bolts that take time to fly, like
// comets: a hot head and a long tail fading out behind.
// A battery doesn't go off all at once: its guns ripple off from bow to stern, a quick drum-roll down the side (both
// decks of a big ship together), and each gun tells the game (events.js `fire`), which answers with its flame and
// gunsmoke (fx.js). A broadside's recoil heels the ship away from the side that fired.
import * as THREE from 'three';
import { emit, payload } from './events.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
// Bigger ships carry bigger guns: each shot's weight is scaled by the ship's class
export const GUN_WEIGHT = { skiff: 0.8, cutter: 0.9, brig: 1, frigate: 1.1, galleon: 1.15, manowar: 1.25 };
// Long-focus chasers are fast, light and accurate; short-focus broadsides are heavy, slower and spread a little
export const KINDS = {
  chaser: { speed: 430, damage: 28, reload: 1.1, yaw: 0.62, pitch: 0.26, spread: 0.002, life: 3.2, size: 1 },
  broadside: { speed: 320, damage: 55, reload: 2.6, yaw: 0.75, pitch: 0.16, spread: 0.012, life: 2.6, size: 1.35 },
};

// Where each gun's muzzle is on a built ship (its own frame), and which way it points
export function gunsOf(ship) {
  const R = ship.recipe, hull = ship.hull, B = { bow: [], stern: [], port: [], starboard: [] };
  for (const g of R.bowGuns ?? []) B.bow.push({ p: V(g.x, g.y, g.z + g.len + 0.35), d: V(0, 0, 1), kind: 'chaser' });
  for (const g of R.swivels ?? []) { const sx = Math.sign(g.x); (sx > 0 ? B.port : B.starboard).push({ p: V(g.x + sx * (g.len + 0.3), g.y + R.rail.h * 0.9, g.z), d: V(sx, 0, 0), kind: 'chaser' }); }
  for (const g of R.sternGuns ?? []) {
    const z = g.port ? hull.zs + 0.3 - g.len - 0.15 : g.z - g.len - 0.15;
    B.stern.push({ p: V(g.x, g.y, z), d: V(0, 0, -1), kind: 'chaser' });
  }
  if (R.ports) for (const side of [1, -1]) for (const y of [].concat(R.ports.y)) for (const z of R.ports.z) {
    const t = hull.tAt(z, y), p = hull.at(z, t, side), n = hull.normal(z, t, side);
    // the guns sit level in their ports, pointing straight out from the side (the hull itself curves away below)
    (side > 0 ? B.port : B.starboard).push({ p: V(...p).addScaledVector(n, 0.75 * R.ports.h), d: n.clone().setY(0).normalize(), kind: 'broadside' });
  }
  return B;
}

// Which battery faces a direction, given the angle between it and the bow (radians, + towards port)
export function batteryFor(rel) {
  const a = Math.atan2(Math.sin(rel), Math.cos(rel));
  if (Math.abs(a) < 0.87) return 'bow';
  if (Math.abs(a) > 2.27) return 'stern';
  return a > 0 ? 'port' : 'starboard';
}
export const BATTERY_NAMES = { bow: 'Bow guns', stern: 'Stern guns', port: 'Port broadside', starboard: 'Starboard broadside' };

// Where to aim to hit a moving ship: a bolt takes on its ship's speed when fired, so it's where the target will be
// relative to the shooter when the bolt gets there, raised a little for the bolt's slow fall (G below). Written into
// `out` (a new vector if none is given); these run for every gun every frame, so they make nothing new themselves
const G = 9.8 * 0.15;
const rel = new THREE.Vector3(), tf = new THREE.Vector3(), ts = new THREE.Vector3(), th = new THREE.Vector3();
export function intercept(from, shooterVel, target, targetVel, speed, out = new THREE.Vector3()) {
  rel.copy(targetVel).sub(shooterVel); out.copy(target);
  let t = 0;
  for (let i = 0; i < 3; i++) { t = out.distanceTo(from) / speed; out.copy(target).addScaledVector(rel, t); }
  out.y += 0.5 * G * t * t;
  return out;
}

// Turn `want` towards `axis` until it's inside the gun's swing (yaw) and tilt (pitch), measured in the gun's own frame
export function clampToArc(want, axis, yawMax, pitchMax, out = new THREE.Vector3()) {
  const f = tf.copy(axis).setY(0).normalize(), side = ts.set(-f.z, 0, f.x); // side: f turned a quarter
  const h = th.copy(want).setY(0);
  const yaw = Math.max(-yawMax, Math.min(yawMax, Math.atan2(h.dot(side), h.dot(f))));
  const base = Math.atan2(axis.y, Math.hypot(axis.x, axis.z));
  const pitch = base + Math.max(-pitchMax, Math.min(pitchMax, Math.atan2(want.y, Math.hypot(want.x, want.z)) - base));
  out.copy(f).multiplyScalar(Math.cos(yaw)).addScaledVector(side, Math.sin(yaw));
  return out.multiplyScalar(Math.cos(pitch)).setY(Math.sin(pitch)).normalize();
}

// Send the first `n` items of a buffer that changes every frame to the graphics card, and only those (nothing at all
// when there are none: then nothing of it is drawn)
export function upload(attr, n) {
  if (n <= 0) return;
  attr.clearUpdateRanges(); attr.addUpdateRange(0, n * attr.itemSize); attr.needsUpdate = true;
}


// All the bolts in flight, for every ship, drawn as one batch of glowing streaks; their hot heads are glows in fx.js.
// The Captain's bolts burn gold, the raiders' burn red. Each streak tapers from its head and fades out along its tail
// (grown out of the muzzle as it flies, so it never pokes back through the ship that fired it). A bolt that flies its
// full time without hitting anything burns out in a little wisp of sparks.
// The bolts are a handful of objects used over and over (`bolts` is the ones in flight), so firing makes nothing new.
export const BOLT_COLORS = { player: 0xffb347, raider: 0xff4636 };
export const TAIL = 36; // the longest tail, in metres (times the shot's size: a broadside's is heavier)
export function makeBolts(scene, fx, max = 400) {
  const geo = new THREE.CylinderGeometry(0.26, 0.05, 1, 6, 1, true).rotateX(Math.PI / 2); // thick at the head (+z)
  const ramp = new Uint8Array(32 * 4); // the fade along the tail: nothing at its end, full at the head
  for (let i = 0; i < 32; i++) ramp.fill(Math.round((i / 31) ** 2 * 255), i * 4, i * 4 + 4);
  const fade = new THREE.DataTexture(ramp, 1, 32); fade.magFilter = fade.minFilter = THREE.LinearFilter; fade.needsUpdate = true;
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: fade, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const mesh = new THREE.InstancedMesh(geo, mat, max);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; mesh.count = 0;
  mesh.setColorAt(0, new THREE.Color()); mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);
  const COL = {}, HEAD = {};
  for (const k in BOLT_COLORS) { COL[k] = new THREE.Color(BOLT_COLORS[k]); HEAD[k] = COL[k].clone().lerp(new THREE.Color(0xffffff), 0.3); }

  const bolts = [], free = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), FWD = V(0, 0, 1), mid = new THREE.Vector3(), size3 = new THREE.Vector3(), sv = new THREE.Vector3();
  const made = () => ({ p: new THREE.Vector3(), prev: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, K: null, owner: 'player', damage: 0, flown: 0, flare: 0, whiz: false });
  // a bolt from `from` along `dir` (both read, not kept), carrying the firing ship's velocity `inherit`
  function fire(from, dir, kind, owner, inherit, weight = 1) {
    if (bolts.length >= max) return null;
    const K = KINDS[kind], b = free.pop() ?? made();
    b.p.copy(from); b.prev.copy(from);
    b.v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(K.spread * 2).add(dir).normalize().multiplyScalar(K.speed);
    if (inherit) b.v.add(inherit);
    b.life = K.life; b.K = K; b.owner = COL[owner] ? owner : 'player'; b.damage = K.damage * weight; b.flown = 0; b.flare = 0; b.whiz = false;
    bolts.push(b);
    return b;
  }
  const drop = (i) => { free.push(bolts[i]); bolts[i] = bolts[bolts.length - 1]; bolts.pop(); };
  // move everything; `hit(bolt, a, b)` is asked for each bolt's path this frame and returns true when it hit something
  function update(dt, hit) {
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i];
      b.prev.copy(b.p); b.v.y -= G * dt; b.p.addScaledVector(b.v, dt); b.life -= dt; b.flown += b.v.length() * dt;
      if (b.flare > 0) b.flare -= dt;
      if (b.life <= 0 || b.p.y < 0) {
        // burnt out in the air: a little wisp of sparks in its colour
        if (b.p.y >= 0) for (let k = 0; k < 3; k++) fx.spark(b.p, sv.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(8).addScaledVector(b.v, 0.08), 0.4, 2.2 * b.K.size, BOLT_COLORS[b.owner]);
        drop(i); continue;
      }
      if (hit(b, b.prev, b.p)) drop(i);
    }
    for (let i = 0; i < bolts.length; i++) {
      const b = bolts[i], K = b.K, len = Math.min(Math.min(TAIL, b.v.length() * 0.075) * K.size, b.flown + 1);
      q.setFromUnitVectors(FWD, sc.copy(b.v).normalize());
      m4.compose(mid.copy(b.p).addScaledVector(sc, -len / 2), q, size3.set(K.size, K.size, len));
      mesh.setMatrixAt(i, m4); mesh.setColorAt(i, COL[b.owner]);
      const h = HEAD[b.owner];
      fx.glowAt(b.p, h.r, h.g, h.b, (K === KINDS.broadside ? 6 : 4.5) * K.size * (b.flare > 0 ? 2.5 : 1)); // a near miss flares
    }
    mesh.count = bolts.length; upload(mesh.instanceMatrix, bolts.length); upload(mesh.instanceColor, bolts.length);
  }
  const clear = () => { for (const b of bolts) free.push(b); bolts.length = 0; mesh.count = 0; };
  return { fire, update, bolts, clear, mesh };
}

// A ship's gunnery: reload clocks per battery, and firing the battery that faces the aim point.
// `reload` stretches or shortens the reload, `damage` makes each shot heavier or lighter (upgrades, crystal power, and
// the raiders' slower crews). `flyer` (flight.js), if given, heels as her broadsides go off.
// A battery's guns go off one after another, bow first: a broadside one port every 55 ms (both decks together), the
// whole side in at most 0.55 s; a pair of chasers 80 ms apart. Its first gun fires at once, and its reload starts then.
export const RIPPLE = { step: 0.055, span: 0.55, pair: 0.08 };
const PENDING = 32; // guns waiting their turn, at most, per ship
export function makeGunnery(ship, { reload: slow = 1, damage = 1 } = {}, flyer = null) {
  const B = gunsOf(ship), R = ship.recipe, ready = { bow: 0, stern: 0, port: 0, starboard: 0 }, weight = damage * (GUN_WEIGHT[R.id] ?? 1);
  const world = new THREE.Vector3(), dirW = new THREE.Vector3(), nm = new THREE.Matrix3(), want = new THREE.Vector3(), arc = new THREE.Vector3();
  const M = { p: new THREE.Vector3(), d: new THREE.Vector3(), K: null }; // the muzzle last asked for (kept, not made each time)
  const reload = (b) => (B[b][0] ? KINDS[B[b][0].kind].reload * slow : 1);
  // each gun's turn, after the battery's first (seconds), and the battery's guns in that order
  for (const b in B) {
    const list = B[b];
    if (b === 'bow' || b === 'stern') list.forEach((g, i) => { g.delay = i * RIPPLE.pair; });
    else {
      const zs = [...new Set(list.map((g) => Math.round(g.p.z * 100)))].sort((a, c) => c - a); // port positions, bow first
      const step = zs.length > 1 ? Math.min(RIPPLE.step, RIPPLE.span / (zs.length - 1)) : 0;
      for (const g of list) g.delay = zs.indexOf(Math.round(g.p.z * 100)) * step;
    }
    list.sort((a, c) => a.delay - c.delay);
  }
  // what each battery's volley is aiming at (a point read as each gun fires, or a function that works it out from
  // where that gun is), with an aiming error added, who fired, and the ship's velocity (read as each gun fires)
  const V0 = new THREE.Vector3(), ctx = {};
  for (const b in B) ctx[b] = { aim: null, off: new THREE.Vector3(), owner: '', inherit: null, bolts: null, n: 0 };
  // the guns waiting their turn: which, how long still, which battery, their place in the volley
  const pg = new Array(PENDING).fill(null), pt = new Float64Array(PENDING), pb = new Array(PENDING).fill(''), pi = new Int16Array(PENDING);
  let np = 0;
  const FIRE = payload('fire'), VOLLEY = payload('volley');
  function shot(g, b, i) {
    const c = ctx[b], K = KINDS[g.kind];
    world.copy(g.p).applyMatrix4(ship.body.matrixWorld);
    dirW.copy(g.d).applyMatrix3(nm).normalize();
    if (typeof c.aim === 'function') c.aim(world, K, want); else want.copy(c.aim);
    want.add(c.off).sub(world).normalize();
    c.bolts.fire(world, clampToArc(want, dirW, K.yaw, K.pitch, arc), g.kind, c.owner, c.inherit, weight);
    FIRE.owner = c.owner; FIRE.kind = g.kind; FIRE.battery = b; FIRE.p.copy(world); FIRE.dir.copy(dirW); FIRE.weight = weight; FIRE.ship = R.id;
    FIRE.vel.copy(c.inherit ?? V0); FIRE.i = i; FIRE.n = c.n;
    emit('fire', FIRE);
    // the recoil heels her away from the side that fired (a bigger ship, less)
    if (flyer && g.kind === 'broadside') flyer.heelV += Math.sign(g.d.x) * 0.012 * weight * (25 / R.length);
  }
  return {
    B, ready, reload,
    count: (b) => B[b].length,
    get pending() { return np; },
    // the reload clocks, and the guns whose turn has come (from where the ship is now)
    update(dt) {
      for (const k in ready) ready[k] = Math.max(0, ready[k] - dt);
      if (!np) return;
      let due = false;
      for (let j = 0; j < np; j++) if ((pt[j] -= dt) <= 0) due = true;
      if (!due) return;
      nm.getNormalMatrix(ship.body.matrixWorld);
      for (let j = np - 1; j >= 0; j--) {
        if (pt[j] > 0) continue;
        const g = pg[j], b = pb[j], i = pi[j];
        np--; pg[j] = pg[np]; pt[j] = pt[np]; pb[j] = pb[np]; pi[j] = pi[np]; pg[np] = null;
        shot(g, b, i);
      }
    },
    // the guns still waiting don't fire (a fresh voyage, or the ship going down)
    cancel() { for (let j = 0; j < np; j++) pg[j] = null; np = 0; },
    // the middle gun of a battery, in the world: where it is, which way it points, and its kind (the same object each
    // time: read it before asking for another battery's)
    muzzle(b) {
      const g = B[b][B[b].length >> 1]; if (!g) return null;
      nm.getNormalMatrix(ship.body.matrixWorld);
      M.p.copy(g.p).applyMatrix4(ship.body.matrixWorld); M.d.copy(g.d).applyMatrix3(nm).normalize(); M.K = KINDS[g.kind];
      return M;
    },
    // can battery b reach this point? (inside its swing and tilt, and its range); `m` is its muzzle, if already known
    reaches(b, aim, m = this.muzzle(b)) {
      if (!m) return false;
      want.copy(aim).sub(m.p); const dist = want.length(); want.normalize();
      return dist < m.K.speed * m.K.life * 0.92 && want.angleTo(clampToArc(want, m.d, m.K.yaw, m.K.pitch, arc)) < 0.02;
    },
    // fire battery b: `aim` is a point (world, read again as each gun's turn comes) or a function (from, K, out) that
    // works out where a gun at `from` should aim; `off` (optional) is added to it. Returns how many guns will fire
    fire(b, aim, bolts, owner, inherit, off) {
      if (ready[b] > 0 || !B[b].length) return 0;
      ship.root.updateWorldMatrix(true, true); // where the ship is now, not where it was last drawn
      nm.getNormalMatrix(ship.body.matrixWorld);
      const c = ctx[b], list = B[b];
      c.aim = aim; c.bolts = bolts; c.owner = owner; c.inherit = inherit ?? null; c.n = list.length;
      if (off) c.off.copy(off); else c.off.set(0, 0, 0);
      VOLLEY.owner = owner; VOLLEY.battery = b; VOLLEY.count = list.length; VOLLEY.kind = list[0].kind; VOLLEY.ship = R.id;
      VOLLEY.p.copy(list[list.length >> 1].p).applyMatrix4(ship.body.matrixWorld);
      emit('volley', VOLLEY);
      for (let i = 0; i < list.length; i++) {
        const g = list[i];
        if (g.delay > 0 && np < PENDING) { pg[np] = g; pt[np] = g.delay; pb[np] = b; pi[np++] = i; } else shot(g, b, i);
      }
      ready[b] = reload(b);
      return list.length;
    },
  };
}
