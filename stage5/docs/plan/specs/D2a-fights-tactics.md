# Package D2a: tactics: shot types, dodging broadsides, raking fire, and the crew patching her

Source: the gameplay survey `../surveys/survey2-gameplay.json` (read `summary` and `architecture` in full: src/game/tactics.js
holds the fight rules) and Chris's decisions `../chris-decisions.md` (shot types: yes, all three, bought in port, cycled
in flight with one key on a laptop and one button on the phone; 1/2/3 may pick directly too). Packages A2a (the
raider broadside warning: ports glowing red), C3 (cloud hiding) and D1 (the big two for the Captain) are built; extend
rather than duplicate them.

Build: shot-types (round, chain, crystal breakers; unlocked by deeds as proposed AND buyable in port; the phone button
fits the touch layout without crowding), broadside-warning-dodge (on top of A2a's glowing ports: the red danger fan,
"Broadside!" on her tag, her gunners aiming where you're heading, the per-skies warning time and the reload balance),
raking-fire, crew-patch (X on a laptop; a Patch button beside Surge on the phone when she's hurt), and smarter-raiders
on Crosswinds and Maelstrom if the balance allows.

Balance with tools/sim-fight.mjs (extend it so the simulated Captain can use the new tools, and report both a Captain
who ignores them and one who uses them). Keep docs/game.md "How hard it is" true, and describe each new tool in plain
words in docs/game.md with its laptop key and phone control.

Done means: every tool works on laptop and phone (screenshots of the shot button, a chain-shot volley, the danger fan,
a rake, a patch, looked at); tools/check.mjs checks each (damage multipliers per part, the fan and the dodge, the rake
bonus, patching and its cost) and ends "all good".
