// port.js: the port, and the title screen's panel. The port (Chris: a racing game's garage) shows your ship turning
// slowly in a quiet void over a round stone berth with a brass rim, lit warm from the front and cool from behind. Drag
// to turn it. (The title screen's sky, with your ship flying over Aethermoor at sunset, is title.js.)
//   Title: the game's name, the three skies (difficulty) to choose from, and a big "Set sail" (straight out to sea in
//   your ship: a new Captain has nothing to buy yet), with "To port" beside it. A new Captain is told which skies
//   suit a first voyage; one who has been to sea sees the shards waiting to be spent.
//   Port: pick which ship to sail, buy ships and upgrades with Crystal Shards, and set where the crystals' power goes.
//   Looking at a ship you don't own, the big gold button buys her (filling up as you earn towards her price), and
//   setting sail in your own ship is a plain line under it. On a phone the panel has two tabs: the ship, and her
//   upgrades (with a gold dot when there's one you can buy).
import * as THREE from 'three';
import { SHIPS, STATS } from '../ships/index.js';
import { handling } from './flight.js';
import { KINDS, GUN_WEIGHT } from './guns.js';
import { SKIES, PRICES } from './progress.js';
import { MODS, STEPS, POWER, modCost, loadout } from './mods.js';
import { emit, payload } from './events.js';

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

