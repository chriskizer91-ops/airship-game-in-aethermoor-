# Skies of Aethermoor: the polished version

This folder is a separate copy of the airship game, made October 6 to polish it and add to it. The game in the
repository's main folders is left exactly as it was, so other versions can carry on from it. Everything here works
on its own: its own pages, tools and notes.

It started as a copy of the game at commit `1887984` (the port, the three skies, Crystal Shards, and the Galleon and
the Man-o'-war as raiders).

## Building it

From this folder (it uses the repository's `node_modules`, so run `npm install` once in the repository's main folder):

```
node tools/build.mjs    # makes dist/game.html and dist/hangar.html (and their .artifact.html copies)
node tools/check.mjs    # plays the game in a hidden browser (about 25 minutes here, with no graphics card); must end with "all good"
node tools/check.mjs --quick   # only the game page at laptop size, while working ("all good (quick)")
node tools/sim-fight.mjs brig 5 cross   # the simulated Captain, for tuning the fights
```

`tools/ship-art.mjs` and `tools/map-art.mjs` read Chris's pictures from the repository's `art/` folder, without
changing it.

## What's here

- `docs/game.md`: how this version plays (the title screen, the skies, the port, voyages, the controls and settings, battle scars, ships that move, storms and clouds, the sound and music, the raiders, and how hard it is)
- `docs/ships.md`, `docs/map.md`: the ships and the map, as in the main folders
- `src/`: the game's code; `demos/`: the pages' HTML; `tools/`: building and checking
- `src/audio/thareia/`: Chris's music and instruments, shared with the laptop version and kept exactly as he gave them
- `dist/`: the built pages, each one file that works with no internet
