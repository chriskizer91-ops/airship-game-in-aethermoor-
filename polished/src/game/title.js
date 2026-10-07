// title.js: the title screen, drawn in Aethermoor itself. The Captain's ship (the one he sails, at full detail) flies a
// slow, gentle circle 700 m up over the Hearthsea and the island city at sunset, leaning into her turn, with the
// camera drifting along with her, the sun low beside her; and two or three raiders cross far off about their own
// business (rust-red sails, at the middle or far detail: they never fight here). Drag the sky to swing the view round
// her.
// The sunset is the title's own (world.js SUNSET): its own sun, sky, clouds and light, and its own sky light on the
// brass, all put back to the voyages' afternoon (DAY) the moment she sails or the port opens. The skies chosen tint it
// a little, blended over a second and a half: Fair Winds clear, Crosswinds breezy, the clouds racing, Maelstrom darker
// and stormy (STORMY), the clouds racing harder. Nothing here is made each frame (a phone draws this first).
import * as THREE from 'three';
import { SHIPS } from '../ships/index.js';
import { SUN, DAY, SUNSET, STORMY, mixLook } from './world.js';

const CITY = { x: 30, z: 180 }; // the island city in the Hearthsea: the middle of her circle
const ORBIT = { r: 520, y: 700 };
// the skies' tints: how far toward the storm, how much more (or less) cloud, and how hard the wind drives the clouds
const TINT = { fair: { storm: 0, cover: -0.05, breeze: 1 }, cross: { storm: 0, cover: 0.03, breeze: 6 }, mael: { storm: 1, cover: 0, breeze: 10 } };
// the raiders crossing: how far off past the middle of her circle (the way the camera looks), how high, how fast,
// which way, and where along their way they start (metres from the middle); a phone has the first two
const LANES = [{ d: 950, y: 790, v: 22, dir: 1, u: -260 }, { d: 1350, y: 880, v: 28, dir: -1, u: 420 }, { d: 1900, y: 740, v: 18, dir: 1, u: -900 }];
const CREWS = ['brig', 'frigate', 'cutter', 'frigate', 'brig', 'skiff'], REACH = 3600; // (each lane's next raider is the next of these)
const SUN_OFF = 400; // how far from her the sun's shadow camera sits, along the light (as main.js)
// the three layouts (as the page's): where she sits on the screen (cx, cy) and the room she has there (vw, vh), all as
// shares of the screen; how far down the camera looks (pitch), how far left of the sun it looks (side: the sun shows
// to her right), how much of her room she fills (fill), and how wide the view is (fov)
const LAYOUT = {
  wide: { cx: 0.68, cy: 0.56, vw: 0.5, vh: 0.9, pitch: 0.15, side: 0.3, fill: 0.74, fov: 50 },
  tall: { cx: 0.5, vw: 1, pitch: 0.05, side: 0.1, fill: 0.6, fov: 60 }, // (cy and vh: from the room above the panel)
  short: { cx: 0.79, cy: 0.55, vw: 0.38, vh: 0.8, pitch: 0.12, side: 0.24, fill: 0.62, fov: 50 },
};
const smooth = (k) => k * k * (3 - 2 * k);

