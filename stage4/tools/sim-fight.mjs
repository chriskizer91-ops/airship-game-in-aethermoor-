// sim-fight.mjs: a rough simulated Captain, for tuning the raiders. It keeps the nearest raider in its sights and
// fires, pointing at it (or, in a ship with broadsides, keeping it abeam; a treasure ship that runs it chases bow-on,
// surging when she's getting out of reach), and reports how long each wave took and how low the hull got (and what
// sank her). It plays on the game's own clock, so a few minutes of fighting take about a minute.
// Run: node tools/build.mjs && node tools/sim-fight.mjs [ship] [waves] [skies] [first wave] [options]
//   ship: skiff, cutter, brig, frigate, galleon or manowar (default brig); waves: how many to fight (4); skies: fair,
//   cross or mael (cross); first wave: where the voyage starts (1)
//   --owns galleon,manowar   which giants the Captain owns, so raiders sail them (raiders.js waveAt): `none`, or a list.
//                            By default the giants up to the one she sails (a Man-o'-war's Captain owns the Galleon too)
//   --mods N                 every upgrade bought N steps of 3 (default 0)
//   --power P                crystal power, -2 (all to the sails) to 2 (all to the guns) (default 0)
//   --runs N                 that many voyages one after another in the same page, then a summary (default 1)
import { chromium } from 'playwright';
const root = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2), flag = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const runs = +flag('runs', 1), mods = +flag('mods', 0), power = +flag('power', 0), ownsArg = flag('owns', null);
const ship = args[0] ?? 'brig', waves = +(args[1] ?? 4), skies = args[2] ?? 'cross', first = +(args[3] ?? 1);
const GIANTS = ['galleon', 'manowar'];
const owns = ownsArg === 'none' ? [] : ownsArg ? ownsArg.split(',').filter((g) => GIANTS.includes(g)) : GIANTS.slice(0, GIANTS.indexOf(ship) + 1);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('file://' + root + 'dist/game.html');
await page.waitForFunction(() => window.__game?.ready, null, { timeout: 180000 });
console.log(`the ${ship}, waves ${first} to ${first + waves - 1} on ${skies}, owning ${owns.length ? owns.join(' and ') : 'no giants'}, upgrades ${mods} of 3, crystal power ${power}`);
const results = [];
for (let run = 0; run < runs; run++) {
  const res = await page.evaluate(([ship, waves, skies, first, owns, mods, power]) => {
    const g = window.__game, out = [];
    if (g.mode === 'voyage') g.endVoyage(0);
    g.progress.reset(); const d = g.progress.data; d.skies = skies;
    for (const id of owns) d.ships[id].owned = true;
    Object.assign(d.ships[ship], { owned: true, power, mods: { armour: mods, canvas: mods, drill: mods, crystals: mods } });
    g.fly(ship);
    g.waves.n = first - 1;
    let t = 0, lastWave = first - 1, start = 0, minHull = 1, sank = 0;
    const last = first - 1 + waves, most = 240 * waves + 60; // (sim seconds: a fortress, or a treasure ship running, can take minutes)
    out.push(`  wave ${first}: ${g.describe(g.waveAt(first - 1, g.SKIES[skies].extra, null, g.giants))}`);
    while (g.waves.n < last && t < most) {
      const P = g.player, live = g.raiders.list.filter((r) => !r.f.down);
      let ctl = { fire: false, sail: 0.6, turn: 0, climb: 0 };
      if (live.length && !P.down) {
        live.sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
        const r = live[0], T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
        const look = r.f.pos.clone().sub(T).normalize();
        g.cam.pitch = Math.max(-0.35, -Math.asin(look.y)); const a = Math.atan2(look.x, look.z) - P.heading; g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
        const dist = r.f.pos.distanceTo(P.pos), bs = P.ship.recipe.ports ? 1 : 0, runner = r.role === 'prize' && r.fleeing;
        // broadside ships keep it abeam at 300 m; others point at it, and every ship chases a treasure ship that runs
        // bow-on under full sail, firing her bow guns
        const want = bs && dist < 700 && !runner ? g.cam.yaw - Math.sign(g.cam.yaw || 1) * Math.PI / 2 : g.cam.yaw;
        ctl = { fire: true, turn: Math.max(-1, Math.min(1, -want * 2)), climb: Math.max(-1, Math.min(1, (r.f.pos.y - P.pos.y) / 40)), sail: runner ? 1 : 0 };
        if (runner && dist > 1100) ctl.pressed = new Set(['r']); // (and Surges after one getting out of her bow guns' reach)
      }
      g.step(0.25, ctl); t += 0.25;
      if (g.waves.state === 'choose' && g.waves.choose < 15) {
        g.sailOn(); // after the crew have patched her up
        if (g.waves.n < last) out.push(`  wave ${g.waves.n + 1}: ${g.describe(g.waves.next)}`);
      }
      if (g.waves.sunk) { sank = g.waves.n + 1; out.push(`  t=${t.toFixed(0)} SANK in wave ${sank} (her ${P.down?.why ?? '?'} gone; hull ${Math.round(P.health.hull)}, sails ${Math.round(P.health.sails)}, crystals ${Math.round(P.health.crystals)})`); break; }
      minHull = Math.min(minHull, P.frac('hull'));
      if (g.waves.n !== lastWave) { out.push(`  wave ${lastWave + 1} beaten in ${(t - start).toFixed(0)} s; lowest hull ${(minHull * 100).toFixed(0)}%; downed so far ${g.downed}`); lastWave = g.waves.n; start = t; minHull = 1; }
    }
    out.push(`  downed ${g.downed}, hits ${g.hits}, shards this voyage ◆ ${Math.round(g.voyage.shards)}, sim time ${t} s`);
    return { text: out.join('\n'), beaten: g.waves.n - (first - 1), sank, shards: Math.round(g.voyage.shards) };
  }, [ship, waves, skies, first, owns, mods, power]);
  console.log(`run ${run + 1}:\n${res.text}`);
  results.push(res);
}
if (runs > 1) {
  const all = results.filter((r) => r.beaten >= waves).length, mean = Math.round(results.reduce((a, r) => a + r.shards, 0) / runs);
  const sank = results.filter((r) => r.sank).map((r) => r.sank).sort((a, b) => a - b);
  console.log(`summary: all ${waves} waves beaten ${all} of ${runs} times; sank in wave ${sank.length ? sank.join(', ') : '(never)'}; ◆ ${mean} a voyage on average`);
}
await browser.close();
