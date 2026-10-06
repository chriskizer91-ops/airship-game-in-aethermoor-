# The game: Skies of Aethermoor

The game is one page, `dist/game.html`, with everything inside it, so it works with no internet. It runs on a laptop and on a phone.

## How it goes

1. **The title screen.** Choose your skies, the game's difficulty (see [The skies](#the-skies)), then go to port.
2. **The port.** Your ship turns slowly in a quiet void, on a round stone berth with a brass rim; drag her (here or on the title screen) to turn her round. Pick which ship to sail, buy ships and upgrades with Crystal Shards, and set where the crystals' power goes (see [The port](#the-port)).
3. **A voyage.** Set sail over Aethermoor and fight off waves of raiders, each harder than the last (see [A voyage](#a-voyage)). Downed raiders spill Crystal Shards; fly through them to gather them. After each wave, sail on for more or go back to port to keep what you've gathered. If your ship goes down, the crew get her home with half.

What's built, by stage (all October 6):

- **Stage 1: flying.** The Captain's four ships fly over Chris's map.
- **Stage 2: raiders.** Enemy ships in waves, and damage to the hull, sails and crystals.
- **Stage 3: the port** (Chris: "a racing game's garage"). A title screen with three skies, Crystal Shards, buying ships and upgrades, and crystal power. To make fights more than wave after wave, it adds shards to gather, a raider captain every fifth wave, the wind, the Surge, and the choice after each wave.

- **The Galleon and the Man-o'-war join the raiders** (October 6, from Chris's art packs): the Galleon as a treasure ship that runs, the Man-o'-war as a fortress.
- **How a fight feels** (October 6): broadsides that ripple down the side with flame and gunsmoke, shots like crystal comets, the view kicking back with your guns and shaking when you're hit, marks on the crosshair for every hit, a red arc pointing to whoever hit you, and raiders' gun ports glowing just before their broadsides (see [How a fight feels](#how-a-fight-feels)).
- **Wrecks worth watching** (October 6): debris that matches what you hit, raiders going down in a chain of blasts with their sails burning (and, on a laptop, their masts falling), a column of smoke and a hole torn in the cloud deck, the bounty rising from the wreck, the shard count counting up, slow motion when a wave's last raider goes down, and a Surge that feels fast (see [Wrecks](#wrecks) and [The Surge](#the-surge)).

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

Playing on your phone and your laptop, **the newest progress always wins**. A game left open on one device picks up what you did on the other (the port says "Your progress from your other device is here"; a new browser just shows it), and it checks again just before it saves, so it never writes its older progress over newer. **Shards won on a voyage are never lost that way**: if the other device saved something this one hadn't heard about yet, the voyage's shards are added to the newer progress, and the port says so. A save that can't get through (the connection blinks, or there's none) goes up a moment later, or the next time the game is open and online on that device. What can still be lost is a change made in port on a device that hadn't caught up yet: a ship or an upgrade bought, the skies or the crystal power. The newer progress replaces it, and any shards it cost come back.

## A voyage

- **The waves.** The first comes a few seconds after you set sail, 1.5 to 1.9 km ahead of you, more or less. A banner says what's coming, from where, and where the wind's from.
- **Crystal Shards.** A downed raider spills its shards as glowing amber crystals that drift slowly down, with a gold flash, and her bounty rises out of the wreck in gold: "◆ 75", or "Captain's bounty" or "Treasure" over a big one. Fly within about 140 m and they're drawn to your ship, each with a little gold glint, and the shard count in the corner pops gold and counts up as they come in; leave them 30 seconds and they're gone. Skiffs are worth ◆ 15, Cutters 30, Brigs 60 and Frigates 100, and a raider captain four times as much. Each wave adds 10% (the fifth wave's raiders are worth 40% more than the first's), the skies add their share, and beating a wave adds ◆ 20 for each wave so far.
- **After each wave.** When the last raider of a wave goes down, the world slows to a quarter speed for about a second and a half, so you can watch her go; then a card rises into view showing what you earned (it counts up), what's in the hold this voyage, and **what the next wave is**. **Sail on** (it sails on by itself after 25 seconds) or go **Back to port** and keep it all. Meanwhile the crew patch her up, back to full in about 8 seconds. Every voyage from port starts afresh at wave 1.
- **Going down.** If your ship goes down, the crew get her home with half this voyage's shards. Pausing and going back to port in the middle of a fight also keeps half; between waves it keeps all.
- **The wind** changes with every wave. It's shown next to the compass: the arrow points the way it blows (up is the way you're heading), and the number is how much it adds to or takes from your top speed, up to 14%. Raiders feel it too.
- **The sun** is low in the west, and it throws the shadows of your masts, sails and rigging across your deck.
- **The Surge.** **R**, or the Surge button on a phone: the crystals pour into the sails for 3 seconds, 60% more top speed, then 15 seconds to build up again (the bar in the top-left panel). For running from a broadside, catching a fleeing raider, or reaching shards before they fall. How it looks: see [The Surge](#the-surge).
- **Raider captains** lead every fifth wave: wave 5 is a captain's Brig. A captain's ship has black sails and a gold pennant, and a gold tag. It's twice as sturdy, hits 20% harder and reloads 10% faster, and it's worth four times the shards. (A Man-o'-war needs no captain: in a wave with one, the captain sails the next biggest ship.) Her ship is made ready while the card before her wave is up, so her wave arrives without a stutter.
- **Treasure ships.** A Galleon is a rich prize, worth ◆ 300 before the bonuses. She sails across your path until you come within a kilometre or hit her, then runs, weaving, covering her escape with her stern guns. Your guns lock on to her sails rather than her hull: **shoot her sails away (or her hull down to a quarter) and she strikes her colours**: she doesn't blow up, but lowers her pennants, glints gold from her hold, and settles away below the clouds, spilling her shards. Let her get 3.6 km away and she escapes with her treasure. Don't pull alongside her: two decks of eight guns a side.
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
| **Mouse wheel** | Closer / further (a trackpad's two-finger swipe moves it a little at a time) |
| **C** | Look ahead again |
| **M** | Big map |
| **P** | Pause (and the way back to port) |
| **Enter** | Sail on, after a wave |
| **H** | Hide or show the keys |

On a laptop the ships are drawn at full sharpness.

### Phone

- **Left thumb**: put it down anywhere on the left side and a stick appears under it. Push left or right to turn, up to climb, down to dive.
- **Right thumb**: drag anywhere on the right side to swing the camera round the ship and aim. While your thumb rests there the view stays where you aimed it; lift it, and after a few seconds the view eases back behind the ship.
- **Fire**: hold to keep firing as the guns reload, and **slide your thumb off it to aim while you fire**. **Surge**: the round blue button beside it.
- **Sail − / Sail +**: hold to take in or let out sail.
- **❚❚** under the compass pauses. Tap the corner map to make it big.

On a phone the game draws a little less sharply so it stays smooth (and with fewer sparks and puffs of smoke), and pauses by itself if you leave the page. If the phone clears the game's pictures while you're away (phones do, after a long while), the game draws them again when you come back.

The cloud deck's pattern is worked out once, when the game starts, and kept as a picture; the deck and the cloud shadows on the ground read it from there. That saves a phone most of the work of drawing the sky, and looks the same.

## Aiming and the guns

**Where you look decides which guns fire.** Look ahead and the bow guns fire, look to the left (port) or right (starboard) and that side's broadside fires, look back and the stern guns fire. The name of the guns that will fire is shown under the compass (on a phone, above the Fire button), with a bar that fills as they reload.

- Every gun fires from where it really sits on the model, so a broadside comes out of the gun ports along the side.
- **A broadside ripples down the side**, bow to stern: a gun every 55 thousandths of a second, the whole side in about half a second (on the Galleon and the Man-o'-war, both decks fire together at each port). Bow and stern guns fire in pairs, a moment apart. The first gun fires the moment you press, and the reload starts then.
- Guns only swing a little, and tilt even less, so you have to put the ship where its guns can reach. Flying well above or below a ship keeps it out of your broadside, and keeps you out of its.
- The shots are like crystal comets that take time to fly: a hot head and a long tail fading out behind, heavier for a broadside than a chaser, gold for the Captain's and red for the raiders'. A shot that hits nothing burns out in a little wisp of sparks.
- **Point the crosshair at a raider and the guns lock on.** The crosshair turns red and the raider's tag glows. Locked on, your gunners aim ahead of the raider, where it will be when the shot gets there, and at the middle of its hull. If the guns facing it can't reach it (too far, or too far above or below), the crosshair fades and the gun label says "out of reach".

| Guns | Speed of the shot | Reload | Reach | Swing / tilt | Shot |
|---|---|---|---|---|---|
| **Chasers** (bow and stern, and the Skiff's swivels) | 430 m/s | 1.1 s | about 1.4 km | 35° / 15° | 28 |
| **Broadsides** (the guns along the sides) | 320 m/s | 2.6 s (the side ripples off in about half a second) | about 830 m | 43° / 9° | 55, spreading a little |

**Bigger ships carry bigger guns**: a shot's weight is scaled by the ship's class: 0.8 on a Skiff, 0.9 on a Cutter, 1 on a Brig, 1.1 on a Frigate, 1.15 on a Galleon and 1.25 on a Man-o'-war (and then by crystal power and, for raiders, the skies). The Galleon's and Man-o'-war's heavy guns take their crews 15% and 30% longer to reload. Each hit takes its weight off whatever it hits: the hull, the sails or the crystals.

## How a fight feels

- **Your guns.** Each port spits a tongue of flame and a puff of white gunsmoke that billows out and drifts back into a bank of smoke along her side, and the ship heels away from the side that fired. Each gun that fires shoves the view back a little and widens it for a moment, so a broadside rolls like thunder under your feet. On an Android phone your volleys buzz the phone too, a pulse a gun.
- **Your hits.** When your shot lands, four little ticks flash round the crosshair in the colour of what it hit: gold for the hull, cream for the sails, orange with a sparkle for the crystals (the same colours as the raider's bars). A rippling broadside's hits read as a chain of flickers. A shot that brings a raider down flashes a red X and a ring. On the raider's tag, the bar for the part you hit flashes, and the piece you knocked off shows white for a moment before it drains away.
- **What a hit knocks off.** Each hit throws sparks the colour of what it hit, and debris you can read at a glance: splinters of wood that tumble and fall, with a puff of dust, from the hull; scraps of canvas that flutter slowly down from the sails, in the sail's own colour (rust-red from a raider, black from a raider captain, cream from yours); glittering amber shards from the crystals. Shoot a treasure ship's sails and you can see her canvas coming away. Hits on your own ship throw your own splinters and canvas.
- **Hits on you.** The view jolts, hardest for a hit on the hull, a rattle for the crystals and a little for the sails, and it lurches towards the side that was hit. A red arc glows on a ring round the middle of the screen, pointing to where the shot came from, and the red at the edge of the screen is strongest on that side. The row for what was hit (Hull, Sails or Crystals) flashes in your panel, and its bar shows the chunk knocked off. On an Android phone each hit buzzes the phone, and bringing a raider down gives a longer buzz (but not a treasure ship giving up: she goes quietly). An iPhone can't buzz from a web page.
- **Near misses.** A raider's shot that only just misses flares bright as it streaks past, with a flash of sparks and a twitch of the view.
- **Blasts and the Surge.** A raider blowing up within 250 m shakes the view (each blast of her chain, too), and so does starting a Surge.
- **Slow motion.** Bringing down the last raider of a wave slows the world to a quarter speed for about a second and a half, the view narrowing a little; then it speeds back up and the card between waves rises. When your own ship goes down, the world slows to half speed for a moment.
- **A raider's broadside** is coming when her gun ports glow red along her side: for half a second (a little longer on the Galleon and the Man-o'-war) they glow, brightening to hot gold, then her side ripples off. That's your moment to climb, dive or turn away.
- **Less motion.** If your phone or laptop is set to reduce motion, the shake and kick are cut to a third, and the phone doesn't buzz.
- **On a phone** the game uses fewer sparks, puffs of smoke and pieces of debris (six in ten), and draws them no bigger than a phone can fill quickly, so a big fight stays smooth. Masts don't fall on a phone (the sails burn away instead).

## Wrecks

A raider going down is worth watching, and how she goes depends on what brought her down:

- **Her hull gone: she blows apart.** A white flash and a great burst of fire, splinters and canvas. Then a chain of blasts walks along her hull from stern to bow: three on a Skiff, four on a Brig, five on a Frigate, nine on a Man-o'-war. Her crystals sputter and go dark, and her sails flare up and burn away. She rolls right over and falls nose-down, trailing a thick column of black smoke and fire that hangs in the sky after her.
- **Her masts fall** (on a laptop, when she's close enough to be drawn in detail): a moment after she blows, her masts crack at the deck one after another, topple over the side with their sails, break away and tumble down trailing smoke, all the way through the clouds.
- **Her crystals dead: she sinks.** No blasts: her crystals sputter and shatter into amber shards, they go dark, and she sinks upright in grey smoke.
- **A treasure ship striking her colours** doesn't blow up: her pennants come down their masts, gold glints from her hold, and she settles away.
- **Every wreck goes below the clouds.** A sinking ship (crystals dead, or colours struck) sinks slowly at first; a few seconds later the last of her lift gives out and she drops away faster and faster, so from a fight's usual height she's through the cloud deck in about 10 to 14 seconds. No wreck vanishes in the open sky.
- **Through the cloud deck.** Falling through the cloud floor, a wreck tears a hole in it and throws up a ring of cloud; the hole closes over a few seconds. A burning one glows orange under the cloud a moment after she's gone.
- **When several go at once**, the first two get the whole show and any others the flash and the smoke, and at most two ships' masts fall at once, so a phone stays smooth. The smoke and fire from wrecks only take what room is left after the fight's own, so the guns' smoke and sparks never run short.

## The Surge

Hit Surge and the view widens with a jolt and drops back a little (just the same on a phone that's running slowly). Pale streaks of wind rush past the ship, her crystals flare and stream blue light up into her sails, a ring of blue sparks bursts from her stern, two white vapour trails pour from her outermost sail tips and hang where she's been, and the view rumbles a little until the Surge runs out. Diving close to top speed shows the streaks faintly too. (If your device asks for less motion, the view widens without the jolt.)

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

- **Hull**: at zero, the ship goes down. A ship going down rolls over, nose-down, and falls away below the clouds before she's gone (at least 150 m, if she was flying low). A ship below half hull trails smoke, thicker and darker as the hull goes; below a quarter it burns too. The crew falls with the hull (for boarding, later).
- **Sails**: torn sails slow the ship, down to 30% of its top speed with none left, and make it turn badly, down to 45%.
- **Crystals**: cracked crystals climb badly, down to 25%, and can't lift as high. Below half, the ship starts to sink, faster as they go. At zero, the ship sinks out of the fight, and a few seconds later drops away below the clouds.

## The raiders

The raiders fly the same four classes as the Captain, by the same rules. They're easy to tell apart: **rust-red sails, darker planks and crimson pennants with a black hoist**. Each has a tag over it with its class, its distance and its three health bars; off screen, the tag waits at the edge with an arrow pointing to it.

- **Skiffs and Cutters make attack runs.** They come at you bow-first, firing their bow guns, then after 10 to 15 seconds, or when they get close, peel away side-on and come round again. That's when they're open to your broadside.
- **Brigs, Frigates and the Man-o'-war fight broadside.** They come alongside a few hundred metres off, on whichever side you're on, and fire whole sides. **Her gun ports glow red just before a broadside**, so you can see it coming.
- **The Galleon runs** (see Treasure ships, above).
- On Crosswinds they're a little weaker than the Captain: they sail at 92% of their class's top speed, reload half as slowly again, aim a little off (up to 2 m for every 100 m to you), and hold their fire until you're within about two-thirds of their reach. Before each broadside their gun ports glow for half a second (see [How a fight feels](#how-a-fight-feels)); that time comes out of their next reload, so they fire as often as they would without it.
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

**How hard it is.** `node tools/sim-fight.mjs skiff 5 cross` sends out a simulated Captain. It simply points at the nearest raider and fires, keeps a raider abeam in a ship with broadsides, and waits for repairs between waves. It never climbs out of a broadside, never surges and never dodges, and pays no heed to a raider's gun ports glowing. On Crosswinds it (measured again on October 6, after the wrecks, debris and slow motion came in, about a dozen runs of each):

- usually gets the Skiff through four waves (about one time in three only three), with about ◆ 400 in the hold (enough for the Cutter), and then the wave-5 captain sinks it
- usually gets the Brig through seven waves, and about one time in three all eight
- gets the Frigate through seven waves on Maelstrom most times, sometimes six (once in a while fewer)
- beats the treasure ship's wave (wave 6) in a Cutter, catching her in two to three minutes (now and then she gets away); in a Brig it sinks her escort first, then shoots her sails away until she strikes her colours, all in under a minute
- in a Frigate, beats wave 12's Man-o'-war about half the time: it fights her side to side, where she's strongest

On Fair Winds it always gets the Skiff through four waves, and gets past the wave-5 captain about one time in three. A real Captain who uses height, the Surge and the wind does better.

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
- `src/game/events.js`: the game's news (a gun firing, a hit, a raider down, a wave starting, a ship bought...), told in one place for the effects, and later the sound and music, to answer; the list of every event is at its top
- `src/game/fx.js`: the effects: sparks, flashes and glows, the gunsmoke and debris from hits, the view's kick and shake, buzzing a phone, and a dial to slow the game's clock for a moment (slow motion)
- `src/game/effects.js`: the smoke (gunsmoke, and smoke and fire from damaged ships) and the debris (splinters, canvas and crystal shards)
- `src/game/wrecks.js`: a raider going down: the chain of blasts, her crystals and sails, falling masts, the smoke column, the hole in the cloud deck
- `src/game/surge.js`: how a Surge looks: the wind streaks, the crystals flaring, the vapour trails
- `src/game/guns.js`: where each gun sits, which battery faces where, aiming ahead of a moving ship, gun weights, the rippling volleys, and the bolts
- `src/game/input.js`: the keyboard, mouse and touch controls
- `demos/game.html`: the title screen, port and HUD (with the bounties that rise from wrecks), and the help
- `tools/map-art.mjs`: packs the nine map tiles into `assets/map/` (run it if the tiles change)
- `tools/sim-fight.mjs`: the simulated Captain, for tuning the raiders

`npm run check` (or `node tools/check.mjs`) plays the game in a hidden browser:

- It runs the save as two devices sharing one store, and checks the newest progress always wins: a tab left open, a tap before the store answers, play with no connection, and a phone whose clock is slow. It checks no voyage's shards are lost: a save that fails once or twice, a tab that stopped hearing the store (and one that hears it again), both devices banking a voyage at the same moment, and a voyage played with no connection. And a new browser isn't told its progress came from another device.
- It opens on the title screen, drags the ship round, goes to port, and checks a ship can't be bought without the shards. With shards, it buys the Cutter and armour, sets the crystal power, and checks the stats change. It changes the window's size in port and checks the corner map is still drawn at sea, and the big map at its own size.
- It flies each ship and fires every battery at a raider of the same class 260 m off, checking the guns lock on and hit.
- It shoots a raider down, watches it fall away spilling shards, and flies through shards to gather them (the shard count pops). It brings a raider down low, under the clouds, and checks she falls before she goes. It checks the sun's shadows reach the ship.
- It checks raiders far off use the far model, sends a Cutter at a Captain who does nothing and checks it does harm, and checks a captain leads wave 5, a treasure ship comes in wave 6 and a Man-o'-war in waves 12 and 15. It shoots a treasure ship's sails until she strikes her colours, and lets another run until she gets away.
- It goes back to port from the card after wave 4 (checking the next wave's captain was made ready), buys the Cutter it had been looking at, and sets sail: wave 1 must be one Skiff, and only the Cutter is in the sky.
- It plays a whole voyage from the port: beats wave 1 (one Skiff), sails on, sinks, and checks half the shards come home. It checks the save survives a reload.
- It tries the keys, the mouse, the wheel (a trackpad's flick and a mouse's notch) and the touch controls (on a phone: aiming, a thumb resting still, a drag while paused, and sliding off Fire to aim while firing). It drops the drawing context and checks the sky's light and the cloud pattern come back. It saves pictures of the title, the port and a battle into `shots/`.
- How a fight feels: it checks every kind of news in `events.js` is told somewhere as it plays. It fires a Frigate's broadside into empty sky: one shot at once, all ten within 0.7 s, bow first, a puff of gunsmoke from each port, tails over 20 m long, the ship heeling to starboard, and the view kicking back more than half a metre and settling within a second (and to at most a third of that with reduced motion). It checks every battery's hits are marked on the crosshair in the part's colour, a kill rings red, and shots on a raider's crystals are marked in the crystals' colour. A raider's shot into the hull shakes the view, and one that takes the hull below 30% is told; a shot passing 10 m off is one near miss and does no harm. A raider Frigate's ports glow at least 0.45 s before her first shot, and when it lands the red arc points at her (and the hit knows it was her). A raider brought down in the middle of her broadside fires no more guns, and a Man-o'-war firing all four batteries at once still ripples them, a few guns at a time. In a busy fight (a Frigate against three raiders for 15 seconds, two of them blown apart along the way) the sparks and smoke never run out of room and a step of the game stays under a thousandth of a second; a raider's blast throws at least 90 sparks. Going back to port from the pause menu ends the pause properly. On a phone it checks the smaller budgets, that a hit and a kill buzz the phone, and that a treasure ship giving up doesn't.
- Wrecks and the rest: a shot in a raider's hull throws splinters, in a treasure ship's sails scraps of canvas, in the crystals glittering shards, and a 60-shot barrage (a big broadside's worth in one second) fits the debris's batches with not one piece cut short, and has all fallen away 4 seconds later. A raider Brig blown apart goes up in at least three blasts within 3 seconds, her crystals are dark by 2 seconds, and she falls through the cloud deck before she's gone; her bounty shows the shards she spilled and is gone 3 seconds later. A treasure ship striking her colours doesn't blow up, and her pennants come down; then, from 906 m, she sinks through the cloud deck within 16 seconds, before she's gone, and a raider whose crystals die at 740 m does within 14. A hole torn in the clouds just before going back to port is closed on the next voyage. The shard count counts up as shards come in. On a laptop, a raider Frigate blown apart topples her three masts with all her canvas, and each one goes only once it's under the cloud deck. In the whole voyage, bringing down wave 1's raider slows the world once, and the card is shown at once but held back 1.4 seconds (still out of sight a moment later), then rises into view, and Sail on is pressed once it's there. A Surge shows its streaks and widens the view over 9 degrees, trails vapour and flares the crystals, and 4 seconds later it's all back; at 20 frames a second its view widens just as it does at 60 (with less motion too, by up to 12 degrees with no overshoot). On a phone, the worst case (a Man-o'-war blown apart beside two other wrecks, in a fight) never runs out of sparks or smoke, cuts short at most one piece of debris in twenty, drops no masts, and a step stays under a thousandth of a second.

`node tools/check.mjs --quick` plays only the game page at laptop size, for checking during work; it ends with "all good (quick)". The full check is the one that counts.
