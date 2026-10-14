# Hand-off: the polished phone version of Skies of Aethermoor

> **This copy is `stage4/` (October 8).** It's the `polished/` folder as stage 3 left it (commit `3570f8b`), copied so
> stage 4 is built in a folder of its own. Wherever this note says `polished/`, read `stage4/`: work only inside
> `stage4/`, and leave `polished/` (and everything else outside `stage4/`) unchanged. It keeps its own `node_modules`
> (`npm install` in `stage4/`). Git: branch `claude/jolly-ramanujan-xqqm3h`, started from `claude/laughing-curie-qbp98i`.
> Its own links (private to Chris): **play it** https://claude.ai/artifact/6egmobrK5JJHWEFKWohyvz (published from
> `stage4/dist/game.artifact.html` with `capabilities: {db: {}, user: {}}`; leave `capabilities` out on later publishes)
> and **the ships up close** https://claude.ai/artifact/PjsAJrsX7TngKRUuKoZhFC (from `stage4/dist/hangar.artifact.html`).
> Never publish `stage4/` to `polished/`'s links or the original game's. Stage 4 runs in four parts, each published
> when its gate passes: 4a (D0, D1: done October 9), 4b (D2-touchups, D2a: done October 12), 4c (D2b-touchups,
> D2b: done October 13), 4d (D3-touchups, D3: done October 14). It paused after 4c (October 13); 4d was then built on
> branch `claude/laughing-fermat-ow3rfs`, carried on from this branch's head, and published October 14. **Stage 4 is
> done**: what its last gate left open is `docs/plan/specs/E0-touchups.md`, for whenever Chris wants more. The stage script is
> `docs/plan/build-stage.js` (its args now include `branch` and `trailer`; builders push every commit at once).

For a fresh session picking this up. Read this first, then `docs/plan/chris-decisions.md`, `README.md` and
`docs/game.md` (all in `polished/`).

## What this is

- `polished/` is **Chris's phone version** of the airship game: the advanced edition that must run smoothly on a
  smartphone, with features that are rich and beautiful rather than many. It's a separate copy of the game made on
  October 6 from this repository's main folders (commit `1887984`). **The main folders hold the original game, which
  other sessions build from: never change anything outside `polished/`.**
- **A laptop-only version is being built in another repository** (`chriskizer91-ops/20-min`, folder
  `skies-of-aethermoor/`), with far more detailed ships (moving parts, more triangles) and more features. **Never take
  anything from it, and don't read it, without asking Chris first.** The only things taken from `20-min` are the two
  music files Chris allowed (`src/audio/thareia/`, unchanged; see its `NOTE.md`).
