# Package D3-touchups: touch-ups after stage 4c's gate

Stage 4c's gate (October 13) found these. Fix each and look at before/after screenshots at laptop (1280x800),
upright-phone (390x844) and sideways-phone (844x390) sizes:

1. **"Lost in the cloud" while plainly in sight.** In a storm, wave 13's line of battle sails into its bank of cloud
   and is "Lost in the cloud" for 30 to 40 s (from about 1,060 m to 220 m) while its ships are still drawn clearly;
   their tags wait stacked where they were last seen and you can't lock on. In clear weather the white bank does
   hide them. The bank's hiding shape (world.js inside(): a squashed ball 0.7 x 0.38 of the cloud's size) is much
   bigger than what the cloud pictures cover, worst when a storm greys them, and a ship in its front half is drawn in
   front of the cloud. Make hiding match what the player sees: a raider is lost only while the cloud really covers
   her (or the cloud drawn really covers the hiding shape). Check: no raider is "lost" while most of her shows.
2. **The road choice should be a real choice.** At the gate a Captain taking every road offered did worse than one
   who always sailed on (storm 25 in 48, treasure 20 in 48, hunt 26 in 48, against about two in three), and the
   treasure road's gap is unexplained (it only changes wave 3, yet those voyages lost more in waves 7 and 8). Find
   out why, and tune so each road is a fair trade of risk for shards. First make tools/sim-fight.mjs runs independent
   (batches differ more than chance allows: e.g. a fresh page or a fresh random seed per voyage), then measure.
3. **Your own Man-o'-war hides her foe.** Sailing the Man-o'-war and aiming down at a raider Man-o'-war ahead and
   below, your own ship hides most of her. Let the view see past your own big ship when aiming down (for example the
   camera rising or drawing back a little with the aim), on a laptop and a phone.
4. **Small looks.** A struck raider's white flag is hard to pick out against white haze at about 220 m (make it
   read, e.g. bigger or edged darker far off). Crystal breakers fired level at a side-on Frigate 380 m off mostly
   miss because they aim at the tops of her crystals: aim them where a level volley can land. Looking down, the sea's
   glitter shows as a field of white specks: soften it. On an upright phone, a wave bursting up through the clouds
   ahead-left can be off the narrow view: make sure its edge tag and toast lead the eye there.

Done means: before/after screenshots looked at; tools/check.mjs checks items 1, 3 and the breakers' aim, and ends
"all good"; docs/game.md "How hard it is" updated for the roads.
