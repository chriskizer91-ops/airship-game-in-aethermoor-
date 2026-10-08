// sim-fight.mjs: a rough simulated Captain, for tuning the raiders. It keeps the nearest raider in its sights and
// fires, pointing at it (or, in a ship with broadsides, keeping it abeam), and reports how long each wave took and
// how low the hull got. It plays on the game's own clock, so a few minutes of fighting take about a minute.
// Run: node tools/build.mjs && node tools/sim-fight.mjs [skiff|cutter|brig|frigate] [waves] [fair|cross|mael] [first wave]
import { chromium } from 'playwright';
const root = new URL('..', import.meta.url).pathname;
const ship = process.argv[2] ?? 'brig', waves = +(process.argv[3] ?? 4), skies = process.argv[4] ?? 'cross', first = +(process.argv[5] ?? 1);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('file://' + root + 'dist/game.html');
await page.waitForFunction(() => window.__game?.ready, null, { timeout: 180000 });
console.log(await page.evaluate(([ship, waves, skies, first]) => {
  const g = window.__game, out = []; g.progress.reset(); g.progress.data.skies = skies; g.fly(ship);
  g.waves.n = first - 1;
  let t = 0, lastWave = first - 1, start = 0, minHull = 1, fired = 0, lost = 0;
  while (g.waves.n < waves && t < 900) {
    const P = g.player, live = g.raiders.list.filter((r) => !r.f.down);
    let ctl = { fire: false, sail: 0.6, turn: 0, climb: 0 };
    if (live.length && !P.down) {
      live.sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
      const r = live[0], T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = r.f.pos.clone().sub(T).normalize();
      g.cam.pitch = Math.max(-0.35, -Math.asin(look.y)); const a = Math.atan2(look.x, look.z) - P.heading; g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
      const d = r.f.pos.distanceTo(P.pos), bs = P.ship.recipe.ports ? 1 : 0;
      // broadside ships keep it abeam at 300 m; others point at it
      const want = bs && d < 700 ? g.cam.yaw - Math.sign(g.cam.yaw || 1) * Math.PI / 2 : g.cam.yaw;
      ctl = { fire: true, turn: Math.max(-1, Math.min(1, -want * 2)), climb: Math.max(-1, Math.min(1, (r.f.pos.y - P.pos.y) / 40)), sail: 0 };
      fired++;
    }
    g.step(0.25, ctl); t += 0.25;
    if (g.waves.state === 'choose' && g.waves.choose < 15) g.sailOn(); // after the crew have patched her up
    if (g.waves.sunk) { out.push(`  t=${t.toFixed(0)} SANK in wave ${g.waves.n + 1}`); break; }
    minHull = Math.min(minHull, P.frac('hull'));
    if (g.waves.n !== lastWave) { out.push(`wave ${lastWave + 1} beaten in ${(t - start).toFixed(0)} s; lowest hull ${(minHull * 100).toFixed(0)}%; downed so far ${g.downed}`); lastWave = g.waves.n; start = t; minHull = 1; }
  }
  out.push(`downed ${g.downed}, hits ${g.hits}, shards this voyage ◆ ${Math.round(g.voyage.shards)}, sim time ${t} s`);
  return out.join('\n');
}, [ship, waves, skies, first]));
await browser.close();