- **Play it:** https://claude.ai/artifact/DiEHwDuesigg1SnndL1wK1 (private to Chris). It's published from
  `polished/dist/game.artifact.html` with `capabilities: {db: {}, user: {}}` (each player's save lives in
  `data/users/<id>/save`); on later publishes pass the `url` and leave `capabilities` out to keep them.
  **The ships up close** (this version's ships demo): https://claude.ai/artifact/MN2H1safLemWbgH5e5KJGd, published from
  `polished/dist/hangar.artifact.html` (no capabilities).
  **Never publish this version to the original game's links** (`8uZvk4JeowYMt7n5xBvoa7` and `4uQ6NogD2FyGGijwq1ew4K`).
- Git: the work so far is on branch `claude/laughing-curie-qbp98i`. A new session gets its own designated branch from
  its instructions: start it from this branch's head so the history carries on.

## Where it stands (October 7)

Three stages are built, each package reviewed and fixed, each stage passing the full check ("all good") and
published to Chris's link:

- **Stage 1 (October 6): fixes and how a fight feels.** 17 verified bug fixes (the worst: the next voyage starting on
  the wrong wave). The event bus. Rippling broadsides with flame and gunsmoke, comet-like shots, recoil and shake, hit
  marks, a red arc showing where a hit came from, raiders' gun ports glowing before a broadside. Debris that matches the
  hit, wrecks going down in a spectacle, bounties rising from the wreck, slow motion for a wave's last raider, a Surge
  that feels fast.
- **Stage 2 (October 6 and 7): sound, clear type, the title.** Touch-ups (thick gunsmoke, rolling wreck smoke, a red
  "Broadside!" on off-screen raiders' tags, an easier Fair Winds). Sound and music (Chris's music and effects, new
  cannon and hit sounds). Cinzel and Fira Sans; a tidy screen on a laptop and a phone held either way; plain words; a
  Settings card. A title screen flying over Aethermoor at sunset, and one tap from the title to the sea.
- **Stage 3 (October 7): living ships and the sky.** Touch-ups (title raiders that show their sails, a new Captain on
  Fair Winds, a lighter title). Ships that show their scars (holes, scorch, cracking crystals, fire, patches between
  waves; New/Battered/Wrecked in the ships demo). Ships that move (wings fold with the sail, gun lids and guns run out
  and kick, glowing wakes, a menacing raider captain, a treasure look any ship can wear, the Man-o'-war's crystal
  columns as weak points). Storms with rain and lightning, clouds you fly through and hide in (raiders aim worse), the
  horizon clouds, your ship's shadow with a rainbow ring on the cloud floor, each region's own air.

Still to do: **stage 4** (below), then whatever Chris asks next. Boarding still waits (Chris: fill out the
ship-to-ship fighting first).

**Open points from stage 3's gate** are written up as the first package of stage 4, `docs/plan/specs/D0-touchups.md`:
raider glows not scaling with the screen, a storm front that looks like a flat mountain, stacked tags hiding their own
raider, scars and fire too faint at fight distance, faint far-off wakes, the sideways ships demo, and a full check that
now takes about 25 minutes. (`docs/ships.md` used to say the Galleon and the Man-o'-war are only ever raiders: D1 made
them the Captain's ships too, and updated it.)

## Chris's decisions

All in `docs/plan/chris-decisions.md`; they override anything older (some of `docs/` used to say the Galleon and the
Man-o'-war are only ever raiders: that changed). In short:

- Ships stay near 100,000 triangles at full detail, so the Captain's big ship and a fleet of raiders fit on a phone.
- The music is Chris's, shared with the laptop version (`src/audio/thareia/music.js` on the instruments in
  `sounds.js`); his effects are used where they fit, with new cannon and hit sounds made here. Never edit those two files.
- Clear type: Cinzel for titles, banners and ship names; Fira Sans for the rest.
- The title screen flies your ship over Aethermoor at sunset; the port keeps its garage look.
- Storms and clouds you can fly through and hide in: yes. Day turning to night: **no**.
- Shot types (round, chain, crystal breakers): yes, bought in port, cycled in flight.
- **The Galleon and the Man-o'-war become the Captain's late-game ships**; raiders sail them only once the Captain owns
  one; before that, the treasure ship is a **treasure Brig**.

## What's left: stage 4

Five packages, each with a spec in `docs/plan/specs/` (the specs point to the design surveys in `docs/plan/surveys/`,
which were made from this repository only):

0. **D0-touchups**: stage 3's open points (see "Where it stands"). Built October 8 (`docs/game.md`, "Touch-ups",
   October 8). The raider glows already followed the screen's scale every frame (the gate misread the code); they now
   take it as each class is built and as the window changes too, so even a raider's first frame is right. The full
   check's slowest part was the ships demo drawing a second-long frame the whole time: its frames are now held while
   it's checked (`__hangar.hold/step/draw`), and `node tools/check.mjs --ships` checks it alone. Fixed after review:
   the storm wall's billows are measured round from the storm's own direction (no seam due north), lumpy with two
   finer layers, sized to the view (`billowsFor`), and drop out one by one at the storm's edges; a raider lost in
   cloud fades her wake and her fires' glow (`wakes.js` veil); far wakes stop shimmering into beads; tags over ships
   are placed by `placeOver` in `main.js` (stacked over every ship of a crowd, kept off the top panels, moved aside or
   under her ship where there's no room, gliding there, and staying while clear); the ships demo frames her with the
   triangle-count line already filled (it's in the button dock) and keeps each shown set's fit sample.
1. **D1-fleet**: the Galleon and the Man-o'-war as the Captain's late-game ships; giant raiders only once owned; the
   treasure Brig; the wave table reworked; balance. Built October 8 (`docs/game.md`, "The Galleon and the Man-o'-war"
   and "The waves"; `docs/ships.md`). The port sells them after the Frigate (◆ 12,000 and ◆ 30,000; upgrade steps 7 and
   10 times the Skiff's), its six ships in two rows of three on a phone. The Captain's big two are better found than a
   raider's (`HELM` in `src/game/mods.js`: quicker helm, heavier plating, no heavy-gun reload), and the view stands
   further back from them. `waveAt(n, extra, storms, giants)` gives each giant a stand-in until it's owned (a treasure
   Brig; a raider captain's Frigate), and every treasure ship's hold is worth a Galleon's ◆ 300.
   `tools/sim-fight.mjs` takes `--owns`, `--mods`, `--power` and `--runs`. Fixed after review: the port sells the
   Man-o'-war only once the Galleon is owned (`NEEDS` in `progress.js`); a wave drawn at random brings at most one
   treasure ship, and only the Man-o'-war grows common once owned (`COMMON` in `raiders.js`); the Buy button keeps to
   one line on a phone; an owned ship's five bars show above Set sail held upright, and a ship you look at to buy stays
   above the panel; the firepower words tell the big two apart; a giant's line under Buy and a note as she's bought;
   edge tags kept on the screen by their own widths, and tags under a wave's banner fade while it shows.
   **Stage 4a's gate** (October 8): tags at the edge no longer land on each other (on a phone held sideways, three
   raiders behind you used to put theirs in one place; `edgeSlide` in `main.js`), the port's note keeps beside its
   panel on a phone held sideways, `tools/sim-fight.mjs` says whether each treasure ship was caught or got away, and
   "How hard it is" was measured again (many runs of each).
1b. **D2-touchups**: stage 4a's gate's open points (HUD text over your own ship on a phone, the smallest phone's
   banner, a new Galleon that's no step up yet, the frame-time tests on a busy machine) and a sea trial in port. Built
   October 9 (`docs/game.md`, "Touch-ups and a sea trial", "A sea trial", "The screen" and "How hard it is"). Raiders'
   tags and the warning keep off the Captain's own ship (`ownBox`, `placeWarn` and the OFF list in `main.js`: her box in
   four slabs from stern to bow; edge tags try just beside her first, rising at most two and a half tags). Narrow phones
   held sideways have the compass on one line and a smaller banner; the smallest (568 by 320) has it under the pause
   button. The big two's helm (`HELM` in `src/game/mods.js`) was tuned with many runs of `tools/sim-fight.mjs` so a new
   Galleon beats a Frigate with every upgrade (see "How hard it is"). The two frame-time comparisons in the check are
   timed in turns (`TURNS` in `tools/check.mjs`) and go by the middle turn. "Try her out" in port (`TRIAL` in
   `main.js`) takes a ship not owned out for one fight, changing nothing in the save. Fixed after review (October 12):
   the warning goes to the nearest clear place (`WARN_STAY` keeps it from hopping), may lie over a toast, and keeps its
   own place only while a banner takes the only room; edge tags keep off the crosshair (`CROSS`, last in OFF, dropped
   first when a screen is crowded), a tag with no room beside her goes to the nearest place (`edgeNear`), tags over
   ships keep off edge tags' arrows and look anywhere (`overAnywhere`) before landing on the warning; a trial's wave is
   made ready as she sails, fought in Crosswinds at the hardest, and says "Sea trial" in the score.
2. **D2a-fights-tactics**: shot types, dodging broadsides (the red danger fan), raking fire, the crew patching her.
   Built October 9 to 12 (`docs/game.md`, "Tactics" and "How hard it is"). The rules live in `src/game/tactics.js` (`SHOTS`,
   `RAKE`, `PATCH`, `SMART`). Shot: `gunnery.shot`/`setShot` (guns.js; changing reloads every battery; breakers counted
   in `gunnery.breakers`), bolts carry `shot`, `hitTest` in main.js multiplies by the part's share and by `rakeMul`
   (broadsides only, both ways); keys 1/2/3 (by `e.code` in input.js, so they work with Shift held to dive), V or a
   right-click (`shot`, `cycleShot` in main.js), `#btn-shot` over Surge on a phone (shown once she has more than round
   shot: body class `has-shot`, which moves the guns' label up and, held sideways, shrinks Surge and the button's
   picture and name; the breakers left are a badge, `.left`; `shotButton` in tools/check.mjs keeps the name inside the
   ring at every phone size); chain shot's two heads spin round its path (`SPIN` in guns.js);
   `progress.data.shots` (earned by deeds in `waves()`, or bought in port's Shot rows). The warning: raiders.js readies
   a broadside for the skies' `warn` (progress.js), aims it then at where the Captain will be if she holds her course
   (`r.aimed`, `r.held`), tells `warn`, shows a fan per side (guns.js `fanGeometry`, a banded shader in raiders.js), and
   the tag says "Broadside!" with a ring on screen too; `RAIDER.broadside` (0.8) keeps a plain Captain's fights as hard
   as before. Patching: flight.js `startPatch` (X, `#btn-patch` by the sail buttons), guns reload at `PATCH.rate`.
   Smarter raiders: skies' `smart` (Crosswinds 1: big raiders cross your bow; the Maelstrom 2: also small ones at your
   stern, and dodging a loaded broadside: chasers at the stern on Crosswinds made it much harder, so they're the
   Maelstrom's). In the simulated fights raiders seldom manage a rake (a plain Captain keeps them abeam, and the
   crossing is easy to spoil): named captains (D2b) could make more of it. `tools/sim-fight.mjs` gained `--dodge`,
   `--react`, `--shot`, `--patch`, `--policy cross`, `--skilled`, and `--smart`/`--warn` for tuning, and reports
   broadside and light-gun damage a minute and raking hits. Polished after review (October 12): a shot earned by the
   deed that ends a wave goes in `W.news`, said in the card's title and then in its banner at `sailOn()` (`tellNews`);
   a banner still up as the card rises is cut to its fade; the fan is a rounded cone (guns.js `fanGeometry`), so its
   bands are rings from inside, and its shader is made ready (never drawn) as each voyage starts: `renderer.compile` of a
   fan with a fresh material copy (raiders.js `fanToWarm`, called in main.js `sail()`: three.js keys a new material's
   shader by the lights in the sky, the ship's lamps among them); the Maelstrom's dodge answers broadsides only; `edgeBottom`
   keeps a "Broadside!" edge tag above 70% of the height on the stick's side on touch screens; sound.js `warn` calls
   from her side; Patch shows through the whole wait (`PT.cd > 0`); between waves on phones the crosshair hides (and,
   held sideways, the toast sits lower and the warning hides) so a long card fits; the sideways rules for the guns'
   label are written as strongly as the upright ones (a 640 by 360 phone matches both); `layoutAt` takes `{ shot,
   hurt, left }` and the phone passes cover a new Captain, Fire on the left and both buttons.
   **Stage 4b's gate** (October 12, for D2-touchups and D2a): the full check passed as committed (30 minutes with
   balance runs alongside), so there were no code fixes. The balance runs were measured again (12 to 36 voyages of each)
   and "How hard it is" updated: a skilled Captain's Brig takes about four fifths less broadside damage (first measured
   as nine tenths), a plain Captain's Frigate on the Maelstrom beats all eight waves 4 times in 36, and the big two's late
   waves are a little harder than first measured (the Man-o'-war beats waves 16 to 20 five times in six, 21 to 25 four
   times in five). The check's time in the docs is now about 20 minutes. Looked at in the gate's screenshots and worth a
   touch-up: seen from behind with a raider level alongside, her red fan is nearly edge-on and reads as a pink haze over
   the horizon (her "Broadside!" tag and ring are what tell you; from above or ahead the fan's rings read well); chain
   shot in flight at a fight's range shows as small violet sparks, its two heads too small to see; and the edge tags'
   arrows are small, nearly even triangles, so which way one points is hard to read at a glance.
3. **D2b-fights-foes**: raiders with nerve, named captains, wave arrivals, the Man-o'-war's fortress battle, a line of
   battle, choosing the road between waves. Built October 13 (`docs/game.md`, "Foes worth remembering"). The rules live
   in `src/game/tactics.js` (`NERVE`, `CAPTAINS` with `TRICK`, `WANTED`, `PLATE`, `FORT`, `LINE`, `ROADS`/`ROAD`); the
   minds in raiders.js. Nerve: flight.js `s.strikes` is a rule each raider is given at `spawn` (a prize's, or a crew's),
   so a hit that beats her makes her `down` with why `struck` (wrecks.js runs up a white flag, `flagToWarm` made ready
   as a voyage starts); `startRun` (to thick cloud floor found with `sky.floorAt`, set in main.js), `fireFlare`/`answer`
   (help joins from `later` after the update loop). Captains: `waveAt` returns `captain`/`standIn` and `how`; main.js
   names them (`captainFor`: a wanted one first, then `CAPTAIN_ORDER`, never one met this voyage; `W.met`), and the save
   keeps `captains: {id: {beaten, sank}}` (progress.js merges such maps whole; no import there, as the save check runs
   it in a vm). Tricks: `trick()` takes her steering (`TK`); the Ghost's smoke sets `r.smoke`, which sky.js makes
   `hidden`; the Sail-Ripper's chain shot goes through `ch.shot`. Arrivals: `HOW` for the first fifteen waves, `LATE`
   after, `WAY` for a captain's own; `spawnWave` places them and returns `{a, how}` for the banner's words (`arrival()`
   in main.js). The fortress: `makeFort` splits a raider Man-o'-war's broadside guns into eight blocks (`ySplit`,
   `zSplit`), `blockHit` silences one (guns.js `silence`, which every battery's count and volley respect), main.js
   `hitTest` plates her sides (`plateMul`) and doubles her stern windows; acts 2 and 3 in `update` (her upper deck's
   guns get `g.up`, a higher reach). A line: `formLine`/`breakLine`, followers keep station on a static slot, fire in
   turn by `firedAt` (or after `LINE.hold`). Roads: `roadFor(next)` in main.js picks one of storm/treasure/hunt
   (`roadWave` builds it), shown as `#btn-road` (keys 1 and 2 only while it's up; `body.roads` makes room on phones),
   `sailOn(pick)` tells `road`. `tools/sim-fight.mjs` gained `--policy fortress` and `--road`, chases runners, and
   reports nerve. The Sun-Diver first climbed straight up over the Captain after each broadside: out of reach and still
   the nearest raider, she held off a plain Captain's Man-o'-war at wave 20 (beaten 4 times in 16); flying off towards
   the sun instead, she's out of the fight a while and comes back diving (beaten 16 times in 16). Polished after review
   (October 13): a line's ship that runs (`startRun`), is gone, or is a Man-o'-war in her last act is out of it
   (`outOfLine`, `leaveLine`: its leader breaks it up, `breakLine(L, why)`, said once by main.js from `line.why`); the
   Man-o'-war's last act is driven by `FORT.sink` and capped at `FORT.last` (her climb set each frame in `fortress`),
   and a fan made in it is tall too (`FAN_TALL`); the Ghost lays smoke as she goes (`trail`, `TRICK.smoke.trail`) and
   circles the Captain beam to beam (`tk.a0`, `tk.dir`); flares are a red star in their own batch (`stars`, normally
   blended so they read red over the sky), bursting `NERVE.rise × burst` over her and hanging `NERVE.hang` over her
   mast while help comes; raiders from below start 1.3 to 1.6 km off and hold under the floor till `BELOW.rise` (the
   first to burst through is told, `burst.first`, and toasted); the white flag faces the camera (wrecks.js `update(dt,
   camera)`). Banners: `waveBanner` keeps the line to `BANNER_LINE` (hints over it, and the Man-o'-war's, come as a
   toast after, `W.hint`); check.mjs `longestBanner` sweeps every wave's line and layoutAt tries the longest. Roads:
   `roadFor` offers the allowed kind offered longest ago (`W.offered`, first in `ROAD_ORDER`), the treasure road keeps
   the steady raiders and adds the treasure ship, a hunted captain sails at least her own wave's class; 1 and 2 take a
   road only once the card has risen (`cardRisen`), and the mouse stays locked; held sideways the road button goes
   under Sail on (game.html), and the toast keeps over a tall card on a phone held upright (`--calm-top`).
3b. **D3-touchups**: stage 4c's gate's open points. Built October 13 (`docs/game.md`, "Touch-ups" of October 13 and
   "How hard it is"). Lost in cloud only while the cloud as drawn hides her: world.js `veil` (the big clouds' pictures in
   front of a point, as the camera sees them, the cloud floor and the haze) and sky.js `shows` (five spots on her, the
   camera's own view on screen, a view straight at her off it; `HIDE.shows` [0.3, 0.4] with a little hysteresis); checked
   by painting her white then black (`CLOUD_LOST`). The sim: a fresh page and seeded dice per voyage (`--seed`, `--jobs`,
   `--page`), brought-home shards, where each wave was fought, `--height`, `--set`. The roads' gap was the simulated
   Captain's height carried over to wave 8's storm; the storm road now brings the same raiders (`ROADS.storm.more`) and
   the hunt half as much again on her head (`ROADS.hunt.bounty` 1.5). The view past her own ship: main.js `pivot` (from
   `footprint`, a height grid of her model; only past the resting pitch). Breakers aim at the middle of what shows of her
   crystals over her rail (raiders.js `breakAt`); the white flag's dark hem (wrecks.js `FLAG_U`); the sea's softer glints
   (world.js GLITTER); the burst's toast arrow and gold pulse on her tag (main.js `BURST_GLOW`, game.html `.tag.burst`).
4. **D3-progression**: save version 2, a gentle first voyage, the homecoming summary, commendations and a Captain's
   log, ranks, records and stars, the quartermaster's advice, sail and pennant colours, harbour orders. Built October 13
   (`docs/game.md`, "The Captain's record"). The save's version 2 (progress.js: `MEDAL_IDS`, `TIP_IDS`, `SAIL_DYES`,
   `PENNANT_DYES`, `LANDS`, `STAR_PAY`, `RANK_AT`, still import-free; `merge` keeps lists only of the right length and
   real numbers, `sanitize` the log's last 12 and known colours, `migrate` an old save's stars as back pay once and a
   renown floor, `mark` keeps a small change on the device only). `deeds.js` counts the voyage from the news (a `hit`
   now says its gun's `kind`), pays commendations, stars, orders and a rank's purse (the `deed` event: a toast in turn at
   sea, `said`, the port's note in port, `noteLater`), and returns the voyage's summary (`finish`, before `bank`); orders
   start after a first voyage and are picked by the date (`pickOrders`). `coach.js` gives the tips from what main.js
   `see`s ten times a second (in the dock on a laptop, in the hint's place on a phone; `settings.tips`; `makeWay` when
   main.js `tags` finds no room for every edge tag, as on the smallest phone with nine readying broadsides); a brand-new
   Captain's first wave is `gentle` (raiders.js `GENTLE`: ahead, closer, `r.hold` until `player.firedOnce`).
   `record.js` is coming home's card (shown only by the game's own ways home: `endVoyage(keep, true)`, `__game.home`)
   and the log. `paint.js` dyes her own sails and pennants (`applyPaint` in `shipFor`, port previews reverted on leaving);
   port.js has the Colours tab, the quartermaster's `advice()` and the Log button. The checks switch the tips off for the
   older checks (`tipsOff`) and test them on their own and in every layout; `tools/sim-fight.mjs` sails a Captain with a
   voyage behind her (no gentle first raider).
   **Stage 4d's gate** (October 14, for D3-touchups and D3): the full check passed (30 minutes on its own), with three
   small fixes (the coming-home card's Maelstrom line counts everything she keeps; the log shows only the best wave for
   skies sailed before records were kept; a toast's grammar). The balance runs were measured again, in fresh pages with
   their own dice, and "How hard it is" gained "Measured again at stage 4d's gate": the one real shift is the Galleon's
   waves 21 to 25 (11 in 24, against 8 in 12 at 4c's gate), harder because the simulated Captain now steers for shards
   among the raiders (12 in 12 without). The gate's other open points are `docs/plan/specs/E0-touchups.md`.

Run them in that order (each builds on the last), with the gate's `shots` asking for each new feature at laptop,
upright-phone and sideways-phone sizes.

**First steps in a new session:** `npm install` in the repository's main folder; `cd polished && node tools/build.mjs &&
node tools/check.mjs` and see it end "all good" (about 15 minutes after D0, about 20 since D2a's checks, about 25 since D2b's, more while another agent is busy; it was 25 before D0); read `docs/plan/chris-decisions.md` and the five
specs; ask Chris whether anything has changed since October 7; then run stage 4.

## How the work has been run

- **A survey first** (October 6): a playtest with screenshots, a bug hunt checked by skeptics, and design surveys
  (combat feel, sound, ships, gameplay, world, progression). Their results are in `docs/plan/surveys/`.
- **Then stages of packages**, run by `docs/plan/build-stage.js`, a Workflow script (pass it as `scriptPath`):
  - each package is built by one agent that commits only after the full check ends "all good";
  - a read-only reviewer checks that commit (extracted into scratch space) while the next package is built;
  - a fixer then applies the reviewer's real findings;
  - a gate at the end runs the full check and the balance runs, takes screenshots at laptop, upright-phone and
    sideways-phone sizes, and says plainly what looks wrong.
  - Its args: `{stage, scratch, specs, packages: [{key, title}], shots}`. `specs` is the folder of `<key>.md` specs;
    `scratch` a scratch-space folder for the agents. `specs` can point straight at `polished/docs/plan/specs` (the
    specs find the surveys at `../surveys/` and Chris's decisions at `../chris-decisions.md`). But the builders commit
    everything under `polished/`, so if `scratch` is inside `polished/` it gets committed: keep `scratch` in the
    session's own scratch space. **Before running it in a new session, update the script's `TRAILER` line** (it holds
    this session's commit trailer) with the new session's lines.
- After each stage: look at the gate's screenshots, publish to Chris's link, tell him in plain words, then write the
  next stage's touch-up spec from the gate's concerns.

## Things learned the hard way

- **This machine has 4 CPUs**: a workflow runs 2 agents at a time, and the full check (`node tools/check.mjs`) takes
  about 25 minutes in software rendering since D2b (20 after D2a, 15 after D0, 25 before it; with another agent busy it can take 25 or more, and a
  starved run can trip the check's frame-time comparisons: run it again on its own; `--quick` about 12 since D2b, `--ships` under 3). In software a
  frame takes a second or more, so a check that waits on frames it doesn't look at wastes minutes: hold or skip them
  (the ships demo's `hold`, `undrawn` in the check). A stage of four packages took 6 to 15 hours
  (stage 3 took about 15).
- **The container can restart** and stop a running workflow. The files survive. In the same session, resume with
  `resumeFromRunId` (finished agents replay from cache); in a new session, run the stage again with only the packages
  not yet committed (check `git log`).
- **Builders sweep everything under `polished/` into their commits**: don't write into `polished/` while a stage is
  running. The stop hook complains about uncommitted changes while a builder works: leave its files alone; it commits
  when its check passes.
- **Never weaken or skip a check** to get "all good"; fix the cause.
- **One simulated fight is too random**: run `tools/sim-fight.mjs` many times before changing "How hard it is".
- Agents must stay inside this repository (the other repos the session can see are read-only references, per the
  main `CLAUDE.md`), and must never read the laptop version.

## The code, briefly

Beyond the original game's modules (see `docs/game.md`, "The code"), this version added:

- `src/game/events.js`: the event bus everything listens to (its header lists every event)
- `src/game/fx.js`, `wrecks.js`, `surge.js`: effects, wrecks, the Surge, with pooled particles and budgets lower on
  phones
- `src/game/sound.js` and `src/audio/` (`audio.js`, `mixer.js`, `voices.js`): the sound; `src/audio/thareia/`: Chris's
  two music files, unchanged
- `src/game/settings.js`: per-device settings; `title.js`: the title scene; `looks.js`, `src/ship/dress.js`,
  `flames.js`: ships' scars and looks
- `src/ship/livery.js`: raider, captain and treasure colours; `src/game/wakes.js`: the wakes and vapour trails
- `src/game/sky.js`: the sky director (storms, region air, cloud hiding); `weather.js`: rain, lightning, mist, scud

`docs/game.md` describes everything in plain words, and the header comment of `tools/check.mjs` lists what the check
covers in detail. `docs/plan/` holds the plan: `chris-decisions.md`, every package's spec (done and to do), the design
surveys, and the stage script.
