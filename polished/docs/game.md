# The game: Skies of Aethermoor

The game is one page, `dist/game.html`, with everything inside it, so it works with no internet. It runs on a laptop and on a phone.

## How it goes

1. **The title screen.** Choose your skies, the game's difficulty (see [The skies](#the-skies)), then go to port.
2. **The port.** Your ship turns slowly in a quiet void, on a round stone berth with a brass rim. Pick which ship to sail, buy ships and upgrades with Crystal Shards, and set where the crystals' power goes (see [The port](#the-port)).
3. **A voyage.** Set sail over Aethermoor and fight off waves of raiders, each harder than the last (see [A voyage](#a-voyage)). Downed raiders spill Crystal Shards; fly through them to gather them. After each wave, sail on for more or go back to port to keep what you've gathered. If your ship goes down, the crew get her home with half.

What's built, by stage (all October 6):

- **Stage 1: flying.** The Captain's four ships fly over Chris's map.
- **Stage 2: raiders.** Enemy ships in waves, and damage to the hull, sails and crystals.
- **Stage 3: the port** (Chris: "a racing game's garage"). A title screen with three skies, Crystal Shards, buying ships and upgrades, and crystal power. To make fights more than wave after wave, it adds shards to gather, a raider captain every fifth wave, the wind, the Surge, and the choice after each wave.

- **The Galleon and the Man-o'-war join the raiders** (October 6, from Chris's art packs): the Galleon as a treasure ship that runs, the Man-o'-war as a fortress.

Boarding waits (Chris, October 6: fill out the ship-to-ship fighting first).

## The skies

Three difficulties, named for the weather:

| Skies | Raiders | Shards |
|---|---|---|
| **Fair Winds** | Aim much worse, reload slower, hit 40% lighter, 20% less sturdy, sail slower | as earned |
| **Crosswinds** | As described in [The raiders](#the-raiders) | a quarter more |
| **Maelstrom** | Aim a little better, reload a little faster, hit 15% harder, 15% sturdier, an extra Skiff or Cutter in every wave from the third | 60% more |

The title screen remembers your best wave on each.

## The port

- **Ships.** You start with the Skiff, the Zephyr. The Cutter (Gale) costs ◆ 300, the Brig (Tradewind) ◆ 900 and the Frigate (Tempest) ◆ 2,200. Tap a ship at the bottom to look at it; if it's yours, it's the one you sail.
- **How she sails.** Bars for top speed, turning, climbing, hull and firepower, against the best any ship can be. Pale is the ship as built; gold past it is what upgrades add, and red is what they cost.
- **Crystal power** (free, change it any time). A slider from Sails to Guns, in five notches. Each notch towards the guns gives 8% faster reloading and 6% heavier shots, and costs 6% top speed and 6% speeding up. Towards the sails, the other way round.
- **Upgrades.** Four of them, each bought in three steps, for each ship separately:

| Upgrade | Each step |
|---|---|
| **Armour plates** | +20% hull, but 4% less top speed and 10% slower to speed up |
| **Fine canvas** | +20% sails and 4% more top speed |
| **Gun drill** | Guns reload 10% faster |
| **Cut crystals** | +20% crystals and climbs 12% faster |

Steps cost ◆ 60, 140 and 280 on the Skiff, and more on bigger ships: 1.6 times as much on the Cutter, 2.6 times on the Brig and 4 times on the Frigate.

**Your progress is saved** (Crystal Shards, ships, upgrades, skies and best waves): in the browser on that device, and, on claude.ai, in the game page's own private store for you, so it follows you to another device. Nobody else can see it.

## A voyage

- **The waves.** The first comes a few seconds after you set sail, 1.5 to 1.9 km ahead of you, more or less. A banner says what's coming, from where, and where the wind's from.
- **Crystal Shards.** A downed raider spills its shards as glowing amber crystals that drift slowly down. Fly within about 140 m and they're drawn to your ship; leave them 30 seconds and they're gone. Skiffs are worth ◆ 15, Cutters 30, Brigs 60 and Frigates 100, and a raider captain four times as much. Each wave adds 10% (the fifth wave's raiders are worth 40% more than the first's), the skies add their share, and beating a wave adds ◆ 20 for each wave so far.
- **After each wave.** A card shows what you earned, what's in the hold this voyage, and **what the next wave is**. **Sail on** (it sails on by itself after 25 seconds) or go **Back to port** and keep it all. Meanwhile the crew patch her up, back to full in about 8 seconds.
- **Going down.** If your ship goes down, the crew get her home with half this voyage's shards. Pausing and going back to port in the middle of a fight also keeps half; between waves it keeps all.
- **The wind** changes with every wave. It's shown next to the compass: the arrow points the way it blows (up is the way you're heading), and the number is how much it adds to or takes from your top speed, up to 14%. Raiders feel it too.
- **The Surge.** **R**, or the Surge button on a phone: the crystals pour into the sails for 3 seconds, 60% more top speed, then 15 seconds to build up again (the bar in the top-left panel). For running from a broadside, catching a fleeing raider, or reaching shards before they fall.
- **Raider captains** lead every fifth wave: wave 5 is a captain's Brig. A captain's ship has black sails and a gold pennant, and a gold tag. It's twice as sturdy, hits 20% harder and reloads 10% faster, and it's worth four times the shards. (A Man-o'-war needs no captain: in a wave with one, the captain sails the next biggest ship.)
- **Treasure ships.** A Galleon is a rich prize, worth ◆ 300 before the bonuses. She sails across your path until you come within a kilometre or hit her, then runs, weaving, covering her escape with her stern guns. Your guns lock on to her sails rather than her hull: **shoot her sails away (or her hull down to a quarter) and she strikes her colours**, gives up and settles away below the clouds, spilling her shards. Let her get 3.6 km away and she escapes with her treasure. Don't pull alongside her: two decks of eight guns a side.
- **The Man-o'-war** is a fortress: hull 7,000, two decks of twelve guns a side, four in the bow. Her broadside can wreck a Frigate in a few volleys, but she turns slowly and barely climbs, so stay off her beam: above or below her, or off her bow or stern. From above, her five crystal columns are open to your guns; sink her crystals and she's out of the fight.

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
| **R** | Surge |
| **Mouse wheel** | Closer / further |
| **C** | Look ahead again |
| **M** | Big map |
| **P** | Pause (and the way back to port) |
| **Enter** | Sail on, after a wave |
| **H** | Hide or show the keys |

On a laptop the ships are drawn at full sharpness.

### Phone

- **Left thumb**: put it down anywhere on the left side and a stick appears under it. Push left or right to turn, up to climb, down to dive.
- **Right thumb**: drag anywhere on the right side to swing the camera round the ship and aim.
- **Fire**: hold to keep firing as the guns reload. **Surge**: the round blue button beside it.
- **Sail − / Sail +**: hold to take in or let out sail.
- **❚❚** under the compass pauses. Tap the corner map to make it big.

On a phone the game draws a little less sharply so it stays smooth, and pauses by itself if you leave the page.

## Aiming and the guns

**Where you look decides which guns fire.** Look ahead and the bow guns fire, look to the left (port) or right (starboard) and that side's broadside fires, look back and the stern guns fire. The name of the guns that will fire is shown under the compass (on a phone, above the Fire button), with a bar that fills as they reload.

- Every gun fires from where it really sits on the model, so a broadside comes out of the gun ports along the side.
- Guns only swing a little, and tilt even less, so you have to put the ship where its guns can reach. Flying well above or below a ship keeps it out of your broadside, and keeps you out of its.
- The shots are glowing crystal bolts that take time to fly: the Captain's burn gold, the raiders' red.
- **Point the crosshair at a raider and the guns lock on.** The crosshair turns red and the raider's tag glows. Locked on, your gunners aim ahead of the raider, where it will be when the shot gets there, and at the middle of its hull. If the guns facing it can't reach it (too far, or too far above or below), the crosshair fades and the gun label says "out of reach".

| Guns | Speed of the shot | Reload | Reach | Swing / tilt | Shot |
|---|---|---|---|---|---|
| **Chasers** (bow and stern, and the Skiff's swivels) | 430 m/s | 1.1 s | about 1.4 km | 35° / 15° | 28 |
| **Broadsides** (the guns along the sides) | 320 m/s | 2.6 s, all together | about 830 m | 43° / 9° | 55, spreading a little |

**Bigger ships carry bigger guns**: a shot's weight is scaled by the ship's class: 0.8 on a Skiff, 0.9 on a Cutter, 1 on a Brig, 1.1 on a Frigate, 1.15 on a Galleon and 1.25 on a Man-o'-war (and then by crystal power and, for raiders, the skies). The Galleon's and Man-o'-war's heavy guns take their crews 15% and 30% longer to reload. Each hit takes its weight off whatever it hits: the hull, the sails or the crystals.

## How each ship flies

How fast a ship goes, how tight it turns and how quickly it climbs all come from its stats in `docs/ships.md`, then its upgrades and crystal power:

- top speed: 14 m/s, plus 3.2 m/s for each point of **speed**
- turning: 0.06, plus 0.028 radians a second for each point of **turning**
- climbing: 3 m/s, plus 2.1 m/s for each point of **climbing**

Measured by `npm run check`, with no upgrades and no wind, 20 seconds at full sail, turning and climbing the whole time:

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

The raiders fly the same four classes as the Captain, by the same rules. They're easy to tell apart: **rust-red sails, darker planks and crimson pennants with a black hoist**. Each has a tag over it with its class, its distance and its three health bars; off screen, the tag waits at the edge with an arrow pointing to it.

- **Skiffs and Cutters make attack runs.** They come at you bow-first, firing their bow guns, then after 10 to 15 seconds, or when they get close, peel away side-on and come round again. That's when they're open to your broadside.
- **Brigs, Frigates and the Man-o'-war fight broadside.** They come alongside a few hundred metres off, on whichever side you're on, and fire whole sides.
- **The Galleon runs** (see Treasure ships, above).
- On Crosswinds they're a little weaker than the Captain: they sail at 92% of their class's top speed, reload half as slowly again, aim a little off (up to 2 m for every 100 m to you), and hold their fire until you're within about two-thirds of their reach.
- They're drawn at the middle or far setting of the detail dial (`docs/ships.md`), whichever suits how big they look on screen.

**The waves:**

| Wave | Raiders |
|---|---|
| 1 | a Skiff |
| 2 | two Skiffs |
| 3 | a Cutter |
| 4 | a Cutter and a Skiff |
| 5 | **a raider captain's Brig** |
| 6 | **a treasure ship** (a Galleon) and a Cutter |
| 7 | a Frigate |
| 8 | a Frigate and two Cutters |
| 9 | two Brigs and two Skiffs |
| 10 | **a raider captain's Frigate**, a Brig, two Cutters and a Skiff |
| 11 | a treasure ship, a Frigate and a Cutter |
| 12 | **a Man-o'-war** and two Cutters |
| 13 | two Frigates and a Brig |
| 14 | two treasure ships, a Frigate and a Cutter |
| 15 | **a Man-o'-war**, **a raider captain's Frigate**, a Brig and a Cutter |
| after that | three to six, mixed (at most one Man-o'-war), with a captain every fifth wave |

**How hard it is.** `node tools/sim-fight.mjs skiff 5 cross` sends out a simulated Captain. It simply points at the nearest raider and fires, keeps a raider abeam in a ship with broadsides, and waits for repairs between waves. It never climbs out of a broadside, never surges and never dodges. On Crosswinds it:

- gets the Skiff through four waves, with about ◆ 420 in the hold (enough for the Cutter), and then the wave-5 captain sinks it
- gets the Brig through seven or eight waves
- gets the Frigate through five to eight waves on Maelstrom
- beats the treasure ship's wave (wave 6) in a Cutter, catching her in about three minutes; in a Brig it goes for her escort first, and she gets away
- in a Frigate, beats wave 12's Man-o'-war about half the time: it fights her side to side, where she's strongest

On Fair Winds the Skiff gets through all five. A real Captain who uses height, the Surge and the wind does better.

## The code

- `src/game/main.js`: the page; the voyage, the camera, aiming and locking on, the waves, shards and the HUD
- `src/game/port.js`: the title screen and the port, and the void they show your ship in
- `src/game/progress.js`: the save (shards, ships, upgrades, skies, best waves) and the three skies
- `src/game/mods.js`: the upgrades and crystal power, and what they do to a ship
- `src/game/world.js`: the map, sky, cloud floor, cloud puffs and region names
- `src/game/flight.js`: how a ship flies, for the Captain and the raiders; damage, the wind and the Surge
- `src/game/raiders.js`: the raiders: their colours, their tactics, captains, bounties and the waves
- `src/game/pickups.js`: the Crystal Shards a downed raider spills
- `src/game/damage.js`: what a shot hits, worked out from each ship's own model
- `src/game/effects.js`: smoke and fire from damaged ships
- `src/game/guns.js`: where each gun sits, which battery faces where, aiming ahead of a moving ship, gun weights, and the bolts
- `src/game/input.js`: the keyboard, mouse and touch controls
- `demos/game.html`: the title screen, port and HUD, and the help
- `tools/map-art.mjs`: packs the nine map tiles into `assets/map/` (run it if the tiles change)
- `tools/sim-fight.mjs`: the simulated Captain, for tuning the raiders

`npm run check` plays the game in a hidden browser:

- It opens on the title screen, goes to port, and checks a ship can't be bought without the shards. With shards, it buys the Cutter and armour, sets the crystal power, and checks the stats change.
- It flies each ship and fires every battery at a raider of the same class 260 m off, checking the guns lock on and hit.
- It shoots a raider down, watches it fall away spilling shards, and flies through shards to gather them.
- It checks raiders far off use the far model, sends a Cutter at a Captain who does nothing and checks it does harm, and checks a captain leads wave 5, a treasure ship comes in wave 6 and a Man-o'-war in waves 12 and 15. It shoots a treasure ship's sails until she strikes her colours, and lets another run until she gets away.
- It plays a whole voyage from the port: beats wave 1, sails on, sinks, and checks half the shards come home. It checks the save survives a reload.
- It tries the keys, the mouse and the touch controls, and saves pictures of the title, the port and a battle into `shots/`.
