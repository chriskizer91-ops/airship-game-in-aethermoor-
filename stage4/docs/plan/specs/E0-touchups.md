# Package E0-touchups: touch-ups after stage 4d's gate

Stage 4d's gate (October 14) found these. None is urgent; they wait for Chris to say what comes next. Fix each and
look at before/after screenshots at laptop (1280x800), upright-phone (390x844) and sideways-phone (844x390) sizes:

1. **The Galleon's late waves and gathering.** A plain Captain's Galleon beats waves 21 to 25 11 times in 24 now that
   the simulated Captain steers for a wreck's shards, against 12 in 12 when she doesn't (`--no-gather`); wave 25
   (Ironsides) sank her 6 times. Decide whether the simulated Captain should gather only once no raider is within reach
   of her guns, or whether wave 25 needs a look, then measure again (tools/sim-fight.mjs, many runs) and keep
   docs/game.md "How hard it is" in step.
2. **An old save's lifetime counts.** For a save from before version 2 the log reads "Voyages 14 (0 home, 0 went
   down)" and "Waves beaten 0", because counting starts at version 2. Say so plainly in the log (for example "counted
   since October 14"), or show only what was really counted.
3. **Raiders that got away.** When a wave's only raider runs and gets away, coming home says "Waves beaten 1 · Raiders
   downed none" with no row for her. Add a row for raiders that got away, as there is for treasure ships.
4. **Small looks from earlier stages.**
   - Inside a cloud, and in some regions' air, the mist and motes show as soft round white blobs, like out-of-focus
     lights.
   - The card between waves says "◆ 20 aboard" as it rises while the corner count keeps rising as shards are
     gathered: make them agree.
   - Held sideways, the toast under the crosshair can sit over a ship that's at the crosshair.
   - On an upright phone, a "Broadside!" tag for a raider very close by (30 m) can sit partly under the toast.

Done means: before/after screenshots looked at; tools/check.mjs checks items 2 and 3 and ends "all good"; docs/game.md
updated (and "How hard it is" for item 1).
