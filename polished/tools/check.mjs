// check.mjs: opens the built pages in a headless browser the size of a laptop and of a phone, checks nothing went
// wrong, and takes pictures into shots/ (or the folder given).
//   the save          two devices sharing one save on claude.ai: the newest save always wins (no browser needed)
//   dist/hangar.html  every ship at every level of detail, with its triangle count kept near its budget
//   dist/game.html    the title screen and the port (buying a ship and an upgrade, crystal power, dragging the ship
//                     round); each of the four ships flown: how fast it goes, turns and climbs; every battery fired at a
//                     raider and hitting it; a raider shot down (high, and low) and its shards gathered; raiders
//                     fighting back; a captain leading wave 5; banking from the card between waves and setting sail
//                     again; a whole voyage played to the end; the save surviving a reload; the keyboard, mouse, wheel
//                     and touch controls answering; the drawing context lost and got back; pictures of the title, the
//                     port and a battle
// Run: node tools/build.mjs && node tools/check.mjs [--quick] [folder]
//   --quick: only the game page at laptop size (for checking during work; the full run is the one that counts)
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const quick = process.argv.includes('--quick');
const out = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? root + 'shots';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const problems = [];
const ships = ['skiff', 'cutter', 'brig', 'frigate'], fleet = [...ships, 'galleon', 'manowar'];
const BUDGET = { full: [80000, 125000], middle: [10000, 50000], far: [1000, 8000] };
const SIZES = { laptop: { viewport: { width: 1280, height: 800 } }, phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } };

