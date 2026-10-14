// port.js: the port, and the title screen's panel. The port (Chris: a racing game's garage) shows your ship turning
// slowly in a quiet void over a round stone berth with a brass rim, lit warm from the front and cool from behind. Drag
// to turn it. (The title screen's sky, with your ship flying over Aethermoor at sunset, is title.js.)
//   Title: the game's name, the three skies (difficulty) to choose from, and a big "Set sail" (straight out to sea in
//   your ship: a new Captain has nothing to buy yet), with "To port" beside it. A new Captain is told which skies
//   suit a first voyage; one who has been to sea sees the shards waiting to be spent.
//   Port: pick which ship to sail, buy ships (the Man-o'-war only once the Galleon is owned) and upgrades with Crystal
//   Shards, set where the crystals' power goes, and buy chain shot and crystal breakers (the Captain's for every ship
//   she sails: tactics.js; she can earn them at sea too).
//   Looking at a ship you don't own, the big gold button buys her (filling up as you earn towards her price); under it
//   "Try her out" takes her out for a sea trial (one fight, for nothing: main.js), and setting sail in your own ship is
//   a plain line beside that. On a phone the panel has three tabs: the ship, her upgrades (with a gold dot when
//   there's one you can buy), and her colours.
//   Her colours (paint.js): her sails' dye and her pennants', a row of swatches each; one she has goes on at once, one
//   she hasn't is shown on her ship on the berth, with what it costs (or what wins it) and a button to buy it.
//   The quartermaster's advice: one gold line under the top bar saying what's worth doing next (a ship or an upgrade
//   she can afford, marked with a gold dot, or how many shards more the nearest goal needs, and what her voyages bring
//   home), and the Log button by the shards (her rank, on a screen with room for it) opens the Captain's log
//   (record.js). On the title, the line under the game's name says her rank and her shards, and each skies its record
//   and its three stars (deeds.js).
import * as THREE from 'three';
import { SHIPS, STATS } from '../ships/index.js';
import { handling } from './flight.js';
import { KINDS, GUN_WEIGHT } from './guns.js';
import { SKIES, PRICES, NEEDS, DYE_IDS, STAR_WAVES, STAR_PAY } from './progress.js';
import { MODS, STEPS, POWER, modCost, loadout } from './mods.js';
import { emit, payload } from './events.js';
import { SHOTS, SHOT_ICON, SHOT_LINES } from './tactics.js';
import { DYES, swatch, applyPaint, howGot } from './paint.js';
import { RANKS } from './deeds.js';

const $ = (id) => document.getElementById(id);
const CALM = { calm: true };
const fmt = (n) => Math.round(n).toLocaleString('en');

