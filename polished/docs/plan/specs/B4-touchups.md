# Package B4: touch-ups after stage 2's gate

The stage 2 gate (screenshots and crops in `../gate-2/`; read them) found these. Fix each and look at before/after
screenshots at laptop, phone upright and phone sideways sizes:

1. **The title's raiders read as dark hulls with bare masts**: they cross exactly side-on, so their square sails are
   edge-on, and on an upright phone they sit high in the sky and look near. Angle their courses 25-35° toward or away
   from the camera so their rust sails show, keep them clearly far off (smaller, nearer the horizon) on an upright phone,
   and keep at least one in view most of the time.
2. **A brand-new Captain**: Fair Winds is marked "Best for your first voyage", but Crosswinds is selected, so "Set sail"
   sends a newcomer out on Crosswinds. For a brand-new save (no voyages yet), select Fair Winds. Keep old saves' choice.
   Update tools/check.mjs where it relies on the 'cross' default (set the skies explicitly in those checks instead).
3. **Fair Winds should be beaten by the simple simulated Captain in a Skiff about 7 times in 8** (the gate measured 17
   of 24). Nudge Fair Winds only, re-measure with many runs of `node tools/sim-fight.mjs skiff 5 fair`, update
   docs/game.md "How hard it is".
4. **Small layout flaws** the overlap checks miss: on a sideways phone the between-waves strip covers a rising bounty
   label; a flashing edge tag just under the ship panel puts its arrow over the panel's edge; on the upright big map
   'Verdant Wilds' and 'Hearthsea' nearly touch; on a sideways phone the port blurb's last line tucks under the Buy
   button's fade; in the upright port the ship is small and the bottom quarter of the panel is empty (use the space:
   a bigger ship, or the panel sized to its content). Extend the overlap checks where they can catch these.
5. **The title draws 73 times a frame against 42 at sea.** Bring the title's draw count down (e.g. the crossing raiders
   at far detail, fewer shadow casters, fewer puffs on phones) so the title is cheaper than a voyage on a phone.
6. **Phone gunsmoke from the play view is a modest patch** (one puff a port). Make it read better within the phone
   budget (e.g. bigger, longer-lived puffs on a phone rather than more of them).
7. docs/game.md says "black smoke" for wrecks; the column is dark grey. Make it darker near the wreck if that looks
   right, or change the words. Make docs/game.md's list of what the check does readable for Chris (short, plain),
   keeping the technical detail in the check's own header comment.

Done means: before/after screenshots looked at; tools/check.mjs ends "all good"; docs updated.
