// title.js: the title screen, drawn in Aethermoor itself. The Captain's ship (the one he sails, at full detail) flies a
// slow, gentle circle 700 m up over the Hearthsea and the island city at sunset, leaning into her turn, with the
// camera drifting along with her, the sun low beside her; and two or three raiders cross far off about their own
// business (they never fight here), one after another, so there's nearly always one in sight. Each sails a course
// angled about 30 degrees toward or away from the view, so her rust-red sails show (square sails seen straight from the
// side lie edge-on, leaving bare masts), and each is her far model in one piece, drawn in one go (raiders.js model).
// Drag the sky to swing the view round her; let go, and a moment later it eases back.
// The sunset is the title's own (world.js SUNSET): its own sun, sky, clouds and light, and its own sky light on the
// brass, all put back to the voyages' afternoon (DAY) the moment she sails or the port opens. The skies chosen tint it
// a little, blended over a second and a half: Fair Winds clear, Crosswinds breezy, the clouds racing, Maelstrom darker
// and stormy (STORMY), the clouds racing harder. Nothing here is made each frame (a phone draws this first), and a
// phone draws it in fewer goes than a voyage: the raiders in one piece each, and only her sails, masts and spars, hull
// and deck casting the sun's shadows (the little parts' shadows can't be seen at this size).
import * as THREE from 'three';
import { SHIPS } from '../ships/index.js';
import { SUN, DAY, SUNSET, STORMY, mixLook } from './world.js';

const CITY = { x: 30, z: 180 }; // the island city in the Hearthsea: the middle of her circle
const ORBIT = { r: 520, y: 700 };
// the skies' tints: how far toward the storm, how much more (or less) cloud, and how hard the wind drives the clouds
const TINT = { fair: { storm: 0, cover: -0.05, breeze: 1 }, cross: { storm: 0, cover: 0.03, breeze: 6 }, mael: { storm: 1, cover: 0, breeze: 10 } };
// the wind: the cloud deck's pattern (world.js cover()) moves this many metres for each tick of the clouds' clock, so
// the big clouds are carried the same way, as one sky, and their shadows on the ground with them
const DRIFT = new THREE.Vector2(-0.0022 / 0.00045, -0.0009 / 0.00045);
// the raiders crossing: each on a straight way across the view, beyond her, carried along with her so it stays as far
// off as it started. For each way: how far off (k: a Brig there is k of the view's height long, half way across; a
// Frigate looks bigger, a Cutter smaller), how high (e: over the eye line, as a share of the distance, so they sail just
// above the horizon), about how many seconds a crossing takes (T), which way, how far across the view its first raider
// is when the title opens (at), and how far its course is angled from straight across (tilt, radians: about 30 degrees,
// so her sails show), always further off to the right of the screen and nearer to the left: on a laptop or a phone held
// sideways her ship sits right of the title's card, so the view reaches less far to the right of her than to the left,
// and a course angled the other way would run out of sight only far off to the left. So a raider crossing to the left
// comes on, bow toward the view, and one crossing to the right sails away, stern toward it. A phone held upright has
// the first two (its view is narrow, and all of it is open sky)
const LANES = [{ k: 0.05, e: 0.07, T: 36, dir: 1, at: 0.72, tilt: 0.56 }, { k: 0.034, e: 0.11, T: 46, dir: -1, at: 0.42, tilt: 0.58 }, { k: 0.024, e: 0.045, T: 58, dir: 1, at: 0.12, tilt: 0.54 }];
const CREWS = ['brig', 'frigate', 'cutter', 'frigate', 'brig', 'cutter'], BRIG = 25; // (each way's next raider is the next of these)
const SUN_OFF = 400; // how far from her the sun's shadow camera sits, along the light (as main.js)
// the three layouts (as the page's): where she sits on the screen and the room she has there, as shares of the screen
// (on a laptop, or a phone held sideways, she's right of the title's card, measured: cy and vh here; on a phone held
// upright she's above the panel, measured: cx and vw here); how far down the camera looks (pitch), how far left of the
// sun it looks (side: the sun shows to her right), how much of her room she fills (fill), how wide the view is (fov),
// how many raiders cross (lanes), how much nearer they sail (ships: a phone held sideways has a short screen) and how
// high (lift, times e: on a phone held upright her room is a band of sky over the horizon, and raiders high in it, or
// big, look near, so there they're smaller and sail just over the horizon, clearly far off)
const LAYOUT = {
  wide: { cy: 0.56, vh: 0.9, pitch: 0.15, side: 0.26, fill: 0.74, fov: 50, lanes: 3, ships: 1, lift: 1 },
  tall: { cx: 0.5, vw: 1, pitch: 0.05, side: 0.1, fill: 0.6, fov: 60, lanes: 2, ships: 0.72, lift: 0.3 },
  short: { cy: 0.55, vh: 0.8, pitch: 0.12, side: 0.24, fill: 0.62, fov: 50, lanes: 3, ships: 1.6, lift: 1 },
};
// her parts that cast the sun's shadows on the title on a phone
const SHADE = ['canvas', 'wood', 'hull', 'deck'];
const smooth = (k) => k * k * (3 - 2 * k);