function makeVoid() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vP; void main() { vP = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }',
    fragmentShader: `varying vec3 vP;
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      void main() {
        vec3 d = normalize(vP); float h = d.y;
        vec3 c = mix(vec3(0.006, 0.004, 0.012), vec3(0.04, 0.018, 0.045), smoothstep(-0.5, 0.0, h));
        c = mix(c, vec3(0.01, 0.014, 0.034), smoothstep(0.0, 0.6, h));
        float st = step(0.997, hash(floor(d * 300.0))) * smoothstep(0.05, 0.5, h);
        c += vec3(0.8, 0.8, 1.0) * st * 0.5;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat);
  m.scale.setScalar(4000); m.frustumCulled = false; m.renderOrder = -10;
  return m;
}
function makeBerth() {
  const g = new THREE.Group();
  const stone = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.04, 0.06, 96), new THREE.MeshStandardMaterial({ color: 0x241b2a, roughness: 0.7, metalness: 0.2 }));
  stone.receiveShadow = true; g.add(stone);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.012, 8, 128).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd9a743, metalness: 0.9, roughness: 0.3 }));
  rim.position.y = 0.03; g.add(rim);
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), r = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,160,70,0.55)'); r.addColorStop(0.6, 'rgba(255,120,50,0.12)'); r.addColorStop(1, 'rgba(255,120,50,0)');
  x.fillStyle = r; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  glow.position.y = 0.035; g.add(glow);
  return g;
}

export function makePort({ renderer, env, progress, shipFor, touch = false, onSail, onTrial, onMode, deeds, onLog }) {
  const scene = new THREE.Scene();
  scene.environment = env; scene.environmentIntensity = 0.75;
  scene.add(makeVoid());
  const berth = makeBerth(); scene.add(berth);
  scene.add(new THREE.HemisphereLight(0x8a90c8, 0x2a1820, 0.6));
  const key = new THREE.DirectionalLight(0xffe2b8, 2.8); key.castShadow = true; key.shadow.mapSize.setScalar(touch ? 1024 : 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.04;
  // the key light's shadow map, n pixels square (Settings: picture); drawn afresh at the new size
  const setShadow = (n) => { if (key.shadow.mapSize.x === n) return; key.shadow.mapSize.setScalar(n); key.shadow.map?.dispose(); key.shadow.map = null; };
  const rimLight = new THREE.DirectionalLight(0x8fc8ff, 1.6);
  scene.add(key, key.target, rimLight);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 9000);

  let mode = 'title', viewing = progress.data.flying, ship = null, spin = 0.7, spinV = 0, drag = null, frame = { radius: 10, cy: 0 };
  // a dye tried on her ship and not hers yet ({ kind, id }), shown on the berth until it's bought or she's left
  let preview = null;
  const dress = () => { if (!ship) return; const P = progress.data.ships[viewing].paint; applyPaint(ship, preview ? { ...P, [preview.kind]: preview.id } : P); };

  // ---------- the ship on show ----------
  function show(id) {
    if (ship && preview) { preview = null; dress(); } // (a colour tried on her and not bought: off again)
    viewing = id;
    const R = SHIPS.find((s) => s.id === id), next = shipFor(R);
    if (ship && ship !== next) scene.remove(ship.root);
    ship = next; preview = null; dress();
    ship.root.rotation.set(0, spin, 0); ship.root.position.set(0, 0, 0);
    scene.add(ship.root);
    const b = ship.bounds, size = b.getSize(new THREE.Vector3()), L = R.length;
    berth.scale.set(L * 0.62, L * 0.62, L * 0.62); berth.position.y = b.min.y - L * 0.1;
    frame = { radius: size.length() / 2, cy: (b.min.y + b.max.y) / 2 - L * 0.04 };
    const r = L * 0.9;
    Object.assign(key.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 6 }); key.shadow.camera.updateProjectionMatrix();
    key.position.set(L * 1.2, L * 1.6, L * 1.4); rimLight.position.set(-L * 1.5, L * 0.6, -L * 1.6);
    refresh();
  }
  // where the ship sits on screen: clear of the panels
  // (the same three layouts as the page: a laptop, a phone upright (narrow), a phone sideways or any short window. On a
  // phone held upright her panel is as tall as what's in it, so she has the room above its top: read from the page
  // after anything in the panel changes, or the window does, not every frame)
  // (and on a laptop or a phone held sideways, she stands clear above the ships along the bottom: on a narrow window
  // their buttons take two rows. Measured the same way)
  // (and under the top bar, the quartermaster's line when it shows: she stands clear under it)
  let panelTop = null, rowTop = null, adviceBottom = null;
  const remeasure = () => { panelTop = null; rowTop = null; adviceBottom = null; };
  const topRoom = (least) => { adviceBottom ??= adviceEl.offsetHeight ? adviceEl.getBoundingClientRect().bottom : 0; return Math.max(least, adviceBottom + 6); };
  document.fonts?.addEventListener?.('loadingdone', remeasure); // (the words take their own room once their fonts are in)
  function place() {
    const w = innerWidth, h = innerHeight, narrow = w <= 700, short = h <= 500, fov = THREE.MathUtils.degToRad(camera.fov / 2);
    let cx = w / 2, cy = h / 2, vw = w, vh = h;
    if (mode === 'title') {
      if (narrow && !short) { vh = h * 0.36; cy = h * 0.2; } // (above the title, clear of it)
      else if (short) { vw = w * 0.34; cx = w * 0.8; vh = h * 0.8; } // (right of the title card)
      else { vw = w * 0.5; cx = w * 0.72; }
    } else if (narrow && !short) { panelTop ??= panel.getBoundingClientRect().top; const top = topRoom(58); vh = Math.max(40, panelTop - top - 6); cy = top + vh / 2; } // (all of her above the panel's top)
    else {
      const pw = short ? Math.min(372, w * 0.5) : 380, top = topRoom(54); vw = w - pw - 40; cx = vw / 2;
      rowTop ??= shipsEl.getBoundingClientRect().top || h;
      vh = Math.max(40, Math.min(h - (short ? 110 : 140) - (top - 54), rowTop - (short ? 4 : 8) - top)); cy = top + vh / 2;
    }
    const t = Math.tan(fov), fit = Math.min(t * (vh / h), t * camera.aspect * (vw / w));
    const dist = (frame.radius / fit) * 1.02, el = 0.2;
    camera.position.set(0, frame.cy + Math.sin(el) * dist, Math.cos(el) * dist);
    camera.lookAt(0, frame.cy, 0);
    camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
  }

  // ---------- drag to turn the ship (the port's panels let presses through to it, game.html) ----------
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => { if (mode !== 'port') return; drag = { x: e.clientX, id: e.pointerId }; spinV = 0; });
  addEventListener('pointermove', (e) => { if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x; drag.x = e.clientX; spin += dx * 0.008; spinV = dx * 0.008; });
  addEventListener('pointerup', (e) => { if (drag && e.pointerId === drag.id) drag = null; });
  addEventListener('pointercancel', () => { drag = null; });

  // ---------- the title screen ----------
  const skiesEl = $('skies');
  for (const [id, S] of Object.entries(SKIES)) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.skies = id; b.setAttribute('role', 'radio');
    b.innerHTML = `<b>${S.name}</b><span>${S.line}</span><small><i class="stars" aria-hidden="true">${STAR_WAVES.map(() => '<i class="star"></i>').join('')}</i><em></em><em class="more"></em></small>${id === 'fair' ? '<i class="first" hidden>Best for your first voyage</i>' : ''}`;
    b.addEventListener('click', () => {
      if (progress.data.skies !== id) { payload('port:skies').skies = id; emit('port:skies'); }
      progress.data.skies = id; progress.save(); refresh();
    });
    skiesEl.append(b);
  }
  $('btn-title-sail').addEventListener('click', () => onSail(progress.data.flying));
  $('btn-to-port').addEventListener('click', () => setMode('port'));
  $('btn-skies').addEventListener('click', () => setMode('title'));
  $('btn-log').addEventListener('click', () => onLog?.());

  // ---------- the port ----------
  const shipsEl = $('port-ships');
  for (const R of SHIPS) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.ship = R.id;
    b.innerHTML = `<b>${R.name}</b><small>${R.cls}</small><em></em>`;
    b.addEventListener('click', () => {
      const own = progress.data.ships[R.id].owned;
      if (own && progress.data.flying !== R.id) { progress.data.flying = R.id; progress.save(); }
      show(R.id);
    });
    shipsEl.append(b);
  }
  // a giant not yet owned: the line under her Buy button says what owning her brings (Chris: giant raiders only once
  // you own one); main.js says it again as she's bought
  const GIANT = { galleon: 'Once she\'s yours, the treasure ships you meet are Galleons.', manowar: 'Once she\'s yours, raiders sail Men-o\'-war too.' };
  // the ship to own before this one is sold (the Galleon, before the Man-o'-war: NEEDS), or null
  const needs = (id) => (NEEDS[id] && !progress.data.ships[NEEDS[id]].owned ? SHIPS.find((s) => s.id === NEEDS[id]) : null);
  $('btn-buy').addEventListener('click', () => {
    const d = progress.data, price = PRICES[viewing];
    if (d.ships[viewing].owned || d.shards < price || needs(viewing)) return;
    d.shards -= price; d.ships[viewing].owned = true; d.flying = viewing; progress.save(); refresh();
    payload('port:buy').ship = viewing; emit('port:buy');
    if (deeds?.inPort().length) refresh(); // (her fleet may have won a commendation: deeds.js)
  });
  // the tabs (on a phone): the ship, her upgrades, or her colours
  const panel = $('port-panel'), portEl = $('port'), adviceEl = $('pp-next');
  const TABS = ['ship', 'upgrades', 'colours'];
  const tab = (t) => { panel.dataset.tab = t; portEl.dataset.tab = t; for (const k of TABS) $(`pp-tab-${k}`).setAttribute('aria-selected', String(t === k)); panel.scrollTop = 0; remeasure(); };
  for (const k of TABS) $(`pp-tab-${k}`).addEventListener('click', () => tab(k));
  $('pp-power').addEventListener('input', (e) => {
    const cfg = progress.data.ships[viewing], p = +e.target.value;
    if (cfg.power !== p) { const E = payload('port:power'); E.ship = viewing; E.power = p; emit('port:power'); }
    cfg.power = p; refresh();
  });
  $('pp-power').addEventListener('change', () => progress.save());
  const modsEl = $('pp-mods');
  for (const M of MODS) {
    const row = document.createElement('div');
    row.className = 'mod'; row.dataset.mod = M.id;
    row.innerHTML = `<b>${M.name}<span class="pips"></span></b><button class="buy" type="button"></button><p>${M.line}</p><small>${M.step}</small>`;
    row.querySelector('button').addEventListener('click', () => {
      const d = progress.data, cfg = d.ships[viewing], step = cfg.mods[M.id], cost = modCost(viewing, step);
      if (!cfg.owned || step >= STEPS || d.shards < cost) return;
      d.shards -= cost; cfg.mods[M.id] = step + 1; progress.save(); refresh();
      const E = payload('port:upgrade'); E.ship = viewing; E.mod = M.id; E.step = step + 1; emit('port:upgrade');
      if (deeds?.inPort().length) refresh();
    });
    modsEl.append(row);
  }
  // the kinds of shot to buy (round shot is always aboard): bought once, for every ship she sails
  const shotsEl = $('pp-shots');
  for (const id of ['chain', 'breaker']) {
    const S = SHOTS[id], row = document.createElement('div');
    row.className = 'buyshot'; row.dataset.shot = id; row.style.setProperty('--shot', `#${S.color.toString(16).padStart(6, '0')}`);
    row.innerHTML = `<b><span style="color: var(--shot)">${SHOT_ICON[id]}</span>${S.name}</b><button class="buy" type="button"></button><p>${SHOT_LINES[id]}</p>`;
    row.querySelector('button').addEventListener('click', () => {
      const d = progress.data;
      if (d.shots[id] || d.shards < S.price) return;
      d.shards -= S.price; d.shots[id] = true; progress.save(); refresh();
      payload('port:shot').shot = id; emit('port:shot');
    });
    shotsEl.append(row);
  }
  // her colours: a swatch for each dye, sails and pennants. One she has goes on at once (kept for this ship); one she
  // hasn't is tried on her ship on the berth, and the button under them buys it (or says what wins it)
  const sailsEl = $('pp-sails'), pennantsEl = $('pp-pennants');
  for (const id of DYE_IDS) {
    const D = DYES[id], b = document.createElement('button');
    b.type = 'button'; b.className = 'swatch'; b.dataset.dye = id; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', D.name); b.title = D.name;
    b.style.setProperty('--dye', swatch(id));
    b.addEventListener('click', () => pickDye(id));
    (D.kind === 'sails' ? sailsEl : pennantsEl).append(b);
  }
  const DYE = payload('port:dye');
  function painted(kind, id, bought) { DYE.ship = viewing; DYE.kind = kind; DYE.dye = id; DYE.bought = bought; emit('port:dye'); }
  function pickDye(id) {
    const d = progress.data, cfg = d.ships[viewing], D = DYES[id];
    if (!cfg.owned) return;
    if (d.dyes[id]) { preview = null; if (cfg.paint[D.kind] !== id) { cfg.paint[D.kind] = id; progress.save(); painted(D.kind, id, false); } }
    else preview = { kind: D.kind, id };
    dress(); refresh();
  }
  $('btn-dye').addEventListener('click', () => {
    const d = progress.data, D = preview && DYES[preview.id];
    if (!D || !D.price || d.dyes[preview.id] || d.shards < D.price || !d.ships[viewing].owned) return;
    const { kind, id } = preview;
    d.shards -= D.price; d.dyes[id] = 1; d.ships[viewing].paint[kind] = id; preview = null; progress.save(); dress(); refresh();
    painted(kind, id, true);
  });
  $('btn-sail').addEventListener('click', () => onSail(progress.data.flying));
  // a sea trial (Chris: a garage's test drive): a ship not owned yet taken out for one fight, for nothing (main.js)
  $('btn-try').addEventListener('click', () => { if (!progress.data.ships[viewing].owned) onTrial?.(viewing); });

  // the stat bars: this ship as built (pale) and with its upgrades (gold), against the best any ship can be
  const best = { speed: 0, turn: 0, climb: 0, hull: 0, firepower: 0 };
  const figures = (id, cfg) => {
    const L = loadout(id, cfg), H = handling(L.stats), st = STATS[id];
    const guns = st.bow * KINDS.chaser.damage / KINDS.chaser.reload + st.side * (st.side > 1 ? KINDS.broadside.damage / KINDS.broadside.reload : KINDS.chaser.damage / KINDS.chaser.reload);
    return {
      speed: H.vmax * L.tune.speed * 3.6, turn: (H.turn * L.tune.turn * 180) / Math.PI, climb: H.climb * L.tune.climb,
      hull: L.stats.hull, sails: L.stats.sails, crystals: L.stats.crystals, firepower: (guns * GUN_WEIGHT[id] * L.guns.damage) / L.guns.reload,
      reload: (st.side > 1 ? KINDS.broadside.reload : KINDS.chaser.reload) * L.guns.reload,
    };
  };
  const atBest = (p) => ({ power: p, mods: { armour: p > 0 ? 3 : 0, canvas: 3, drill: 3, crystals: 3 } });
  for (const R of SHIPS) for (const p of [-2, 2]) {
    const f = figures(R.id, atBest(p));
    for (const k in best) best[k] = Math.max(best[k], f[k]);
  }
  // a bar's length for a figure: its share of the best any ship can be. The hull and firepower run from a Skiff's to a
  // Captain's Man-o'-war's, twenty to fifty times as much, so their bars go by the square root of that share: a Skiff's still shows, and
  // a bigger figure always has a longer bar (the number, or the word, says exactly how much)
  const ROOT = { hull: true, firepower: true };
  const share = (k, v) => (ROOT[k] ? Math.sqrt(v / best[k]) : v / best[k]);
  // each in plain words: turning as the time for a full circle, climbing as metres a second, firepower in words, read
  // against a Frigate at her best (very heavy): a tenth more than hers is fearsome (the Man-o'-war as built, and a
  // Galleon with her guns and crystals upgraded), so the big two read apart
  const HEAVIEST = figures('frigate', atBest(2)).firepower;
  const weight = (v) => { const k = v / HEAVIEST; return k < 0.25 ? 'light' : k < 0.5 ? 'fair' : k < 0.75 ? 'heavy' : k <= 1.1 ? 'very heavy' : 'fearsome'; };
  const STAT_ROWS = [
    ['speed', 'Top speed', (v) => `${fmt(v)} km/h`], ['turn', 'Turning', (v) => `a full circle in ${Math.round(360 / v)} s`], ['climb', 'Climbing', (v) => `${v.toFixed(0)} m a second`],
    ['hull', 'Hull', fmt], ['firepower', 'Firepower', weight],
  ];
  const statsEl = $('pp-stats');
  statsEl.innerHTML = STAT_ROWS.map(([k, label]) => `<div class="stat" data-stat="${k}"><span>${label}</span><span class="bar"><i class="now"></i><i class="base"></i><i class="mine" hidden></i></span><b></b></div>`).join('');
  // her class line: "Brig · 30 m · Guns: 1 in the bow, 3 each side, 1 in the stern", each piece kept whole, so a narrow
  // panel breaks it only between them (never "Man-o'-" and "war", or "in the" and "stern")
  const clsLine = (R, st) => {
    const guns = [st.bow && `${st.bow} in the bow`, st.side && `${st.side} each side`, st.stern && `${st.stern} in the stern`].filter(Boolean);
    return `<span>${R.cls} · ${R.length} m</span> · ${guns.map((w, i) => `<span>${i ? '' : 'Guns: '}${w}</span>`).join(', ')}`;
  };

  // ---------- the quartermaster's advice ----------
  // what's worth doing next, first that fits: a new Captain's first voyage; a ship she can buy now (the next not owned);
  // an upgrade for the ship she sails (the lowest step first; gun drill, then armour, canvas, crystals); a kind of shot;
  // or the nearest of those, in shards still to earn (and what her last voyages brought home, on average). In words,
  // `long` and `short` (a phone's: one line), and what to mark with a gold dot (`ship`, `mod`, `shot`)
  const ROLE_WORDS = { cutter: 'quick, with three guns a side', brig: 'steady and well gunned, with broadsides', frigate: 'the hunter, ten guns a side', galleon: 'a giant with two decks of guns', manowar: 'the fortress of the skies' };
  const PLAIN = { drill: 'her guns reload faster', armour: 'a tougher hull, a little slower', canvas: 'stronger sails and more speed', crystals: 'stronger crystals, and she climbs faster' };
  const ADVISE = ['drill', 'armour', 'canvas', 'crystals'];
  function advice() {
    const d = progress.data, F = SHIPS.find((s) => s.id === d.flying), cfg = d.ships[d.flying];
    if (!d.voyages) return { long: `Your first ship, the ${F.name}, is ready. Set sail and bring down raiders to earn Crystal Shards.`, short: 'Set sail and bring down raiders for shards', target: null };
    const next = SHIPS.find((s) => !d.ships[s.id].owned && !needs(s.id));
    if (next && d.shards >= PRICES[next.id]) return { long: `You can buy the ${next.name} now: ${ROLE_WORDS[next.id]}.`, short: `You can buy the ${next.name} now`, target: { ship: next.id } };
    let up = null;
    for (const id of ADVISE) { const step = cfg.mods[id]; if (step < STEPS && d.shards >= modCost(d.flying, step) && (!up || step < up.step)) up = { M: MODS.find((m) => m.id === id), step, cost: modCost(d.flying, step) }; }
    if (up) return { long: `You can afford ${up.M.name} for the ${F.name} (◆ ${fmt(up.cost)}): ${PLAIN[up.M.id]}.`, short: `You can afford ${up.M.name} (◆ ${fmt(up.cost)})`, target: { mod: up.M.id } };
    for (const id of ['chain', 'breaker']) if (!d.shots[id] && d.shards >= SHOTS[id].price) return { long: `You can buy ${SHOTS[id].name.toLowerCase()} (◆ ${fmt(SHOTS[id].price)}): ${SHOT_LINES[id].split(':')[0].toLowerCase()}.`, short: `You can buy ${SHOTS[id].name.toLowerCase()} (◆ ${fmt(SHOTS[id].price)})`, target: { shot: id } };
    const goals = [];
    if (next) goals.push({ n: PRICES[next.id], what: `the ${next.name}` });
    for (const id of ADVISE) { const step = cfg.mods[id]; if (step < STEPS) goals.push({ n: modCost(d.flying, step), what: MODS.find((m) => m.id === id).name.toLowerCase() }); }
    for (const id of ['chain', 'breaker']) if (!d.shots[id]) goals.push({ n: SHOTS[id].price, what: SHOTS[id].name.toLowerCase() });
    if (!goals.length) return { long: 'Every ship and every upgrade is yours. Dye her sails, chase the stars on the Maelstrom, and see your log.', short: 'Every ship and upgrade is yours: chase the stars', target: null };
    const g = goals.reduce((a, b) => (b.n < a.n ? b : a)), more = g.n - d.shards;
    const L = d.log.slice(-5), avg = L.length >= 2 ? Math.round(L.reduce((a, e) => a + e.s, 0) / L.length / 10) * 10 : 0;
    return { long: `◆ ${fmt(more)} more for ${g.what}.${avg ? ` Your last voyages brought home about ◆ ${fmt(avg)} each.` : ''}`, short: `◆ ${fmt(more)} more for ${g.what}`, target: null };
  }

  function refresh() {
    remeasure();
    const d = progress.data, cfg = d.ships[viewing], R = SHIPS.find((s) => s.id === viewing), st = STATS[viewing];
    const fresh = progress.newCaptain, F = SHIPS.find((s) => s.id === d.flying);
    // each skies: its three stars (gold for those won), its best wave, and (where there's room) its most shards and raiders
    // in a voyage; the Maelstrom, never yet sailed, the shards its stars pay
    for (const b of skiesEl.children) {
      const k = b.dataset.skies, n = d.best[k], R = d.records[k], st = d.stars[k], won = STAR_WAVES.filter((w) => st[`w${w}`]).length;
      b.setAttribute('aria-checked', String(k === d.skies));
      const [best, more] = b.querySelectorAll('small em'), small = b.querySelector('small');
      best.textContent = n ? `Best: wave ${n}` : !fresh && k === 'mael' ? `◆ ${fmt(STAR_PAY.mael.reduce((a, x) => a + x, 0))} in stars to win` : '';
      more.textContent = n && (R.shards || R.downed) ? ` · ◆ ${fmt(R.shards)} · ${fmt(R.downed)} downed` : '';
      small.querySelectorAll('.star').forEach((e, i) => e.classList.toggle('on', !!st[`w${STAR_WAVES[i]}`]));
      small.hidden = !n && !best.textContent; small.querySelector('.stars').hidden = !n && !won;
      small.setAttribute('aria-label', `${won} of 3 stars${best.textContent ? ` · ${best.textContent}` : ''}`);
      const first = b.querySelector('.first'); if (first) first.hidden = !fresh;
    }
    // the title's big button sails at once; a Captain back from the sea is shown her rank and the shards waiting in port
    $('btn-title-sail').textContent = fresh ? 'Set sail' : `Set sail in the ${F.name}`;
    const rank = $('title-rank'), rankName = RANKS[d.rank] ?? RANKS[0];
    rank.hidden = fresh; rank.innerHTML = `<b>${rankName}</b> · ${d.shards ? `◆ ${fmt(d.shards)} to spend in port` : 'no shards yet: bring down raiders to earn them'}`;
    // the Log button: her rank (on a phone held upright, just the book)
    $('btn-log').querySelector('span').textContent = rankName; $('btn-log').setAttribute('aria-label', `Captain's log: ${rankName}`);
    // (on a phone upright just the skies' name, so the port's top line never wraps)
    const sk = $('btn-skies'); sk.innerHTML = `<span>Skies: </span>${SKIES[d.skies].name}`; sk.setAttribute('aria-label', `Skies: ${SKIES[d.skies].name}`);
    $('port-shards').textContent = `◆ ${fmt(d.shards)}`;
    for (const b of shipsEl.children) {
      const id = b.dataset.ship, own = d.ships[id].owned;
      b.setAttribute('aria-pressed', String(id === viewing));
      b.querySelector('em').textContent = id === d.flying ? 'Sailing' : own ? 'Yours' : `◆ ${fmt(PRICES[id])}`;
    }
    $('pp-name').textContent = R.name; $('pp-cls').innerHTML = clsLine(R, st);
    $('pp-blurb').textContent = st.blurb;
    const owned = cfg.owned;
    $('pp-buy').hidden = owned; $('pp-own').hidden = !owned; $('pp-tabs').hidden = !owned;
    panel.classList.toggle('buying', !owned); portEl.classList.toggle('buying', !owned); // (on a phone upright her panel is taller, so how she sails shows above the Buy button)
    if (!owned && panel.dataset.tab !== 'ship') tab('ship');
    // the quartermaster's line, and a gold dot on what it means (a ship's button; an upgrade of the ship she's looking
    // at, if it's the one she sails)
    const A = advice();
    adviceEl.innerHTML = `<span class="long">${A.long}</span><span class="short">${A.short}</span>`;
    for (const b of shipsEl.children) b.classList.toggle('advised', A.target?.ship === b.dataset.ship);
    // a ship you don't own: the big button buys her, and fills with gold as you earn towards her price (its price kept
    // in one piece, never broken over two lines). One sold only once another is owned says so, and doesn't fill
    const price = PRICES[viewing], first = !owned && needs(viewing), short = !owned && d.shards < price, b = $('btn-buy');
    if (!owned) {
      if (first) b.firstElementChild.textContent = `Buy the ${first.name} first`;
      else b.firstElementChild.innerHTML = `Buy<span class="the"> the</span> ${R.name} <span class="price">· ◆ ${fmt(price)}</span>`;
      b.disabled = short || !!first;
      b.style.setProperty('--got', `${first ? 0 : Math.round(Math.min(1, d.shards / Math.max(1, price)) * 100)}%`);
    }
    $('pp-need').textContent = [first ? `The port sells her once you own the ${first.name}.` : short ? `You have ◆ ${fmt(d.shards)}. Bring down raiders to earn the rest.` : '', owned ? '' : GIANT[viewing] ?? ''].filter(Boolean).join(' ');
    const sail = $('btn-sail');
    // (on a narrow phone held sideways, beside "Try her out", the plain line says just "or sail the Zephyr")
    const alt = !owned || !!preview; // (a ship not owned, or a colour tried on: the big button is Buy, setting sail a plain line)
    sail.classList.toggle('alt', alt); sail.innerHTML = !alt ? `Set sail in the ${F.name}` : `or <span class="long">set </span>sail <span class="long">in </span>the ${F.name}`;
    $('btn-try').hidden = owned; // (beside it, a ship not owned can be tried out: a sea trial)
    const base = figures(viewing, { power: 0, mods: { armour: 0, canvas: 0, drill: 0, crystals: 0 } }), now = figures(viewing, cfg);
    // (looking at another ship: a white mark on each bar where the ship you sail now is, to compare)
    const mine = viewing !== d.flying ? figures(d.flying, d.ships[d.flying]) : null;
    for (const [k, , show] of STAT_ROWS) {
      const row = statsEl.querySelector(`[data-stat="${k}"]`), a = share(k, base[k]), n = share(k, now[k]);
      // pale: what's kept either way; past it, gold for what the upgrades add, red for what they cost
      const [nowBar, baseBar, mark] = row.querySelectorAll('i');
      baseBar.style.width = `${Math.min(a, n) * 100}%`; nowBar.style.width = `${Math.max(a, n) * 100}%`;
      nowBar.classList.toggle('less', n < a - 1e-6);
      mark.hidden = !mine; if (mine) mark.style.left = `calc(${Math.min(1, share(k, mine[k])) * 100}% - 1px)`;
      row.querySelector('b').textContent = show(now[k]);
    }
    const p = $('pp-power'); p.value = String(cfg.power);
    const pct = (x) => `${Math.abs(Math.round(x * 100))}%`, n = Math.abs(cfg.power);
    $('pp-power-note').textContent = cfg.power === 0 ? 'Even: the crystals feed the sails and the guns alike.'
      : cfg.power > 0 ? `${POWER[cfg.power + 2]}: she reloads ${pct(0.08 * n)} quicker and hits ${pct(0.06 * n)} harder, but she's ${pct(0.06 * n)} slower.`
        : `${POWER[cfg.power + 2]}: she's ${pct(0.06 * n)} faster, but she reloads ${pct(0.08 * n)} slower and hits ${pct(0.06 * n)} lighter.`;
    let canBuy = false;
    for (const row of modsEl.children) {
      const M = MODS.find((m) => m.id === row.dataset.mod), step = cfg.mods[M.id], b = row.querySelector('button');
      row.classList.toggle('advised', viewing === d.flying && A.target?.mod === M.id);
      row.querySelector('.pips').textContent = '●'.repeat(step) + '○'.repeat(STEPS - step);
      if (step >= STEPS) { b.textContent = 'Done'; b.disabled = true; }
      else { const cost = modCost(viewing, step); b.textContent = `◆ ${fmt(cost)}`; b.disabled = d.shards < cost; canBuy ||= owned && d.shards >= cost; }
    }
    for (const row of shotsEl.children) {
      const id = row.dataset.shot, b = row.querySelector('button'), have = !!d.shots?.[id];
      row.classList.toggle('advised', A.target?.shot === id);
      b.textContent = have ? 'Aboard' : `◆ ${fmt(SHOTS[id].price)}`; b.disabled = have || d.shards < SHOTS[id].price;
      canBuy ||= owned && !b.disabled; // (a kind of shot to buy shows the gold dot too)
    }
    $('pp-tab-upgrades').querySelector('.dot').hidden = !canBuy;
    // her colours: the swatches (ticked: hers, or the one tried on her; a lock on those she hasn't), what's tried on her
    // and what it costs or what wins it, and the button that buys it
    const shown = (kind) => (preview?.kind === kind ? preview.id : cfg.paint[kind]);
    for (const el of [sailsEl, pennantsEl]) for (const b of el.children) {
      const id = b.dataset.dye, D = DYES[id];
      b.setAttribute('aria-checked', String(shown(D.kind) === id)); b.classList.toggle('locked', !d.dyes[id]);
    }
    const P = preview && DYES[preview.id], dyeBtn = $('btn-dye');
    $('pp-dye-note').textContent = P ? `${P.name} ${P.kind === 'sails' ? 'sails' : 'pennants'}: ${P.price ? `${d.shards < P.price ? `you have ◆ ${fmt(d.shards)}` : 'once bought, for every ship'}` : howGot(preview.id, RANKS)}` : '';
    $('pp-dye-buy').hidden = !P;
    if (P) { dyeBtn.innerHTML = P.price ? `Buy ${P.name} <span class="price">· ◆ ${fmt(P.price)}</span>` : 'Not for sale: won'; dyeBtn.disabled = !P.price || d.shards < P.price; }
  }

  // the title (its sky is title.js's) or the port (her ship on the berth)
  function setMode(m) {
    if (m !== 'port' && preview) { preview = null; dress(); } // (a colour tried on and not bought: off again, before she sails)
    mode = m;
    $('title').hidden = m !== 'title'; $('port').hidden = m !== 'port';
    if (m === 'port') { deeds?.inPort(); show(viewing); } else if (m === 'title') { deeds?.today(); refresh(); }
    if (m === 'title' || m === 'port') onMode?.(m);
  }
  progress.onLoad(() => { viewing = progress.data.flying; if (mode === 'port') show(viewing); else refresh(); });

  function update(dt) {
    if (!ship) return;
    if (!drag) { spin += dt * 0.18 + spinV; spinV *= Math.exp(-dt * 3); }
    ship.root.rotation.set(0, spin, 0);
    ship.root.position.y = Math.sin(performance.now() / 1300) * ship.recipe.length * 0.012;
    ship.update(dt, CALM);
    ship.glow.material.uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  }
  function render() { place(); renderer.render(scene, camera); camera.clearViewOffset(); }
  // (for the checks: the ship's box on the screen as she's drawn, in the page's pixels: the corners of her bounds)
  function shipBox() {
    place(); ship.root.updateMatrixWorld(true); camera.updateMatrixWorld();
    const b = ship.bounds, v = new THREE.Vector3(), box = { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity };
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).applyMatrix4(ship.root.matrixWorld).project(camera);
      const x = (v.x + 1) / 2 * innerWidth, y = (1 - v.y) / 2 * innerHeight;
      box.l = Math.min(box.l, x); box.r = Math.max(box.r, x); box.t = Math.min(box.t, y); box.b = Math.max(box.b, y);
    }
    camera.clearViewOffset();
    return box;
  }
  function resize() { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); remeasure(); }
  return { scene, camera, show, setMode, update, render, resize, refresh, setShadow, tab, shipBox, advice, pickDye, get preview() { return preview; }, get viewing() { return viewing; }, get mode() { return mode; }, set mode(m) { mode = m; }, get spin() { return spin; } };
}
