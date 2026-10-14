// sim-fight.mjs: a rough simulated Captain, for tuning the raiders. It keeps the nearest raider in its sights and
// fires, pointing at it (or, in a ship with broadsides, keeping it abeam; a treasure ship that runs it chases bow-on,
// surging when she's getting out of reach), and reports how long each wave took and how low the hull got (and what
// sank her, and each treasure ship caught or got away), how much damage a minute the raiders' broadsides and their
// light guns did her, and the raking hits each way; and the raiders' nerve (how many struck their colours, ran, got
// away, fired flares and brought help), each voyage's length, and the raider captains brought down; the shards brought
// home (half when she sank), how many of those spilled she gathered, and what she'd have had gathering every one; and
// where each wave was fought. It plays on the game's own clock, so a few minutes of fighting take about a minute.
// She gathers a wreck's shards as a real Captain does: whenever no raider is left within 500 m of her (between waves
// too), she steers through the nearest shards she can reach before they fall away, her guns still on the nearest
// raider (`--no-gather`: she never does, turning straight to the next raider as she did until October 14).
// Each voyage is played in a fresh page of its own (nothing left over from the voyage before: the clouds' clock, the
// raiders built, the save), with the dice (Math.random) seeded for it, so voyages are independent of each other and a
// batch can be played again exactly (`--seed`), and several can be played at once (`--jobs`).
// She chases a raider who runs for the clouds as she does a treasure ship that runs: bow-on, surging.
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
//   --runs N                 that many voyages, each in a fresh page, then a summary (default 1)
//   --seed S                 the dice for the first voyage (each next one S + 1, S + 2...): the same seed plays the same
//                            voyage again. By default a new seed each time, said at the start so a batch can be replayed
//   --page F                 the game page to play (default dist/game.html): a copy kept from before a change, to
//                            compare the two with the same seeds
//   --jobs N                 play that many voyages at once, each in its own page (default 1; the machine's CPUs share
//                            them, so 2 on a 4-CPU machine)
//   --dodge                  on a raider's broadside warning (her red fan), climb out of her aim for the warning and
//                            1.2 s more (dive instead, above 2,000 m), a moment after it starts, as a person would
//   --react S                how long that moment is, in seconds (default 0.35)
//   --shot S                 her shot: round, chain, breaker, or auto (chain shot on a treasure ship within its reach,
//                            850 m; breakers on a Man-o'-war or a raider captain's ship, from 70 m above her, while
//                            they last; else round); she owns chain shot and the breakers for it
//   --patch                  the crew patch her when her worst part falls below half
//   --policy cross           a broadside ship crosses a raider's bow (350 m ahead of her) to rake her, then keeps her
//                            abeam as ever; a line of battle's leader too (her bow, the line's head)
//   --policy fortress        against a Man-o'-war, stay above her and off her stern quarter (80 m up, 250 m astern and
//                            150 m out), firing down at her (breakers on her columns, with --shot auto); others as ever
//   --road R                 between waves, take the second way on whenever it's this one (storm, treasure or hunt)
//   --height H               between waves, climb or dive back to H metres (by default she stays wherever the last
//                            wave left her, following the raiders up and down)
//   --no-gather              she never steers for a wreck's shards (only those she flies through on her way are hers)
//   --skilled                all of them: --dodge --shot auto --patch
//   --smart N, --warn S      for tuning: the skies' smart raiders (0, 1 or 2) and broadside warning (seconds) for this
//                            run, in place of the skies' own (progress.js SKIES)
//   --rake M                 for tuning: raking fire's bonus (tactics.js RAKE.mul: 1.5; 1 is none) for this run
//   --set NAME.key=value     for tuning: any of the rules in tactics.js for this run, as __game.tactics has them (for
//                            example --set ROADS.storm.more=false), and again for more than one
import { chromium } from 'playwright';
const root = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2), flag = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const on = (k) => { const i = args.indexOf('--' + k); if (i < 0) return false; args.splice(i, 1); return true; };
const smartArg = flag('smart', null), warnArg = flag('warn', null), rakeArg = flag('rake', null), sets = [];
for (let v; (v = flag('set', null)) !== null;) sets.push(v);
const seedArg = flag('seed', null), jobs = Math.max(1, +flag('jobs', 1)), pageArg = flag('page', null), heightArg = flag('height', null);
const runs = +flag('runs', 1), mods = +flag('mods', 0), power = +flag('power', 0), ownsArg = flag('owns', null), policy = flag('policy', 'abeam'), react = +flag('react', 0.35), road = flag('road', null);
const skilled = on('skilled'), dodge = on('dodge') || skilled, patch = on('patch') || skilled, shotArg = flag('shot', skilled ? 'auto' : 'round'), gather = !on('no-gather');
const ship = args[0] ?? 'brig', waves = +(args[1] ?? 4), skies = args[2] ?? 'cross', first = +(args[3] ?? 1);
const GIANTS = ['galleon', 'manowar'];
const owns = ownsArg === 'none' ? [] : ownsArg ? ownsArg.split(',').filter((g) => GIANTS.includes(g)) : GIANTS.slice(0, GIANTS.indexOf(ship) + 1);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
// (her tactics make her a skilled Captain; how she steers and the road she takes are said after, either way)
const tools = [dodge && `dodging ${react} s after a warning`, shotArg !== 'round' && `${shotArg} shot`, patch && 'patching'].filter(Boolean);
const ways = [!gather && 'never steering for shards', policy === 'cross' && 'crossing bows', policy === 'fortress' && 'over a Man-o\'-war\'s stern quarter', road && `taking the ${road} road`, heightArg !== null && `back to ${heightArg} m between waves`].filter(Boolean);
const seed0 = seedArg !== null ? Math.floor(+seedArg) : Math.floor(Math.random() * 1e9);
console.log(`${smartArg !== null || warnArg !== null || rakeArg !== null || sets.length ? `(tuning: ${smartArg !== null ? `smart ${smartArg} ` : ''}${warnArg !== null ? `warning ${warnArg} s ` : ''}${rakeArg !== null ? `raking ×${rakeArg} ` : ''}${sets.join(' ')}) ` : ''}the ${ship}, waves ${first} to ${first + waves - 1} on ${skies}, owning ${owns.length ? owns.join(' and ') : 'no giants'}, upgrades ${mods} of 3, crystal power ${power}; ${tools.length ? `a skilled Captain (${tools.join(', ')})` : 'a plain Captain (no dodging, round shot only, no patching)'}${ways.length ? `; ${ways.join(', ')}` : ''}; seed ${seed0}${runs > 1 ? ` to ${seed0 + runs - 1}` : ''}${jobs > 1 ? `, ${jobs} at a time` : ''}`);
// one voyage, in a fresh page of its own (its own storage too), the dice seeded for it (a page slow to open on a busy
// machine is tried again: the voyage is the same however long it took to open)
async function voyage(run, tries = 3) {
  const context = await browser.newContext({ viewport: { width: 640, height: 400 } }), page = await context.newPage();
  page.on('pageerror', (e) => console.log(`ERR (run ${run + 1})`, e.message));
  try {
    await page.goto('file://' + (pageArg ? new URL(pageArg, 'file://' + process.cwd() + '/').pathname : root + 'dist/game.html'), { timeout: 180000 });
    await page.waitForFunction(() => window.__game?.ready, null, { timeout: 180000 });
    return await page.evaluate(VOYAGE, [ship, waves, skies, first, owns, mods, power, dodge, patch, shotArg, policy, react, smartArg, warnArg, rakeArg, road, seed0 + run, heightArg, sets, gather]);
  } catch (e) {
    if (tries > 1 && e.name === 'TimeoutError') return voyage(run, tries - 1);
    throw e;
  } finally { await context.close(); }
}
const VOYAGE = ([ship, waves, skies, first, owns, mods, power, dodge, patch, shotArg, policy, react, smartArg, warnArg, rakeArg, road, seed, height, sets, gather]) => {
  // (the dice, seeded for this voyage: mulberry32)
  let s32 = seed >>> 0;
  Math.random = () => { s32 = (s32 + 0x6d2b79f5) >>> 0; let t = s32; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const g = window.__game, out = [];
  if (rakeArg !== null) g.tactics.RAKE.mul = +rakeArg;
  for (const set of sets) { const [path, v] = set.split('='), keys = path.split('.'), last = keys.pop(); keys.reduce((o, k) => o[k], g.tactics)[last] = JSON.parse(v); }
  if (smartArg !== null) g.SKIES[skies].smart = +smartArg;
  if (warnArg !== null) g.SKIES[skies].warn = +warnArg;
  if (g.mode === 'voyage') g.endVoyage(0);
  // (a Captain who has sailed before: a brand-new Captain's first raider comes gently, main.js, and that's not what's
  // measured here)
  g.progress.reset(); const d = g.progress.data; d.skies = skies; d.voyages = 1;
  for (const id of owns) d.ships[id].owned = true;
  Object.assign(d.ships[ship], { owned: true, power, mods: { armour: mods, canvas: mods, drill: mods, crystals: mods } });
  if (shotArg !== 'round') d.shots.chain = d.shots.breaker = true;
  g.fly(ship);
  g.waves.n = first - 1;
  let t = 0, lastWave = first - 1, start = 0, minHull = 1, sank = 0, caught = 0, away = 0, fightT = 0, lostT = 0, highT = 0; // (lostT: her target lost in cloud; highT: her height, summed over the fight)
  const W = { t: 0, lost: 0, high: 0, cloud: 0 }; // (the same for this wave, and the time she was in cloud herself)
  const where = () => `; fought ${Math.round(W.high / Math.max(0.25, W.t))} m up, her target lost ${Math.round((100 * W.lost) / Math.max(0.25, W.t))}% of it, she in cloud ${Math.round((100 * W.cloud) / Math.max(0.25, W.t))}%`;
  const took = { broadside: 0, light: 0 }, rakes = { player: 0, raider: 0 }, count = { warns: 0, patches: 0, shots: 0 };
  const nerve = { struck: 0, ran: 0, away: 0, flares: 0, help: 0, captains: 0, roads: 0 };
  // (the shards she could have had: every one spilled, and each wave's bonus; and those she gathered, and the time she
  // spent steering for them)
  const could = { spilled: 0, bonus: 0, got: 0, steer: 0 };
  // the nearest shards she can reach before they fall away (turning to them at her own rate, then sailing at least at
  // 20 m/s till they're drawn to her, 140 m off), within 700 m: whenever no raider is left within 500 m of her
  const shardsFor = (P, live) => {
    if (!gather || P.down || live.some((r) => r.f.pos.distanceTo(P.pos) < 500)) return null;
    let best = null, bd = 700;
    for (const s of g.pickups.list) {
      if (s.pulled) continue;
      const d = s.p.distanceTo(P.pos), a = Math.atan2(s.p.x - P.pos.x, s.p.z - P.pos.z) - P.heading, w = Math.abs(Math.atan2(Math.sin(a), Math.cos(a)));
      if (d < bd && s.life > w / P.H.turn + Math.max(0, d - 140) / Math.max(20, P.speed) + 1) { bd = d; best = s; }
    }
    return best;
  };
  let dodgeFrom = -1, dodgeUntil = -1, dodgeDir = 1, changed = -99;
  const last = first - 1 + waves, most = 240 * waves + 60; // (sim seconds: a fortress, or a treasure ship running, can take minutes)
  // each treasure ship caught (her colours struck, or blown up) or got away, so a treasure wave says how it went; the
  // damage the raiders' guns did her (a broadside's shot is the heavier), raking hits each way, and her tactics
  const offs = [g.events.on('raider:down', (e) => {
    if (e.raider.role === 'prize') { caught++; out.push(`  t=${t.toFixed(0)} the treasure ${e.raider.R.cls} ${e.why === 'struck' ? 'struck her colours' : 'went down'}`); }
    else if (e.why === 'struck') nerve.struck++;
    if (e.raider.who) { nerve.captains++; out.push(`  t=${t.toFixed(0)} ${e.raider.who.name} (${e.raider.R.cls}) brought down`); }
  }),
    g.events.on('raider:escaped', (e) => { if (e.raider.role === 'prize') { away++; out.push(`  t=${t.toFixed(0)} the treasure ${e.raider.R.cls} got away`); } else nerve.away++; }),
    g.events.on('raider:run', () => nerve.ran++), g.events.on('flare', (e) => { if (e.stage === 'fired') nerve.flares++; else if (e.stage === 'answered') nerve.help += e.raider.flare.n; }),
    g.events.on('road', (e) => { if (e.kind !== 'steady') nerve.roads++; }),
    g.events.on('shards:spill', (e) => { could.spilled += e.total; }), g.events.on('wave:cleared', (e) => { could.bonus += e.bonus; }), g.events.on('shards:gather', (e) => { could.got += e.value; }),
    g.events.on('hit', (e) => { if (e.target === 'player') took[e.size > 1.2 ? 'broadside' : 'light'] += e.damage; if (e.raked) rakes[e.owner]++; }),
    g.events.on('warn', (e) => { count.warns++; if (dodge && !g.player.down) { dodgeFrom = t + react; dodgeUntil = t + e.time + 1.2; dodgeDir = g.player.pos.y > 2000 ? -1 : 1; } }),
    g.events.on('patch', (e) => { if (e.stage === 'start') count.patches++; }),
    g.events.on('shot', (e) => { if (e.why !== 'earned') count.shots++; })];
  out.push(`  wave ${first}: ${g.describe(g.waveAt(first - 1, g.SKIES[skies].extra, null, g.giants))}`);
  const KEY = { round: '1', chain: '2', breaker: '3' };
  while (g.waves.n < last && t < most) {
    const P = g.player, live = g.raiders.list.filter((r) => !r.f.down);
    let ctl = { fire: false, sail: 0.6, turn: 0, climb: height !== null && g.waves.state !== 'fight' ? Math.max(-1, Math.min(1, (+height - P.pos.y) / 40)) : 0 };
    if (live.length && !P.down) {
      live.sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
      const r = live[0], T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      if (r.lost && g.waves.state === 'fight') { lostT += 0.25; W.lost += 0.25; }
      // (the crosshair on her: the view looks along its middle from the point it turns round, which moves out over her
      // rail looking down (main.js pivot), so it's found again for the way it looks, twice over)
      const look = r.f.pos.clone().sub(T).normalize();
      for (let k = 0; k < 3; k++) {
        g.cam.pitch = Math.max(-0.35, -Math.asin(look.y)); const a = Math.atan2(look.x, look.z) - P.heading; g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
        if (!g.pivot || k === 2) break;
        g.pivot(g.cam.yaw, g.cam.pitch, T); look.copy(r.f.pos).sub(T).normalize();
      }
      const dist = r.f.pos.distanceTo(P.pos), bs = P.ship.recipe.ports ? 1 : 0, runner = (r.role === 'prize' && r.fleeing) || r.mode === 'run';
      // broadside ships keep it abeam at 300 m; others point at it, and every ship chases a treasure ship that runs
      // bow-on under full sail, firing her bow guns. Crossing bows: a broadside ship makes for 350 m ahead of a
      // broadside raider first, then turns her side to bear down the raider's length
      let want = bs && dist < 700 && !runner ? g.cam.yaw - Math.sign(g.cam.yaw || 1) * Math.PI / 2 : g.cam.yaw;
      if (policy === 'cross' && bs && !runner && r.role === 'broadside' && dist < 900) {
        const X = r.f.pos.clone().addScaledVector(r.f.forward(), 350);
        if (X.distanceTo(P.pos) > 150) { const w = Math.atan2(X.x - P.pos.x, X.z - P.pos.z) - P.heading; want = Math.atan2(Math.sin(w), Math.cos(w)); }
      }
      // (over a Man-o'-war's stern quarter: making for a spot above her, astern and out to one side, then keeping her
      // abeam from there, firing down at her)
      let over = 0;
      if (policy === 'fortress' && r.fort && dist < 1400) {
        const f = r.f.forward(), X = r.f.pos.clone().addScaledVector(f, -250).add({ x: f.z * 150, y: 0, z: -f.x * 150 });
        over = 80;
        if (Math.hypot(X.x - P.pos.x, X.z - P.pos.z) > 120) { const w = Math.atan2(X.x - P.pos.x, X.z - P.pos.z) - P.heading; want = Math.atan2(Math.sin(w), Math.cos(w)); }
      }
      ctl = { fire: true, turn: Math.max(-1, Math.min(1, -want * 2)), climb: Math.max(-1, Math.min(1, (r.f.pos.y + over - P.pos.y) / 40)), sail: runner ? 1 : 0, pressed: new Set() };
      if (runner && dist > 1100) ctl.pressed.add('r'); // (and Surges after one getting out of her bow guns' reach)
      // her shot: as asked, or chosen for the raider in her sights
      let shot = shotArg;
      if (shotArg === 'auto') shot = r.role === 'prize' && dist < 850 ? 'chain' : (r.id === 'manowar' || r.captain) && g.gunnery.breakers > 0 ? 'breaker' : 'round';
      // (a change of shot reloads every battery, so like a person she keeps a shot loaded a while before changing again)
      if (shot !== g.gunnery.shot && (shot !== 'breaker' || g.gunnery.breakers > 0) && t - changed >= 5) { ctl.pressed.add(KEY[shot]); changed = t; }
      // (breakers on a fortress are fired from above her: climb over her)
      if (shot === 'breaker') ctl.climb = Math.max(-1, Math.min(1, (r.f.pos.y + 70 - P.pos.y) / 40));
    }
    // a wreck's shards, with no raider near: steering through them under full sail (her guns still on the nearest raider)
    const shard = shardsFor(P, live);
    if (shard) {
      const a = Math.atan2(shard.p.x - P.pos.x, shard.p.z - P.pos.z) - P.heading;
      Object.assign(ctl, { turn: Math.max(-1, Math.min(1, -Math.atan2(Math.sin(a), Math.cos(a)) * 2)), climb: Math.max(-1, Math.min(1, (shard.p.y - P.pos.y) / 40)), sail: 1 });
      could.steer += 0.25;
    }
    // dodging a broadside: climbing (or diving) out of the aim of the raider readying it
    if (dodge && t >= dodgeFrom && t < dodgeUntil && !P.down) ctl.climb = dodgeDir;
    if (patch && !P.down && P.frac(P.worst()) < 0.5 && !P.patch.cd) (ctl.pressed ??= new Set()).add('x');
    g.step(0.25, ctl); t += 0.25; if (g.waves.state === 'fight') { fightT += 0.25; highT += 0.25 * P.pos.y; W.t += 0.25; W.high += 0.25 * P.pos.y; if (P.cloud > 0.6) W.cloud += 0.25; }
    if (g.waves.state === 'choose' && g.waves.choose < 15) {
      g.sailOn(road && g.waves.alt?.road === road ? 1 : 0); // after the crew have patched her up (and the road asked for, if it's offered)
      if (g.waves.n < last) out.push(`  wave ${g.waves.n + 1}: ${g.describe(g.waves.next)} (she's ${Math.round(P.pos.y)} m up)`);
    }
    if (g.waves.sunk) { sank = g.waves.n + 1; out.push(`  t=${t.toFixed(0)} SANK in wave ${sank} (her ${P.down?.why ?? '?'} gone; hull ${Math.round(P.health.hull)}, sails ${Math.round(P.health.sails)}, crystals ${Math.round(P.health.crystals)})${where()}`); break; }
    minHull = Math.min(minHull, P.frac('hull'));
    // (and where she fought it: how high on average, her target lost in cloud and she in cloud herself, for how much of it)
    if (g.waves.n !== lastWave) { out.push(`  wave ${lastWave + 1} beaten in ${(t - start).toFixed(0)} s; lowest hull ${(minHull * 100).toFixed(0)}%; downed so far ${g.downed}${where()}`); lastWave = g.waves.n; start = t; minHull = 1; Object.assign(W, { t: 0, lost: 0, high: 0, cloud: 0 }); }
  }
  if (!g.waves.sunk) g.step(1 / 60, {}); // (a raider that went down as the last wave was beaten is counted a frame later)
  offs.forEach((off) => off());
  const perMin = (n) => Math.round(n / Math.max(1, fightT / 60));
  out.push(`  downed ${g.downed}, hits ${g.hits}, shards this voyage ◆ ${Math.round(g.voyage.shards)} (of ◆ ${Math.round(could.spilled)} spilled she gathered ◆ ${Math.round(could.got)}, steering for them ${Math.round(could.steer)} s; ◆ ${Math.round(could.spilled + could.bonus)} had she gathered every one), sim time ${t} s (${Math.round(fightT)} s fighting)`);
  out.push(`  damage taken a minute of fighting: broadsides ${perMin(took.broadside)}, light guns ${perMin(took.light)}; raked: her ${rakes.player} hits, the raiders' ${rakes.raider}; ${count.warns} broadside warnings, ${count.patches} patches, ${count.shots} shot changes`);
  out.push(`  her target lost in cloud ${Math.round((100 * lostT) / Math.max(1, fightT))}% of the fighting; she fought ${Math.round(highT / Math.max(1, fightT))} m up on average`);
  out.push(`  nerve: ${nerve.struck} struck their colours, ${nerve.ran} ran (${nerve.away} got away), ${nerve.flares} flares (${nerve.help} came to help); ${nerve.captains} raider captains brought down${road ? `; the ${road} road taken ${nerve.roads} times` : ''}`);
  return { text: out.join('\n'), beaten: g.waves.n - (first - 1), sank, shards: Math.round(g.voyage.shards), could: Math.round(could.spilled + could.bonus), spilled: could.spilled, got: could.got, caught, away, fightT, took, rakes, patches: count.patches, nerve, t, lostT, highT };
};
// the voyages, `jobs` at a time, each said as soon as it and those before it are done
const results = [];
let next = 0, told = 0;
const said = () => { while (told < runs && results[told]) { console.log(`run ${told + 1} (seed ${seed0 + told}):\n${results[told].text}`); told++; } };
await Promise.all(Array.from({ length: Math.min(jobs, runs) }, async () => {
  while (next < runs) { const run = next++; results[run] = await voyage(run); said(); }
}));
if (runs > 1) {
  const all = results.filter((r) => r.beaten >= waves).length, mean = Math.round(results.reduce((a, r) => a + r.shards, 0) / runs);
  const sank = results.filter((r) => r.sank).map((r) => r.sank).sort((a, b) => a - b);
  const caught = results.reduce((a, r) => a + r.caught, 0), away = results.reduce((a, r) => a + r.away, 0);
  const reached = results.map((r) => first + r.beaten).sort((a, b) => a - b), median = reached[reached.length >> 1];
  const mins = results.reduce((a, r) => a + r.fightT, 0) / 60, sum = (f) => results.reduce((a, r) => a + f(r), 0);
  const home = Math.round(results.reduce((a, r) => a + r.shards * (r.sank ? 0.5 : 1), 0) / runs); // (sunk, her crew get her home with half)
  const could = Math.round(results.reduce((a, r) => a + r.could, 0) / runs), couldHome = Math.round(results.reduce((a, r) => a + r.could * (r.sank ? 0.5 : 1), 0) / runs);
  const gotPart = Math.round((100 * sum((r) => r.got)) / Math.max(1, sum((r) => r.spilled)));
  console.log(`summary: all ${waves} waves beaten ${all} of ${runs} times; sank in wave ${sank.length ? sank.join(', ') : '(never)'}; the middle voyage reached wave ${median}${median > first + waves - 1 ? ' (all beaten)' : ''}; ◆ ${mean} a voyage on average (◆ ${home} brought home: half when she sank; she gathered ${gotPart}% of the shards spilled; gathering every one, ◆ ${could}, and ◆ ${couldHome} home)${caught + away ? `; treasure ships caught ${caught}, got away ${away}` : ''}`);
  console.log(`  damage taken a minute of fighting: broadsides ${Math.round(sum((r) => r.took.broadside) / mins)}, light guns ${Math.round(sum((r) => r.took.light) / mins)}; raking hits: hers ${sum((r) => r.rakes.player)}, the raiders' ${sum((r) => r.rakes.raider)}; ${sum((r) => r.patches)} patches`);
  console.log(`  her target lost in cloud ${Math.round((100 * sum((r) => r.lostT)) / Math.max(1, sum((r) => r.fightT)))}% of the fighting; she fought ${Math.round(sum((r) => r.highT) / Math.max(1, sum((r) => r.fightT)))} m up on average`);
  console.log(`  nerve, a voyage on average: ${(sum((r) => r.nerve.struck) / runs).toFixed(1)} struck their colours, ${(sum((r) => r.nerve.ran) / runs).toFixed(1)} ran (${(sum((r) => r.nerve.away) / runs).toFixed(1)} got away), ${(sum((r) => r.nerve.flares) / runs).toFixed(1)} flares (${(sum((r) => r.nerve.help) / runs).toFixed(1)} came to help); a voyage took ${Math.round(sum((r) => r.t) / runs)} s on average`);
}
await browser.close();
