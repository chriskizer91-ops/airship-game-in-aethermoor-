// main.js: Skies of Aethermoor. The title screen (choose your skies), the port (choose and upgrade your ship), and
// voyages: set sail over Chris's map and fight off waves of raiders, each harder than the last. Swing the camera round
// the ship to aim, and whichever guns face where you look fire. Shots tear the hull, the sails or the crystals
// (docs/ships.md). Downed raiders spill Crystal Shards to fly through and gather; after each wave, sail on or go back
// to port to keep them. Lose the ship and the crew get her home with half.
// Works on a laptop (keyboard and mouse, full detail) and on a phone (touch stick, aiming drag, buttons).
import * as THREE from 'three';
import { loadShipArt } from '../ship/materials.js';
import { buildShip } from '../ship/build.js';
import { SHIPS, FLEET } from '../ships/index.js';
import { makeWorld, regionAt, SUN, HAZE, MAP, THINNING } from './world.js';
import { makeInput } from './input.js';
import { makeFlyer, WIND, windHelp } from './flight.js';
import { makeBolts, makeGunnery, batteryFor, BATTERY_NAMES, intercept } from './guns.js';
import { makeRaiders, waveAt } from './raiders.js';
import { makeProgress, SKIES } from './progress.js';
import { loadout } from './mods.js';
import { makePickups } from './pickups.js';
import { makePort } from './port.js';
import { hitZones, firstHit } from './damage.js';
import { makeSmoke, smokeFrom } from './effects.js';
import minimapUrl from '../../assets/map/minimap.webp';

const $ = (id) => document.getElementById(id);
const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1 && matchMedia('(hover: none)').matches;
const PARTS = ['hull', 'sails', 'crystals'];
const COMPASS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
const compassDeg = (heading) => ((180 - THREE.MathUtils.radToDeg(heading)) % 360 + 360) % 360; // north is up the map (-z)
const NUMBER = ['', 'a', 'two', 'three', 'four', 'five', 'six'];
const SUN_OFF = 400; // how far from the ship the sun's shadow camera sits, along the light

