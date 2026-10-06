# The game: Skies of Aethermoor

The game is one page, `dist/game.html`, with everything inside it, so it works with no internet. It runs on a laptop and on a phone.

## What's in it now (stage 1, October 6)

- **Fly any of the Captain's four ships**: the Skiff (Zephyr), the Cutter (Gale), the Brig (Tradewind) and the Frigate (Tempest). The ship you fly is always the full-detail model.
- **The map lies flat under where you fly**, 23 km across, with the cloud floor and puffs of cloud between you and the ground. The name of the region you're over shows when you cross into it.
- **Practice targets**: sixteen brass rings with a glowing crystal, floating near the start. A hit ring comes back after 9 seconds.
- The **corner map** shows where you are, which way you're heading, and the targets.

Next comes stage 2: enemy ships that fly and shoot back, and health bars for the hull, sails and crystals (see `docs/ships.md`). The Galleon and the Man-o'-war wait until the four smaller ships are fully playable (Chris, October 6).

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
- The shots are glowing crystal bolts that take time to fly, so lead a moving target.

| Guns | Speed of the shot | Reload | Reach | Swing / tilt |
|---|---|---|---|---|
| **Chasers** (bow and stern, and the Skiff's swivels) | 430 m/s | 1.1 s | about 1.4 km | 35° / 15° |
| **Broadsides** (the guns along the sides) | 320 m/s | 2.6 s, all together | about 830 m | 43° / 9° |

Broadside shots are heavier (55 against 28) but spread a little. These numbers will be tuned once enemy ships fight back.

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

## The code

- `src/game/main.js`: the page; the camera, aiming, targets and the HUD
- `src/game/world.js`: the map, sky, cloud floor, cloud puffs, region names and the practice targets
- `src/game/player.js`: how the ship flies
- `src/game/guns.js`: where each gun sits, which battery faces where, and the bolts
- `src/game/input.js`: the keyboard, mouse and touch controls
- `demos/game.html`: the HUD and the help
- `tools/map-art.mjs`: packs the nine map tiles into `assets/map/` (run it if the tiles change)

`npm run check` plays the game in a hidden browser. It flies each ship, fires every battery at a target 260 m off and checks it hits, then tries the keys, the mouse and the touch controls, and saves pictures into `shots/`.
