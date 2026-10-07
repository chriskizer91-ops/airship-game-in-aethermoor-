# Package D0: touch-ups after stage 3's gate

Stage 3's gate (October 7) found these. Fix each and look at before/after screenshots at laptop, upright-phone and
sideways-phone sizes:

1. **Raider glows don't scale with the screen.** In src/game/raiders.js each raider's glow material is cloned and keeps
   its default uScale of 400, while the Captain's ship follows camera.userData.pixelScale (src/game/main.js). So raiders'
   crystals, lanterns and muzzle glows (and the Man-o'-war's weak points) are about half the Captain's scale on a laptop
   and dimmer still on phones. Make raider glows follow the camera's pixel scale (on resize and per template), then
   check they look right (not too big) at all sizes.
2. **The storm front looks wrong**: the approaching storm is one flat grey silhouette on the horizon that reads like a
   hazy mountain, not a billowing wall of storm cloud. Give it billows, lighter tops and darker bases, and movement.
3. **Stacked raider tags can hide their own raider** (sideways phone, two raiders 1.2-1.4 km off: the lower tag was
   pushed down over the Brig it names). In main.js tags(), push the higher tag up instead, so each ship stays visible.
4. **Scars and fire read weakly at fight distance** (70-150 m, especially on a phone): holes can't really be seen;
   flames below a quarter hull are about 4 m on a 40 m Frigate. Make the damage read at fight distance (bigger, brighter
   flames and smoke from the worst wounds, larger darker holes at middle detail) without costing a phone more.
   The Captain's own sail holes are hard to see because folded wings are edge-on to the camera: fine, but make sure a
   battered Captain's ship reads as battered from behind.
5. **Far-off wakes are faint** (at 1.1-1.4 km a raider's wake is a short, faint red smudge). Make a raider's wake a clear
   "which way she's going" cue far off, cheaply (e.g. longer and brighter with distance).
6. **Sideways ships demo**: in the Turn view the ship's keel and ram tip dip behind the button dock.
7. **The full check now takes about 25 minutes.** Make it quicker where it can be without testing less (e.g. reuse pages,
   fewer redundant screenshots, run the phone page's independent parts together), and keep `--quick` useful.

Done means: before/after screenshots looked at; tools/check.mjs ends "all good"; docs updated.
