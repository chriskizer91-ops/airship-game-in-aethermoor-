# The ships

**Settled October 6, 2026.** Chris approved the six classes, their lengths, gun counts and stats. A later review that day raised the Skiff's speed, added the crew rule and set which ships the player flies. The battle steps can still tune the numbers. The ship pictures are generated to match these: every gun, sail and crystal in a picture is one the stats count.

## How the ships are built

**All six ships are built** (October 6): the Captain's Skiff, Cutter, Brig and Frigate, and the Galleon and the Man-o'-war, built from Chris's art packs for them. See them at https://claude.ai/artifact/4uQ6NogD2FyGGijwq1ew4K, or open `dist/hangar.html`, which works with no internet.

They're built the Magpie's way (`reference/the-magpie-over-aethermoor.html`), but in much more detail:

- **The hull is shaped from two outlines**: a side view, for the deck edge and the keel, and a straight-down top view, for the width. The Brig's, Galleon's and Man-o'-war's outlines are measured off Chris's pictures of them (`art/ships/brig-*.png`, `galleon-*.png`, `man-o-war-*.png`). The Skiff, Cutter and Frigate take their shapes from his fleet lineup (`art/ships/lineup.png`) until they have pictures of their own.
- **The big two add to the recipe:** two decks of gun ports, a forecastle at the bow as well as the castle at the stern, castles two storeys high with rows of windows and stairs up their sides, and (on the Man-o'-war) four guns straight out of the bow. The Man-o'-war's hull wears dark iron plates cut out of its own pictures instead of planks.
- **Every ship wears the Brig's paint.** Its painted planks, deck boards and riveted brass band are cut out of the pictures and repeated along each hull (`tools/ship-art.mjs`). The sail canvas, sunstone crystals, furnace windows, lanterns, rudder, fins, windows and hatch gratings come from the Brig's parts sheet. Where the paint shows brass it shines, and where it shows lamplight it glows.
- **Everything else is real 3D, not paint.** That covers:
  - brass bands, straps and rivets standing off the hull
  - gun ports with frames, glowing muzzles and lids
  - long guns on swivels
  - rails on turned balusters
  - furnace columns with brass arms holding the crystals
  - masts, yards and wing sails that ripple in the wind
  - shrouds with ratlines, stays and sheets
  - pennants, fins, the rudder, the ram or bowsprit
  - lanterns, the wheel, stairs, a capstan, barrels, crates and coils of rope
- The code is in `src/ship/`, and each ship's measurements are in `src/ships/`.

None of them is the Magpie: the player's ship is a new ship with its own name, and nobody from the Magpie page is at its helm. That keeps the ships free to reuse in other games.

What every ship has, like the Magpie:

- a wooden hull with brass bands
- no gas bag
- **sunstone crystals** on a furnace column, which give the lift
- **wing sails** on yards out to each side, which catch the Aether. The yards are mounted high, above the gun ports, so the broadside guns fire underneath the sails. They fold back along the hull as the sails are taken in, like a bird folding its wings, and spread wide again as they're set.
- **gun ports with lids** that swing open as she clears for action, her guns running out behind them and kicking back in as they fire
- fins under the belly, a rudder at the stern, lanterns, and a wheel at the stern
- a **pennant** at every mast top, in plum with a gold hoist. These are the Captain's colours (a first pick; easy to change).

## The raiders' colours

Raiders fly the same four ships as the Captain, and the Galleon and the Man-o'-war too, so they're told apart by colour: rust-red sails, darker planks, and crimson pennants with a black hoist, against the Captain's cream sails and plum and gold. In the game each raider also has a tag over it with its class, its distance and its three health bars, and a red wake of Aether behind her (the Captain's is gold).

Two raiders have colours of their own (October 7), and any ship can wear them (`src/ship/livery.js`):

