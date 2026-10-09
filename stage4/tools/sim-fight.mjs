// sim-fight.mjs: a rough simulated Captain, for tuning the raiders. It keeps the nearest raider in its sights and
// fires, pointing at it (or, in a ship with broadsides, keeping it abeam; a treasure ship that runs it chases bow-on,
// surging when she's getting out of reach), and reports how long each wave took and how low the hull got (and what
// sank her, and each treasure ship caught or got away), how much damage a minute the raiders' broadsides and their
// light guns did her, and the raking hits each way. It plays on the game's own clock, so a few minutes of fighting take
// about a minute.
// By default it's a plain Captain who ignores the fight's tactics (src/game/tactics.js): she never dodges a broadside,
// fires round shot only and never patches her ship. The tactics flags make her use them, so "How hard it is" in
// docs/game.md can give a plain Captain and a skilled one.
// Run: node tools/build.mjs && node tools/sim-fight.mjs [ship] [waves] [skies] [first wave] [options]
//   ship: skiff, cutter, brig, frigate, galleon or manowar (default brig); waves: how many to fight (4); skies: fair,
//   cross or mael (cross); first wave: where the voyage starts (1)
//   --owns galleon,manowar   which giants the Captain owns, so raiders sail them (raiders.js waveAt): `none`, or a list.
//                            By default the giants up to the one she sails (a Man-o'-war's Captain owns the Galleon too)
//   --mods N                 every upgrade bought N steps of 3 (default 0)
//   --power P                crystal power, -2 (all to the sails) to 2 (all to the guns) (default 0)
//   --runs N                 that many voyages one after another in the same page, then a summary (default 1)
//   --dodge                  on a raider's broadside warning (her red fan), climb out of her aim for the warning and
//                            1.2 s more (dive instead, above 2,000 m), a moment after it starts, as a person would
//   --react S                how long that moment is, in seconds (default 0.35)
//   --shot S                 her shot: round, chain, breaker, or auto (chain shot on a treasure ship within its reach,
//                            850 m; breakers on a Man-o'-war or a raider captain's ship, from 70 m above her, while
//                            they last; else round); she owns chain shot and the breakers for it
//   --patch                  the crew patch her when her worst part falls below half
//   --policy cross           a broadside ship crosses a raider's bow (350 m ahead of her) to rake her, then keeps her
//                            abeam as ever
//   --skilled                all of them: --dodge --shot auto --patch
//   --smart N, --warn S      for tuning: the skies' smart raiders (0, 1 or 2) and broadside warning (seconds) for this
//                            run, in place of the skies' own (progress.js SKIES)
import { chromium } from 'playwright';
const root = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2), flag = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const on = (k) => { const i = args.indexOf('--' + k); if (i < 0) return false; args.splice(i, 1); return true; };
const smartArg = flag('smart', null), warnArg = flag('warn', null);
const runs = +flag('runs', 1), mods = +flag('mods', 0), power = +flag('power', 0), ownsArg = flag('owns', null), policy = flag('policy', 'abeam'), react = +flag('react', 0.35);
const skilled = on('skilled'), dodge = on('dodge') || skilled, patch = on('patch') || skilled, shotArg = flag('shot', skilled ? 'auto' : 'round');
const ship = args[0] ?? 'brig', waves = +(args[1] ?? 4), skies = args[2] ?? 'cross', first = +(args[3] ?? 1);
const GIANTS = ['galleon', 'manowar'];
const owns = ownsArg === 'none' ? [] : ownsArg ? ownsArg.split(',').filter((g) => GIANTS.includes(g)) : GIANTS.slice(0, GIANTS.indexOf(ship) + 1);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('file://' + root + 'dist/game.html');
await page.waitForFunction(() => window.__game?.ready, null, { timeout: 180000 });
const tools = [dodge && `dodging ${react} s after a warning`, shotArg !== 'round' && `${shotArg} shot`, patch && 'patching', policy === 'cross' && 'crossing bows'].filter(Boolean);
console.log(`${smartArg !== null || warnArg !== null ? `(tuning: ${smartArg !== null ? `smart ${smartArg} ` : ''}${warnArg !== null ? `warning ${warnArg} s` : ''}) ` : ''}the ${ship}, waves ${first} to ${first + waves - 1} on ${skies}, owning ${owns.length ? owns.join(' and ') : 'no giants'}, upgrades ${mods} of 3, crystal power ${power}; ${tools.length ? `a skilled Captain (${tools.join(', ')})` : 'a plain Captain (no dodging, round shot only, no patching)'}`);
const results = [];
for (let run = 0; run < runs; run++) {
  const res = await page.evaluate(([ship, waves, skies, first, owns, mods, power, dodge, patch, shotArg, policy, react, smartArg, warnArg]) => {
    const g = window.__game, out = [];
    if (smartArg !== null) g.SKIES[skies].smart = +smartArg;
    if (warnArg !== null) g.SKIES[skies].warn = +warnArg;
    if (g.mode === 'voyage') g.endVoyage(0);
    g.progress.reset(); const d = g.progress.data; d.skies = skies;
    for (const id of owns) d.ships[id].owned = true;
    Object.assign(d.ships[ship], { owned: true, power, mods: { armour: mods, canvas: mods, drill: mods, crystals: mods } });
    if (shotArg !== 'round') d.shots.chain = d.shots.breaker = true;
    g.fly(ship);
    g.waves.n = first - 1;
    let t = 0, lastWave = first - 1, start = 0, minHull = 1, sank = 0, caught = 0, away = 0, fightT = 0;
    const took = { broadside: 0, light: 0 }, rakes = { player: 0, raider: 0 }, count = { warns: 0, patches: 0, shots: 0 };
    let dodgeFrom = -1, dodgeUntil = -1, dodgeDir = 1, changed = -99;
    const last = first - 1 + waves, most = 240 * waves + 60; // (sim seconds: a fortress, or a treasure ship running, can take minutes)
    // each treasure ship caught (her colours struck, or blown up) or got away, so a treasure wave says how it went; the
    // damage the raiders' guns did her (a broadside's shot is the heavier), raking hits each way, and her tactics
    const offs = [g.events.on('raider:down', (e) => { if (e.raider.role === 'prize') { caught++; out.push(`  t=${t.toFixed(0)} the treasure ${e.raider.R.cls} ${e.why === 'struck' ? 'struck her colours' : 'went down'}`); } }),
      g.events.on('raider:escaped', (e) => { away++; out.push(`  t=${t.toFixed(0)} the treasure ${e.raider.R.cls} got away`); }),
      g.events.on('hit', (e) => { if (e.target === 'player') took[e.size > 1.2 ? 'broadside' : 'light'] += e.damage; if (e.raked) rakes[e.owner]++; }),
      g.events.on('warn', (e) => { count.warns++; if (dodge && !g.player.down) { dodgeFrom = t + react; dodgeUntil = t + e.time + 1.2; dodgeDir = g.player.pos.y > 2000 ? -1 : 1; } }),
      g.events.on('patch', (e) => { if (e.stage === 'start') count.patches++; }),
      g.events.on('shot', (e) => { if (e.why !== 'earned') count.shots++; })];
    out.push(`  wave ${first}: ${g.describe(g.waveAt(first - 1, g.SKIES[skies].extra, null, g.giants))}`);
    const KEY = { round: '1', chain: '2', breaker: '3' };
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
        // bow-on under full sail, firing her bow guns. Crossing bows: a broadside ship makes for 350 m ahead of a
        // broadside raider first, then turns her side to bear down the raider's length
        let want = bs && dist < 700 && !runner ? g.cam.yaw - Math.sign(g.cam.yaw || 1) * Math.PI / 2 : g.cam.yaw;
        if (policy === 'cross' && bs && !runner && r.role === 'broadside' && dist < 900) {
          const X = r.f.pos.clone().addScaledVector(r.f.forward(), 350);
          if (X.distanceTo(P.pos) > 150) { const w = Math.atan2(X.x - P.pos.x, X.z - P.pos.z) - P.heading; want = Math.atan2(Math.sin(w), Math.cos(w)); }
        }
        ctl = { fire: true, turn: Math.max(-1, Math.min(1, -want * 2)), climb: Math.max(-1, Math.min(1, (r.f.pos.y - P.pos.y) / 40)), sail: runner ? 1 : 0, pressed: new Set() };
        if (runner && dist > 1100) ctl.pressed.add('r'); // (and Surges after one getting out of her bow guns' reach)
        // her shot: as asked, or chosen for the raider in her sights
        let shot = shotArg;
        if (shotArg === 'auto') shot = r.role === 'prize' && dist < 850 ? 'chain' : (r.id === 'manowar' || r.captain) && g.gunnery.breakers > 0 ? 'breaker' : 'round';
        // (a change of shot reloads every battery, so like a person she keeps a shot loaded a while before changing again)
        if (shot !== g.gunnery.shot && (shot !== 'breaker' || g.gunnery.breakers > 0) && t - changed >= 5) { ctl.pressed.add(KEY[shot]); changed = t; }
        // (breakers on a fortress are fired from above her: climb over her)
        if (shot === 'breaker') ctl.climb = Math.max(-1, Math.min(1, (r.f.pos.y + 70 - P.pos.y) / 40));
      }
      // dodging a broadside: climbing (or diving) out of the aim of the raider readying it
      if (dodge && t >= dodgeFrom && t < dodgeUntil && !P.down) ctl.climb = dodgeDir;
      if (patch && !P.down && P.frac(P.worst()) < 0.5 && !P.patch.cd) (ctl.pressed ??= new Set()).add('x');
      g.step(0.25, ctl); t += 0.25; if (g.waves.state === 'fight') fightT += 0.25;
      if (g.waves.state === 'choose' && g.waves.choose < 15) {
        g.sailOn(); // after the crew have patched her up
        if (g.waves.n < last) out.push(`  wave ${g.waves.n + 1}: ${g.describe(g.waves.next)}`);
      }
      if (g.waves.sunk) { sank = g.waves.n + 1; out.push(`  t=${t.toFixed(0)} SANK in wave ${sank} (her ${P.down?.why ?? '?'} gone; hull ${Math.round(P.health.hull)}, sails ${Math.round(P.health.sails)}, crystals ${Math.round(P.health.crystals)})`); break; }
      minHull = Math.min(minHull, P.frac('hull'));
      if (g.waves.n !== lastWave) { out.push(`  wave ${lastWave + 1} beaten in ${(t - start).toFixed(0)} s; lowest hull ${(minHull * 100).toFixed(0)}%; downed so far ${g.downed}`); lastWave = g.waves.n; start = t; minHull = 1; }
    }
    if (!g.waves.sunk) g.step(1 / 60, {}); // (a raider that went down as the last wave was beaten is counted a frame later)
    offs.forEach((off) => off());
    const perMin = (n) => Math.round(n / Math.max(1, fightT / 60));
    out.push(`  downed ${g.downed}, hits ${g.hits}, shards this voyage ◆ ${Math.round(g.voyage.shards)}, sim time ${t} s (${Math.round(fightT)} s fighting)`);
    out.push(`  damage taken a minute of fighting: broadsides ${perMin(took.broadside)}, light guns ${perMin(took.light)}; raked: her ${rakes.player} hits, the raiders' ${rakes.raider}; ${count.warns} broadside warnings, ${count.patches} patches, ${count.shots} shot changes`);
    return { text: out.join('\n'), beaten: g.waves.n - (first - 1), sank, shards: Math.round(g.voyage.shards), caught, away, fightT, took, rakes, patches: count.patches };
  }, [ship, waves, skies, first, owns, mods, power, dodge, patch, shotArg, policy, react, smartArg, warnArg]);
  console.log(`run ${run + 1}:\n${res.text}`);
  results.push(res);
}
if (runs > 1) {
  const all = results.filter((r) => r.beaten >= waves).length, mean = Math.round(results.reduce((a, r) => a + r.shards, 0) / runs);
  const sank = results.filter((r) => r.sank).map((r) => r.sank).sort((a, b) => a - b);
  const caught = results.reduce((a, r) => a + r.caught, 0), away = results.reduce((a, r) => a + r.away, 0);
  const reached = results.map((r) => first + r.beaten).sort((a, b) => a - b), median = reached[reached.length >> 1];
  const mins = results.reduce((a, r) => a + r.fightT, 0) / 60, sum = (f) => results.reduce((a, r) => a + f(r), 0);
  console.log(`summary: all ${waves} waves beaten ${all} of ${runs} times; sank in wave ${sank.length ? sank.join(', ') : '(never)'}; the middle voyage reached wave ${median}${median > first + waves - 1 ? ' (all beaten)' : ''}; ◆ ${mean} a voyage on average${caught + away ? `; treasure ships caught ${caught}, got away ${away}` : ''}`);
  console.log(`  damage taken a minute of fighting: broadsides ${Math.round(sum((r) => r.took.broadside) / mins)}, light guns ${Math.round(sum((r) => r.took.light) / mins)}; raking hits: hers ${sum((r) => r.rakes.player)}, the raiders' ${sum((r) => r.rakes.raider)}; ${sum((r) => r.patches)} patches`);
}
await browser.close();
