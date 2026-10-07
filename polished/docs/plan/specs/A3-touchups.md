# Package A3: touch-ups after stage 1's gate

The stage 1 gate (screenshots in `../gate-1/`, read them) found these. Fix each, look at before/after screenshots:

1. **Gunsmoke reads as a faint veil, not billowing smoke.** In src/game/fx.js's 'fire' listener the puffs are 3-7 m,
   opacity ~0.55, pale grey against a white cloud floor. Make a broadside leave a proper bank of white-grey powder smoke
   that billows out fast from each port and drifts back along the side (bigger, more opaque early, a slightly darker
   shade so it separates from the cloud floor, perhaps 2 puffs per port on a laptop), still within the phone budget.
   It must show from the normal play view too (behind and above the ship), not only from the side.
2. **Wreck smoke column looks like a smooth grey rope** (and on a sideways phone it split into two parallel ropes; a
   falling mast's trail looks like a string of beads). Give the column billow: vary puff sizes, spawn jitter and drift,
   shade variation, growth, so it reads as rolling smoke. Fix the two-rope split.
3. **A raider captain's black canvas scraps show as flat black squares.** Make debris scraps read as torn cloth (shape
   and lighting), including black ones.
4. **Phone warning gap**: a raider alongside is usually off screen on a phone, so her glowing ports can't be seen.
   While a raider is charging her broadside, flash her edge tag (and its arrow) red, and mark the tag "Broadside!".
   Do the same on a laptop when she's off screen.
5. **events.js**: emit() loops by index while off() splices, so a listener that unsubscribes during an emit makes the
   next listener miss the event. Make it safe.
6. **Fair Winds is meant for learning the ropes**, but the simple simulated Captain in a Skiff now beats the wave-5
   raider captain only about one time in three on Fair Winds. Ease Fair Winds (e.g. raider captains less tough there),
   so `node tools/sim-fight.mjs skiff 5 fair` gets through all five waves most of the time; leave Crosswinds and
   Maelstrom as they are. Update docs/game.md "How hard it is" (run each sim several times; one run is too random).
7. Two leftovers from A2b: a falling raider drawn at far detail still shows her far model's bare masts (hide them like
   the middle model's); the bounty label draws under the wave banner when they overlap (keep it readable).

Done means: screenshots before/after for 1-4 at laptop and phone sizes, looked at; tools/check.mjs has a check for 4
and 5; ends "all good"; docs updated.