- **A raider captain's ship** looks the leader: black sails edged in crimson, blackened iron fittings (her brass bands stay gold, as trim), crystals and sparks that burn crimson, red lanterns, two red eyes glowing either side of her bow, gold pennants, and a great black-and-crimson swallow-tailed banner on a staff above her tallest mast. Her wake is crimson.
- **A treasure ship** is a rich merchant laden with shards: wine-red sails edged in gold, gilded brass that glints and twinkles all over her, gold pennants with a wine-red hoist, and open chests heaped with gold on her deck in place of her cargo. Her wake glitters gold.

The **Man-o'-war**, as a raider, shows her five crystal columns as the weak points they are: they glow brighter than any other ship's and beat like a heart.

See them in the ships demo with the **Yours**, **Raider**, **Captain** and **Treasure** buttons.

## Battle scars

Every ship shows her damage on her own model (October 7; how it plays: `docs/game.md`, "Battle scars"):

- **The hull, deck and brass bands** take scorched holes where shots strike, ringed with splintered wood and soot, glowing with embers while fresh, and grow sooty all over as the hull goes. Patched, a hole becomes a square of fresh planks.
- **The sails** take ragged, scorched holes where shots go through, and fray from their free edges as they're torn. Patched, a hole is covered with a stitched square of new canvas.
- **The crystals**, cluster by cluster, dim, crack and sputter, and their furnace windows, glows, sparks and lamps dim with them.
- **Flames** lick from the worst holes of a ship badly holed.

Each ship carries her own scars, even when several of one class share a model, and they're painted onto her surfaces as she's drawn, so they add no triangles and no draw calls, at full, middle and far detail alike (the flames are one draw for the whole sky). The code is `src/ship/dress.js` and `src/ship/flames.js`. In the ships demo, the **New**, **Battered** and **Wrecked** buttons show any ship after a fight, at any level of detail.

## What moves

Every ship moves as she's handled (October 7; how it plays: `docs/game.md`, "Ships that move like they're alive"):

- **Her wings**: each wing sail, its yard, the spike at its tip and the ropes along it fold back along the hull as the sails are taken in (up to 34 degrees, their tips dipping), and spread wide again; the sheets down to the rail follow less and less towards the rail.
- **Her gun ports**: each lid hangs shut over its port and swings up and out on its hinge, bow first down the side; each gun runs out once its lid is up, kicks back in at its own turn as the broadside ripples down the side, and runs out again once it's loaded. Her bow and stern guns kick back along their barrels.
- **Her pennants** stream out at speed and hang limp when she's slow.
- **Her wake**: a ribbon of glowing Aether behind her (`src/game/wakes.js`: one draw for every ship in the sky).

It's all worked out on the graphics card as she's drawn, from a few numbers she keeps, so it adds no triangles at full detail. What moves is built with a note on each corner saying how it moves (its "rig"); the metal that moves (the guns, the lids' brass trims and the yards' spikes) is its own small batch, one more draw call for a ship at full or middle detail and none far off. In the middle distance her gun ports have plain lids (12 triangles each), and far off her yards lose their spikes, too small to see.

## What the stats mean

There are three things to shoot at. Each has its own health bar:

| Stat | When it's damaged |
|---|---|
| **Hull** | At zero, the ship goes down. |
| **Sails** | The ship slows and turns badly, so it can be caught. |
| **Crystals** (lift) | The ship climbs badly and sinks lower. At zero, it's forced down and out of the fight. |

Then how the ship flies, at full health, rated out of 10:

| Stat | What it is |
|---|---|
| **Speed** | Top speed in a straight line. |
| **Turning** | How tight it turns. |
| **Climbing** | How fast it changes height. |

Then its guns and crew:

| Stat | What it is |
|---|---|
| **Bow guns** | Chasers at the front: long-range, lighter and accurate. |
| **Stern guns** | Chasers at the back. Same as the bow guns. |
| **Guns a side** | Broadside guns: heavy, but only good up close. They fire as one volley that ripples down the side, bow to stern. |
| **Crew** | How strong the ship is when boarding, or being boarded. |

Guns only tilt a little up or down, so flying above or below a ship keeps you out of its broadside.

How the game turns damage into slower sailing, worse turning and sinking is in `docs/game.md`, under "Damage".

