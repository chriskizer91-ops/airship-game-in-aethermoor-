# CLAUDE.md

## Repository rules

- This is the only repository to write to for this game.
- These sibling repositories are read-only references. Reuse their assets, mechanics and code when useful, but never commit to them:
  - `chriskizer91-ops/envoi-on-the-longest-night`
  - `chriskizer91-ops/building-with-assets-`
  - `chriskizer91-ops/farm-project` (the Art Farm: its ground blends painted detail into a painting from above)
- When copying assets or code from another repo, note the source repo and path in the commit message.

## Project

- An airship game set in Aethermoor, the world Chris made for D&D. It's the same world as *The Magpie over Aethermoor* (`reference/the-magpie-over-aethermoor.html`), and the Magpie is the model the ships are built from.
- The player is the Captain. The Captain's ship is a new ship, not the Magpie, and the Witch isn't at its helm. Every ship has a name (`docs/ships.md`), kept off the models. Keep new ships and assets free of the Magpie's and the Witch's names so they can be reused in other games.
- Six ship classes are built from one recipe: the Magpie's. The hull is shaped from a side outline and a top outline, and the parts come from one picture sheet. The player's ship gets high detail. Enemy ships get less, because three to six can be in view.
- Design notes:
  - ships and stats: `docs/ships.md`
  - map, scale and camera: `docs/map.md`
  - the game, its controls and how ships fly and fire: `docs/game.md`
- The map is nine tiles in `art/map/tiles/`, painted almost straight down, at 5 m per pixel (23 km across). It's just the flat ground under where you fly: keep it simple (Chris, October 6). The camera stays high, above a cloud floor.
- Get the Captain's four ships fully playable before modelling the Galleon and the Man-o'-war (Chris, October 6).
- The game works on a laptop at full detail (WASD and keys, mouse aiming) and on a phone (touch stick, aiming drag, buttons). Keep both working.
- The game is ship-to-ship fighting in the air, like at sea; fill that out before boarding (Chris, October 6). A title screen with three skies (difficulties, not called easy/medium/hard), a port like a racing game's garage (ships, upgrades, crystal power), and Crystal Shards, Aethermoor's money, earned from raiders.
- When tuning the fights, run `node tools/sim-fight.mjs <ship> <waves> <skies>` and keep `docs/game.md` ("How hard it is") in step.
- When new art is needed, write the picture prompts as markdown files in `docs/art-requests/` for Chris to generate, and send him the file in the chat.
- `docs/art-requests/01-ships.md` is built by `tools/ship-prompts.mjs`. To change a ship's prompts, edit the script and run `node tools/ship-prompts.mjs`; don't edit the markdown by hand.
- Chris tries things on his phone. Every step should end with something he can open there. Write anything Chris reads in plain words.

## Checking a change

```
npm install
npm run art     # when art/ships/ changes
npm run map     # when art/map/tiles/ changes
npm run check   # builds dist/game.html and dist/hangar.html (and their .artifact.html copies), plays the game; must end with "all good"
node tools/closeups.mjs brig   # close pictures of one ship's details, into shots/
```

- The game is published at https://claude.ai/artifact/8uZvk4JeowYMt7n5xBvoa7, and the ships demo at https://claude.ai/artifact/4uQ6NogD2FyGGijwq1ew4K. After a change, build and then publish `dist/game.artifact.html` and `dist/hangar.artifact.html` to those links (pass the url), so Chris's links keep working. The game keeps each player's save in its own private store (`data/users/<id>/save`), so it's published with `capabilities: {db: {}, user: {}}`; leave `capabilities` out on later publishes to keep them.
- Each ship stays near 100,000 triangles at full detail; `FINE` in `src/ship/build.js` tunes that per ship.
