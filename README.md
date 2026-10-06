# Airship game in Aethermoor

A game about flying and fighting airships over Aethermoor.

**Play it:** https://claude.ai/artifact/8uZvk4JeowYMt7n5xBvoa7 (or open `dist/game.html` in a browser; it works with no internet). Choose your skies, fit out your ship in port, then set sail over Aethermoor and fight off waves of raiders for their Crystal Shards, to buy bigger ships and upgrades. On a laptop (keyboard and mouse) or a phone (touch). `docs/game.md` has how it all works and the controls.

**See the Captain's four ships:** https://claude.ai/artifact/4uQ6NogD2FyGGijwq1ew4K (or open `dist/hangar.html` in a browser; it works with no internet). Drag to turn a ship, pinch to zoom, and use the buttons to switch ships, views and the detail dial.

- `docs/game.md`: the game so far: the skies, the port, voyages, the controls, how ships fly and fire, damage, and the raiders
- `docs/ships.md`: the six ships and their stats
- `docs/art-requests/01-ships.md`: the picture prompts for the six ships, ready to paste
- `docs/map.md`: the map, how big it is, and the camera
- `art/map/`: the map in nine tiles, plus a small preview
- `reference/the-magpie-over-aethermoor.html`: the Magpie page the ships are modelled on (open it in a browser)
- `src/ship/`: the code that builds a ship; `src/ships/`: each ship's measurements; `src/game/`: the game
- `art/ships/`: Chris's ship pictures

## Rebuilding the pages

```
npm install
npm run art     # only when the ship pictures change: cuts their painted pieces into assets/ships/
npm run map     # only when the map tiles change: packs them into assets/map/
npm run check   # builds dist/game.html and dist/hangar.html, flies every ship, fires every gun and fights raiders; must end with "all good"
```