async function open(file, name, ready) {
  const page = await browser.newPage(SIZES[name]);
  page.on('pageerror', (e) => problems.push(`${file} ${name}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`${file} ${name} console: ${m.text()}`); });
  await page.goto(`file://${root}dist/${file}.html`);
  await page.waitForFunction(ready, null, { timeout: 180000 });
  return page;
}
const shot = (page, path) => page.screenshot({ path: `${out}/${path}.png`, timeout: 120000 });
const wait = (page, fn, arg, what) => page.waitForFunction(fn, arg, { timeout: 60000, polling: 100 }).catch(() => problems.push(`${what}: didn't happen`));

// ---------- the save, on two devices ----------
// progress.js run twice in plain JS, as a laptop and a phone with their own storage, sharing one pretend claude.ai
// store: a tab left open must never write its old save over newer progress from the other device
{
  const src = readFileSync(root + 'src/game/progress.js', 'utf8').replace(/^export /gm, '');
  let store = null, clock = 1e12;
  const tick = () => new Promise((r) => setTimeout(r, 20));
  const subs = new Set(), snap = () => ({ exists: !!store, data: () => JSON.parse(JSON.stringify(store)), metadata: { hasPendingWrites: false } });
  const db = { doc: () => ({ get: async () => { await tick(); return snap(); }, set: async (d) => { await tick(); store = JSON.parse(JSON.stringify(d)); for (const f of subs) setTimeout(() => f(snap()), 5); },
    onSnapshot: (f) => { subs.add(f); setTimeout(() => f(snap()), 5); return () => subs.delete(f); } }) };
  // a device: the game opened in a browser with its own storage; opening it again closes the page that was open
  let open = [];
  const device = (ls, online = true) => {
    for (const f of open.filter((o) => o.ls === ls)) subs.delete(f.sub);
    open = open.filter((o) => o.ls !== ls);
    const mine = { doc: (p) => { const d = db.doc(p); return { ...d, onSnapshot: (f) => { open.push({ ls, sub: f }); return d.onSnapshot(f); } }; } };
    const ctx = vm.createContext({ localStorage: { getItem: (k) => ls.get(k) ?? null, setItem: (k, v) => ls.set(k, v) }, Date: { now: () => clock }, JSON, Object, Math, Promise, setTimeout,
      document: { hidden: false, addEventListener() {} } });
    ctx.window = online ? { claude: { use: async (n) => (n === 'db' ? mine : { id: async () => 'chris' }) } } : {};
    vm.runInContext(src + '\nthis.makeProgress = makeProgress;', ctx);
    return ctx.makeProgress();
  };
  const laptopLS = new Map(), phoneLS = new Map(), wait = (ms = 150) => new Promise((r) => setTimeout(r, ms)), got = (p) => `${p.data.shards}${p.data.ships.brig.owned ? '+brig' : ''}`;
  const sync = [];
  let laptop = device(laptopLS); await wait(); clock += 1000; laptop.data.shards = 1000; laptop.save(); await wait();
  // the phone buys the Brig and banks a voyage while the laptop's tab sits open; then a tap on the laptop saves
  clock += 3600e3; let phone = device(phoneLS); await wait();
  clock += 1000; phone.data.shards -= 900; phone.data.ships.brig.owned = true; phone.save(); await wait();
  clock += 1000; phone.data.shards += 700; phone.save(); await wait();
  clock += 3600e3; laptop.data.skies = 'mael'; laptop.save(); await wait();
  clock += 1000; phone = device(phoneLS); await wait();
  sync.push(['a tab left open', got(phone), '800+brig']);
  // a tap on the phone before it has heard from the store, which the laptop has moved on since
  clock += 1000; laptop.data.shards += 50; laptop.save(); await wait();
  clock += 86400e3; phone = device(phoneLS); phone.data.skies = 'fair'; phone.save(); await wait(250);
  sync.push(['a tap before the store answers', got(phone), '850+brig']);
  // played with no connection, then back online: nothing newer in the store, so it goes up
  clock += 1000; const off = device(phoneLS, false); off.data.shards += 5; off.save(); await wait(50);
  clock += 1000; phone = device(phoneLS); await wait(250);
  sync.push(['played offline, then online', `${got(phone)} / store ${store.shards}`, '855+brig / store 855']);
  // a phone whose clock is an hour slow still saves over what it has seen
  clock += 1000; laptop = device(laptopLS); await wait(); laptop.data.shards += 10; laptop.save(); await wait();
  const real = clock; clock -= 3600e3; phone.data.shards += 1; phone.save(); await wait(); clock = real;
  sync.push(['a phone with a slow clock', `store ${store.shards}`, 'store 866']);
  // and the laptop's open tab hears of it without reloading
  await wait(100);
  sync.push(['an open tab hears the other device', got(laptop), '866+brig']);
  for (const [what, was, want] of sync) if (was !== want) problems.push(`the save between two devices, ${what}: ${was}, should be ${want}`);
  console.log(`the save between two devices: ${sync.every(([, a, b]) => a === b) ? 'the newest save always wins' : 'WRONG'}`);
}

// ---------- the hangar ----------
for (const name of quick ? [] : ['laptop', 'phone']) {
  const page = await open('hangar', name, () => window.__hangar?.ready || !document.getElementById('error').hidden);
  if (name === 'laptop') {
    const table = await page.evaluate((ships) => ships.map((id) => [id, ...['full', 'middle', 'far'].map((l) => window.__hangar.stats(id, l))]), fleet);
    for (const [id, ...levels] of table) {
      console.log(id.padEnd(8), levels.map((s, i) => `${['full', 'middle', 'far'][i]} ${s.triangles.toLocaleString().padStart(7)} (${s.drawCalls} calls)`).join('  '));
      levels.forEach((s, i) => { const l = ['full', 'middle', 'far'][i], [a, b] = BUDGET[l]; if (s.triangles < a || s.triangles > b) problems.push(`${id} ${l}: ${s.triangles} triangles, outside ${a}-${b}`); });
    }
  }
  const shots = name === 'laptop'
    ? fleet.flatMap((id) => [[id, 'turn', 0.9, 0.28], [id, 'side', Math.PI / 2, 0.04]]).concat([['all', 'turn', 0.75, 0.32]])
    : [['brig', 'turn', 0.9, 0.3], ['skiff', 'turn', 0.9, 0.3], ['all', 'turn', 0.75, 0.32]];
  for (const [id, view, yaw, pitch] of shots) {
    await page.evaluate(([id, view, yaw, pitch]) => { window.__hangar.select(id); window.__hangar.view(view, yaw, pitch); }, [id, view, yaw, pitch]);
    await page.waitForTimeout(1200);
    await shot(page, `${name}-${id}-${view}`);
  }
  await page.close();
}

// ---------- the game ----------
const gameReady = () => window.__game?.ready || !document.getElementById('error').hidden;
// set up a fight near the Captain, run it for a while with the Captain firing at the nearest raider, then hold it
function battle(ids = ['frigate', 'cutter']) {
  const g = window.__game, P = g.player;
  g.raiders.clear(); P.repair(1); g.waves.timer = 1e9; g.raiders.setAI(true);
  const f = P.forward();
  ids.forEach((id, i) => g.raiders.spawn(id, P.pos.clone().addScaledVector(f, 260 + i * 90).add({ x: (i - 0.5) * 140, y: 10, z: 0 }), P.heading + (i ? 2.4 : -1.2), false, i === 0 && ids.length > 2));
  for (let k = 0; k < 40; k++) {
    const live = g.raiders.list.filter((r) => !r.f.down).sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
    if (live[0]) {
      const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = live[0].f.pos.clone().sub(T).normalize(), a = Math.atan2(look.x, look.z) - P.heading;
      g.cam.pitch = Math.max(-0.3, -Math.asin(look.y) + 0.08); g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
    }
    g.step(0.25, { fire: true, sail: 0 });
  }
  g.raiders.setAI(false);
}
const mode = (page) => page.evaluate(() => window.__game.mode);
{
  const page = await open('game', 'laptop', gameReady);
  // the title screen, then the port: choose skies, buy a ship and an upgrade, set the crystal power
  await page.evaluate(() => window.__game.progress.reset());
  if (await mode(page) !== 'title') problems.push('the game does not open on the title screen');
  await page.waitForTimeout(2000);
  await shot(page, 'laptop-title');
  // the ship on the title screen can be dragged round: presses on the open sky reach it, through the title screen
  const under = await page.evaluate(() => document.elementFromPoint(innerWidth * 0.72, innerHeight / 2)?.id);
  const spin0 = await page.evaluate(() => window.__game.port.spin);
  await page.mouse.move(920, 400); await page.mouse.down(); await page.mouse.move(1070, 400, { steps: 5 }); await page.mouse.up();
  const turned = (await page.evaluate(() => window.__game.port.spin)) - spin0;
  if (under !== 'stage' || turned < 0.8) problems.push(`dragging the ship on the title screen doesn't turn her (the press reaches "${under}", turned ${turned.toFixed(2)})`);
  await page.click('#skies [data-skies="mael"]'); await page.click('#skies [data-skies="cross"]');
  await page.click('#btn-to-port');
  if (await mode(page) !== 'port') problems.push('"To port" does not open the port');
  await page.click('#port-ships [data-ship="cutter"]');
  if (!(await page.isDisabled('#btn-buy'))) problems.push('the Cutter can be bought with no shards');
  await page.evaluate(() => { window.__game.progress.data.shards = 2000; window.__game.port.refresh(); });
  const hullBefore = await page.textContent('[data-stat="hull"] b');
  await page.click('#btn-buy');
  await page.click('.mod[data-mod="armour"] button');
  await page.$eval('#pp-power', (el) => { el.value = '2'; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });
  const portState = await page.evaluate(() => { const d = window.__game.progress.data; return { shards: d.shards, cutter: d.ships.cutter, flying: d.flying, note: document.getElementById('pp-power-note').textContent }; });
  const hullAfter = await page.textContent('[data-stat="hull"] b');
  console.log(`port: bought the Cutter and armour (◆ 2,000 → ◆ ${portState.shards}); hull ${hullBefore} → ${hullAfter}; power "${portState.note}"`);
  if (!portState.cutter.owned || portState.cutter.mods.armour !== 1 || portState.shards !== 2000 - 300 - 95 || portState.flying !== 'cutter') problems.push(`buying in port went wrong: ${JSON.stringify(portState)}`);
  if (hullAfter === hullBefore || portState.cutter.power !== 2) problems.push('upgrades and crystal power do not change the ship');
  await page.waitForTimeout(1500);
  await shot(page, 'laptop-port');
  if (await page.evaluate(() => document.elementFromPoint(innerWidth / 3, innerHeight / 2)?.id) !== 'stage') problems.push('in port, presses on the ship don\'t reach her');
  // the window changing size while the HUD is hidden (a phone turned in port), then setting sail: the corner map
  // still has a size and is drawn; the big map is drawn at its own size
  await page.setViewportSize({ width: 1200, height: 760 }); await page.waitForTimeout(300); await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(300);
  const map = await page.evaluate(() => {
    const g = window.__game, m = document.getElementById('minimap'); g.fly('brig'); g.waves.timer = 1e9; g.step(0.2, {});
    const small = m.width; m.click(); g.step(0.05, {}); const big = m.width; m.click(); g.step(0.05, {});
    return { small, shown: Math.round(m.clientWidth), big };
  });
  console.log(`corner map after a resize in port: ${map.small} px wide (shown ${map.shown}), big map ${map.big} px`);
  if (!map.small || map.big < map.small * 2) problems.push(`the corner map isn't drawn after the window changes size in port: ${JSON.stringify(map)}`);

  // Each ship flown on the game's own clock (software drawing is too slow to fly in real time), with no upgrades and
  // no wind: 20 seconds at full sail turning and climbing, then each battery fired at a raider of the same class
  // sitting 260 m off on its side.
  const flown = await page.evaluate((ships) => {
    const g = window.__game, res = [], PARTS = ['hull', 'sails', 'crystals'];
    g.progress.reset();
    const voyage = (id) => { g.fly(id); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); return g.player; };
    const aimAt = (P, tp) => {
      const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = tp.clone().sub(T).normalize(), a = Math.atan2(look.x, look.z) - P.heading;
      g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
    };
    const still = (P) => { P.speed = 3; P.sail = 0.05; P.vy = 0; P.turn = 0; P.climb = 0; };
    for (const id of ships) {
      const P = voyage(id);
      P.pos.set(0, 700, 6000); P.heading = 0; P.sail = 1; P.vy = 0; P.turn = 0; P.climb = 0;
      g.step(20, { sail: 1, turn: 1, climb: 1 });
      const r = { id, kmh: Math.round(P.speed * 3.6), turned: Math.round(Math.abs(P.heading) * 180 / Math.PI), climbed: Math.round(P.pos.y - 700), guns: {} };
      for (const [b, rel] of [['bow', 0], ['port', Math.PI / 2], ['starboard', -Math.PI / 2], ['stern', Math.PI]]) {
        const n = g.gunnery.count(b); if (!n) continue;
        g.raiders.clear(); P.pos.set(0, 900, 0); P.heading = 0.4; still(P);
        const dir = 0.4 + rel, tp = P.pos.clone().add({ x: Math.sin(dir) * 260, y: 6, z: Math.cos(dir) * 260 });
        const foe = g.raiders.spawn(id, tp, 1.0, true);
        aimAt(P, tp); g.step(0.05, { fire: false });
        const label = document.getElementById('battery-name').textContent, reach = document.getElementById('battery-count').textContent;
        const locked = g.locked === foe;
        aimAt(P, tp); g.step(6, { fire: true }); // three broadside volleys: a single one can spread wide
        r.guns[b] = { n, label, locked, reach, parts: PARTS.filter((k) => foe.f.health[k] < foe.f.full[k]) };
      }
      res.push(r);
    }
    // a raider brought down: one more shot to its hull, then it falls below the clouds, spilling its shards
    let P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P);
    const foe = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: 4, z: 240 }), 2, true); foe.f.health.hull = 10;
    const d0 = g.downed; aimAt(P, foe.f.pos); g.step(2, { fire: true });
    const why = foe.f.down?.why, spilled = g.pickups.list.length; g.step(18, {});
    const sinking = { why, counted: g.downed - d0, gone: !g.raiders.list.includes(foe), spilled };
    // the shards: fly through them and they're gathered
    g.pickups.spill(P.pos.clone().add({ x: 0, y: 0, z: 60 }), P.velocity, 100); const s0 = g.voyage.shards;
    g.step(4, { sail: 0.3 });
    const gathered = Math.round(g.voyage.shards - s0), score = document.getElementById('score');
    const popped = score.classList.contains('on') && getComputedStyle(score).animationName === 'shard-pop';
    // a raider brought down low, under the clouds: she still goes down (falling at least 150 m), not vanishing at once
    P.pos.set(0, 260, 0); still(P);
    const low = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: -10, z: 220 }), 2, true); low.f.hit('hull', 1e9);
    g.step(1 / 60, {});
    const lowSeen = g.raiders.list.includes(low), y0 = low.f.pos.y;
    let lowT = 0; while (lowT < 20 && g.raiders.list.includes(low)) { g.step(0.25, {}); lowT += 0.25; }
    const lowFall = { seen: lowSeen, fell: Math.round(y0 - low.f.pos.y), t: lowT };
    // the sun's shadows reach the ship (so her masts and sails shade her deck)
    g.sun.updateMatrixWorld(); g.sun.target.updateMatrixWorld(); g.sun.shadow.updateMatrices(g.sun);
    const sp = P.pos.clone().applyMatrix4(g.sun.shadow.matrix), shadowed = [sp.x, sp.y, sp.z].every((v) => v > 0 && v < 1);
    // detail: a raider far off uses the far model, a near one the middle
    const far = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 0, z: 2500 }), 0, true), near = g.raiders.spawn('brig', P.pos.clone().add({ x: 60, y: 0, z: 80 }), 0, true);
    g.step(0.05, {});
    const detail = { far: far.ship.level, near: near.ship.level };
    // the raiders fight: wave 3 (a Cutter) sent at a Captain who does nothing for a minute
    P = voyage('brig'); g.raiders.setAI(true); P.pos.set(0, 800, 3000); P.heading = Math.PI; P.sail = 0.5;
    Object.assign(g.waves, { n: 2, state: 'calm', timer: 0.1, next: null });
    g.step(60, {});
    const fight = { raiders: g.raiders.list.map((r) => r.id).join(' '), hurt: PARTS.filter((k) => P.health[k] < P.full[k]) };
    // a raider captain leads wave 5; wave 6 brings a treasure ship, wave 12 a Man-o'-war, wave 15 both a Man-o'-war
    // and a captain (who isn't the Man-o'-war)
    Object.assign(g.waves, { n: 4, state: 'calm', timer: 0.1, next: null }); g.raiders.clear(); g.step(0.2, {});
    const captain = g.raiders.list.filter((r) => r.captain).map((r) => `${r.id} (hull ${r.f.full.hull})`).join(' ');
    Object.assign(g.waves, { n: 5, state: 'calm', timer: 0.1, next: null }); g.raiders.clear(); g.step(0.2, {});
    const wave6 = g.raiders.list.map((r) => r.id + (r.role === 'prize' ? ' (treasure)' : '')).join(' ');
    Object.assign(g.waves, { n: 11, state: 'calm', timer: 0.1, next: null }); g.raiders.clear(); g.step(0.2, {});
    const wave12 = g.raiders.list.map((r) => r.id).join(' ');
    Object.assign(g.waves, { n: 14, state: 'calm', timer: 0.1, next: null }); g.raiders.clear(); g.step(0.2, {});
    const wave15 = g.raiders.list.map((r) => r.id + (r.captain ? ' (captain)' : '')).join(' ');
    // a treasure ship: shoot her sails and she strikes her colours; let her run far enough and she gets away
    g.raiders.clear(); g.waves.timer = 1e9; still(P); P.pos.set(0, 900, 0); P.heading = 0;
    const prize = g.raiders.spawn('galleon', P.pos.clone().add({ x: 0, y: 6, z: 380 }), Math.PI / 2, true);
    let t = 0;
    while (t < 90 && !prize.f.down) { aimAt(P, prize.f.pos.clone().add({ x: 0, y: 12, z: 0 })); g.step(0.5, { fire: true }); t += 0.5; }
    const struck = { why: prize.f.down?.why, t, sails: Math.round(prize.f.health.sails) };
    g.raiders.clear(); g.raiders.setAI(true);
    const runner = g.raiders.spawn('galleon', P.pos.clone().add({ x: 0, y: 0, z: 3400 }), 0);
    runner.fleeing = true; g.step(15, {});
    const away = { gone: !g.raiders.list.includes(runner), escaped: !!runner.escaped };
    g.raiders.setAI(false); g.raiders.clear();
    const tagsLeft = document.getElementById('tags').children.length; // a raider's tag goes with her
    g.endVoyage(0);
    return { res, sinking, gathered, popped, lowFall, shadowed, tagsLeft, detail, fight, captain, wave6, wave12, wave15, struck, away };
  }, ships);
  const NAMES = { bow: 'Bow guns', port: 'Port broadside', starboard: 'Starboard broadside', stern: 'Stern guns' };
  for (const r of flown.res) {
    console.log(`${r.id.padEnd(8)} ${String(r.kmh).padStart(3)} km/h, turned ${String(r.turned).padStart(3)}° and climbed ${String(r.climbed).padStart(3)} m in 20 s;`,
      Object.entries(r.guns).map(([b, x]) => `${b} ${x.n} ${x.parts.length ? 'hit ' + x.parts.join('+') : 'MISSED'}`).join(', '));
    if (r.kmh < 60 || r.turned < 90 || r.climbed < 100) problems.push(`${r.id}: flies badly (${r.kmh} km/h, ${r.turned}°, ${r.climbed} m)`);
    for (const [b, x] of Object.entries(r.guns)) {
      if (!x.parts.length) problems.push(`${r.id}: ${b} guns missed a raider 260 m away`);
      if (x.label !== NAMES[b]) problems.push(`${r.id}: looking ${b} picked "${x.label}"`);
      if (!x.locked || x.reach === 'out of reach') problems.push(`${r.id}: ${b} guns didn't lock on to a raider in reach`);
    }
  }
  const { sinking, gathered, popped, lowFall, shadowed, tagsLeft, detail, fight, captain, wave6, wave12, wave15, struck, away } = flown;
  console.log(`a raider downed low: ${lowFall.seen ? `fell ${lowFall.fell} m in ${lowFall.t} s` : 'VANISHED AT ONCE'}; the shard counter ${popped ? 'pops' : 'DOES NOT POP'}; sun shadows ${shadowed ? 'reach' : 'MISS'} the ship`);
  if (!lowFall.seen || lowFall.fell < 140) problems.push(`a raider brought down low should fall before she goes: ${JSON.stringify(lowFall)}`);
  if (!popped) problems.push('gathering shards doesn\'t make the shard counter pop');
  if (!shadowed) problems.push('the sun\'s shadows don\'t reach the Captain\'s ship');
  if (tagsLeft) problems.push(`${tagsLeft} raider tags left on screen with no raiders`);
  console.log(`raider shot down: ${sinking.why}, counted ${sinking.counted}, spilled ${sinking.spilled} shards, ${sinking.gone ? 'gone below the clouds' : 'STILL THERE'}; gathered ◆ ${gathered} of 100 flown through`);
  console.log(`detail far ${detail.far}, near ${detail.near}; raiders fighting a Captain doing nothing for a minute (${fight.raiders || 'none left'}): hurt ${fight.hurt.join('+') || 'NOTHING'}; wave 5 captain: ${captain || 'NONE'}`);
  if (sinking.why !== 'hull' || sinking.counted !== 1 || !sinking.gone || !sinking.spilled) problems.push(`a raider shot down didn't go down properly: ${JSON.stringify(sinking)}`);
  if (gathered < 99) problems.push(`flying through shards gathered only ${gathered} of 100`);
  if (detail.far !== 'far' || detail.near !== 'middle') problems.push(`raider detail levels wrong: ${JSON.stringify(detail)}`);
  if (!fight.hurt.length) problems.push('the raiders never hurt the Captain in a minute');
  if (!captain.startsWith('brig')) problems.push(`wave 5 should be led by a Brig captain: ${captain}`);
  console.log(`wave 6: ${wave6}; wave 12: ${wave12}; wave 15: ${wave15}`);
  console.log(`a treasure ship shot in her sails: ${struck.why ? `strikes her colours after ${struck.t} s` : 'DID NOT STRIKE'}; one running far: ${away.escaped ? 'got away' : 'STILL THERE'}`);
  if (!wave6.includes('galleon (treasure)')) problems.push(`wave 6 should bring a treasure ship: ${wave6}`);
  if (!wave12.includes('manowar')) problems.push(`wave 12 should bring a Man-o'-war: ${wave12}`);
  if (!wave15.includes('manowar') || wave15.includes('manowar (captain)') || !wave15.includes('(captain)')) problems.push(`wave 15 should have a Man-o'-war and a captain who isn't it: ${wave15}`);
  if (struck.why !== 'struck') problems.push(`a treasure ship shot in her sails didn't strike: ${JSON.stringify(struck)}`);
  if (!away.gone || !away.escaped) problems.push(`a treasure ship running far didn't get away: ${JSON.stringify(away)}`);

  // between waves, back to port and out again, the way a player moves up: look at the Cutter in port (too dear), sail
  // the Skiff, beat wave 4 (the card shows a raider captain's Brig coming next, built while the card is up), bank the
  // shards, buy the Cutter and sail her. The new voyage starts again at wave 1, one Skiff, and the Skiff isn't left
  // hanging in the sky
  const again = await page.evaluate(() => {
    const g = window.__game, out = {}, $ = (id) => document.getElementById(id);
    g.progress.reset(); g.port.setMode('port');
    document.querySelector('#port-ships [data-ship="cutter"]').click(); $('btn-sail').click();
    out.first = g.player.ship.recipe.id;
    delete g.raiders.templates['brig:captain'];
    g.raiders.clear(); Object.assign(g.waves, { n: 3, state: 'fight', next: null }); g.step(0.1, {});
    out.card = !$('calm').hidden && $('calm-line').textContent.includes('raider captain');
    out.prepared = !!g.raiders.templates['brig:captain'];
    $('btn-go-port').click();
    out.port = g.mode === 'port';
    g.progress.data.shards += 1000; g.port.refresh(); $('btn-buy').click(); $('btn-sail').click();
    out.second = g.player.ship.recipe.id;
    g.wind.strength = 0; g.step(5.5, {});
    out.wave1 = g.raiders.list.map((r) => r.id + (r.captain ? ' (captain)' : '')).join(' ');
    out.banner = $('banner-title').textContent;
    const names = [...document.querySelectorAll('#port-ships button b')].map((b) => b.textContent);
    out.ships = g.scene.children.filter((o) => names.includes(o.name)).map((o) => o.name).join(' ');
    g.endVoyage(0);
    return out;
  });
  console.log(`banked from the card after wave 4 (a captain prepared: ${again.prepared}), sailed again in the ${again.second}: wave 1 is "${again.wave1}" (${again.banner}); ships in the sky: ${again.ships}`);
  if (again.first !== 'skiff' || !again.card || !again.port || again.second !== 'cutter') problems.push(`going back to port from the card between waves went wrong: ${JSON.stringify(again)}`);
  if (again.wave1 !== 'skiff' || again.banner !== 'Raiders, wave 1') problems.push(`after banking from the card, the next voyage's wave 1 should be one Skiff, got "${again.wave1}" (${again.banner})`);
  if (!again.prepared) problems.push('a raider captain\'s ship isn\'t built while the card before her wave is up');
  if (again.ships !== 'Gale') problems.push(`the voyage sky should hold only the Captain's ship, it holds: ${again.ships}`);

  // a whole voyage, played: set sail from port, beat wave 1, sail on, then sink and get home with half
  const voyage = await page.evaluate(async () => {
    const g = window.__game, out = {};
    g.progress.reset(); g.port.setMode('port');
    document.getElementById('btn-sail').click();
    const P = g.player; g.wind.strength = 0;
    out.sailed = g.mode === 'voyage' && P.ship.recipe.id === 'skiff';
    let t = 0;
    while (t < 200 && g.waves.state !== 'choose') {
      const live = g.raiders.list.filter((r) => !r.f.down);
      if (live.length && !out.raiders) out.raiders = g.raiders.list.map((r) => r.id).join(' '); // wave 1, as it came
      let c = { sailTo: 0.6 };
      if (live[0]) {
        const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2; const look = live[0].f.pos.clone().sub(T).normalize();
        g.cam.pitch = Math.max(-0.35, -Math.asin(look.y)); const a = Math.atan2(look.x, look.z) - P.heading; g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
        c = { fire: true, turn: Math.max(-1, Math.min(1, -g.cam.yaw * 2)), climb: Math.max(-1, Math.min(1, (live[0].f.pos.y - P.pos.y) / 40)) };
      }
      g.step(0.25, c); t += 0.25;
    }
    out.wave1 = Math.round(t); out.choose = !document.getElementById('calm').hidden; out.shards = Math.round(g.voyage.shards);
    document.getElementById('btn-sail-on').click(); g.step(5, {});
    out.wave2 = g.waves.state === 'fight' && g.waves.n === 1;
    P.hit('hull', 1e6); g.step(6, {});
    out.sunk = !document.getElementById('paused').hidden && document.getElementById('paused-title').textContent.includes('went down');
    const before = g.progress.data.shards; out.half = Math.round(g.voyage.shards / 2);
    document.getElementById('btn-abandon').click();
    out.home = g.mode === 'port'; out.banked = g.progress.data.shards - before;
    return out;
  });
  console.log(`voyage: wave 1 (${voyage.raiders}) beaten in ${voyage.wave1} s (◆ ${voyage.shards}), sailed on, sank, home with ◆ ${voyage.banked}`);
  if (voyage.raiders !== 'skiff') problems.push(`a voyage's wave 1 should be one Skiff, got: ${voyage.raiders}`);
  if (!voyage.sailed || !voyage.choose || !voyage.shards || !voyage.wave2 || !voyage.sunk || !voyage.home || Math.abs(voyage.banked - voyage.half) > 1) problems.push(`a voyage went wrong: ${JSON.stringify(voyage)}`);
  // the save survives a reload
  await page.evaluate(() => { const d = window.__game.progress.data; d.shards = 1234; window.__game.progress.save(); });
  await page.reload();
  await page.waitForFunction(gameReady, null, { timeout: 180000 });
  const kept = await page.evaluate(() => window.__game.progress.data.shards);
  if (kept !== 1234) problems.push(`the save didn't survive a reload (${kept})`);

  // the real keys and mouse, at sea in the Brig
  await page.evaluate(() => { const g = window.__game; g.fly('brig'); g.waves.timer = 1e9; g.raiders.setAI(false); g.cam.yaw = 0; });
  const s0 = await page.evaluate(() => window.__game.player.sail);
  await page.keyboard.down('w'); await page.keyboard.down('d');
  await wait(page, (s0) => window.__game.player.sail > s0 + 0.01 && window.__game.player.turn > 0.02, s0, 'W and D set more sail and turn');
  await page.keyboard.up('d'); await page.keyboard.up('w');
  await page.keyboard.press('r');
  await wait(page, () => window.__game.player.surge.on > 0, null, 'R surges');
  await page.mouse.move(640, 300); await page.mouse.down(); await page.mouse.move(760, 330, { steps: 6 }); await page.mouse.up();
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.1, null, 'dragging the mouse swings the camera');
  // the wheel: a trackpad's flick (many small nudges) moves the camera a little; a mouse's notch about one step
  const frames = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  await page.evaluate(() => { window.__game.cam.zoom = 1; }); await frames();
  for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 3);
  await frames(); const flick = await page.evaluate(() => window.__game.cam.zoom);
  await page.evaluate(() => { window.__game.cam.zoom = 1; }); await frames();
  await page.mouse.wheel(0, 100); await frames(); const notch = await page.evaluate(() => window.__game.cam.zoom);
  console.log(`wheel: a trackpad flick zooms ×${flick.toFixed(2)}, a mouse notch ×${notch.toFixed(2)}`);
  if (flick < 1.02 || flick > 1.2 || notch < 1.08 || notch > 1.16) problems.push(`the wheel zooms wrongly: a trackpad flick ×${flick.toFixed(2)}, a mouse notch ×${notch.toFixed(2)}`);
  await page.evaluate(() => { window.__game.cam.zoom = 1; });
  const reloaded = () => page.evaluate(() => { const g = window.__game; for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0; g.bolts.bolts.length = 0; g.cam.yaw = 0.15; g.cam.pitch = 0.12; });
  await page.mouse.click(640, 300);
  await wait(page, () => /\b(locked|nolock)\b/.test(document.body.className), null, 'a click locks the mouse to the view (or the page says to drag instead)');
  console.log(`mouse: ${await page.evaluate(() => document.body.classList.contains('locked') ? 'locked to the view' : 'drag to aim')}`);
  await reloaded(); await page.mouse.down();
  await wait(page, () => window.__game.bolts.bolts.length > 0, null, 'left click fires');
  await page.mouse.up(); await page.keyboard.press('Escape');
  await reloaded(); await page.keyboard.down('f');
  await wait(page, () => window.__game.bolts.bolts.length > 0, null, 'F fires');
  await page.keyboard.up('f');
  await page.keyboard.press('p');
  await wait(page, () => window.__game.paused && !document.getElementById('paused').hidden, null, 'P pauses');
  await page.click('#btn-resume');
  if (await page.evaluate(() => window.__game.paused)) problems.push('Resume does not resume');
  // a battle to look at: a raider captain's Frigate and two Cutters against the Brig
  await page.evaluate(battle, ['frigate', 'cutter', 'cutter']);
  await page.waitForTimeout(2500);
  await shot(page, 'laptop-battle');
  // the drawing context lost and given back (a phone does this after a long time in the background): the voyage
  // pauses, and the sky's light and the cloud pattern are drawn again, as cloudy as ever
  const clouds = () => page.evaluate(() => {
    const g = window.__game, T = g.world.clouds.target, n = T.width, px = new Uint8Array(n * n * 2); let sum = 0;
    g.renderer.readRenderTargetPixels(T, 0, 0, n, n, px); for (let i = 0; i < n * n; i++) sum += (px[i * 2] * 256 + px[i * 2 + 1]) / 65535;
    return +(sum / (n * n)).toFixed(3);
  });
  const cloudy = await clouds();
  const lost = await page.evaluate(async () => {
    const g = window.__game, gl = g.renderer.getContext(), ext = gl.getExtension('WEBGL_lose_context'), c = g.renderer.domElement;
    const event = (name) => new Promise((r, no) => { c.addEventListener(name, r, { once: true }); setTimeout(() => no(new Error(`no ${name} event`)), 60000); });
    const was = event('webglcontextlost'); ext.loseContext(); await was;
    const paused = g.paused;
    await new Promise((r) => setTimeout(r, 300)); // (the browser allows it back only once the lost event is over)
    const back = event('webglcontextrestored'); ext.restoreContext(); await back;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const env = g.scene.environment, tex = (t) => !!g.renderer.properties.get(t).__webglTexture;
    return { paused, sky: tex(env) && g.port.scene.environment === env, clouds: tex(g.world.clouds.texture) };
  }).catch((e) => ({ error: e.message }));
  const cloudyAfter = await clouds();
  console.log(`drawing context lost: ${lost.paused ? 'paused' : 'NOT PAUSED'}; given back: sky light ${lost.sky ? 'back' : 'GONE'}, clouds ${lost.clouds ? 'back' : 'GONE'} (the cloud pattern's mean ${cloudy} → ${cloudyAfter})`);
  if (!lost.paused || !lost.sky || !lost.clouds || Math.abs(cloudy - cloudyAfter) > 0.002 || cloudy < 0.47 || cloudy > 0.5) problems.push(`losing the drawing context went wrong: ${JSON.stringify({ ...lost, cloudy, cloudyAfter })}`);
  await page.close();
}
if (!quick) {
  const page = await open('game', 'phone', gameReady);
  await page.evaluate(() => window.__game.progress.reset());
  const start = await page.evaluate(() => ({ touch: document.body.classList.contains('touch') }));
  if (!start.touch) problems.push('phone: the touch controls are not showing');
  await page.waitForTimeout(2500); // let the loading cover fade
  await shot(page, 'phone-title');
  await page.tap('#btn-to-port');
  await page.evaluate(() => { window.__game.progress.data.shards = 500; window.__game.port.refresh(); });
  await page.tap('#port-ships [data-ship="cutter"]');
  await page.waitForTimeout(1500);
  await shot(page, 'phone-port');
  await page.tap('#port-ships [data-ship="skiff"]');
  await page.tap('#btn-sail');
  if (await mode(page) !== 'voyage') problems.push('phone: "Set sail" does not set sail');
  await page.evaluate(() => { const g = window.__game; g.waves.timer = 1e9; g.raiders.setAI(false); });
  // a thumb held on the left and pushed right steers; one held on Sail + sets sail; one on Fire fires; Surge surges
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, ...pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) });
  await touch('touchStart', [80, 560]); await touch('touchMove', [110, 560]); await touch('touchMove', [140, 560]);
  await wait(page, () => window.__game.player.turn > 0.05, null, 'the stick steers');
  await touch('touchEnd');
  const box = async (sel) => { const b = await page.locator(sel).boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
  const s0 = await page.evaluate(() => window.__game.player.sail);
  await touch('touchStart', await box('#btn-sail-up'));
  await wait(page, (s0) => window.__game.player.sail > s0 + 0.01, s0, 'Sail + sets more sail');
  await touch('touchEnd');
  await touch('touchStart', [300, 300]); await touch('touchMove', [260, 300]); await touch('touchMove', [220, 300]);
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.1, null, 'dragging on the right aims');
  // a thumb resting on the right, still, keeps the view where it's aimed (it doesn't swing back behind the ship)
  await page.evaluate(() => { window.__game.cam.yaw = 1; });
  await page.waitForTimeout(6000);
  const rested = await page.evaluate(() => window.__game.cam.yaw);
  if (rested < 0.98) problems.push(`phone: the view swings back while a thumb rests on the aiming side (${rested.toFixed(2)} of 1)`);
  await touch('touchEnd');
  // moving the aiming thumb while paused: nothing of it lands on Resume
  await page.evaluate(() => { window.__game.cam.yaw = 0; });
  await touch('touchStart', [300, 400]); await page.evaluate(() => window.__game.pause(true));
  await touch('touchMove', [200, 400]); await touch('touchMove', [100, 400]);
  await page.evaluate(() => window.__game.pause(false)); await page.waitForTimeout(1500);
  const jumped = await page.evaluate(() => Math.abs(window.__game.cam.yaw));
  if (jumped > 0.05) problems.push(`phone: a drag while paused swings the camera on Resume (${jumped.toFixed(2)})`);
  await touch('touchEnd');
  await page.evaluate(() => { const g = window.__game; g.cam.yaw = 0; g.bolts.clear(); for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0; });
  await touch('touchStart', await box('#btn-fire'));
  await wait(page, () => window.__game.bolts.bolts.length > 0, null, 'Fire fires');
  // and sliding the thumb off Fire aims while it keeps firing
  const [fx, fy] = await box('#btn-fire');
  await touch('touchMove', [fx - 40, fy]); await touch('touchMove', [fx - 90, fy - 10]);
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.15 && document.getElementById('btn-fire').classList.contains('on'), null, 'sliding the thumb off Fire aims while firing');
  const slid = await page.evaluate(() => window.__game.cam.yaw);
  await touch('touchEnd');
  console.log(`phone: a resting thumb keeps the view (${rested.toFixed(2)} of 1); a drag while paused moves it ${jumped.toFixed(2)}; sliding off Fire aims ${slid.toFixed(2)} while firing`);
  await touch('touchStart', await box('#btn-surge')); await touch('touchEnd');
  await wait(page, () => window.__game.player.surge.on > 0, null, 'Surge surges');
  await page.evaluate(battle, ['cutter', 'skiff']);
  await page.waitForTimeout(2500);
  await shot(page, 'phone-battle');
  await page.close();
}

await browser.close();
if (problems.length) { console.log('PROBLEMS:\n' + [...new Set(problems)].join('\n')); process.exit(1); }
console.log(quick ? 'all good (quick)' : 'all good');
