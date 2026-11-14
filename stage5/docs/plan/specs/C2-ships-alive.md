# Package C2: ships that move like they're alive

Source: the ships survey `../surveys/survey2-ships.json` (built on the dress/looks core that package C1 made in
src/ship/dress.js). Build: wings-fold-with-sail (wing sails fold back and spread with the sail setting; a Surge snaps
them open; pennants answer speed), aether-wakes (a glowing wake behind every ship, gold for the Captain and red for
raiders, one draw call for all; vapour trails from the wingtips in a Surge if cheap), gun-crews (lids open and guns run
out when a wave appears; they kick back on firing and run out again when reloaded; this must match package A2a's
rippling broadsides gun by gun), captain-menace (the raider captain's ship looks menacing), treasure looks (the survey's
treasure-galleon-gold, applied to whichever ship is the treasure ship: per Chris, a treasure Brig early on and treasure
Galleons once the Captain owns a Galleon, see chris-decisions.md; build the look so any class can wear it), and
manowar-weak-points (the visual part: her five crystal columns as glowing weak points that blow out one by one; the
fortress fight itself comes in a later package).

Keep every ship at its triangle budget and keep phone cost small (rigMetal is +1 draw call per ship at full and middle,
none at far, per the survey). Done means: screenshots of the wings folding/spreading, the wakes from behind and far
off, a broadside with the guns running out and kicking back, a captain's ship, a treasure ship and the Man-o'-war's
weak points, looked at; tools/check.mjs checks the fold follows the sail setting, guns run out on a wave and kick on
firing, and the wake draws; "all good"; docs updated.
