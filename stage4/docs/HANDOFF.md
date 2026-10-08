# Hand-off: the polished phone version of Skies of Aethermoor

> **This copy is `stage4/` (October 8).** It's the `polished/` folder as stage 3 left it (commit `3570f8b`), copied so
> stage 4 is built in a folder of its own. Wherever this note says `polished/`, read `stage4/`: work only inside
> `stage4/`, and leave `polished/` (and everything else outside `stage4/`) unchanged. It keeps its own `node_modules`
> (`npm install` in `stage4/`). Git: branch `claude/jolly-ramanujan-xqqm3h`, started from `claude/laughing-curie-qbp98i`.
> Its own links are given in "Stage 4" below once published; `polished/`'s links stay with `polished/`.

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
2. **D2a-fights-tactics**: shot types, dodging broadsides (the red danger fan), raking fire, the crew patching her.
3. **D2b-fights-foes**: raiders with nerve, named captains, wave arrivals, the Man-o'-war's fortress battle, a line of
   battle, choosing the road between waves.
4. **D3-progression**: save version 2, a gentle first voyage, the homecoming summary, commendations and a Captain's
   log, ranks, records and stars, the quartermaster's advice, sail and pennant colours, harbour orders.

Run them in that order (each builds on the last), with the gate's `shots` asking for each new feature at laptop,
upright-phone and sideways-phone sizes.

**First steps in a new session:** `npm install` in the repository's main folder; `cd polished && node tools/build.mjs &&
node tools/check.mjs` and see it end "all good" (about 12 minutes since D0; it was 25); read `docs/plan/chris-decisions.md` and the five
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
  about 12 minutes in software rendering since D0 (it was 25; `--quick` about 6, `--ships` under 3). In software a
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
