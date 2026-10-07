// mods.js: changing a ship in port. Each ship has four upgrades, each bought in three steps with Crystal Shards, and
// one free setting, its crystal power: how much of the crystals' power goes to the sails and how much to the guns.
// loadout() turns a ship's stats and its upgrades into what the game flies and fires.
import { STATS } from '../ships/index.js';

// each in plain words (line), and exactly, a step at a time (step, in smaller print in port)
export const MODS = [
  { id: 'armour', name: 'Armour plates', line: 'A tougher hull, but a little slower.', step: 'Each step: hull +20%, top speed −4%, speeding up −10%' },
  { id: 'canvas', name: 'Fine canvas', line: 'Stronger sails, and a little faster.', step: 'Each step: sails +20%, top speed +4%' },
  { id: 'drill', name: 'Gun drill', line: 'Your gunners reload faster.', step: 'Each step: reloading 10% quicker' },
  { id: 'crystals', name: 'Cut crystals', line: 'Stronger crystals, and she climbs faster.', step: 'Each step: crystals +20%, climbing +12%' },
];
export const STEPS = 3;
// a step costs more on a bigger ship
const STEP_COST = [60, 140, 280], CLASS = { skiff: 1, cutter: 1.6, brig: 2.6, frigate: 4 };
export const modCost = (ship, step) => Math.round((STEP_COST[step] * CLASS[ship]) / 5) * 5;

// crystal power, from -2 (all to the sails) to 2 (all to the guns); each notch towards the guns: 8% faster reload and
// 6% heavier shots, but 6% less top speed and speeding up
export const POWER = ['All to sails', 'More to sails', 'Even', 'More to guns', 'All to guns'];

export function loadout(id, cfg) {
  const st = STATS[id], m = cfg.mods, p = cfg.power;
  return {
    stats: {
      ...st,
      hull: Math.round(st.hull * (1 + 0.2 * m.armour)),
      sails: Math.round(st.sails * (1 + 0.2 * m.canvas)),
      crystals: Math.round(st.crystals * (1 + 0.2 * m.crystals)),
    },
    tune: {
      speed: (1 - 0.04 * m.armour) * (1 + 0.04 * m.canvas) * (1 - 0.06 * p),
      accel: (1 - 0.1 * m.armour) * (1 - 0.06 * p),
      climb: 1 + 0.12 * m.crystals,
      turn: 1,
    },
    guns: { reload: (1 - 0.1 * m.drill) * (1 - 0.08 * p), damage: 1 + 0.06 * p },
  };
}
