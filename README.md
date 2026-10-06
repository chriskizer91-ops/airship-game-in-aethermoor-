# Airship game in Aethermoor

A game about flying and fighting airships over Aethermoor.

**Play it:** https://claude.ai/artifact/8uZvk4JeowYMt7n5xBvoa7 (or open `dist/game.html` in a browser; it works with no internet). Fly any of the Captain's four ships over Aethermoor and shoot at practice targets, on a laptop (keyboard and mouse) or a phone (touch). `docs/game.md` has the controls.

**See the Captain's four ships:** https://claude.ai/artifact/4uQ6NogD2FyGGijwq1ew4K (or open `dist/hangar.html` in a browser; it works with no internet). Drag to turn a ship, pinch to zoom, and use the buttons to switch ships, views and the detail dial.

- `docs/game.md`: the game so far, its controls, and how each ship flies and fires
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
npm run check   # builds dist/game.html and dist/hangar.html, flies every ship and fires every gun; must end with "all good"
```
