// events.js: the game's news, in one place. Whatever happens that something else might want to answer (a gun going
// off, a shot landing, a raider going down, a wave starting, a ship bought in port) is told here, and the effects
// (fx.js), the sound and music, the first-voyage guide and the commendations listen for it. Nothing here knows who's
// listening, so each of them can be added or taken away without touching the rest of the game.
//
// Every event has ONE payload object, made once and filled in afresh each time (a fight tells hundreds of these a
// second, and a phone would stutter clearing away a new object for each). So a listener reads it straight away and
// copies anything it wants to keep; it never holds on to the payload or its vectors.
//
//   mode            { mode }                     'title', 'port' or 'voyage': the screen changed
//   pause           { on }                       the voyage paused (true) or resumed (false); leaving a paused voyage
//                                                for port tells it ended (false) just before voyage:end
//   voyage:start    { ship, skies }              set sail: the ship's id ('brig'...), the skies' id ('cross'...)
//   voyage:end      { kept, sunk, waves }        back in port: shards banked, whether she went down, waves beaten
//   fire            { owner, kind, battery, p, dir, weight, ship, vel, i, n, raider }
//                                                one gun going off: 'player' or 'raider'; 'chaser' or 'broadside';
//                                                'bow', 'port', 'starboard' or 'stern'; where its muzzle is and which
//                                                way it points (world); the shot's weight; the ship's class id; the
//                                                ship's velocity; this gun's place in the volley (from 0) of n guns;
//                                                the raider firing (null for the Captain's guns)
//   volley          { owner, battery, count, kind, ship, p }
//                                                a battery starting to fire (its guns ripple off after it, bow first);
//                                                p is its middle gun
//   hit             { owner, target, part, at, damage, raider, dir, vel }
//                                                a shot landing: who fired it, 'player' or 'raider' hit, 'hull',
//                                                'sails' or 'crystals', where (world), how hard, the raider: the one
//                                                hit, or the one that fired at the Captain (she may be going down by
//                                                then; null for a shot no raider's guns fired), which way the shot was
//                                                flying (a unit vector), and the velocity of the ship it hit
//   nearMiss        { pan, close, at }           a raider's shot just missing the Captain's ship: pan -1 (left of the
//                                                view) to 1 (right), close 0 (barely) to 1 (a hair's breadth)
//   raider:down     { raider, why, at }          'hull', 'crystals' or 'struck' (a treasure ship giving up)
//   raider:escaped  { raider }                   a treasure ship got away
//   blast           { at, size, big, first }     an explosion (a raider blowing up, and each blast of the chain that
//                                                walks along her hull after): how big in metres, whether it's a big one,
//                                                and whether it's the first (her blowing apart) or one of the chain
//   wreck:deck      { at, size }                 a wreck falling through the cloud deck, tearing it open (size: her length)
//   wreck:gone      { at, size, fire }           a wreck gone below the clouds; fire: she was burning (a glow and a
//                                                muffled boom under the cloud)
//   shards:spill    { at, total }                a downed raider spilling her shards
//   shards:gather   { value, run, at }           one shard gathered; run counts the shards gathered close together
//                                                (each within 1.5 s of the last), for a rising chime; at: the ship's hold
//   surge           { }                          the Captain's Surge
//   lock            { raider }                   the Captain's guns locking on to a raider (another than just before)
//   guns:ready      { battery, firing }          one of the Captain's broadsides loaded again ('port' or 'starboard'),
//                                                and whether she's holding the trigger (it fires at once, then)
//   slowmo          { seconds, scale }           the game slowing for a moment (the last raider of a wave going down,
//                                                or the Captain's ship): for how long (real seconds), how slow at most
//   wave:start      { n, title, captain, prize, fortress, count }
//                                                wave n (from 1) arriving: its banner, and whether it has a raider
//                                                captain, a treasure ship or a Man-o'-war, and how many ships
//   wave:cleared    { n, bonus }                 wave n beaten, and the shards it added
//   player:down     { why }                      the Captain's ship going down ('hull' or 'crystals')
//   player:low      { part }                     one of her parts dropping below 30%
//   region          { name }                     the Captain's ship crossing into another region (its name shown)
//   port:buy        { ship }                     a ship bought
//   port:upgrade    { ship, mod, step }          an upgrade bought (step: how many of it she has now)
//   port:power      { ship, power }              the crystal power moved (-2 sails .. 2 guns)
//   port:skies      { skies }                    other skies chosen
// (the sound, sound.js, answers nearly all of them)
import { Vector3 } from 'three';

