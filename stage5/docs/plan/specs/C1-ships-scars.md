# Package C1: ships that show their scars (and get patched up)

Source: the ships survey `../surveys/survey2-ships.json` (read its `summary` and `architecture` in full: the shared
"dress + looks" core, per-ship material clones that share their compiled shaders, one uniform set per ship, the
pitfalls it lists). Also the combat-feel survey's battle-scars idea (`../surveys/survey1-feel.json`, id battle-scars: smoke
and fire from where she was hit) and what packages A2a/A2b built (fx.js, the event bus, debris, wrecks).

Build: the dress/looks core (`src/ship/dress.js`, used by the game AND the ships demo page), holed-tattered-sails,
scorched-holed-hull, dying-crystals, hull-fire-tongues, repairs-and-patches (between waves the crew patch her: holes
become stitched patches, fires go out; in port she's spotless), battle-scars (smoke from where she was hit), and
hangar-battle-worn (New / Battered / Wrecked buttons on the ships demo, dist/hangar.html, so Chris can see the scars on
his phone).

It applies to the Captain's full-detail ship and every raider's middle and far copies. Each ship stays at its
triangle budget (tools/check.mjs's hangar table); count programs/draw calls before and after (the survey measured 19→22
programs for a dressed Brig, unchanged for a second copy) and keep it there.

Done means: screenshots (laptop and phone) of a Brig and a Frigate as new, battered and wrecked in the hangar and in a
battle, looked at; hits land where they show; patches between waves; tools/check.mjs proves a hit on the sails makes a
hole uniform where it struck, patching works, program counts stay flat with three raiders of one class, and it ends
"all good"; docs/game.md and docs/ships.md updated in plain words.