**Crew falls with the hull.** A ship that has lost half its hull has lost about half its crew. That's what makes boarding a bigger ship possible: a Cutter's 12 can't take a Brig's 30, but once the Brig's hull is down by 60% her crew is down to 12 too, an even fight. So to take a ship, you shoot her sails to catch her and her hull to thin her crew. Shoot too much, though, and she goes down with her cargo.

**Size doesn't decide speed.** Speed comes from how much sail a ship carries for its weight. Turning and climbing come from size and lift. So a small ship isn't always fast: the Frigate is as fast as the Skiff and faster than the Brig, and only the Cutter beats them.

## The six ships

**The player is the Captain** (Chris, October 6). The Captain moves up through the first four ships: Skiff, then Cutter, Brig and Frigate, bought in port with Crystal Shards (◆ 300, 900 and 2,200; `docs/game.md`). The Galleon and the Man-o'-war are only ever enemies: a rich prize and a fortress.

**Every ship has a name** (Chris, October 6). These are proposals for Chris to keep or change. They're all winds and weather, growing with the ship, and none of them comes from the Magpie page or other games' lore:

| Ship | Name | Why |
|---|---|---|
| Skiff | **Zephyr** | A light breeze: small and nimble |
| Cutter | **Gale** | A fast, hard wind: the raider |
| Brig | **Tradewind** | The steady wind sailors trust: the all-rounder |
| Frigate | **Tempest** | The hunter |
| Galleon | **Doldrums** | The windless calm that traps ships: slow, and full of treasure |
| Man-o'-war | **Thunderhead** | The towering storm cloud: a flying fortress |

The names stay off the ships themselves, so the models can be reused in other games.

| Ship | Length | Hull | Sails | Crystals | Speed | Turning | Climbing | Bow guns | Stern guns | Guns a side | Crew |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Skiff | 8 m | 300 | 150 | 150 | 8 | 10 | 10 | 1 | 0 | 1 | 4 |
| Cutter | 15 m | 600 | 300 | 250 | **10** | 8 | 7 | 1 | 1 | 3 | 12 |
| Brig | 25 m | 1,200 | 600 | 500 | 7 | 6 | 6 | 2 | 1 | 6 | 30 |
| Frigate | 40 m | 2,200 | 1,000 | 900 | 8 | 5 | 5 | 2 | 2 | 10 | 60 |
| Galleon | 60 m | 4,000 | 1,500 | 1,600 | 4 | 3 | 3 | 1 | 2 | 16 | 120 |
| Man-o'-war | 90 m | 7,000 | 2,400 | 2,600 | 3 | 2 | 1 | 4 | 2 | 24 | 250 |

What each one looks like, so its pictures match its stats:

- **Skiff (8 m).** About the Magpie's size: the Magpie is about 6 m long, three or four people from bow to stern. Open deck, one small crystal cluster of three crystals, and one pair of wing sails. One bow gun on a swivel at the prow, and one small gun on the rail on each side. It out-turns and out-climbs everything, and it's quick enough to run from a fight it can't win. It's the player's first ship.
- **Cutter (15 m).** Long, low and narrow, with a sharp prow. Two pairs of wing sails swept back like a swallow's. A small crystal cluster. One row of three gun ports a side, plus one gun at the bow and one at the stern. The fastest ship, but thin-skinned.
- **Brig (25 m).** Two crystal clusters, one fore and one aft, and two pairs of wing sails. A raised deck at the stern. One row of six gun ports a side, two bow guns and one stern gun. The all-rounder.
- **Frigate (40 m).** Long and sleek. Three crystal clusters and three pairs of wing sails: a lot of sail for its size, which is why it's fast. One long row of ten gun ports a side, and two guns at each end. The hunter.
- **Galleon (60 m).** Tall and wide, with a high stern castle full of windows and big cargo hatches. Four crystal clusters but little sail for its weight. Two rows of eight gun ports a side, one bow gun, and two stern guns for covering its escape. Slow, and a rich prize.
- **Man-o'-war (90 m).** Huge and armour-plated, with five crystal clusters, three pairs of short, heavy wing sails, and two rows of twelve gun ports a side. Four bow guns and two stern guns. A flying fortress that barely climbs.

