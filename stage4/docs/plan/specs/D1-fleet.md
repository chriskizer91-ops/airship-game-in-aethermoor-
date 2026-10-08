# Package D1: the Galleon and the Man-o'-war as the Captain's late-game ships

Source: Chris's decisions `../chris-decisions.md` (read it first; it overrides older notes that say the big two are only
ever raiders). Also docs/ships.md, src/ships/*, src/game/{port,progress,mods,raiders,main}.js and tools/sim-fight.mjs.

1. **In port**: the Galleon (Doldrums) and the Man-o'-war (Thunderhead) can be bought after the Frigate. Pick prices
   and upgrade-step costs that make them true late-game goals (the Frigate is ◆ 2,200; the whole store today is
   about ◆ 21,000), tuned so a good Captain reaches the Galleon after many voyages, and the Man-o'-war after more.
   Their stats bars in port, their crystal power and four upgrades work like the others'. Save: old saves gain them
   unowned (progress.js merge).
2. **Flying them** must feel mighty and still be fun on a phone: tune the camera distance and height for 60 m and 90 m
   ships so the raiders can be seen; check their handling (the Man-o'-war's 54-second circle may be too sluggish for
   the Captain: if so, give the Captain's big ships a fair bump, documented); their broadsides (16 and 24 guns a side,
   two decks) ripple, kick and sound right (packages A2a, B1, C2); check the HUD battery label and lock-on still make
   sense with two gun decks.
3. **Raiders**: giant raiders only once owned: Galleons appear among the raiders only once the Captain owns the
   Galleon, and Men-o'-war only once he owns the Man-o'-war (whatever ship he sails that voyage). Before owning the
   Galleon the treasure ship is a **treasure Brig** (a rich merchant Brig in treasure colours, using C2's treasure look,
   with the Galleon's treasure-ship behaviour: sails her course, runs once chased, strikes her colours when her sails are
   shot away, escapes if left 3.6 km behind; worth a rich bounty). Rework the wave table and waveAt() so every wave
   that used a Galleon or Man-o'-war has a fitting stand-in before they're unlocked (e.g. a raider captain's Frigate with
   escorts in place of the Man-o'-war's fortress waves), and the giants appear (and grow common) once unlocked. The
   between-waves card's "Next:" and the banners must describe it right.
4. **Balance** with tools/sim-fight.mjs (extend it to sail the Galleon and the Man-o'-war and to set what's owned):
   the Captain's Galleon and Man-o'-war should be strong but not invincible against the late waves, including the
   giant raiders. Update docs/game.md "How hard it is" and the wave table, and docs/ships.md (the big two are now the
   Captain's too, late in the game).

Done means: buying and sailing both big ships works on laptop and phone (screenshots, looked at); tools/check.mjs
checks the gating (no Galleon/Man-o'-war raiders before owning them, treasure Brig at the treasure wave, giants after
owning), buying and flying the big two, and ends "all good"; docs updated.
