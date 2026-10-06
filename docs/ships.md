# The ships

**This is a first draft for Chris to change.** The numbers are only starting points. They exist so the ship pictures can be generated to match them: every gun, sail and crystal in a picture should be one the stats count.

## One recipe, six ships

All six ships are built the way the Magpie is built in `reference/the-magpie-over-aethermoor.html`:

- The hull is shaped from two outlines traced off the art: a side view and a straight-down top view.
- The sails, crystals, furnace, fins, rudder and lanterns are cut out of a sheet of separate parts and placed on the hull.

So every ship needs the same set of pictures (see [the pictures each ship needs](#the-pictures-each-ship-needs)). None of them is the Magpie: the player's ship is a new ship with its own name, and nobody from the Magpie page is at its helm. That keeps the ships free to reuse in other games.

What every ship has, like the Magpie:

- a wooden hull with brass bands
- no gas bag
- **sunstone crystals** on a furnace column, which give the lift
- **wing sails** on booms out to each side, which catch the Aether
- fins under the belly, a rudder at the stern, lanterns, and a wheel at the stern

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
| **Guns a side** | Broadside guns: heavy, but only good up close. They fire together as one volley. |
| **Crew** | How strong the ship is when boarding, or being boarded. |

Guns only tilt a little up or down, so flying above or below a ship keeps you out of its broadside.

**Size doesn't decide speed.** Speed comes from how much sail a ship carries for its weight. Turning and climbing come from size and lift. So a small ship isn't always fast: the Frigate is faster than the Skiff, and only the Cutter beats it.

## The six ships (first draft)

| Ship | Length | Hull | Sails | Crystals | Speed | Turning | Climbing | Bow guns | Stern guns | Guns a side | Crew |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Skiff | 8 m | 300 | 150 | 150 | 6 | 10 | 10 | 1 | 0 | 1 | 4 |
| Cutter | 15 m | 600 | 300 | 250 | **10** | 8 | 7 | 1 | 1 | 3 | 12 |
| Brig | 25 m | 1,200 | 600 | 500 | 7 | 6 | 6 | 2 | 1 | 6 | 30 |
| Frigate | 40 m | 2,200 | 1,000 | 900 | 8 | 5 | 5 | 2 | 2 | 10 | 60 |
| Galleon | 60 m | 4,000 | 1,500 | 1,600 | 4 | 3 | 3 | 1 | 2 | 16 | 120 |
| Man-o'-war | 90 m | 7,000 | 2,400 | 2,600 | 3 | 2 | 1 | 4 | 2 | 24 | 250 |

What each one looks like, so its pictures match its stats:

- **Skiff (8 m).** About the Magpie's size: the Magpie is about 6 m long, three or four people from bow to stern. Open deck, one small crystal cluster of three crystals, and one pair of wing sails. One bow gun on a swivel at the prow, and one small gun on the rail on each side. It out-turns and out-climbs everything.
- **Cutter (15 m).** Long, low and narrow, with a sharp prow. Two pairs of wing sails swept back like a swallow's. A small crystal cluster. One row of three gun ports a side, plus one gun at the bow and one at the stern. The fastest ship, but thin-skinned.
- **Brig (25 m).** Two crystal clusters, one fore and one aft, and two pairs of wing sails. A raised deck at the stern. One row of six gun ports a side, two bow guns and one stern gun. The all-rounder.
- **Frigate (40 m).** Long and sleek. Three crystal clusters and three pairs of wing sails: a lot of sail for its size, which is why it's fast. One long row of ten gun ports a side, and two guns at each end. The hunter.
- **Galleon (60 m).** Tall and wide, with a high stern castle full of windows and big cargo hatches. Four crystal clusters but little sail for its weight. Two rows of eight gun ports a side, one bow gun, and two stern guns for covering its escape. Slow, and a rich prize.
- **Man-o'-war (90 m).** Huge and armour-plated, with five crystal clusters and two rows of twelve gun ports a side. Four bow guns and two stern guns. A flying fortress that barely climbs.

## Detail budgets

The Magpie has about 70,000 triangles in 559 separate pieces. That's fine for one ship, but six ships built that way would be too slow on a phone. So:

- **The player's ship** gets the most detail: about 80,000 to 150,000 triangles. Its pieces are joined into a few dozen parts so the phone can draw it quickly.
- **Enemy ships** (three to six in view) get about 10,000 to 25,000 triangles each, with bigger ships getting more. Each one is joined into a few parts sharing one picture sheet.
- **Far-off ships** switch to a very simple version of about 1,000 to 3,000 triangles once they're small on screen.

## The pictures each ship needs

Each ship needs the same set, so the same build code works for all six:

1. **Side view.** Flat with no perspective, the bow pointing right, and the whole ship in frame.
2. **Top view.** Straight down, the bow pointing up.
3. **Front view and back view.** Flat and straight on.
4. **A parts sheet** with each part shown separately and flat: wing sail, crystal, furnace, gun (bow gun and broadside gun), rudder, belly fin, lantern and any figurehead.

Every picture should have a plain, flat background, even lighting and no shadows on the ground. The gun ports in the side view must match the number of guns a side.

The set also needs **one lineup of all six ships side by side, drawn at the same scale.**

The prompts for these pictures go in `docs/art-requests/` once the stats above are settled.

## Open questions for Chris

1. **Which ship does the player fly?** Is it one class all game, or do they move up through the classes? If players can fly any class, every class needs a high-detail version as well as an enemy version.
2. **What is the player's ship called?**
3. Are the six classes, lengths and gun counts right? Change anything.
