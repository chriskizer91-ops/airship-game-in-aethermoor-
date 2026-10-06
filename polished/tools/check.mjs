// check.mjs: opens the built pages in a headless browser the size of a laptop and of a phone, checks nothing went
// wrong, and takes pictures into shots/ (or the folder given).
//   the save          two devices sharing one save on claude.ai: the newest save always wins, and no voyage's shards are
//                     lost, even when a write fails or a tab stops hearing the store (no browser needed)
//   dist/hangar.html  every ship at every level of detail, with its triangle count kept near its budget
//   dist/game.html    the title screen and the port (buying a ship and an upgrade, crystal power, dragging the ship
//                     round); each of the four ships flown: how fast it goes, turns and climbs; every battery fired at a
//                     raider and hitting it; a raider shot down (high, and low) and its shards gathered; raiders
//                     fighting back; a captain leading wave 5; banking from the card between waves and setting sail
//                     again; a whole voyage played to the end; the save surviving a reload; the keyboard, mouse, wheel
//                     and touch controls answering; the drawing context lost and got back; pictures of the title, the
//                     port and a battle
//                     how a fight feels: every piece of news told (events.js); a broadside rippling bow to stern with
//                     its gunsmoke, the ship heeling and the view kicking back (less for reduced motion); hits marked
//                     on the crosshair in the part's colour and a kill's ring; a hit on you shaking the view, its
//                     red arc pointing at the shooter and naming her; a near miss told once; a raider's ports glowing
//                     before her broadside; a raider shot down mid-broadside firing no more; a Man-o'-war's four
//                     batteries all rippling at once; comet tails; a busy fight with two raiders downed in it fitting
//                     its sparks' and smoke's budgets, and a step's cost; back to port from the pause menu ending the
//                     pause; on the phone, smaller budgets, a buzz for a hit and a kill, and none for a ship that gives up
//                     wrecks worth watching: debris matching the part hit, with room for a 60-shot barrage; a raider
//                     blown apart in a chain of blasts, her crystals going dark, through the cloud deck; her bounty
//                     rising; a treasure ship striking without a blast, and sinking through the clouds (and a raider
//                     whose crystals die); the holes in the clouds closed for the next voyage; the shard count
//                     counting up; masts falling on a laptop, and going only under the clouds; slow motion for a
//                     wave's last raider and the card waiting for it before it rises; the Surge's streaks, wider view,
//                     vapour and flare, and its view the same at 20 frames a second as at 60; on the phone, a
//                     Man-o'-war going down beside two other wrecks within every budget
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
// store: a tab left open must never write its old save over newer progress from the other device, and shards won on a
// voyage must never be lost, even when a write fails or a tab stops hearing the store
{
  const src = readFileSync(root + 'src/game/progress.js', 'utf8').replace(/^export /gm, '');
  let store = null, clock = 1e12, fail = 0; // `fail`: how many of the next writes fail, as when the link blinks
  const tick = () => new Promise((r) => setTimeout(r, 20));
  const subs = new Set(), snap = () => ({ exists: !!store, data: () => JSON.parse(JSON.stringify(store)), metadata: { hasPendingWrites: false } });
  const db = { doc: () => ({ get: async () => { await tick(); return snap(); },
    set: async (d) => { await tick(); if (fail > 0) { fail--; throw { code: 'unavailable', message: 'the link blinked' }; } store = JSON.parse(JSON.stringify(d)); for (const f of subs) setTimeout(() => f(snap()), 5); },
    onSnapshot: (f) => { subs.add(f); setTimeout(() => f(snap()), 5); return () => subs.delete(f); } }) };
  // a device: the game opened in a browser with its own storage; opening it again closes the page that was open there
  // (a closed page hears and sends nothing). `dead`: how many of its streams die at once, as one does when the link to
  // the store stops answering. Its pauses run 20 times faster than a real page's
  const pages = [], never = new Promise(() => {});
  const shut = (ls) => { for (const p of pages) if (p.ls === ls && !p.closed) { p.closed = true; for (const f of p.subs) subs.delete(f); } };
  const device = (ls, { online = true, dead = 0 } = {}) => {
    shut(ls);
    const page = { ls, closed: false, subs: [] }; pages.push(page);
    const mine = { doc: (path) => { const d = db.doc(path); return {
      get: () => (page.closed ? never : d.get()), set: (v) => (page.closed ? never : d.set(v)),
      onSnapshot: (f, err) => {
        if (page.closed) return () => {};
        if (dead-- > 0) { setTimeout(() => err({ code: 'unavailable', message: 'the stream died' }), 5); return () => {}; }
        page.subs.push(f); return d.onSnapshot(f);
      } }; } };
    const ctx = vm.createContext({ localStorage: { getItem: (k) => ls.get(k) ?? null, setItem: (k, v) => ls.set(k, v) }, Date: { now: () => clock }, JSON, Object, Math, Promise,
      setTimeout: (f, ms) => setTimeout(() => { if (!page.closed) f(); }, ms / 20), document: { hidden: false, addEventListener() {} } });
    ctx.window = online ? { claude: { use: async (n) => (n === 'db' ? mine : { id: async () => 'chris' }) } } : {};
    vm.runInContext(src + '\nthis.makeProgress = makeProgress;', ctx);
    return ctx.makeProgress();
  };
  const laptopLS = new Map(), phoneLS = new Map(), wait = (ms = 150) => new Promise((r) => setTimeout(r, ms)), got = (p) => `${p.data.shards}${p.data.ships.brig.owned ? '+brig' : ''}`;
  const all = () => `${got(laptop)} / ${got(phone)} / store ${store.shards}`;
  const sync = [];
  let laptop = device(laptopLS); await wait(); clock += 1000; laptop.data.shards = 1000; laptop.save(); await wait();
  // the phone buys the Brig and banks a voyage while the laptop's tab sits open; then a tap on the laptop saves
  clock += 3600e3; let phone = device(phoneLS); await wait();
  clock += 1000; phone.data.shards -= 900; phone.data.ships.brig.owned = true; phone.save(); await wait();
  clock += 1000; phone.bank(700, 4); await wait();
  clock += 3600e3; laptop.data.skies = 'mael'; laptop.save(); await wait();
  clock += 1000; phone = device(phoneLS); await wait();
  sync.push(['a tab left open', got(phone), '800+brig']);
  // a tap on the phone before it has heard from the store, which the laptop has moved on since the phone was closed
  shut(phoneLS); clock += 1000; laptop.data.shards += 50; laptop.save(); await wait();
  clock += 86400e3; phone = device(phoneLS); phone.data.skies = 'fair'; phone.save(); await wait(250);
  sync.push(['a tap before the store answers', `${got(phone)} ${phone.data.skies}`, '850+brig mael']);
  // played with no connection, then back online: nothing newer in the store, so it goes up
  clock += 1000; let off = device(phoneLS, { online: false }); off.data.shards += 5; off.save(); await wait(50);
  clock += 1000; phone = device(phoneLS); await wait(250);
  sync.push(['played offline, then online', `${got(phone)} / store ${store.shards}`, '855+brig / store 855']);
  // a phone whose clock is an hour slow still saves over what it has seen
  clock += 1000; laptop = device(laptopLS); await wait(); laptop.data.shards += 10; laptop.save(); await wait();
  const real = clock; clock -= 3600e3; phone.data.shards += 1; phone.save(); await wait(); clock = real;
  sync.push(['a phone with a slow clock', `store ${store.shards}`, 'store 866']);
  // and the laptop's open tab hears of it without reloading
  await wait(100);
  sync.push(['an open tab hears the other device', got(laptop), '866+brig']);
  // a voyage banked as the link blinks: the write fails, and goes again a moment later
  clock += 1000; fail = 1; laptop.bank(100, 3); await wait(300);
  sync.push(['a write that failed once', all(), '966+brig / 966+brig / store 966']);
  // it fails again too, and the phone saves not having heard of it: the laptop hears the phone and adds its voyage on
  clock += 1000; fail = 2; laptop.bank(100, 5); await wait(300);
  clock += 1000; phone.data.skies = 'fair'; phone.save(); await wait(300);
  sync.push(['a write that failed twice', `${all()}, best ${laptop.data.best.mael} ${phone.data.best.mael}, ${laptop.data.skies}`, '1066+brig / 1066+brig / store 1066, best 5 5, fair']);
  // a tab whose stream died: the phone buys an upgrade the laptop never hears of, then the laptop banks a voyage
  clock += 1000; laptop = device(laptopLS, { dead: 99 }); await wait();
  clock += 1000; phone.data.shards -= 140; phone.data.ships.brig.mods.armour = 1; phone.save(); await wait();
  const deaf = got(laptop);
  clock += 1000; laptop.bank(500, 2); await wait(300);
  sync.push(['a tab whose stream died', `${deaf}, then ${all()}, armour ${laptop.data.ships.brig.mods.armour}`, '1066+brig, then 1426+brig / 1426+brig / store 1426, armour 1']);
  // a stream that dies once is opened again, and hears the other device; this tab had progress of its own, so says so
  const told = { open: [], fresh: [] };
  clock += 1000; laptop = device(laptopLS, { dead: 1 }); laptop.onLoad((d, had) => told.open.push(had)); await wait(400);
  clock += 1000; phone.data.shards -= 26; phone.save(); await wait();
  sync.push(['a stream that died and came back', `${got(laptop)}, told ${told.open[0]}`, '1400+brig, told true']);
  // both devices bank a voyage at the very same moment: neither is lost
  clock += 1000; laptop.bank(300, 1); clock += 1; phone.bank(200, 1); await wait(400);
  sync.push(['two voyages banked at once', all(), '1900+brig / 1900+brig / store 1900']);
  // a voyage played with no connection while the laptop buys an upgrade: back online, the phone keeps both
  clock += 1000; off = device(phoneLS, { online: false }); off.bank(70, 6); await wait(50);
  clock += 1000; laptop.data.shards -= 100; laptop.data.ships.brig.mods.drill = 1; laptop.save(); await wait();
  clock += 1000; phone = device(phoneLS); await wait(300);
  sync.push(['a voyage played offline', `${all()}, drill ${phone.data.ships.brig.mods.drill}, best ${phone.data.best.fair}`, '1870+brig / 1870+brig / store 1870, drill 1, best 6']);
  // a new browser (or one with its site data cleared) takes the save without being told it came from another device
  const fresh = device(new Map()); fresh.onLoad((d, had) => told.fresh.push(had)); await wait();
  sync.push(['a new browser', `${got(fresh)}, told ${told.fresh.join(' ')}`, '1870+brig, told false']);
  for (const [what, was, want] of sync) if (was !== want) problems.push(`the save between two devices, ${what}: ${was}, should be ${want}`);
  console.log(`the save between two devices: ${sync.every(([, a, b]) => a === b) ? 'the newest save always wins, and no voyage is lost' : 'WRONG'}`);
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
  // every piece of the game's news must be told somewhere as these checks play: count them (the page reloads once, so
  // they're counted before it and again after)
  const told = new Set(), countEvents = () => page.evaluate(() => {
    window.__told = {};
    for (const k in window.__game.events.PAYLOAD) window.__game.events.on(k, () => { window.__told[k] = (window.__told[k] ?? 0) + 1; });
  });
  const collect = async () => { for (const k of await page.evaluate(() => Object.keys(window.__told))) told.add(k); };
  await countEvents();
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
    // the marks on the crosshair: what each hit was, and the mark's colour for it
    const HIT_COLOUR = { hull: '#e2bd67', sails: '#ecdcb8', crystals: '#ff9f45', kill: '#ff4636' }, hits = [];
    const mark = document.getElementById('hitmark'), playing = (id) => document.getAnimations().some((a) => a.effect?.target?.id === id);
    g.events.on('hit', (e) => { if (e.target === 'raider') hits.push(e.part); });
    const marked = () => ({ playing: playing('hitmark'), part: mark.dataset.part, right: mark.getAttribute('stroke') === HIT_COLOUR[mark.dataset.part] && hits.includes(mark.dataset.part) });
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
        hits.length = 0;
        aimAt(P, tp); g.step(6, { fire: true }); // three broadside volleys: a single one can spread wide
        r.guns[b] = { n, label, locked, reach, parts: PARTS.filter((k) => foe.f.health[k] < foe.f.full[k]), mark: marked() };
      }
      res.push(r);
    }
    // a raider Brig brought down: one more shot to her hull (its splinters fly), then she blows apart: a chain of
    // blasts, her crystals going dark, her bounty rising from the wreck; she falls through the cloud deck and is gone
    // below it, spilling her shards
    let P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P);
    const foe = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 4, z: 240 }), 2, true); foe.f.health.hull = 10;
    let clock = 0, downAt = -1;
    const wreck = { blasts: [], deck: -1, gone: -1, splinters: 0 };
    const offW = [g.events.on('blast', () => wreck.blasts.push(clock)), g.events.on('wreck:deck', () => { wreck.deck = clock; }),
      g.events.on('hit', (e) => { if (e.target === 'raider' && e.part === 'hull') wreck.splinters = Math.max(wreck.splinters, g.fx.stats().debris.wood); })];
    const d0 = g.downed; aimAt(P, foe.f.pos);
    while (clock < 2 && downAt < 0) { g.step(1 / 60, { fire: true }); clock += 1 / 60; if (foe.f.down) downAt = clock; }
    const killMark = { ring: playing('killring'), x: mark.dataset.part };
    g.step(1 / 60, {}); clock += 1 / 60; // (her end is told the moment after)
    const why = foe.f.down?.why, spilled = g.pickups.list.length;
    const label = [...document.querySelectorAll('.bounty')].find((b) => !b.hidden && +b.style.opacity > 0);
    const bounty = { text: label?.textContent ?? '', worth: Math.round(g.pickups.list.reduce((a, s) => a + s.value, 0)).toLocaleString('en') };
    while (clock < downAt + 2) { g.step(1 / 60, {}); clock += 1 / 60; }
    wreck.dark = foe.ship.parts.glows.every((x) => !x.visible);
    while (clock < downAt + 3) { g.step(1 / 60, {}); clock += 1 / 60; }
    bounty.after = [...document.querySelectorAll('.bounty')].filter((b) => !b.hidden).length;
    while (clock < downAt + 18 && g.raiders.list.includes(foe)) { g.step(0.25, {}); clock += 0.25; }
    wreck.gone = g.raiders.list.includes(foe) ? -1 : clock; offW.forEach((f) => f());
    wreck.early = wreck.blasts.filter((t) => t <= downAt + 3).length;
    g.step(2, {});
    const sinking = { why, counted: g.downed - d0, gone: !g.raiders.list.includes(foe), spilled };
    // shots on a raider Brig's crystals (60 m below and 260 m ahead, the guns aimed at the middle of her crystals) are
    // marked in the crystals' colour
    P.pos.set(0, 900, 0); P.heading = 0; still(P); g.raiders.clear();
    const gems = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: -60, z: 260 }), 1.0, true), box = gems.zones.crystals[1] ?? gems.zones.crystals[0];
    const gc = box.getCenter(gems.f.pos.clone()), gat = gc.clone(); gems.f.aimAt = () => gat.copy(gc).applyMatrix4(gems.ship.body.matrixWorld);
    for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
    let shards = 0; const offC = g.events.on('hit', (e) => { if (e.part === 'crystals') shards = Math.max(shards, g.fx.stats().debris.crystal); });
    hits.length = 0; aimAt(P, gems.f.aimAt()); g.step(3, { fire: true }); offC();
    const crystalMark = { ...marked(), hits: hits.join(' '), shards };
    g.raiders.clear();
    // the shards: fly through them and they're gathered; the count in the corner pops gold and counts up to them
    g.pickups.spill(P.pos.clone().add({ x: 0, y: 0, z: 60 }), P.velocity, 100); const s0 = g.voyage.shards;
    const shown = () => +document.getElementById('voyage-n').textContent.replace(/,/g, '');
    let first = null;
    for (let k = 0; k < 240 && !first; k++) { g.step(1 / 60, { sail: 0.3 }); if (g.voyage.shards > s0) first = { shown: shown(), held: g.voyage.shards }; }
    g.step(4, { sail: 0.3 });
    const gathered = Math.round(g.voyage.shards - s0), score = document.getElementById('score');
    const popped = document.getAnimations().some((a) => a.effect?.target === score);
    const counted = { first, end: shown(), held: Math.round(g.voyage.shards) };
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
    let t = 0, canvas = 0; const offS = g.events.on('hit', (e) => { if (e.part === 'sails') canvas = Math.max(canvas, g.fx.stats().debris.canvas); });
    while (t < 90 && !prize.f.down) { aimAt(P, prize.f.pos.clone().add({ x: 0, y: 12, z: 0 })); g.step(0.5, { fire: true }); t += 0.5; }
    offS();
    // she gives up without blowing up: no blasts, and her pennants come down
    let gaveUp = 0; const offB = g.events.on('blast', () => gaveUp++); g.step(3, {}); offB();
    const struck = { why: prize.f.down?.why, t, sails: Math.round(prize.f.health.sails), canvas, blasts: gaveUp, flags: prize.ship.parts.flags.every((m) => !m.visible) };
    // then she settles away, faster and faster, through the cloud deck (tearing it) before she's gone, from 906 m; so does
    // a raider Brig whose crystals die at 740 m. (When each crossed the deck and was gone, in seconds since she went down)
    const through = (r, t0) => {
      let s = t0, deck = -1; const off = g.events.on('wreck:deck', () => { if (deck < 0) deck = s; });
      while (s < 45 && g.raiders.list.includes(r)) { g.step(0.25, {}); s += 0.25; }
      off(); return { deck, gone: g.raiders.list.includes(r) ? -1 : s };
    };
    struck.sank = through(prize, 3);
    g.raiders.clear();
    const dead = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: -160, z: 300 }), 0, true); g.step(0.1, {}); dead.f.hit('crystals', 1e9);
    const crystalsDead = { why: dead.f.down?.why, ...through(dead, 0) };
    g.raiders.clear(); g.raiders.setAI(true);
    const runner = g.raiders.spawn('galleon', P.pos.clone().add({ x: 0, y: 0, z: 3400 }), 0);
    runner.fleeing = true; g.step(15, {});
    const away = { gone: !g.raiders.list.includes(runner), escaped: !!runner.escaped };
    g.raiders.setAI(false); g.raiders.clear();
    const tagsLeft = document.getElementById('tags').children.length; // a raider's tag goes with her
    // a hole torn in the clouds just before going back to port is closed for the next voyage
    g.world.tear(P.pos.x, P.pos.z, 120); g.step(0.5, {});
    const holes = { open: +Math.max(...g.world.holes.map((h) => h.w)).toFixed(2) };
    g.endVoyage(0); g.fly('brig'); g.waves.timer = 1e9; g.step(1 / 60, {});
    holes.next = +Math.max(...g.world.holes.map((h) => h.w)).toFixed(2);
    g.endVoyage(0);
    return { res, sinking, gathered, popped, counted, lowFall, shadowed, tagsLeft, detail, fight, captain, wave6, wave12, wave15, struck, crystalsDead, away, killMark, crystalMark, wreck, bounty, holes };
  }, ships);
  const NAMES = { bow: 'Bow guns', port: 'Port broadside', starboard: 'Starboard broadside', stern: 'Stern guns' };
  for (const r of flown.res) {
    console.log(`${r.id.padEnd(8)} ${String(r.kmh).padStart(3)} km/h, turned ${String(r.turned).padStart(3)}° and climbed ${String(r.climbed).padStart(3)} m in 20 s;`,
      Object.entries(r.guns).map(([b, x]) => `${b} ${x.n} ${x.parts.length ? 'hit ' + x.parts.join('+') : 'MISSED'}`).join(', '));
    if (r.kmh < 60 || r.turned < 90 || r.climbed < 100) problems.push(`${r.id}: flies badly (${r.kmh} km/h, ${r.turned}°, ${r.climbed} m)`);
    for (const [b, x] of Object.entries(r.guns)) {
      if (!x.parts.length) problems.push(`${r.id}: ${b} guns missed a raider 260 m away`);
      if (!x.mark.playing || !x.mark.right) problems.push(`${r.id}: ${b} guns' hits aren't marked on the crosshair in the part's colour: ${JSON.stringify(x.mark)}`);
      if (x.label !== NAMES[b]) problems.push(`${r.id}: looking ${b} picked "${x.label}"`);
      if (!x.locked || x.reach === 'out of reach') problems.push(`${r.id}: ${b} guns didn't lock on to a raider in reach`);
    }
  }
  const { sinking, gathered, popped, counted, lowFall, shadowed, tagsLeft, detail, fight, captain, wave6, wave12, wave15, struck, crystalsDead, away, killMark, crystalMark, wreck, bounty, holes } = flown;
  console.log(`hit marks: every battery's hits marked in the part's colour; a kill ${killMark.ring && killMark.x === 'kill' ? 'rings red' : 'DOES NOT RING'}; shots on a raider's crystals marked "${crystalMark.part}" (hits: ${crystalMark.hits})`);
  if (!killMark.ring || killMark.x !== 'kill') problems.push(`the shot that brings a raider down isn't marked with the red kill ring: ${JSON.stringify(killMark)}`);
  if (!crystalMark.playing || crystalMark.part !== 'crystals' || !crystalMark.right) problems.push(`shots on a raider's crystals aren't marked in the crystals' colour: ${JSON.stringify(crystalMark)}`);
  console.log(`a raider downed low: ${lowFall.seen ? `fell ${lowFall.fell} m in ${lowFall.t} s` : 'VANISHED AT ONCE'}; the shard counter ${popped ? 'pops' : 'DOES NOT POP'}; sun shadows ${shadowed ? 'reach' : 'MISS'} the ship`);
  if (!lowFall.seen || lowFall.fell < 140) problems.push(`a raider brought down low should fall before she goes: ${JSON.stringify(lowFall)}`);
  if (!popped) problems.push('gathering shards doesn\'t make the shard counter pop');
  console.log(`the shard count counts up: ${counted.first ? `${counted.first.shown} shown as ${Math.round(counted.first.held)} came in` : 'NOTHING CAME IN'}, then ${counted.end} of ${counted.held}`);
  if (!counted.first || counted.first.shown >= counted.first.held || counted.end !== counted.held) problems.push(`the shard count should count up to what's in the hold: ${JSON.stringify(counted)}`);
  if (!shadowed) problems.push('the sun\'s shadows don\'t reach the Captain\'s ship');
  if (tagsLeft) problems.push(`${tagsLeft} raider tags left on screen with no raiders`);
  console.log(`raider shot down: ${sinking.why}, counted ${sinking.counted}, spilled ${sinking.spilled} shards, ${sinking.gone ? 'gone below the clouds' : 'STILL THERE'}; gathered ◆ ${gathered} of 100 flown through`);
  console.log(`detail far ${detail.far}, near ${detail.near}; raiders fighting a Captain doing nothing for a minute (${fight.raiders || 'none left'}): hurt ${fight.hurt.join('+') || 'NOTHING'}; wave 5 captain: ${captain || 'NONE'}`);
  if (sinking.why !== 'hull' || sinking.counted !== 1 || !sinking.gone || !sinking.spilled) problems.push(`a raider shot down didn't go down properly: ${JSON.stringify(sinking)}`);
  console.log(`her wreck: ${wreck.early} blasts in 3 s, crystals ${wreck.dark ? 'dark' : 'STILL LIT'} by 2 s, through the cloud deck at ${wreck.deck.toFixed(1)} s, gone at ${wreck.gone.toFixed(1)} s; her hull hit threw ${wreck.splinters} splinters; her bounty "${bounty.text}" (◆ ${bounty.worth} spilled), ${bounty.after} showing 3 s later`);
  if (wreck.early < 3) problems.push(`a raider Brig blown apart should go up in at least 3 blasts within 3 s: ${JSON.stringify(wreck)}`);
  if (!wreck.dark) problems.push('a raider blown apart should have her crystals dark within 2 s');
  if (wreck.deck < 0 || wreck.gone < 0 || wreck.deck > wreck.gone) problems.push(`a wreck should fall through the cloud deck before she's gone: ${JSON.stringify(wreck)}`);
  if (!wreck.splinters) problems.push('a shot in a raider\'s hull should throw splinters of wood');
  if (!bounty.text.includes(bounty.worth) || bounty.after) problems.push(`a raider's bounty should rise from her wreck, showing the shards she spilled, and be gone 3 s later: ${JSON.stringify(bounty)}`);
  console.log(`debris: a crystal hit throws ${crystalMark.shards} shards; a treasure ship's sails shed ${struck.canvas} scraps of canvas; striking her colours: ${struck.blasts} blasts, pennants ${struck.flags ? 'down' : 'STILL UP'}`);
  if (!crystalMark.shards) problems.push('a shot in a raider\'s crystals should throw crystal shards');
  if (!struck.canvas) problems.push('shots in a treasure ship\'s sails should tear off scraps of canvas');
  if (struck.blasts || !struck.flags) problems.push(`a treasure ship striking her colours shouldn't blow up, and her pennants should come down: ${JSON.stringify(struck)}`);
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
  console.log(`wrecks sinking: a struck treasure ship from 906 m through the cloud deck at ${struck.sank.deck} s, gone at ${struck.sank.gone} s; a raider whose crystals died at 740 m (${crystalsDead.why}) through at ${crystalsDead.deck} s, gone at ${crystalsDead.gone} s`);
  for (const [what, x, most] of [['a struck treasure ship from 906 m', struck.sank, 16], ['a raider whose crystals died at 740 m', crystalsDead, 14]]) {
    if (x.deck < 0 || x.gone < 0 || x.deck > x.gone || x.deck > most) problems.push(`${what} should sink through the cloud deck within ${most} s, before she's gone: ${JSON.stringify(x)}`);
  }
  if (crystalsDead.why !== 'crystals') problems.push(`a raider whose crystals were shot away should sink with them dead: ${crystalsDead.why}`);
  console.log(`a hole torn in the clouds (open ${holes.open}) before going back to port: ${holes.next ? `STILL OPEN (${holes.next})` : 'closed'} on the next voyage`);
  if (!(holes.open > 0.5) || holes.next !== 0) problems.push(`the holes torn in the cloud deck should be closed when a new voyage starts: ${JSON.stringify(holes)}`);
  if (!away.gone || !away.escaped) problems.push(`a treasure ship running far didn't get away: ${JSON.stringify(away)}`);

  // ---------- how a fight feels (fx.js, events.js) ----------
  // a broadside fired once into empty sky by the Frigate (port side): how far the view kicks back, at its most
  const volley = () => page.evaluate(() => {
    const g = window.__game, P = g.player, FX = g.fx;
    P.pos.set(0, 900, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0; P.turn = 0; P.climb = 0; P.heel = P.heelV = 0;
    g.step(0.1, {}); g.bolts.clear(); FX.clear();
    for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
    g.cam.yaw = Math.PI / 2; g.cam.pitch = 0.05;
    let peak = 0;
    g.step(1 / 60, { fire: true });
    for (let t = 0; t < 0.6; t += 1 / 60) { g.step(1 / 60, {}); peak = Math.max(peak, FX.cam.back); }
    return peak;
  });
  const feel = await page.evaluate(() => {
    const g = window.__game, out = {}, E = g.events, FX = g.fx;
    g.progress.reset();
    const voyage = (id) => { g.fly(id); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); return g.player; };
    const still = (P) => { P.speed = 3; P.sail = 0.05; P.vy = 0; P.turn = 0; P.climb = 0; };
    // a rippling broadside: the Frigate's port side once into empty sky. One shot at once, all ten by 0.7 s, bow first,
    // a puff of gunsmoke from each port, the view kicked back and settled within a second, the ship heeled to starboard
    let P = voyage('frigate'); P.pos.set(0, 900, 0); P.heading = 0; still(P); g.step(0.1, {});
    g.bolts.clear(); FX.clear(); for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
    g.cam.yaw = Math.PI / 2; g.cam.pitch = 0.05;
    const fired = [], off = E.on('fire', (e) => { if (e.owner === 'player') fired.push(e.p.clone().sub(P.pos).dot(P.forward())); });
    const puffs0 = FX.stats().puffs;
    g.step(1 / 60, { fire: true });
    const first = g.bolts.bolts.length;
    let back = 0, heel = 0;
    for (let t = 0; t < 0.3; t += 1 / 60) { g.step(1 / 60, {}); back = Math.max(back, FX.cam.back); heel = Math.max(heel, P.heel); }
    for (let t = 0; t < 0.4; t += 1 / 60) { g.step(1 / 60, {}); heel = Math.max(heel, P.heel); }
    const a = g.bolts.mesh.instanceMatrix.array;
    out.ripple = { first, all: g.bolts.bolts.length, bowFirst: fired.length === 10 && fired[0] > fired[9] + 15, puffs: FX.stats().puffs - puffs0, back: +back.toFixed(2), heel: +heel.toFixed(3),
      tail: +Math.hypot(a[8], a[9], a[10]).toFixed(1) };
    g.step(0.3, {}); out.ripple.settled = +FX.cam.back.toFixed(3);
    off();
    // a raider's shot into the Captain's hull shakes the view; one that takes the hull below 30% is told
    let shook = -1, low = '';
    const offs = [E.on('hit', (e) => { if (e.target === 'player') shook = FX.cam.trauma; }), E.on('player:low', (e) => { low = e.part; })];
    const shoot = (dx, weight = 1) => { const at = P.aimAt().clone(), from = at.clone().add({ x: dx, y: 0, z: 0 }); g.bolts.fire(from, at.clone().sub(from).normalize(), 'broadside', 'raider', null, weight); };
    P.repair(1); FX.clear(); g.cam.yaw = 0; g.cam.pitch = 0.2; g.step(0.05, {});
    shoot(120); g.step(0.6, {});
    out.shake = { trauma: +shook.toFixed(2) };
    // (a heavy shot from close by: between waves the crew patch her up as the shot flies)
    P.health.hull = P.full.hull * 0.33; shoot(30, 4); g.step(0.3, {});
    out.shake.low = low;
    offs.forEach((f) => f());
    // a raider's shot passing 10 m beside her: one near miss, no harm done
    P.repair(1); let nears = 0; const offN = E.on('nearMiss', () => nears++); const h0 = JSON.stringify(P.health);
    const from = P.aimAt().clone().add({ x: 10, y: 0, z: 300 }); g.bolts.fire(from, P.forward().negate(), 'chaser', 'raider', null, 1);
    g.step(2, {}); offN();
    out.near = { told: nears, harmed: JSON.stringify(P.health) !== h0 };
    // a raider Frigate 300 m off the side of a still Captain readies her broadside, her ports glowing, at least 0.45 s
    // before her first shot; when it lands, the red arc on the screen points at her
    P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P); P.full.hull = P.health.hull = 1e6; g.cam.yaw = 0; g.cam.pitch = 0.2;
    const rf = g.raiders.spawn('frigate', P.pos.clone().add({ x: 300, y: 0, z: 0 }), Math.PI, false); g.raiders.setAI(true);
    let t = 0, chargedAt = -1, boltAt = -1, shooter = null, named = null;
    // (where she is on the screen, as each of her shots lands: the arc is drawn in the same moment; and the hit names her)
    const offH = E.on('hit', (e) => { if (e.target === 'player') { const c = rf.f.pos.clone().applyMatrix4(g.camera.matrixWorldInverse); shooter = Math.atan2(c.x, c.y); named = e.raider === rf; } });
    while (t < 40 && !(shooter !== null && boltAt >= 0)) {
      g.step(0.05, {}); t += 0.05;
      if (chargedAt < 0 && rf.charge.b) chargedAt = t;
      if (boltAt < 0 && g.bolts.bolts.some((b) => b.owner === 'raider')) boltAt = t;
    }
    const arc = shooter === null ? null : { shooter, arc: g.lastArc };
    offH(); g.raiders.setAI(false);
    const playing = document.getAnimations().some((x) => x.effect?.target?.parentElement?.id === 'incoming');
    out.warn = { chargedAt: +chargedAt.toFixed(2), boltAt: +boltAt.toFixed(2) };
    if (arc) { const d = Math.abs(Math.atan2(Math.sin(arc.arc - arc.shooter), Math.cos(arc.arc - arc.shooter))); out.arc = { off: Math.round(d * 180 / Math.PI), playing, named }; }
    // a raider brought down in the middle of her broadside fires no more: a raider Frigate fires both sides, and is
    // brought down 0 to 5 frames later (one of her waiting guns comes due in one of them); not one more goes off
    let fromWreck = 0, waited = 0;
    for (let extra = 0; extra <= 5; extra++) {
      g.raiders.clear(); g.bolts.clear();
      const r = g.raiders.spawn('frigate', P.pos.clone().add({ x: 300, y: 0, z: 0 }), Math.PI, false); g.step(1 / 60, {});
      let down = false; const offD = E.on('fire', (e) => { if (e.owner === 'raider' && down) fromWreck++; });
      r.gun.fire('port', P.pos, g.bolts, 'raider', r.f.velocity); r.gun.fire('starboard', P.pos, g.bolts, 'raider', r.f.velocity);
      for (let k = 0; k < extra; k++) g.step(1 / 60, {});
      waited = Math.max(waited, r.gun.pending); r.f.hit('hull', 1e9); down = true;
      g.step(1, {}); offD();
    }
    out.stopped = { fromWreck, waited };
    // a Man-o'-war firing all four batteries at once (two decks of twelve a side, and her chasers): every gun still waits
    // its turn, so only a few go off together, and every one of them fires
    g.raiders.clear(); g.bolts.clear();
    const mw = g.raiders.spawn('manowar', P.pos.clone().add({ x: 0, y: 0, z: 500 }), Math.PI / 2, false); g.step(1 / 60, {});
    let frame = 0; const per = new Map(), offM = E.on('fire', (e) => { if (e.owner === 'raider') per.set(frame, (per.get(frame) ?? 0) + 1); });
    for (const b of ['port', 'starboard', 'bow', 'stern']) mw.gun.fire(b, P.pos, g.bolts, 'raider', mw.f.velocity);
    const waiting = mw.gun.pending;
    for (; frame < 60; ) { frame++; g.step(1 / 60, {}); }
    offM();
    out.big = { guns: Object.values(mw.gun.B).reduce((n, l) => n + l.length, 0), waiting, together: Math.max(...per.values()), fired: [...per.values()].reduce((a, b) => a + b, 0) };
    g.raiders.clear(); g.bolts.clear();
    // a busy fight: a Frigate against a raider Frigate, Brig and Cutter for 15 s, firing all the while, the Cutter blown
    // apart 5 s in and the Brig 10 s in (their wrecks' blasts, fire and smoke in the thick of it). The sparks and smoke
    // never need more room than they have, and a step of the game stays quick (the middle of 15 one-second timings)
    P = voyage('frigate'); P.pos.set(0, 900, 0); P.heading = 0; P.full.hull = P.health.hull = 1e6; P.full.crystals = P.health.crystals = 1e6;
    const f = P.forward();
    const foes = ['frigate', 'brig', 'cutter'].map((id, i) => g.raiders.spawn(id, P.pos.clone().addScaledVector(f, 260 + i * 90).add({ x: (i - 1) * 140, y: 10, z: 0 }), P.heading + (i ? 2.4 : -1.2), false));
    g.raiders.setAI(true); FX.clear(); FX.resetStats();
    const times = []; let most = 0;
    for (let s = 0; s < 15; s++) {
      if (s === 5) foes[2].f.hit('hull', 1e9);
      if (s === 10) foes[1].f.hit('hull', 1e9);
      const t0 = performance.now();
      for (let k = 0; k < 4; k++) {
        const live = g.raiders.list.filter((r) => !r.f.down).sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
        if (live[0]) {
          const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
          const look = live[0].f.pos.clone().sub(T).normalize(), a2 = Math.atan2(look.x, look.z) - P.heading;
          g.cam.pitch = Math.max(-0.3, -Math.asin(look.y) + 0.08); g.cam.yaw = Math.atan2(Math.sin(a2), Math.cos(a2));
        }
        g.step(0.25, { fire: true, sail: 0 });
        most = Math.max(most, FX.stats().sparks);
      }
      times.push((performance.now() - t0) / 60);
    }
    times.sort((x, y) => x - y);
    const st = FX.stats();
    out.fight = { peak: st.peak, most, cap: st.sparkCap, dropped: st.dropped, puffs: st.puffs, puffsDropped: st.puffsDropped, ms: +times[7].toFixed(2), downed: g.downed };
    // a raider brought down: her blast throws at least 90 sparks at once
    g.raiders.setAI(false); g.raiders.clear(); FX.clear();
    const k1 = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: 0, z: 300 }), 0, true); k1.f.hit('hull', 1e9); g.step(1 / 60, {});
    out.fight.blast = FX.stats().sparks;
    // a barrage of 60 shots in a second into a raider Frigate's hull, sails and crystals (a big broadside's worth): the
    // debris never needs more room than its batches have (not one piece cut short), and it has all fallen away 4 s later
    g.raiders.clear(); P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P); FX.clear(); FX.resetStats();
    const tgt = g.raiders.spawn('frigate', P.pos.clone().add({ x: 0, y: 0, z: 200 }), Math.PI / 2, true);
    for (const k of ['hull', 'sails', 'crystals']) tgt.f.full[k] = tgt.f.health[k] = 1e9;
    g.step(1 / 60, {});
    const boxes = [tgt.zones.hullBox, ...tgt.zones.sails, ...tgt.zones.crystals].filter((b) => !b.isEmpty()), heaps = { wood: 0, canvas: 0, crystal: 0 };
    const track = () => { const d = FX.stats().debris; for (const k in heaps) heaps[k] = Math.max(heaps[k], d[k]); };
    for (let i = 0; i < 60; i++) {
      const b = boxes[i % boxes.length], c = P.pos.clone().set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2).applyMatrix4(tgt.ship.body.matrixWorld);
      const dir = c.clone().sub(P.pos).normalize();
      g.bolts.fire(c.clone().addScaledVector(dir, -40), dir, 'broadside', 'player', null, 1);
      if (i % 6 === 5) { g.step(0.1, {}); track(); }
    }
    for (let k = 0; k < 10; k++) { g.step(0.05, {}); track(); }
    const sd = FX.stats().debris;
    out.barrage = { most: heaps, caps: sd.caps, cut: sd.cut, tossed: sd.tossed, hits: ['hull', 'sails', 'crystals'].filter((k) => tgt.f.health[k] < 1e9).join('+') };
    g.step(4, {}); const left = FX.stats().debris; out.barrage.left = left.wood + left.canvas + left.crystal;
    // a Surge: half a second in, streaks of wind rush past and the view is over 9 degrees wider; 4 s later they're gone
    // and the view is back (within half a degree), and her vapour trails made smoke while it lasted
    g.raiders.clear(); P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; P.sail = 1; P.speed = P.H.vmax * 0.8; FX.clear(); g.step(1, { sail: 1 });
    const fov0 = g.camera.fov, puffs1 = FX.stats().puffs;
    g.step(1 / 60, { sail: 1, pressed: new Set(['r']) }); g.step(0.5, { sail: 1 });
    out.surge = { on: P.surge.on > 0, streaks: g.surge.streaks.visible, wider: +(g.camera.fov - fov0).toFixed(1), smoke: FX.stats().puffs - puffs1, flare: +P.ship.glow.material.uniforms.uBoost.value.toFixed(2) };
    g.step(4, { sail: 1 });
    Object.assign(out.surge, { after: g.surge.streaks.visible, back: +Math.abs(g.camera.fov - fov0).toFixed(2), flareAfter: +P.ship.glow.material.uniforms.uBoost.value.toFixed(2) });
    // on a laptop, a raider Frigate blown apart 150 m off at 900 m: her three masts crack and topple, her canvas all
    // going with them, and each one goes only once it's all under the cloud deck (or shrinks away, kept too long), never
    // vanishing in the open sky. (Each one's top, as it was last seen a 20th of a second before it went)
    g.raiders.clear(); P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P); FX.clear();
    const mf = g.raiders.spawn('frigate', P.pos.clone().add({ x: 40, y: 0, z: 150 }), Math.PI / 2, true); g.step(0.1, {});
    mf.f.hit('hull', 1e9); g.step(2.5, {});
    out.masts = { level: mf.ship.level, falling: g.wrecks.falling(), canvas: mf.ship.parts.meshes.canvas.geometry.index?.count ?? -1, deck: g.world.deck.position.y };
    const lastSeen = new Map(); let mt = 2.5;
    while (mt < 16 && g.wrecks.falling().length) { for (const m of g.wrecks.falling()) lastSeen.set(m.i, m); g.step(0.05, {}); mt += 0.05; }
    Object.assign(out.masts, { left: g.wrecks.falling().length, t: +mt.toFixed(1), went: [...lastSeen.values()].map((m) => ({ top: +(m.y + m.H).toFixed(1), s: m.s })) });
    // paused, then back to port from the pause menu: the pause is told as ended, before the voyage's end
    g.raiders.clear();
    const told = [], offP = [E.on('pause', (e) => told.push(`pause ${e.on}`)), E.on('voyage:end', () => told.push('voyage:end'))];
    g.pause(true); document.getElementById('btn-abandon').click(); offP.forEach((x) => x());
    out.leave = { told: told.join(', '), paused: g.paused, mode: g.mode };
    return out;
  });
  const { ripple, shake, near, warn, arc, stopped, big, fight: busy, barrage, surge, masts, leave } = feel;
  console.log(`a Frigate's broadside: ${ripple.first} shot at once, ${ripple.all} by 0.7 s, ${ripple.bowFirst ? 'bow first' : 'NOT BOW FIRST'}, ${ripple.puffs} puffs of gunsmoke, tails ${ripple.tail} m; the view kicked back ${ripple.back} m (${ripple.settled} m after 1 s), the ship heeled ${ripple.heel}`);
  if (ripple.first > 2 || ripple.all !== 10 || !ripple.bowFirst) problems.push(`a broadside should ripple bow to stern, one shot at once and all ten by 0.7 s: ${JSON.stringify(ripple)}`);
  if (ripple.puffs < 8) problems.push(`a broadside should puff gunsmoke from each port: ${ripple.puffs} puffs`);
  if (ripple.tail < 20) problems.push(`a broadside bolt's tail should be at least 20 m long: ${ripple.tail}`);
  if (ripple.back <= 0.5 || ripple.settled >= 0.02) problems.push(`the view should kick back over half a metre with a broadside and settle within a second: ${ripple.back} m, then ${ripple.settled} m`);
  if (ripple.heel <= 0.005) problems.push(`a port broadside should heel the ship to starboard: ${ripple.heel}`);
  console.log(`a raider's shot in the hull shakes the view (trauma ${shake.trauma}); the hull dropping below 30% is told (${shake.low || 'NOT TOLD'}); a shot passing 10 m off: ${near.told} near miss, ${near.harmed ? 'HARMED' : 'no harm'}`);
  if (shake.trauma <= 0.3) problems.push(`a raider's shot in the hull should shake the view (trauma over 0.3): ${shake.trauma}`);
  if (shake.low !== 'hull') problems.push('the hull dropping below 30% isn\'t told (player:low)');
  if (near.told !== 1 || near.harmed) problems.push(`a raider's shot passing 10 m off should be one near miss and do no harm: ${JSON.stringify(near)}`);
  console.log(`a raider Frigate's ports glow from ${warn.chargedAt} s, her first shot at ${warn.boltAt} s; her hit's red arc points ${arc ? `${arc.off}° off her, and the hit ${arc.named ? 'names her' : 'DOESN\'T NAME HER'}` : 'NOWHERE'}`);
  if (warn.chargedAt < 0 || warn.boltAt < 0 || warn.boltAt - warn.chargedAt < 0.45) problems.push(`a raider's ports should glow at least 0.45 s before her broadside: ${JSON.stringify(warn)}`);
  if (!arc || arc.off > 30 || !arc.playing) problems.push(`a hit on the Captain should show a red arc pointing to the shooter: ${JSON.stringify(arc)}`);
  if (arc && !arc.named) problems.push('a raider\'s hit on the Captain should name the raider that fired it (hit.raider)');
  console.log(`a raider Frigate downed mid-broadside (${stopped.waited} guns waiting): ${stopped.fromWreck} more fired; a Man-o'-war's four batteries at once: ${big.waiting} of ${big.guns} guns wait their turn, at most ${big.together} go off together, ${big.fired} fire`);
  if (stopped.fromWreck || !stopped.waited) problems.push(`a raider brought down mid-broadside shouldn't fire another gun: ${JSON.stringify(stopped)}`);
  if (big.fired !== big.guns || big.together > 6 || big.waiting < big.guns - 6) problems.push(`a Man-o'-war's four batteries fired at once should all ripple, a few guns at a time: ${JSON.stringify(big)}`);
  console.log(`a busy fight (3 raiders, 15 s): at most ${busy.most} sparks of ${busy.cap} (${busy.dropped} cut short), ${busy.puffs} puffs (${busy.puffsDropped} cut short), ${busy.ms} ms a step, ${busy.downed} downed; a raider's blast: ${busy.blast} sparks`);
  if (busy.downed < 2) problems.push(`two raiders should go down in the busy fight (their wrecks count against the budgets): ${busy.downed} did`);
  if (busy.dropped || busy.most > busy.cap || busy.puffsDropped) problems.push(`a busy fight's sparks or smoke ran out of room: ${JSON.stringify(busy)}`);
  if (busy.ms >= 1) problems.push(`a step of a busy fight takes ${busy.ms} ms (should be under 1)`);
  if (busy.blast < 90) problems.push(`a raider's blast should throw at least 90 sparks: ${busy.blast}`);
  console.log(`a 60-shot barrage (hit ${barrage.hits}): at most ${barrage.most.wood} splinters, ${barrage.most.canvas} scraps and ${barrage.most.crystal} shards (room for ${barrage.caps.wood}, ${barrage.caps.canvas} and ${barrage.caps.crystal}; cut short ${barrage.cut.wood}, ${barrage.cut.canvas} and ${barrage.cut.crystal}), ${barrage.left} left 4 s later`);
  if (['wood', 'canvas', 'crystal'].some((k) => barrage.cut[k] > 0 || !barrage.most[k]) || barrage.left) problems.push(`a barrage's debris should show every kind, all fit its batches (none cut short), and fall away within 4 s: ${JSON.stringify(barrage)}`);
  console.log(`a Surge, 0.5 s in: streaks ${surge.streaks ? 'showing' : 'MISSING'}, the view ${surge.wider}° wider, ${surge.smoke} puffs of vapour, crystals at ${surge.flare}x; 4 s later: streaks ${surge.after ? 'STILL SHOWING' : 'gone'}, the view ${surge.back}° off, crystals at ${surge.flareAfter}x`);
  if (!surge.on || !surge.streaks || surge.wider <= 9 || surge.smoke <= 0 || surge.flare < 1.5) problems.push(`a Surge should show streaks, widen the view over 9 degrees, trail vapour and flare the crystals: ${JSON.stringify(surge)}`);
  if (surge.after || surge.back > 0.5 || surge.flareAfter > 1.05) problems.push(`after a Surge the streaks should go and the view and crystals come back: ${JSON.stringify(surge)}`);
  console.log(`a raider Frigate blown apart 150 m off (${masts.level}): 2.5 s later ${masts.falling.length} masts falling (tops come down ${masts.falling.map((m) => m.fell + ' m').join(', ')}), her canvas left on her: ${masts.canvas}; all gone ${masts.t} s after, last seen with their tops at ${masts.went.map((m) => m.top + ' m' + (m.s < 1 ? ` (shrunk to ${m.s})` : '')).join(', ')} (the clouds at ${masts.deck} m)`);
  if (masts.falling.length !== 3 || masts.falling.some((m) => !(m.fell > 0)) || masts.canvas !== 0) problems.push(`a raider Frigate blown apart should topple her three masts with all their canvas: ${JSON.stringify(masts)}`);
  if (masts.left || masts.went.length !== 3 || masts.went.some((m) => !(m.top < masts.deck || m.s < 0.5))) problems.push(`a falling mast should go only once it's under the cloud deck (or shrink away), never vanish in the open sky: ${JSON.stringify(masts)}`);
  console.log(`paused, then back to port from the pause menu: told "${leave.told}"`);
  if (leave.told !== 'pause true, pause false, voyage:end' || leave.paused || leave.mode !== 'port') problems.push(`going back to port from the pause menu should tell the pause ended before the voyage's end: ${JSON.stringify(leave)}`);
  // less motion: a player whose device asks for it gets at most 0.35 of the kick
  await page.evaluate(() => { const g = window.__game; g.fly('frigate'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); });
  const full = await volley();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const calm = await volley();
  await page.emulateMedia({ reducedMotion: null });
  await page.evaluate(() => window.__game.endVoyage(0));
  console.log(`reduced motion: the view kicks back ${calm.toFixed(2)} m instead of ${full.toFixed(2)} m`);
  if (!(full > 0.5) || calm > full * 0.35) problems.push(`with reduced motion the kick should be at most 0.35 of the full one: ${calm} of ${full}`);
  // a Surge on a phone running slowly (20 frames a second), with less motion and without: the view widens just as it
  // does at 60 frames a second, and never flies off (the most and least it's widened, where it ends, and how far the
  // camera got from the ship)
  const surgeAt = (frame) => page.evaluate((frame) => {
    const g = window.__game; g.fly('brig'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player; P.pos.set(0, 900, 0); P.heading = 0; P.sail = 1; P.speed = P.H.vmax * 0.8;
    g.step(0.5, { sail: 1 }, frame); g.step(frame, { sail: 1, pressed: new Set(['r']) }, frame);
    let lo = Infinity, hi = -Infinity, far = 0;
    for (let t = 0; t < 5; t += frame) { g.step(frame, { sail: 1 }, frame); lo = Math.min(lo, g.surgeView); hi = Math.max(hi, g.surgeView); far = Math.max(far, g.camera.position.distanceTo(P.pos)); }
    const out = { lo: +lo.toFixed(2), hi: +hi.toFixed(2), end: +g.surgeView.toFixed(2), far: +far.toFixed(1) };
    g.endVoyage(0);
    return out;
  }, frame);
  const surge60 = await surgeAt(1 / 60), surge20 = await surgeAt(0.05);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const calm60 = await surgeAt(1 / 60), calm20 = await surgeAt(0.05);
  await page.emulateMedia({ reducedMotion: null });
  console.log(`a Surge at 20 frames a second: the view widens ${surge20.lo}° to ${surge20.hi}° (at 60: ${surge60.lo}° to ${surge60.hi}°), camera at most ${surge20.far} m off (${surge60.far}); with less motion ${calm20.lo}° to ${calm20.hi}° (at 60: ${calm60.lo}° to ${calm60.hi}°)`);
  if (!(surge60.hi > 9) || Math.abs(surge20.hi - surge60.hi) > 1 || Math.abs(surge20.lo - surge60.lo) > 1 || Math.abs(surge20.end) > 0.5 || surge20.far > surge60.far * 1.05) problems.push(`a Surge on a slow phone should widen the view as it does at 60 frames a second: ${JSON.stringify({ surge20, surge60 })}`);
  for (const c of [calm20, calm60]) if (!(c.lo >= -0.1 && c.hi <= 12.5 && c.hi > 9 && Math.abs(c.end) < 0.5)) problems.push(`with less motion a Surge should widen the view by up to 12 degrees with no overshoot, at any frame rate: ${JSON.stringify({ calm20, calm60 })}`);

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

  // a whole voyage, played: set sail from port, beat wave 1 (bringing down its only raider slows the world for a moment,
  // and the card rises only after it), sail on, then sink and get home with half
  const fought = await page.evaluate(async () => {
    const g = window.__game, out = {};
    g.progress.reset(); g.port.setMode('port');
    document.getElementById('btn-sail').click();
    const P = g.player; g.wind.strength = 0;
    out.sailed = g.mode === 'voyage' && P.ship.recipe.id === 'skiff';
    const slow = [], off = g.events.on('slowmo', () => slow.push(g.raiders.list.every((r) => r.f.down) ? 'last' : 'NOT LAST'));
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
    off();
    const calm = document.getElementById('calm');
    // (the card is shown at once, for the game, but waits for the slow motion before it rises: its rising is held back)
    out.wave1 = Math.round(t); out.choose = !calm.hidden; out.shards = Math.round(g.voyage.shards); out.slow = slow.join(' ');
    out.waits = parseFloat(getComputedStyle(calm).animationDelay) || 0;
    window.__voyageP = P;
    return out;
  });
  // in real time: a moment after the last raider went down the world is still slow, and the card not yet in view (as
  // long as its rising is still held back: `since`, how long its rising has been under way, in ms on the page's own
  // animation clock, which moves on as frames are drawn); then the card rises, and Sail on can be pressed once it's there
  await page.waitForTimeout(300); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  Object.assign(fought, await page.evaluate(() => {
    const c = document.getElementById('calm'), cs = getComputedStyle(c), a = c.getAnimations()[0];
    return { dial: +window.__game.fx.timeScaleNow.toFixed(2), unseen: cs.visibility === 'hidden' && +cs.opacity === 0, since: a ? Math.round(a.currentTime) : -1 };
  }));
  await page.waitForFunction(() => { const c = getComputedStyle(document.getElementById('calm')); return c.visibility === 'visible' && +c.opacity > 0.99; }, null, { timeout: 30000 }).catch(() => problems.push('the card between waves never rose into view'));
  await page.click('#btn-sail-on');
  const voyage = await page.evaluate(async (out) => {
    const g = window.__game, P = window.__voyageP;
    g.step(5, {});
    out.wave2 = g.waves.state === 'fight' && g.waves.n === 1;
    P.hit('hull', 1e6); g.step(6, {});
    out.sunk = !document.getElementById('paused').hidden && document.getElementById('paused-title').textContent.includes('went down');
    const before = g.progress.data.shards; out.half = Math.round(g.voyage.shards / 2);
    document.getElementById('btn-abandon').click();
    out.home = g.mode === 'port'; out.banked = g.progress.data.shards - before;
    return out;
  }, fought);
  console.log(`voyage: wave 1 (${voyage.raiders}) beaten in ${voyage.wave1} s (◆ ${voyage.shards}), sailed on, sank, home with ◆ ${voyage.banked}`);
  console.log(`the last raider of wave 1 down: slow motion told "${voyage.slow}", the world at ${voyage.dial} of its speed 0.3 s later; the card ${voyage.choose ? 'shown' : 'NOT SHOWN'} at once, held back ${voyage.waits} s before it rises, ${voyage.unseen ? 'not yet in view' : 'IN VIEW'} ${voyage.since} ms after it was shown`);
  if (voyage.slow !== 'last' || !(voyage.dial < 0.5)) problems.push(`bringing down a wave's last raider should slow the world once: ${JSON.stringify({ slow: voyage.slow, dial: voyage.dial })}`);
  if (!(voyage.waits >= 1.2) || !(voyage.since > 0) || (voyage.since < 1200 && !voyage.unseen)) problems.push(`the card between waves should wait for the slow motion before it rises: ${JSON.stringify({ waits: voyage.waits, since: voyage.since, unseen: voyage.unseen })}`);
  if (voyage.raiders !== 'skiff') problems.push(`a voyage's wave 1 should be one Skiff, got: ${voyage.raiders}`);
  if (!voyage.sailed || !voyage.choose || !voyage.shards || !voyage.wave2 || !voyage.sunk || !voyage.home || Math.abs(voyage.banked - voyage.half) > 1) problems.push(`a voyage went wrong: ${JSON.stringify(voyage)}`);
  // the save survives a reload
  await collect();
  await page.evaluate(() => { const d = window.__game.progress.data; d.shards = 1234; window.__game.progress.save(); });
  await page.reload();
  await page.waitForFunction(gameReady, null, { timeout: 180000 });
  await countEvents();
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
  await collect();
  const untold = (await page.evaluate(() => Object.keys(window.__game.events.PAYLOAD))).filter((k) => !told.has(k));
  console.log(`the game's news: ${told.size} kinds told${untold.length ? `, NEVER: ${untold.join(', ')}` : ', every kind'}`);
  if (untold.length) problems.push(`these events were never told while the game was played: ${untold.join(', ')}`);
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
  // on a phone the effects have smaller budgets, and a raider's shot landing buzzes the phone (where it can: an
  // Android phone; an iPhone has no way to)
  const phoneFx = await page.evaluate(() => {
    const g = window.__game, P = g.player, calls = [], can = typeof Navigator.prototype.vibrate === 'function';
    navigator.vibrate = (p) => { calls.push(p); return true; };
    // (a true shot from close by: the Skiff is small)
    let hit = false; const off = g.events.on('hit', (e) => { if (e.target === 'player') hit = true; });
    P.repair(1); const at = P.aimAt().clone(), from = at.clone().add({ x: 40, y: 0, z: 0 });
    g.bolts.fire(from, at.clone().sub(from).normalize(), 'chaser', 'raider', null, 1); g.step(0.4, {}); off();
    const buzzed = calls.includes(30);
    // a raider blown apart gives a longer buzz; a treasure ship striking her colours gives up quietly, with none
    g.raiders.setAI(false);
    const blown = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: 0, z: 300 }), Math.PI / 2, true), prize = g.raiders.spawn('galleon', P.pos.clone().add({ x: 150, y: 0, z: 450 }), Math.PI / 2, true);
    g.step(0.1, {}); calls.length = 0; blown.f.hit('hull', 1e9); g.step(0.3, {});
    const kill = calls.includes(60);
    calls.length = 0; prize.f.hit('sails', 1e9); g.step(0.3, {});
    const gaveUp = { why: prize.f.down?.why, buzzes: calls.length };
    g.raiders.clear();
    return { q: g.fx.q, sparks: g.fx.stats().sparkCap, puffs: g.fx.stats().puffCap, can, hit, buzzed, kill, gaveUp };
  });
  console.log(`phone: effects at ${phoneFx.q} of a laptop's (${phoneFx.sparks} sparks, ${phoneFx.puffs} puffs); ${phoneFx.can ? `a hit ${phoneFx.buzzed ? 'buzzes the phone' : 'DOES NOT BUZZ'}, a raider blown apart ${phoneFx.kill ? 'buzzes longer' : 'DOES NOT BUZZ'}, a treasure ship striking ${phoneFx.gaveUp.buzzes ? 'BUZZES' : 'doesn\'t buzz'}` : 'can\'t buzz this browser'}`);
  if (phoneFx.q !== 0.6 || phoneFx.sparks !== 700 || phoneFx.puffs !== 600) problems.push(`phone: the effects' budgets should be smaller: ${JSON.stringify(phoneFx)}`);
  if (!phoneFx.hit) problems.push('phone: a raider\'s shot fired straight at the Skiff from 40 m missed her');
  if (phoneFx.can && phoneFx.hit && !phoneFx.buzzed) problems.push('phone: a hit on the ship doesn\'t buzz the phone');
  if (phoneFx.can && !phoneFx.kill) problems.push('phone: a raider blown apart doesn\'t buzz the phone');
  if (phoneFx.gaveUp.why !== 'struck' || (phoneFx.can && phoneFx.gaveUp.buzzes)) problems.push(`phone: a treasure ship striking her colours shouldn't buzz the phone: ${JSON.stringify(phoneFx.gaveUp)}`);
  // the worst case for a phone: a Man-o'-war blown apart beside two other wrecks (a Frigate and a Brig), in a fight.
  // The sparks and smoke never run out of room, the debris's batches are big enough (hardly a piece cut short: at most
  // one in twenty of each kind), and a step of the game stays quick
  const worst = await page.evaluate(async () => {
    const g = window.__game, FX = g.fx;
    g.fly('frigate'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player; P.pos.set(0, 1300, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0;
    for (const k of ['hull', 'crystals']) P.full[k] = P.health[k] = 1e6;
    const foes = [['manowar', 0, 360], ['frigate', -190, 270], ['brig', 190, 250]].map(([id, x, z]) => g.raiders.spawn(id, P.pos.clone().add({ x, y: -30, z }), Math.PI / 2, false));
    g.raiders.setAI(true); FX.clear(); FX.resetStats();
    const aim = () => {
      const r = g.raiders.list.find((x) => !x.f.down) ?? foes[0], T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = r.f.pos.clone().sub(T).normalize(), a = Math.atan2(look.x, look.z) - P.heading;
      g.cam.pitch = Math.max(-0.3, -Math.asin(look.y) + 0.08); g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
    };
    let most = 0, puffs = 0, calls = 0; const times = [];
    for (let k = 0; k < 8; k++) { aim(); g.step(0.25, { fire: true }); most = Math.max(most, FX.stats().sparks); puffs = Math.max(puffs, FX.stats().puffs); }
    let masts = 0;
    for (const r of foes) { r.f.hit('hull', 1e9); aim(); g.step(0.3, { fire: true }); most = Math.max(most, FX.stats().sparks); masts = Math.max(masts, g.wrecks.falling().length); }
    for (let s = 0; s < 16; s++) {
      const t0 = performance.now();
      for (let k = 0; k < 4; k++) { aim(); g.step(0.25, { fire: true }); most = Math.max(most, FX.stats().sparks); puffs = Math.max(puffs, FX.stats().puffs); }
      times.push((performance.now() - t0) / 60);
      masts = Math.max(masts, g.wrecks.falling().length);
      if (s === 1) { await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); calls = g.renderer.info.render.calls; }
    }
    times.sort((a, b) => a - b);
    const st = FX.stats();
    g.raiders.setAI(false); g.raiders.clear(); FX.clear();
    g.fly('skiff'); g.waves.timer = 1e9; // (back in the Skiff, for the picture of a battle)
    return { most, cap: st.sparkCap, dropped: st.dropped, puffs, puffCap: st.puffCap, puffsDropped: st.puffsDropped, debris: st.debris.peak, caps: st.debris.caps, cut: st.debris.cut, tossed: st.debris.tossed, ms: +times[8].toFixed(2), calls, masts };
  });
  console.log(`phone, a Man-o'-war going down beside two other wrecks: at most ${worst.most} sparks of ${worst.cap} (${worst.dropped} cut short), ${worst.puffs} puffs of ${worst.puffCap} (${worst.puffsDropped} cut short), debris at most ${worst.debris.wood}/${worst.caps.wood} splinters, ${worst.debris.canvas}/${worst.caps.canvas} scraps, ${worst.debris.crystal}/${worst.caps.crystal} shards (cut short ${worst.cut.wood} of ${worst.tossed.wood}, ${worst.cut.canvas} of ${worst.tossed.canvas} and ${worst.cut.crystal} of ${worst.tossed.crystal}); ${worst.ms} ms a step, ${worst.calls} draws in a frame`);
  if (worst.dropped || worst.puffsDropped || worst.most > worst.cap || ['wood', 'canvas', 'crystal'].some((k) => worst.cut[k] > worst.tossed[k] * 0.05)) problems.push(`phone: three wrecks at once ran out of room: ${JSON.stringify(worst)}`);
  if (worst.ms >= 1) problems.push(`phone: a step with three wrecks takes ${worst.ms} ms (should be under 1)`);
  if (worst.masts) problems.push(`phone: masts shouldn't fall on a phone (${worst.masts} did)`);
  await page.evaluate(battle, ['cutter', 'skiff']);
  await page.waitForTimeout(2500);
  await shot(page, 'phone-battle');
  await page.close();
}

await browser.close();
if (problems.length) { console.log('PROBLEMS:\n' + [...new Set(problems)].join('\n')); process.exit(1); }
console.log(quick ? 'all good (quick)' : 'all good');
