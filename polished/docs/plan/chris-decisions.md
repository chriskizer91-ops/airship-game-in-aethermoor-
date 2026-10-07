# Chris's decisions for the polished version (October 6)

- **This version is the phone one**: rich and beautiful features, but every ship near 100,000 triangles at full
  detail, so the Captain's big ship and a fleet of raiders fit on a phone. Never take ships (or anything else) from the
  laptop-only version in chriskizer91-ops/20-min.
- **Music**: the music (src/audio/thareia/music.js, played on the instruments in sounds.js) is shared with the laptop
  version and used exactly as it is. The two files stay unchanged.
- **Fonts**: the text should be clearer. Cinzel (assets/fonts/cinzel.woff2) for titles, banners and ship names; Fira
  Sans (fira-sans-400/500/600.woff2) for everything else, with tabular lining figures for numbers. Jacquard 12 and
  Pixelify Sans go (unless kept for the big title logo only, if it reads well).
- **The Galleon and the Man-o'-war become the Captain's late-game ships**, bought in port after the Frigate (prices,
  upgrade costs and how they fly to be tuned with tools/sim-fight.mjs). Until now they were only raiders.
- **Giant raiders only once you own one**: raiders sail Galleons only once the Captain owns the Galleon, and
  Men-o'-war only once the Captain owns the Man-o'-war, whichever ship the Captain takes out that voyage.
- **The treasure ship before then is a treasure Brig**: a merchant Brig, painted richly and laden with shards, plays
  the treasure-ship part (runs; strikes her colours when her sails are shot away; escapes if left far behind). Once
  the Captain owns the Galleon, treasure Galleons come instead.
- Boarding still waits.
- **Title screen**: your ship flying slowly over Aethermoor at sunset, raiders crossing far off, behind the title and
  the three skies. The port keeps its garage look (the void and the stone berth).
- **Shot types: yes, all three**: round shot (all-round), chain shot (shreds sails, to catch a runner), crystal-breaker
  shot (cracks crystals, to bring a big ship down). Bought in port; cycled in flight with one key on a laptop and one
  button on the phone.
- **The sky: storms and flying through clouds, yes. Day turning to night: NO** (Chris didn't pick it; keep the
  late-afternoon light, apart from the storms' darkening).
  - Storms: some waves bring a storm front: dark cloud, rain streaks, lightning.
  - Fly through clouds: big clouds you can fly into, wisps rushing past; inside one, raiders aim worse.
- **Sound effects**: use Chris's effects in src/audio/thareia/sounds.js where they fit (airship, crystal, shard,
  coins, UI...), plus new cannon, broadside and hit sounds made for this game on the same voices (tone, noise, fm).
  sounds.js and music.js themselves stay unchanged.
