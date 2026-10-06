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

## Sharpness

At this scale even the Man-o'-war is only 18 pixels long on the map. So the painting is a backdrop seen from high up, and close to the ground it would look soft. Two things fix that:

1. **Stay high, above a cloud floor.** The cloud floor hides the soft ground and the painted sides of towers and peaks. Tall cloud banks give cover in a fight.
2. **Blend in ground detail when the ship gets close.** Small repeating pictures of grass, forest, rock, sand, snow and water fade in over the painting, each chosen by the colour of the map underneath. Chris's Ranch game already does this. Unlike upscaling, it adds almost nothing to the file size. The Ranch's code isn't in a repo this session can read; adding it would let this game reuse its version.

## File size

The game is one file with everything inside, like the Magpie page, and its budget is 16 MB. Putting a picture inside the file makes it about a third bigger.

| Whole map as | File | Inside the game | Share of 16 MB |
|---|---|---|---|
| JPEG | 4.9 MB | 6.5 MB | 40% |
| WebP, same quality | 3.2 MB | 4.2 MB | 26% |

So the game uses the map as WebP.

## The camera

- The camera sits **behind the ship** and follows it, high above the cloud floor. The Thinning, the thin air at the top of the sky, is the ceiling.
- **Drag to swing it around the ship.** Where the camera looks decides which guns fire: looking forward fires the bow guns, looking to a side fires that side's broadside, and looking back fires the stern guns.
- The **Map** button pulls back to the whole map, seen from straight above.
