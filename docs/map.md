# The map

## The art

Chris chose `art/map/aethermoor-approved.webp` (1500 × 1000) as the best version of the map (October 6). The nine tiles in `art/map/tiles/` are the detailed version of that same picture, and they match it closely. Each tile is 1536 × 1024 pixels, and together they make a 4608 × 3072 map. `art/map/tiles/README.txt` gives their order, and `art/map/aethermoor-preview.jpg` is the whole map at a small size.

```
01-northwest | 02-north  | 03-northeast
04-west      | 05-center | 06-east
07-southwest | 08-south  | 09-southeast
```

- It's Aethermoor with the same layout as the Magpie page. Forest and farms are in the west, snowy peaks in the north-east, desert in the east and the swamp in the south. The walled island city sits in the middle of the inland sea, with small rocky islands all around the coast.
- **It's painted straight down,** unlike the Magpie page's map, which is painted at an angle. So it can be laid flat as real ground under a 3D ship, and the camera can swing around the ship.
- `art/map/center-city-close.webp` and `center-city-wide.webp` are closer views of the island city. They can stand in for that part of the map when the ship flies near it.

### Joins between tiles

The tiles line up, but each was generated on its own, so the edges don't match exactly. Across a join the colour jumps about twice as much as between normal neighbouring pixels. From far away the joins are hard to see, but up close they show. The north-east peaks are the worst: snow stops in a straight line where tile 03 meets tile 06. A village is also cut off where tile 04 meets tile 05. The game can blend a thin strip along each join, and clouds can cover the rest.

If the tiles are ever made again, asking for each one to overlap its neighbours by about 128 pixels would let the game fade them into each other with no line.

## Scale

On the Magpie page the Magpie, which is about 6 m long, covers about 100 pixels. That map was under 300 m across, or 44 Magpie-lengths.

In the new map, trees and houses are painted about 15 to 20 pixels across. So **0.5 m per pixel** is the scale where they're their real size. That already makes the map about 8 times bigger, compared with the ship, than the Magpie page. The table compares each scale with the Magpie page in the same way:

| Metres per pixel | Map width | Bigger than the Magpie page | Time to cross at 90 km/h | A 25 m Brig on the map | Trees and houses |
|---|---|---|---|---|---|
| 0.5 | 2.3 km | 8 × | 1.5 minutes | 50 pixels | Real size |
| 1 | 4.6 km | 17 × | 3 minutes | 25 pixels | 2 × too big |
| 2.5 | 11.5 km | 43 × | 8 minutes | 10 pixels | 5 × too big |
| 5 | 23 km | 86 × | 15 minutes | 5 pixels | 10 × too big |

A bigger map costs nothing to run. The limit is sharpness: at 1 m per pixel, with the camera close behind the ship, a phone screen shows only about 150 pixels of map across. That's stretched about 7 times, so it looks soft.

Ways to sharpen it:

1. **Upscale each tile 2 to 4 times** with an AI upscaler. The game cuts the big tiles into small squares and loads only the ones near the ship. Loading all of them at once would run a phone out of memory.
2. **Fly high, with clouds below.** A low cloud deck hides the ground when you fly low, and tall cloud banks give cover in a fight.
3. **A height map** (optional). This is a grey picture of the same map where black is sea and white is the highest peak. With it the mountains can rise in 3D, so ships can hide behind them.

## The camera

- The camera sits **behind the ship** and follows it.
- **Drag to swing it around the ship.** Where the camera looks decides which guns fire: looking forward fires the bow guns, looking to a side fires that side's broadside, and looking back fires the stern guns.
- The **Map** button pulls back to the whole map, seen from straight above.
