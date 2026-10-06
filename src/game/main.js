// main.js: Skies of Aethermoor, stage one. Fly any of the Captain's four ships over Chris's map, swing the camera round
// the ship to aim, and fire whichever guns face where you look at the practice targets floating near the start.
// Works on a laptop (keyboard and mouse, full detail) and on a phone (touch stick, aiming drag, buttons).
import * as THREE from 'three';
import { loadShipArt } from '../ship/materials.js';
import { buildShip } from '../ship/build.js';
import { SHIPS, STATS } from '../ships/index.js';
import { makeWorld, makeTargets, regionAt, SUN, HAZE, MAP, THINNING } from './world.js';
import { makeInput } from './input.js';
import { makePlayer } from './player.js';
import { makeBolts, makeGunnery, batteryFor, BATTERY_NAMES } from './guns.js';
import minimapUrl from '../../assets/map/minimap.webp';

const $ = (id) => document.getElementById(id);
const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1 && matchMedia('(hover: none)').matches;

async function main() {
  if (touch) document.body.classList.add('touch');
  const canvas = $('stage');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.6 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(HAZE, 4000, 34000);
  const camera = new THREE.PerspectiveCamera(55, 1, 1, 70000);
  const [world, art] = await Promise.all([makeWorld(renderer), loadShipArt(renderer)]);
  scene.add(world.group);

  // the day sky lights the brass
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene(); envScene.add(world.group.children[0].clone());
  scene.environment = pmrem.fromScene(envScene, 0.04, 1, 60000).texture;
  scene.environmentIntensity = 0.9;
  const hemi = new THREE.HemisphereLight(0xc3dcff, 0x7c8a5c, 0.75);
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.6);
  sun.castShadow = true; sun.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
  scene.add(hemi, sun, sun.target);

  // ---------- the ship you fly ----------
  const built = new Map();
  const shipFor = (R) => { if (!built.has(R.id)) built.set(R.id, buildShip(R, 'full', art)); return built.get(R.id); };
  const start = { pos: new THREE.Vector3(0, 680, 2600), heading: Math.PI };
  let player = null, gunnery = null, lastId = null;
  function fly(id) {
    const R = SHIPS.find((s) => s.id === id), ship = shipFor(R);
    const keep = player ? { pos: player.pos.clone(), heading: player.heading } : start;
    if (player) scene.remove(player.ship.root);
    player = makePlayer(ship, STATS[id], keep);
    gunnery = makeGunnery(ship);
    scene.add(ship.root);
    const r = R.length * 0.85;
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 8 });
    sun.shadow.camera.updateProjectionMatrix();
    cam.dist = camDistFor(R);
    $('ship-name').textContent = R.name; $('ship-cls').textContent = `${R.cls} · ${R.length} m`;
    for (const b of $('ships').children) b.setAttribute('aria-pressed', String(b.dataset.ship === id));
    lastId = id;
  }

  // ---------- the camera: behind the ship, swung round it by the mouse or a drag ----------
  const cam = { yaw: 0, pitch: 0.2, dist: 40, zoom: 1, look: new THREE.Vector3() };
  const camDistFor = (R) => R.length * 1.35 + 16;
  const aimPoint = new THREE.Vector3();
  function placeCamera(dt, inp) {
    const sens = inp.locked ? 0.0026 : touch ? 0.0042 : 0.005;
    cam.yaw -= inp.look.x * sens;
    cam.pitch = THREE.MathUtils.clamp(cam.pitch + inp.look.y * sens, -0.35, 1.25);
    cam.zoom = THREE.MathUtils.clamp(cam.zoom * Math.pow(1.12, inp.zoom), 0.55, 2.6);
    // left alone for a while (and not mouse-locked), the camera eases back behind the ship
    const idle = performance.now() / 1000 - inp.lastLook;
    if (!inp.locked && idle > 3.5 && !inp.fire) {
      const k = 1 - Math.exp(-dt * 1.2);
      cam.yaw = Math.atan2(Math.sin(cam.yaw), Math.cos(cam.yaw)) * (1 - k); cam.pitch += (0.2 - cam.pitch) * k;
    }
    const a = player.heading + cam.yaw, R = player.ship.recipe;
    cam.look.set(Math.sin(a) * Math.cos(cam.pitch), -Math.sin(cam.pitch), Math.cos(a) * Math.cos(cam.pitch));
    const target = player.pos.clone().add(new THREE.Vector3(0, R.length * 0.42 + 2, 0));
    camera.position.copy(target).addScaledVector(cam.look, -cam.dist * cam.zoom);
    camera.lookAt(target);
    // aim along the middle of the screen: at a target if one is under the crosshair, otherwise 800 m out
    const ray = new THREE.Ray(camera.position, cam.look);
    aimPoint.copy(target).addScaledVector(cam.look, 800);
    let best = 2500;
    for (const t of targets.list) if (t.alive) {
      const d = ray.distanceSqToPoint(t.obj.position), along = t.obj.position.clone().sub(camera.position).dot(cam.look);
      if (d < (t.radius * 2.5) ** 2 && along > 0 && along < best) { best = along; aimPoint.copy(t.obj.position); }
    }
  }

  // ---------- practice targets near the start ----------
  const targets = makeTargets(16, new THREE.Vector3(0, 0, 1200));
  scene.add(targets.group);
  let hits = 0;
  const bolts = makeBolts(scene);
  const seg = new THREE.Line3(), closest = new THREE.Vector3();
  function hitTest(b, a, c) {
    if (b.owner !== 'player') return false;
    seg.set(a, c);
    for (const t of targets.list) {
      if (!t.alive) continue;
      seg.closestPointToPoint(t.obj.position, true, closest);
      if (closest.distanceTo(t.obj.position) < t.radius) {
        t.alive = false; t.respawn = 9; t.obj.visible = false; hits++; $('score-n').textContent = hits;
        bolts.burst(t.obj.position, 0x9fe7ff, 46, 1.6);
        return true;
      }
    }
    return false;
  }

  // ---------- the ship buttons and the help ----------
  for (const R of SHIPS) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.ship = R.id; b.innerHTML = `<b>${R.name}</b><small>${R.cls}</small>`;
    b.addEventListener('click', () => fly(R.id));
    $('ships').append(b);
  }
  const toggleHelp = () => { const h = $('help'); h.hidden = !h.hidden; $('btn-help').hidden = !h.hidden; };
  $('btn-help').addEventListener('click', toggleHelp);
  const mini = $('minimap'), mctx = mini.getContext('2d'), mimg = new Image(); mimg.src = minimapUrl;
  mini.addEventListener('click', () => { mini.classList.toggle('big'); });

  const input = makeInput(canvas, document.body);
  canvas.addEventListener('pointerdown', () => setTimeout(() => $('touch-hint').classList.add('gone'), 4000), { once: true });
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = w < h ? 68 : 55; camera.updateProjectionMatrix();
    camera.userData.pixelScale = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const s of built.values()) s.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    const r = mini.getBoundingClientRect(); mini.width = Math.round(r.width * devicePixelRatio); mini.height = Math.round(r.height * devicePixelRatio);
  }
  addEventListener('resize', resize);
  fly(touch ? 'skiff' : 'brig');
  resize();

  // ---------- the HUD ----------
  const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  let region = '', regionTimer = 0, hudTimer = 0;
  function hud(dt, battery) {
    hudTimer -= dt;
    const n = gunnery.count(battery), rl = gunnery.ready[battery], full = gunnery.reload(battery);
    $('battery-name').textContent = n ? BATTERY_NAMES[battery] : `No ${BATTERY_NAMES[battery].toLowerCase()}`;
    $('battery-count').textContent = n ? `${n} gun${n > 1 ? 's' : ''}` : '–';
    $('reload-bar').style.width = `${n ? (1 - rl / full) * 100 : 0}%`;
    if (hudTimer > 0) return;
    hudTimer = 0.1;
    $('r-speed').textContent = `${Math.round(player.speed * 3.6)} km/h`;
    $('r-height').textContent = `${Math.round(player.pos.y).toLocaleString()} m`;
    $('r-sail').textContent = `${Math.round(player.sail * 100)}%`;
    $('sail-bar').style.width = `${player.sail * 100}%`;
    // heading: north is up the map (-z)
    const deg = ((180 - THREE.MathUtils.radToDeg(player.heading)) % 360 + 360) % 360;
    $('compass').textContent = `${COMPASS[Math.round(deg / 45) % 8]} ${Math.round(deg)}°`;
    const w = $('warn');
    if (player.pos.y > THINNING - 350) { w.hidden = false; w.textContent = 'Nearing the Thinning: the crystals can\'t lift you higher'; }
    else if (Math.abs(player.pos.x) > MAP.w / 2 + 1500 || Math.abs(player.pos.z) > MAP.h / 2 + 1500) { w.hidden = false; w.textContent = 'Open sea: Aethermoor is behind you'; }
    else w.hidden = true;
    const r = regionAt(player.pos.x, player.pos.z);
    if (r !== region && (regionTimer -= 0.1) <= 0) { region = r; regionTimer = 2; const el = $('region'); el.textContent = r; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); }
    // the corner map, with the ship as a gold arrow
    if (mimg.complete && mimg.naturalWidth) {
      const W = mini.width, H = mini.height;
      mctx.drawImage(mimg, 0, 0, W, H);
      const x = (player.pos.x / MAP.w + 0.5) * W, y = (player.pos.z / MAP.h + 0.5) * H, s = Math.max(5, W / 40);
      mctx.save(); mctx.translate(x, y); mctx.rotate(-player.heading + Math.PI);
      mctx.fillStyle = '#e2bd67'; mctx.strokeStyle = '#3a1631'; mctx.lineWidth = Math.max(1.5, s / 4);
      mctx.beginPath(); mctx.moveTo(0, -s * 1.3); mctx.lineTo(s * 0.8, s); mctx.lineTo(0, s * 0.45); mctx.lineTo(-s * 0.8, s); mctx.closePath(); mctx.fill(); mctx.stroke();
      mctx.restore();
      for (const t of targets.list) if (t.alive) { mctx.fillStyle = '#9fe7ff'; mctx.fillRect((t.obj.position.x / MAP.w + 0.5) * W - 1.5, (t.obj.position.z / MAP.h + 0.5) * H - 1.5, 3, 3); }
    }
  }

  let last = performance.now(), time = 0, held = null;
  // one step of the game: controls, flying, the camera, the guns, the targets, the HUD
  function tick(dt) {
    time += dt;
    const inp = held ?? input.read();
    for (const k of inp.pressed) {
      if (k >= '1' && k <= '4') fly(SHIPS[+k - 1].id);
      else if (k === 'c') { cam.yaw = 0; cam.pitch = 0.2; }
      else if (k === 'm') mini.classList.toggle('big');
      else if (k === 'h') toggleHelp();
    }
    player.update(dt, inp);
    placeCamera(dt, inp);
    const battery = batteryFor(cam.yaw);
    gunnery.update(dt);
    if (inp.fire) gunnery.fire(battery, aimPoint, bolts, 'player', player.velocity);
    bolts.update(dt, hitTest, camera);
    for (const t of targets.list) {
      if (!t.alive && (t.respawn -= dt) <= 0) { t.alive = true; t.obj.visible = true; }
      t.obj.position.y = t.home.y + Math.sin(time * 0.8 + t.phase) * 4; t.obj.rotation.y += dt * 0.6;
    }
    world.time.value = time;
    world.puffs.follow(player.pos);
    sun.target.position.copy(player.pos); sun.position.copy(player.pos).addScaledVector(SUN, 400);
    art.M.canvas.userData.time.value = time;
    art.M.gem.emissiveIntensity = 0.55 + Math.sin(time * 2.4) * 0.09;
    player.ship.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    hud(dt, battery);
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    tick(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.body.classList.add('ready');

  // for tools/check.mjs
  window.__game = {
    ready: true, get player() { return player; }, get gunnery() { return gunnery; }, cam, fly, input, targets, bolts, get hits() { return hits; }, renderer, camera,
    // run the game's clock without drawing, holding these controls (for tests on slow software rendering)
    step(seconds, controls = {}) {
      held = { turn: 0, climb: 0, sail: 0, fire: false, look: { x: 0, y: 0 }, zoom: 0, pressed: new Set(), lastLook: performance.now() / 1000, locked: false, ...controls };
      for (let t = 0; t < seconds; t += 1 / 60) tick(1 / 60);
      held = null;
    },
  };
}

main().catch((err) => {
  console.error(err);
  const e = $('error'); e.hidden = false; e.textContent = `The game couldn't start: ${err.message}`;
});
