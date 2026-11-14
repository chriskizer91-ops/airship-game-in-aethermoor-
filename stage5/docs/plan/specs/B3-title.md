# Package B3: a title screen flying over Aethermoor, and fewer taps to the next voyage

Sources: Chris's decisions `../chris-decisions.md` (title: your ship flying slowly over Aethermoor at sunset, raiders
crossing far off, behind the title and the three skies; the port keeps its garage look), the progression survey's
title-continue proposal (`../surveys/survey2-progression.json`), and the world survey's horizon/rays ideas
(`../surveys/survey2-world.json`, for the sunset look on the title only; the voyages keep their afternoon light).

1. **The title scene**: render the real world (map, sky, cloud floor and puffs from world.js) in title mode instead of
   the port's void: the Captain's ship (the one he sails, built at full detail) flying a slow, gentle orbit about 700 m
   up over the Hearthsea and the island city, the camera drifting with it, a low warm sunset light for the title only
   (a separate sun direction and sky tint for the title, restored when a voyage starts), two or three rust-sailed
   raiders crossing far off (middle/far detail, no fighting), and the title panel as now. Choosing different skies can
   tint the scene a little (Fair Winds clear, Crosswinds breezy cloud, Maelstrom darker, stormier), cheaply.
   It must stay smooth on a phone: it's the first thing Chris sees.
2. **Fewer taps**: title-continue as proposed (a big "Set sail" / "Set sail in the Gale" on the title, "To port" as a
   plain button; "Best for your first voyage" on Fair Winds for a new Captain), keeping the ids tools/check.mjs uses.
3. The port keeps its void and berth (Chris: a racing game's garage), but make the hand-off between title, port and
   voyage smooth (a short fade, no flash of the wrong scene).

Done means: screenshots of the title at laptop, phone upright and sideways sizes, looked at; the title runs at a frame
time no worse than a voyage's on the phone size; tools/check.mjs checks the title scene is the world (not the port
void), that "Set sail" from the title starts a voyage, and ends "all good"; docs/game.md updated.
