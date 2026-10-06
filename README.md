# Airship game in Aethermoor

A game about flying and fighting airships over Aethermoor.

**See the Captain's four ships:** https://claude.ai/artifact/4uQ6NogD2FyGGijwq1ew4K (or open `dist/hangar.html` in a browser; it works with no internet). Drag to turn a ship, pinch to zoom, and use the buttons to switch ships, views and the detail dial.

- `docs/ships.md`: the six ships and their stats
- `docs/art-requests/01-ships.md`: the picture prompts for the six ships, ready to paste
- `docs/map.md`: the map, how big it is, and the camera
- `art/map/`: the map in nine tiles, plus a small preview
- `reference/the-magpie-over-aethermoor.html`: the Magpie page the ships are modelled on (open it in a browser)
- `src/ship/`: the code that builds a ship; `src/ships/`: each ship's measurements
- `art/ships/`: Chris's ship pictures

## Rebuilding the demo

```
npm install
npm run art     # only when the ship pictures change: cuts their painted pieces into assets/ships/
npm run check   # builds dist/hangar.html and checks every ship at every detail level; must end with "all good"
```
