# Package A2b: debris, wrecks worth watching, bounties, slow motion and a Surge that feels fast

Design source: the combat-feel survey, `../surveys/survey1-feel.json`. Package A2a has built `src/game/events.js` (the
event bus), `src/game/fx.js` (pooled sparks and smoke, camera trauma and kick, the time dial) and the rippling
broadsides; build on them, emitting and listening through the bus. Build these proposals:

1. **matched-debris**: wood splinters, canvas scraps (in the sail colour of the ship hit: cream for the Captain, rust
   for raiders, black for a raider captain), glittering crystal shards. Instanced, pooled, budgets scaled by fx.q.
2. **wreck-spectacle**: chain blasts walking along the hull, crystals sputtering out, sails flaring up, the roll, a
   thick smoke column, and the cloud deck torn where she falls through (if the proposal's way of doing that is cheap;
   otherwise a burst of cloud puffs where she passes the deck). Emit `blast` for every explosion. A treasure ship that
   strikes her colours does NOT blow up: she lowers her flags and settles, with a gold glint.
3. **bounty-popup** and the counting-up shard counter (this also fixes the missing flash style for gathering shards
   if A1 hasn't already).
4. **last-raider-slowmo**, and the between-waves card rising only after it (keep tools/check.mjs's voyage test
   working: it must wait for the card).
5. **surge-speed**.
6. If there's room in the budgets after measuring: **falling-masts** on the laptop only (phones skip it).

Done means: works on laptop and phone, budgets respected (measure the worst case: a Man-o'-war going down near two
other wrecks, on the phone budget), tools/check.mjs has checks for these and ends with "all good", docs/game.md
describes them in plain words.
