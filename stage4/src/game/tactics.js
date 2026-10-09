// tactics.js: the fight's own rules beyond flying and aiming, kept in one place, so raiders.js stays the raiders' minds
// and main.js the game's loop. docs/game.md ("Tactics") says each in plain words.
//   shot           three kinds of shot for the Captain's guns (Chris: round shot for all-round work, chain shot to shred
//                  sails and catch a runner, crystal breakers to crack crystals and bring a big ship down): how hard each
//                  hits the hull, the sails and the crystals, how fast and far it flies, how long it takes to load, and its
//                  colour. Chain shot is the Captain's once a treasure ship strikes her colours to her, the breakers once
//                  she sinks a raider captain's Frigate, or either is bought in port (`price`); she carries five volleys
//                  of breakers a voyage. Changing shot means drawing the old and loading the new: every battery reloads
//   raking         a broadside's shot flying down a ship's length, within 25 degrees of her bow or her stern, does half
//                  as much again: cross her bow or her stern and fire. It works both ways (main.js hitTest)
//   patching       the crew patch whatever's worst off (hull, sails or crystals) by a third over six seconds, while the
//                  guns reload at half speed; then they need thirty seconds before they can again (flight.js)
//   the warning    how long a raider's gun ports glow before her broadside is the skies' (progress.js `warn`); her
//                  gunners aim where the Captain will be if she holds her course (raiders.js), so climbing, diving or
//                  turning out of her red fan makes the whole broadside miss
//   smarter raiders  on Crosswinds and the Maelstrom (progress.js `smart`): big raiders try to cross your bow to rake
//                  you; on the Maelstrom small ones also come at your stern, and one your guns are locked on to, with
//                  your loaded broadside pointed at her, may climb or dive out of it (raiders.js steer)
import * as THREE from 'three';

// each shot: its name in words (and a short one for the phone's button), times as hard on each part, times as fast and
// as long-lived (its reach is both), times as long to load, its colour, the key that picks it, and its price in port
export const SHOTS = {
  round: { name: 'Round shot', short: 'Round', hull: 1, sails: 1, crystals: 1, speed: 1, life: 1, reload: 1, color: 0xffb347, key: '1' },
  chain: { name: 'Chain shot', short: 'Chain', hull: 0.25, sails: 2.5, crystals: 0.25, speed: 0.85, life: 0.8, reload: 1, color: 0xc9b6ff, key: '2', price: 200 },
  breaker: { name: 'Crystal breakers', short: 'Breakers', hull: 0.5, sails: 0.3, crystals: 1.6, speed: 1, life: 1, reload: 1.25, color: 0x9fe7ff, key: '3', price: 600, volleys: 5 },
};
export const SHOT_ORDER = ['round', 'chain', 'breaker'];
// each shot's little picture, on the phone's shot button and in port (drawn in the button's own colour)
export const SHOT_ICON = {
  round: '<svg viewBox="-10 -10 20 20" aria-hidden="true"><circle r="6.5" fill="currentColor"/></svg>',
  chain: '<svg viewBox="-10 -10 20 20" aria-hidden="true"><circle cx="-5.5" r="3.6" fill="currentColor"/><circle cx="5.5" r="3.6" fill="currentColor"/><path d="M-3 0q1.5-3 3 0t3 0" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  breaker: '<svg viewBox="-10 -10 20 20" aria-hidden="true"><path d="M0-8.5 5.5-2 0 8.5-5.5-2Z" fill="currentColor"/><path d="M-5.5-2h11M0-8.5v17" stroke="#1e1520" stroke-width="0.9" opacity="0.55"/></svg>',
};
// what the port says of each (round shot is always aboard)
export const SHOT_LINES = { chain: 'Spinning chain that shreds sails: slow a runner, catch a treasure ship.', breaker: 'Pale blue shot that cracks crystals: bring a big ship down. Five volleys a voyage.' };

// raking: within this cosine of her length (25 degrees), a broadside's shot does `mul` times as much
export const RAKE = { cos: 0.906, mul: 1.5 };
const fwd = new THREE.Vector3();
// times as hard a broadside's shot flying along `v` hits the ship whose body is `body` (her bow is her own +z)
export function rakeMul(v, body) {
  const e = body.matrixWorld.elements;
  fwd.set(e[8], e[9], e[10]).normalize();
  const len = v.length();
  return len > 0 && Math.abs(fwd.dot(v)) / len > RAKE.cos ? RAKE.mul : 1;
}

// the crew patching her: this share of the worst part over `time` seconds, the guns reloading at `rate` meanwhile, and
// `wait` seconds more before they can again; the phone's button shows once her worst part is below `show`
export const PATCH = { share: 0.33, time: 6, wait: 30, rate: 0.5, show: 0.7 };

// smarter raiders (smart 1, Crosswinds): a big raider crosses the Captain's bow when the Captain points at her (within
// `facing` radians, nearer than `near` metres), making for `ahead` metres in front of her. Smartest (2, the Maelstrom):
// that, and a small one makes her attack runs at `stern` metres behind her, and one locked on to with a loaded
// broadside pointed at her dodges `alt` metres up or down, a `dodge` chance a second, holding it `hold` seconds. (Small
// raiders at the Captain's stern made Crosswinds much harder for a Captain who doesn't use the tactics: sim-fight.mjs)
export const SMART = { facing: 0.52, near: 700, ahead: 250, stern: 200, dodge: 0.35, alt: 60, hold: 2.5 };
