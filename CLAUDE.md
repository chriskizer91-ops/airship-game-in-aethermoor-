# CLAUDE.md

## Repository rules

- This is the only repository to write to for this game.
- These sibling repositories are read-only references. Reuse their assets, mechanics and code when useful, but never commit to them:
  - `chriskizer91-ops/envoi-on-the-longest-night`
  - `chriskizer91-ops/building-with-assets-`
- When copying assets or code from another repo, note the source repo and path in the commit message.

## Project

- An airship game set in Aethermoor, the world Chris made for D&D. It's the same world as *The Magpie over Aethermoor* (`reference/the-magpie-over-aethermoor.html`), and the Magpie is the model the ships are built from.
- The player's ship is a new ship, not the Magpie, and the Witch isn't at its helm. Keep new ships and assets free of the Magpie's and the Witch's names so they can be reused in other games.
- Six ship classes are built from one recipe: the Magpie's. The hull is shaped from a side outline and a top outline, and the parts come from one picture sheet. The player's ship gets high detail. Enemy ships get less, because three to six can be in view.
- Design notes:
  - ships and stats: `docs/ships.md`
  - map, scale and camera: `docs/map.md`
- The map is nine tiles in `art/map/tiles/`, painted straight down.
- When new art is needed, write the picture prompts as markdown files in `docs/art-requests/` for Chris to generate.
- `docs/art-requests/01-ships.md` is built by `tools/ship-prompts.mjs`. To change a ship's prompts, edit the script and run `node tools/ship-prompts.mjs`; don't edit the markdown by hand.
- Chris tries things on his phone. Every step should end with something he can open there. Write anything Chris reads in plain words.
