// main.js: Skies of Aethermoor. The title screen (choose your skies), the port (choose and upgrade your ship), and
// voyages: set sail over Chris's map and fight off waves of raiders, each harder than the last. Swing the camera round
// the ship to aim, and whichever guns face where you look fire. Shots tear the hull, the sails or the crystals
// (docs/ships.md). Downed raiders spill Crystal Shards to fly through and gather; after each wave, sail on or go back
// to port to keep them. Lose the ship and the crew get her home with half.
// Works on a laptop (keyboard and mouse, full detail) and on a phone (touch stick, aiming drag, buttons).
// Whatever happens is told to events.js (a gun firing, a hit, a raider down, a wave starting...), and the effects
// (fx.js, wrecks.js, surge.js) answer it; the HUD here answers the hits itself: marks on the crosshair in the colour of
// the part hit, a red X when a shot brings a raider down, bars that show the chunk knocked off, and for hits on you, a
// red arc pointing where the shot came from. A raider going down shows her bounty rising from the wreck, and the shard
// count in the corner counts up as they come in. Bringing down the last raider of a wave slows the world for a moment
// before the card between waves rises. Every ship shows her scars where she was hit, burns when badly holed, and the
// Captain's is patched up between waves and clean again in port; and every ship is alive: her wings fold and spread
// with her sails, her lids fly open and her guns run out for a fight and kick back as they fire (looks.js), and a
// glowing wake of Aether streams behind her (wakes.js).
// The sky at sea is the sky director's (sky.js): each region's air, storms rolling in for some waves (the card before
// one says so), clouds to fly through and hide in, and the raiders losing the Captain there.
// The fight's tactics (tactics.js): the Captain's guns load round shot, chain shot or crystal breakers (1, 2, 3 or a
// right-click on a laptop, the shot button on a phone; chain shot earned from the first treasure ship that strikes to
// her, the breakers from the first raider captain's Frigate she sinks, or either bought in port), a broadside's shot
// down a ship's length rakes her for half as much again (both ways: "Raked!" by the crosshair), and her crew patch her
// mid-fight (X, or the Patch button on a phone once she's hurt), the guns reloading at half speed meanwhile. A raider
// readying a broadside shows her red fan and her tag says "Broadside!", with a ring closing as she's about to fire
// (raiders.js: her gunners aim where you're heading).
// The title screen is drawn in the world itself, at sunset (title.js); the port in its own quiet void (port.js). Going
// from one to another (or out to sea) dips through the night for a moment, so no scene ever shows in the wrong place.
// The sound (sound.js, through audio.js) answers the same news, and plays Chris's music; it starts with the first touch
// anywhere on the page. The Settings card (settings.js: the sound, aim speed, up and down, the picture, camera shake,
// and on a phone Fire on the left) opens from a gear on the title screen, in port and on the pause card.
// The screen keeps tidy on every size (game.html has a place for everything): the region's name waits for a quiet
// moment rather than landing on a fight, raiders' tags keep clear of the panels and of the raiders' ships far off
// (tags()), and directions are given as left and right ("ahead on your right"), the wind in words.
import * as THREE from 'three';
import { loadShipArt } from '../ship/materials.js';
import { buildShip } from '../ship/build.js';
import { SHIPS, FLEET, GIANTS } from '../ships/index.js';
import { makeWorld, regionAt, REGIONS, SUN, HAZE, MAP, THINNING, DAY, billowsFor } from './world.js';
import { makeSky } from './sky.js';
import { makeInput } from './input.js';
import { makeFlyer, WIND, windHelp } from './flight.js';
import { makeBolts, makeGunnery, batteryFor, BATTERY_NAMES, intercept, KINDS } from './guns.js';
import { SHOTS, SHOT_ORDER, SHOT_ICON, RAKE, PATCH, SMART, rakeMul } from './tactics.js';
import { makeFx } from './fx.js';
import { makeWrecks } from './wrecks.js';
import { makeSurge } from './surge.js';
import * as events from './events.js';
import { makeRaiders, waveAt, hasTreasure, treasureShip, treasureCount } from './raiders.js';
import { makeProgress, SKIES, PRICES, NEEDS } from './progress.js';
import { loadout } from './mods.js';
import { makePickups } from './pickups.js';
import { makePort } from './port.js';
import { makeTitle } from './title.js';
import { hitZones, firstHit } from './damage.js';
import { smokeFrom } from './effects.js';
import { makeLooks } from './looks.js';
import { makeWakes } from './wakes.js';
import { WTIME } from '../ship/dress.js';
import { makeAudio } from '../audio/audio.js';
import { makeSound } from './sound.js';
import { makeSettings, AIM, PICTURE } from './settings.js';
import minimapUrl from '../../assets/map/minimap.webp';

const $ = (id) => document.getElementById(id);
const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1 && matchMedia('(hover: none)').matches;
const PARTS = ['hull', 'sails', 'crystals'];
const compassDeg = (heading) => ((180 - THREE.MathUtils.radToDeg(heading)) % 360 + 360) % 360; // north is up the map (-z)
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
// where something is from the ship, in plain words: `rel` is its bearing less her heading (a heading grows turning
// left, so a bearing below it is on the right)
function sideWords(rel) {
  const d = Math.abs(THREE.MathUtils.radToDeg(wrap(rel))), side = wrap(rel) < 0 ? 'right' : 'left';
  return d < 20 ? 'dead ahead' : d < 60 ? `ahead on your ${side}` : d < 120 ? `off your ${side} side` : d < 160 ? `behind you on your ${side}` : 'behind you';
}
const NUMBER = ['', 'a', 'two', 'three', 'four', 'five', 'six'];
const SUN_OFF = 400; // how far from the ship the sun's shadow camera sits, along the light
const { emit, payload } = events;