// `lights`: the sun's light, the sky's and the scene (lit by the look); `dayLight()`: the afternoon's sky light on the
// brass, given back when the title closes
export function makeTitle({ renderer, scene, world, lights, art, raiders, shipFor, progress, dayLight, touch = false }) {
  const { sun } = lights;
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 70000);
  let on = false, ship = null, R = null, dusk = null, t = 0, angle = 1.2, clouds = 0, breeze = 1, skies = null, radius = 10;
  const look = mixLook(SUNSET, SUNSET, 0), from = mixLook(SUNSET, SUNSET, 0), to = mixLook(SUNSET, SUNSET, 0);
  let blend = 1, breezeFrom = 1;
  const pos = new THREE.Vector3(), target = new THREE.Vector3(), dir = new THREE.Vector3(), at = new THREE.Vector3();
  const motion = { turn: -0.32, climb: 0 }, still = {};

  // ---------- the skies' tint ----------
  function aim(id, now) {
    const T = TINT[id] ?? TINT.cross;
    skies = id;
    mixLook(look, look, 0, from); breezeFrom = breeze;
    mixLook(SUNSET, STORMY, T.storm, to); to.cover += T.cover; to.breeze = T.breeze;
    blend = now ? 1 : 0;
    if (now) { mixLook(to, to, 0, look); breeze = T.breeze; }
  }

  // ---------- her ship ----------
  // (on a phone, only her big parts cast shadows here: `all` puts them all back, for the port and the sea)
  const shade = (s, all) => s.body.traverse((o) => { if (o.isMesh) o.castShadow = all || !touch || SHADE.includes(o.name); });
  function setShip() {
    const id = progress.data.flying;
    if (!ship || R.id !== id) {
      if (ship) { shade(ship, true); if (ship.root.parent === scene) scene.remove(ship.root); }
      R = SHIPS.find((s) => s.id === id); ship = shipFor(R);
      radius = ship.bounds.getSize(at).length() / 2;
      for (const c of lanes) c.u = null; // (the raiders start afresh, as far off as suits her)
    }
    if (ship.root.parent !== scene) scene.add(ship.root);
    shade(ship, false);
    // the sun's shadows: a box round her, sized to her, every time (a voyage in another ship sizes it for that one)
    const r = R.length * 0.85;
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: SUN_OFF - r * 2, far: SUN_OFF + r * 2 });
    sun.shadow.camera.updateProjectionMatrix();
  }

  // ---------- the raiders crossing far off ----------
  // Each way runs across the view (the way the camera looks as it drifts, but not as it's dragged), angled by its tilt,
  // through a point D metres beyond her and h metres above her (u: how far along it a raider is, plus to the left; dir:
  // which way she sails along it, plus to the left). A raider that has crossed out of sight hands over to the next,
  // which starts just out of sight on the other side; one the view has moved on ahead of waits just out of sight on its
  // side. (They're only ever moved while out of sight)
  const lanes = LANES.map((L, i) => ({ ...L, i, n: i, ship: null, R: null, models: {}, u: null, D: 0, h: 0, v: 0, way: new THREE.Vector3() }));
  function crew(c) {
    if (c.ship) scene.remove(c.ship.root);
    const id = CREWS[c.n % CREWS.length]; c.n += LANES.length;
    c.ship = c.models[id] ??= raiders.model(id); c.R = c.ship.recipe;
    scene.add(c.ship.root);
  }
  // how far off a way is, for the view as it is (dist: hers from the camera), and how high: never nearer than three
  // times her distance, so she's always the nearest
  function settle(c, dist, toScreen) {
    const far = THREE.MathUtils.clamp((BRIG * toScreen) / (c.k * lay.ships), Math.max(300, dist * 3), 2600);
    c.D = far - dist; c.h = camera.position.y - pos.y + far * c.e * lay.lift;
  }
  // the stretch of a way in sight now (span.lo to span.hi, in metres along it), worked out from where it meets the
  // screen's two sides; false when the view looks away from it
  const ahead = new THREE.Vector3(), across = new THREE.Vector3(), PV = new THREE.Matrix4(), c0 = new THREE.Vector4(), cA = new THREE.Vector4(), span = { lo: 0, hi: 0 };
  function inSight(c) {
    at.copy(pos).addScaledVector(ahead, c.D); at.y += c.h;
    c0.set(at.x, at.y, at.z, 1).applyMatrix4(PV); cA.set(c.way.x, 0, c.way.z, 0).applyMatrix4(PV);
    if (c0.w < 10) return false;
    const a = (c0.w - c0.x) / (cA.x - cA.w), b = (-c0.w - c0.x) / (cA.x + cA.w); // (where its picture reaches the right side, and the left)
    if (!Number.isFinite(a) || !Number.isFinite(b) || c0.w + a * cA.w < 10 || c0.w + b * cA.w < 10) return false;
    span.lo = Math.min(a, b); span.hi = Math.max(a, b);
    return true;
  }
  const edge = (c, side) => (side > 0 ? span.hi : span.lo) + side * (c.R.length * 0.6 + 4); // (just out of sight that side)
  function cross(dt, dist, toScreen, drift) {
    const a = Math.atan2(SUN.x, SUN.z) + lay.side + drift; // (the ways drift round with the view, so they keep their angle to it)
    ahead.set(Math.sin(a), 0, Math.cos(a)); across.set(Math.cos(a), 0, -Math.sin(a));
    PV.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    for (const c of lanes) {
      if (c.i >= lay.lanes) { if (c.ship?.root.parent) scene.remove(c.ship.root); continue; } // (a way this view leaves out)
      c.way.copy(across).multiplyScalar(Math.cos(c.tilt)).addScaledVector(ahead, -Math.sin(c.tilt)); // (across: to the screen's left)
      const opening = c.u === null;
      if (!c.ship) crew(c); else if (c.ship.root.parent !== scene) scene.add(c.ship.root);
      if (opening) settle(c, dist, toScreen); else c.u += c.dir * c.v * dt;
      if (inSight(c)) {
        let fresh = opening;
        if (opening) c.u = span.lo + (span.hi - span.lo) * c.at; // (the title opening: part way across)
        else if (c.dir * (c.u - edge(c, c.dir)) > 0) { // past the far side: the next one comes in from the near side
          crew(c); settle(c, dist, toScreen);
          if ((fresh = inSight(c))) c.u = edge(c, -c.dir);
        } else if (c.dir * (c.u - edge(c, -c.dir)) < 0) c.u = edge(c, -c.dir);
        if (fresh) c.v = THREE.MathUtils.clamp((span.hi - span.lo) / c.T, 4, 26);
      } else if (opening) { c.u = 0; c.v = 12; }
      const s = c.ship;
      at.copy(pos).addScaledVector(ahead, c.D).addScaledVector(c.way, c.u); at.y += c.h + Math.sin(t * 0.17 + c.i * 2.1) * 6;
      s.root.position.copy(at); s.root.rotation.set(0, Math.atan2(c.way.x * c.dir, c.way.z * c.dir), 0);
      s.update(dt, still);
    }
  }

  // ---------- where she sits on the screen: clear of the title's panel ----------
  // (the same three layouts as the page: on a laptop right of the card; on a phone held sideways, or any short window,
  // right of it too; on a phone upright above it. The room the card leaves is measured when the title opens or the
  // window changes, and once a second in case the card grew)
  let lay = LAYOUT.wide, room = 0.4, measured = 0;
  const beside = { cx: 0.7, vw: 0.5 };
  const card = document.querySelector('#title .title-card');
  function resize() {
    if (!on) return;
    const b = card.getBoundingClientRect(), w = innerWidth, h = innerHeight;
    if (w <= 700 && h > 500) room = Math.max(0.2, Math.min(0.42, b.top / h));
    else { const lo = b.right / w + 0.01, hi = 0.96; beside.vw = Math.max(0.12, hi - lo); beside.cx = hi - beside.vw / 2; }
  }
  function place() {
    const w = innerWidth, h = innerHeight, was = lay;
    lay = h <= 500 ? LAYOUT.short : w <= 700 ? LAYOUT.tall : LAYOUT.wide;
    if (lay !== was) for (const c of lanes) c.u = null; // (the raiders start afresh across the new view)
    const tall = lay === LAYOUT.tall, cx = tall ? lay.cx : beside.cx, vw = tall ? lay.vw : beside.vw, cy = tall ? room * 0.5 : lay.cy, vh = tall ? room * 0.85 : lay.vh;
    camera.fov = lay.fov; camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(lay.fov / 2)), fit = Math.min(half * vh, half * camera.aspect * vw);
    camera.setViewOffset(w, h, w / 2 - w * cx, h / 2 - h * cy, w, h);
    return radius / (fit * lay.fill);
  }

  // ---------- each frame ----------
  // a drag's swing of the view (radians), how fast it swings (radians a second), how far the finger swung it since the
  // last frame, and how long since it let go (seconds)
  let yaw = 0, yawV = 0, pull = 0, idle = 9, drag = null;
  function update(dt) {
    if (!on) return;
    t += dt;
    if (progress.data.flying !== R.id) setShip(); // (the save from the other device may have another ship)
    if (progress.data.skies !== skies) aim(progress.data.skies);
    if ((measured += dt) > 1) { measured = 0; resize(); }
    if (blend < 1) {
      blend = Math.min(1, blend + dt / 1.5);
      const k = smooth(blend);
      mixLook(from, to, k, look); breeze = breezeFrom + (to.breeze - breezeFrom) * k;
      world.setLook(look, lights);
    }
    // her circle: slow and steady, leaning into the turn, rising and falling a little
    const L = R.length, v = 12 + L * 0.3;
    angle += (dt * v) / ORBIT.r;
    pos.set(CITY.x + Math.sin(angle) * ORBIT.r, ORBIT.y + Math.sin(t * 0.21) * 6, CITY.z + Math.cos(angle) * ORBIT.r);
    motion.climb = Math.cos(t * 0.21) * 0.15;
    ship.root.position.copy(pos); ship.root.rotation.set(0, angle + Math.PI / 2, 0);
    ship.update(dt, motion);
    // the view: from beside the sun's way, drifting slowly to and fro, and wherever a drag swung it. Let go, and it
    // coasts to a stop, then two and a half seconds on eases back the shorter way round (the sun and the raiders back
    // in view). How fast it swings is measured over the frames the drag is held, a second at a time, so the coast is
    // the same at any frame rate (and stands still when no time passes)
    if (dt > 0) {
      if (drag) { yawV += (pull / dt - yawV) * (1 - Math.exp(-dt * 20)); pull = 0; idle = 0; }
      else {
        const k = Math.exp(-dt * 3);
        yaw += (yawV * (1 - k)) / 3; yawV *= k;
        if ((idle += dt) > 2.5) yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw)) * Math.exp(-dt * 0.9);
      }
    }
    const dist = place();
    const drift = Math.sin(t * 0.045) * 0.16, view = Math.atan2(SUN.x, SUN.z) + lay.side + drift + yaw, pitch = lay.pitch + Math.sin(t * 0.06) * 0.02;
    dir.set(Math.sin(view) * Math.cos(pitch), -Math.sin(pitch), Math.cos(view) * Math.cos(pitch));
    target.copy(pos); target.y += L * 0.22;
    camera.position.copy(target).addScaledVector(dir, -dist);
    camera.lookAt(target); camera.updateMatrixWorld();
    const toScreen = 1 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)), scale = renderer.domElement.height * toScreen;
    ship.glow.material.uniforms.uScale.value = scale;
    cross(dt, dist, toScreen, drift);
    // the sky: the clouds carried on the wind (faster in a breeze), the sun's shadows round her, sails and crystals alive
    clouds += dt * breeze; world.time.value = clouds;
    world.mood.uDrift.value.copy(DRIFT).multiplyScalar(clouds);
    world.puffs.follow(pos);
    sun.target.position.copy(pos); sun.position.copy(pos).addScaledVector(SUN, SUN_OFF);
    art.M.canvas.userData.time.value = t;
    art.M.gem.emissiveIntensity = 0.55 + Math.sin(t * 2.4) * 0.09;
  }
  function render() { renderer.render(scene, camera); }

  // ---------- opening and closing ----------
  function enter() {
    if (on) return;
    on = true; resize();
    yaw = yawV = pull = 0; idle = 9; drag = null; // (the view as it's framed, whatever a drag did last time)
    dusk ??= world.skyLight(SUNSET);
    scene.environment = dusk;
    aim(progress.data.skies, true);
    world.setLook(look, lights);
    setShip();
    update(0); // (and the raiders put back in the sky)
  }
  function leave() {
    if (!on) return;
    on = false; drag = null;
    world.setLook(DAY, lights); world.mood.uDrift.value.set(0, 0);
    scene.environment = dayLight();
    if (ship) { shade(ship, true); if (ship.root.parent === scene) scene.remove(ship.root); }
    for (const c of lanes) if (c.ship) scene.remove(c.ship.root);
  }
  // the drawing context came back (main.js): the sunset's sky light is drawn again
  function relight() { dusk = world.skyLight(SUNSET); if (on) scene.environment = dusk; }

  // ---------- drag to swing the view round her (the title's panel lets presses through to the sky) ----------
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => { if (on) { drag = { x: e.clientX, id: e.pointerId }; pull = yawV = 0; } }); // (a finger landing stops the coast)
  addEventListener('pointermove', (e) => { if (!drag || e.pointerId !== drag.id) return; const d = (drag.x - e.clientX) * 0.008; drag.x = e.clientX; yaw += d; pull += d; });
  addEventListener('pointerup', (e) => { if (drag && e.pointerId === drag.id) drag = null; });
  addEventListener('pointercancel', () => { drag = null; });

  return { camera, enter, leave, update, render, relight, resize, look, get on() { return on; }, get ship() { return ship; }, get yaw() { return yaw; }, get skies() { return skies; },
    get raiders() { return lanes.slice(0, lay.lanes).map((c) => c.ship); }, get blend() { return blend; } };
}