const v = () => new Vector3();
// the payloads, with every field from the start (so each keeps one shape, which is quicker to read)
export const PAYLOAD = {
  mode: { mode: '' },
  pause: { on: false },
  'voyage:start': { ship: '', skies: '' },
  'voyage:end': { kept: 0, sunk: false, waves: 0 },
  fire: { owner: '', kind: '', battery: '', p: v(), dir: v(), weight: 1, ship: '', vel: v(), i: 0, n: 1, raider: null },
  volley: { owner: '', battery: '', count: 0, kind: '', ship: '', p: v() },
  hit: { owner: '', target: '', part: '', at: v(), damage: 0, raider: null, dir: v(), vel: v() },
  nearMiss: { pan: 0, close: 0, at: v() },
  'raider:down': { raider: null, why: '', at: v() },
  'raider:escaped': { raider: null },
  blast: { at: v(), size: 0, big: false, first: false },
  'wreck:deck': { at: v(), size: 0 },
  'wreck:gone': { at: v(), size: 0, fire: false },
  'shards:spill': { at: v(), total: 0 },
  'shards:gather': { value: 0, run: 0, at: v() },
  surge: {},
  lock: { raider: null },
  'guns:ready': { battery: '', firing: false },
  slowmo: { seconds: 0, scale: 1 },
  'wave:start': { n: 0, title: '', captain: false, prize: false, fortress: false, count: 0 },
  'wave:cleared': { n: 0, bonus: 0 },
  'player:down': { why: '' },
  'player:low': { part: '' },
  region: { name: '' },
  'port:buy': { ship: '' },
  'port:upgrade': { ship: '', mod: '', step: 0 },
  'port:power': { ship: '', power: 0 },
  'port:skies': { skies: '' },
};
// Each event's listeners, in the order they started listening. A listener may stop listening (or another start) while
// the event is being told: one that stops is only blanked out until the telling is over (taking it out of the list there
// and then would make the next one miss it), and is told no more; one that starts is told from the next time on
const subs = {}, telling = {}, blanked = {};
for (const k in PAYLOAD) { subs[k] = []; telling[k] = 0; blanked[k] = false; }
const known = (name) => { if (!subs[name]) throw new Error(`no such event: ${name}`); return subs[name]; };

// listen for an event; returns a function that stops listening
export function on(name, fn) { known(name).push(fn); return () => off(name, fn); }
export function off(name, fn) {
  const L = known(name), i = L.indexOf(fn);
  if (i < 0) return;
  if (telling[name]) { L[i] = null; blanked[name] = true; } else L.splice(i, 1);
}
// the payload to fill in before telling an event (the same object every time)
export const payload = (name) => PAYLOAD[name];
// tell everyone listening; the payload is the event's own unless another is given
export function emit(name, p = PAYLOAD[name]) {
  const L = known(name);
  telling[name]++;
  try {
    for (let i = 0, n = L.length; i < n; i++) { const f = L[i]; if (f) f(p, name); }
  } finally {
    if (--telling[name] === 0 && blanked[name]) {
      blanked[name] = false;
      let j = 0;
      for (let i = 0; i < L.length; i++) if (L[i]) L[j++] = L[i];
      L.length = j;
    }
  }
  return p;
}
// how many are listening (for tests)
export const listeners = (name) => { let n = 0; for (const f of known(name)) if (f) n++; return n; };