async function main() {
  if (touch) document.body.classList.add('touch');
  const canvas = $('stage');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.6 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(HAZE, 4000, 34000);
  const camera = new THREE.PerspectiveCamera(55, 1, 1, 70000);
  const [world, art] = await Promise.all([makeWorld(renderer), loadShipArt(renderer)]);
  scene.add(world.group);

  // the day sky lights the brass: a blurred picture of it, drawn once (and again if the drawing context is lost)
  const envScene = new THREE.Scene(); envScene.add(world.group.children[0].clone());
  const skyLight = () => { const pmrem = new THREE.PMREMGenerator(renderer), t = pmrem.fromScene(envScene, 0.04, 1, 60000).texture; pmrem.dispose(); return t; };
  scene.environment = skyLight();
  scene.environmentIntensity = 0.9;
  const hemi = new THREE.HemisphereLight(0xc3dcff, 0x7c8a5c, 0.75);
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.6);
  sun.castShadow = true; sun.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
  scene.add(hemi, sun, sun.target);

  const progress = makeProgress(), skies = () => SKIES[progress.data.skies];
  const bolts = makeBolts(scene), smoke = makeSmoke(scene), pickups = makePickups(scene);
  const raiders = makeRaiders(scene, art, bolts, skies);

  // ---------- the ship you fly, and a voyage ----------
  const built = new Map(), zones = new Map();
  const shipFor = (R) => { if (!built.has(R.id)) { const s = buildShip(R, 'full', art); s.glow.material.uniforms.uScale.value = camera.userData.pixelScale ?? 500; built.set(R.id, s); } return built.get(R.id); };
  const port = makePort({ renderer, env: scene.environment, progress, shipFor, touch, onSail: (id) => sail(id), onMode: (m) => enter(m) });
  // a phone can drop the drawing context after a long time in the background (or a laptop's graphics can restart).
  // three.js puts back the ships, the map and the shadows by itself, but not the pictures drawn once at start-up: the
  // sky's light on the brass and the cloud pattern. Pause, and draw those again when the context comes back.
  canvas.addEventListener('webglcontextlost', () => { if (mode === 'voyage' && !paused) pause(true); });
  canvas.addEventListener('webglcontextrestored', () => { scene.environment = port.scene.environment = skyLight(); world.clouds.bake(); });
  let mode = 'title', paused = false, player = null, gunnery = null;
  const V = { shards: 0, downed: 0, hits: 0 }; // this voyage
  // the waves: which (n, from 0), what's happening between them, and the next wave once it's known (shown on the card)
  const W = { n: 0, state: 'calm', timer: 5, lost: 0, choose: 0, sunk: false, next: null };
  function enter(m) {
    mode = m; document.body.dataset.mode = m;
    input.active = m === 'voyage' && !paused;
    if (m !== 'voyage' && document.pointerLockElement) document.exitPointerLock();
  }
  // everything a voyage leaves behind, cleared for the next: the waves (and the next one, if a card was showing), the
  // hold, the raiders, shots, smoke and shards, and the camera
  function resetVoyage() {
    Object.assign(W, { n: 0, state: 'calm', timer: 5, lost: 0, choose: 0, sunk: false, next: null });
    Object.assign(V, { shards: 0, downed: 0, hits: 0 });
    raiders.clear(); bolts.clear(); pickups.clear(); smoke.puffs.length = 0;
    hurt = 0; Object.assign(cam, { yaw: 0, pitch: 0.2, zoom: 1, shake: 0 });
  }
  // set sail: a fresh voyage in this ship, built as it stands in port (`force` sails a ship not owned, for tests)
  function sail(id, force = false) {
    const d = progress.data;
    if (!d.ships[id].owned && !force) return;
    const R = SHIPS.find((s) => s.id === id), ship = shipFor(R), L = loadout(id, d.ships[id]);
    const a = Math.random() * Math.PI * 2, at = { pos: new THREE.Vector3(Math.sin(a) * 2500, 680, Math.cos(a) * 2500), heading: a + Math.PI };
    ship.root.rotation.set(0, at.heading, 0); ship.root.position.copy(at.pos);
    if (player && player.ship !== ship) scene.remove(player.ship.root); // never leave the last ship hanging in the sky
    player = makeFlyer(ship, L.stats, at, L.tune);
    if (!zones.has(id)) zones.set(id, hitZones(ship));
    player.aimY = zones.get(id).aim.y;
    gunnery = makeGunnery(ship, L.guns);
    scene.add(ship.root);
    // the sun's shadows: a box round the ship, sized to her, so her masts and sails shade her deck. The sun sits
    // 400 m off along its light, so the box reaches from just short of the ship to just past her
    const r = R.length * 0.85;
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: SUN_OFF - r * 2, far: SUN_OFF + r * 2 });
    sun.shadow.camera.updateProjectionMatrix();
    cam.dist = camDistFor(R);
    $('ship-name').textContent = R.name; $('ship-cls').textContent = `${R.cls} · ${R.length} m`;
    resetVoyage();
    newWind();
    paused = false; $('paused').hidden = true; $('calm').hidden = true;
    port.mode = 'voyage'; $('title').hidden = true; $('port').hidden = true;
    enter('voyage');
    region = regionAt(at.pos.x, at.pos.z); // the region's name shows when you cross into the next one
    banner(`The ${R.name} sets sail`, `${skies().name} · ${windWords()}`);
  }
  // back to port: keep this share of the voyage's shards
  function endVoyage(keep) {
    const d = progress.data, got = Math.round(V.shards * keep);
    d.shards += got; d.best[d.skies] = Math.max(d.best[d.skies], W.n); progress.save();
    raiders.clear(); bolts.clear(); pickups.clear(); W.next = null;
    scene.remove(player.ship.root); // the port shows her (or the ship you were looking at) in its own scene
    paused = false; $('paused').hidden = true; $('calm').hidden = true;
    port.setMode('port');
    if (got) note(`◆ ${got.toLocaleString('en')} banked from the voyage`);
    return got;
  }
  function newWind() { WIND.dir = Math.random() * Math.PI * 2; WIND.strength = 0.06 + Math.random() * 0.08; }
  const windWords = () => `the wind from the ${COMPASS[Math.round(compassDeg(WIND.dir + Math.PI) / 45) % 8]}`;
  function note(text) { const n = $('port-note'); n.textContent = text; n.classList.remove('on'); void n.offsetWidth; n.classList.add('on'); }
  progress.onLoad(() => note('Your progress from your other device is here'));

  // ---------- the camera: behind the ship, swung round it by the mouse or a drag ----------
  const cam = { yaw: 0, pitch: 0.2, dist: 40, zoom: 1, look: new THREE.Vector3(), shake: 0 };
  const camDistFor = (R) => R.length * 1.35 + 16;
  const aimPoint = new THREE.Vector3(), target = new THREE.Vector3(), toR = new THREE.Vector3(); // (kept, not made each frame)
  let locked = null, reach = true;
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
    target.copy(player.pos); target.y += R.length * 0.42 + 2;
    camera.position.copy(target).addScaledVector(cam.look, -cam.dist * cam.zoom);
    camera.lookAt(target);
    if (cam.shake > 0) { cam.shake = Math.max(0, cam.shake - dt); const s = cam.shake * 0.012; camera.rotation.x += (Math.random() - 0.5) * s; camera.rotation.y += (Math.random() - 0.5) * s; }
    // the guns lock on to the raider nearest the crosshair, and lead it
    locked = null;
    let bestA = Infinity;
    for (const r of raiders.list) {
      if (r.f.down) continue;
      const v = toR.copy(r.f.pos).sub(camera.position), along = v.dot(cam.look);
      if (along <= 0) continue;
      const ang = v.angleTo(cam.look), tol = Math.max(0.05, Math.atan((r.R.length * 0.8) / along));
      if (ang < tol && ang < bestA) { bestA = ang; locked = r; }
    }
    aimPoint.copy(target).addScaledVector(cam.look, 800);
  }
  function aimFor(battery) {
    reach = true;
    if (!locked) return;
    player.ship.root.updateMatrixWorld(true);
    const m = gunnery.muzzle(battery);
    if (!m) { reach = false; return; }
    intercept(m.p, player.velocity, locked.f.aimAt(), locked.f.velocity, m.K.speed, aimPoint);
    reach = gunnery.reaches(battery, aimPoint, m);
  }

  // ---------- shots landing ----------
  const BURST = { hull: [0xffa040, 22, 1], sails: [0xf5e6c8, 14, 0.7], crystals: [0xffe08a, 34, 1.4] };
  function hitTest(b, a, c) {
    if (b.owner === 'player') {
      const h = raiders.hitBy(a, c);
      if (!h) return false;
      h.r.f.hit(h.h.part, b.damage); V.hits++;
      bolts.burst(h.h.at, ...BURST[h.h.part]);
      return true;
    }
    if (player.down) return false;
    const h = firstHit(zones.get(player.ship.recipe.id), player.ship.body, a, c);
    if (!h) return false;
    player.hit(h.part, b.damage);
    bolts.burst(h.at, ...BURST[h.part]);
    hurt = Math.min(1, hurt + 0.45); cam.shake = 0.3;
    return true;
  }

  // ---------- the raiders come in waves; between them, sail on or go home ----------
  function describe(ids) {
    const count = {};
    for (const id of ids) count[id] = (count[id] ?? 0) + 1;
    const plural = (c) => (c === 'Man-o\'-war' ? 'Men-o\'-war' : `${c}s`);
    const parts = Object.entries(count).map(([id, n]) => { const c = FLEET.find((s) => s.id === id).cls; return `${NUMBER[n]} ${n > 1 ? plural(c) : c}`; });
    return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0];
  }
  const fmt = (n) => Math.round(n).toLocaleString('en');
  function waves(dt, gone) {
    for (const r of gone) {
      V.downed++;
      bolts.burst(r.f.pos, 0xff8a3a, 60, 2.2); bolts.burst(r.f.pos.clone().add({ x: 0, y: 3, z: 0 }), 0xffe08a, 30, 1.6);
      pickups.spill(r.f.pos.clone().add({ x: 0, y: 2, z: 0 }), r.f.velocity, r.bounty * skies().shards * (1 + 0.1 * W.n));
      toast(`${r.name} ${r.f.down.why === 'hull' ? 'going down' : r.f.down.why === 'struck' ? 'strikes her colours' : 'sinking, crystals dead'}: fly through the shards`);
    }
    for (const r of raiders.escaped) toast(`The ${r.R.cls} got away with her treasure`);
    if (W.sunk) return;
    if (W.lost > 0) {
      if ((W.lost -= dt) <= 0) {
        W.sunk = true;
        $('paused-title').textContent = `The ${player.ship.recipe.name} went down`;
        $('paused-line').textContent = V.shards ? `Your crew got her home with half this voyage's shards: ◆ ${fmt(V.shards / 2)}.` : 'Your crew got her home.';
        $('btn-resume').hidden = true; $('btn-abandon').textContent = 'To port'; $('paused').hidden = false;
        input.active = false;
      }
      return;
    }
    if (player.down) { W.lost = 4; $('calm').hidden = true; banner(`The ${player.ship.recipe.name} is going down`, 'All hands to the boats'); return; }
    if (W.state !== 'fight') player.repair(dt * 0.12); // between fights the crew patch her up
    if (W.state === 'calm') {
      if ((W.timer -= dt) <= 0) {
        const wave = W.next ?? waveAt(W.n, skies().extra), a = raiders.spawnWave(wave, player);
        W.next = null;
        const title = wave.ids.includes('galleon') ? `Wave ${W.n + 1}: a treasure ship` : wave.captain >= 0 ? `Wave ${W.n + 1}: a raider captain` : wave.ids.includes('manowar') ? `Wave ${W.n + 1}: a Man-o'-war` : `Raiders, wave ${W.n + 1}`;
        banner(title, `${describe(wave.ids)}, to the ${COMPASS[Math.round(compassDeg(a) / 45) % 8]} · ${windWords()}${wave.ids.includes('galleon') ? ' · shoot her sails to catch her' : ''}`);
        W.state = 'fight';
      }
    } else if (W.state === 'fight') {
      if (!raiders.list.some((r) => !r.f.down)) {
        W.n++;
        const bonus = Math.round(20 * W.n * skies().shards);
        V.shards += bonus;
        W.state = 'choose'; W.choose = 25;
        $('calm-title').textContent = `Wave ${W.n} beaten`;
        const next = waveAt(W.n, skies().extra);
        W.next = next;
        // a captain's ship is built now, while the card is up, not as the wave appears (a stutter on a phone)
        if (next.captain >= 0) raiders.prepare(next.ids[next.captain], true);
        $('calm-line').textContent = `◆ ${fmt(bonus)} for the wave · ◆ ${fmt(V.shards)} this voyage. Next: ${next.captain >= 0 ? 'a raider captain, with ' : ''}${describe(next.ids)}. Sail on for more, or go back to port to keep them.`;
        $('calm').hidden = false;
      }
    } else if (W.state === 'choose') {
      W.choose -= dt;
      setText($('btn-sail-on'), `Sail on (${Math.max(0, Math.ceil(W.choose))})`);
      if (W.choose <= 0) sailOn();
    }
  }
  function sailOn() {
    if (W.state !== 'choose') return;
    $('calm').hidden = true; W.state = 'calm'; W.timer = 4; newWind();
  }
  $('btn-sail-on').addEventListener('click', sailOn);
  $('btn-go-port').addEventListener('click', () => { if (W.state === 'choose') endVoyage(1); });
  function pause(on) {
    if (mode !== 'voyage' || W.sunk) return;
    paused = on; input.active = !on;
    if (!on) { input.look.x = input.look.y = 0; input.zoom = 0; input.pressed.clear(); } // nothing moved while paused carries over
    if (on) {
      if (document.pointerLockElement) document.exitPointerLock();
      const fighting = W.state === 'fight' || player.down;
      $('paused-title').textContent = 'Paused';
      $('paused-line').textContent = !V.shards ? 'Back to port now ends the voyage.' : fighting ? `Back to port now, mid-fight, and you keep half this voyage's shards: ◆ ${fmt(V.shards / 2)}.` : `Back to port now keeps all this voyage's shards: ◆ ${fmt(V.shards)}.`;
      $('btn-resume').hidden = false; $('btn-abandon').textContent = 'Back to port';
    }
    $('paused').hidden = !on;
  }
  $('btn-pause').addEventListener('click', () => pause(true));
  $('btn-resume').addEventListener('click', () => pause(false));
  $('btn-abandon').addEventListener('click', () => endVoyage(W.sunk || W.state === 'fight' || player.down ? 0.5 : 1));
  document.addEventListener('visibilitychange', () => { if (document.hidden && mode === 'voyage' && !paused) pause(true); });

  // ---------- the help ----------
  const toggleHelp = () => { const h = $('help'); h.hidden = !h.hidden; $('btn-help').hidden = !h.hidden; };
  $('btn-help').addEventListener('click', toggleHelp);
  const mini = $('minimap'), mctx = mini.getContext('2d'), mimg = new Image(); mimg.src = minimapUrl;
  const bigMap = () => { mini.classList.toggle('big'); hudTimer = 0; }; // redrawn sharp at its new size straight away
  mini.addEventListener('click', bigMap);

  const input = makeInput(canvas, document.body);
  // the touch hint fades a few seconds after the first touch at sea (drags in port turn the ship, and don't count)
  canvas.addEventListener('pointerdown', function hint() {
    if (mode !== 'voyage') return;
    canvas.removeEventListener('pointerdown', hint); setTimeout(() => $('touch-hint').classList.add('gone'), 4000);
  });
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = w < h ? 68 : 55; camera.updateProjectionMatrix();
    camera.userData.pixelScale = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const s of built.values()) s.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    port.resize();
  }
  addEventListener('resize', resize);
  resize();
  port.setMode('title');

  // ---------- the HUD ----------
  // Written sparingly: what changes every frame (the tags' places, the reload bar) is written every frame, the rest ten
  // times a second, and nothing is written that hasn't changed, so a phone spends its time on the sky, not the page
  let region = '', regionTimer = 0, hudTimer = 0, hurt = 0;
  const flash = (el) => { el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); };
  function banner(title, line) { $('banner-title').textContent = title; $('banner-line').textContent = line; flash($('banner')); }
  function toast(text) { const t = $('toast'); t.textContent = text; flash(t); }
  const setText = (el, v) => { if (el._v !== v) { el._v = v; el.textContent = v; } };
  const setStyle = (el, k, v) => { if (el['_' + k] !== v) { el['_' + k] = v; el.style[k] = v; } };
  const setWidth = (el, f) => { const p = Math.round(f * 100); if (el._w !== p) { el._w = p; el.style.width = p + '%'; } }; // f: 0 to 1
  const H = {}; // the HUD's elements, looked up once
  for (const id of ['hurt', 'battery-name', 'battery-count', 'reload-bar', 'aim', 'tags', 'r-speed', 'r-height', 'r-sail', 'sail-bar', 'score-n', 'wave-n', 'voyage-n',
    'heading', 'wind-arrow', 'wind-n', 'h-surge', 'row-surge', 'btn-surge', 'warn', 'score', ...PARTS.flatMap((k) => [`h-${k}`, `n-${k}`, `row-${k}`])]) H[id] = $(id);
  const proj = new THREE.Vector3(), placed = [], byY = (a, b) => a._y - b._y;
  // each raider's tag: over it, or at the edge of the screen pointing to it; its distance and health ten times a second
  function tags(slow) {
    const W2 = innerWidth / 2, H2 = innerHeight / 2;
    placed.length = 0;
    for (const r of raiders.list) {
      let el = r.tag;
      if (!el) {
        el = r.tag = document.createElement('div'); el.className = r.captain ? 'tag captain' : r.role === 'prize' ? 'tag captain prize' : 'tag';
        el.innerHTML = `<span class="arrow">▲</span><b>${r.captain ? 'Captain · ' : r.role === 'prize' ? 'Treasure · ' : ''}${r.R.cls}</b> <span class="d"></span>${PARTS.map((k) => `<span class="meter ${k}"><i></i></span>`).join('')}`;
        el._d = el.querySelector('.d'); el._m = [...el.querySelectorAll('.meter i')]; el._arrow = el.querySelector('.arrow'); el._fresh = true;
        H.tags.append(el); // (raiders.js takes it away with its raider)
      }
      if (r.f.down) { el.remove(); continue; }
      proj.copy(r.f.pos); proj.y += r.R.length * 0.45 + 3; proj.project(camera);
      // in pixels from the middle of the screen; off screen (or behind), pinned to the edge in its direction
      const behind = proj.z > 1;
      let x = proj.x * W2 * (behind ? -1 : 1), y = -proj.y * H2 * (behind ? -1 : 1);
      const ax = W2 - 50, ay = H2 - 46, k = Math.max(Math.abs(x) / ax, Math.abs(y) / ay);
      const edge = behind || k > 1;
      if (edge) { x /= Math.max(k, 1e-6); y /= Math.max(k, 1e-6); }
      if (el._edge !== edge) { el._edge = edge; el.classList.toggle('edge', edge); }
      if (el._locked !== (r === locked)) { el._locked = r === locked; el.classList.toggle('locked', el._locked); }
      el._x = W2 + x; el._y = H2 + y + (edge && y > 0 ? 40 : 0); placed.push(el);
      const turn = Math.round(Math.atan2(x, -y) * 50) / 50;
      if (edge && el._turn !== turn) { el._turn = turn; el._arrow.style.transform = `rotate(${turn}rad)`; }
      if (slow || el._fresh) {
        el._fresh = false;
        const d = Math.round(r.f.pos.distanceTo(player.pos) / 10) * 10;
        if (el._dist !== d) { el._dist = d; el._d.textContent = `${d} m`; }
        for (let i = 0; i < 3; i++) setWidth(el._m[i], r.f.frac(PARTS[i]));
      }
    }
    // tags that would land on top of each other are stacked instead
    placed.sort(byY);
    for (let i = 0; i < placed.length; i++) {
      const a = placed[i];
      for (let j = 0; j < i; j++) { const b = placed[j]; if (Math.abs(a._x - b._x) < 84 && a._y - b._y < 40) a._y = b._y + 40; }
      const x = Math.round(a._x * 2) / 2, y = Math.round(a._y * 2) / 2;
      if (a._px !== x || a._py !== y) { a._px = x; a._py = y; a.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`; }
    }
  }
  function hud(dt, battery) {
    hudTimer -= dt;
    const slow = hudTimer <= 0;
    hurt = Math.max(0, hurt - dt * 1.2);
    const red = Math.round(Math.max(hurt, player.down ? 0.6 : 0) * 50) / 50;
    if (H.hurt._o !== red) { H.hurt._o = red; H.hurt.style.opacity = String(red); }
    const n = gunnery.count(battery), rl = gunnery.ready[battery], full = gunnery.reload(battery), guns = n * 10 + (locked && !reach ? 1 : 0);
    if (H.battery !== battery || H.guns !== guns) {
      H.battery = battery; H.guns = guns;
      setText(H['battery-name'], n ? BATTERY_NAMES[battery] : `No ${BATTERY_NAMES[battery].toLowerCase()}`);
      setText(H['battery-count'], !n ? '–' : locked && !reach ? 'out of reach' : `${n} gun${n > 1 ? 's' : ''}`);
    }
    setWidth(H['reload-bar'], n ? 1 - rl / full : 0);
    const aim = locked ? (reach ? 'locked' : 'locked far') : '';
    if (H.aim._v !== aim) { H.aim._v = aim; H.aim.className = aim; }
    tags(slow);
    if (!slow) return;
    hudTimer = 0.1;
    setText(H['r-speed'], `${Math.round(player.speed * 3.6)} km/h`);
    setText(H['r-height'], `${Math.round(player.pos.y).toLocaleString()} m`);
    setText(H['r-sail'], `${Math.round(player.sail * 100)}%`);
    setWidth(H['sail-bar'], player.sail);
    for (const k of PARTS) {
      setWidth(H[`h-${k}`], player.frac(k));
      setText(H[`n-${k}`], String(Math.ceil(player.health[k])));
      H[`row-${k}`].classList.toggle('low', player.frac(k) < 0.3);
    }
    setText(H['score-n'], String(V.downed)); setText(H['wave-n'], String(W.n + 1)); setText(H['voyage-n'], fmt(V.shards));
    const deg = compassDeg(player.heading);
    setText(H.heading, `${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8]} ${Math.round(deg)}°`);
    // the wind, against the ship: the arrow points the way it blows (up is the way you're heading), and how much it
    // adds to or takes from your top speed
    const help = Math.round(windHelp(player.heading) * 100);
    setStyle(H['wind-arrow'], 'transform', `rotate(${(-(WIND.dir - player.heading)).toFixed(2)}rad)`);
    setText(H['wind-n'], `${help > 0 ? '+' : help < 0 ? '−' : ''}${Math.abs(help)}%`);
    const sg = player.surge;
    setWidth(H['h-surge'], sg.on > 0 ? sg.on / 3 : sg.charge);
    H['row-surge'].classList.toggle('ready', sg.charge >= 1);
    H['btn-surge'].disabled = sg.charge < 1;
    const w = H.warn;
    const warn = player.down ? '' : player.frac('crystals') < 0.5 ? 'The crystals are cracked: she\'s sinking'
      : player.pos.y > THINNING - 350 ? 'Nearing the Thinning: the crystals can\'t lift you higher'
        : Math.abs(player.pos.x) > MAP.w / 2 + 1500 || Math.abs(player.pos.z) > MAP.h / 2 + 1500 ? 'Open sea: Aethermoor is behind you' : '';
    w.hidden = !warn; if (warn) setText(w, warn);
    const r = regionAt(player.pos.x, player.pos.z);
    if (r !== region && (regionTimer -= 0.1) <= 0) { region = r; regionTimer = 2; const el = $('region'); el.textContent = r; flash(el); }
    // the corner map, with the ship as a gold arrow and the raiders as red dots. It's sized here, as it's drawn, so it's
    // always as sharp as it shows (it has no size while hidden on the title screen or in port, or before the big map)
    if (mimg.complete && mimg.naturalWidth) {
      const dpr = Math.min(devicePixelRatio, 2), cw = Math.round(mini.clientWidth * dpr), ch = Math.round(mini.clientHeight * dpr);
      if (cw && ch && (cw !== mini.width || ch !== mini.height)) { mini.width = cw; mini.height = ch; }
      const W2 = mini.width, H2 = mini.height;
      mctx.drawImage(mimg, 0, 0, W2, H2);
      const x = (player.pos.x / MAP.w + 0.5) * W2, y = (player.pos.z / MAP.h + 0.5) * H2, s = Math.max(5, W2 / 40);
      mctx.fillStyle = '#ff4636'; mctx.strokeStyle = '#3a1631'; mctx.lineWidth = Math.max(1, s / 5);
      for (const q of raiders.list) if (!q.f.down) { mctx.beginPath(); mctx.arc((q.f.pos.x / MAP.w + 0.5) * W2, (q.f.pos.z / MAP.h + 0.5) * H2, s * 0.45, 0, Math.PI * 2); mctx.fill(); mctx.stroke(); }
      mctx.save(); mctx.translate(x, y); mctx.rotate(-player.heading + Math.PI);
      mctx.fillStyle = '#e2bd67'; mctx.lineWidth = Math.max(1.5, s / 4);
      mctx.beginPath(); mctx.moveTo(0, -s * 1.3); mctx.lineTo(s * 0.8, s); mctx.lineTo(0, s * 0.45); mctx.lineTo(-s * 0.8, s); mctx.closePath(); mctx.fill(); mctx.stroke();
      mctx.restore();
    }
  }

  let last = performance.now(), time = 0, held = null, lastPop = -1;
  const hold = new THREE.Vector3(); // where the ship's hold is, that the shards fly to
  // one step of the game: controls, flying, the raiders, the camera, the guns, the shots, the HUD
  function tick(dt) {
    time += dt;
    const inp = held ?? input.read();
    for (const k of inp.pressed) {
      if (k === 'c') { cam.yaw = 0; cam.pitch = 0.2; }
      else if (k === 'm') bigMap();
      else if (k === 'h') toggleHelp();
      else if (k === 'p') pause(true);
      else if (k === 'r') { if (player.startSurge()) toast('Surge!'); }
      else if (k === 'Enter') sailOn();
    }
    player.update(dt, inp);
    player.ship.root.updateMatrixWorld(true);
    const gone = raiders.update(dt, player, camera);
    placeCamera(dt, inp);
    const battery = batteryFor(cam.yaw);
    aimFor(battery);
    gunnery.update(dt);
    if (inp.fire && !player.down) gunnery.fire(battery, aimPoint, bolts, 'player', player.velocity);
    bolts.update(dt, hitTest, camera);
    smokeFrom(player, smoke, bolts.spark, dt);
    for (const r of raiders.list) smokeFrom(r.f, smoke, bolts.spark, dt);
    smoke.update(dt, camera);
    const got = pickups.update(dt, player.ship.body.localToWorld(hold.set(0, 0.5, 0)), player.ship.recipe.length * 0.6 + 8, camera);
    // gathering shards makes the counter pop (once in a while, as they stream in)
    if (got && !player.down) { V.shards += got; if (time - lastPop > 0.25) { lastPop = time; flash(H.score); } }
    waves(dt, gone);
    // a Surge widens the view a little
    const fov = (innerWidth < innerHeight ? 68 : 55) + (player.surge.on > 0 ? 7 : 0);
    if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * (1 - Math.exp(-dt * 5)); camera.updateProjectionMatrix(); }
    world.time.value = time;
    world.puffs.follow(player.pos);
    sun.target.position.copy(player.pos); sun.position.copy(player.pos).addScaledVector(SUN, SUN_OFF);
    art.M.canvas.userData.time.value = time;
    art.M.gem.emissiveIntensity = 0.55 + Math.sin(time * 2.4) * 0.09;
    player.ship.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    hud(dt, battery);
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (mode === 'voyage') { if (!paused && !W.sunk) tick(dt); renderer.render(scene, camera); }
    else { input.read(); port.update(dt); port.render(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.body.classList.add('ready');

  // for tools/check.mjs
  window.__game = {
    ready: true, get player() { return player; }, get gunnery() { return gunnery; }, cam, input, raiders, bolts, pickups, renderer, camera, scene, world, sun, waves: W, voyage: V,
    progress, port, sail, endVoyage, pause, sailOn, wind: WIND, get mode() { return mode; }, get paused() { return paused; },
    fly: (id) => sail(id, true), // a voyage in any ship, owned or not (for tests)
    get hits() { return V.hits; }, get downed() { return V.downed; }, get locked() { return locked; },
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
