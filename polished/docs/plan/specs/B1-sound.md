# Package B1: sound and music

Sources: the sound survey `../surveys/survey2-sound.json` (engine, mix, voice limits, 3D placement, recipes, events,
checks; its prototype lived in `../../survey/sound/` and was deleted, so work from the JSON) and Chris's decisions
`../chris-decisions.md`. The game is silent today. Packages A1-A2b built `src/game/events.js` (the event bus, with the
events listed at its top) and `src/game/fx.js`; the sound listens to the bus and adds emits only where one is missing.

## What Chris decided (these override the survey where they differ)
- **Music is Chris's, shared with the laptop version: `src/audio/thareia/music.js`, played on the instruments in
  `src/audio/thareia/sounds.js`. Never edit those two files.** Don't build the survey's generative score.
  Which piece plays when (from the pieces' own descriptions in music.js):
  - title screen: 'title' (Thareia, the main theme); the port: 'town' (Market Day)
  - calm flight between waves: 'flight' (Sunstone Wind); over the Gloomfen 'marsh', over the Sunscorch Wastes 'desert'
    (regionAt in world.js), but only between waves
  - a wave of raiders: 'battle' (Break the Grip); a raider captain's wave, a Man-o'-war, or the Captain's ship going
    down: 'boss' (The Holder Wakes)
  - change pieces only at sensible moments (a wave starting or beaten, entering port), never every few seconds; musicPlay
    fades the old piece out itself.
- **Effects:** use Chris's effects from sounds.js where they fit (its SFX list: e.g. shard-pickup, coins, ui-buy,
  ui-confirm, ui-open, ui-close, sails, wind, rope-creak, crystal-flare, recharge, alert, boss, victory, defeat,
  thunder, levelup, new-area; audition them by rendering with an OfflineAudioContext and reading their numbers), and
  make new sounds for what it lacks: the cannon (a chaser's crack, a broadside's rolling boom rippling gun by gun with
  A2a's rippling broadsides, the Man-o'-war's thunder, far guns as distant thunder), hits on wood, canvas and crystal,
  near-miss whizzes, wrecks, the wind bed. Chris agreed to "new cannon, broadside and hit sounds made here on the same
  instruments": write them with sounds.js's exported voices (tone, noise, fm) where that's cheap enough. If live
  synthesis of a big melee costs too much (measure), bake those sounds once at load into AudioBuffers with an
  OfflineAudioContext, using small voice functions of our own that mirror tone/noise/fm (sfxInit sets a module-wide
  context, so never point sounds.js at an offline context in the running game).

## Routing Chris's files without editing them
- Create the game's AudioContext lazily on the first gesture (the survey's unlock design), then `sfxInit(ctx)` so
  sounds.js and music.js use the same context.
- sounds.js wires its OUT → its own compressor → destination. Re-route it: `const { OUT } = sfxNodes(); OUT.disconnect();
  OUT.connect(musicBus)`. After that, OUT carries only the music (musicPlay's bus and reverb return go into OUT), so the
  music has its own volume.
- Play Chris's effects through the game's own effects bus instead of playSfx (which sends to OUT): find the entry in
  `SFX` and call `withBus(fxBusInput, fxReverbSend, null, () => entry.play(t))`. playSfx's per-sound levels (LEVEL) are
  not exported, so give each effect you use a gain of your own, measured from an offline render.
- musicPlay(id) calls sfxInit() with no argument, which just resumes the existing context: fine.

## Build (from the survey)
sound-engine (unlock on first gesture on phones and iOS, suspend on leaving the page, the mix that never clips, voice
limits, 3D distance and pan from the camera, the time dial from fx slowing sounds is NOT wanted: sounds play at normal
speed in slow motion, but you may pitch the whoosh), cannon-voices, hits-and-near-misses, wrecks-and-going-down,
sky-ambience, shards-surge-feedback, port-and-title-sounds, and the sound checks (a voices-started counter and a
silence/clipping self-test with an OfflineAudioContext in tools/check.mjs).

Settings: a **Settings** card (a gear button on the title screen, in the port's top bar, and on the pause card) with
"Sound on", "Music" and "Sounds" sliders, kept per device in localStorage key 'skies-of-aethermoor/settings-1' (not in
the synced save). Make the card easy to extend: package B2 adds aim speed, flip up/down, picture quality and camera
shake rows to it. Laptop key: none needed (M stays the map).

Ducking: the music dips under big moments (a broadside of yours, a wreck blast, a wave banner) and comes back.

## Done means
Sound works from the first tap on a phone (including iOS Safari's rules) and on a laptop; leaving the page goes quiet;
a 5-raider melee with the Man-o'-war never clips (prove it with the offline self-test); the main thread cost per volley
and per frame is measured and small; tools/check.mjs checks that sounds start for fire, hit, kill, shards and the music
changes piece at a wave; it ends "all good"; docs/game.md gets a short plain-words "Sound and music" section; sounds.js
and music.js are byte-identical to the committed ones.
