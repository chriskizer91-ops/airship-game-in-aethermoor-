# The map

## The art

Chris chose `art/map/aethermoor-approved.webp` (1500 × 1000) as the best version of the map (October 6). The nine tiles in `art/map/tiles/` are the detailed version of that same picture, and they match it closely. Each tile is 1536 × 1024 pixels, and together they make a 4608 × 3072 map. `art/map/tiles/README.txt` gives their order, and `art/map/aethermoor-preview.jpg` is the whole map at a small size.

```
01-northwest | 02-north  | 03-northeast
04-west      | 05-center | 06-east
07-southwest | 08-south  | 09-southeast
```

- It's Aethermoor with the same layout as the Magpie page. Forest and farms are in the west, snowy peaks in the north-east, desert in the east and the swamp in the south. The walled island city sits in the middle of the inland sea, with small rocky islands all around the coast.
- **It's painted almost straight down,** unlike the Magpie page's map, which is painted at an angle. Flat things, like the coast, rivers, roads and fields, are straight down, so the map can be laid flat as the ground under a 3D ship. But towers, peaks and trees are painted showing their sides a little. Close up they'd look like they're lying flat, so the camera stays high, above a cloud floor (see [the camera](#the-camera)).
- `art/map/center-city-close.webp` and `center-city-wide.webp` are closer views of the island city. They can stand in for that part of the map when the ship flies near it.

### Joins between tiles

The tiles line up, but each was generated on its own, so the edges don't match exactly. Across a join the colour jumps about twice as much as between normal neighbouring pixels. From far away the joins are hard to see, but up close they show. The north-east peaks are the worst: snow stops in a straight line where tile 03 meets tile 06. A village is also cut off where tile 04 meets tile 05. The game can blend a thin strip along each join, and clouds can cover the rest.

If the tiles are ever made again, asking for each one to overlap its neighbours by about 128 pixels would let the game fade them into each other with no line.

## Scale

**Decided: 5 m per pixel.** The map is 23 km across (October 6).

The island city is about 300 pixels across. This is what each scale makes of it:

| Metres per pixel | Map width | Island city | Brig lengths across | Time to cross at 20 m/s |
|---|---|---|---|---|
| 0.5 | 2.3 km | 150 m | 92 | 2 minutes |
| 2 | 9 km | 600 m | 370 | 8 minutes |
| 5 | 23 km | 1.5 km | 920 | 19 minutes |

At 0.5 m per pixel the trees and houses are their real size, but the whole continent shrinks to 2.3 km. It takes two minutes to cross, and the Man-o'-war is more than half as long as the city.

At 5 m per pixel the mountains, rivers and city come out at believable sizes, with about a thousand ship lengths across. Only the trees and houses are too big: they're painted 15 to 20 pixels across, which makes them 75 to 100 m. From high up they still read as forest and villages.

For comparison, the Magpie page's map was under 300 m across, or 44 Magpie-lengths. Compared with the ship, the new map is about 86 times bigger.

## Keep it simple

**The map is just the ground under where you fly** (Chris, October 6). It lies flat below the flying area, and the game doesn't put more work into it for now.

If the ground ever needs to look sharper close up, there are two ways, kept here for later:

- **Blend in ground detail.** Chris's Art Farm (`farm-project`, `art-farm/src/world.js`) already does this. It mixes repeating painted grass and gravel, at two sizes so the repeat never shows, into the painting from above, tinted with the painting's own colours. Here the repeating pictures would be forest, rock, sand, snow and water, painted straight down.
- **Pick the map's size and sharpen it in the game.** Chris's *Magpie Map Resolution* page did this for the old night map. A map at two-thirds size, sharpened by the game as the camera comes close, kept 85% of the detail at under a third of the file size.

## File size

The game is one file with everything inside, like the Magpie page, and its budget is 16 MB. Putting a picture inside the file makes it about a third bigger.

| Whole map as | File | Inside the game | Share of 16 MB |
|---|---|---|---|
| JPEG | 4.9 MB | 6.5 MB | 40% |
| WebP | 3.2 MB | 4.2 MB | 26% |
| AVIF, same quality as the WebP | 2.0 MB | 2.7 MB | 17% |

So the game uses the map as AVIF, which every current browser shows. `npm run map` (`tools/map-art.mjs`) packs the nine tiles into `assets/map/` at 2.6 MB, plus a small copy of the whole map for the corner map.

## The sky over the map

The map stays the flat painting under where you fly; the sky over it does the rest (`src/game/sky.js`, see `docs/game.md`, "Storms, clouds and the sky"):

- **The cloud floor** lies at 430 m, broken, drifting slowly on the wind, with its shadows on the ground. Its pattern is worked out once as a picture, and again in the game's own code, so the game knows where it's thick enough to hide a ship (from just under its top to about 40 m under it).
- **The big clouds** drift between 520 and 2,000 m up, kept round the ship as she flies; you can fly into them.
- **Each region has its own air**, read off the same 12 by 8 grid that names the regions, blended in gently as you cross into it: the Sunscorch Wastes warm and dusty, the Ironspire Peaks cold with snow on the wind, the Gloomfen misty, the Gloamwood violet, the Hearthsea clear, the Verdant Wilds green, the Open Sea deep blue.
- **Towering clouds** stand round the far horizon, past the map's edge, so the world feels bigger than the painting.
- **The light** stays the late afternoon's, the sun low in the west-south-west; only a storm darkens it.

## The camera

- The camera sits **behind the ship** and follows it, high above the cloud floor. The Thinning, the thin air at the top of the sky, is the ceiling.
- **Swing it around the ship** with the mouse, or a drag on a phone. Where the camera looks decides which guns fire: looking forward fires the bow guns, looking to a side fires that side's broadside, and looking back fires the stern guns.
- The **corner map** shows the whole map with the ship on it; **M** (or a tap on it) makes it big.
- The controls for a laptop and a phone are in `docs/game.md`.
