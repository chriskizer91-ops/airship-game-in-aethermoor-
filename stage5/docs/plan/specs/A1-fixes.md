# Package A1: fix the verified bugs, and make the check trustworthy and quicker

Sources: the bug hunt `../surveys/survey1-bugs.json` (each finding's failure scenario and proposed fix, and `voyage_test`,
the root cause of the failing check) and the skeptics' verdicts `../surveys/survey2-verdicts.json` (each says whether the
finding is real and gives the best fix, sometimes refining the hunt's). The skeptics' fix wins where they differ.
The bug hunt's scripts are in `../../survey/bugs/` if you want to reuse a reproduction.

Fix every finding marked real: F01, F02, F03, F04, F05, F06, F07, F08, F09, F10, F11, F12, F13, F16, F17, F18, F19.
Skip F14 and F15 (refuted).

Notes:
- **F01 first** (the next wave leaking into the next voyage). Put every per-voyage reset in one place called by sail()
  (W including `next: null`, V, hurt, camera shake, bolts, smoke, pickups, raiders). Then harden the whole-voyage test
  in tools/check.mjs: record the raiders that spawn in wave 1 and fail with a clear message unless it's one Skiff;
  give the scripted Captain `sailTo` instead of a sail rate where that's what it means. Add a test that banking from
  the "Wave N beaten" card and sailing again starts at wave 1 with one Skiff.
- **F02** (cloud noise worked out several times per pixel): keep the look identical to the eye. Compare before/after
  screenshots from the same seed/time (e.g. __game.fly('brig') with a fixed position and world.time) and look at them.
- **F04/F12/F19** (garbage and needless uploads): the next package (A2a) rewrites the sparks, smoke and bolts into
  pooled buffers, so here fix only what's outside those systems (main.js placeCamera/aimFor/tags/hud/hitTest, raiders.js
  steer/shoot, flight.js, pickups.js, damage.js), plus anything in guns.js/effects.js that's a one-line fix. Measure
  the garbage per second in a scripted 3-raider fight before and after (performance.memory with
  --enable-precise-memory-info, or the bug hunt's method) and report both numbers.
- **F05** (sun shadows never land): make the shadow camera follow the ship so the ship's own masts and sails shadow its
  deck, sized to the ship; on phones keep the 1024 map. Look at a before/after close screenshot of a deck.
- **F07** (phone: aim and fire together): sliding the thumb from the Fire button aims, as the playtest suggests, and
  the camera doesn't swing back while a thumb is resting on the aiming side.
- **F08** (WebGL context lost): handle webglcontextlost/restored so the game recovers with its lighting intact.
- **F09** (old tab overwriting newer progress from another device): newest save wins, checked before every write.

Also add a quicker way to check during work: `node tools/check.mjs --quick` that runs only the game page at laptop
size (skipping the hangar and the phone page), printing "all good (quick)" at the end. The full run stays the gate.

Done means: every real finding fixed, a check added where one can prove it (F01, F03, F06, F07, F10, F11, F13, F16,
F17, F18 at least), `node tools/check.mjs` ends with "all good" (it failed before this package because of F01),
`node tools/sim-fight.mjs skiff 5 cross` and `brig 8 cross` still give results in line with docs/game.md "How hard it
is" (update the doc if F01's fix changes them), and docs/game.md mentions anything a player would notice.