async function main() {
  if (touch) document.body.classList.add('touch');
  const canvas = $('stage');
  // the settings, kept on this device: the picture (how sharp, how many shadows, clouds and sparks) is read first
  const settings = makeSettings({ touch }), picture = () => PICTURE[settings.data.picture] ?? PICTURE.balanced;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, picture().ratio));
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

  // the afternoon sky lights the brass: a blurred picture of it, drawn once (and again if the drawing context is lost)
  let dayLight = world.skyLight(DAY);
  scene.environment = dayLight;
  // the sky's light and the sun's, coloured by the look of the sky (world.js: the voyages' afternoon, the title's sunset)
  const hemi = new THREE.HemisphereLight(), sun = new THREE.DirectionalLight();
  const lights = { sun, hemi, scene };
  world.setLook(DAY, lights);
  sun.castShadow = true; sun.shadow.mapSize.set(picture().shadow, picture().shadow);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
  scene.add(hemi, sun, sun.target);

  const progress = makeProgress(), skies = () => SKIES[progress.data.skies];
  // the sound: made at the first touch, set by the Settings card (kept on this device), answering the game's news
  const audio = makeAudio({ touch, settings: () => settings.data });
  const sound = makeSound({ audio, touch, where: () => player?.pos, weather: () => sky?.weather });
  const fx = makeFx({ scene, camera, touch }), bolts = makeBolts(scene, fx), pickups = makePickups(scene);
  const wrecks = makeWrecks({ fx, tear: world.tear, scene }), surge = makeSurge({ scene, fx });
  const raiders = makeRaiders(scene, art, bolts, skies, fx);
  const looks = makeLooks({ scene, touch, fx, camera }); // (every ship's scars, her life and her flames: looks.js)
  const sky = makeSky({ world, lights, scene, renderer, touch, fx }); // (the sky at sea and its weather: sky.js)
  const wakes = makeWakes(scene, { touch }); // (every ship's wake of Aether, in one draw)
  // the Settings card's changes, at once: the sound; the picture; the camera shake; Fire on the left (a phone)
  function applyPicture() {
    const P = picture();
    renderer.setPixelRatio(Math.min(devicePixelRatio, P.ratio));
    if (sun.shadow.mapSize.x !== P.shadow) { sun.shadow.mapSize.set(P.shadow, P.shadow); sun.shadow.map?.dispose(); sun.shadow.map = null; }
    port.setShadow(P.shadow);
    world.puffs.count(P.puffs); raiders.setDetail(P.detail); fx.setQuality(P.fx[touch ? 0 : 1]);
    world.quality(P.sky); sky.quality(P.sky); // (the sun's rays, the sea's glitter, the horizon's clouds; rain and scud)
  }
  function applyHands() {
    const left = touch && settings.data.leftFire;
    document.body.classList.toggle('fire-left', left); input.leftFire = left; layout();
    // (and the words that say which thumb does what, in the hint and How to fly: each has its left-handed words in
    // data-left, and keeps its own in data-right)
    for (const el of document.querySelectorAll('[data-left]')) { el.dataset.right ??= el.textContent; el.textContent = left ? el.dataset.left : el.dataset.right; }
  }
  settings.on((id, v, done) => {
    if (id === 'sound' || id === 'music' || id === 'effects') {
      const on = audio.apply();
      // (a tick, to hear the new level, once the sound is running again)
      if (done && (id === 'effects' || (id === 'sound' && v))) on.then((running) => { if (running) sound.ui('ui-cursor'); });
    }
    else if (id === 'picture') { applyPicture(); resize(); }
    else if (id === 'shake') fx.shake = v;
    else if (id === 'leftFire') applyHands();
  });

  // ---------- the ship you fly, and a voyage ----------
  const built = new Map(), zones = new Map();
  const shipFor = (R) => { if (!built.has(R.id)) { const s = buildShip(R, 'full', art); s.glow.material.uniforms.uScale.value = camera.userData.pixelScale ?? 500; built.set(R.id, s); } return built.get(R.id); };
  const port = makePort({ renderer, env: dayLight, progress, shipFor, touch, onSail: (id) => sail(id), onTrial: (id) => sail(id, false, true), onMode: (m) => enter(m) });
  const title = makeTitle({ renderer, scene, world, lights, art, raiders, shipFor, progress, dayLight: () => dayLight, touch });
  // a phone can drop the drawing context after a long time in the background (or a laptop's graphics can restart).
  // three.js puts back the ships, the map and the shadows by itself, but not the pictures drawn once at start-up: the
  // sky's light on the brass (the afternoon's, and the title's sunset) and the cloud pattern. Pause, and draw those
  // again when the context comes back.
  canvas.addEventListener('webglcontextlost', () => { if (mode === 'voyage' && !paused) pause(true); });
  canvas.addEventListener('webglcontextrestored', () => {
    world.clouds.bake(); dayLight = port.scene.environment = world.skyLight(DAY);
    if (!title.on) scene.environment = dayLight;
    title.relight();
  });
  let mode = '', paused = false, player = null, gunnery = null;
  const V = { shards: 0, downed: 0, hits: 0 }; // this voyage
  // the waves: which (n, from 0), what's happening between them, and the next wave once it's known (shown on the card)
  const W = { n: 0, state: 'calm', timer: 5, lost: 0, choose: 0, sunk: false, next: null, bonus: 0, bonusAt: 0, bonusShown: -1 };
  let told = null; // the screen the events were last told of
  // a new screen: the title's sky (or the afternoon's again), and a dip through the night as it changes. The change
  // itself is at once (the night covers it), then the new screen comes up out of the night over half a second
  const veil = $('veil');
  let dip = null;
  function enter(m) {
    if (m !== 'voyage') sky.rest(); // (no weather left in the world's sky for the title)
    if (m !== 'title') title.leave();
    if (m !== mode) { dip?.cancel(); dip = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: lessMotion.matches ? 150 : 520, easing: 'ease-out' }); }
    mode = m; document.body.dataset.mode = m;
    if (m === 'title') { fx.clear(); title.enter(); } // (no smoke left hanging in its sky from the last fight)
    if (told !== m) { told = m; payload('mode').mode = m; emit('mode'); }
    input.active = m === 'voyage' && !paused;
    if (m !== 'voyage' && document.pointerLockElement) document.exitPointerLock();
  }
  // everything a voyage leaves behind, cleared for the next: the waves (and the next one, if a card was showing), the
  // hold, the raiders, shots, smoke and shards, wrecks and the holes they tore in the clouds, and the camera
  function resetVoyage() {
    Object.assign(W, { n: 0, state: 'calm', timer: 5, lost: 0, choose: 0, sunk: false, next: null });
    Object.assign(V, { shards: 0, downed: 0, hits: 0 });
    raiders.clear(); bolts.clear(); pickups.clear(); fx.clear(); wrecks.clear(); world.clear(); surge.clear(); looks.clear(); wakes.clear(); sky.reset(); hideBounties(); calmUp(false); bigMap(false);
    document.body.classList.remove('sinking'); hidNote = -99; gaveAway = -99;
    hurt = 0; Object.assign(cam, { yaw: 0, pitch: 0.2, zoom: 1 }); Object.assign(shardCount, { shown: 0, from: 0, to: 0, t: 1, n: -1 }); surgeFov.x = surgeFov.v = 0;
  }
  // whether a ship at p, heading in from bearing a, and the camera `d` metres behind her are clear of the big clouds
  // (with room to spare round the camera)
  const airP = new THREE.Vector3();
  function clearAir(p, a, d) {
    world.puffs.follow(p);
    for (const [back, side, up] of [[0, 0, 0], [0.5, 0, 0.1], [1, 0, 0.2], [1.3, 0, 0.3], [1, 50, 0.2], [1, -50, 0.2], [1, 0, -0.3], [1, 0, 0.8]]) {
      airP.set(p.x + Math.sin(a) * d * back + Math.cos(a) * side, p.y + d * up, p.z + Math.cos(a) * d * back - Math.sin(a) * side);
      if (world.puffs.inside(airP) > 0) return false;
    }
    return true;
  }
  // a sea trial (Chris: like a garage's test drive): a ship not owned yet, taken out from port for one fight that suits
  // her (TRIAL: the wave she's tried on, from 0, with no storm; for the big two, a late wave). It earns and costs nothing
  // and changes nothing in the save: her wrecks spill no shards and no bounty rises, nothing is banked, no voyage or best
  // wave is counted, and she sails as she's built, whatever upgrades the save holds. The raiders are those of the
  // giants the Captain really owns (a trial never counts as owning her). Beaten or sunk, she comes home to the same port
  // screen, with a line saying what she costs
  const TRIAL = { cutter: 3, brig: 4, frigate: 7, galleon: 12, manowar: 14 }, AS_BUILT = { power: 0, mods: { armour: 0, canvas: 0, drill: 0, crystals: 0 } };
  let trial = null; // (the ship on trial, while she's out)
  // set sail: a fresh voyage in this ship, built as it stands in port (`force` sails a ship not owned, for tests), or
  // (`onTrial`) her sea trial
  function sail(id, force = false, onTrial = false) {
    const d = progress.data;
    if (!d.ships[id].owned && !force && !(onTrial && TRIAL[id] !== undefined)) return;
    trial = onTrial ? id : null;
    title.leave(); // (the afternoon again, before her ship is put in the sky)
    const first = progress.newCaptain && !trial;
    const R = SHIPS.find((s) => s.id === id), ship = shipFor(R), L = loadout(id, trial ? AS_BUILT : d.ships[id]);
    for (const g of GIANTS) giants[g] = !!d.ships[g]?.owned; // (the giants she owns sail among the raiders this voyage)
    // (she starts 2.5 km out, heading in, in clear air: tried round the circle until neither she nor the camera behind
    // her is in one of the big clouds, so a voyage never opens blind)
    const at = { pos: new THREE.Vector3(), heading: 0 };
    for (let k = 0, a = Math.random() * Math.PI * 2; k < 12; k++, a += 0.52) {
      at.pos.set(Math.sin(a) * 2500, 680, Math.cos(a) * 2500); at.heading = a + Math.PI;
      if (clearAir(at.pos, a, camDistFor(R))) break;
    }
    ship.root.rotation.set(0, at.heading, 0); ship.root.position.copy(at.pos);
    if (player && player.ship !== ship) scene.remove(player.ship.root); // never leave the last ship hanging in the sky
    player = makeFlyer(ship, L.stats, at, L.tune);
    looks.follow(player); looks.reset(ship); // (she sails as good as new)
    if (!zones.has(id)) zones.set(id, hitZones(ship));
    player.aimY = zones.get(id).aim.y;
    gunnery = makeGunnery(ship, L.guns, player); loaded.port = loaded.starboard = 0; wasLocked = null;
    player.gun = gunnery; // (her guns show on her model as they fire and reload: looks.js)
    player.locked = null; // (the raider her guns are locked on to, for the smartest raiders to dodge: raiders.js)
    rakedNote = false; wasPatching = false; shotsShown(); // (round shot loaded, five volleys of breakers aboard)
    fx.follow(player); surge.follow(player, zones.get(id));
    scene.add(ship.root);
    // the sun's shadows: a box round the ship, sized to her, so her masts and sails shade her deck. The sun sits
    // 400 m off along its light, so the box reaches from just short of the ship to just past her
    const r = R.length * 0.85;
    Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: SUN_OFF - r * 2, far: SUN_OFF + r * 2 });
    sun.shadow.camera.updateProjectionMatrix();
    cam.dist = camDistFor(R);
    $('ship-name').textContent = R.name; $('ship-cls').textContent = `${R.cls} · ${R.length} m`;
    resetVoyage();
    if (trial) W.n = TRIAL[id]; // (her trial's wave)
    newWind();
    setPaused(false); $('paused').hidden = true; $('howto').hidden = true;
    port.mode = 'voyage'; $('title').hidden = true; $('port').hidden = true;
    enter('voyage');
    // on a laptop, the keys show for this device's first two voyages, until the first wave comes; after that they're
    // folded away (H brings them back). On a phone, the hint shows for the first three. (A sea trial isn't counted)
    const sailed = settings.data.voyages; if (!trial) settings.keep('voyages', sailed + 1);
    $('help').hidden = sailed >= 2; $('btn-help').hidden = sailed < 2;
    clearTimeout(hintTimer); hintTimer = 0; hint.hidden = sailed >= 3; hint.classList.remove('gone');
    layout();
    region = regionAt(at.pos.x, at.pos.z); // the region's name shows when you cross into the next one
    if (trial) banner(`Sea trial: the ${R.name}`, `One fight, as she's built · nothing won or lost`);
    else banner(first ? 'Your first voyage, Captain' : `The ${R.name} sets sail`, `${skies().name} · ${windWords()}`);
    const E = payload('voyage:start'); E.ship = id; E.skies = d.skies; E.trial = !!trial; emit('voyage:start');
  }
  // back to port: keep this share of the voyage's shards (from a sea trial, none, and nothing in the save changes)
  function endVoyage(keep) {
    const tried = trial, got = tried ? 0 : Math.round(V.shards * keep);
    trial = null;
    if (!tried) progress.bank(got, W.n);
    raiders.clear(); bolts.clear(); pickups.clear(); gunnery.cancel(); wrecks.clear(); world.clear(); surge.clear(); wakes.clear(); hideBounties(); W.next = null;
    scene.remove(player.ship.root); // the port shows her (or the ship you were looking at) in its own scene
    looks.reset(player.ship); looks.clear(); // (spotless there, her scars patched and painted over)
    setPaused(false); // (leaving from the pause menu ends the pause, and that's told before the voyage's end)
    const E = payload('voyage:end'); E.kept = got; E.sunk = W.sunk; E.waves = W.n; E.trial = !!tried; emit('voyage:end');
    $('paused').hidden = true; $('howto').hidden = true; calmUp(false); bigMap(false); document.body.classList.remove('sinking');
    port.setMode('port');
    if (tried) {
      // (what she costs, and the ship to own first if the port sells her only after another)
      const T = SHIPS.find((s) => s.id === tried), first = NEEDS[tried] && !progress.data.ships[NEEDS[tried]].owned ? SHIPS.find((s) => s.id === NEEDS[tried]) : null;
      note(`Back from her sea trial: the ${T.name} costs ◆ ${fmt(PRICES[tried])}${first ? `, once you own the ${first.name}` : ''}`);
    } else if (got) note(`◆ ${got.toLocaleString('en')} banked from the voyage`);
    return got;
  }
  function newWind() { WIND.dir = Math.random() * Math.PI * 2; WIND.strength = WIND.base = 0.06 + Math.random() * 0.08; }
  // the wind, against the way the ship is heading: where it comes from (WIND.dir is the way it blows)
  const windWords = () => {
    const from = Math.abs(THREE.MathUtils.radToDeg(wrap(WIND.dir + Math.PI - player.heading)));
    return from > 125 ? 'the wind behind you' : from < 55 ? 'a head wind' : `a wind from your ${wrap(WIND.dir + Math.PI - player.heading) < 0 ? 'right' : 'left'}`;
  };
  function note(text) { const n = $('port-note'); n.textContent = text; n.classList.remove('on'); void n.offsetWidth; n.classList.add('on'); }
  // hiding in cloud: told once in a while as she slips into it (not every time she does), and when her guns give her away
  let hidNote = -99, gaveAway = -99;
  events.on('hidden', (e) => {
    if (mode !== 'voyage' || W.state !== 'fight') return; // (only worth saying with raiders about)
    if (e.on && time - hidNote > 25) { hidNote = time; toast('Hidden in the cloud: far-off raiders lose you'); }
    else if (!e.on && e.why === 'guns' && time - gaveAway > 12) { gaveAway = time; toast('Your guns gave you away'); }
  });
  // a giant bought: what she brings to the sky, said as she's bought (Chris: giant raiders only once you own one)
  const BOUGHT = { galleon: 'from now on, the treasure ships are Galleons', manowar: 'from now on, raiders sail Men-o\'-war too' };
  events.on('port:buy', (e) => { if (BOUGHT[e.ship]) note(`The ${SHIPS.find((s) => s.id === e.ship).name} is yours: ${BOUGHT[e.ship]}`); });
  // shot bought: how to load it at sea
  events.on('port:shot', (e) => note(`${SHOTS[e.shot].name} aboard, for every ship: ${touch ? 'tap the shot button over Surge at sea' : `press ${SHOTS[e.shot].key} at sea`}`));
  // newer progress came from the store: say so when this device had its own (a new browser just shows it)
  progress.onLoad((d, had, kept) => { if (had) note(kept ? 'Your other device\'s progress is here, plus the shards you won here' : 'Your progress from your other device is here'); });

  // ---------- the camera: behind the ship, swung round it by the mouse or a drag ----------
  const cam = { yaw: 0, pitch: 0.2, dist: 40, zoom: 1, look: new THREE.Vector3() };
  let viewFov = 55; // the view's width (degrees) before a Surge, slow motion and the guns' punch: wider on a phone held upright
  // (how far behind her the view sits: further for a bigger ship, and a little further again past 40 m, so a Galleon or
  // a Man-o'-war sits wholly in the lower part of the view, her stern in sight, with the raiders clear above her masts)
  const camDistFor = (R) => R.length * 1.35 + 16 + Math.max(0, R.length - 40) * 0.4;
  // a Surge widens the view by `fov` degrees, with a jolt: a spring that overshoots a little, peaking about 0.15 s in
  // (with no overshoot for players whose device asks for less motion). The spring is worked out in steps of at most
  // `step` seconds, so it moves the same on a phone running slowly as on a fast laptop (in one big step it would fly off)
  const SURGE_VIEW = { fov: 12, k: 550, c: 21, calm: 47, step: 1 / 120 }, surgeFov = { x: 0, v: 0 }, lessMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function surgeView(dt) {
    const want = player.surge.on > 0 && !player.down ? SURGE_VIEW.fov : 0, c = lessMotion.matches ? SURGE_VIEW.calm : SURGE_VIEW.c;
    const n = Math.ceil(dt / SURGE_VIEW.step - 1e-6), h = dt / Math.max(1, n);
    for (let i = 0; i < n; i++) { surgeFov.v += (SURGE_VIEW.k * (want - surgeFov.x) - c * surgeFov.v) * h; surgeFov.x += surgeFov.v * h; }
  }
  const aimPoint = new THREE.Vector3(), target = new THREE.Vector3(), toR = new THREE.Vector3(); // (kept, not made each frame)
  let locked = null, reach = true, wasLocked = null;
  const LOCK = payload('lock');
  function placeCamera(dt, inp) {
    // (how far a drag swings the view: the Settings card's aim speed, and up and down the other way round if flipped)
    const sens = (inp.locked ? 0.0026 : touch ? 0.0042 : 0.005) * AIM[settings.data.aim];
    cam.yaw -= inp.look.x * sens;
    cam.pitch = THREE.MathUtils.clamp(cam.pitch + inp.look.y * sens * (settings.data.flip ? -1 : 1), -0.35, 1.25);
    cam.zoom = THREE.MathUtils.clamp(cam.zoom * Math.pow(1.12, inp.zoom), 0.55, 2.6);
    // left alone for a while (and not mouse-locked), the camera eases back behind the ship
    const idle = performance.now() / 1000 - inp.lastLook;
    if (!inp.locked && idle > 3.5 && !inp.fire) {
      const k = 1 - Math.exp(-dt * 1.2);
      cam.yaw = Math.atan2(Math.sin(cam.yaw), Math.cos(cam.yaw)) * (1 - k); cam.pitch += (0.2 - cam.pitch) * k;
    }
    // (a Surge drops the view back a little and lowers it, with the view's widening: surgeFov, 0 to about 1)
    const a = player.heading + cam.yaw, R = player.ship.recipe, sk = surgeFov.x / SURGE_VIEW.fov, pitch = cam.pitch - 0.03 * sk;
    cam.look.set(Math.sin(a) * Math.cos(pitch), -Math.sin(pitch), Math.cos(a) * Math.cos(pitch));
    target.copy(player.pos); target.y += R.length * 0.42 + 2;
    camera.position.copy(target).addScaledVector(cam.look, -cam.dist * cam.zoom * (1 + 0.08 * sk));
    camera.lookAt(target);
    fx.applyCamera(camera, cam.look); // the guns' kick, and the shake from hits and blasts
    camera.updateMatrixWorld(); // (read straight away to place things on screen, even when nothing is drawn)
    // the guns lock on to the raider nearest the crosshair, and lead it
    locked = null;
    let bestA = Infinity;
    for (const r of raiders.list) {
      if (r.f.down || r.lost) continue; // (one hidden in cloud far off can't be locked on to)
      const v = toR.copy(r.f.pos).sub(camera.position), along = v.dot(cam.look);
      if (along <= 0) continue;
      const ang = v.angleTo(cam.look), tol = Math.max(0.05, Math.atan((r.R.length * 0.8) / along));
      if (ang < tol && ang < bestA) { bestA = ang; locked = r; }
    }
    if (locked !== wasLocked) { wasLocked = locked; if (locked) { LOCK.raider = locked; emit('lock'); LOCK.raider = null; } }
    player.locked = locked;
    aimPoint.copy(target).addScaledVector(cam.look, 800);
  }
  function aimFor(battery) {
    reach = true;
    if (!locked) return;
    player.ship.root.updateMatrixWorld(true);
    const m = gunnery.muzzle(battery);
    if (!m) { reach = false; return; }
    // (her sails for chain shot, her crystals for breakers; leading her by the shot's own speed: chain shot is slower)
    intercept(m.p, player.velocity, locked.f.aimAt(gunnery.shot), locked.f.velocity, m.K.speed * SHOTS[gunnery.shot].speed, aimPoint);
    reach = gunnery.reaches(battery, aimPoint, m);
  }

  // ---------- shots landing ----------
  // a shot's path this frame, from a to c: did it hit a raider (the Captain's) or the Captain's ship (a raider's)?
  // Each hit is told to the events (the sparks, shake and buzz answer it, fx.js), and marked on the HUD. A raider's
  // shot that only just misses flares and is told as a near miss. How hard it hits: its weight, times its shot's on the
  // part it hits (tactics.js SHOTS: chain shot shreds sails, breakers crack crystals), times half as much again for a
  // broadside's shot raking her, down her length from across her bow or stern (rakeMul), either way
  const HIT = payload('hit'), NEAR = payload('nearMiss'), LOW = payload('player:low');
  function hitTest(b, a, c) {
    if (b.owner === 'player') {
      const h = raiders.hitBy(a, c);
      if (!h) return false;
      const r = h.r, part = h.h.part, was = !!r.f.down, rake = b.K === KINDS.broadside ? rakeMul(b.v, r.ship.body) : 1, damage = b.damage * SHOTS[b.shot][part] * rake;
      r.f.hit(part, damage); V.hits++;
      HIT.owner = 'player'; HIT.target = 'raider'; HIT.part = part; HIT.at.copy(h.h.at); HIT.damage = damage; HIT.raider = r; HIT.size = b.K.size; HIT.raked = rake > 1;
      HIT.dir.copy(b.v).normalize(); HIT.vel.copy(r.f.velocity); emit('hit');
      hitMark(part, !was && !!r.f.down); tagFlash(r, part);
      if (rake > 1) raked('player', r, h.h.at);
      return true;
    }
    if (player.down) return false;
    const h = firstHit(zones.get(player.ship.recipe.id), player.ship.body, a, c, player.ship.U.uFold.value.x);
    if (!h) { nearMiss(b, a, c); return false; }
    const before = player.frac(h.part), rake = b.K === KINDS.broadside ? rakeMul(b.v, player.ship.body) : 1, damage = b.damage * SHOTS[b.shot][h.part] * rake;
    player.hit(h.part, damage);
    HIT.owner = 'raider'; HIT.target = 'player'; HIT.part = h.part; HIT.at.copy(h.at); HIT.damage = damage; HIT.raider = b.from; HIT.size = b.K.size; HIT.raked = rake > 1;
    HIT.dir.copy(b.v).normalize(); HIT.vel.copy(player.velocity); emit('hit');
    if (before >= 0.3 && player.frac(h.part) < 0.3) { LOW.part = h.part; emit('player:low'); }
    hurt = Math.min(1, hurt + (rake > 1 ? 0.75 : 0.45)); // (raked, the red at the screen's edge flares harder)
    incoming(b, h.part);
    if (rake > 1) raked('raider', b.from, h.at);
    return true;
  }
  // raking fire, told once a volley (its first raking hit: a broadside's shots land within half a second): yours marked
  // "Raked!" by the crosshair; a raider raking you, the first time in a voyage, is explained in a toast
  const RAKED = payload('raked'), lastRake = { player: -9, raider: -9 };
  let rakedNote = false, rakeAnim = null;
  function raked(owner, r, at) {
    if (time - lastRake[owner] < 0.6) return;
    lastRake[owner] = time;
    RAKED.owner = owner; RAKED.raider = r; RAKED.at.copy(at); emit('raked'); RAKED.raider = null;
    if (owner === 'player') { rakeAnim?.cancel(); rakeAnim = $('raked').animate([{ opacity: 1, transform: 'scale(1.35)' }, { opacity: 1, transform: 'scale(1)', offset: 0.25 }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 900, easing: 'ease-out' }); }
    else if (!rakedNote) { rakedNote = true; toast('Raked! Don\'t let them cross your bow'); }
  }
  // a raider's shot passing close: once it's past its nearest point to the ship (not while it's still coming on, as
  // it might yet hit), within her length and a bit
  const seg = new THREE.Line3(), near = new THREE.Vector3(), nv = new THREE.Vector3();
  function nearMiss(b, a, c) {
    if (b.whiz) return;
    const t = seg.set(a, c).closestPointToPointParameter(player.pos, true);
    if (t >= 1) return;
    const limit = player.ship.recipe.length * 0.6 + 14, d = seg.at(t, near).distanceTo(player.pos);
    if (d > limit) return;
    b.whiz = true; b.flare = 0.12;
    nv.copy(near).applyMatrix4(camera.matrixWorldInverse);
    NEAR.pan = THREE.MathUtils.clamp(nv.x / 15, -1, 1); NEAR.close = 1 - d / limit; NEAR.at.copy(near);
    emit('nearMiss');
  }

  // ---------- shot, and patching her ----------
  // the shot her guns are loaded with (tactics.js): one she has (round shot always; chain shot and breakers once earned
  // or bought; breakers while any are left) is loaded, every battery reloading for it, and said so; the next she has, for
  // a right-click or the phone's shot button
  const SHOT = payload('shot'), PATCHED = payload('patch');
  const hasShot = (s) => s === 'round' || (!!progress.data.shots?.[s] && (s !== 'breaker' || gunnery.breakers > 0));
  const extraShots = () => !!(progress.data.shots?.chain || progress.data.shots?.breaker);
  function pickShot(s, why = 'pick') {
    if (!gunnery || player.down || !SHOTS[s] || s === gunnery.shot) return false;
    if (!hasShot(s)) {
      toast(s === 'breaker' && progress.data.shots?.breaker ? 'Out of crystal breakers' : `No ${SHOTS[s].name.toLowerCase()} yet: earn it at sea, or buy it in port`);
      return false;
    }
    gunnery.setShot(s);
    SHOT.shot = s; SHOT.why = why; SHOT.left = gunnery.breakers; emit('shot');
    toast(why === 'out' ? 'Out of crystal breakers: loading round shot' : `Loading ${SHOTS[s].name.toLowerCase()}${s === 'breaker' ? ` (${gunnery.breakers} volley${gunnery.breakers === 1 ? '' : 's'} left)` : ''}`);
    shotsShown();
    return true;
  }
  const nextShot = () => { const i = SHOT_ORDER.indexOf(gunnery.shot); for (let k = 1; k < SHOT_ORDER.length; k++) { const s = SHOT_ORDER[(i + k) % SHOT_ORDER.length]; if (hasShot(s)) return s; } return gunnery.shot; };
  // a kind of shot earned by a deed: kept in the save, said in a banner (how to load it), and the phone's button shown
  function earn(s, line) {
    const d = progress.data;
    if (d.shots[s]) return;
    d.shots[s] = true; progress.save();
    SHOT.shot = s; SHOT.why = 'earned'; SHOT.left = gunnery.breakers; emit('shot');
    banner(`${SHOTS[s].name}!`, `${line}: ${touch ? 'tap the shot button over Surge' : `press ${SHOTS[s].key}`}`);
    shotsShown();
  }
  // the phone's shot button (shown once she has more than round shot) and the guns' label, as her shot changes
  const shotHex = (s) => `#${SHOTS[s].color.toString(16).padStart(6, '0')}`;
  function shotsShown() {
    if (!gunnery) return;
    const s = gunnery.shot, more = extraShots(), b = $('btn-shot'), key = `${s}:${more}:${gunnery.breakers}`;
    if (b._key === key) return;
    b._key = key;
    if (document.body.classList.contains('has-shot') !== more) { document.body.classList.toggle('has-shot', more); b.hidden = !more; layout(); }
    b.innerHTML = `${SHOT_ICON[s]}<small>${SHOTS[s].short}${s === 'breaker' ? ` ${gunnery.breakers}` : ''}</small>`;
    b.style.setProperty('--shot', shotHex(s)); b.setAttribute('aria-label', `${SHOTS[s].name} loaded: tap for the next`);
    setText($('battery-shot'), more ? ` · ${SHOTS[s].name}${s === 'breaker' ? ` (${gunnery.breakers})` : ''}` : '');
    setStyle($('reload-bar'), 'background', shotHex(s));
  }
  // the crew patching her (flight.js startPatch: X, or the phone's Patch button), said in a toast; told as it starts and
  // as it's done. Refused while they're at it or getting ready again (saying how long), or with nothing to patch
  let wasPatching = false;
  function patchUp() {
    if (!player || player.down) return;
    const P = player.patch;
    if (P.cd > 0) { toast(P.t > 0 ? `The crew are patching the ${P.part}` : `The crew can patch her again in ${Math.ceil(P.cd)} s`); return; }
    const part = player.startPatch();
    if (!part) { toast('Nothing to patch'); return; }
    toast(`The crew patch the ${part}: the guns reload slower for ${PATCH.time} s`);
    PATCHED.part = part; PATCHED.stage = 'start'; emit('patch'); wasPatching = true;
  }

  // ---------- the raiders come in waves; between them, sail on or go home ----------
  // a wave in words: its raider captain's ship first, then its treasure ships, then the rest, biggest first ("a raider
  // captain's Frigate, a treasure Brig, two Frigates and a Cutter")
  function describe(wave) {
    const groups = new Map(), plural = (c) => (c === 'Man-o\'-war' ? 'Men-o\'-war' : `${c}s`);
    const add = (key, order, one, many) => { const g = groups.get(key) ?? { order, n: 0, one, many }; g.n++; groups.set(key, g); };
    wave.ids.forEach((id, i) => {
      const c = FLEET.find((s) => s.id === id).cls;
      if (i === wave.captain) add('captain', -1000, `a raider captain's ${c}`, '');
      else if (treasureShip(wave, i)) add('treasure:' + id, i - 100, `treasure ${c}`, `treasure ${plural(c)}`);
      else add(id, i, c, plural(c));
    });
    const parts = [...groups.values()].sort((a, b) => a.order - b.order).map((g) => (g.many === '' ? g.one : `${NUMBER[g.n]} ${g.n > 1 ? g.many : g.one}`));
    return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0];
  }
  // which giants the Captain owns: only those sail among the raiders (raiders.js waveAt). Read as a voyage starts (she
  // can't buy one at sea)
  const giants = { galleon: false, manowar: false };
  const nextWave = (n) => waveAt(n, skies().extra, trial ? null : skies().storms, giants); // (a sea trial in clear weather)
  const NUM = new Intl.NumberFormat('en'), fmt = (n) => NUM.format(Math.round(n)); // (one formatter, made once: a phone is slow to make them)
  const DOWN = payload('raider:down'), SPILL = payload('shards:spill');
  function waves(dt, gone) {
    for (const r of gone) {
      V.downed++;
      DOWN.raider = r; DOWN.why = r.f.down.why; DOWN.at.copy(r.f.pos); emit('raider:down'); // (her end in the sky: wrecks.js)
      // deeds that earn a kind of shot (not on a sea trial: it changes nothing): chain shot from the first treasure ship
      // that strikes to her, crystal breakers from the first raider captain's Frigate she sinks
      if (!trial && r.role === 'prize' && r.f.down.why === 'struck') earn('chain', 'Her crew left chain shot in the hold');
      if (!trial && r.captain && r.id === 'frigate') earn('breaker', 'Crystal breakers in her hold');
      const who = r.captain ? `The captain's ${r.R.cls}` : `The ${r.R.cls}`, why = r.f.down.why;
      if (trial) { toast(why === 'struck' ? `${who} strikes her colours!` : why === 'hull' ? `${r.captain ? who : r.R.cls} down!` : `${who} is sinking!`); continue; } // (a sea trial: no shards)
      SPILL.at.copy(r.f.pos).setY(r.f.pos.y + 2); SPILL.total = r.bounty * skies().shards * (1 + 0.1 * W.n);
      pickups.spill(SPILL.at, r.f.velocity, SPILL.total); emit('shards:spill');
      bounty(r, SPILL.total, SPILL.at);
      toast(why === 'struck' ? `${who} strikes her colours! Gather her treasure` : why === 'hull' ? `${r.captain ? who : r.R.cls} down! Fly through her shards` : `${who} is sinking! Fly through her shards`);
    }
    for (const r of raiders.escaped) { toast(`The ${r.R.cls} got away with her treasure`); payload('raider:escaped').raider = r; emit('raider:escaped'); }
    if (W.sunk) return;
    if (W.lost > 0) {
      if ((W.lost -= dt) <= 0) {
        W.sunk = true; bigMap(false); // (the card says so over everything: game.html)
        $('paused-title').textContent = `The ${player.ship.recipe.name} went down`;
        $('paused-line').textContent = trial ? 'It was only her sea trial: it cost nothing, and she\'s back in port as good as new.' : V.shards ? `Your crew got her home with half this voyage's shards: ◆ ${fmt(V.shards / 2)}.` : 'Your crew got her home.';
        $('btn-resume').hidden = true; $('btn-abandon').textContent = 'To port'; $('paused').hidden = false;
        input.active = false;
      }
      return;
    }
    if (player.down) {
      W.lost = 4; calmUp(false); document.body.classList.add('sinking'); banner(`The ${player.ship.recipe.name} is going down`, 'All hands to the boats');
      gunnery.cancel(); payload('player:down').why = player.down.why; emit('player:down');
      return;
    }
    if (W.state !== 'fight') { player.repair(dt * 0.12); looks.repair(player.ship, dt); } // between fights the crew patch her up (and her scars)
    if (W.state === 'calm') {
      if ((W.timer -= dt) <= 0) {
        const wave = W.next ?? nextWave(W.n), a = raiders.spawnWave(wave, player);
        W.next = null;
        // a storm wave: the storm rolls in (its wind blowing from it); a storm wave, and every third, comes out of a
        // bank of cloud on the raiders' way in, 500 to 800 m ahead of them
        if (wave.storm) sky.startStorm(); else sky.clearWeather();
        if (wave.bank) bankFor(raiders.list, player.pos);
        // (a treasure ship's wave: a Galleon's, or one with a treasure ship of another class, a treasure Brig before
        // the Captain owns a Galleon)
        const prize = hasTreasure(wave), rich = treasureCount(wave);
        const at = trial ? 'Sea trial' : `Wave ${W.n + 1}`; // (a sea trial's one fight isn't counted as a wave)
        const title = prize ? `${at}: ${rich > 1 ? `${NUMBER[rich]} treasure ships` : 'a treasure ship'}` : wave.captain >= 0 ? `${at}: a raider captain` : wave.ids.includes('manowar') ? `${at}: a Man-o'-war` : trial ? 'Sea trial: raiders' : `Raiders, wave ${W.n + 1}`;
        banner(title, `${describe(wave)}, ${sideWords(a - player.heading)} · ${windWords()}${prize ? (rich > 1 ? ' · shoot their sails to catch them' : ' · shoot her sails to catch her') : ''}`);
        W.state = 'fight';
        if (W.n === 0 && !$('help').hidden) toggleHelp(); // (the keys fold away as the first wave comes)
        const E = payload('wave:start');
        Object.assign(E, { n: W.n + 1, title, captain: wave.captain >= 0, prize, fortress: wave.ids.includes('manowar'), count: wave.ids.length });
        emit('wave:start');
      }
    } else if (W.state === 'fight') {
      if (!raiders.list.some((r) => !r.f.down)) {
        // the last raider of a wave going down (this moment: not a treasure ship getting away): the world slows for a
        // moment, and the card rises only after it
        const last = raiders.list.some((r) => r.f.down && r.f.down.t < 0.5);
        if (last) fx.slowmo(1.6, 0.25);
        W.n++;
        const bonus = trial ? 0 : Math.round(20 * W.n * skies().shards);
        V.shards += bonus;
        const E = payload('wave:cleared'); E.n = W.n; E.bonus = bonus; emit('wave:cleared');
        W.state = 'choose'; W.choose = 25;
        $('btn-sail-on').hidden = !!trial;
        if (trial) {
          // her sea trial won: the card says so, with only the way home (by itself after 25 s), and what she costs
          sky.clearWeather(); world.puffs.bank(null);
          const R = player.ship.recipe;
          $('calm-title').textContent = 'Sea trial over: she won';
          $('calm-line').textContent = `It cost nothing. The ${R.name} is ◆ ${fmt(PRICES[R.id])} in port.`;
          $('calm').classList.toggle('late', last); calmUp(true);
          W.bonus = 0; W.bonusShown = 0;
          return;
        }
        $('calm-title').textContent = `Wave ${W.n} beaten`;
        const next = nextWave(W.n);
        W.next = next;
        // the weather: a storm wave next shows its storm on the horizon now (ahead of her, more or less), and says so on
        // the card; otherwise this wave's storm (if it had one) clears. The bank of cloud the wave came out of goes
        world.puffs.bank(null);
        let storm = '';
        if (next.storm) {
          if (!sky.weather.want) sky.front(player.heading + (Math.random() - 0.5) * 1.8);
          storm = sky.weather.want ? ' The storm isn\'t done yet.' : ` A storm is rolling in from the ${COMPASS[Math.round(compassDeg(sky.weather.from) / 45) % 8]}.`;
        } else sky.clearWeather();
        // a captain's ship (and a treasure ship) is built now, while the card is up, not as the wave appears (a stutter
        // on a phone)
        raiders.prepareWave(next);
        $('calm-line').innerHTML = `◆ <b id="calm-bonus">0</b> for the wave · ◆ ${fmt(V.shards)} aboard. Next: ${describe(next)}.${storm}`;
        // (shown at once, for the game; it rises into view after the slow motion, and its bonus counts up as it does)
        $('calm').classList.toggle('late', last); calmUp(true);
        W.bonus = bonus; W.bonusShown = -1; W.bonusAt = performance.now() / 1000 + (last ? 1.4 : 0.1);
      }
    } else if (W.state === 'choose') {
      W.choose -= dt;
      if (trial) { if (W.choose <= 0) goHome(); return; } // (her sea trial over: home by itself)
      setText($('sail-on-text'), `Sail on (${Math.max(0, Math.ceil(W.choose))})`);
      if (W.choose <= 0) sailOn();
    }
  }
  function sailOn() {
    if (W.state !== 'choose' || trial) return;
    calmUp(false); W.state = 'calm'; W.timer = 4; newWind();
  }
  // a bank of cloud across the raiders' way in, 500 to 800 m ahead of them (and never nearer her than 600 m)
  const mid = new THREE.Vector3();
  function bankFor(list, to) {
    mid.set(0, 0, 0); let n = 0;
    for (const r of list) if (!r.f.down && r.role !== 'prize') { mid.add(r.f.pos); n++; }
    if (!n) return;
    mid.divideScalar(n);
    const d = mid.distanceTo(to);
    if (d > 1300) world.puffs.bank(mid, to, Math.min(500 + Math.random() * 300, d - 600));
  }
  const COMPASS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
  // the card between waves up or down (while it's up there's nothing to fire at: the guns' label makes way for it, and
  // a laptop's keys fold away; the panels the edge tags keep clear of are measured again, with the label or without)
  function calmUp(on) {
    $('calm').hidden = !on; document.body.classList.toggle('between', on);
    if (on && !$('help').hidden) toggleHelp();
    layout();
  }
  const goHome = () => { if (W.state === 'choose') endVoyage(1); };
  $('btn-sail-on').addEventListener('click', sailOn);
  $('btn-go-port').addEventListener('click', goHome);
  // paused or going again, told whenever it changes (pause() below, and leaving a paused voyage for port)
  function setPaused(on) { if (paused === on) return; paused = on; payload('pause').on = on; emit('pause'); }
  function pause(on) {
    if (mode !== 'voyage' || W.sunk) return;
    setPaused(on); input.active = !on;
    if (!on) { input.look.x = input.look.y = 0; input.zoom = 0; input.pressed.clear(); } // nothing moved while paused carries over
    if (on) {
      if (document.pointerLockElement) document.exitPointerLock();
      bigMap(false); // (the pause card lies over everything at sea, but the map would be in its way when it's done)
      const fighting = W.state === 'fight' || player.down;
      $('paused-title').textContent = 'Paused';
      $('paused-line').textContent = trial ? 'Back to port now ends her sea trial. It costs nothing.' : !V.shards ? 'Back to port now ends the voyage.' : fighting ? `Back to port now, mid-fight, and you keep half this voyage's shards: ◆ ${fmt(V.shards / 2)}.` : `Back to port now keeps all this voyage's shards: ◆ ${fmt(V.shards)}.`;
      $('btn-resume').hidden = false; $('btn-abandon').textContent = 'Back to port';
    }
    $('paused').hidden = !on;
  }
  $('btn-pause').addEventListener('click', () => pause(true));
  $('btn-resume').addEventListener('click', () => pause(false));
  // how to fly (from the pause card): the touch controls on a phone, the keys on a laptop; closing it goes back to the
  // pause card (Got it, the dim sky round it, or Esc)
  const howto = $('howto');
  $('btn-howto').addEventListener('click', () => { howto.hidden = false; });
  $('btn-howto-done').addEventListener('click', () => { howto.hidden = true; });
  howto.addEventListener('click', (e) => { if (e.target === howto) howto.hidden = true; });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !howto.hidden) { howto.hidden = true; e.stopPropagation(); } }, true);
  $('btn-abandon').addEventListener('click', () => endVoyage(W.sunk || W.state === 'fight' || player.down ? 0.5 : 1));
  document.addEventListener('visibilitychange', () => { if (document.hidden && mode === 'voyage' && !paused) pause(true); });

  // ---------- the help, and the big map ----------
  const toggleHelp = () => { const h = $('help'); h.hidden = !h.hidden; $('btn-help').hidden = !h.hidden; layout(); };
  $('btn-help').addEventListener('click', toggleHelp);
  // the big map: as big as fits, in the middle over a dimmed sky, drawn sharp at its own size; the cross (top right of
  // it), a tap on it or round it, or M closes it
  const mini = $('minimap'), mctx = mini.getContext('2d'), mimg = new Image(); mimg.src = minimapUrl;
  const mapDim = $('map-dim'), mapClose = $('map-close');
  function bigMap(on = !mini.classList.contains('big')) {
    mini.classList.toggle('big', on); mapDim.hidden = mapClose.hidden = !on;
    hudTimer = 0; // (redrawn sharp at its new size straight away)
    if (on) placeMapClose();
  }
  function placeMapClose() { const b = mini.getBoundingClientRect(); mapClose.style.left = `${Math.round(b.right - 50)}px`; mapClose.style.top = `${Math.round(b.top + 6)}px`; }
  mini.addEventListener('click', () => bigMap());
  mapDim.addEventListener('click', () => bigMap(false)); mapClose.addEventListener('click', () => bigMap(false));

  const input = makeInput(canvas, document.body);
  // the touch hint (a phone's first voyages) fades a few seconds after the first touch at sea (drags in port turn the
  // ship, and don't count)
  const hint = $('touch-hint');
  let hintTimer = 0;
  canvas.addEventListener('pointerdown', () => {
    if (mode !== 'voyage' || hintTimer || hint.classList.contains('gone')) return;
    hintTimer = setTimeout(() => { hint.classList.add('gone'); hintTimer = 0; setTimeout(layout, 700); }, 4000); // (gone, the edge tags may use its place)
  });
  // the window's size, read once when it changes (reading it while the page is being written each frame would make the
  // browser lay the page out again there and then)
  const view = { w: innerWidth, h: innerHeight };
  let sizes = 0; // (how many times the window has changed size)
  function resize() {
    const w = view.w = innerWidth, h = view.h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = viewFov = w < h ? 68 : 55; camera.updateProjectionMatrix();
    camera.userData.pixelScale = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    billowsFor(THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect))); // (a storm's billows, as many as suit the view's width)
    for (const s of built.values()) s.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    raiders.setScale(camera.userData.pixelScale); // (and the raiders' glows, the same)
    sizes++; // (the tags measured again: a phone turned may give their words other sizes, as on the smallest phones)
    port.resize(); title.resize(); layout();
    if (mini.classList.contains('big')) placeMapClose();
  }
  // where the HUD's panels are, so the raiders' tags at the screen's edge keep clear of them: those along the top
  // (your ship's panel, the compass, the pause button, the map and the score, and on a laptop the guns' label under
  // the compass) and along the bottom (the touch buttons, the guns' label on a phone, the hint, the keys). Measured as
  // a voyage starts, and when the window, the panels or the card between waves change
  // And where the card between waves is, while it's up (bounties keep clear of it): measured where it ends up, as it
  // may still be rising into place (its rising moves it with translate, which offsets leave out; it's centred with
  // translate too)
  const EDGE = { top: [], bottom: [] }, TOP_IDS = ['ship', 'compass', 'btn-pause', 'minimap', 'score'], BOTTOM_IDS = ['touch-buttons', 'battery', 'touch-hint', 'help', 'btn-help'];
  const CALM_AT = { on: false, l: 0, r: 0, t: 0, b: 0, top: false };
  // (and the toast's place, from its top down a line or two, for the warning to keep clear of as it moves off her ship;
  // `n` counts the measurings, so the warning measures its own place again after one)
  const TOAST_AT = { t: 0, b: 0, n: 0 };
  function layout() {
    TOAST_AT.n++;
    if (mode !== 'voyage') return;
    const boxes = (ids) => ids.filter((id) => !$(id).classList.contains('gone')).map((id) => $(id).getBoundingClientRect()).filter((b) => b.width && b.height).map((b) => ({ l: b.left, r: b.right, t: b.top, b: b.bottom }));
    EDGE.top = boxes(TOP_IDS); EDGE.bottom = boxes(BOTTOM_IDS).filter((b) => b.t > view.h * 0.4);
    EDGE.top.push(...boxes(['battery']).filter((b) => b.b < view.h * 0.4)); // (the guns' label, wherever it is)
    const c = $('calm');
    CALM_AT.on = !c.hidden && c.offsetWidth > 0;
    if (CALM_AT.on) Object.assign(CALM_AT, { l: c.offsetLeft - c.offsetWidth / 2, r: c.offsetLeft + c.offsetWidth / 2, t: c.offsetTop, b: c.offsetTop + c.offsetHeight, top: c.offsetTop + c.offsetHeight / 2 < view.h / 2 });
    const t = $('toast').getBoundingClientRect(); TOAST_AT.t = t.top; TOAST_AT.b = t.top + Math.max(t.height, 26);
  }
  addEventListener('resize', resize);
  applyPicture(); applyHands(); fx.shake = settings.data.shake;
  resize();
  port.setMode('title');

  // ---------- the HUD ----------
  // Written sparingly: what changes every frame (the tags' places, the reload bar) is written every frame, the rest ten
  // times a second, and nothing is written that hasn't changed, so a phone spends its time on the sky, not the page
  let region = '', regionTimer = 0, hudTimer = 0, hurt = 0;
  const shardCount = { shown: 0, from: 0, to: 0, t: 1, n: -1 }; // the shard count shown, counting up to what's in the hold (n: the whole number written)
  const flash = (el) => { el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); };
  // the banner, and where it is on the screen and until when (real time, in ms) it shows, so a bounty keeps clear of it
  const bannerAt = { left: 0, right: 0, top: 0, bottom: 0, until: 0 }, BANNER_BACK = 700; // (the tags under it come back as it fades: ms before it's gone)
  function banner(title, line) {
    $('region').classList.remove('on'); // (they share a place: the banner wins)
    const el = $('banner'); $('banner-title').textContent = title; $('banner-line').textContent = line; flash(el);
    const b = el.getBoundingClientRect(); // (cheap here: flash has just laid the page out)
    Object.assign(bannerAt, { left: b.left, right: b.right, top: b.top, bottom: b.bottom, until: performance.now() + 4400 });
  }
  function toast(text) { const t = $('toast'); t.textContent = text; flash(t); }
  const setText = (el, v) => { if (el._v !== v) { el._v = v; el.textContent = v; } };
  const setStyle = (el, k, v) => { if (el['_' + k] !== v) { el['_' + k] = v; el.style[k] = v; } };
  // a bar's width (f: 0 to 1). A health bar has a pale chip behind it that follows a moment later, so the piece just
  // knocked off shows white before it drains away (the lag is the chip's CSS transition)
  const setWidth = (el, f) => { const p = Math.round(f * 100); if (el._w !== p) { el._w = p; el.style.width = p + '%'; if (el._chip) el._chip.style.width = p + '%'; } };
  const chip = (el) => { el._chip = el.previousElementSibling?.tagName === 'B' ? el.previousElementSibling : null; return el; };
  const H = {}; // the HUD's elements, looked up once
  for (const id of ['hurt', 'battery-name', 'battery-count', 'reload-bar', 'aim', 'tags', 'r-speed', 'r-height', 'r-sail', 'sail-bar', 'score-n', 'wave-n', 'voyage-n',
    'heading', 'wind-arrow', 'wind-n', 'wind-words', 'h-surge', 'row-surge', 'btn-surge', 'h-patch', 'row-patch', 'btn-patch', 'warn', 'score', 'score-raiders', 'hitmark', 'hitgem', 'killring', ...PARTS.flatMap((k) => [`h-${k}`, `n-${k}`, `row-${k}`])]) H[id] = $(id);
  for (const k of PARTS) { chip(H[`h-${k}`]); H[`row-${k}`]._dt = H[`row-${k}`].querySelector('dt'); H[`row-${k}`]._bar = H[`row-${k}`].querySelector('.meter'); }

  // ---------- hits, on the HUD ----------
  // your shot landing: four ticks round the crosshair in the colour of what it hit (gold hull, cream sails, orange
  // crystals, with a sparkle), restarted at most every 50 ms so a rippling broadside reads as a chain of flickers; a
  // shot that brings her down: a red X and a ring growing out. (Animated by the browser, on transform and opacity.)
  const HIT_COLOUR = { hull: '#e2bd67', sails: '#ecdcb8', crystals: '#ff9f45', kill: '#ff4636' };
  let markAt = -1, markAnim = null, ringAnim = null;
  function hitMark(part, killed) {
    if (!killed && time - markAt < 0.05) return;
    markAt = time;
    const g = H.hitmark, k = killed ? 'kill' : part;
    g.setAttribute('stroke', HIT_COLOUR[k]); g.dataset.part = k;
    H.hitgem.setAttribute('visibility', k === 'crystals' ? 'visible' : 'hidden');
    markAnim?.cancel();
    markAnim = g.animate([{ opacity: 1, transform: 'scale(1.35)' }, { opacity: 0, transform: 'scale(1)' }], { duration: killed ? 420 : part === 'crystals' ? 260 : 180, easing: 'ease-out' });
    if (killed) { ringAnim?.cancel(); ringAnim = H.killring.animate([{ opacity: 1, transform: 'scale(0.6)' }, { opacity: 0, transform: 'scale(2.2)' }], { duration: 420, easing: 'ease-out' }); }
  }
  // the bar for the part hit flashes on the raider's tag
  const FLASH = [{ filter: 'brightness(2.6)' }, { filter: 'brightness(1)' }];
  function tagFlash(r, part) { const m = r.tag?._m[PARTS.indexOf(part)]; if (m) m.parentElement.animate(FLASH, 150); }
  // a hit on you: a red arc on a ring round the middle of the screen pointing where the shot came from (the oldest of
  // four reused), the red at the screen's edge leaning that way, and the row for what was hit flashing in your panel
  const arcs = [...document.querySelectorAll('#incoming i')], from = new THREE.Vector3(), FADE = { duration: 1200, easing: 'ease-in' };
  const ROW = [{ color: '#ff6a50', offset: 0 }, { color: '#ff6a50', offset: 0.5 }], BAR = [{ boxShadow: '0 0 0 2px #ff4636' }, { boxShadow: '0 0 0 2px rgba(255, 70, 54, 0)' }];
  let arcN = 0, lastArc = null;
  function incoming(b, part) {
    from.copy(b.v).normalize().multiplyScalar(-300).add(player.pos).applyMatrix4(camera.matrixWorldInverse);
    const th = Math.atan2(from.x, from.y), el = arcs[arcN];
    arcN = (arcN + 1) % arcs.length; lastArc = th;
    el.style.transform = `rotate(${th.toFixed(3)}rad)`;
    el._a?.cancel(); el._a = el.animate([{ opacity: 1 }, { opacity: 0 }], FADE);
    H.hurt.style.setProperty('--hx', (-Math.sin(th)).toFixed(2)); H.hurt.style.setProperty('--hy', Math.cos(th).toFixed(2));
    const row = H[`row-${part}`];
    row._dt.animate(ROW, 300); row._bar.animate(BAR, 300);
  }
  const proj = new THREE.Vector3(), corner = new THREE.Vector3(), placed = [], edges = [], over = [], byY = (a, b) => a._y - b._y;
  // a tag's height in pixels, and saying "Broadside!" in place of its bars (and a pixel to spare): measured on the first
  // tags shown (the fonts decide them), until then a fair guess
  const TAG = { h: 42, warn: 44, measured: false, warned: false, sizes: 0 };
  // a tag pinned at the screen's edge sits by its bottom middle at (x, y), all of it on the screen by its own width (at
  // least 52 px in from the sides, until it's been measured): not over the panels along the top (with its arrow: up px
  // above that, its height and the arrow's reach over its top, more for a tag saying "Broadside!", whose arrow is
  // bigger) or the bottom (layout()), for any panel within half the widest tag (a treasure ship's, far off) of it
  const TAG_HALF = 52, TAG_EDGE = 6, TAG_REACH = 86, ARROW = 18, ARROW_WARN = 22;
  const edgeX = (el, W2) => W2 - Math.max(TAG_HALF, el._hw + TAG_EDGE); // (the furthest from the middle its bottom middle goes)
  const tagUp = (warn) => (warn ? TAG.warn + ARROW_WARN : TAG.h + ARROW);
  const tagH = (a) => (a._warn ? TAG.warn : TAG.h); // (a tag's height: taller saying "Broadside!")
  function edgeTop(x, up) { let t = 6; for (const b of EDGE.top) if (x > b.l - TAG_REACH && x < b.r + TAG_REACH && b.b + 4 > t) t = b.b + 4; return t + up; }
  function edgeBottom(x) { let y = view.h - 6; for (const b of EDGE.bottom) if (x > b.l - TAG_REACH && x < b.r + TAG_REACH && b.t - 4 < y) y = b.t - 4; return y; }
  // a tag over a ship (its bottom middle at x, hw half as wide as it is) may reach up to just under the panels along the
  // top over it (the compass, the guns' label...) and down to just over those along the bottom, never off the screen
  function overTop(x, hw) { let t = 6; for (const b of EDGE.top) if (x + hw > b.l - 4 && x - hw < b.r + 4 && b.b + 4 > t) t = b.b + 4; return t; }
  function overBottom(x, hw) { let y = view.h - 6; for (const b of EDGE.bottom) if (x + hw > b.l - 4 && x - hw < b.r + 4 && b.t - 4 < y) y = b.t - 4; return y; }
  // a raider's ship on the screen, for the tags to keep off (into her tag: _sl, _sr, _st, _sb, in pixels, and _box; and
  // _ship, whether tags keep off her: not when she's so big on the screen, close by, that no tag could hide her). Her
  // box: from her ram to her stern, her keel to her mast heads, her wings' spread (as every class is built, with a little
  // to spare). None when she's lost in cloud, behind the camera or pinned at the edge
  function shipBox(r, el, W2, H2) {
    const L = r.R.length, hull = r.ship.hull, M = r.ship.body.matrixWorld, top = L * 0.33 + 2.2, keel = -(L * 0.18 + 1.5), half = L * 0.22 + 1;
    let l = Infinity, rt = -Infinity, t = Infinity, b = -Infinity;
    for (let i = 0; i < 8; i++) {
      corner.set(i & 1 ? half : -half, i & 2 ? top : keel, i & 4 ? hull.zb + L * 0.2 : hull.zs - L * 0.1).applyMatrix4(M).project(camera);
      if (corner.z > 1) return;
      const sx = (corner.x + 1) * W2, sy = (1 - corner.y) * H2;
      if (sx < l) l = sx; if (sx > rt) rt = sx; if (sy < t) t = sy; if (sy > b) b = sy;
    }
    el._sl = l; el._sr = rt; el._st = t; el._sb = b; el._box = true;
    el._ship = rt - l < 4 * el._hw && b - t < 2 * TAG.h;
  }
  // the Captain's own ship on the screen (OWN, in pixels): the box round her as she's built (keel to mast heads, ram to
  // stern, her wings' spread), as she flies now, in four slabs from stern to bow, each as it shows on the screen (so
  // the nearer end, bigger, and the farther end, smaller, each have their own: much closer to her than one box round
  // all of it, as she's seen in perspective). The raiders' tags and the warning keep off her (OFF), so a battered ship
  // seen from behind shows her scars. Worked out each frame the tags are placed; off when she's not in sight. (l, r, t,
  // b: round all of her)
  const SLABS = 4, OWN = { on: false, l: 0, r: 0, t: 0, b: 0, slabs: Array.from({ length: SLABS }, () => ({ l: 0, r: 0, t: 0, b: 0 })) }, OFF = [];
  const overlaps = (l, r, t, b, o, gap = 3) => l < o.r + gap && r > o.l - gap && t < o.b + gap && b > o.t - gap;
  function ownBox(W2, H2) {
    const bd = player.ship.bounds, M = player.ship.body.matrixWorld, dz = (bd.max.z - bd.min.z) / SLABS;
    OWN.on = false; OWN.l = OWN.t = Infinity; OWN.r = OWN.b = -Infinity;
    for (let s = 0; s < SLABS; s++) {
      let l = Infinity, rt = -Infinity, t = Infinity, b = -Infinity;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? bd.max.x : bd.min.x, i & 2 ? bd.max.y : bd.min.y, bd.min.z + dz * (s + (i & 4 ? 1 : 0))).applyMatrix4(M).project(camera);
        if (corner.z > 1) return; // (the camera inside her box: no telling)
        const sx = (corner.x + 1) * W2, sy = (1 - corner.y) * H2;
        if (sx < l) l = sx; if (sx > rt) rt = sx; if (sy < t) t = sy; if (sy > b) b = sy;
      }
      const S = OWN.slabs[s]; S.l = l; S.r = rt; S.t = t; S.b = b;
      if (l < OWN.l) OWN.l = l; if (rt > OWN.r) OWN.r = rt; if (t < OWN.t) OWN.t = t; if (b > OWN.b) OWN.b = b;
    }
    OWN.on = !(OWN.r < 0 || OWN.l > view.w || OWN.b < 0 || OWN.t > view.h);
  }
  // (whether a box l..r, t..b lands on her ship, within `gap` pixels)
  const onOwn = (l, r, t, b, gap) => { if (!OWN.on) return false; for (let s = 0; s < SLABS; s++) if (overlaps(l, r, t, b, OWN.slabs[s], gap)) return true; return false; };
  // the warning under the crosshair (or, calmly, "Hidden in the cloud") kept off her ship: in its own place if that's
  // clear of her, or else the first clear place of: just under her keel, just over her mast heads (still under the
  // crosshair), and just over the crosshair, each on the screen and clear of the crosshair, the panels, the toast's
  // place, the card between waves and a banner showing. (Where nothing's clear of all of them, the first place clear of
  // her; failing that, its own.) WARN_AT: where it is, for the tags to keep off. Its own place is measured when its
  // words change, or after the panels are measured again (a new window size); then it's moved with a transform
  const WARN_AT = { on: false, l: 0, r: 0, t: 0, b: 0, words: null, n: -1, home: { l: 0, r: 0, t: 0, b: 0 }, dy: 0 };
  function warnClear(t, all) {
    const H0 = WARN_AT.home, b = t + H0.b - H0.t, l = H0.l, r = H0.r, mid = view.h / 2;
    if (t < 4 || b > view.h - 4 || onOwn(l, r, t, b, 5)) return false;
    if (!all) return true;
    if (t < mid + 27 && b > mid - 27) return false; // (the crosshair, and the hit marks round it)
    for (let i = 0; i < EDGE.top.length; i++) if (overlaps(l, r, t, b, EDGE.top[i])) return false;
    for (let i = 0; i < EDGE.bottom.length; i++) if (overlaps(l, r, t, b, EDGE.bottom[i])) return false;
    if (t < TOAST_AT.b + 3 && b > TOAST_AT.t - 3) return false;
    if (CALM_AT.on && overlaps(l, r, t, b, CALM_AT)) return false;
    if (performance.now() < bannerAt.until && l < bannerAt.right + 3 && r > bannerAt.left - 3 && t < bannerAt.bottom + 3 && b > bannerAt.top - 3) return false;
    return true;
  }
  const warnTops = [];
  function placeWarn() {
    const w = H.warn, words = w.hidden ? '' : w.textContent;
    if (!words) { WARN_AT.on = false; if (WARN_AT.dy) { WARN_AT.dy = 0; w.style.transform = ''; } return; } // (shown again, it starts from its own place)
    const H0 = WARN_AT.home;
    if (words !== WARN_AT.words || WARN_AT.n !== TOAST_AT.n) {
      // (its own place: read once with no transform; cheap, as it's only when its words or the window change)
      w.style.transform = ''; WARN_AT.dy = 0;
      const b = w.getBoundingClientRect();
      WARN_AT.words = words; WARN_AT.n = TOAST_AT.n; H0.l = b.left; H0.r = b.right; H0.t = b.top; H0.b = b.bottom;
    }
    if (H0.r - H0.l < 1) { WARN_AT.on = false; return; } // (not shown: on a phone, between waves)
    const h = H0.b - H0.t, mid = view.h / 2;
    let top = H0.t;
    if (OWN.on && !warnClear(H0.t, false)) {
      warnTops.length = 0; warnTops.push(OWN.b + 6, OWN.t - 6 - h, mid - 29 - h);
      let pick = NaN;
      for (let pass = 0; pass < 2 && pick !== pick; pass++) for (let i = 0; i < warnTops.length; i++) if (warnClear(warnTops[i], !pass)) { pick = warnTops[i]; break; }
      if (pick === pick) top = pick;
    }
    const dy = Math.round(top - H0.t);
    if (dy !== WARN_AT.dy) { WARN_AT.dy = dy; w.style.transform = dy ? `translateY(${dy}px)` : ''; }
    WARN_AT.on = true; WARN_AT.l = H0.l; WARN_AT.r = H0.r; WARN_AT.t = H0.t + dy; WARN_AT.b = H0.b + dy;
  }
  // what's in the way of tag a with its bottom middle at (x, y): a tag already placed (those at the edge, and the first
  // `overN` of those over ships) or a raider's ship, or the Captain's own and the warning (OFF) (unless `ships` is
  // false). Going up (dir -1): the bottom it must rise to, to clear them all; going down (dir 1), the bottom it must
  // sink to. NaN: nothing's in the way
  const TAG_GAP = 2;
  let overN = 0;
  function inWay(a, x, y, dir, ships) {
    const hw = a._hw, h = tagH(a);
    let to = dir < 0 ? Infinity : -Infinity, v;
    for (let pass = 0; pass < 2; pass++) {
      const list = pass ? over : edges, n = pass ? overN : edges.length;
      for (let j = 0; j < n; j++) {
        const b = list[j], bh = b._warn ? TAG.warn : TAG.h;
        if (Math.abs(x - b._x) < hw + b._hw + TAG_GAP && y > b._y - bh - TAG_GAP && y - h < b._y + TAG_GAP) { v = dir < 0 ? b._y - bh - TAG_GAP : b._y + TAG_GAP + h; to = dir < 0 ? Math.min(to, v) : Math.max(to, v); }
      }
    }
    if (ships) {
      for (let j = 0; j < placed.length; j++) {
        const s = placed[j];
        if (s._ship && x + hw > s._sl - TAG_GAP && x - hw < s._sr + TAG_GAP && y > s._st - TAG_GAP && y - h < s._sb + TAG_GAP) { v = dir < 0 ? s._st - TAG_GAP : s._sb + TAG_GAP + h; to = dir < 0 ? Math.min(to, v) : Math.max(to, v); }
      }
      for (let j = 0; j < OFF.length; j++) {
        const o = OFF[j];
        if (x + hw > o.l - TAG_GAP && x - hw < o.r + TAG_GAP && y > o.t - TAG_GAP && y - h < o.b + TAG_GAP) { v = dir < 0 ? o.t - TAG_GAP : o.b + TAG_GAP + h; to = dir < 0 ? Math.min(to, v) : Math.max(to, v); }
      }
    }
    return Number.isFinite(to) ? to : NaN;
  }
  // tag a at the edge, its bottom middle at (x, y), slid up past the first n tags at the edge in its way, and past the
  // Captain's ship and the warning (OFF: the tag with its arrow over it), no higher than `top` (the panels along the top);
  // NaN if there's no room
  let offOn = true; // (false: OFF left out, for a tag with nowhere clear of both her and the other tags)
  function edgeSlide(a, x, y, n, top) {
    const h = a._warn ? TAG.warn : TAG.h, up = tagUp(a._warn), nOff = offOn ? OFF.length : 0;
    for (let k = 0; k <= n + nOff; k++) {
      let to = Infinity;
      for (let j = 0; j < n; j++) { const c = edges[j], ch = c._warn ? TAG.warn : TAG.h; if (Math.abs(x - c._x) < a._hw + c._hw + TAG_GAP && y > c._y - ch - TAG_GAP && y - h < c._y + TAG_GAP) to = Math.min(to, c._y - ch - TAG_GAP); }
      for (let j = 0; j < nOff; j++) { const o = OFF[j]; if (x + a._hw > o.l - TAG_GAP && x - a._hw < o.r + TAG_GAP && y > o.t - TAG_GAP && y - up < o.b + TAG_GAP) to = Math.min(to, o.t - TAG_GAP); }
      if (to === Infinity) return y;
      if ((y = to) < top) return NaN;
    }
    return NaN;
  }
  // (whether tag a at the edge, at (x, y), lands on her ship or the warning)
  const onOff = (a, x, y) => { const up = tagUp(a._warn); for (let j = 0; j < OFF.length; j++) { const o = OFF[j]; if (x + a._hw > o.l - TAG_GAP && x - a._hw < o.r + TAG_GAP && y > o.t - TAG_GAP && y - up < o.b + TAG_GAP) return true; } return false; };
  // tag a at the edge (the i-th from the top) moved beside the tags in its way, half a tag's width at a time, towards the
  // middle first, then the other way, still on the screen and between the panels there, and rising no higher than
  // `rise`: false if there's nowhere. One on her ship or the warning (`rise` given) tries first just beside each of
  // them it lands on, the nearer side first
  const besideX = [];
  let besideFrom = 0;
  const nearer = (p, q) => Math.abs(p - besideFrom) - Math.abs(q - besideFrom);
  function edgeAt(a, i, x, rise) {
    if (x - a._hw < 4 || x + a._hw > view.w - 4) return false;
    const top = edgeTop(x, tagUp(a._warn)), bottom = edgeBottom(x), lim = Math.max(top, rise);
    if (top > bottom) return false;
    let y = edgeSlide(a, x, Math.max(top, Math.min(bottom, a._y)), i, lim);
    if (y !== y) y = edgeSlide(a, x, bottom, i, lim);
    if (y !== y || y < lim) return false; // (nowhere, or only higher than it may rise: the panels at the bottom there)
    a._x = x; a._y = y; return true;
  }
  function edgeFind(a, i, W2, rise) {
    const inward = a._x > W2 ? -1 : 1, step = a._hw + TAG_GAP, x0 = a._x;
    if (rise > -Infinity) {
      if (edgeAt(a, i, x0, rise)) return true;
      besideX.length = 0;
      const up = tagUp(a._warn);
      for (let j = 0; j < OFF.length; j++) {
        const o = OFF[j];
        if (x0 + a._hw > o.l - TAG_GAP && x0 - a._hw < o.r + TAG_GAP && a._y > o.t - TAG_GAP && a._y - up < o.b + TAG_GAP) besideX.push(o.l - a._hw - TAG_GAP - 1, o.r + a._hw + TAG_GAP + 1);
      }
      besideFrom = x0; besideX.sort(nearer);
      for (let j = 0; j < besideX.length; j++) if (edgeAt(a, i, besideX[j], rise)) return true;
    }
    for (let k = 0; k <= 24; k++) if (edgeAt(a, i, x0 + inward * (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step, rise)) return true;
    return false;
  }
  // a tag with no room by any edge (a small phone held sideways, crowded with raiders all round readying broadsides):
  // the nearest place anywhere on the screen clear of the panels (its arrow too, just over its middle) and of the tags
  // placed before it, and of her ship and the warning where it can be. (Rare, so it can look over the whole screen:
  // every 8 by 6 pixels)
  function edgeAnywhere(a, i) {
    const h = a._warn ? TAG.warn : TAG.h, up = tagUp(a._warn), x0 = a._x, y0 = a._y;
    for (let pass = 0; pass < 2; pass++) {
      let best = Infinity, bx = 0, by = 0;
      for (let x = a._hw + 4; x <= view.w - a._hw - 4; x += 8) for (let y = up + 4; y <= view.h - 4; y += 6) {
        const d = (x - x0) * (x - x0) + (y - y0) * (y - y0);
        if (d < best && clearHere(a, i, x, y, h, up, !pass)) { best = d; bx = x; by = y; }
      }
      if (best < Infinity) { a._x = bx; a._y = by; return true; }
    }
    return false;
  }
  const hitsPanel = (l, r, t, b) => {
    for (let j = 0; j < EDGE.top.length; j++) { const p = EDGE.top[j]; if (l < p.r + 2 && r > p.l - 2 && t < p.b + 2 && b > p.t - 2) return true; }
    for (let j = 0; j < EDGE.bottom.length; j++) { const p = EDGE.bottom[j]; if (l < p.r + 2 && r > p.l - 2 && t < p.b + 2 && b > p.t - 2) return true; }
    return false;
  };
  function clearHere(a, i, x, y, h, up, off) {
    const l = x - a._hw, r = x + a._hw, t = y - up, aw = a._warn ? 10 : 8;
    if (hitsPanel(l, r, y - h, y) || hitsPanel(x - aw, x + aw, t, y - h)) return false;
    for (let j = 0; j < i; j++) { const c = edges[j], ch = c._warn ? TAG.warn : TAG.h; if (Math.abs(x - c._x) < a._hw + c._hw + TAG_GAP && y > c._y - ch - TAG_GAP && y - h < c._y + TAG_GAP) return false; }
    if (off) for (let j = 0; j < OFF.length; j++) { const o = OFF[j]; if (l < o.r + TAG_GAP && r > o.l - TAG_GAP && t < o.b + TAG_GAP && y > o.t - TAG_GAP) return false; }
    return true;
  }
  // tag a slid from (x, y) up (dir -1) or down (1) until nothing's in its way; NaN if it never gets clear
  function slide(a, x, y, dir, ships = true) {
    for (let n = 0; n < 12; n++) { const to = inWay(a, x, y, dir, ships); if (to !== to) return y; y = to; }
    return NaN;
  }
  const tagFits = (a, x, y) => y === y && x - a._hw >= 4 && x + a._hw <= view.w - 4 && y - tagH(a) >= overTop(x, a._hw) && y <= overBottom(x, a._hw);
  // a tag over her ship placed: the first clear place of: just over her ship, pushed up past whatever's in the way (so a
  // stack of tags sits over all their ships, never on one of them); a little lower, just under the panels along the top
  // (her mast heads reaching up to them: at most 60% of a tag lower); a tag's width or two to either side, pushed up the
  // same (a stack fanned out where it can't rise, under the panels); under her ship; and failing all of them, just
  // under the panels over her, pushed down past the tags in the way (over what it must). A tag moved aside (to one side,
  // or under her ship) stays where it is beside her while that's clear, and comes back over her once there's been room
  // there for HOME seconds: so tags don't hop about as a crowd of raiders closes in
  const FAN = [0, 1, -1, 2, -2, 3, -3], HOME = 0.8;
  function placeOver(a) {
    const x0 = a._nx = a._x, y0 = a._ny = a._y;
    if (!clearAt(a, x0, y0)) { a._x = x0 + a._ox; a._y = y0 + a._oy; }
    a._ox = a._x - x0; a._oy = a._y - y0; a._had = true;
  }
  // (false: where it was, beside her ship, is kept)
  function clearAt(a, x0, y0) {
    const step = a._hw * 2 + 6, aside = a._had && (Math.abs(a._ox) > 1 || a._oy > 1);
    let kept = false;
    if (aside) { const x = x0 + a._ox, w = inWay(a, x, y0 + a._oy, -1, true); kept = w !== w && tagFits(a, x, y0 + a._oy); }
    let y = slide(a, x0, y0, -1);
    if (tagFits(a, x0, y)) {
      if (kept && (a._homeAt < 0 || time - a._homeAt < HOME)) { if (a._homeAt < 0) a._homeAt = time; return false; }
      a._y = y; a._homeAt = -1; return true;
    }
    a._homeAt = -1;
    if (kept) return false;
    y = slide(a, x0, Math.max(y0, overTop(x0, a._hw) + tagH(a)), 1);
    if (y - y0 <= tagH(a) * 0.6 && tagFits(a, x0, y)) { a._y = y; return true; }
    for (let k = 1; k < FAN.length; k++) { const x = x0 + FAN[k] * step; y = slide(a, x, y0, -1); if (tagFits(a, x, y)) { a._x = x; a._y = y; return true; } }
    if (a._box) for (let k = 0; k < 3; k++) { const x = x0 + FAN[k] * step; y = slide(a, x, a._sb + TAG_GAP + tagH(a), 1); if (tagFits(a, x, y)) { a._x = x; a._y = y; return true; } }
    const x = Math.max(a._hw + 4, Math.min(view.w - a._hw - 4, x0));
    y = Math.max(y0, overTop(x, a._hw) + tagH(a));
    const down = slide(a, x, y, 1, false);
    a._x = x; a._y = down === down ? down : y;
    return true;
  }
  // each raider's tag: over it, or at the edge of the screen pointing to it (flashing red and saying "Broadside!" as she
  // readies a broadside, with a ring closing as she's about to fire); its distance and health ten times a second. (dt:
  // the frame's seconds, for a tag gliding to a new place)
  function tags(slow, dt = 0) {
    const W2 = view.w / 2, H2 = view.h / 2;
    if (TAG.sizes !== sizes) { TAG.sizes = sizes; TAG.measured = TAG.warned = false; for (const r of raiders.list) if (r.tag) r.tag._measure = true; } // (a new window size: tags measured again)
    // (her ship on the screen and the warning, kept off her: the tags keep off both)
    ownBox(W2, H2); placeWarn();
    OFF.length = 0; if (OWN.on) for (let s = 0; s < SLABS; s++) OFF.push(OWN.slabs[s]); if (WARN_AT.on) OFF.push(WARN_AT);
    placed.length = 0;
    for (const r of raiders.list) {
      let el = r.tag;
      if (!el) {
        el = r.tag = document.createElement('div'); el.className = r.captain ? 'tag captain' : r.role === 'prize' ? 'tag captain prize' : 'tag';
        el.innerHTML = `<span class="arrow"></span><b>${r.captain ? 'Captain · ' : r.role === 'prize' ? 'Treasure · ' : ''}${r.R.cls}</b> <span class="d"></span>${PARTS.map((k) => `<span class="meter ${k}"><b></b><i></i></span>`).join('')}<span class="bs"><i class="ring"></i>Broadside!</span><span class="lost">Lost in the cloud</span>`;
        el._d = el.querySelector('.d'); el._m = [...el.querySelectorAll('.meter i')].map(chip); el._arrow = el.querySelector('.arrow'); el._fresh = true; el._hw = 42; el._ox = el._oy = 0; el._had = false; el._homeAt = -1;
        H.tags.append(el); // (raiders.js takes it away with its raider)
      }
      if (r.f.down) { el.remove(); continue; }
      // (one hidden in cloud far off: her tag stays where she was last seen, saying so, with how far off that is; one
      // readying a broadside there isn't lost, sky.js, so a "Broadside!" at the edge points to where she really is)
      proj.copy(r.lost ? r.seenAt : r.f.pos); proj.y += r.R.length * 0.45 + 3; proj.project(camera);
      // in pixels from the middle of the screen; off screen (or behind), pinned to the edge in its direction
      const behind = proj.z > 1;
      let x = proj.x * W2 * (behind ? -1 : 1), y = -proj.y * H2 * (behind ? -1 : 1);
      // (off screen: pinned where the line to her meets the edge, then kept between the panels at the top and bottom)
      const ax = edgeX(el, W2), k = Math.max(Math.abs(x) / ax, y < 0 ? -y / (H2 - tagUp(false) - 6) : y / (H2 - 6));
      const edge = behind || k > 1;
      // while she readies a broadside (her red fan showing), her tag flashes red and says so, with a ring closing as she's
      // about to fire: over her, and at the edge, where her glowing ports and her fan can't be seen (on a phone a raider
      // alongside usually is)
      const warn = !!r.charge.b;
      if (warn) { const k = Math.round((r.charge.T > 0 ? 1 - Math.max(0, r.charge.t) / r.charge.T : 1) * 20) / 20; if (el._k !== k) { el._k = k; el.style.setProperty('--k', String(k)); } }
      // (and the highest an edge tag may be pushed to make room for another, below: just under the panels along the top)
      let top = TAG.h + 6;
      if (edge) {
        x /= Math.max(k, 1e-6); y /= Math.max(k, 1e-6);
        // (where the panels at the top and bottom leave no room for her tag and its arrow between them, as down the
        // right of a phone held sideways, it slides in towards the middle until they do)
        const up = tagUp(warn);
        top = edgeTop(W2 + x, up);
        let bottom = edgeBottom(W2 + x);
        for (let n = 0; top > bottom && n < 24 && Math.abs(x) > 16; n++) { x -= Math.sign(x) * 16; top = edgeTop(W2 + x, up); bottom = edgeBottom(W2 + x); }
        y = Math.max(top - H2, Math.min(bottom - H2, y));
      }
      if (el._edge !== edge) { el._edge = edge; el.classList.toggle('edge', edge); }
      if (el._warn !== warn) { el._warn = warn; el._measure = true; el.classList.toggle('warn', warn); if (warn && !TAG.warned && el.offsetHeight) { TAG.warned = true; TAG.warn = el.offsetHeight + 1; } }
      if (el._locked !== (r === locked)) { el._locked = r === locked; el.classList.toggle('locked', el._locked); }
      if (el._lost !== r.lost) { el._lost = r.lost; el._measure = true; el.classList.toggle('lost', r.lost); }
      el._x = W2 + x; el._y = H2 + y; el._top = top; placed.push(el);
      el._box = el._ship = false; if (!edge && !r.lost) shipBox(r, el, W2, H2); // (her ship on the screen: tags keep off it)
      if (edge) el._had = false; // (back over her ship, her tag starts afresh)
      const turn = Math.round(Math.atan2(x, -y) * 50) / 50;
      if (edge && el._turn !== turn) { el._turn = turn; el._arrow.style.transform = `rotate(${turn}rad)`; }
      if (slow || el._fresh) {
        el._fresh = false;
        const d = Math.round((r.lost ? r.seenAt : r.f.pos).distanceTo(player.pos) / 10) * 10; // (one lost in cloud: how far off she was last seen, where her tag is)
        if (el._dist !== d) { el._dist = d; el._d.textContent = `${d} m`; el._measure = true; }
        if (!TAG.measured && !el._warn && el.offsetHeight) { TAG.measured = true; TAG.h = el.offsetHeight + 1; }
        for (let i = 0; i < 3; i++) setWidth(el._m[i], r.f.frac(PARTS[i]));
      }
    }
    // (each tag's width, measured again whenever its words change: all of them at once, so the page is laid out once.
    // One at the edge that came out wider than it was taken to be, a new one say, is brought in so all of it shows)
    for (let i = 0; i < placed.length; i++) {
      const el = placed[i];
      if (!el._measure) continue;
      el._measure = false; const w = el.offsetWidth; if (w) el._hw = w / 2;
      if (w && el._warn && !TAG.warned) { TAG.warned = true; TAG.warn = el.offsetHeight + 1; } // (and the tags' heights, after the window changed)
      if (w && !el._warn && !TAG.measured) { TAG.measured = true; TAG.h = el.offsetHeight + 1; }
      if (el._edge) { const ax = edgeX(el, W2); el._x = W2 + Math.max(-ax, Math.min(ax, el._x - W2)); }
    }
    // tags that would land on another tag, or on a raider's ship, find somewhere clear instead. Those at the edge of the
    // screen are stacked along it: from the bottom up, the higher of two is pushed up by the lower one's height (one
    // saying "Broadside!" may be a little taller); then from the top down, one pushed up past the highest it may be (into
    // the panels along the top) comes back down, and any stacked under it move down to make room (but never on to the
    // panels along the bottom). The warning is always drawn on top (game.html)
    edges.length = over.length = 0;
    for (let i = 0; i < placed.length; i++) (placed[i]._edge ? edges : over).push(placed[i]);
    edges.sort(byY);
    for (let i = edges.length - 2; i >= 0; i--) {
      const a = edges[i];
      for (let j = edges.length - 1; j > i; j--) { const b = edges[j], h = b._warn ? TAG.warn : TAG.h; if (Math.abs(a._x - b._x) < a._hw + b._hw && b._y - a._y < h) a._y = b._y - h; }
    }
    for (let i = 0; i < edges.length; i++) {
      const a = edges[i], h = a._warn ? TAG.warn : TAG.h;
      a._y = Math.max(a._y, a._top);
      for (let j = 0; j < i; j++) { const b = edges[j]; if (Math.abs(a._x - b._x) < a._hw + b._hw) a._y = Math.max(a._y, b._y + h); }
      a._y = Math.min(a._y, edgeBottom(a._x));
      // (no room left for it along the edge, as down the right of a phone held sideways, where the panels leave room for
      // a tag or two: it goes up past the tags in its way, or beside them, half a tag's width at a time, towards the
      // middle first, then the other way, still on the screen and between the panels there)
      // (and one landing on the Captain's ship or the warning, OFF, moves off them the same way: first where it rises at
      // most two and a half tags from where it's pinned, so it stays by its edge, beside her ship; then anywhere. On a
      // screen too crowded for that, a tag on another hides more than one on her ship: it keeps clear of the tags only)
      if (edgeSlide(a, a._x, a._y, i, -Infinity) !== a._y) {
        const rise = onOff(a, a._x, a._y) ? a._y - 2.5 * TAG.h : -Infinity;
        if (!edgeFind(a, i, W2, rise) && !(rise > -Infinity && edgeFind(a, i, W2, -Infinity))) {
          offOn = false;
          if (edgeSlide(a, a._x, a._y, i, -Infinity) !== a._y && !edgeFind(a, i, W2, -Infinity)) edgeAnywhere(a, i);
          offOn = true;
        }
      }
    }
    // those over their ships, from the highest on the screen down, each in the first clear place (placeOver): the
    // highest just over her ship, one that would land on it (or on her ship: two raiders far off, one just over the
    // other) over it, so every ship of a stack shows under all its tags; one that can't rise there (under the panels
    // along the top, the compass and the guns' label among them) beside it, or under her ship
    over.sort(byY);
    for (overN = 0; overN < over.length; overN++) placeOver(over[overN]);
    // (a tag over her ship moved to a new place beside her glides there in a moment, rather than jumping: how far it is
    // from just over her eases to where it's going, while it follows her ship as she moves. One at the edge, or just
    // come back from it, jumps)
    const ease = 1 - Math.exp(-dt * 16);
    for (let i = 0; i < placed.length; i++) {
      const a = placed[i];
      if (a._edge) { a._glide = false; continue; }
      const tx = a._x - a._nx, ty = a._y - a._ny;
      if (!a._glide) { a._glide = true; a._gx = tx; a._gy = ty; }
      else { a._gx += (tx - a._gx) * ease; a._gy += (ty - a._gy) * ease; if (Math.abs(tx - a._gx) < 0.5 && Math.abs(ty - a._gy) < 0.5) { a._gx = tx; a._gy = ty; } }
      a._x = a._nx + a._gx; a._y = a._ny + a._gy;
    }
    // (while a banner shows, a wave's say, the tags that would be under it fade away, so both can be read: a wave's
    // raiders come in on the horizon, right where its banner is. They come back as it fades. One saying "Broadside!"
    // always shows)
    const hush = performance.now() < bannerAt.until - BANNER_BACK;
    for (let i = 0; i < placed.length; i++) {
      const a = placed[i], x = Math.round(a._x * 2) / 2, y = Math.round(a._y * 2) / 2;
      if (a._px !== x || a._py !== y) { a._px = x; a._py = y; a.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`; }
      const under = hush && !a._warn && x + a._hw > bannerAt.left && x - a._hw < bannerAt.right && y > bannerAt.top && y - TAG.h < bannerAt.bottom;
      if (a._hush !== under) { a._hush = under; a.classList.toggle('hush', under); }
    }
  }
  // ---------- bounties ----------
  // where a raider goes down, her bounty rises out of the wreck in gold and fades: "◆ 75", "Captain's bounty ◆ 600",
  // "Treasure ◆ 400". Six labels, reused. One that would rise over a banner showing then (a wave's, say), or rise into
  // it (it rises 40 px), shows just under it instead (dy, in pixels) and doesn't rise, so both can be read
  const BOUNTY_LIFE = 2.2, BOUNTIES = [...document.querySelectorAll('#bounties .bounty')].map((el) => ({ el, at: new THREE.Vector3(), t: BOUNTY_LIFE, dy: 0, rise: 40, w: 0, h: 0, label: el.querySelector('small'), num: el.querySelector('b span') }));
  let bountyN = 0;
  function bounty(r, total, at) {
    const b = BOUNTIES[bountyN]; bountyN = (bountyN + 1) % BOUNTIES.length;
    b.at.copy(at).setY(at.y + r.R.length * 0.3); b.t = 0; b.dy = 0; b.rise = 40;
    if (performance.now() < bannerAt.until) {
      proj.copy(b.at).project(camera);
      const x = (proj.x + 1) * view.w / 2, y = (1 - proj.y) * view.h / 2;
      if (proj.z < 1 && x > bannerAt.left - 90 && x < bannerAt.right + 90 && y > bannerAt.top - 70 && y < bannerAt.bottom + 64) { b.dy = bannerAt.bottom + 44 - y; b.rise = 0; }
    }
    b.label.textContent = r.captain ? 'Captain\'s bounty' : r.role === 'prize' ? 'Treasure' : '';
    b.num.textContent = fmt(total);
    b.el.classList.toggle('rich', r.captain || r.role === 'prize'); b.el.hidden = false;
    b.w = 0; // (its size is measured only if the card between waves comes up while it shows: not here, mid-step)
  }
  function bounties(dt) {
    for (const b of BOUNTIES) {
      if (b.el.hidden) continue;
      if ((b.t += dt) >= BOUNTY_LIFE) { b.el.hidden = true; continue; }
      const k = b.t / BOUNTY_LIFE;
      proj.copy(b.at).project(camera);
      if (proj.z > 1) { b.el.style.opacity = '0'; continue; }
      const x = (proj.x + 1) * view.w / 2, s = 1 + 0.3 * (1 - k);
      let y = (1 - proj.y) * view.h / 2 - b.rise * k + b.dy;
      // the card between waves up (or rising: the wave's last raider has just gone down), and the bounty where it is or
      // will be: it shows just under the card instead (above it, where the card is at the bottom)
      if (W.state === 'choose' && CALM_AT.on) {
        if (!b.w) { b.w = b.el.offsetWidth; b.h = b.el.offsetHeight; } // (once, the first time it's wanted: rare, as a wave ends)
        const hw = (b.w * s) / 2 + 6, hh = (b.h * s) / 2 + 6, C = CALM_AT;
        if (x + hw > C.l && x - hw < C.r && y + hh > C.t && y - hh < C.b) y = C.top ? C.b + hh : C.t - hh;
      }
      b.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
      b.el.style.opacity = (k < 0.08 ? k / 0.08 : k > 0.7 ? (1 - k) / 0.3 : 1).toFixed(2);
    }
  }
  function hideBounties() { for (const b of BOUNTIES) { b.el.hidden = true; b.t = BOUNTY_LIFE; } }

  // where the big map's names go, w by h pixels at f pixels high: each in the middle of its region, unless that lands it
  // on (or within half its height of) a name placed already, from the top down; then it moves down (or up) out of
  // the way. Kept in from the map's edges. (Made only when the map's size changes, or the fonts have come in)
  const NAMES_AT = { w: 0, h: 0, fonts: '', at: [] };
  function names(w, h, f) {
    Object.assign(NAMES_AT, { w, h, fonts: document.fonts?.status, at: [] });
    const gap = f / 2, pad = f / 3;
    for (const R of [...REGIONS].sort((a, b) => a.v - b.v)) {
      const name = R.name.replace(/^The /, ''), bw = mctx.measureText(name).width + mctx.lineWidth, bh = f * 1.1;
      const L = { name, x: THREE.MathUtils.clamp(R.u * w, bw / 2 + pad, w - bw / 2 - pad), y: R.v * h, w: bw, h: bh };
      for (let pass = 0; pass < 4; pass++) {
        let moved = false;
        for (const o of NAMES_AT.at) {
          if (Math.abs(L.x - o.x) >= (L.w + o.w) / 2 + gap || Math.abs(L.y - o.y) >= (L.h + o.h) / 2 + gap) continue;
          L.y = L.y >= o.y ? o.y + (L.h + o.h) / 2 + gap : o.y - (L.h + o.h) / 2 - gap; moved = true;
        }
        if (!moved) break;
      }
      L.y = THREE.MathUtils.clamp(L.y, bh / 2 + pad, h - bh / 2 - pad);
      NAMES_AT.at.push(L);
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
    // a warning under the crosshair (ten times a second), written before the tags are placed, as it keeps off her ship
    // and they keep off it
    if (slow) {
      const w = H.warn;
      const warn = player.down ? '' : player.frac('crystals') < 0.5 ? 'The crystals are cracked: she\'s sinking'
        : player.pos.y > THINNING - 350 ? 'Nearing the Thinning: the crystals can\'t lift you higher'
          : Math.abs(player.pos.x) > MAP.w / 2 + 1500 || Math.abs(player.pos.z) > MAP.h / 2 + 1500 ? 'Open sea: Aethermoor is behind you' : '';
      // (and in its place, calmly, while she's hidden deep in cloud)
      const note = !warn && player.hidden && W.state === 'fight' ? 'Hidden in the cloud' : '';
      w.hidden = !warn && !note; if (warn || note) setText(w, warn || note);
      if (w._note !== !!note) { w._note = !!note; w.classList.toggle('note', !!note); }
    }
    tags(slow, dt);
    bounties(dt);
    // the shard count counts up to what's in the hold (written only when the whole number shown changes)
    const C = shardCount;
    if (V.shards !== C.to) { C.from = C.shown; C.to = V.shards; C.t = 0; }
    if (C.t < 1) { C.t = Math.min(1, C.t + dt / 0.6); const k = 1 - (1 - C.t) ** 3; C.shown = C.from + (C.to - C.from) * k; }
    const sn = Math.round(C.shown);
    if (sn !== C.n) { C.n = sn; setText(H['voyage-n'], fmt(sn)); }
    // and the card's bonus for the wave, as the card rises (the same)
    if (W.state === 'choose' && W.bonusShown !== W.bonus) {
      const k = Math.min(1, Math.max(0, (performance.now() / 1000 - W.bonusAt) / 0.8)), bn = Math.round(W.bonus * (1 - (1 - k) ** 3)), b = $('calm-bonus');
      if (b && b._n !== bn) { b._n = bn; b.textContent = fmt(bn); }
      if (k >= 1) W.bonusShown = W.bonus;
    }
    if (!slow) return;
    hudTimer = 0.1;
    setText(H['r-speed'], `${Math.round(player.speed * 3.6)} km/h`);
    setText(H['r-height'], `${fmt(player.pos.y)} m`);
    setText(H['r-sail'], `${Math.round(player.sail * 100)}%`);
    setWidth(H['sail-bar'], player.sail);
    for (const k of PARTS) {
      setWidth(H[`h-${k}`], player.frac(k));
      setText(H[`n-${k}`], String(Math.ceil(player.health[k])));
      H[`row-${k}`].classList.toggle('low', player.frac(k) < 0.3);
    }
    setText(H['score-n'], String(V.downed)); setText(H['score-raiders'], V.downed === 1 ? 'raider ' : 'raiders '); setText(H['wave-n'], String(W.state === 'choose' ? W.n : W.n + 1)); // (the card up: the wave just beaten)
    const deg = compassDeg(player.heading);
    setText(H.heading, `${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8]} ${Math.round(deg)}°`);
    // the wind, against the ship: the arrow points the way it blows (up is the way you're heading), and in words how
    // much it adds to or takes from your top speed ("Wind behind: 8% faster"; on a phone just "8% faster")
    const help = Math.round(windHelp(player.heading) * 100);
    setStyle(H['wind-arrow'], 'transform', `rotate(${(-(WIND.dir - player.heading)).toFixed(2)}rad)`);
    setText(H['wind-words'], help >= 2 ? 'Wind behind:' : help <= -2 ? 'Head wind:' : 'Wind across:');
    setText(H['wind-n'], help >= 2 ? `${help}% faster` : help <= -2 ? `${-help}% slower` : 'no help');
    const sg = player.surge;
    setWidth(H['h-surge'], sg.on > 0 ? sg.on / 3 : sg.charge);
    H['row-surge'].classList.toggle('ready', sg.charge >= 1);
    H['btn-surge'].disabled = sg.charge < 1;
    shotsShown(); // (her shot, if it changed some other way: a shot bought or earned)
    // the crew patching her: the row for what they patch glows; on a laptop the Patch row fills as they get ready again;
    // on a phone the Patch button shows once she's hurt (her worst part under 70%), its ring filling as they get ready
    const PT = player.patch, ready = 1 - PT.cd / (PATCH.time + PATCH.wait);
    for (const k of PARTS) H[`row-${k}`].classList.toggle('patching', PT.t > 0 && PT.part === k);
    setWidth(H['h-patch'], PT.t > 0 ? PT.t / PATCH.time : ready);
    H['row-patch'].classList.toggle('ready', PT.cd <= 0);
    const pb = H['btn-patch'], show = !player.down && (PT.t > 0 || player.frac(player.worst()) < PATCH.show);
    if (pb.hidden === show) { pb.hidden = !show; layout(); }
    if (show) {
      const k = Math.round(ready * 40) / 40;
      if (pb._k !== k) { pb._k = k; pb.style.setProperty('--k', String(k)); }
      if (pb._busy !== PT.cd > 0) { pb._busy = PT.cd > 0; pb.classList.toggle('busy', pb._busy); }
      if (pb._on !== PT.t > 0) { pb._on = PT.t > 0; pb.classList.toggle('on', pb._on); }
    }
    // a new region's name, at a quiet moment: not in a fight, not over a banner (they share the sky under the compass),
    // and not over the card between waves where that sits at the top (a phone held sideways)
    const r = regionAt(player.pos.x, player.pos.z);
    if (r !== region && (regionTimer -= 0.1) <= 0 && W.state !== 'fight' && !(W.state === 'choose' && view.h <= 500) && !player.down && performance.now() > bannerAt.until) {
      region = r; regionTimer = 2; const el = $('region'); $('region-name').textContent = r; $('region-air').textContent = sky.line(r); flash(el);
      payload('region').name = r; emit('region'); // (a soft chord: sound.js)
    }
    // the corner map, with the ship as a gold arrow and the raiders as red dots. It's sized here, as it's drawn, so it's
    // always as sharp as it shows (it has no size while hidden on the title screen or in port, or before the big map)
    if (mimg.complete && mimg.naturalWidth) {
      const dpr = Math.min(devicePixelRatio, 2), cw = Math.round(mini.clientWidth * dpr), ch = Math.round(mini.clientHeight * dpr);
      if (cw && ch && (cw !== mini.width || ch !== mini.height)) { mini.width = cw; mini.height = ch; }
      const W2 = mini.width, H2 = mini.height;
      mctx.drawImage(mimg, 0, 0, W2, H2);
      const x = (player.pos.x / MAP.w + 0.5) * W2, y = (player.pos.z / MAP.h + 0.5) * H2, s = Math.max(5, W2 / 40);
      mctx.fillStyle = '#ff4636'; mctx.strokeStyle = '#3a1631'; mctx.lineWidth = Math.max(1, s / 5);
      for (const q of raiders.list) {
        if (q.f.down) continue;
        const at = q.lost ? q.seenAt : q.f.pos; // (one lost in cloud: a ring where she was last seen)
        mctx.beginPath(); mctx.arc((at.x / MAP.w + 0.5) * W2, (at.z / MAP.h + 0.5) * H2, s * 0.45, 0, Math.PI * 2);
        if (q.lost) { mctx.strokeStyle = '#ff4636'; mctx.stroke(); mctx.strokeStyle = '#3a1631'; } else { mctx.fill(); mctx.stroke(); }
      }
      mctx.save(); mctx.translate(x, y); mctx.rotate(-player.heading + Math.PI);
      mctx.fillStyle = '#e2bd67'; mctx.lineWidth = Math.max(1.5, s / 4);
      mctx.beginPath(); mctx.moveTo(0, -s * 1.3); mctx.lineTo(s * 0.8, s); mctx.lineTo(0, s * 0.45); mctx.lineTo(-s * 0.8, s); mctx.closePath(); mctx.fill(); mctx.stroke();
      mctx.restore();
      // the big map names the regions (never smaller than 11 of the page's pixels, to read on a phone), each clear of
      // the others (names), placed again when the map's size changes
      if (mini.classList.contains('big')) {
        const f = Math.round(Math.max(W2 / 46, 11 * dpr));
        mctx.font = `700 ${f}px Cinzel, Georgia, serif`; mctx.textAlign = 'center'; mctx.textBaseline = 'middle'; mctx.lineJoin = 'round';
        mctx.lineWidth = f / 4; mctx.strokeStyle = 'rgba(20, 10, 24, 0.85)'; mctx.fillStyle = '#ecdcb8';
        if (NAMES_AT.w !== W2 || NAMES_AT.h !== H2 || NAMES_AT.fonts !== document.fonts?.status) names(W2, H2, f);
        for (const L of NAMES_AT.at) { mctx.strokeText(L.name, L.x, L.y); mctx.fillText(L.name, L.x, L.y); }
      }
    }
  }

  let last = performance.now(), time = 0, held = null, lastPop = -1, lastShard = -9, run = 0;
  const loaded = { port: 0, starboard: 0 }, SIDES = ['port', 'starboard'], READY = payload('guns:ready'); // (each broadside's reload, as it was)
  const hold = new THREE.Vector3(); // where the ship's hold is, that the shards fly to
  const GATHER = payload('shards:gather');
  // the shard count pops gold as they come in (once in a while, as they stream in)
  const POP = [{ transform: 'scale(1.15)', boxShadow: '0 0 0 1px #e2bd67, 0 0 18px rgba(226, 189, 103, 0.8)' }, { transform: 'none', boxShadow: '0 0 0 0 rgba(226, 189, 103, 0)' }];
  const POP_TIMING = { duration: 500, easing: 'ease-out' };
  // one step of the game: controls, flying, the raiders, the camera, the guns, the shots, the HUD
  function tick(dt) {
    time += dt;
    const inp = held ?? input.read();
    for (const k of inp.pressed) {
      if (k === 'c') { cam.yaw = 0; cam.pitch = 0.2; }
      else if (k === 'm') bigMap();
      else if (k === 'h') toggleHelp();
      else if (k === 'p') pause(true);
      else if (k === 'r') { if (player.startSurge()) { toast('Surge!'); emit('surge'); } }
      else if (k === 'Enter') sailOn();
      else if (k === 'b') goHome();
      else if (k === '1' || k === '2' || k === '3') pickShot(SHOT_ORDER[+k - 1]);
      else if (k === 'shot') pickShot(nextShot());
      else if (k === 'x') patchUp();
    }
    player.update(dt, inp);
    player.ship.root.updateMatrixWorld(true);
    const gone = raiders.update(dt, player, camera);
    placeCamera(dt, inp);
    sound.listen(camera, player.pos); // (where the sounds of this step are heard from)
    const battery = batteryFor(cam.yaw);
    aimFor(battery);
    gunnery.update(dt, player.patch.t > 0 ? PATCH.rate : 1); // (the guns reload at half speed while the crew patch her)
    if (wasPatching && player.patch.t <= 0) { wasPatching = false; PATCHED.part = player.patch.part; PATCHED.stage = 'done'; emit('patch'); }
    // a broadside loaded again is told (a clack: sound.js)
    for (let i = 0; i < 2; i++) {
      const b = SIDES[i];
      if (loaded[b] > 0 && gunnery.ready[b] === 0 && gunnery.B[b][0]?.kind === 'broadside' && !player.down) { READY.battery = b; READY.firing = !!inp.fire; emit('guns:ready'); }
    }
    if (inp.fire && !player.down && gunnery.fire(battery, aimPoint, bolts, 'player', player.velocity) > 0) {
      sky.reveal(); // (her guns give her away)
      if (gunnery.shot === 'breaker') { if (!gunnery.breakers) pickShot('round', 'out'); else shotsShown(); } // (her last volley of breakers: round shot again)
    }
    loaded.port = gunnery.ready.port; loaded.starboard = gunnery.ready.starboard;
    bolts.update(dt, hitTest);
    // (her scars and every raider's, and their flames, as they stand after this step's hits; and their life: her lids
    // open for a fight, a Man-o'-war's columns marked while the guns are locked on her)
    looks.cleared = W.state === 'fight'; looks.marked = locked;
    looks.update(dt, time, raiders.list);
    wakes.update(dt, time, camera, player, raiders.list);
    smokeFrom(player, fx, dt);
    for (let i = 0; i < raiders.list.length; i++) smokeFrom(raiders.list[i].f, fx, dt);
    const got = pickups.update(dt, player.ship.body.localToWorld(hold.set(0, 0.5, 0)), player.ship.recipe.length * 0.6 + 8, camera);
    // gathering shards makes the counter pop (once in a while, as they stream in), and each shard is told of, with how
    // many have come in close together
    if (got && !player.down) {
      V.shards += got; if (time - lastPop > 0.25) { lastPop = time; POP_TIMING.duration = lessMotion.matches ? 1 : 500; H.score.animate(POP, POP_TIMING); }
      GATHER.at.copy(hold);
      for (let i = 0; i < pickups.taken; i++) { run = time - lastShard < 1.5 ? run + 1 : 1; lastShard = time; GATHER.value = pickups.worth[i]; GATHER.run = run; emit('shards:gather'); }
    }
    waves(dt, gone);
    wrecks.update(dt); surge.update(dt); world.update(dt);
    fx.update(dt); // (after everything that makes sparks, smoke or glows this frame)
    // the view: wider on a phone held upright; a Surge widens it with a jolt (a spring), slow motion narrows it a
    // little, and each of your guns punches it wider for a moment
    viewFov += ((view.w < view.h ? 68 : 55) - viewFov) * (1 - Math.exp(-dt * 5));
    surgeView(dt);
    const fov = viewFov + surgeFov.x - 6 * fx.slowness + fx.cam.fov;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    world.time.value = time;
    world.puffs.follow(player.pos);
    sky.update(dt, { player, camera, raiders: raiders.list }); // (the region's air, the storm, the clouds round her)
    sun.target.position.copy(player.pos); sun.position.copy(player.pos).addScaledVector(SUN, SUN_OFF);
    WTIME.value = time; // (the sails' ripple, the pennants, the crystals' pulse, the embers and the flames)
    player.ship.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    hud(dt, battery);
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (mode === 'voyage') { if (!paused && !W.sunk) tick(dt * fx.timeScale(dt)); renderer.render(scene, camera); }
    else if (mode === 'title') { input.read(); title.update(dt); title.render(); }
    else { input.read(); port.update(dt); port.render(); }
    // while the game stands still (paused, or your ship gone down), a tag's "Broadside!" stops flashing (game.html)
    const still = mode === 'voyage' && (paused || W.sunk);
    if (H.tags._held !== still) { H.tags._held = still; H.tags.classList.toggle('held', still); }
    sound.update(dt, mode === 'voyage' ? player : null); // (real time: the music, and the sky's sound)
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.body.classList.add('ready');

  // for tools/check.mjs
  window.__game = {
    ready: true, get player() { return player; }, get gunnery() { return gunnery; }, cam, input, raiders, bolts, pickups, renderer, camera, scene, world, sun, waves: W, voyage: V,
    fx, events, wrecks, surge, looks, wakes, get lastArc() { return lastArc; }, get time() { return time; }, audio, sound, settings,
    progress, port, title, sail, endVoyage, pause, sailOn, wind: WIND, sky, waveAt, treasureShip, SKIES, get mode() { return mode; }, get paused() { return paused; },
    giants, describe, // (which giants sail among the raiders this voyage, and a wave in words)
    tactics: { SHOTS, SHOT_ORDER, RAKE, PATCH, SMART, rakeMul }, pickShot, nextShot: () => nextShot(), patchUp, // (shot, raking and patching)
    fly: (id) => sail(id, true), // a voyage in any ship, owned or not (for tests)
    get trial() { return trial; }, TRIAL, // (the ship on her sea trial, if one is out; the wave each is tried on)
    words: { side: sideWords, wind: () => windWords() }, layout, edge: EDGE, // (directions in words, and the panels the edge tags keep clear of)
    get mapNames() { return NAMES_AT.at; }, // (the big map's names as placed, in its own pixels)
    placeTags: () => tags(true, Infinity), // (the raiders' tags placed again as things stand, without a step of the game, none gliding)
    get hits() { return V.hits; }, get downed() { return V.downed; }, get locked() { return locked; },
    // how much wider a Surge has made the view, in degrees (for tests)
    get surgeView() { return surgeFov.x; },
    // run the game's clock without drawing, holding these controls (for tests on slow software rendering), in frames
    // of `frame` seconds (a 60th of a second, or longer to play a slow phone). The sound only counts the news meanwhile
    // (minutes of a fight in a moment would all sound at once), unless a test asks for it (audio.loudSteps)
    step(seconds, controls = {}, frame = 1 / 60) {
      held = { turn: 0, climb: 0, sail: 0, fire: false, look: { x: 0, y: 0 }, zoom: 0, pressed: new Set(), lastLook: performance.now() / 1000, locked: false, ...controls };
      const quiet = audio.quiet; audio.quiet = !audio.loudSteps;
      try { for (let t = 0; t < seconds; t += frame) tick(frame); } finally { audio.quiet = quiet; held = null; }
    },
  };
}

main().catch((err) => {
  console.error(err);
  const e = $('error'); e.hidden = false; e.textContent = `The game couldn't start: ${err.message}`;
});
