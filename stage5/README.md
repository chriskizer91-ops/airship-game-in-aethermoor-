# Skies of Aethermoor: the polished version, stage 5

This folder, `stage5/`, carries on the polished phone version from where stage 4 left it. It's a copy of the
`stage4/` folder (commit `02de47f`, October 14: the version Chris plays as "Skies of Aethermoor 4"), made November 14
so stage 5 could be built in a folder of its own: `stage4/` is left exactly as it was, so the two can be played side by
side. Work on this copy happens only inside `stage5/`.

Stage 5 is **the shipwright's pass** (Chris, November 14: make the ships and the whole game look better, and run as
smoothly or more so): a crew on every ship, shade in every crease, boards and brass each their own tone, sails the sun
shines through, a closer look in port, and at sea a picture that keeps its own pace on a slow phone and lighter
shadows. `docs/game.md`, "The shipwright's pass", says it in full.

Before it: `stage4/` was a copy of `polished/` (commit `3570f8b`, October 7), and the polished version itself began
as a separate copy of the airship game, made October 6 to polish it and add to it (from commit `1887984`: the port, the
three skies, Crystal Shards, and the Galleon and the Man-o'-war as raiders; since stage 4 they're the Captain's
late-game ships too). The game in the repository's main folders, `polished/` and `stage4/` are each left exactly as
they were. Everything here works on its own: its own pages, tools and notes.

Picking this up in a new session? Start with `docs/HANDOFF.md`.

## Building it

From this folder (run `npm install` once here first; it keeps its own `node_modules`):

(The tools draw in a hidden browser. If `npm install` brings a Playwright that can't find its browser on this machine, point `node_modules/playwright` and `node_modules/playwright-core` at the machine's own, as stage 5's session did: `ln -s /opt/node-tools/node_modules/playwright node_modules/playwright`, and the same for `playwright-core`.)

```
node tools/build.mjs    # makes dist/game.html and dist/hangar.html (and their .artifact.html copies)
node tools/check.mjs    # plays the game in a hidden browser (about 25 minutes here, with no graphics card, and longer while the machine is busy); must end with "all good"
node tools/check.mjs --quick   # only the game page at laptop size, while working ("all good (quick)")
node tools/check.mjs --ships   # only the ships demo, a couple of minutes ("all good (the ships demo only)")
node tools/closeups.mjs brig   # close pictures of one ship (her crystals, stern, bow, deck, helm, the watch at her bow, her ports), into shots/
node tools/sim-fight.mjs brig 5 cross   # the simulated Captain, for tuning the fights
node tools/sim-fight.mjs manowar 6 cross 10 --runs 4   # the Man-o'-war against waves 10 to 15, four voyages (--owns, --mods, --power too)
node tools/sim-fight.mjs brig 8 cross --runs 6 --skilled   # a Captain who uses the tactics: dodging broadsides, changing shot, patching
node tools/sim-fight.mjs frigate 1 cross 12 --owns galleon,manowar --policy fortress --shot auto   # a Frigate against a raider Man-o'-war, from over her stern
node tools/sim-fight.mjs brig 8 cross --road storm   # taking the storm road whenever it's offered
node tools/sim-fight.mjs brig 8 cross --runs 24 --jobs 2 --seed 2000   # 24 voyages, two at a time, each in a fresh page with its own dice (the same seed plays them again exactly)
```

`tools/ship-art.mjs` and `tools/map-art.mjs` read Chris's pictures from the repository's `art/` folder, without
changing it.

## What's here

- `docs/game.md`: how this version plays (the shipwright's pass of stage 5: the crew, the finish, a closer look in port, the picture's pace; and the title screen, the skies, the port, voyages, the Captain's record (a gentle first voyage, coming home, commendations, ranks, stars, the log, harbour orders and colours), the controls and settings, the tactics, the foes worth remembering (raiders with nerve, named captains, the Man-o'-war's fortress battle, the road between waves), battle scars, ships that move, storms and clouds, the sound and music, the raiders, and how hard it is)
- `docs/ships.md`, `docs/map.md`: the ships and the map, as in the main folders
- `src/`: the game's code; `demos/`: the pages' HTML; `tools/`: building and checking
- `src/audio/thareia/`: Chris's music and instruments, shared with the laptop version and kept exactly as he gave them
- `dist/`: the built pages, each one file that works with no internet
