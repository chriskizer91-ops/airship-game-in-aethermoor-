# The game: Skies of Aethermoor

The game is one page, `dist/game.html`, with everything inside it, so it works with no internet. It runs on a laptop and on a phone.

## What's in it now

**Stage 1 (October 6): flying.**

- **Fly any of the Captain's four ships**: the Skiff (Zephyr), the Cutter (Gale), the Brig (Tradewind) and the Frigate (Tempest). The ship you fly is always the full-detail model.
- **The map lies flat under where you fly**, 23 km across, with the cloud floor and puffs of cloud between you and the ground. The name of the region you're over shows when you cross into it.
- The **corner map** shows where you are and which way you're heading. Raiders show on it as red dots.

**Stage 2 (October 6): raiders.**

- **Raiders come in waves** (see [The raiders](#the-raiders)), and they fly and fight back.
- **Every ship has three health bars**: hull, sails and crystals. Yours are in the top-left panel, and each raider's are on the tag above it.
- **Ships go down.** A raider with no hull left rolls over and falls burning through the clouds; one with dead crystals sinks. If yours goes down, the crew get her back in the air after a few seconds, the raiders scatter, and the same wave comes again.
- Between waves the crew patch your ship up, back to full in about 8 seconds.

Next is stage 3: boarding and loot. The Galleon and the Man-o'-war wait until the four smaller ships are fully playable (Chris, October 6).

## Controls

### Laptop

| Keys | What they do |
|---|---|
| **W / S** | More sail / less sail (sail sets your speed) |
| **A / D**, or **← →** | Turn |
| **Space** or **E**, or **↑** | Climb |
| **Shift** or **Q**, or **↓** | Dive |
| **Mouse** | Aim. Click the sky once and the mouse is locked to the view; moving it swings the camera round the ship. **Esc** lets go. Without the lock, dragging also aims. |
| **Left click** or **F** | Fire |
| **Mouse wheel** | Closer / further |
| **C** | Look ahead again |
| **M** | Big map |
| **1 2 3 4** | Skiff, Cutter, Brig, Frigate |
| **H** | Hide or show the keys |

On a laptop the game starts in the Brig and draws at full sharpness.

### Phone

- **Left thumb**: put it down anywhere on the left side and a stick appears under it. Push left or right to turn, up to climb, down to dive.
- **Right thumb**: drag anywhere on the right side to swing the camera round the ship and aim.
- **Fire**: hold to keep firing as the guns reload.
- **Sail − / Sail +**: hold to take in or let out sail.
- Tap the corner map to make it big. Tap a ship's name at the bottom to switch ships.

On a phone the game starts in the Skiff, and draws a little less sharply so it stays smooth.

## Aiming and the guns

**Where you look decides which guns fire.** Look ahead and the bow guns fire, look to the left (port) or right (starboard) and that side's broadside fires, look back and the stern guns fire. The name of the guns that will fire is shown under the compass (on a phone, next to the Fire button), with a bar that fills as they reload.

- Every gun fires from where it really sits on the model, so a broadside comes out of the gun ports along the side.
- Guns only swing a little, and tilt even less, so you have to put the ship where its guns can reach. Flying well above or below a target keeps it out of your broadside, and keeps you out of an enemy's.
- The shots are glowing crystal bolts that take time to fly: the Captain's burn gold, the raiders' red.
- **Point the crosshair at a raider and the guns lock on.** The crosshair turns red and the raider's tag glows. Locked on, your gunners aim ahead of the raider, where it will be when the shot gets there, and at the middle of its hull. If the guns facing it can't reach it (too far, or too far above or below), the crosshair fades and the gun label says "out of reach".

| Guns | Speed of the shot | Reload | Reach | Swing / tilt |
|---|---|---|---|---|
| **Chasers** (bow and stern, and the Skiff's swivels) | 430 m/s | 1.1 s | about 1.4 km | 35° / 15° |
| **Broadsides** (the guns along the sides) | 320 m/s | 2.6 s, all together | about 830 m | 43° / 9° |

Broadside shots are heavier (55 against 28) but spread a little. Each hit takes that much off whatever it hits: the hull, the sails or the crystals.

## How each ship flies

How fast a ship goes, how tight it turns and how quickly it climbs all come from its stats in `docs/ships.md`:

- top speed: 14 m/s, plus 3.2 m/s for each point of **speed**
- turning: 0.06, plus 0.028 radians a second for each point of **turning**
- climbing: 3 m/s, plus 2.1 m/s for each point of **climbing**

Measured by `npm run check`, 20 seconds at full sail, turning and climbing the whole time:

| Ship | Top speed | Turned | Climbed |
|---|---|---|---|
| Skiff | 142 km/h | 383° | 460 m |
| Cutter | 166 km/h | 320° | 339 m |
| Brig | 131 km/h | 257° | 299 m |
| Frigate | 142 km/h | 225° | 259 m |

- A ship eases into a turn or a climb, the way a heavy ship answers its wheel, and leans into its turns.
- A ship that is barely moving turns slowly.
- The crystals' lift fades near the Thinning (2,400 m), so that's the ceiling. The lowest you can fly is 60 m.

## Damage

Each shot hits whatever it meets first: the sails (one zone per mast), the crystals (each furnace column and its crown of gems), or the hull (the shape it was built from, up to the rail). What damage does, following `docs/ships.md`:

- **Hull**: at zero, the ship goes down. A ship below half hull trails smoke, thicker and darker as the hull goes; below a quarter it burns too. The crew falls with the hull (for boarding, later).
- **Sails**: torn sails slow the ship, down to 30% of its top speed with none left, and make it turn badly, down to 45%.
- **Crystals**: cracked crystals climb badly, down to 25%, and can't lift as high. Below half, the ship starts to sink, faster as they go. At zero, the ship sinks out of the fight.

## The raiders

The raiders fly the same four classes as the Captain, by the same rules, so a Raider Cutter is as fast as your Cutter, nearly. They're easy to tell apart: **rust-red sails, darker planks and crimson pennants with a black hoist**.

- **Skiffs and Cutters chase.** They come at you bow-first, fire their bow guns, and break away when they get close, then come round again.
- **Brigs and Frigates fight broadside.** They come alongside a few hundred metres off, on whichever side you're on, and fire whole sides.
- They're a little weaker than the Captain: they sail at 92% of their class's top speed, reload half as slowly again, aim a little off (up to 2 m for every 100 m to you), and hold their fire until you're within about two-thirds of their reach.
- They're drawn at the middle or far setting of the detail dial (`docs/ships.md`), whichever suits how big they look on screen.

**The waves**, each 1.5 to 1.9 km ahead of you when it comes:

| Wave | Raiders |
|---|---|
| 1 | a Skiff |
| 2 | two Skiffs |
| 3 | a Cutter |
| 4 | a Cutter and a Skiff |
| 5 | a Brig |
| 6 | a Brig and a Cutter |
| 7 | a Frigate |
| 8 | a Frigate and two Cutters |
| 9 | two Brigs and two Skiffs |
| 10 | a Frigate, a Brig, two Cutters and a Skiff |
| after that | three to six, mixed |

A simulated Captain that simply points at the nearest raider and fires (`node tools/sim-fight.mjs skiff 4`) gets through the first four waves in the Skiff, ending wave 4 with about a third of its hull, and through the first seven in the Brig with most of it. A real Captain who uses height (flying above or below a Brig or Frigate keeps out of its broadsides) does better.

## The code

- `src/game/main.js`: the page; the camera, aiming and locking on, the waves and the HUD
- `src/game/world.js`: the map, sky, cloud floor, cloud puffs and region names
- `src/game/flight.js`: how a ship flies, for the Captain and the raiders, and how damage slows it and brings it down
- `src/game/raiders.js`: the raiders: their colours, their tactics and the waves
- `src/game/damage.js`: what a shot hits, worked out from each ship's own model
- `src/game/effects.js`: smoke and fire from damaged ships
- `src/game/guns.js`: where each gun sits, which battery faces where, aiming ahead of a moving ship, and the bolts
- `src/game/input.js`: the keyboard, mouse and touch controls
- `demos/game.html`: the HUD and the help
- `tools/map-art.mjs`: packs the nine map tiles into `assets/map/` (run it if the tiles change)

`npm run check` plays the game in a hidden browser. It flies each ship and fires every battery at a raider of the same class 260 m off, checking the guns lock on and hit. It shoots a raider down and watches it fall away, and checks the raiders far off use the far model. It sends a Cutter at a Captain who does nothing and checks it does harm. It sinks the Captain and checks she comes back. Then it tries the keys, the mouse and the touch controls, and saves pictures of a battle into `shots/`.
