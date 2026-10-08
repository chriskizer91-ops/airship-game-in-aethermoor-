# Package A2a: the event bus, the effects engine, and shots that land with weight

Design source: the combat-feel survey, `../surveys/survey1-feel.json` (read the full `architecture` and the proposals
named below; they were written against this exact code, with line numbers from before package A1, so re-find the
lines). Build these proposals, adjusted as described here:

1. **The event bus, as its own module: `src/game/events.js`.** Not inside fx. A tiny `on(name, fn)`, `off`, `emit(name,
   payload)`, with one reused payload object per event name (no garbage per emit; listeners must copy what they keep).
   Everything later subscribes here: the effects (this package), the sound and music (a later package), the
   first-voyage guide and the commendations (later). So emit ALL of these now, at the right places, even the ones no
   one listens to yet, and list them with their payload fields in a comment at the top of events.js:
   - `mode` {mode: 'title'|'port'|'voyage'}; `pause` {on}
   - `voyage:start` {ship (id), skies}; `voyage:end` {kept (shards banked), sunk (bool), waves (beaten)}
   - `fire` per gun {owner: 'player'|'raider', kind: 'chaser'|'broadside', battery, p (world), dir, weight, ship (recipe id)}
   - `volley` per battery fired {owner, battery, count, kind, ship, p (the middle gun)}
   - `hit` {owner (who fired), target: 'player'|'raider', part: 'hull'|'sails'|'crystals', at (world), damage, raider (or null)}
   - `nearMiss` {pan (-1..1), close (0..1), at}
   - `raider:down` {raider, why: 'hull'|'crystals'|'struck', at}; `raider:escaped` {raider}
   - `blast` {at, size (metres), big (bool)} for every wreck explosion (the next package makes wrecks blow up)
   - `shards:spill` {at, total}; `shards:gather` {value, run (how many gathered within 1.5 s of each other)}
   - `surge` {}; `wave:start` {n, title, captain (bool), prize (bool), fortress (bool), count}; `wave:cleared` {n, bonus}
   - `player:down` {why}; `player:low` {part} when a part first drops below 30%
   - `port:buy` {ship}; `port:upgrade` {ship, mod, step}; `port:power` {ship, power}; `port:skies` {skies}
2. **fx-core** (`src/game/fx.js`): as proposed (pooled struct-of-arrays sparks and smoke, glowAt, budgets scaled by
   `fx.q = touch ? 0.6 : 1`, point-size caps, camera trauma and kick springs applied after camera.lookAt, the time
   dial, `fx.stats()` for tests, exposed as `__game.fx`). fx subscribes to the bus for what it reacts to.
3. **ripple-broadsides**, including the heel and the muzzle effects. The laptop-only pooled PointLight is optional:
   skip it unless it costs nothing measurable.
4. **recoil-and-shake**, including `navigator.vibrate` on Android for hits on you (short, and never on iOS-only APIs).
   Respect `prefers-reduced-motion` (scale shake and kick down to 0.3).
5. **hit-markers**.
6. **incoming-fire** (arcs, the hurt vignette leaning to the side the hit came from, the panel row flashing,
   near-miss flare). The near-miss whizz sound comes later; just emit `nearMiss`.
7. **comet-bolts**.
8. **raider-broadside-warning**, with its balance nudge, re-checked with tools/sim-fight.mjs.

Not in this package (they come in A2b or later): matched debris, the wreck spectacle, bounty popups, slow motion,
the Surge's speed effects, falling masts, battle scars.

Done means: everything above works on a laptop and a phone, tools/check.mjs has new checks for it (as the proposals'
`test` fields suggest) and ends with "all good", the per-frame garbage in fights is lower than before (measure it
the way the bug hunt did, or with performance.memory in a headless run), docs/game.md says what changed in plain
words, and the balance lines in docs/game.md ("How hard it is") still match tools/sim-fight.mjs.