// `lights`: the sun's light, the sky's and the scene (lit by the look); `dayLight()`: the afternoon's sky light on the
// brass, given back when the title closes
export function makeTitle({ renderer, scene, world, lights, art, raiders, shipFor, progress, dayLight, touch = false }) {
  const { sun } = lights;
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 70000);
  let on = false, ship = null, R = null, dusk = null, t = 0, angle = 1.2, yaw = 0, yawV = 0, drag = null, clouds = 0, breeze = 1, skies = null, radius = 10;
  const look = mixLook(SUNSET, SUNSET, 0), from = mixLook(SUNSET, SUNSET, 0), to = mixLook(SUNSET, SUNSET, 0);
  let blend = 1, breezeFrom = 1;
  const pos = new THREE.Vector3(), target = new THREE.Vector3(), dir = new THREE.Vector3(), proj = new THREE.Vector3(), at = new THREE.Vector3();
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
  function setShip() {
    const id = progress.data.flying;
    if (ship && R.id === id) { if (ship.root.parent !== scene) scene.add(ship.root); return; }
    if (ship && ship.root.parent === scene) scene.remove(ship.root);
    R = SHIPS.find((s) => s.id === id); ship = shipFor(R);
    scene.add(ship.root);
    radius = ship.bounds.getSize(at).length() / 2;
    // the sun's shadows: a box round her, sized to her (the voyage sizes it again for hers)
    const r = R.length * 0.85;
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: SUN_OFF - r * 2, far: SUN_OFF + r * 2 });
    sun.shadow.camera.updateProjectionMatrix();
  }

  // ---------- the raiders crossing far off ----------
  const lanes = LANES.slice(0, touch ? 2 : 3).map((L, i) => ({ ...L, n: i, ship: null, R: null, models: {} }));
  function crew(c) {
    if (c.ship) scene.remove(c.ship.root);
    const id = CREWS[c.n % CREWS.length]; c.n += lanes.length;
    c.ship = c.models[id] ??= raiders.model(id); c.R = c.ship.recipe;
    scene.add(c.ship.root);
  }
  // in sight of the camera?
  const seen = (p) => { proj.copy(p).project(camera); return proj.z < 1 && Math.abs(proj.x) < 1.15 && Math.abs(proj.y) < 1.15; };
  // where a lane's raider is: its way runs across the camera's line of sight (fx, fz), `d` past the city
  const spot = (c, fx, fz) => at.set(CITY.x + fx * c.d + fz * c.u, c.y + Math.sin(t * 0.17 + c.d) * 8, CITY.z + fz * c.d - fx * c.u);
  function cross(dt, toScreen, scale) {
    const a = Math.atan2(SUN.x, SUN.z) + lay.side, fx = Math.sin(a), fz = Math.cos(a); // (the way the camera looks, as it settles)
    for (const c of lanes) {
      c.u += c.dir * c.v * dt;
      // past the end of her way and out of sight: the next one starts from the other end
      if (Math.sign(c.u) === c.dir && Math.abs(c.u) > REACH && !seen(spot(c, fx, fz))) { c.u = -c.dir * REACH; crew(c); }
      spot(c, fx, fz);
      const s = c.ship;
      s.root.position.copy(at); s.root.rotation.set(0, Math.atan2(fz * c.dir, -fx * c.dir), 0);
      s.update(dt, still);
      const size = (c.R.length / Math.max(1, camera.position.distanceTo(at))) * toScreen;
      s.detail(size < raiders.detailAt ? 'far' : 'middle', scale);
    }
  }

  // ---------- where she sits on the screen: clear of the title's panel ----------
  // (the same three layouts as the page: on a laptop right of the panel; on a phone held sideways, or any short
  // window, right of it too; on a phone upright above it, in the room it leaves, measured when the title opens or the
  // window changes, and once a second in case the panel grew)
  let lay = LAYOUT.wide, room = 0.4, measured = 0;
  const card = document.querySelector('#title .title-card');
  function resize() { if (on && innerWidth <= 700 && innerHeight > 500) room = Math.max(0.2, Math.min(0.42, card.getBoundingClientRect().top / innerHeight)); }
  function place() {
    const w = innerWidth, h = innerHeight;
    lay = h <= 500 ? LAYOUT.short : w <= 700 ? LAYOUT.tall : LAYOUT.wide;
    const cy = lay === LAYOUT.tall ? room * 0.5 : lay.cy, vh = lay === LAYOUT.tall ? room * 0.85 : lay.vh;
    camera.fov = lay.fov; camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(lay.fov / 2)), fit = Math.min(half * vh, half * camera.aspect * lay.vw);
    camera.setViewOffset(w, h, w / 2 - w * lay.cx, h / 2 - h * cy, w, h);
    return radius / (fit * lay.fill);
  }

  // ---------- each frame ----------
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
    // the view: from beside the sun's way, drifting slowly to and fro, and wherever a drag swung it (easing to a stop)
    if (!drag) { yaw += yawV; yawV *= Math.exp(-dt * 3); }
    const dist = place();
    const view = Math.atan2(SUN.x, SUN.z) + lay.side + Math.sin(t * 0.045) * 0.16 + yaw, pitch = lay.pitch + Math.sin(t * 0.06) * 0.02;
    dir.set(Math.sin(view) * Math.cos(pitch), -Math.sin(pitch), Math.cos(view) * Math.cos(pitch));
    target.copy(pos); target.y += L * 0.22;
    camera.position.copy(target).addScaledVector(dir, -dist);
    camera.lookAt(target); camera.updateMatrixWorld();
    const toScreen = 1 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)), scale = renderer.domElement.height * toScreen;
    ship.glow.material.uniforms.uScale.value = scale;
    cross(dt, toScreen, scale);
    // the sky: the clouds carried on the wind (faster in a breeze), the sun's shadows round her, sails and crystals alive
    clouds += dt * breeze; world.time.value = clouds;
    world.mood.uDrift.value.set(-0.8, 0.6).multiplyScalar(clouds * 4);
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
    dusk ??= world.skyLight(SUNSET);
    scene.environment = dusk;
    aim(progress.data.skies, true);
    world.setLook(look, lights);
    setShip();
    for (const c of lanes) if (!c.ship) crew(c); else scene.add(c.ship.root);
    update(0);
  }
  function leave() {
    if (!on) return;
    on = false; drag = null;
    world.setLook(DAY, lights); world.mood.uDrift.value.set(0, 0);
    scene.environment = dayLight();
    if (ship && ship.root.parent === scene) scene.remove(ship.root);
    for (const c of lanes) if (c.ship) scene.remove(c.ship.root);
  }
  // the drawing context came back (main.js): the sunset's sky light is drawn again
  function relight() { dusk = world.skyLight(SUNSET); if (on) scene.environment = dusk; }

  // ---------- drag to swing the view round her (the title's panel lets presses through to the sky) ----------
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => { if (on) { drag = { x: e.clientX, id: e.pointerId }; yawV = 0; } });
  addEventListener('pointermove', (e) => { if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x; drag.x = e.clientX; yaw -= dx * 0.008; yawV = -dx * 0.008; });
  addEventListener('pointerup', (e) => { if (drag && e.pointerId === drag.id) drag = null; });
  addEventListener('pointercancel', () => { drag = null; });

  return { camera, enter, leave, update, render, relight, resize, look, get on() { return on; }, get ship() { return ship; }, get yaw() { return yaw; }, get skies() { return skies; },
    get raiders() { return lanes.map((c) => c.ship); }, get blend() { return blend; } };
}