What the models show:

| Ship | Crystal clusters | Masts and wing sails | Gun ports a side |
|---|---|---|---|
| Skiff | 1, three crystals | 1 mast, one pair | None: one gun on a swivel on each rail |
| Cutter | 1, three crystals | 2 masts, one pair each, swept back | 1 row of 3 |
| Brig | 2, five crystals each | 2 masts, an upper and a lower pair each, as in Chris's pictures | 1 row of 6 |
| Frigate | 3, five crystals each | 3 masts, an upper and a lower pair each | 1 row of 10 |
| Galleon | 4 | 2 masts, an upper and a lower pair each, as in Chris's pictures | 2 rows of 8 |
| Man-o'-war | 5, large | 3 masts, an upper and a lower pair each, short and heavy | 2 rows of 12 |

## Detail budgets

**Every ship, whatever its size, gets about 100,000 triangles at full detail** (Chris, October 6).

The size of the ship doesn't change the budget, because the camera sits farther back from a big ship than a small one. Whichever ship you fly fills about the same part of the screen, so the same number of triangles looks equally sharp on all of them. A small ship spends its triangles on fine detail: rope, rivets and carved trim. A big ship spends them on more of everything: more guns, decks and windows.

For comparison, the Magpie has about 70,000 triangles in 559 separate pieces. A new ship's pieces are joined into a few dozen parts, so the phone can draw them quickly. Repeated parts are copies of one part, which cost very little to draw: the Man-o'-war's 48 broadside guns are one gun drawn 48 times.

Ships only use full detail up close. **There's one model per class, with a detail dial.** The ships are built by code, so the same code can build any ship with more or fewer pieces: fewer rail posts, rivets and ropes, and curves made of fewer, larger facets. The game turns the dial by how big the ship looks on screen. These are the real counts (`tools/check.mjs` prints them):

| Ship | Full | Middle | Far |
|---|---|---|---|
| Skiff | 98,700 | 11,300 | 1,600 |
| Cutter | 100,800 | 14,900 | 2,100 |
| Brig | 102,200 | 23,000 | 3,200 |
| Frigate | 104,400 | 29,900 | 4,200 |
| Galleon | 100,500 | 36,100 | 4,600 |
| Man-o'-war | 100,700 | 47,500 | 5,600 |

- **Full** is for your own ship, and any ship right alongside, such as when boarding.
- **Middle** is for ships in the fight but not close. It looks almost the same as Full from a few ship-lengths away.
- **Far** is for ships small on screen. It keeps the shape, the sails, the crystals and the gun ports.

Each ship is 14 to 18 draw calls at any level, because each material's pieces are joined into one mesh. Her battle scars add none (see [Battle scars](#battle-scars)), and what moves adds one at full and middle detail (see [What moves](#what-moves)). A raider captain's banner and a treasure ship's chests add a few hundred triangles to the ship that carries them. With three to six enemies in view, the whole scene comes to about 200,000 to 350,000 triangles, which a phone handles easily.

## The pictures each ship needs

The prompts are in `docs/art-requests/01-ships.md`. Each ship gets four pictures:

1. **Concept view.** The whole ship flying, seen three-quarters from the front.
2. **Hull views.** The side view with the top view below it, both with the bow pointing right and at the same scale, without the wing sails. The hull is built from these two outlines.
3. **Front and back.** Straight on, with the wing sails spread.
4. **Parts sheet.** Each part shown separately and flat.

There's also **one lineup of all six ships at the same scale.**

**Received** (October 6): the lineup, the Brig's four pictures, and the Galleon's and the Man-o'-war's four pictures each. The Brig, Galleon and Man-o'-war are built from their own pictures, and the Brig's paint dresses every ship (the Man-o'-war's iron plates come from its own).

**Still useful:** the Skiff's, Cutter's and Frigate's pictures would let their shapes match Chris's art exactly; for now they come from the lineup.

## Open questions for Chris

1. **Are the six names right?** Keep them or change any.
2. **Are plum and gold right for the Captain's pennants?**
