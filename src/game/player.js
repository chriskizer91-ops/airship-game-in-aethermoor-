// player.js: flying the Captain's ship. How fast it goes, how tight it turns and how quickly it climbs all come from
// its stats in docs/ships.md (src/ships/index.js), so the four ships feel different:
//   top speed = 14 + 3.2 m/s per point of speed   (the Cutter's 10 is 46 m/s, about 165 km/h)
//   turning   = 0.06 + 0.028 radians a second per point   (the Skiff's 10 turns a full circle in 18 seconds)
//   climbing  = 3 + 2.1 m/s per point
// The sails are set with W/S (or the phone's sail buttons); the crystals' lift gives out near the Thinning.
import * as THREE from 'three';
import { THINNING } from './world.js';

export function handling(st) {
  return { vmax: 14 + 3.2 * st.speed, turn: 0.06 + 0.028 * st.turning, climb: 3 + 2.1 * st.climbing };
}

export function makePlayer(ship, stats, start) {
  const H = handling(stats);
  const s = {
    ship, stats, H,
    pos: start.pos.clone(), heading: start.heading, speed: H.vmax * 0.45, sail: 0.5, vy: 0, turn: 0, climb: 0,
    velocity: new THREE.Vector3(),
  };
  s.forward = () => new THREE.Vector3(Math.sin(s.heading), 0, Math.cos(s.heading));
  s.update = (dt, input) => {
    s.sail = Math.min(1, Math.max(0, s.sail + input.sail * dt * 0.5));
    const target = s.sail * H.vmax;
    s.speed += (target - s.speed) * (1 - Math.exp(-dt * (target > s.speed ? 0.35 : 0.6)));
    // controls are eased in, the way a heavy ship answers its wheel
    s.turn += (input.turn - s.turn) * (1 - Math.exp(-dt * 3));
    s.climb += (input.climb - s.climb) * (1 - Math.exp(-dt * 2.5));
    const grip = 0.35 + 0.65 * Math.min(1, s.speed / (H.vmax * 0.3));
    s.heading -= s.turn * H.turn * grip * dt;
    // lift fades in the thin air near the Thinning, and the ship can't go higher than it
    let want = s.climb * H.climb;
    if (want > 0) want *= Math.max(0, Math.min(1, (THINNING - s.pos.y) / 400));
    if (s.pos.y < 90 && want < 0) want *= Math.max(0, (s.pos.y - 60) / 30);
    s.vy += (want - s.vy) * (1 - Math.exp(-dt * 2.2));
    s.velocity.copy(s.forward()).multiplyScalar(s.speed).setY(s.vy);
    s.pos.addScaledVector(s.velocity, dt);
    s.pos.y = Math.min(THINNING, Math.max(60, s.pos.y));
    ship.root.position.copy(s.pos);
    ship.root.rotation.y = s.heading;
    ship.update(dt, { turn: s.turn * Math.min(1, s.speed / (H.vmax * 0.4) + 0.2), climb: s.vy / H.climb });
  };
  return s;
}
