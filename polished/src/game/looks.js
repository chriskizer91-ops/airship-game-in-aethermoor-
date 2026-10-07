// looks.js: every ship shows her scars (her looks, drawn by src/ship/dress.js), kept up to date as the fight goes:
//   a hit           put where it struck: a scorched hole in her planks or deck, glowing with embers for a few seconds
//                   then smouldering; a ragged hole through her canvas (one close by grows instead); a crystal cluster
//                   dimming and cracking with the damage it takes
//   as she weakens  her hull gets sooty and streaked; her torn sails fray from their free edges and flap harder; below
//                   a third of her crystals they all sputter; badly holed, she lists towards the side that took the most
//   below a quarter flames burst from her two worst wounds (three below an eighth), streaming back as she flies; going
//   of her hull     down holed, she burns all along her scars (src/ship/flames.js: one draw for the whole sky)
//   between waves   the crew patch her up: the fires go out and the embers cool, each hole in her sails is sewn over
//                   with a square of new canvas, each hole in her planks becomes a square of fresh planks and its soot
//                   fades, and her crystals' cracks fade as they mend. Raiders never patch theirs
//   in port         she's as good as new again (reset)
// The smoke from a damaged ship comes from her scars too (effects.js), and from the tips of her flames.
// Every ship's scars are kept on her (ship.wear), with plain numbers only: nothing is made new each frame.
import * as THREE from 'three';
import { makeWear, hullPoint, wingPoint, sputter } from '../ship/dress.js';
import { makeFlames, shipFlames } from '../ship/flames.js';
import { smooth } from '../ship/kit.js';
import { on } from './events.js';

// a scar's size for a shot of size 1 (a chaser; a broadside is 1.35), metres: in the planks (its soot reaches about
// twice that), and in the canvas; how fast a scar's embers cool (a share a second) and how warm it stays smouldering;
// the hull's share below which she burns (two flames), and three; how far she lists, at most (radians: a raider, and
// the Captain's, less, so her guns' tilt hardly changes); how long a sail's hole takes to be sewn over (seconds)
export const SCAR = { hull: 1.4, sail: 1.0, cool: 0.2, smoulder: 0.15, burn: 0.25, burnMore: 0.12, list: 0.07, listCaptain: 0.04, sew: 4 };