export function makePort({ renderer, env, progress, shipFor, touch = false, onSail, onMode }) {
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

  // ---------- the ship on show ----------
  function show(id) {
    viewing = id;
    const R = SHIPS.find((s) => s.id === id), next = shipFor(R);
    if (ship && ship !== next) scene.remove(ship.root);
    ship = next;
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
  let panelTop = null, rowTop = null;
  const remeasure = () => { panelTop = null; rowTop = null; };
  document.fonts?.addEventListener?.('loadingdone', remeasure); // (the words take their own room once their fonts are in)
  function place() {
    const w = innerWidth, h = innerHeight, narrow = w <= 700, short = h <= 500, fov = THREE.MathUtils.degToRad(camera.fov / 2);
    let cx = w / 2, cy = h / 2, vw = w, vh = h;
    if (mode === 'title') {
      if (narrow && !short) { vh = h * 0.36; cy = h * 0.2; } // (above the title, clear of it)
      else if (short) { vw = w * 0.34; cx = w * 0.8; vh = h * 0.8; } // (right of the title card)
      else { vw = w * 0.5; cx = w * 0.72; }
    } else if (narrow && !short) { panelTop ??= panel.getBoundingClientRect().top; vh = Math.max(h * 0.2, panelTop - 64); cy = 58 + vh / 2; }
    else {
      const pw = short ? Math.min(372, w * 0.5) : 380; vw = w - pw - 40; cx = vw / 2;
      rowTop ??= shipsEl.getBoundingClientRect().top || h;
      vh = Math.min(h - (short ? 110 : 140), rowTop - (short ? 4 : 8) - 54); cy = 54 + vh / 2;
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
    b.innerHTML = `<b>${S.name}</b><span>${S.line}</span><small></small>${id === 'fair' ? '<i class="first" hidden>Best for your first voyage</i>' : ''}`;
    b.addEventListener('click', () => {
      if (progress.data.skies !== id) { payload('port:skies').skies = id; emit('port:skies'); }
      progress.data.skies = id; progress.save(); refresh();
    });
    skiesEl.append(b);
  }
  $('btn-title-sail').addEventListener('click', () => onSail(progress.data.flying));
  $('btn-to-port').addEventListener('click', () => setMode('port'));
  $('btn-skies').addEventListener('click', () => setMode('title'));

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
  $('btn-buy').addEventListener('click', () => {
    const d = progress.data, price = PRICES[viewing];
    if (d.ships[viewing].owned || d.shards < price) return;
    d.shards -= price; d.ships[viewing].owned = true; d.flying = viewing; progress.save(); refresh();
    payload('port:buy').ship = viewing; emit('port:buy');
  });
  // the tabs (on a phone): the ship, or her upgrades
  const panel = $('port-panel');
  const tab = (t) => { panel.dataset.tab = t; $('pp-tab-ship').setAttribute('aria-selected', String(t === 'ship')); $('pp-tab-upgrades').setAttribute('aria-selected', String(t === 'upgrades')); panel.scrollTop = 0; remeasure(); };
  $('pp-tab-ship').addEventListener('click', () => tab('ship'));
  $('pp-tab-upgrades').addEventListener('click', () => tab('upgrades'));
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
    });
    modsEl.append(row);
  }
  $('btn-sail').addEventListener('click', () => onSail(progress.data.flying));

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
  // Man-o'-war's, thirty times as much, so their bars go by the square root of that share: a Skiff's still shows, and
  // a bigger figure always has a longer bar (the number, or the word, says exactly how much)
  const ROOT = { hull: true, firepower: true };
  const share = (k, v) => (ROOT[k] ? Math.sqrt(v / best[k]) : v / best[k]);
  // each in plain words: turning as the time for a full circle, climbing as metres a second, firepower in words, read
  // against a Frigate at her best (very heavy): past half as much again, the big two's are fearsome
  const WEIGHT = ['light', 'fair', 'heavy', 'very heavy', 'very heavy', 'very heavy', 'fearsome'], HEAVIEST = figures('frigate', atBest(2)).firepower;
  const STAT_ROWS = [
    ['speed', 'Top speed', (v) => `${fmt(v)} km/h`], ['turn', 'Turning', (v) => `a full circle in ${Math.round(360 / v)} s`], ['climb', 'Climbing', (v) => `${v.toFixed(0)} m a second`],
    ['hull', 'Hull', fmt], ['firepower', 'Firepower', (v) => WEIGHT[Math.min(6, Math.floor((v / HEAVIEST) * 4))]],
  ];
  const statsEl = $('pp-stats');
  statsEl.innerHTML = STAT_ROWS.map(([k, label]) => `<div class="stat" data-stat="${k}"><span>${label}</span><span class="bar"><i class="now"></i><i class="base"></i><i class="mine" hidden></i></span><b></b></div>`).join('');
  // the guns, in words: "1 in the bow, 3 each side, 1 in the stern"
  const gunWords = (st) => [st.bow && `${st.bow} in the bow`, st.side && `${st.side} each side`, st.stern && `${st.stern} in the stern`].filter(Boolean).join(', ');

  function refresh() {
    remeasure();
    const d = progress.data, cfg = d.ships[viewing], R = SHIPS.find((s) => s.id === viewing), st = STATS[viewing];
    const fresh = progress.newCaptain, F = SHIPS.find((s) => s.id === d.flying);
    for (const b of skiesEl.children) {
      b.setAttribute('aria-checked', String(b.dataset.skies === d.skies));
      const n = d.best[b.dataset.skies];
      b.querySelector('small').textContent = n ? `Best: wave ${n}` : '';
      const first = b.querySelector('.first'); if (first) first.hidden = !fresh;
    }
    // the title's big button sails at once; a Captain back from the sea is shown the shards waiting in port
    $('btn-title-sail').textContent = fresh ? 'Set sail' : `Set sail in the ${F.name}`;
    const rank = $('title-rank');
    rank.hidden = fresh; rank.textContent = d.shards ? `◆ ${fmt(d.shards)} to spend in port` : 'No shards yet: bring down raiders to earn them';
    // (on a phone upright just the skies' name, so the port's top line never wraps)
    const sk = $('btn-skies'); sk.innerHTML = `<span>Skies: </span>${SKIES[d.skies].name}`; sk.setAttribute('aria-label', `Skies: ${SKIES[d.skies].name}`);
    $('port-shards').textContent = `◆ ${fmt(d.shards)}`;
    for (const b of shipsEl.children) {
      const id = b.dataset.ship, own = d.ships[id].owned;
      b.setAttribute('aria-pressed', String(id === viewing));
      b.querySelector('em').textContent = id === d.flying ? 'Sailing' : own ? 'Yours' : `◆ ${fmt(PRICES[id])}`;
    }
    $('pp-name').textContent = R.name; $('pp-cls').textContent = `${R.cls} · ${R.length} m · Guns: ${gunWords(st)}`;
    $('pp-blurb').textContent = st.blurb;
    const owned = cfg.owned;
    $('pp-buy').hidden = owned; $('pp-own').hidden = !owned; $('pp-tabs').hidden = !owned;
    panel.classList.toggle('buying', !owned); // (on a phone upright her panel is taller, so how she sails shows above the Buy button)
    if (!owned && panel.dataset.tab !== 'ship') tab('ship');
    // a ship you don't own: the big button buys her, and fills with gold as you earn towards her price
    const price = PRICES[viewing], short = !owned && d.shards < price, b = $('btn-buy');
    if (!owned) {
      b.firstElementChild.textContent = `Buy the ${R.name} · ◆ ${fmt(price)}`; b.disabled = short;
      b.style.setProperty('--got', `${Math.round(Math.min(1, d.shards / Math.max(1, price)) * 100)}%`);
    }
    $('pp-need').textContent = short ? `You have ◆ ${fmt(d.shards)}. Bring down raiders to earn the rest.` : '';
    const sail = $('btn-sail');
    sail.classList.toggle('alt', !owned); sail.textContent = owned ? `Set sail in the ${F.name}` : `or set sail in the ${F.name}`;
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
      row.querySelector('.pips').textContent = '●'.repeat(step) + '○'.repeat(STEPS - step);
      if (step >= STEPS) { b.textContent = 'Done'; b.disabled = true; }
      else { const cost = modCost(viewing, step); b.textContent = `◆ ${fmt(cost)}`; b.disabled = d.shards < cost; canBuy ||= owned && d.shards >= cost; }
    }
    $('pp-tab-upgrades').querySelector('.dot').hidden = !canBuy;
  }

  // the title (its sky is title.js's) or the port (her ship on the berth)
  function setMode(m) {
    mode = m;
    $('title').hidden = m !== 'title'; $('port').hidden = m !== 'port';
    if (m === 'port') show(viewing); else if (m === 'title') refresh();
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
  function resize() { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); remeasure(); }
  return { scene, camera, show, setMode, update, render, resize, refresh, setShadow, tab, get mode() { return mode; }, set mode(m) { mode = m; }, get spin() { return spin; } };
}
