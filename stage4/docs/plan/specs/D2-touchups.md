# Package D2-touchups: touch-ups after stage 4a's gate, and a sea trial in port

Stage 4a's gate (October 9) found these. Fix each and look at before/after screenshots at laptop (1280x800),
upright-phone (390x844) and sideways-phone (844x390) sizes, plus the smallest sideways phone (568x320) where it says so:

1. **HUD text over your own ship on a phone.** On an upright phone, the edge tag of a raider behind you sits on your
   ship's stern, just above the guns' label. On a sideways phone, the warning line under the crosshair ("The crystals
   are cracked: she's sinking") lies across her sails. Together they cover much of a battered ship seen from behind,
   just when Chris wants to see her scars. Keep raider tags and the warning line off the Captain's own ship (her box
   on the screen), in every ship from the Skiff to the Man-o'-war, without hiding the tag or the warning. Check it.
2. **The smallest phone's banner.** At 568x320 held sideways (a small phone with the browser's bars showing), the
   first voyage's banner "Your first voyage, Captain" takes three lines and runs over the compass. Make banners fit
   there, and add 568x320 and 640x360 to the check's HUD layout test.
3. **A new Galleon is no step up yet.** Against waves 10-15, a fully upgraded Frigate (◆ 2,200 plus ◆ 7,680 of
   upgrades) beats all six 2 times in 7, but a new Galleon with no upgrades (◆ 12,000) never beat wave 15 in 24 runs.
   Buying her should feel mighty at once: tune the Captain's Galleon (and check the Man-o'-war the same way) so that
   with no upgrades she clearly does better than a fully upgraded Frigate against waves 10-15, and the Man-o'-war
   better again, while both stay beatable by the late waves, giant raiders included. Use `tools/sim-fight.mjs` with
   many runs (one is too random); keep docs/game.md "How hard it is" and docs/ships.md true.
4. **The frame-time tests trip on a busy machine.** One full check failed by 0.3% on the weather frame test while
   other work ran beside it, though it passes with a wide margin on its own. Make such comparisons fair under load
   without loosening them: for example measure the two sides interleaved (A, B, A, B...) so a busy machine slows
   both alike, and take the median. Never raise the limits to get "all good".
5. **A sea trial in port.** On Chris's new link he starts with no shards, so he can't fly the Galleon or the
   Man-o'-war until he has earned ◆ 12,000. Like a garage's test drive, let the port take out any ship you don't own
   yet for a short sea trial: one fight that suits her (for the big two, a late wave), with a plain button such as
   "Try her out" beside Buy. A trial earns and costs nothing, changes nothing in the save (shards, ships, upgrades,
   skies, records), never counts as owning her (so it never brings giant raiders), and comes home to the same port
   screen afterwards, with a short line saying what she cost. It works on a laptop and a phone (all three sizes), and
   the check proves the save is untouched after a trial, won or lost.

Leave for D2b: waves coming out of a cloud bank keep their raiders hidden until about 500 m (it's the game's own
design; D2b's wave arrivals rework how waves come in).

Done means: before/after screenshots looked at; tools/check.mjs checks each item and ends "all good"; docs/game.md
(and docs/ships.md for the balance) updated.