export function makeLooks({ scene, touch = false }) {
  const flames = makeFlames(touch ? 16 : 28); scene.add(flames.mesh);
  let player = null; // the Captain (flight.js)
  // (the flames are drawn once with none in them as a voyage starts, so their shader is ready before the first fire:
  // made then, it would stutter a phone at a dramatic moment)
  let warm = true;
  const wearOf = (ship) => (ship.wear ??= makeWear(ship));
  const inv = new THREE.Matrix4(), la = new THREE.Vector3(), ld = new THREE.Vector3(), lp = new THREE.Vector3(), ln = new THREE.Vector3();

  // a shot landing (events.js): on the raider hit, or on the Captain's ship
  on('hit', (e) => {
    const ship = e.target === 'raider' ? e.raider?.ship : player?.ship;
    if (ship) hit(ship, e.part, e.at, e.dir, e.damage, e.size);
  });
  // a hit on `ship`'s part at `at` (the world), flying along `dir`, `damage` hard, from a shot `size` big
  function hit(ship, part, at, dir, damage, size = 1) {
    const W = wearOf(ship);
    inv.copy(ship.body.matrixWorld).invert();
    la.copy(at).applyMatrix4(inv); ld.copy(dir).transformDirection(inv);
    if (part === 'hull') { hullPoint(ship.hull, la, ld, lp, ln); W.scar(lp, ln, SCAR.hull * size, 1); W.from = -1; }
    else if (part === 'sails') { const w = wingPoint(ship.wings, la, ld, lp); if (w) W.hole(lp, SCAR.sail * size, w); }
    else W.dmg[W.cluster(la)] += damage;
    W.write();
    return W;
  }

  // every frame: each ship's looks from how she stands, and the flames
  function update(dt, time, raiders) {
    flames.begin();
    if (player) tick(player, dt, time, true);
    for (let i = 0; i < raiders.length; i++) tick(raiders[i].f, dt, time, false);
    flames.end();
    if (warm) { warm = false; flames.mesh.visible = true; }
  }
  function tick(f, dt, time, captain) {
    const ship = f.ship, W = wearOf(ship), hullF = f.frac('hull'), sailF = f.frac('sails'), crysF = f.frac('crystals'), down = f.down;
    // the fires: from her worst scars, badly holed; all of them, going down holed (not a ship that gave up)
    const fires = down ? (down.why === 'hull' ? 6 : 0) : hullF < SCAR.burnMore ? 3 : hullF < SCAR.burn ? 2 : 0;
    W.fires = shipFlames(flames, W, fires, f.velocity);
    let hot = 0, sx = 0, sr = 0;
    W.mending = Math.max(0, W.mending - dt); // (the crew at work on her: her scars cool right down)
    for (const s of W.scars) {
      if (!s.on) continue;
      if (s.burning) s.heat = 1;
      else if (!s.patched) s.heat = Math.max(W.mending > 0 ? 0 : SCAR.smoulder, s.heat - dt * SCAR.cool);
      if (!s.patched) hot = Math.max(hot, s.heat);
      if (s.ny < 0.7) { sx += s.x * s.r; sr += s.r; } // (her list: from the scars in her sides)
    }
    W.hot = hot;
    for (let i = 0; i < W.fires; i++) { const t = flames.tip(W.firstFlame + i); W.tips[i * 3] = t.x; W.tips[i * 3 + 1] = t.y; W.tips[i * 3 + 2] = t.z; }
    // soot and grime as her hull goes; her sails fray and flap as they're torn
    W.grime = smooth(0.85, 0.15, hullF); W.fray = 0.55 * smooth(0.6, 0, sailF); W.flap = 1 + 2.5 * (1 - sailF);
    // each cluster dims and cracks with the damage it took (the share of her crystals it holds); mended, their damage
    // shrinks with what's mended
    const n = W.clusters, full = f.full.crystals, lost = full - f.health.crystals;
    let took = 0;
    for (let i = 0; i < n; i++) took += W.dmg[i];
    if (took > lost + 1e-6) { const k = lost > 0 ? lost / took : 0; for (let i = 0; i < n; i++) W.dmg[i] *= k; }
    // (going down holed or with her crystals dead, they all fade out over two seconds, sputtering)
    const fade = down && down.why !== 'struck' ? Math.max(0, 1 - down.t / 2) : 1;
    for (let i = 0; i < n; i++) {
      const col = Math.max(0, 1 - W.dmg[i] / (full / n));
      W.crys[i] = (0.2 + 0.8 * col) * fade; W.crack[i] = smooth(0.75, 0.25, col);
    }
    W.spark = crysF < 0.35 || fade < 1 ? sputter(time + W.seed) : 1;
    // badly holed, she lists towards the side that took the most hits
    const lean = sr > 0 ? Math.max(-1, Math.min(1, sx / sr / W.half)) : 0;
    const want = -lean * (1 - hullF) * (captain ? SCAR.listCaptain : SCAR.list);
    W.list += (want - W.list) * Math.min(1, dt);
    f.list = W.list;
    W.write();
  }

  // between waves (the Captain's ship only): the crew patch her up as her bars fill. The fires and embers go out, each
  // hole in her sails is sewn over (it closes up, then a patch is sewn on), each scar in her planks is patched with
  // fresh planks and shrinks with how much of her hull is mended since (to half its size, mended whole)
  function repair(ship, dt) {
    const W = wearOf(ship), f = player, hullF = f ? f.frac('hull') : 1;
    if (W.from < 0) W.from = hullF;
    W.mending = 0.25;
    const mended = W.from < 1 ? Math.max(0, Math.min(1, (hullF - W.from) / (1 - W.from))) : 1;
    for (const s of W.scars) {
      if (!s.on) continue;
      s.heat = Math.max(0, s.heat - dt);
      if (!s.patched && s.heat <= 0) { s.patched = true; s.r0 = s.r; }
      if (s.patched) s.r = s.r0 * (1 - 0.5 * mended);
    }
    for (const h of W.holes) {
      if (!h.on || h.patched) continue;
      h.sewn = (h.sewn ?? 0) + dt / SCAR.sew;
      h.r = h.r0 * Math.max(0.3, 1 - h.sewn);
      if (h.sewn >= 1) { h.patched = true; h.r = h.r0 * 0.8; h.sewn = 0; }
    }
    W.write();
  }
  // as good as new (a fresh voyage, and back in port)
  function reset(ship) {
    const W = wearOf(ship);
    W.reset(); W.from = -1; W.fires = 0; W.hot = 0; W.mending = 0; warm = true;
    if (player?.ship === ship) player.list = 0;
  }
  function clear() { flames.clear(); }
  return {
    update, hit, repair, reset, clear, flames,
    // the Captain's ship (flight.js), for the hits on her
    follow(flyer) { player = flyer; },
    // for tests: a ship's scars
    of: wearOf,
  };
}
