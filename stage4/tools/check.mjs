// check.mjs: opens the built pages in a headless browser the size of a laptop and of a phone, checks nothing went
// wrong, and takes pictures into shots/ (or the folder given). docs/game.md says what it checks in a few plain lines;
// this is the whole of it.
//   the save          two devices sharing one save on claude.ai (no browser needed): the newest save always wins (a tab
//                     left open, a tap before the store answers, play with no connection, a phone whose clock is slow),
//                     and no voyage's shards are lost (a write that fails once or twice, a tab that stopped hearing the
//                     store and one that hears it again, both devices banking a voyage at the same moment, a voyage
//                     played with no connection); a new browser isn't told its progress came from another device; a
//                     brand-new Captain starts on Fair Winds, and a save already made keeps the skies it chose; a save
//                     from before the Galleon and the Man-o'-war were sold gains them, not owned (from this device and
//                     from the store)
//   dist/hangar.html  every ship at every level of detail, with its triangle count kept near its budget; the Brig New,
//                     Battered and Wrecked (on the laptop and the phone): Battered changing over 4% of her hull's picture,
//                     setting her scars, with no more draws or shaders; Wrecked burning; a hole by the mast cut in its own
//                     wing only, not the one across the mast; held sideways on a phone, the buttons in 55% of the height
//                     and the stats starting folded, clear of them when brought out, and the Brig turned every 30
//                     degrees in the Turn view all in sight (her keel and ram tip above the buttons, her mast heads on
//                     the screen), as the page first opens and once she's picked again; Sails in folding her wing tips
//                     2.5 m aft or more and Fire! firing her guns, with no more draws or shaders; as drawn, side-on,
//                     her lids opening and guns running out changing over a fifth of the picture along her ports, her
//                     port guns kicked back in changing it again and her starboard guns not, and from above (her wood
//                     only) her lids swinging out from her side, not into her; her four colours (hers, a raider's, a
//                     captain's, a treasure ship's) all with the same shaders, the captain's black iron and banner, the
//                     treasure ship's glints; pictures of each (and a raider Man-o'-war on the laptop); the fleet's stats
//                     card listing all six with no line broken in two (on the phone's narrow card too); on the phone, all
//                     six at full detail shown in each colours in turn holding two sets of ships at most
//   dist/game.html    the title screen and the port: a brand-new Captain finds Fair Winds chosen; a ship that can't be
//                     afforded, then buying the Cutter and armour and setting the crystal power (the stats changing);
//                     dragging the ship round; the window resized in port, the corner map still drawn at sea and the
//                     big map at its own size. Each of the six ships flown: how fast it goes, turns and climbs; every
//                     battery fired at a raider of the same class 260 m off, locking on and hitting it; a raider shot
//                     down (high, and low under the clouds, falling before she goes) and its shards gathered, the count
//                     popping; the sun's shadows reaching the ship; raiders far off on their far model; a Cutter
//                     fighting back against a Captain who does nothing; a captain leading wave 5 (twice as tough as her
//                     crew on Crosswinds, no tougher on Fair Winds); giant raiders only once owned: owning neither, a
//                     treasure Brig (her hold ◆ 300) in wave 6 and a raider captain's Frigate and two Cutters in wave
//                     12, the card before each and its banner saying so, and no giant in wave 15;
//                     owning the Galleon, a treasure Galleon in wave 6 but no Man-o'-war in 12; owning only the
//                     Man-o'-war, a treasure Brig in wave 6 and the Man-o'-war in 12 and 15; owning both, a
//                     Man-o'-war in waves 12 and 15 (15's captain another ship); every wave to the 40th, 20 times over,
//                     with no giant not owned (each giant on her own too), never two treasure ships in a wave drawn at
//                     random, and owned, the Man-o'-war growing common late on but the treasure ships not (in under half
//                     of the late waves, whatever's owned); the Man-o'-war sold only once the Galleon is owned (her
//                     button saying so, and buying nothing even pressed); the Galleon and the
//                     Man-o'-war bought with the port's buttons (◆ 12,000 and 30,000, the Buy button on one line, the
//                     line under it and the port's note saying what owning her brings, firepower very heavy and
//                     fearsome, upgrades from ◆ 420 and 600, a full circle in 36 and 40 s) and sailed: all of her on the screen behind her and a raider 1.6 km
//                     ahead above her masts, her port broadside (16 and 24 guns, both decks) labelled, locked on,
//                     rippling within 0.6 s, heeling her, kicking the view (0.5 to 4 m), hitting and reloading in
//                     2.6 s, with pictures (and on the phone with taps); a treasure ship shot until she strikes, and
//                     another let run until she gets away; back to
//                     port from the card after wave 4 (the next wave's captain made ready), the Cutter bought and
//                     sailed: wave 1 one Skiff, only the Cutter in the sky; a whole voyage played to the end (beaten,
//                     sailed on, sunk, home with half); the save surviving a reload; the keyboard, mouse, wheel (a
//                     trackpad's flick and a mouse's notch) and touch controls answering; the drawing context lost and
//                     got back (the sky's light and the cloud pattern drawn again); pictures of the title, the port and
//                     a battle
//                     how a fight feels: every piece of news told (events.js), and none missed when listeners stop or
//                     start as it's told; a Frigate's broadside rippling bow to stern (one shot at once, all ten within
//                     0.7 s) with its gunsmoke (two puffs a port), tails over 20 m, the ship heeling to starboard and
//                     the view kicking back over half a metre and settling within a second (a third of it for reduced
//                     motion); hits marked on the crosshair in the part's colour and a kill's ring; a hit on you shaking
//                     the view, its red arc pointing at the shooter and naming her, one taking the hull under 30% told;
//                     a shot passing 10 m off one near miss, doing no harm; a raider's ports glowing at least 0.45 s
//                     before her broadside, and her tag flashing "Broadside!" while she's off screen (not on screen; on
//                     the phone too, stacked clear of another raider's tag at that edge, and holding still while the
//                     game is paused); raiders' tags far off, two or three close together on the screen, clear of each
//                     other, of all their ships and of the panels along the top, over their ships (not at the edge), and
//                     a close raider's with her masts high clear of the panels and of her hull (laptop, and a phone
//                     upright and held sideways at two sizes); a
//                     raider's glows drawn at the screen's scale as the Captain's are, from her first frame and once the
//                     window changes size (laptop, and a phone turned sideways); a raider shot down mid-broadside firing no more; a Man-o'-war's four batteries all
//                     rippling at once; a busy fight (a Frigate against three raiders for 15 s, two blown apart) fitting
//                     its sparks' and smoke's budgets, a step under a millisecond, a blast throwing 90 sparks or more;
//                     back to port from the pause menu ending the pause; on the phone, smaller budgets, a buzz for a
//                     hit and a kill, and none for a ship that gives up
//                     wrecks worth watching: debris matching the part hit, a 60-shot barrage fitting its batches with
//                     not a piece cut short and all fallen 4 s later, and canvas scraps keeping their own flapping beat;
//                     a raider Brig blown apart in three blasts or more within 3 s, her crystals dark by 2 s, through
//                     the cloud deck; her bounty rising and gone 3 s later (a captain's clear of a banner all the while
//                     it can be read); a treasure ship striking without a blast, and from 906 m sinking through the
//                     clouds within 16 s (and a raider whose crystals die at 740 m within 14); the holes in the clouds
//                     closed for the next voyage; the shard count counting up; masts falling on a laptop (gone from her
//                     far model too), and going only under the clouds; slow motion for a wave's last raider and the
//                     card waiting 1.4 s for it before it rises; the Surge's streaks, view (over 9 degrees wider),
//                     vapour and flare, all back 4 s later, and its view the same at 20 frames a second as at 60 (with
//                     less motion, up to 12 degrees and no overshoot); on the phone, a Man-o'-war going down beside two
//                     other wrecks within every budget (debris cut short at most one piece in twenty, no masts falling)
//                     ships that show their scars: three raider Frigates in view drawn with the shaders of one, each
//                     with her own looks; a chaser's shot through a raider's sail holing it within half a metre of where
//                     it went through, one into her planks scarring them within half a metre of where it struck (its
//                     embers cool within 5 s); a hit cluster of crystals dimming and cracking alone, all of them
//                     sputtering below a third (and the Captain's lamp dimming with its cluster); torn sails fraying; a
//                     raider holed in her port side listing to port; below a quarter of her hull, flames from her worst
//                     scars in one draw, out again once mended; her smoke from where she was hit; a long fight's hits
//                     all keeping their marks (the first ones where they struck); between waves the Captain's holes
//                     patched and her embers out; the next wave her smoke from her open wound, not her patches, and the
//                     old patches keeping their size as the crew start again; spotless in port, and as good as new the
//                     next voyage; 16 flames at most on a phone; read from afar (laptop and phone): a raider Frigate
//                     holed to a fifth 200 m from the camera, her flames changing 0.6% of her box on the screen or more
//                     and her holes, far off, drawn to change 1.35 times the pixels they would close up
//                     ships that move like they're alive: a Frigate's wings folded with her sails in, spread with them
//                     set, snapped open in a Surge (a tip 3 m aft or more); her pennants following her speed; her lids
//                     shut in calm; her port side fired in calm bursting its lids open with its first gun, that gun run
//                     out (under 0.2 m in) as it fires, and the lids shut again 10 s later; her lids open with her guns
//                     out two seconds after a wave arrives; her port broadside's guns, each kicking back on the model
//                     within 0.05 s of its own shot (the model's turns the very ones the guns fire at), 0.3 m in or more,
//                     and out again once loaded; a raider Brig readying a broadside with her lids open on that side; a
//                     shot through a raider's folded wing holing it within 0.6 m of where it went through; five wakes in
//                     one draw, hers gold and as long as 1.5 s of her flight, soft (under a tenth of the pixels they
//                     change burnt out to white-gold), a raider's 1.4 km off still glowing; a Cutter's wake 1.3 km off
//                     covering 2.2 times the flight of one 300 m off, and a clear streak on the screen (on a laptop 60
//                     px long and 300 pixels or more, on a phone 35 px and 100), steady, not a row of beads; a burning
//                     Cutter lost in the cloud floor 1 km off giving nothing away (her wake faded out, at most 30
//                     pixels of her showing over the cloud), her wake back once she's out of it; a captain's and a treasure
//                     Brig's colours with no new shaders, the treasure Brig's glints on metal that moves moving with it;
//                     a wave with a treasure Brig told as a treasure ship's (her sails to shoot, its sound), her running
//                     and her hold worth a Galleon's ◆ 300; a Galleon captain coming in close (1,050 to 1,450 m) across the
//                     Captain's path, as every Galleon runs; a Man-o'-war's column blown out once, dark, and her dipping
//                     at that end
//                     storms, clouds and a sky with depth: the cloud floor worked out in JavaScript agreeing with the
//                     card's own picture (within 0.03 at 64 places); storms on waves 8 and 13 on Crosswinds, 4, 8 and
//                     12 on the Maelstrom, none on Fair Winds, and banks of cloud on every third wave and storm waves;
//                     the card before a storm wave saying it's coming, the storm showing on the horizon as a billowing
//                     wall of cloud (the sky alone, looked at level: its crest lit against the sky down 70% of the
//                     columns or more, heaped 20 px high and low, lumpy all along, its tops half as bright again as its
//                     foot, moving 3 px or more in two minutes, and with no seam looking due north, where the directions
//                     round the sky start again: its crest stepping at most 4 px from one column to the next); wave 4 on the
//                     Maelstrom storming (rain, thicker cloud, the wind 16% or more, two lightning strikes or more in
//                     30 s, gusts, all told), drawing at most two more goes than a clear sky, and clearing within 25 s
//                     once beaten; wave 3's bank of cloud drawn just where the game reckons it is (the clouds it hides
//                     ships in), showing looking at it, and fading once the wave is beaten; inside a big cloud the mist
//                     showing and the haze closing in, gone out of it; hidden in the cloud floor no raider firing from
//                     500 m off in 10 s, firing within 15 s once she's out of it, her broadside giving her away for
//                     4 s; a raider hidden in cloud far off lost to the guns, her tag saying so and giving how far off
//                     she was last seen (not where she's moved on to), until she readies a broadside (her tag at her
//                     then); inside a cloud the raiders' shots landing under 60% as often, with the same luck; the
//                     Sunscorch Wastes' air warmer and dusty with its line, the Ironspire Peaks' colder and snowing; a
//                     storm's rain coming in from nothing over the Wastes' dust (the dust gone first); the glory
//                     following her and gone in a storm; the towering clouds making the horizon uneven; the sun's glare
//                     looking into it and gone looking away; pictures of all of it (shots/sky-*.png); on the phone, a
//                     storm's frames, a frame inside a cloud and one looking at a bank of cloud costing a fifth more
//                     than clear sky at the most, and the Smooth picture drawing half the rain
//                     the sound: Chris's two files (music.js, sounds.js) exactly as he gave them; nothing made before
//                     the first touch, which starts it (on the phone too, and again after it was stopped, with the
//                     silent blip as the finger lifts); going quiet when the page is left and back when it's shown;
//                     the title's, the port's and a wave's music; the port's sounds; the Settings card silencing and
//                     stopping the music and keeping it through a reload, the music back when it's turned up (and the
//                     card fitting a phone, closing with Esc); the recordings made for the game none silent, each
//                     sounding as it should from its spectrum (a bright crack, a darker raider's, a deep boom, roll and
//                     blast, canvas and crystal in 2-6 kHz, falling bells, a broadside rolling over 2 s); a real volley
//                     heard; hits, a raider blown apart and shards gathered all sounding; nothing played (or kept for
//                     later) with the sound off, and only its tick when it's back on; nothing made with the Sounds
//                     slider at nothing; a soft chord on crossing into another region; the sounds gated while paused;
//                     tests that run the clock only counting; a five-raider melee with a Man-o'-war and Chris's effects
//                     of the same moments, over a recording of the battle music, staying under 0.95 going into the soft
//                     clip (an offline render); and what the sound costs a volley and a frame
//                     a clear, tidy screen: the fonts (Cinzel and Fira Sans, inside the page, loading, even figures);
//                     the port in plain words, a ship not owned bought with the big button, and on a phone its two tabs;
//                     the Settings card's picture (Smooth: one screen pixel to the page's, 512 shadows, 55 puffs, far
//                     models sooner, fewer sparks, half the rain, no scud, sun's rays or glitter on the sea), aim
//                     speed (Fast 1.8 times, Slow half), up and down and camera shake taking effect at once, and kept
//                     on the device through a reload (never in the save); the keys folding away after a device's first
//                     two voyages; directions as left and right (the right way
//                     round) and the wind in words; How to fly; the big map fitting the screen with its cross; the card
//                     between waves a strip at the bottom, Enter and B working with the mouse locked; on a phone, Fire
//                     on the left (and the words saying so); and at three laptop sizes and four phone sizes (upright
//                     and sideways), in a battle with the toast, a warning and the banner (or the region's name) at
//                     once with their longest words, and between waves: nothing on the screen landing on anything else
//                     or off it; the edge tags clear of the panels, arrows and all, and again with every raider off the
//                     screen readying her broadside; the pause card over everything (and closing the big map); the
//                     score saying the wave just beaten; the big map's names 11 px or more and none on (or touching)
//                     another; her ship going down with the big map open, its card on top; and a bounty rising where
//                     the card between waves comes up keeping clear of it. The port at the four phone sizes, a
//                     narrow one held sideways (640 by 360) and the smallest (568 by 320): its top line on one line,
//                     its panel clear of the top line, of the ships and of the longest note it shows (as a ship is
//                     bought); each of the six ships' buttons all inside the
//                     ships' rows; every ship not owned (the Frigate, the Galleon and the Man-o'-war, before the
//                     Galleon and after) showing all her stats above her Buy button, its words on one line, and held
//                     upright her ship all above the panel; your own ship's tab showing all five stats above Set sail
//                     and its fade (two on a small phone held upright); two upgrades or more
//                     above Set sail (one under 360 px tall); each of the six ships' blurbs (owned or not) all above the button's
//                     fade; and held upright, the panel no taller than what's in it
//                     the title screen: Aethermoor itself at sunset (not the port's void), her ship flying 700 m up
//                     within 600 m of the island city in the Hearthsea, at full detail, and two or three raiders
//                     crossing far off (on their far models, none fighting; coloured from their paintings, whose
//                     pixels are let go once they're put together), the Maelstrom tinting it at least 15% darker than
//                     Fair Winds; "Set sail" straight to sea for a new Captain, the afternoon put back exactly; the dip
//                     through the night between every two screens; a drag swinging the view round her, coasting the
//                     same at any frame rate and easing back; the sun's shadows sized to her; at laptop, tablet and
//                     phone sizes, a raider in sight most of the time, each turned 25 to 35 degrees from side-on to
//                     the line of sight to her wherever she is in the view (so her sails show), sailing across it bow
//                     first, and drawn in one go, on a phone held upright
//                     small and low over the horizon (clearly far off), her ship clear of the title's card, and the
//                     card fitting the screen; dragging her round in port; on a phone, its frames costing no more than
//                     a voyage's and drawn in fewer goes, and pictures of it upright and sideways
// Run: node tools/build.mjs && node tools/check.mjs [--quick | --ships] [folder]
//   --quick: only the game page at laptop size (for checking during work; the full run is the one that counts)
//   --ships: only the ships demo (dist/hangar.html), on the laptop and the phone, upright and sideways
// The ships demo's own frames are held while it's checked, and it's drawn only for the pictures and pixels looked at:
// drawn in software, each of its frames takes a second or more, and every picture waited behind several. For the same
// reason the sky at sea is left undrawn while the real keys, mouse and touches are tried (they answer the same). It
// says at the end how long it took.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const quick = process.argv.includes('--quick'), demoOnly = process.argv.includes('--ships'), began = Date.now();
const out = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? root + 'shots';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const problems = [];
const fleet = ['skiff', 'cutter', 'brig', 'frigate', 'galleon', 'manowar']; // (the Captain can sail all six)
const BUDGET = { full: [80000, 125000], middle: [10000, 50000], far: [1000, 8000] };
const SIZES = { laptop: { viewport: { width: 1280, height: 800 } }, phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
  sideways: { viewport: { width: 667, height: 375 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } };

async function open(file, name, ready) {
  const page = await browser.newPage(SIZES[name]);
  page.on('pageerror', (e) => problems.push(`${file} ${name}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`${file} ${name} console: ${m.text()}`); });
  await page.goto(`file://${root}dist/${file}.html`);
  await page.waitForFunction(ready, null, { timeout: 180000 });
  return page;
}
const shot = (page, path) => page.screenshot({ path: `${out}/${path}.png`, timeout: 120000 });
// the ships demo moved on a moment and drawn once: its own frames are held for the checks (a frame drawn in software
// takes a second or more, and a picture or a look at the pixels waited behind several), so only what's looked at is drawn
const drawn = (page) => page.evaluate(() => { const H = window.__hangar; H.step(0.1); H.draw(); });
const hangar = async (name) => { const page = await open('hangar', name, () => window.__hangar?.ready || !document.getElementById('error').hidden); await page.evaluate(() => window.__hangar?.hold()); return page; };
const wait = (page, fn, arg, what) => page.waitForFunction(fn, arg, { timeout: 60000, polling: 100 }).catch(() => problems.push(`${what}: didn't happen`));
// the world at sea left undrawn while the real keys, mouse and touches are tried (or drawn again): the controls answer
// the same with nothing drawn, and a frame drawn in software takes a second or more, which every key, click, turn of
// the wheel and touch waited behind (20 turns of the wheel took a minute)
const undrawn = (page, on) => page.evaluate((on) => { window.__game.scene.visible = !on; }, on);
// the game's window at a new size, once the game has heard of it (drawn in software, a frame can take a while)
const sized = async (page, w, h, where) => {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForFunction(([w, h]) => Math.abs(window.__game.camera.aspect - w / h) < 1e-6, [w, h], { timeout: 30000 }).catch(() => problems.push(`${where} ${w}x${h}: the game never heard the window change size`));
};

// ---------- Chris's music and instruments, exactly as he gave them ----------
{
  const SHA = { 'sounds.js': '6deb613023cd8ef483b505ad53670eb996fa312a1d2ff87c55acc859125acfa9', 'music.js': '130a02a5ae5e945d33f9f777b21a3b6bf53add145923b098abae7c6f3a7a0b0a' };
  const changed = Object.keys(SHA).filter((f) => createHash('sha256').update(readFileSync(root + 'src/audio/thareia/' + f)).digest('hex') !== SHA[f]);
  console.log(`Chris's music and instruments: ${changed.length ? 'CHANGED: ' + changed.join(', ') : 'as he gave them'}`);
  if (changed.length) problems.push(`src/audio/thareia/${changed.join(' and ')} must stay exactly as Chris gave them (src/audio/thareia/NOTE.md)`);
}

// ---------- the save, on two devices ----------
// progress.js run twice in plain JS, as a laptop and a phone with their own storage, sharing one pretend claude.ai
// store: a tab left open must never write its old save over newer progress from the other device, and shards won on a
// voyage must never be lost, even when a write fails or a tab stops hearing the store
{
  const src = readFileSync(root + 'src/game/progress.js', 'utf8').replace(/^export /gm, '');
  let store = null, clock = 1e12, fail = 0; // `fail`: how many of the next writes fail, as when the link blinks
  const tick = () => new Promise((r) => setTimeout(r, 20));
  const subs = new Set(), snap = () => ({ exists: !!store, data: () => JSON.parse(JSON.stringify(store)), metadata: { hasPendingWrites: false } });
  const db = { doc: () => ({ get: async () => { await tick(); return snap(); },
    set: async (d) => { await tick(); if (fail > 0) { fail--; throw { code: 'unavailable', message: 'the link blinked' }; } store = JSON.parse(JSON.stringify(d)); for (const f of subs) setTimeout(() => f(snap()), 5); },
    onSnapshot: (f) => { subs.add(f); setTimeout(() => f(snap()), 5); return () => subs.delete(f); } }) };
  // a device: the game opened in a browser with its own storage; opening it again closes the page that was open there
  // (a closed page hears and sends nothing). `dead`: how many of its streams die at once, as one does when the link to
  // the store stops answering. Its pauses run 20 times faster than a real page's
  const pages = [], never = new Promise(() => {});
  const shut = (ls) => { for (const p of pages) if (p.ls === ls && !p.closed) { p.closed = true; for (const f of p.subs) subs.delete(f); } };
  const device = (ls, { online = true, dead = 0 } = {}) => {
    shut(ls);
    const page = { ls, closed: false, subs: [] }; pages.push(page);
    const mine = { doc: (path) => { const d = db.doc(path); return {
      get: () => (page.closed ? never : d.get()), set: (v) => (page.closed ? never : d.set(v)),
      onSnapshot: (f, err) => {
        if (page.closed) return () => {};
        if (dead-- > 0) { setTimeout(() => err({ code: 'unavailable', message: 'the stream died' }), 5); return () => {}; }
        page.subs.push(f); return d.onSnapshot(f);
      } }; } };
    const ctx = vm.createContext({ localStorage: { getItem: (k) => ls.get(k) ?? null, setItem: (k, v) => ls.set(k, v) }, Date: { now: () => clock }, JSON, Object, Math, Promise,
      setTimeout: (f, ms) => setTimeout(() => { if (!page.closed) f(); }, ms / 20), document: { hidden: false, addEventListener() {} } });
    ctx.window = online ? { claude: { use: async (n) => (n === 'db' ? mine : { id: async () => 'chris' }) } } : {};
    vm.runInContext(src + '\nthis.makeProgress = makeProgress;', ctx);
    return ctx.makeProgress();
  };
  const laptopLS = new Map(), phoneLS = new Map(), wait = (ms = 150) => new Promise((r) => setTimeout(r, ms)), got = (p) => `${p.data.shards}${p.data.ships.brig.owned ? '+brig' : ''}`;
  const all = () => `${got(laptop)} / ${got(phone)} / store ${store.shards}`;
  const sync = [];
  let laptop = device(laptopLS); await wait(); clock += 1000; laptop.data.shards = 1000; laptop.save(); await wait();
  // the phone buys the Brig and banks a voyage while the laptop's tab sits open; then a tap on the laptop saves
  clock += 3600e3; let phone = device(phoneLS); await wait();
  clock += 1000; phone.data.shards -= 900; phone.data.ships.brig.owned = true; phone.save(); await wait();
  clock += 1000; phone.bank(700, 4); await wait();
  clock += 3600e3; laptop.data.skies = 'mael'; laptop.save(); await wait();
  clock += 1000; phone = device(phoneLS); await wait();
  sync.push(['a tab left open', got(phone), '800+brig']);
  // a tap on the phone before it has heard from the store, which the laptop has moved on since the phone was closed
  shut(phoneLS); clock += 1000; laptop.data.shards += 50; laptop.save(); await wait();
  clock += 86400e3; phone = device(phoneLS); phone.data.skies = 'fair'; phone.save(); await wait(250);
  sync.push(['a tap before the store answers', `${got(phone)} ${phone.data.skies}`, '850+brig mael']);
  // played with no connection, then back online: nothing newer in the store, so it goes up
  clock += 1000; let off = device(phoneLS, { online: false }); off.data.shards += 5; off.save(); await wait(50);
  clock += 1000; phone = device(phoneLS); await wait(250);
  sync.push(['played offline, then online', `${got(phone)} / store ${store.shards}`, '855+brig / store 855']);
  // a phone whose clock is an hour slow still saves over what it has seen
  clock += 1000; laptop = device(laptopLS); await wait(); laptop.data.shards += 10; laptop.save(); await wait();
  const real = clock; clock -= 3600e3; phone.data.shards += 1; phone.save(); await wait(); clock = real;
  sync.push(['a phone with a slow clock', `store ${store.shards}`, 'store 866']);
  // and the laptop's open tab hears of it without reloading
  await wait(100);
  sync.push(['an open tab hears the other device', got(laptop), '866+brig']);
  // a voyage banked as the link blinks: the write fails, and goes again a moment later
  clock += 1000; fail = 1; laptop.bank(100, 3); await wait(300);
  sync.push(['a write that failed once', all(), '966+brig / 966+brig / store 966']);
  // it fails again too, and the phone saves not having heard of it: the laptop hears the phone and adds its voyage on
  clock += 1000; fail = 2; laptop.bank(100, 5); await wait(300);
  clock += 1000; phone.data.skies = 'fair'; phone.save(); await wait(300);
  sync.push(['a write that failed twice', `${all()}, best ${laptop.data.best.mael} ${phone.data.best.mael}, ${laptop.data.skies}`, '1066+brig / 1066+brig / store 1066, best 5 5, fair']);
  // a tab whose stream died: the phone buys an upgrade the laptop never hears of, then the laptop banks a voyage
  clock += 1000; laptop = device(laptopLS, { dead: 99 }); await wait();
  clock += 1000; phone.data.shards -= 140; phone.data.ships.brig.mods.armour = 1; phone.save(); await wait();
  const deaf = got(laptop);
  clock += 1000; laptop.bank(500, 2); await wait(300);
  sync.push(['a tab whose stream died', `${deaf}, then ${all()}, armour ${laptop.data.ships.brig.mods.armour}`, '1066+brig, then 1426+brig / 1426+brig / store 1426, armour 1']);
  // a stream that dies once is opened again, and hears the other device; this tab had progress of its own, so says so
  const told = { open: [], fresh: [] };
  clock += 1000; laptop = device(laptopLS, { dead: 1 }); laptop.onLoad((d, had) => told.open.push(had)); await wait(400);
  clock += 1000; phone.data.shards -= 26; phone.save(); await wait();
  sync.push(['a stream that died and came back', `${got(laptop)}, told ${told.open[0]}`, '1400+brig, told true']);
  // both devices bank a voyage at the very same moment: neither is lost
  clock += 1000; laptop.bank(300, 1); clock += 1; phone.bank(200, 1); await wait(400);
  sync.push(['two voyages banked at once', all(), '1900+brig / 1900+brig / store 1900']);
  // a voyage played with no connection while the laptop buys an upgrade: back online, the phone keeps both
  clock += 1000; off = device(phoneLS, { online: false }); off.bank(70, 6); await wait(50);
  clock += 1000; laptop.data.shards -= 100; laptop.data.ships.brig.mods.drill = 1; laptop.save(); await wait();
  clock += 1000; phone = device(phoneLS); await wait(300);
  sync.push(['a voyage played offline', `${all()}, drill ${phone.data.ships.brig.mods.drill}, best ${phone.data.best.fair}`, '1870+brig / 1870+brig / store 1870, drill 1, best 6']);
  // a new browser (or one with its site data cleared) takes the save without being told it came from another device
  const fresh = device(new Map()); fresh.onLoad((d, had) => told.fresh.push(had)); await wait();
  sync.push(['a new browser', `${got(fresh)}, told ${told.fresh.join(' ')}`, '1870+brig, told false']);
  // a brand-new Captain starts on Fair Winds; a save already made keeps the skies it chose (even with no voyages yet)
  const newbie = device(new Map(), { online: false }), keeps = device(new Map([['skies-of-aethermoor/save-1', JSON.stringify({ v: 1, saved: 5, skies: 'cross', voyages: 0 })]]), { online: false });
  sync.push(['a brand-new Captain, and an old save', `${newbie.data.skies} ${keeps.data.skies}`, 'fair cross']);
  // a save from before the Galleon and the Man-o'-war were sold in port gains them, not owned and with no upgrades, and
  // keeps everything else it had; so does one taken from the store, saved by a device still on the old game
  const ship4 = (owned, armour = 0) => ({ owned, power: 1, mods: { armour, canvas: 0, drill: 0, crystals: 0 } });
  const before = { v: 1, saved: 9e12, skies: 'cross', shards: 420, flying: 'brig', voyages: 7, ships: { skiff: ship4(true), cutter: ship4(true), brig: ship4(true, 2), frigate: ship4(false) } };
  const bigTwo = (p) => { const d = p.data, G = d.ships.galleon, M = d.ships.manowar, ups = (x) => x ? Object.values(x.mods).reduce((a, b) => a + b, 0) : -1;
    return `${d.shards} ${d.flying} brig ${d.ships.brig.owned} armour ${d.ships.brig.mods.armour}, galleon ${G?.owned} ${ups(G)}, man-o'-war ${M?.owned} ${ups(M)}`; };
  const olden = device(new Map([['skies-of-aethermoor/save-1', JSON.stringify(before)]]), { online: false });
  store = { ...before, saved: 9.5e12, shards: 421 }; const adopted = device(new Map()); await wait(300);
  sync.push(['a save from before the big two', `${bigTwo(olden)}; from the store ${bigTwo(adopted)}`, '420 brig brig true armour 2, galleon false 0, man-o\'-war false 0; from the store 421 brig brig true armour 2, galleon false 0, man-o\'-war false 0']);
  for (const [what, was, want] of sync) if (was !== want) problems.push(`the save between two devices, ${what}: ${was}, should be ${want}`);
  console.log(`the save between two devices: ${sync.every(([, a, b]) => a === b) ? 'the newest save always wins, and no voyage is lost' : 'WRONG'}`);
}

// ---------- the hangar ----------
for (const name of quick ? [] : ['laptop', 'phone']) {
  const page = await hangar(name);
  if (name === 'laptop') {
    const table = await page.evaluate((ships) => ships.map((id) => [id, ...['full', 'middle', 'far'].map((l) => window.__hangar.stats(id, l))]), fleet);
    for (const [id, ...levels] of table) {
      console.log(id.padEnd(8), levels.map((s, i) => `${['full', 'middle', 'far'][i]} ${s.triangles.toLocaleString().padStart(7)} (${s.drawCalls} calls)`).join('  '));
      levels.forEach((s, i) => { const l = ['full', 'middle', 'far'][i], [a, b] = BUDGET[l]; if (s.triangles < a || s.triangles > b) problems.push(`${id} ${l}: ${s.triangles} triangles, outside ${a}-${b}`); });
    }
  }
  const shots = name === 'laptop'
    ? fleet.flatMap((id) => [[id, 'turn', 0.9, 0.28], [id, 'side', Math.PI / 2, 0.04]]).concat([['all', 'turn', 0.75, 0.32]])
    : [['brig', 'turn', 0.9, 0.3], ['skiff', 'turn', 0.9, 0.3], ['all', 'turn', 0.75, 0.32]];
  for (const [id, view, yaw, pitch] of shots) {
    await page.evaluate(([id, view, yaw, pitch]) => { window.__hangar.select(id); window.__hangar.view(view, yaw, pitch); }, [id, view, yaw, pitch]);
    await drawn(page);
    await shot(page, `${name}-${id}-${view}`);
  }
  // the fleet's stats card (All six, with the stats out): every line of it whole, no word broken in two ("Man-o'-" and
  // "war", or "60" and "m"), on the phone's narrow card too
  const fleetCard = await page.evaluate(() => {
    const $ = (id) => document.getElementById(id), shut = $('card').hidden;
    window.__hangar.select('all'); if (shut) $('btn-card').click();
    const lines = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); return new Set([...rg.getClientRects()].map((b) => Math.round(b.top))).size; };
    const broken = [$('card-cls'), ...document.querySelectorAll('#card-stats dt, #card-stats dd')].filter((el) => lines(el) > 1).map((el) => el.textContent);
    const out = { cls: $('card-cls').textContent, rows: document.querySelectorAll('#card-stats dt').length, broken };
    if (shut) $('btn-card').click();
    return out;
  });
  console.log(`${name}: the fleet's card "${fleetCard.cls}", ${fleetCard.rows} ships, ${fleetCard.broken.length ? `BROKEN OVER TWO LINES: ${fleetCard.broken.join(', ')}` : 'every line whole'}`);
  if (fleetCard.broken.length || fleetCard.rows !== 6) problems.push(`${name}: the ships demo's fleet card should list all six with no line broken in two: ${JSON.stringify(fleetCard)}`);
  // her scars (src/ship/dress.js): the Brig New, Battered and Wrecked, pictured. Battered changes the picture of her
  // hull (a share of the pixels in the box round it on the screen), sets her looks, and draws in as many goes with no
  // new shaders; Wrecked burns
  await page.evaluate(() => { const H = window.__hangar; H.select('brig'); H.level('full'); H.view('side', Math.PI / 2, 0.04); });
  await drawn(page);
  const worn = await page.evaluate(() => {
    const H = window.__hangar, r = H.renderer, c = r.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true });
    k.width = c.width; k.height = c.height;
    const grab = (look) => { H.wear(look); r.render(H.scene, H.camera); x.drawImage(c, 0, 0); return { px: x.getImageData(0, 0, k.width, k.height).data, calls: r.info.render.calls, programs: r.info.programs.length }; };
    const a = grab('new'), b = grab('battered'), scar = H.shown[0].U.uScar.value[3];
    // (her hull on the screen: the box round it)
    const S = H.shown[0], h = S.hull, box = new (H.camera.position.constructor)(), lo = [Infinity, Infinity], hi = [-Infinity, -Infinity], bb = { min: { x: 0, y: Infinity, z: h.zs }, max: { x: 0, y: -Infinity, z: h.zb } };
    for (let z = h.zs; z <= h.zb; z += 0.25) { bb.max.x = Math.max(bb.max.x, h.half(z)); bb.min.y = Math.min(bb.min.y, h.keel(z)); bb.max.y = Math.max(bb.max.y, h.rim(z)); }
    bb.min.x = -bb.max.x; S.root.updateMatrixWorld(true);
    for (let i = 0; i < 8; i++) { box.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(S.body.matrixWorld).project(H.camera); lo[0] = Math.min(lo[0], box.x); lo[1] = Math.min(lo[1], box.y); hi[0] = Math.max(hi[0], box.x); hi[1] = Math.max(hi[1], box.y); }
    const x0 = Math.max(0, Math.floor((lo[0] + 1) / 2 * k.width)), x1 = Math.min(k.width, Math.ceil((hi[0] + 1) / 2 * k.width)), y0 = Math.max(0, Math.floor((1 - hi[1]) / 2 * k.height)), y1 = Math.min(k.height, Math.ceil((1 - lo[1]) / 2 * k.height));
    let changed = 0, n = 0;
    for (let y = y0; y < y1; y++) for (let xx = x0; xx < x1; xx++) { const i = (y * k.width + xx) * 4; n++; if (Math.max(Math.abs(a.px[i] - b.px[i]), Math.abs(a.px[i + 1] - b.px[i + 1]), Math.abs(a.px[i + 2] - b.px[i + 2])) > 16) changed++; }
    H.wear('new');
    return { changed: +(changed / Math.max(1, n)).toFixed(3), scar: +scar.toFixed(2), calls: [a.calls, b.calls], programs: [a.programs, b.programs] };
  });
  for (const look of ['new', 'battered', 'wrecked']) {
    await page.evaluate((look) => window.__hangar.wear(look), look);
    await drawn(page);
    await shot(page, `${name}-brig-${look}`);
  }
  const burning = await page.evaluate(() => window.__hangar.flames.count);
  console.log(`${name}: the Brig Battered changes ${Math.round(worn.changed * 100)}% of the picture of her hull (her first scar ${worn.scar} m), drawn in ${worn.calls.join(' and ')} goes with ${worn.programs.join(' and ')} shaders; Wrecked burns in ${burning} places`);
  if (!(worn.changed > 0.04) || !(worn.scar > 0) || worn.calls[0] !== worn.calls[1] || worn.programs[1] > worn.programs[0]) problems.push(`${name}: the ships demo's Battered should show her scars (over 4% of her hull changed) with no more draws or shaders: ${JSON.stringify(worn)}`);
  if (!(burning >= 2)) problems.push(`${name}: the ships demo's Wrecked ship should burn: ${burning} flames`);
  // her guns as the graphics card draws them (src/ship/dress.js): the Brig side-on, her wings spread. Her lids opening
  // and her guns running out change the picture along her row of port lids (the box round them on the screen); every
  // port gun kicked back in, a second after a broadside, changes it again; her starboard guns kicked back changes
  // nothing there (each side kicks its own guns). Then from above, with only her wood shown so nothing hides her lids,
  // her port lids opened: they swing out from her side (the picture changes outboard of their hinges), not into her
  await page.evaluate(() => { const H = window.__hangar; H.select('brig'); H.level('full'); H.wear('new'); H.livery('yours'); H.view('side', Math.PI / 2, 0.04); });
  await drawn(page);
  const lidWork = () => {
    const H = window.__hangar, r = H.renderer, c = r.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true });
    k.width = c.width; k.height = c.height;
    const S = H.shown[0], V = H.camera.position.constructor, grab = () => { r.render(H.scene, H.camera); x.drawImage(c, 0, 0); return x.getImageData(0, 0, k.width, k.height).data; };
    // (her port lids, from the wood they're made of: where they hinge, and from bow to stern)
    const g = S.body.children.find((o) => o.name === 'wood').geometry, P = g.attributes.position, RG = g.attributes.rig, lids = [];
    for (let i = 0; i < P.count; i++) if (Math.round(RG.getX(i)) === 2 && RG.getY(i) > 0) lids.push(i);
    // the share of the pixels (%) changed from a to b inside a box on the screen; and the box round points of hers
    const changed = (a, b, B) => { let n = 0; for (let y = B[2]; y < B[3]; y++) for (let xx = B[0]; xx < B[1]; xx++) { const i = (y * k.width + xx) * 4; if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) > 16) n++; } return +(n / Math.max(1, (B[1] - B[0]) * (B[3] - B[2])) * 100).toFixed(1); };
    const boxOf = (pts) => {
      S.root.updateMatrixWorld(true);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of pts) { const v = p.applyMatrix4(S.body.matrixWorld).project(H.camera), sx = (v.x + 1) / 2 * k.width, sy = (1 - v.y) / 2 * k.height; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
      return [Math.max(0, Math.floor(x0)), Math.min(k.width, Math.ceil(x1)), Math.max(0, Math.floor(y0)), Math.min(k.height, Math.ceil(y1))];
    };
    return { H, S, V, U: S.U, grab, changed, boxOf, P, RG, lids };
  };
  await page.evaluate(`window.lidWork = ${lidWork}`);
  const guns = await page.evaluate(() => {
    const { H, U, V, grab, changed, boxOf, P, lids } = window.lidWork();
    const band = boxOf(lids.map((i) => new V().fromBufferAttribute(P, i)));
    H.rig({ fold: 0, open: 0 }); const shut = grab();
    H.rig({ open: 2 }); const open = grab();
    // (every gun of one side kicked back a second ago, its ripple done, and still loading)
    const t = H.time, kicked = (b) => { U.uFire.value.setScalar(-1e4).setComponent(b, t - 1); U.uReady.value.setScalar(0).setComponent(b, t + 1.6); return grab(); };
    const port = kicked(0), starboard = kicked(1);
    U.uFire.value.setScalar(-1e4); U.uReady.value.setScalar(0); H.rig({ open: 0 });
    return { lids: changed(shut, open, band), port: changed(open, port, band), starboard: changed(open, starboard, band) };
  });
  await page.evaluate(() => window.__hangar.view('top', Math.PI / 2, 1.45));
  await drawn(page);
  Object.assign(guns, await page.evaluate(() => {
    const { H, S, U, V, grab, changed, boxOf, P, RG, lids } = window.lidWork();
    let hx = 0, hy = 0, z0 = Infinity, z1 = -Infinity;
    for (const i of lids) { hx += RG.getY(i) / lids.length; hy += RG.getZ(i) / lids.length; z0 = Math.min(z0, P.getZ(i)); z1 = Math.max(z1, P.getZ(i)); }
    // (as high as an open lid reaches, from 0.6 to 1.4 m outboard of her hinges, or as far inboard)
    const side = (a, b) => boxOf([a, b].flatMap((dx) => [0, 0.7].flatMap((dy) => [z0, z1].map((z) => new V(hx + dx, hy + dy, z)))));
    for (const o of S.body.children) if (o.isMesh) o.visible = o.name === 'wood';
    H.rig({ fold: 0, open: 0 }); const shut = grab();
    U.uGun.value.set(2, 0, 0, 0); const open = grab();
    for (const o of S.body.children) o.visible = true;
    H.rig({ open: 0 });
    return { outboard: changed(shut, open, side(0.6, 1.4)), inboard: changed(shut, open, side(-1.4, -0.6)) };
  }));
  console.log(`${name}: the Brig's lids opening and guns running out change ${guns.lids}% of the picture along her ports, every port gun kicked back ${guns.port}% and every starboard gun ${guns.starboard}%; seen from above, her lids opening change ${guns.outboard}% of it outboard of their hinges and ${guns.inboard}% inboard`);
  if (!(guns.lids > 20) || !(guns.port > 2) || !(guns.starboard < guns.port / 5) || !(guns.outboard > 25) || !(guns.inboard < 5)) problems.push(`${name}: the Brig's lids should swing out from her side as her guns run out, and her port guns (only) kick back in, as the graphics card draws them: ${JSON.stringify(guns)}`);
  // a big hole in her top port wing right by the mast (six hundredths of the way out along its yard, as big as a hole
  // grows): seen from astern it's cut in that wing only, not in the starboard wing across the mast (under a metre off)
  if (name === 'laptop') {
    // (close, looking at the middle of her box: her top wings by the mast fill the view)
    await page.evaluate(() => { const H = window.__hangar; H.select('brig'); H.level('full'); H.wear('new'); H.view('back', Math.PI, 0.3, 34); H.state.target.copy(H.state.middle); });
    await drawn(page);
    const luff = await page.evaluate(() => {
      const H = window.__hangar, r = H.renderer, c = r.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true });
      k.width = c.width; k.height = c.height;
      const grab = () => { r.render(H.scene, H.camera); x.drawImage(c, 0, 0); return x.getImageData(0, 0, k.width, k.height).data; };
      const S = H.shown[0], W = S.wear, V = H.camera.position.constructor, w = S.wings.find((q) => q.top && q.side > 0), other = S.wings.find((q) => q.top && q.side < 0 && q.mast === w.mast);
      const a = grab(), p = new V().addScaledVector(w.A, 0.47).addScaledVector(w.B, 0.06).addScaledVector(w.C, 0.47).addScaledVector(w.n, w.belly * Math.pow(27 * 0.47 * 0.06 * 0.47, 0.8));
      W.hole(p, 1.8, w); W.write();
      const b = grab(), sx = (v) => (v.clone().applyMatrix4(S.body.matrixWorld).project(H.camera).x + 1) / 2 * k.width;
      const mast = sx(new V(0, w.A.y, w.mz)), across = Math.sign(sx(other.B) - mast);
      let mine = 0, theirs = 0;
      for (let i = 0; i < a.length; i += 4) {
        if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) <= 24) continue;
        if (((i / 4) % k.width - mast) * across > 4) theirs++; else mine++;
      }
      W.reset();
      return { mine, theirs };
    });
    console.log(`${name}: a hole by the Brig's mast changes ${luff.mine} pixels on its own wing and ${luff.theirs} on the wing across the mast`);
    if (!(luff.mine > 300) || luff.theirs > 10) problems.push(`a hole in a wing by the mast should be cut in that wing only, not the one across the mast: ${JSON.stringify(luff)}`);
  }
  // her life and colours (src/ship/dress.js, livery.js): "Sails in" folds the Brig's wings back (their tips at least
  // 2.5 m further aft, over 2% of the picture changing) and "Fire!" runs her guns out and fires them, in as many draws
  // and with no new shaders; and her four colours (hers, a raider's, a raider captain's and a treasure ship's) all drawn
  // with the same shaders: the captain's black iron and her banner, the treasure ship's glints. Pictures of the Brig
  // folded with her guns out, as a raider captain and as a treasure ship (and on a laptop, a raider Man-o'-war)
  await page.evaluate(() => { const H = window.__hangar; H.select('brig'); H.level('full'); H.wear('new'); H.livery('yours'); H.view('turn', 2.6, 0.35); });
  await drawn(page);
  const alive = await page.evaluate(() => {
    const H = window.__hangar, r = H.renderer, c = r.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true }), out = {};
    k.width = c.width; k.height = c.height;
    const grab = () => { r.render(H.scene, H.camera); x.drawImage(c, 0, 0); return { px: x.getImageData(0, 0, k.width, k.height).data, calls: r.info.render.calls, programs: r.info.programs.length }; };
    H.rig({ fold: 0, open: 0 }); const a = grab();
    H.rig({ fold: 1, open: 2, fire: true }); const b = grab();
    let changed = 0;
    for (let i = 0; i < a.px.length; i += 4) if (Math.max(Math.abs(a.px[i] - b.px[i]), Math.abs(a.px[i + 1] - b.px[i + 1]), Math.abs(a.px[i + 2] - b.px[i + 2])) > 16) changed++;
    const S = H.shown[0], w = S.wings.find((q) => q.top && q.side > 0);
    out.fold = { aft: +(H.foldPoint(w.tip.clone(), 1, w.mz, 0).z - H.foldPoint(w.tip.clone(), 1, w.mz, 1).z).toFixed(2), changed: +(changed / (a.px.length / 4)).toFixed(3), calls: [a.calls, b.calls], programs: [a.programs, b.programs],
      fired: +(S.U.uReady.value.x - S.U.uFire.value.x).toFixed(2) };
    const progs = {}, tris = (s, name) => { let n = 0; s.body.traverse((o) => { if (o.isMesh && o.name === name) n += o.geometry.attributes.position.count / 3; }); return n; };
    for (const l of ['yours', 'crew', 'captain', 'treasure']) { H.livery(l); progs[l] = grab().programs; }
    H.livery('crew'); const crewFlag = tris(H.shown[0], 'flag');
    H.livery('captain'); const cap = H.shown[0];
    out.captain = { iron: cap.M.brass.color.getHexString(), banner: tris(cap, 'flag') - crewFlag };
    H.livery('treasure'); const tr = H.shown[0], kinds = tr.glow.geometry.attributes.kind;
    let glints = 0; for (let i = 0; i < kinds.count; i++) if (kinds.getX(i) === 3) glints++;
    out.treasure = { glints, gold: tr.M.brass.color.getHexString() };
    out.programs = progs;
    H.livery('yours'); H.rig({ fold: 0, open: 0 });
    return out;
  });
  for (const [look, livery, rig, id] of [['folded', 'yours', { fold: 1, open: 2 }, 'brig'], ['captain', 'captain', { fold: 0.2, open: 2 }, 'brig'], ['treasure', 'treasure', { fold: 0, open: 0 }, 'brig'], ...(name === 'laptop' ? [['raider', 'crew', { fold: 0, open: 2 }, 'manowar']] : [])]) {
    await page.evaluate(([livery, rig, id]) => { const H = window.__hangar; H.select(id); H.level(id === 'manowar' ? 'middle' : 'full'); H.livery(livery); H.rig(rig); H.view('turn', 0.9, 0.28); }, [livery, rig, id]);
    await drawn(page);
    await shot(page, `${name}-${id}-${look}`);
  }
  await page.evaluate(() => { const H = window.__hangar; H.select('brig'); H.livery('yours'); H.rig({ fold: 0, open: 0 }); });
  const P = alive.programs;
  console.log(`${name}: Sails in folds the Brig's wing tips ${alive.fold.aft} m aft (${Math.round(alive.fold.changed * 100)}% of the picture changes), Fire! reloads in ${alive.fold.fired} s, drawn in ${alive.fold.calls.join(' and ')} goes with ${alive.fold.programs.join(' and ')} shaders; her colours with ${P.yours}, ${P.crew}, ${P.captain} and ${P.treasure} shaders (hers, a raider's, a captain's, a treasure ship's); the captain's iron #${alive.captain.iron}, her banner ${alive.captain.banner} triangles; the treasure ship's ${alive.treasure.glints} glints on her #${alive.treasure.gold} gold`);
  if (!(alive.fold.aft >= 2.5) || !(alive.fold.changed > 0.02) || alive.fold.calls[0] !== alive.fold.calls[1] || alive.fold.programs[1] > alive.fold.programs[0] || !(Math.abs(alive.fold.fired - 2.6) < 0.01)) problems.push(`${name}: the ships demo's Sails in should fold her wings back, and Fire! fire her guns, with no more draws or shaders: ${JSON.stringify(alive.fold)}`);
  if (P.crew !== P.yours || P.captain !== P.yours || P.treasure !== P.yours) problems.push(`${name}: a ship in any colours should need no new shaders: ${JSON.stringify(P)}`);
  if (alive.captain.iron !== '2c2a2e' || !(alive.captain.banner >= 30)) problems.push(`${name}: a raider captain's ship should have black iron fittings and a banner: ${JSON.stringify(alive.captain)}`);
  if (!(alive.treasure.glints >= 30) || alive.treasure.gold !== 'ffcf4a') problems.push(`${name}: a treasure ship should glint with gold: ${JSON.stringify(alive.treasure)}`);
  // on a phone, the ships demo keeps no more than two sets of ships: all six at full detail shown in each colours in
  // turn (the graphics card's count of shapes once each is drawn) hold the Captain's set and one other at most, and
  // back in the Captain's colours just hers
  if (name === 'phone') {
    const sets = await page.evaluate(() => {
      const H = window.__hangar, r = H.renderer, held = (l) => { if (l) H.livery(l); r.render(H.scene, H.camera); return r.info.memory.geometries; };
      H.level('full'); H.select('all');
      const out = { yours: held() };
      for (const l of ['crew', 'captain', 'treasure']) out[l] = held(l);
      out.back = held('yours'); H.select('brig');
      return out;
    });
    const one = sets.crew - sets.yours;
    console.log(`${name}: all six at full detail hold ${sets.yours} shapes on the graphics card in the Captain's colours, ${sets.crew}, ${sets.captain} and ${sets.treasure} in a raider's, a captain's and a treasure ship's in turn, and ${sets.back} back in hers`);
    if (!(one > 50) || sets.captain > sets.yours + one * 1.2 || sets.treasure > sets.yours + one * 1.2 || sets.back > sets.yours + 2) problems.push(`${name}: the ships demo should let the ships built in other colours go, holding two sets of six at most: ${JSON.stringify(sets)}`);
  }
  await page.close();
}
// the ships demo on a phone held sideways: its buttons on short lines, all on the screen and taking no more than 55% of
// its height, so the ship shows above them; the stats folded away at first, and clear of the buttons once brought out.
// As she turns in the Turn view (every 30 degrees round her), all of her shows: her keel and ram tip above the buttons,
// her mast heads on the screen (every corner of her pieces, as drawn: the lowest and highest on the screen), both as the
// page first opens (nothing touched) and once she's picked again
const turning = (page) => page.evaluate(() => {
  const H = window.__hangar, S = H.shown[0], V = H.camera.position.constructor, v = new V(), dock = document.getElementById('dock').getBoundingClientRect().top, out = { dock: Math.round(dock), low: -Infinity, high: Infinity, at: 0, dist: +H.state.dist.toFixed(1) };
  for (let k = 0; k < 12; k++) {
    H.view('turn', k * Math.PI / 6, 0.3); H.step(0.05); H.place();
    let low = -Infinity, high = Infinity;
    S.body.traverse((o) => {
      if (!o.isMesh || !o.visible) return;
      const P = o.geometry.attributes.position;
      for (let i = 0; i < P.count; i++) { const y = (1 - v.fromBufferAttribute(P, i).applyMatrix4(o.matrixWorld).project(H.camera).y) / 2 * innerHeight; low = Math.max(low, y); high = Math.min(high, y); }
    });
    if (low > out.low) { out.low = Math.round(low); out.at = k * 30; }
    out.high = Math.min(out.high, Math.round(high));
  }
  H.view('turn', 0.9, 0.3); H.draw();
  return out;
});
if (!quick) {
  const page = await hangar('sideways');
  const first = await turning(page);
  await page.evaluate(() => { const H = window.__hangar; H.select('brig'); H.level('full'); H.wear('battered'); H.view('turn', 0.9, 0.3); });
  await drawn(page);
  const lay = await page.evaluate(() => {
    const b = document.getElementById('dock').getBoundingClientRect(), dock = { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right) };
    return { dock, share: +(b.height / innerHeight).toFixed(2), folded: document.getElementById('card').hidden, w: innerWidth, h: innerHeight };
  });
  await shot(page, 'sideways-brig-battered');
  const card = await page.evaluate(() => {
    document.getElementById('btn-card').click();
    const c = document.getElementById('card').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect();
    return { bottom: Math.round(c.bottom), dock: Math.round(d.top), shown: !document.getElementById('card').hidden };
  });
  await drawn(page);
  await shot(page, 'sideways-brig-stats');
  await page.evaluate(() => document.getElementById('btn-card').click());
  const turned = await turning(page);
  console.log(`the ships demo on a phone held sideways (${lay.w} by ${lay.h}): its buttons take ${Math.round(lay.share * 100)}% of the height (${lay.dock.top} to ${lay.dock.bottom} px), the stats ${lay.folded ? 'folded away' : 'OUT'} at first and ending at ${card.bottom} px once brought out, above the buttons at ${card.dock} px; turning, the Brig reaches down to ${first.low} px as the page opens (turned ${first.at}°, ${first.dist} m off) and ${turned.low} px once picked again (turned ${turned.at}°, ${turned.dist} m off), above the buttons at ${turned.dock} px, and up to ${Math.min(first.high, turned.high)} px`);
  for (const [when, T] of [['as the page opens', first], ['once she\'s picked', turned]]) if (!(T.low <= T.dock) || T.high < 0) problems.push(`the ships demo on a phone held sideways should show all of the ship as she turns (${when}), her keel and ram above the buttons and her mast heads on the screen: ${JSON.stringify(T)}`);
  if (!(lay.share <= 0.55) || lay.dock.top < 0 || lay.dock.bottom > lay.h || lay.dock.left < 0 || lay.dock.right > lay.w) problems.push(`the ships demo's buttons on a phone held sideways should fit on the screen in 55% of its height: ${JSON.stringify(lay)}`);
  if (!lay.folded || !card.shown || card.bottom > card.dock) problems.push(`the ships demo's stats on a phone held sideways should start folded away, and come out clear of the buttons: ${JSON.stringify({ lay, card })}`);
  await page.close();
}

// ---------- the game ----------
const gameReady = () => window.__game?.ready || !document.getElementById('error').hidden;
// nothing on the screen lands on anything else (at sea in the Brig, at the page's size now): in a battle with the toast,
// a warning and the banner (or the region's name, which shares its place) all showing at once, with their longest
// words; the raiders' tags pinned at the screen's edge clear of the panels (`PANELS`), the guns' label among them; and
// between waves, the card too, once it has risen into view. Then: the pause card over the card between waves, and over
// the big map (which it closes), with its buttons the ones pressed; the panels the edge tags keep clear of measured
// again when the card goes (a window turned while it was up); the big map fitting the screen with its cross, and the
// regions' names on it big enough to read (11 of the page's pixels or more) and none of them on (or touching) another.
// The edge tags are measured with their arrows, and again with every raider off the screen readying her broadside (each
// tag taller, saying "Broadside!", with a bigger arrow). `sink`: and the ship going down with the big map open, its card
// over everything
const layoutAt = (page, HUD, PANELS, sink = false) => page.evaluate(({ HUD, PANELS, sink }) => {
  const g = window.__game, $ = (id) => document.getElementById(id), out = { laps: [], tags: [], off: [], pause: [] };
  const box = (id) => { const el = $(id); if (!el || el.hidden || getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden') return null; const b = el.getBoundingClientRect(); return b.width && b.height ? b : null; };
  const lap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
  const look = (ids, what) => {
    const B = ids.map((id) => [id, box(id)]).filter(([, b]) => b);
    for (const [id, b] of B) if (b.left < -1 || b.top < -1 || b.right > innerWidth + 1 || b.bottom > innerHeight + 1) out.off.push(`${what}: ${id}`);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) if (lap(B[i][1], B[j][1])) out.laps.push(`${what}: ${B[i][0]} x ${B[j][0]}`);
  };
  // (the pause card on top: its corners and its buttons are what a press there finds)
  const onTop = (what) => {
    const c = document.querySelector('#paused .card').getBoundingClientRect(), r = $('btn-abandon').getBoundingClientRect();
    const at = [[c.left + 4, c.top + 4], [c.right - 4, c.top + 4], [c.left + 4, c.bottom - 4], [c.right - 4, c.bottom - 4], [(r.left + r.right) / 2, (r.top + r.bottom) / 2]];
    const hit = at.map(([x, y]) => document.elementFromPoint(x, y));
    if (hit.some((el) => !el?.closest('#paused .card'))) out.pause.push(`${what}: ${hit.map((el) => el?.id || el?.className || el?.tagName).join(', ')}`);
    if (!hit[4]?.closest('#btn-abandon')) out.pause.push(`${what}: its button is under ${hit[4]?.id || hit[4]?.tagName}`);
  };
  g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); P.pos.set(2000, 900, 1500); P.heading = 0.6;
  const f = P.forward(), s = { x: Math.cos(0.6), y: 0, z: -Math.sin(0.6) };
  // one raider ahead (locked on), and eight all round off the screen
  g.raiders.spawn('frigate', P.pos.clone().addScaledVector(f, 260), P.heading + 2, true, true);
  for (const [a, b, up] of [[-1, 0, 0], [0, -1, 0], [0, 1, 0], [0.5, -0.8, 500], [0.5, 0.8, 500], [0.6, 0, 700], [0.6, 0, -600], [0.5, -0.8, -450], [0.5, 0.8, -450]]) {
    g.raiders.spawn('cutter', P.pos.clone().addScaledVector(f, a * 400).addScaledVector(s, b * 400).add({ x: 0, y: up, z: 0 }), P.heading, true);
  }
  g.cam.yaw = 0; g.cam.pitch = 0.15; g.step(0.2, {});
  const say = { toast: 'The captain\'s Frigate is sinking! Fly through her shards', warn: 'Nearing the Thinning: the crystals can\'t lift you higher', 'region-name': 'The Sunscorch Wastes', 'region-air': 'Cold, clear air, and snow on the wind', 'banner-title': 'Wave 10: a raider captain', 'banner-line': 'a Frigate and two Cutters, behind you on your right · a wind from your right' };
  for (const [id, t] of Object.entries(say)) $(id).textContent = t;
  $('warn').hidden = false;
  look(HUD.filter((id) => id !== 'region' && id !== 'calm'), 'a battle');
  look(HUD.filter((id) => id !== 'banner' && id !== 'calm'), 'a battle, with the region\'s name');
  const panels = PANELS.map((id) => [id, box(id)]).filter(([, b]) => b);
  const tagsClear = (what) => {
    for (const t of document.querySelectorAll('#tags .tag.edge')) {
      const w = t.querySelector('.arrow'), parts = [['', t.getBoundingClientRect()], ...(getComputedStyle(w).display !== 'none' ? [['its arrow ', w.getBoundingClientRect()]] : [])];
      for (const [bit, a] of parts) for (const [id, b] of panels) if (lap(a, b)) out.tags.push(`${what}${bit}${t.querySelector('b').textContent} at ${Math.round(a.left)},${Math.round(a.top)} x ${id}`);
    }
  };
  tagsClear('');
  out.edgeTags = document.querySelectorAll('#tags .tag.edge').length;
  // (every raider readying her broadside: placed again as things stand, twice, as the first measures a warning's height)
  for (const r of g.raiders.list) r.charge.b = 'port';
  g.placeTags(); g.placeTags();
  out.warnTags = document.querySelectorAll('#tags .tag.edge.warn').length;
  tagsClear('readying a broadside: ');
  // tags at the edge never on each other (on a phone held sideways the panels leave room down the side for a tag or
  // two, so the rest go beside them): as things stand, every raider readying her broadside, the view swung all round
  // her in 12 steps (half of them readying broadsides), and three raiders behind her on the right with the view swung
  // to her left, as in a big ship's broadside (the gate's case: the three tags used to land in one place)
  const tagLaps = (what) => {
    const T = [...document.querySelectorAll('#tags .tag.edge')].map((t) => [t.querySelector('b').textContent, t.getBoundingClientRect()]);
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) if (lap(T[i][1], T[j][1])) out.tagLaps.push(`${what}${T[i][0]} at ${Math.round(T[i][1].left)},${Math.round(T[i][1].top)} x ${T[j][0]} at ${Math.round(T[j][1].left)},${Math.round(T[j][1].top)}`);
  };
  out.tagLaps = [];
  tagLaps('readying a broadside: ');
  for (const r of g.raiders.list) r.charge.b = null;
  g.placeTags(); tagLaps('');
  for (let k = 1; k < 12; k++) {
    g.cam.yaw = k * Math.PI / 6; g.cam.pitch = 0.15 - (k % 3) * 0.12; g.raiders.list.forEach((r, i) => { r.charge.b = (i + k) % 2 ? 'port' : null; });
    g.step(1 / 60, {}); g.placeTags(); g.placeTags(); tagLaps(`the view swung ${k * 30}°: `);
  }
  for (const r of g.raiders.list) r.charge.b = null;
  g.raiders.clear(); P.speed = 0;
  for (const [id, d] of [['manowar', 700], ['frigate', 450], ['brig', 330]]) g.raiders.spawn(id, P.pos.clone().addScaledVector(f, -d).addScaledVector(s, 300), P.heading, true);
  g.raiders.spawn('cutter', P.pos.clone().addScaledVector(s, -420), P.heading, true);
  g.cam.yaw = -Math.PI / 2; g.cam.pitch = 0.05; g.step(1 / 60, {}); g.placeTags(); g.placeTags(); tagLaps('three behind her: ');
  out.behindTags = document.querySelectorAll('#tags .tag.edge').length;
  g.cam.yaw = 0; g.cam.pitch = 0.15; g.placeTags();
  // between waves: the card risen into view (its rising finished), then looked at with the rest
  g.raiders.clear(); Object.assign(g.waves, { n: 2, state: 'fight', next: null }); g.step(0.15, {}); $('toast').textContent = say.toast;
  $('calm').getAnimations().forEach((a) => a.finish());
  out.calm = !!box('calm');
  look(HUD.filter((id) => id !== 'region' && id !== 'banner'), 'between waves');
  out.wave = [$('wave-n').textContent, /\d+/.exec($('calm-title').textContent)?.[0]]; // (the wave just beaten, as the card says)
  g.pause(true); onTop('paused between waves'); g.pause(false);
  // the window changing while the card is up (its panels measured without the guns' label), then Sail on: the label
  // back, and kept clear of again
  g.layout(); g.sailOn();
  const gb = box('battery'), E = g.edge;
  out.battery = !gb || [...E.top, ...E.bottom].some((e) => Math.abs(e.l - gb.left) < 1 && Math.abs(e.t - gb.top) < 1);
  // the big map
  $('minimap').click(); g.step(0.05, {});
  const m = $('minimap').getBoundingClientRect(), x = $('map-close').getBoundingClientRect();
  out.map = m.left >= 0 && m.top >= 0 && m.right <= innerWidth && m.bottom <= innerHeight && x.left >= m.left && x.right <= m.right && x.top >= m.top && x.bottom <= m.bottom;
  const mc = $('minimap'), font = +(/(\d+(\.\d+)?)px/.exec(mc.getContext('2d').font)?.[1] ?? 0);
  out.names = +(font / (mc.width / mc.clientWidth)).toFixed(1);
  // (how near the two closest names come, in the page's pixels: the gap between their boxes, across or up and down)
  const N = g.mapNames;
  out.nameGap = Infinity;
  for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
    const a = N[i], b = N[j], gap = Math.max(Math.abs(a.x - b.x) - (a.w + b.w) / 2, Math.abs(a.y - b.y) - (a.h + b.h) / 2) / (mc.width / mc.clientWidth);
    if (gap < out.nameGap) { out.nameGap = +gap.toFixed(1); out.nearest = `${a.name} and ${b.name}`; }
  }
  g.pause(true); out.mapClosed = !mc.classList.contains('big') && $('map-dim').hidden; onTop('paused with the big map open'); g.pause(false);
  if (mc.classList.contains('big')) $('map-close').click();
  if (sink) {
    // her ship going down with the big map open: the card that says so, over everything
    mc.click(); g.step(0.05, {}); P.hit('hull', 1e9); g.step(5, {});
    out.sunk = g.waves.sunk; out.sunkMapClosed = !mc.classList.contains('big');
    if (out.sunk) onTop('her ship gone down with the big map open');
  }
  $('warn').hidden = true; g.raiders.clear();
  return out;
}, { HUD, PANELS, sink });
// what layoutAt found, as problems
function layoutProblems(L, where) {
  if (L.laps.length || L.off.length) problems.push(`${where}: the HUD's pieces land on each other or off the screen: ${[...L.laps, ...L.off].join('; ')}`);
  if (L.tags.length) problems.push(`${where}: raiders' tags at the edge (or their arrows) land on the panels: ${L.tags.join('; ')}`);
  if (L.tagLaps.length || L.behindTags < 3) problems.push(`${where}: raiders' tags at the edge should never land on each other (${L.behindTags} of 3 raiders behind her at the edge): ${L.tagLaps.slice(0, 6).join('; ')}`);
  if (!L.calm || L.edgeTags < 5 || L.warnTags < 5 || !L.map) problems.push(`${where}: the layout test didn't run as it should (the card between waves never in view, too few edge tags, or the big map not fitting): ${JSON.stringify({ calm: L.calm, edgeTags: L.edgeTags, map: L.map })}`);
  if (L.pause.length || !L.mapClosed) problems.push(`${where}: the pause card should lie over everything at sea (and close the big map): ${[...L.pause, L.mapClosed ? '' : 'the big map still open'].filter(Boolean).join('; ')}`);
  if (!L.battery) problems.push(`${where}: after the card between waves went (the window changed while it was up), the edge tags no longer keep clear of the guns' label`);
  if (!(L.names >= 10.9)) problems.push(`${where}: the big map's names are too small to read (${L.names} px)`);
  if (!(L.nameGap >= 2.5)) problems.push(`${where}: the big map's names ${L.nearest} land on or touch each other (${L.nameGap} px apart)`);
  if (L.wave[0] !== L.wave[1]) problems.push(`${where}: between waves the score should say the wave just beaten, as the card does (Wave ${L.wave[1]}), not Wave ${L.wave[0]}`);
  if ('sunk' in L && (!L.sunk || !L.sunkMapClosed)) problems.push(`${where}: her ship going down with the big map open should close it and show its card on top: ${JSON.stringify({ sunk: L.sunk, closed: L.sunkMapClosed })}`);
  return `${L.laps.length + L.off.length + L.tags.length + L.pause.length + L.tagLaps.length ? `${L.laps.length + L.off.length} overlaps, ${L.tags.length} tags on panels, ${L.tagLaps.length} tags on tags, ${L.pause.length} under the pause card` : 'all clear'} (${L.edgeTags} tags at the edge, ${L.warnTags} of them saying "Broadside!" in turn, none on another in 13 views and with three raiders behind her; the map's names ${L.names} px, ${L.nameGap} px apart at the closest)`;
}
// a raider's bounty and the card between waves (at the page's size now): the wave's last raider brought down right where
// the card will rise (her bounty would rise over its words), and the bounty looked at every 0.1 s while it can be read
// (over half opaque), with the card risen at once (its rising runs on the page's own clock): never on the card
const bountyCard = (page) => page.evaluate(() => {
  const g = window.__game, $ = (id) => document.getElementById(id), calm = $('calm'), risen = () => calm.getAnimations().forEach((a) => a.finish());
  const lap = (a, c) => a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1;
  g.fly('brig'); const P = g.player; g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); P.pos.set(2000, 900, 1500); P.heading = 0.6; P.speed = 3; P.sail = 0.05;
  g.cam.yaw = 0; g.cam.pitch = 0.15;
  // where the card sits, shown once
  Object.assign(g.waves, { n: 2, state: 'fight', next: null }); g.step(0.15, {}); risen();
  const c = calm.getBoundingClientRect(); g.sailOn(); g.waves.timer = 1e9; g.step(0.05, {});
  const V = P.pos.constructor, x = (c.left + c.right) / 2, y = (c.top + c.bottom) / 2;
  const at = new V((x / innerWidth) * 2 - 1, 1 - (2 * y) / innerHeight, 0.5).unproject(g.camera).sub(g.camera.position).normalize().multiplyScalar(260).add(g.camera.position);
  const r = g.raiders.spawn('cutter', at, Math.PI / 2, true);
  r.f.pos.y -= 2 + r.R.length * 0.3; r.ship.root.position.copy(r.f.pos); // (so her bounty starts in the card's middle)
  g.waves.state = 'fight'; g.step(0.05, {});
  r.f.hit('hull', 1e9);
  const out = { seen: 0, over: [], card: false };
  for (let t = 0.1; t < 2.2; t += 0.1) {
    g.step(0.1, {}); risen();
    const b = [...document.querySelectorAll('#bounties .bounty')].find((e) => !e.hidden);
    if (calm.hidden || !b || +b.style.opacity <= 0.5) continue;
    out.card = true; out.seen++;
    if (lap(b.getBoundingClientRect(), calm.getBoundingClientRect())) out.over.push(+t.toFixed(1));
  }
  g.sailOn(); g.raiders.clear();
  return out;
});
function bountyProblems(B, where) {
  if (!B.card || B.seen < 8 || B.over.length) problems.push(`${where}: a bounty rising where the card between waves comes up should keep clear of it all the while it can be read: ${JSON.stringify(B)}`);
  return B.over.length ? `ON THE CARD at ${B.over.join(', ')} s` : `clear of the card (looked at ${B.seen} times)`;
}
// the title screen at one size (w x h), for a Captain back from the sea with shards to spend and the Frigate's name
// the Galleon and the Man-o'-war bought and sailed with the port's own buttons (`press`: a click on a laptop, a tap on a
// phone): first the Man-o'-war, sold only to a Captain who owns the Galleon: her Buy button says so and buys nothing,
// even pressed; then each one's Buy button and price, on one line (the price never broken from its "◆"), the line under
// it saying what owning her brings, her plain-words turning (the Captain's helm: quicker than a raider's) and firepower
// (the Galleon's very heavy, the Man-o'-war's fearsome), her first upgrade step's price, and the port's note as she's
// bought; set sail in her; the view behind her with all of her on the screen (her stern too) and a
// raider coming in 1.6 km ahead clear above her mast heads; her port broadside at a raider 420 m off: its label and gun
// count (both decks), locked on, rippling bow to stern within 0.6 s (the first gun at once), heeling her to starboard,
// kicking the view back (but not wildly), hitting, and reloading in the Captain's 2.6 s; pictures at sea and of the
// broadside. The save is put back after
async function bigTwoAt(page, name, press) {
  const res = {};
  const was = await page.evaluate(() => {
    const g = window.__game, d = g.progress.data;
    if (g.mode === 'voyage') g.endVoyage(0);
    const was = { shards: d.shards, flying: d.flying, voyages: d.voyages, skies: d.skies, galleon: d.ships.galleon.owned, manowar: d.ships.manowar.owned, sailed: g.settings.data.voyages };
    Object.assign(d, { shards: 42500, voyages: Math.max(3, d.voyages), skies: 'cross' }); d.ships.galleon.owned = d.ships.manowar.owned = false;
    g.port.setMode('port'); g.port.refresh();
    return was;
  });
  await press('#port-ships [data-ship="manowar"]');
  res.locked = await page.evaluate(() => {
    const g = window.__game, d = g.progress.data, b = document.getElementById('btn-buy'), had = d.shards;
    const out = { buy: b.textContent, disabled: b.disabled, need: document.getElementById('pp-need').textContent };
    b.disabled = false; b.click(); g.port.refresh(); // (the button's own guard, were it ever pressed)
    out.bought = d.ships.manowar.owned || d.shards !== had;
    return out;
  });
  for (const [id, wave, price, step] of [['galleon', 5, 12000, 420], ['manowar', 11, 30000, 600]]) {
    await press(`#port-ships [data-ship="${id}"]`);
    const shown = await page.evaluate(() => {
      const b = document.getElementById('btn-buy'), rg = document.createRange(); rg.selectNodeContents(b.firstElementChild);
      return { buy: b.textContent, lines: new Set([...rg.getClientRects()].map((r) => Math.round(r.top))).size, need: document.getElementById('pp-need').textContent,
        turn: document.querySelector('[data-stat="turn"] b').textContent, fire: document.querySelector('[data-stat="firepower"] b').textContent, shards: window.__game.progress.data.shards };
    });
    await press('#btn-buy');
    const bought = await page.evaluate(() => { const d = window.__game.progress.data; return { flying: d.flying, shards: d.shards, step: document.querySelector('.mod[data-mod="armour"] button').textContent, note: document.getElementById('port-note').textContent }; });
    if (name !== 'laptop') await press('#pp-tab-ship'); // (on a phone, the button to sail is under either tab)
    await press('#btn-sail');
    const sea = await page.evaluate(([id, wave]) => {
      const g = window.__game, P = g.player, V = P.pos.constructor;
      g.wind.strength = 0; g.raiders.setAI(false);
      Object.assign(g.waves, { n: wave, state: 'calm', timer: 0.05, next: null }); g.step(0.2, {});
      g.cam.yaw = 0; g.cam.pitch = 0.2; g.step(1 / 60, {});
      // all of her on the screen (every third corner of her model, as it sits), and a raider 1.6 km ahead at her height
      // clear above her
      const c = new V(), box = [1, -1, 1, -1];
      P.ship.body.updateMatrixWorld(true);
      P.ship.body.traverse((o) => {
        if (!o.isMesh || o.isInstancedMesh || !o.visible) return;
        const a = o.geometry.attributes.position;
        for (let i = 0; i < a.count; i += 3) { c.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld).project(g.camera); box[0] = Math.min(box[0], c.x); box[1] = Math.max(box[1], c.x); box[2] = Math.min(box[2], c.y); box[3] = Math.max(box[3], c.y); }
      });
      const far = P.pos.clone().addScaledVector(P.forward(), 1600).project(g.camera);
      return { mode: g.mode, ship: P.ship.recipe.id, dist: Math.round(g.cam.dist), raiders: g.raiders.list.map((r) => r.id + (r.role === 'prize' ? ' (treasure)' : '')).join(' '),
        x: box.slice(0, 2).map((v) => +v.toFixed(2)), y: box.slice(2).map((v) => +v.toFixed(2)), far: +far.y.toFixed(2) };
    }, [id, wave]);
    await drawnAtSea(page);
    await shot(page, `${name}-${id}-sea`);
    const guns = await page.evaluate(() => {
      const g = window.__game, P = g.player; g.raiders.clear(); g.waves.timer = 1e9;
      // (her, the Frigate 420 m off her left and the view behind her on the right all in clear air: she starts a voyage
      // clear of the big clouds, but a raider deep in one off her side can't be locked on to, about one time in twenty)
      const side = P.heading + Math.PI / 2, abeam = (d) => P.pos.clone().add({ x: Math.sin(side) * d, y: 20, z: Math.cos(side) * d });
      for (let k = 0; k < 30 && [0, 420, -110].some((d) => g.sky.cloudAt(abeam(d)) > 0); k++) P.pos.addScaledVector(P.forward(), 250);
      const foe = g.raiders.spawn('frigate', P.pos.clone().add({ x: Math.sin(side) * 420, y: 0, z: Math.cos(side) * 420 }), P.heading, true);
      for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
      g.cam.yaw = Math.PI / 2; g.cam.pitch = 0.05; g.step(0.1, {});
      const label = document.getElementById('battery-name').textContent, count = document.getElementById('battery-count').textContent, locked = g.locked === foe;
      const fired = [], t0 = g.time; let kick = 0, heel = 0;
      const off = g.events.on('fire', (e) => { if (e.owner === 'player' && e.battery === 'port') fired.push(+(g.time - t0).toFixed(3)); });
      g.step(1 / 60, { fire: true });
      for (let i = 0; i < 60; i++) { g.step(1 / 60, {}); kick = Math.max(kick, g.fx.cam.back); heel = Math.max(heel, P.heel); }
      off();
      const reload = g.gunnery.reload('port');
      g.step(4, { fire: true });
      return { label, count, locked, fired: fired.length, first: fired[0], span: fired.length ? +(fired.at(-1) - fired[0]).toFixed(3) : -1, kick: +kick.toFixed(2), heel: +heel.toFixed(3), reload: +reload.toFixed(2),
        hit: ['hull', 'sails', 'crystals'].filter((k) => foe.f.health[k] < foe.f.full[k]) };
    });
    await drawnAtSea(page);
    await shot(page, `${name}-${id}-broadside`);
    await page.evaluate(() => window.__game.endVoyage(1));
    res[id] = { ...shown, ...bought, ...sea, ...guns, price, step: bought.step, want: { price, step, wave } };
    res[id].paid = shown.shards - bought.shards;
  }
  await page.evaluate((was) => {
    const g = window.__game, d = g.progress.data;
    Object.assign(d, { shards: was.shards, flying: was.flying, voyages: was.voyages, skies: was.skies }); d.ships.galleon.owned = was.galleon; d.ships.manowar.owned = was.manowar;
    g.port.show(was.flying); g.progress.save(); g.settings.keep('voyages', was.sailed); // (this device's voyages, for the keys and the hint)
  }, was);
  return res;
}
// the sea drawn as it stands, for a picture: the dip through the night as a voyage starts over, and two frames drawn
// (in software, the first frame of a ship new to the sky can take a while: her shaders made)
const drawnAtSea = (page) => page.waitForFunction(() => !document.getElementById('veil').getAnimations().length, null, { timeout: 60000 }).catch(() => {})
  .then(() => page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok())))));
// what's wrong with the big two bought and sailed (bigTwoAt), in words for the log
function bigTwoProblems({ locked, ...res }, name) {
  const words = [], GUNS = { galleon: 16, manowar: 24 }, NAMES = { galleon: 'Doldrums', manowar: 'Thunderhead' }, TURN = { galleon: 36, manowar: 40 }, FIRE = { galleon: 'very heavy', manowar: 'fearsome' };
  const OWNING = { galleon: 'Once she\'s yours, the treasure ships you meet are Galleons.', manowar: 'Once she\'s yours, raiders sail Men-o\'-war too.' };
  const NOTE = { galleon: 'The Doldrums is yours: from now on, the treasure ships are Galleons', manowar: 'The Thunderhead is yours: from now on, raiders sail Men-o\'-war too' };
  words.push(`before the Galleon, the Thunderhead's button "${locked.buy}" (${locked.disabled ? 'not to be pressed' : 'PRESSABLE'}, "${locked.need}"), ${locked.bought ? 'BOUGHT' : 'buying nothing'} even pressed`);
  if (locked.buy !== 'Buy the Doldrums first' || !locked.disabled || locked.bought || !locked.need.startsWith('The port sells her once you own the Doldrums.')) problems.push(`${name}: the Man-o'-war should be sold only once the Galleon is owned, her Buy button saying so and buying nothing: ${JSON.stringify(locked)}`);
  for (const [id, r] of Object.entries(res)) {
    words.push(`the ${NAMES[id]}: "${r.buy}" on ${r.lines} line(s) ("${r.need}"), ${r.paid === r.want.price ? 'bought' : `PAID ${r.paid}`} ("${r.note}"), "${r.turn}", firepower ${r.fire}, upgrades from ${r.step}; at sea in the ${r.ship} (${r.raiders}), the view ${r.dist} m back, her on the screen from ${r.x.join(' to ')} across and ${r.y.join(' to ')} up, a raider 1.6 km ahead at ${r.far}; "${r.label} · ${r.count}" ${r.locked ? 'locked on' : 'NOT LOCKED'}, ${r.fired} guns in ${r.span} s (the first at ${r.first} s), heeling ${r.heel} rad, the view kicked back ${r.kick} m, reloading in ${r.reload} s, hitting ${r.hit.join('+') || 'NOTHING'}`);
    if (r.buy !== `Buy the ${NAMES[id]} · ◆ ${r.want.price.toLocaleString('en')}` || r.paid !== r.want.price || r.flying !== id || r.step !== `◆ ${r.want.step}`) problems.push(`${name}: the ${NAMES[id]} should be bought for ◆ ${r.want.price.toLocaleString('en')} with her Buy button, her upgrades from ◆ ${r.want.step}: ${JSON.stringify(r)}`);
    if (r.turn !== `a full circle in ${TURN[id]} s`) problems.push(`${name}: the Captain's ${NAMES[id]} should turn a full circle in ${TURN[id]} s (her helm): "${r.turn}"`);
    if (r.lines !== 1 || r.need !== OWNING[id] || r.note !== NOTE[id] || r.fire !== FIRE[id]) problems.push(`${name}: the ${NAMES[id]}'s Buy button should be on one line, the line under it and the port's note as she's bought should say what owning her brings, and her firepower should read "${FIRE[id]}": ${JSON.stringify({ lines: r.lines, need: r.need, note: r.note, fire: r.fire })}`);
    if (r.mode !== 'voyage' || r.ship !== id || !r.raiders.includes(id)) problems.push(`${name}: Set sail should take the ${NAMES[id]} to sea, and owning her, she should meet her own class among the raiders: ${JSON.stringify(r)}`);
    if (r.x[0] < -1 || r.x[1] > 1 || r.y[0] < -1 || r.y[1] > 1 || !(r.far > r.y[1] + 0.05)) problems.push(`${name}: the view behind the ${NAMES[id]} should show all of her, her stern too, with a raider ahead clear above her masts: ${JSON.stringify({ x: r.x, y: r.y, far: r.far })}`);
    if (r.label !== 'Port broadside' || r.count !== `${GUNS[id]} guns` || !r.locked) problems.push(`${name}: the ${NAMES[id]}'s port broadside should say "${GUNS[id]} guns" and lock on: ${JSON.stringify(r)}`);
    if (r.fired !== GUNS[id] || !(r.first < 0.02) || !(r.span > 0.3 && r.span <= 0.6) || !(r.heel > 0.005) || !(r.kick > 0.5 && r.kick < 4) || Math.abs(r.reload - 2.6) > 0.01 || !r.hit.length) problems.push(`${name}: the ${NAMES[id]}'s broadside should ripple all ${GUNS[id]} guns within 0.6 s, heel her, kick the view (not wildly), hit, and reload in 2.6 s: ${JSON.stringify(r)}`);
  }
  return words.join('; ');
}
// on the big button: five minutes of its clock (a frame every half second): how much of the time a raider is in sight
// clear of the title's card (on a phone held upright, that's above the panel), how long they look on the screen (the
// middle of their lengths, in the page's pixels), how high over the horizon (the middle of their heights over it, in the
// page's pixels), how far each one is turned from side-on to the line of sight to her (the least, the tenth of the way
// up and the most, in degrees: about 30, so her sails show; side-on, square sails lie edge-on), how many times one in
// sight was seen moving across the view stern first (none: she sails bow first, whichever way she's turned), how many
// goes each takes to draw (one), and how many times her ship (the Frigate, long) lies under the card; and the card: all
// of it on the screen without scrolling, and how many lines the game's name takes and whether the opening line shows.
// Her ship and the save are put back after
async function titleAt(page, w, h) {
  await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
  return page.evaluate(() => {
    const g = window.__game, d = g.progress.data, T = g.title, el = document.getElementById('title'), out = { size: `${innerWidth}x${innerHeight}` };
    if (g.mode === 'voyage') g.endVoyage(0);
    const was = { flying: d.flying, voyages: d.voyages, shards: d.shards, owned: d.ships.frigate.owned };
    Object.assign(d, { voyages: Math.max(1, d.voyages), shards: 1234, flying: 'frigate' }); d.ships.frigate.owned = true;
    g.port.setMode('port'); g.port.setMode('title'); T.resize();
    const card = el.querySelector('.title-card').getBoundingClientRect(), h1 = el.querySelector('h1');
    out.fits = el.scrollHeight <= el.clientHeight + 1 && card.bottom <= innerHeight + 1;
    out.name = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
    out.opening = el.querySelector('.lede').offsetHeight > 0;
    const V = T.camera.position.constructor, v = new V(), px = [], S = T.ship, b = S.bounds;
    const at = (p) => { v.copy(p).project(T.camera); return [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight, v.z]; };
    const behind = (x, y) => x > card.left && x < card.right && y > card.top && y < card.bottom;
    let seen = 0; out.under = 0; out.pieces = 0; out.astern = 0;
    const lift = [], m = T.camera.matrixWorld.elements, horizon = new V(), los = new V(), bow = new V(), rel = new V(), angles = [], last = new Map();
    for (let i = 0; i < 600; i++) {
      T.update(0.5);
      let k = 0;
      // (the horizon: far off at the eye's height, straight ahead)
      horizon.set(-m[8], 0, -m[10]).normalize().multiplyScalar(30000).add(T.camera.position);
      const hy = at(horizon)[1];
      for (const r of T.raiders) {
        const [x, y, z] = at(r.root.position);
        if (z < 1 && x > 0 && x < innerWidth && y > 0 && y < innerHeight && !behind(x, y)) {
          k++; px.push((r.recipe.length / T.camera.position.distanceTo(r.root.position)) * innerHeight * T.camera.projectionMatrix.elements[5] / 2);
          lift.push(hy - y);
          // (how far she's turned from side-on to the line of sight to her, along the ground; and, in the camera's own
          // frame, whether she moved across the view since the last look the way her bow points)
          const a = r.root.rotation.y;
          bow.set(Math.sin(a), 0, Math.cos(a)); los.copy(r.root.position).sub(T.camera.position).setY(0).normalize();
          angles.push((Math.asin(Math.min(1, Math.abs(bow.dot(los)))) * 180) / Math.PI);
          rel.copy(r.root.position).applyMatrix4(T.camera.matrixWorldInverse); bow.transformDirection(T.camera.matrixWorldInverse);
          const before = last.get(r), dx = before && i - before.i === 1 && rel.distanceTo(before.at) < 40 ? rel.x - before.at.x : 0;
          if (Math.abs(dx) > 0.2 && dx * bow.x < 0) out.astern++;
          last.set(r, { i, at: rel.clone() });
          let n = 0; r.root.traverse((o) => { if (o.isMesh && o.visible) n++; }); out.pieces = Math.max(out.pieces, n);
        }
      }
      if (k) seen++;
      if (i % 10) continue;
      S.root.updateMatrixWorld(true);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let c = 0; c < 8; c++) {
        const [x, y] = at(new V(c & 1 ? b.max.x : b.min.x, c & 2 ? b.max.y : b.min.y, c & 4 ? b.max.z : b.min.z).applyMatrix4(S.root.matrixWorld));
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      if (x0 < card.right && x1 > card.left && y0 < card.bottom && y1 > card.top) out.under++;
    }
    px.sort((a, c) => a - c); lift.sort((a, c) => a - c);
    out.seen = +(seen / 600).toFixed(2); out.long = Math.round(px[px.length >> 1] ?? 0); out.ship = S.recipe.name;
    out.lift = Math.round(lift[lift.length >> 1] ?? 0); angles.sort((a, c) => a - c);
    out.angle = angles.length ? [angles[0], angles[Math.floor(angles.length / 10)], angles.at(-1)].map(Math.round) : [];
    Object.assign(d, { flying: was.flying, voyages: was.voyages, shards: was.shards }); d.ships.frigate.owned = was.owned;
    g.port.setMode('port'); g.port.setMode('title');
    return out;
  });
}
// what titleAt found, as problems (`raiders`: also hold it to raiders in sight most of the time). On a phone held upright
// a raider looked near before (October 7: about 50 px long, 60 to 100 px over the horizon)
const UPRIGHT_FAR = { long: 40, lift: 45 };
function titleProblems(t, raiders) {
  if (t.under) problems.push(`${t.size}: her ship on the title screen should keep clear of the title's card (under it ${t.under} times of 60)`);
  if (raiders && !(t.seen >= 0.7 && t.long >= 16)) problems.push(`${t.size}: a raider should be crossing in sight on the title screen most of the time (70% or more), big enough to see (16 px or more): in sight ${Math.round(t.seen * 100)}% of the time, ${t.long} px long`);
  // each raider in sight turned about 30 degrees from side-on to the line of sight to her, wherever she is in the view,
  // so her sails show, and sailing across it bow first; each drawn in one go; and on a phone held upright, small and low
  // over the horizon, clearly far off
  if (t.seen && (t.angle[0] < 24 || t.angle[2] > 36 || t.astern || t.pieces !== 1)) problems.push(`${t.size}: the title's raiders should be turned 25 to 35 degrees from side-on to the line of sight to them wherever they are in the view (so their sails show), sail across it bow first, and each be drawn in one go: ${t.angle.join(', ')} degrees (the least, the tenth of the way up, the most), stern first ${t.astern} times, ${t.pieces} pieces`);
  const upright = +t.size.split('x')[0] <= 700 && +t.size.split('x')[1] > 500;
  if (upright && t.seen && (t.long > UPRIGHT_FAR.long || t.lift > UPRIGHT_FAR.lift)) problems.push(`${t.size}: on a phone held upright the title's raiders should look far off: small (${UPRIGHT_FAR.long} px long or less) and low over the horizon (${UPRIGHT_FAR.lift} px or less): ${t.long} px long, ${t.lift} px over it`);
  const sideways = +t.size.split('x')[1] <= 500;
  if (!t.fits || (sideways && t.name !== 1) || (sideways && +t.size.split('x')[1] >= 350 && !t.opening)) problems.push(`${t.size}: the title's card should fit the screen without scrolling (held sideways, the game's name on one line, and the opening line when there's room): ${JSON.stringify(t)}`);
  return `${t.size}: a raider in sight ${Math.round(t.seen * 100)}% of the time, ${t.long} px long, ${t.lift} px over the horizon, ${t.angle.length ? `turned ${t.angle[0]} to ${t.angle[2]} degrees from side-on to the line of sight to her (a tenth under ${t.angle[1]})` : 'none seen to turn'}${t.astern ? `, STERN FIRST ${t.astern} times` : ''}, in ${t.pieces} piece${t.pieces > 1 ? 's' : ''}; her ${t.ship} under the card ${t.under} times; the card ${t.fits ? 'fits' : 'DOES NOT FIT'}, the name on ${t.name} line${t.name > 1 ? 's' : ''}, ${t.opening ? 'with' : 'without'} the opening line`;
}
// set up a fight near the Captain, run it for a while with the Captain firing at the nearest raider, then hold it. It's
// a fight to look at, not to lose: her hull and crystals are kept at half or more, so a lucky run of raiders' broadsides
// never sinks her and leaves the checks after it with a ship going down
function battle(ids = ['frigate', 'cutter']) {
  const g = window.__game, P = g.player;
  g.raiders.clear(); P.repair(1); g.waves.timer = 1e9; g.raiders.setAI(true);
  const f = P.forward();
  ids.forEach((id, i) => g.raiders.spawn(id, P.pos.clone().addScaledVector(f, 260 + i * 90).add({ x: (i - 0.5) * 140, y: 10, z: 0 }), P.heading + (i ? 2.4 : -1.2), false, i === 0 && ids.length > 2));
  for (let k = 0; k < 40; k++) {
    const live = g.raiders.list.filter((r) => !r.f.down).sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
    if (live[0]) {
      const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = live[0].f.pos.clone().sub(T).normalize(), a = Math.atan2(look.x, look.z) - P.heading;
      g.cam.pitch = Math.max(-0.3, -Math.asin(look.y) + 0.08); g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
    }
    g.step(0.25, { fire: true, sail: 0 });
    for (const part of ['hull', 'crystals']) P.health[part] = Math.max(P.health[part], P.full[part] * 0.5);
  }
  g.raiders.setAI(false);
}
// ---------- reading a fight from afar ----------
// a raider's glows (her crystals, lanterns, muzzles and weak points) at the screen's own scale, as the Captain's are:
// one spawned this moment (no step of the game yet), and after the window changes size (none either)
const glowScales = (page) => page.evaluate(() => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear();
  const r = g.raiders.spawn('manowar', P.pos.clone().addScaledVector(P.forward(), 400), P.heading + 1.4, true), all = [];
  r.ship.body.traverse((o) => { if (o.name === 'glow' || o.name === 'embers') all.push(o.material.uniforms.uScale.value); });
  window.__glowRaider = r;
  return { px: +g.camera.userData.pixelScale.toFixed(1), player: +P.ship.glow.material.uniforms.uScale.value.toFixed(1), raider: [...new Set(all.map((v) => +v.toFixed(1)))] };
});
const glowsAgain = (page) => page.evaluate(() => {
  const g = window.__game, r = window.__glowRaider, all = [];
  r.ship.body.traverse((o) => { if (o.name === 'glow' || o.name === 'embers') all.push(o.material.uniforms.uScale.value); });
  g.raiders.clear(); window.__glowRaider = null;
  return { px: +g.camera.userData.pixelScale.toFixed(1), raider: [...new Set(all.map((v) => +v.toFixed(1)))] };
});
function glowProblems(a, b, where) {
  if (a.raider.length !== 1 || a.raider[0] !== a.px || a.player !== a.px || b.raider.length !== 1 || b.raider[0] !== b.px || b.px === a.px) problems.push(`${where}: a raider's glows should be drawn at the screen's scale as the Captain's are, from her first frame and after the window changes size: ${JSON.stringify({ a, b })}`);
  return `a raider's glows at ${a.raider.join('/')} (the screen's ${a.px}, the Captain's ${a.player}), and ${b.raider.join('/')} once the window changed (${b.px})`;
}
// scars and fire at fight distance (src/ship/flames.js, looks.js, dress.js): a raider Frigate 150 m ahead (200 m from the
// camera), side-on, six shots in her side facing the camera and her hull down to a fifth: her flames change the pixels
// of a good share of her box on the screen (0.6% or more: they used to change a twentieth of that), and her holes, far
// off, are drawn bigger than close up (changing at least 1.35 times the pixels)
const fireAt = (page) => page.evaluate(FIRE_AT);
const FIRE_AT = () => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear(); P.pos.set(1500, 900, -800); P.heading = 0.4; P.speed = 0; P.sail = 0;
  const V = P.pos.constructor, at = P.pos.clone().addScaledVector(P.forward(), 150); at.y += 25;
  const r = g.raiders.spawn('frigate', at, P.heading + Math.PI / 2, true);
  g.raiders.spawn('skiff', P.pos.clone().add({ x: 0, y: -300, z: 0 }).addScaledVector(P.forward(), -3000), 0, true); // (one far behind, so the wave isn't over)
  g.waves.state = 'fight'; g.cam.yaw = 0; g.cam.pitch = 0.05; g.step(0.1, {});
  // six shots into her side facing the camera, from bow to stern, and her hull down to a fifth
  const S = r.ship, hull = S.hull, M = S.body.matrixWorld, ax = new V(1, 0, 0).transformDirection(M), side = Math.sign(g.camera.position.clone().sub(r.f.pos).dot(ax)) || 1;
  for (let i = 0; i < 6; i++) {
    const z = hull.zs + (hull.zb - hull.zs) * (0.15 + 0.7 * (i + 0.5) / 6), q = hull.at(z, 0.35 + 0.15 * (i % 2), side), p = new V(q[0], q[1], z).applyMatrix4(M), d = new V(-side, -0.1, 0).transformDirection(M);
    g.looks.hit(S, 'hull', p.addScaledVector(d, -1), d, 30, 1.35);
  }
  r.f.health.hull = r.f.full.hull * 0.2; g.step(1.5, {});
  const W = S.wear, rr = g.renderer, cv = rr.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true }); k.width = cv.width; k.height = cv.height;
  const grab = () => { rr.render(g.scene, g.camera); x.drawImage(cv, 0, 0); return x.getImageData(0, 0, k.width, k.height).data; };
  // (her box on the screen, reaching up to where her flames reach)
  S.root.updateMatrixWorld(true);
  const b = S.hull, lo = [Infinity, Infinity], hi = [-Infinity, -Infinity], v = new V();
  for (let i = 0; i < 8; i++) { v.set(i & 1 ? 8 : -8, i & 2 ? 22 : b.keel((b.zs + b.zb) / 2) - 1, i & 4 ? b.zb : b.zs).applyMatrix4(M).project(g.camera); lo[0] = Math.min(lo[0], v.x); lo[1] = Math.min(lo[1], v.y); hi[0] = Math.max(hi[0], v.x); hi[1] = Math.max(hi[1], v.y); }
  const B = [Math.max(0, Math.floor((lo[0] + 1) / 2 * k.width)), Math.min(k.width, Math.ceil((hi[0] + 1) / 2 * k.width)), Math.max(0, Math.floor((1 - hi[1]) / 2 * k.height)), Math.min(k.height, Math.ceil((1 - lo[1]) / 2 * k.height))];
  const changed = (a, c) => { let n = 0; for (let y = B[2]; y < B[3]; y++) for (let xx = B[0]; xx < B[1]; xx++) { const i = (y * k.width + xx) * 4; if (Math.max(Math.abs(a[i] - c[i]), Math.abs(a[i + 1] - c[i + 1]), Math.abs(a[i + 2] - c[i + 2])) > 24) n++; } return n; };
  const all = grab(); g.looks.flames.mesh.visible = false;
  const noFire = grab(), read = W.read;
  W.read = 0; W.write(); const near = grab();
  const kept = W.scars.map((s) => s.on); W.scars.forEach((s) => { s.on = false; }); W.write(); const clean = grab();
  W.scars.forEach((s, i) => { s.on = kept[i]; }); W.read = read; W.write(); g.looks.flames.mesh.visible = true;
  const box = (B[1] - B[0]) * (B[3] - B[2]);
  const out = { box, fires: W.fires, flames: changed(all, noFire), far: changed(noFire, clean), near: changed(near, clean), read: +(read ?? 0).toFixed(2), dist: Math.round(g.camera.position.distanceTo(r.f.pos)), level: S.level };
  g.raiders.clear(); g.waves.state = 'calm';
  return out;
};
function fireProblems(F, where) {
  if (F.fires !== 2 || F.level !== 'middle' || !(F.flames >= F.box * 0.006) || !(F.far >= F.near * 1.35) || !(F.read > 0.9)) problems.push(`${where}: a raider holed below a quarter, 200 m off, should burn and show her holes clearly (flames over 0.6% of her box, holes far off 1.35 times as big as close up): ${JSON.stringify(F)}`);
  return `a raider holed to a fifth ${F.dist} m off: ${F.fires} flames changing ${F.flames} pixels of her ${F.box} (${(F.flames / F.box * 100).toFixed(1)}%), her holes ${F.far} pixels far off against ${F.near} close up`;
}
// far-off wakes (wakes.js): two Cutters crossing ahead at the same speed, 300 m and 1.3 km off, after 7 s: the far one's
// wake covers 2.2 times as much of her flight (its points spread further apart far off), and on the screen it's a clear
// streak (`least`: how long, in the page's pixels, and how many of them it changes), steady along its length (one bead
// at most: its shimmer eases off far off)
const wakesFar = (page) => page.evaluate(WAKES_FAR);
const WAKES_FAR = () => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear(); g.wakes.clear(); P.pos.set(1500, 900, -800); P.heading = 0.4; P.speed = 0; P.sail = 0;
  const V = P.pos.constructor, f = P.forward(), s = new V(Math.cos(P.heading), 0, -Math.sin(P.heading));
  // two Cutters crossing ahead at the same speed, one 300 m off and one 1.3 km off, flying straight
  const rs = [300, 1300].map((d, i) => { const r = g.raiders.spawn('cutter', P.pos.clone().addScaledVector(f, d).addScaledVector(s, -60 - i * 200).add({ x: 0, y: -20 - i * 40, z: 0 }), P.heading + Math.PI / 2, false); r.f.sail = 0.85; r.f.speed = 30; return r; });
  g.cam.yaw = 0; g.cam.pitch = 0.05;
  for (let t = 0; t < 7; t += 0.05) { for (const r of rs) { r.f.speed = 30; r.f.sail = 0.85; } g.step(0.05, { sail: -1 }); }
  const [a, b] = rs.map((r) => g.wakes.of(r.f)), span = (w) => +(w.length / 30).toFixed(2);
  // the far one's trail on the screen: from her stern back to its tail (in the page's pixels), and the pixels it changes
  const rr = g.renderer, cv = rr.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true }); k.width = cv.width; k.height = cv.height;
  const grab = () => { rr.render(g.scene, g.camera); x.drawImage(cv, 0, 0); return x.getImageData(0, 0, k.width, k.height).data; };
  const on = grab(); g.wakes.mesh.visible = false; const off = grab(); g.wakes.mesh.visible = true;
  const head = rs[1].f.pos.clone().project(g.camera), dir = rs[1].f.velocity.clone().normalize(), tail = rs[1].f.pos.clone().addScaledVector(dir, -b.length).project(g.camera);
  const hx = (head.x + 1) / 2 * k.width, hy = (1 - head.y) / 2 * k.height, tx = (tail.x + 1) / 2 * k.width, ty = (1 - tail.y) / 2 * k.height;
  const x0 = Math.max(0, Math.floor(Math.min(hx, tx) - 30)), x1 = Math.min(k.width, Math.ceil(Math.max(hx, tx) + 30)), y0 = Math.max(0, Math.floor(Math.min(hy, ty) - 30)), y1 = Math.min(k.height, Math.ceil(Math.max(hy, ty) + 30));
  let px = 0;
  for (let y = y0; y < y1; y++) for (let xx = x0; xx < x1; xx++) { const i = (y * k.width + xx) * 4; if (Math.max(Math.abs(on[i] - off[i]), Math.abs(on[i + 1] - off[i + 1]), Math.abs(on[i + 2] - off[i + 2])) > 16) px++; }
  const dpr = k.width / innerWidth;
  // (how steady it is along its length: how much it adds to the picture at points from a tenth to two thirds of the way
  // back, each the most within 2 px of the line; a bead is a dip between two brighter stretches: a point fainter than
  // both the points two either side of it, by 6% of the brightest. A row of beads had four)
  const along = [];
  for (let q = 0.1; q <= 0.67; q += 0.02) {
    const cx = Math.round(hx + (tx - hx) * q), cy = Math.round(hy + (ty - hy) * q); let m = 0;
    for (let yy = cy - 2; yy <= cy + 2; yy++) for (let xx = cx - 2; xx <= cx + 2; xx++) { const i = (yy * k.width + xx) * 4; m = Math.max(m, Math.abs(on[i] - off[i]) + Math.abs(on[i + 1] - off[i + 1]) + Math.abs(on[i + 2] - off[i + 2])); }
    along.push(m);
  }
  const out = { near: span(a), far: span(b), at: [0, 1].map((i) => Math.round(rs[i].f.pos.distanceTo(g.camera.position))), screen: Math.round(Math.hypot(hx - tx, hy - ty) / dpr), pixels: Math.round(px / dpr / dpr),
    beads: along.filter((v, i) => i >= 2 && i < along.length - 2 && Math.min(along[i - 2], along[i + 2]) - v > 0.06 * Math.max(...along)).length };
  g.raiders.clear(); g.wakes.clear();
  return out;
};
function wakeProblems(W, where, least) {
  if (!(W.far >= W.near * 2.2) || !(W.screen >= least.screen) || !(W.pixels >= least.pixels) || W.beads > 1) problems.push(`${where}: a raider's wake far off should be a clear, steady streak showing which way she goes (covering 2.2 times the flight of a near one's, ${least.screen} px long and ${least.pixels} pixels or more, not a row of beads): ${JSON.stringify(W)}`);
  return `a Cutter's wake ${W.at[0]} m off covers ${W.near} s of her flight, ${W.at[1]} m off ${W.far} s, ${W.screen} px long on the screen, changing ${W.pixels} pixels, ${W.beads ? `${W.beads} BEADS along it` : 'steady along it'}`;
}
// a raider lost in the cloud floor (sky.js) gives nothing away (wakes.js, looks.js): a Cutter sailing in thick cloud
// 1 km off, under the cloud top, the Captain high above it: once lost, her wake fades out, and of her whole presence
// (her ship, wake, flames and their glow; burning, her hull holed to a fifth) at most 30 pixels show over the cloud
// (her wake alone made over 600 before); out of the cloud again, her wake comes back
const hiddenWake = (page) => page.evaluate(HIDDEN_WAKE);
const HIDDEN_WAKE = () => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear(); g.wakes.clear();
  // (a spot where the cloud floor is thick 1 km ahead, and stays thick along the 200 m she sails in 7 s, as the cloud
  // drifts meanwhile, and with a little less cloud than now, should the air where the Captain is thin it)
  const V = P.pos.constructor, at = new V(), to = new V(), q = new V(), mood = g.world.mood, t0 = g.world.time.value, cover = mood.uCover.value;
  let found = null;
  mood.uCover.value = cover - 0.05;
  for (let i = 0; i < 400 && !found; i++) {
    const x = -9000 + (i % 20) * 900, z = -6000 + Math.floor(i / 20) * 600, h = (i * 0.7) % (Math.PI * 2);
    P.pos.set(x, 700, z); P.heading = h;
    at.copy(P.pos).addScaledVector(P.forward(), 1000).setY(415); to.copy(at).add({ x: -Math.cos(h) * 200, y: 0, z: Math.sin(h) * 200 }); // (her way: across, heading h - 90 degrees)
    let thick = true; for (let k = 0; k <= 4 && thick; k++) for (const dt of [0, 4, 8]) thick &&= g.sky.floorAt(q.copy(at).lerp(to, k / 4), t0 + dt) > 0.85;
    if (thick) found = { x, z, h };
  }
  mood.uCover.value = cover;
  if (!found) return { found: false };
  P.speed = 0; P.sail = 0; g.cam.yaw = 0; g.cam.pitch = 0; g.step(0.1, {});
  const r = g.raiders.spawn('cutter', at.clone(), P.heading - Math.PI / 2, false), sail = (s) => { for (let t = 0; t < s; t += 0.05) { r.f.speed = 28; r.f.sail = 0.85; r.f.pos.y = 415; g.step(0.05, { sail: -1 }); } };
  // (four shots in her side, and her hull down to a fifth: she burns)
  const S = r.ship, hull = S.hull, M = S.body.matrixWorld;
  for (let i = 0; i < 4; i++) { const z = hull.zs + (hull.zb - hull.zs) * (0.2 + 0.2 * i), q = hull.at(z, 0.4, 1), p = new V(q[0], q[1], z).applyMatrix4(M), d = new V(-1, -0.1, 0).transformDirection(M); g.looks.hit(S, 'hull', p.addScaledVector(d, -1), d, 30, 1.35); }
  r.f.health.hull = r.f.full.hull * 0.2;
  const look = r.f.pos.clone().sub(g.camera.position).normalize(); g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading;
  sail(7);
  const rr = g.renderer, cv = rr.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true }); k.width = cv.width; k.height = cv.height;
  const grab = () => { rr.render(g.scene, g.camera); x.drawImage(cv, 0, 0); return x.getImageData(0, 0, k.width, k.height).data; };
  const dpr = k.width / innerWidth, diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) > 16) n++; return Math.round(n / dpr / dpr); };
  let glows = null; g.scene.traverse((o) => { if (o.isPoints && o.renderOrder === 4 && o.material.uniforms?.uMax) glows = o; });
  const all = [r.ship.root, g.wakes.mesh, g.looks.flames.mesh, glows];
  const presence = () => { const a = grab(), was = all.map((o) => o.visible); all.forEach((o) => { o.visible = false; }); const b = grab(); all.forEach((o, i) => { o.visible = was[i]; }); return diff(a, b); };
  const wakeOnly = () => { const a = grab(); g.wakes.mesh.visible = false; const b = grab(); g.wakes.mesh.visible = true; return diff(a, b); };
  const W = g.wakes.of(r.f);
  const out = { found: true, d: Math.round(r.f.pos.distanceTo(P.pos)), lost: r.lost, cloud: +g.sky.cloudAt(r.f.pos).toFixed(2), veil: +(W?.veil ?? -1).toFixed(2), fires: r.ship.wear.fires, wake: wakeOnly(), all: presence() };
  // (and out of the cloud, over it and clear of the big clouds, her wake back)
  let y = 470; for (; y < 1500; y += 30) if (g.sky.cloudAt(q.copy(r.f.pos).setY(y)) < 0.02 && g.sky.cloudAt(q.addScaledVector(r.f.forward(), 60)) < 0.02) break;
  for (let t = 0; t < 2; t += 0.05) { r.f.speed = 28; r.f.sail = 0.85; r.f.pos.y = y; g.step(0.05, { sail: -1 }); }
  out.out = { lost: r.lost, veil: +(g.wakes.of(r.f)?.veil ?? -1).toFixed(2) };
  g.raiders.clear(); g.wakes.clear();
  return out;
};
function hiddenWakeProblems(L, where) {
  if (!L.found || !L.lost || !(L.veil > 0.95) || !(L.all <= 30) || L.out?.lost !== false || !(L.out.veil < 0.05)) problems.push(`${where}: a raider lost in cloud far off should give nothing away (her wake faded out, and no more than 30 pixels of her showing over the cloud), and her wake should come back once she's out of it: ${JSON.stringify(L)}`);
  return `a burning Cutter lost in the cloud ${L.d} m off showing ${L.all} pixels over it (her wake ${L.wake}), her wake back once she's out`;
}
// stacked tags (main.js tags()): raiders far off ahead, close together on the screen, and one close by. Two Brigs (1.25
// and 1.38 km), one just over the other: their tags clear of each other, both over their ships (not at the edge), and
// neither ship under any tag (each ship's box on the screen, from every point of her model as drawn). Then a Cutter at
// 1.2 km joins them: three tags clear of each other, of the three ships, and of the panels along the top (the compass,
// your ship's panel, the map, the score, the guns' label...). And a Frigate 60 m ahead, her masts reaching high in the
// view: her tag clear of the panels along the top, and of her ship's middle (where her hull is)
const tagsAt = (page) => page.evaluate(TAGS_AT);
const TAGS_AT = () => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear(); P.pos.set(1500, 900, -800); P.heading = 0.4; P.speed = 0; P.sail = 0;
  g.cam.yaw = 0; g.cam.pitch = 0.1; g.cam.zoom = 1; g.step(0.1, {}); g.layout();
  const f = P.forward(), s = { x: Math.cos(P.heading), y: 0, z: -Math.sin(P.heading) }, V = P.pos.constructor, v = new V();
  const spawn = (id, ahead, side, up) => g.raiders.spawn(id, P.pos.clone().addScaledVector(f, ahead).addScaledVector(s, side).add({ x: 0, y: up, z: 0 }), P.heading + 1.4, true);
  // (a ship's box on the screen: every third point of her model as drawn, in the page's pixels)
  const shipBox = (r) => {
    const b = { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity };
    r.ship.body.traverse((o) => { if (!o.isMesh || !o.visible || !o.parent.visible) return; const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i += 3) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).project(g.camera); const x = (v.x + 1) / 2 * innerWidth, y = (1 - v.y) / 2 * innerHeight; b.l = Math.min(b.l, x); b.r = Math.max(b.r, x); b.t = Math.min(b.t, y); b.b = Math.max(b.b, y); } });
    return b;
  };
  const tagBox = (r) => { const b = r.tag.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; };
  const area = (a, b) => Math.round(Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t)));
  const look = (rs) => {
    g.step(0.1, {}); g.placeTags(); g.placeTags();
    const tags = rs.map(tagBox), ships = rs.map(shipBox), round = (b) => [b.l, b.t, b.r, b.b].map(Math.round);
    let overlap = 0, covered = 0, panels = 0;
    tags.forEach((a, i) => { tags.forEach((b, j) => { if (j > i) overlap += area(a, b); }); ships.forEach((sb) => { covered += area(a, sb); }); g.edge.top.forEach((p) => { panels += area(a, p); }); });
    return { tags: tags.map(round), ships: ships.map(round), overlap, covered, panels, edge: rs.filter((r) => r.tag.classList.contains('edge')).length };
  };
  const out = { size: `${innerWidth}x${innerHeight}` };
  const near = spawn('brig', 1250, 0, 40), far = spawn('brig', 1380, 12, 60);
  out.two = look([near, far]);
  const cutter = spawn('cutter', 1200, -10, 30);
  out.three = look([cutter, near, far]);
  g.raiders.clear();
  // (a Frigate close ahead, as high as puts the place just over her ship half a tag up into the panels along the top in
  // the middle of the screen, but not so high that her tag would go to the edge: her mast heads high in the view)
  const under = Math.max(72, g.edge.top.reduce((m, b) => (b.l < innerWidth / 2 + 42 && b.r > innerWidth / 2 - 42 ? Math.max(m, b.b) : m), 0) + 20);
  let up = 0;
  for (; up < 80; up += 0.5) { v.copy(P.pos).addScaledVector(f, 60); v.y += up + 40 * 0.45 + 3; v.project(g.camera); if ((1 - v.y) / 2 * innerHeight <= under) break; }
  const close = spawn('frigate', 60, 0, up);
  const c = look([close]), sb = c.ships[0], mid = { l: sb[0], r: sb[2], t: (sb[1] + sb[3]) / 2 - 4, b: (sb[1] + sb[3]) / 2 + 4 };
  out.close = { tag: c.tags[0], ship: sb, panels: c.panels, hull: area({ l: c.tags[0][0], t: c.tags[0][1], r: c.tags[0][2], b: c.tags[0][3] }, mid), edge: c.edge };
  g.raiders.clear();
  return out;
};
function tagProblems(T, where) {
  const two = T.two, three = T.three, close = T.close;
  if (two.overlap || two.covered || two.edge) problems.push(`${where}: two raiders' tags far off, one just over the other, should stack clear of each other, over their ships, and cover neither ship: ${JSON.stringify({ size: T.size, two })}`);
  if (three.overlap || three.covered || three.panels || three.edge) problems.push(`${where}: three raiders' tags far off, close together, should stack clear of each other, of the ships and of the panels along the top: ${JSON.stringify({ size: T.size, three })}`);
  if (close.panels || close.hull || close.edge) problems.push(`${where}: a raider close ahead with her masts high in the view should have her tag clear of the panels along the top (and of her hull): ${JSON.stringify({ size: T.size, close })}`);
  const ok = (x) => x.overlap || x.covered || x.panels ? 'NOT CLEAR' : 'clear';
  return `two raiders' tags far off stacked ${ok(two)} of each other and both ships, three ${ok(three)} of each other, the ships and the panels, and a close one's ${close.panels || close.hull ? 'ON THE PANELS OR HER HULL' : 'clear of the panels'}`;
}
// tags at the screen's edge all on it by their own widths, from their very first frame: the widest a wave brings (a
// treasure Galleon's, a raider captain's Frigate's, a treasure Brig's, a Man-o'-war's), off either side. And a wave's
// banner, coming in with its raiders' tags right where it is (on the horizon): the tags under it faded right away (none
// to be seen through it, unless one says "Broadside!"), the rest still showing, and all of them back once it fades
const tagEdges = (page) => page.evaluate(TAG_EDGES);
const TAG_EDGES = async () => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear(); P.pos.set(1500, 900, -800); P.heading = 0; P.speed = 0; P.sail = 0;
  g.cam.yaw = 0; g.cam.pitch = 0.1; g.step(0.1, {});
  const off = [], across = { x: Math.cos(P.heading), y: 0, z: -Math.sin(P.heading) };
  for (const [id, captain, treasure] of [['galleon', false, true], ['frigate', true, false], ['brig', false, true], ['manowar', false, false]]) for (const side of [-1, 1]) {
    g.raiders.clear();
    const r = g.raiders.spawn(id, P.pos.clone().addScaledVector(across, side * 600).addScaledVector(P.forward(), 300), 0, true, captain, treasure);
    g.step(1 / 60, {});
    const b = r.tag.getBoundingClientRect(), edge = r.tag.classList.contains('edge');
    if (!edge || b.left < 0 || b.right > innerWidth) off.push(`${r.tag.querySelector('b').textContent}: ${Math.round(b.left)} to ${Math.round(b.right)}${edge ? '' : ' (not at the edge)'}`);
  }
  // (wave 15 as it comes in ahead, five raiders strong, the five then set 1.4 km off across the banner's middle, where
  // a wave's raiders come in, so their tags land on it wherever the wave happened to come from)
  g.raiders.clear(); g.cam.yaw = 0; g.cam.pitch = 0.1;
  Object.assign(g.waves, { n: 14, state: 'calm', timer: 0.05, next: { ids: ['manowar', 'frigate', 'frigate', 'brig', 'cutter'], captain: 1, treasure: [], storm: false, bank: false } });
  g.step(0.1, {});
  const bn = document.getElementById('banner').getBoundingClientRect(), cam = g.camera, v = new (P.pos.constructor)();
  g.raiders.list.forEach((r, i) => {
    v.set(((bn.left + (bn.right - bn.left) * (0.15 + 0.175 * i)) / innerWidth) * 2 - 1, 1 - ((bn.top + bn.bottom) / 2 / innerHeight) * 2, 0.5).unproject(cam).sub(cam.position).normalize();
    r.f.pos.copy(cam.position).addScaledVector(v, 1400); r.f.pos.y -= r.R.length * 0.45 + 3; r.ship.root.position.copy(r.f.pos);
  });
  g.step(1 / 60, {}); g.placeTags();
  // (under it: overlapping it by more than 2 px each way; clear of it: apart from it; a tag just touching its edge counts as neither)
  const look = () => g.raiders.list.map((r) => {
    const t = r.tag, b = t.getBoundingClientRect(), was = t.style.transition; t.style.transition = 'none';
    const o = +getComputedStyle(t).opacity; t.style.transition = was;
    const ox = Math.min(b.right, bn.right) - Math.max(b.left, bn.left), oy = Math.min(b.bottom, bn.bottom) - Math.max(b.top, bn.top);
    return { under: ox > 2 && oy > 2, clear: ox < -1 || oy < -1, shows: o > 0.05 };
  });
  const now = look(), banner = { under: now.filter((t) => t.under).length, seen: now.filter((t) => t.under && t.shows).length, clear: now.filter((t) => t.clear).length, hidden: now.filter((t) => t.clear && !t.shows).length };
  await new Promise((ok) => setTimeout(ok, 3900)); g.placeTags(); // (the tags under it come back 0.7 s before it goes, 4.4 s on)
  banner.after = look().filter((t) => t.shows).length; banner.n = now.length;
  g.raiders.clear(); Object.assign(g.waves, { state: 'calm', timer: 1e9, next: null });
  return { size: `${innerWidth}x${innerHeight}`, off, banner };
};
function tagEdgeProblems(T, where) {
  const B = T.banner;
  if (T.off.length) problems.push(`${where}: a raider's tag at the screen's edge should be all on the screen: ${T.off.join(', ')}`);
  if (!B.under || B.seen || B.hidden || B.after !== B.n) problems.push(`${where}: as a wave comes in, its raiders' tags under its banner should fade away (and only those), and all come back once it fades: ${JSON.stringify(T)}`);
  return `the widest tags at the edge ${T.off.length ? `CUT OFF: ${T.off.join(', ')}` : 'all on the screen'}; wave 15's banner over ${B.under} of its ${B.n} tags, ${B.seen ? `${B.seen} SEEN THROUGH IT` : 'faded'}, ${B.after} back after it`;
}
// the storm on its way (world.js stormWall): the sky alone, looking level towards it. Down each column of the screen,
// its crest is where the sky turns lighter going down (the lit tops of the billows against the darkened sky): found in
// 70% of the columns or more, heaped (its crest rising and falling 20 px or more across the view), lit on top (its
// tops half as bright again as its foot at the horizon), and moving (the crests 3 px or more different two minutes on).
// And its outline (where the sky first changes going down each column): lumpy all along, not smooth domes (the crest
// smoothed over 6 px stands on average 1.35 px or more off the crest smoothed over 60 px: smooth domes made about 1);
// and seamless round the sky: looking due north with the storm coming from there (where the directions round the sky
// start again), no column's crest more than 4 px from the next one's, at four times a few minutes apart
const stormWall = (page) => page.evaluate(() => {
  const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); g.raiders.clear(); P.pos.set(1500, 900, -800);
  const M = g.world.mood, sky = g.world.group.children[0], rr = g.renderer, cv = rr.domElement, k = document.createElement('canvas'), x = k.getContext('2d', { willReadFrequently: true });
  k.width = cv.width; k.height = cv.height;
  const W = k.width, H = k.height, mid = Math.round(H / 2), dpr = W / innerWidth;
  let cam = null, up = 0;
  const towards = (heading) => {
    P.heading = heading; g.sky.reset(); g.sky.front(heading); g.cam.yaw = 0; g.cam.pitch = 0; g.step(12, {}, 1 / 30);
    cam = g.camera.clone(); cam.position.copy(P.pos); cam.position.y += 20; cam.lookAt(cam.position.clone().add({ x: Math.sin(heading), y: 0, z: Math.cos(heading) })); cam.updateMatrixWorld();
    up = Math.round(H / 2 * Math.tan(0.32) / Math.tan(cam.fov * Math.PI / 360)); M.uFront.value = 1;
  };
  const grab = () => { rr.render(sky, cam); x.drawImage(cv, 0, 0); return x.getImageData(0, 0, k.width, k.height).data; };
  const lum = (d, xx, y) => { const i = (y * W + xx) * 4; return (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; };
  const profile = (d) => {
    const crest = [], edge = [], top = [], foot = [];
    for (let xx = 2; xx < W - 2; xx += 4) {
      let best = -1, by = mid;
      for (let y = mid - up; y < mid - 4; y++) { const j = lum(d, xx, y + 3) - lum(d, xx, y - 3); if (j > best) { best = j; by = y; } }
      crest.push(by); edge.push(best); top.push(lum(d, xx, Math.min(mid - 1, by + 5))); foot.push(lum(d, xx, mid - 2));
    }
    return { crest, edge, top, foot };
  };
  // (its outline: down each column, the first row whose colour differs from the row 3 above it, in the page's pixels)
  const outline = (d) => { const c = []; for (let xx = 0; xx < W; xx++) { let by = mid; for (let y = mid - up; y < mid; y++) { const i = (y * W + xx) * 4, j = i - 3 * W * 4; if (Math.abs(d[i] - d[j]) + Math.abs(d[i + 1] - d[j + 1]) + Math.abs(d[i + 2] - d[j + 2]) > 18) { by = y; break; } } c.push(by / dpr); } return c; };
  const avg = (v, w) => v.map((_, i) => { let s = 0, n = 0; for (let q = Math.max(0, i - w); q <= Math.min(v.length - 1, i + w); q++) { s += v[q]; n++; } return s / n; });
  const lumps = (c) => { const w = Math.round(30 * dpr), a = avg(c, Math.round(3 * dpr)), b = avg(c, w); let s = 0, n = 0; for (let i = w; i < c.length - w; i++) { s += Math.abs(a[i] - b[i]); n++; } return s / n; };
  const jump = (c) => { let j = 0; for (let i = 1; i < c.length; i++) j = Math.max(j, Math.abs(c[i] - c[i - 1])); return +j.toFixed(1); };
  towards(0.4);
  const first = grab(), a = profile(first), lumpy = lumps(outline(first));
  g.world.time.value += 120; const b = profile(grab());
  towards(Math.PI); const seam = [];
  for (let n = 0; n < 4; n++) { seam.push(jump(outline(grab()))); g.world.time.value += 400; }
  const mean = (v) => v.reduce((q, w) => q + w, 0) / v.length, cs = [...a.crest].sort((p, q) => p - q);
  g.sky.reset();
  return { found: +(a.edge.filter((e) => e > 0.06).length / a.edge.length).toFixed(2), heaped: Math.round((cs[Math.floor(cs.length * 0.9)] - cs[Math.floor(cs.length * 0.1)]) / dpr),
    top: +mean(a.top).toFixed(2), foot: +mean(a.foot).toFixed(2), moved: +(mean(a.crest.map((c, i) => Math.abs(c - b.crest[i]))) / dpr).toFixed(1), lumps: +lumpy.toFixed(2), seam };
});
const mode = (page) => page.evaluate(() => window.__game.mode);
if (!demoOnly) {
  const page = await open('game', 'laptop', gameReady);
  // every piece of the game's news must be told somewhere as these checks play: count them (the page reloads once, so
  // they're counted before it and again after)
  const told = new Set(), countEvents = () => page.evaluate(() => {
    window.__told = {};
    for (const k in window.__game.events.PAYLOAD) window.__game.events.on(k, () => { window.__told[k] = (window.__told[k] ?? 0) + 1; });
  });
  const collect = async () => { for (const k of await page.evaluate(() => Object.keys(window.__told))) told.add(k); };
  // the game's news is safe to stop listening to while it's being told (before the counting starts, so this telling
  // isn't counted): a listener that stops listening as it's told doesn't make the next one miss it; one stopped by an
  // earlier one isn't told; one that starts listening as it's told hears it from the next time on; one that throws
  // leaves the news working; and none are left over
  const bus = await page.evaluate(() => {
    const E = window.__game.events, heard = [], name = 'wave:cleared', n0 = E.listeners(name);
    const late = () => heard.push('late');
    let added = false;
    const offA = E.on(name, () => { heard.push('a'); offA(); });
    const offB = E.on(name, () => { heard.push('b'); offC(); if (!added) { added = true; E.on(name, late); } });
    const offC = E.on(name, () => heard.push('c'));
    const offD = E.on(name, () => heard.push('d'));
    E.emit(name); heard.push('|'); E.emit(name);
    const during = E.listeners(name) - n0;
    const offT = E.on(name, () => { offT(); throw new Error('a listener that breaks'); });
    let threw = false; try { E.emit(name); } catch { threw = true; }
    heard.push('|'); E.emit(name);
    offB(); offD(); E.off(name, late);
    return { heard: heard.join(' '), during, threw, left: E.listeners(name) - n0 };
  });
  console.log(`the news, with listeners stopping and starting as it's told: heard "${bus.heard}", ${bus.during} listening after, ${bus.left} left over`);
  if (bus.heard !== 'a b d | b d late b d late | b d late' || bus.during !== 3 || !bus.threw || bus.left !== 0) problems.push(`a listener stopping or starting as the news is told should never make another miss it: ${JSON.stringify(bus)}`);
  await countEvents();
  // the title screen, then the port: choose skies, buy a ship and an upgrade, set the crystal power. A brand-new Captain
  // finds Fair Winds chosen (the skies marked best for a first voyage), so Set sail takes her out on it
  await page.evaluate(() => window.__game.progress.reset());
  if (await mode(page) !== 'title') problems.push('the game does not open on the title screen');
  const newSkies = await page.evaluate(() => { window.__game.port.setMode('title'); return { save: window.__game.progress.data.skies, chosen: [...document.querySelectorAll('#skies [aria-checked="true"]')].map((b) => b.dataset.skies).join() }; });
  console.log(`a brand-new Captain's skies: ${newSkies.save}, chosen on the title: ${newSkies.chosen}`);
  if (newSkies.save !== 'fair' || newSkies.chosen !== 'fair') problems.push(`a brand-new Captain should find Fair Winds chosen on the title: ${JSON.stringify(newSkies)}`);
  await page.waitForTimeout(2000);
  await shot(page, 'laptop-title');
  // the view on the title screen swings round the ship when the sky is dragged: presses on the open sky reach it,
  // through the title screen
  const under = await page.evaluate(() => document.elementFromPoint(innerWidth * 0.72, innerHeight / 2)?.id);
  const yaw0 = await page.evaluate(() => window.__game.title.yaw);
  const soundBefore = await page.evaluate(() => window.__game.audio.state); // (nothing made before the first touch)
  await page.mouse.move(920, 400); await page.mouse.down(); await page.mouse.move(1070, 400, { steps: 5 }); await page.mouse.up();
  const turned = Math.abs((await page.evaluate(() => window.__game.title.yaw)) - yaw0);
  if (under !== 'stage' || turned < 0.8) problems.push(`dragging the sky on the title screen doesn't swing the view round her (the press reaches "${under}", swung ${turned.toFixed(2)})`);
  // the sound: that first touch starts it, its recordings are made, and the title's music plays (Thareia)
  await wait(page, () => window.__game.audio.state === 'running' && window.__game.audio.ready, null, 'the first touch starts the sound and makes its recordings');
  await wait(page, () => window.__game.audio.music === 'title', null, 'the title screen plays Thareia');
  // leaving the page (another app, the phone locked) fades the sound and stops its clock; coming back starts it again
  const leaving = await page.evaluate(async () => {
    const A = window.__game.audio, pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const seen = (h) => { for (const [k, v] of [['hidden', h], ['visibilityState', h ? 'hidden' : 'visible']]) Object.defineProperty(document, k, { configurable: true, get: () => v }); document.dispatchEvent(new Event('visibilitychange')); };
    seen(true); await pause(400);
    const gone = { state: A.state, master: +A.mixer.master.gain.value.toFixed(3) };
    seen(false); await pause(400);
    delete document.hidden; delete document.visibilityState; // (the page's own again)
    return { before: '', gone, back: A.state, master: +A.mixer.master.gain.value.toFixed(3) };
  });
  console.log(`the sound: ${soundBefore === 'none' ? 'nothing made' : `MADE (${soundBefore})`} before the first touch, then ${await page.evaluate(() => `${window.__game.audio.state}, its recordings ${window.__game.audio.ready ? 'made' : 'NOT MADE'}, playing "${window.__game.audio.music}"`)}; leaving the page: ${leaving.gone.state} (volume ${leaving.gone.master}), back: ${leaving.back} (volume ${leaving.master})`);
  if (soundBefore !== 'none') problems.push(`the sound shouldn't be started before the first touch: ${soundBefore}`);
  if (leaving.gone.state !== 'suspended' || leaving.gone.master > 0.05 || leaving.back !== 'running' || leaving.master < 0.9) problems.push(`leaving the page should fade the sound and stop it, and coming back start it again: ${JSON.stringify(leaving)}`);
  // the recordings made for the game: none silent, and each sounding as it should, from its spectrum: the Captain's
  // crack bright (most of its first moment over 2.5 kHz), a raider's darker, a broadside's boom, its roll and a blast
  // deep (mostly under 120 Hz), the canvas tearing and the crystals ringing in the 2-6 kHz band, the crystals dying in
  // falling bells; and a whole broadside, through the mix, rolling on for over two seconds
  const sounds = await page.evaluate(async () => {
    function spectrum(d, from, n) {
      const re = new Float64Array(n), im = new Float64Array(n);
      for (let i = 0; i < n; i++) re[i] = (d[from + i] || 0) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1)));
      for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
      for (let len = 2; len <= n; len <<= 1) {
        const a = (-2 * Math.PI) / len, wr = Math.cos(a), wi = Math.sin(a);
        for (let i = 0; i < n; i += len) for (let k = 0, cr = 1, ci = 0; k < len / 2; k++) {
          const p = i + k, q = p + len / 2, vr = re[q] * cr - im[q] * ci, vi = re[q] * ci + im[q] * cr;
          re[q] = re[p] - vr; im[q] = im[p] - vi; re[p] += vr; im[p] += vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
      const p = new Float64Array(n / 2); for (let i = 0; i < n / 2; i++) p[i] = re[i] * re[i] + im[i] * im[i];
      return p;
    }
    // a recording's centroid (Hz) and its share of energy under 120 Hz and in 2-6 kHz, over [from, to) seconds
    function look(b, from = 0, to = Infinity) {
      const d = b.getChannelData(0), sr = b.sampleRate, N = 2048, end = Math.min(d.length, Math.round(to * sr));
      let all = 0, low = 0, mid = 0, c = 0;
      for (let s = Math.round(from * sr); s + N <= end || s === Math.round(from * sr); s += N / 2) {
        const p = spectrum(d, s, N);
        for (let i = 1; i < p.length; i++) { const f = (i * sr) / N; all += p[i]; c += p[i] * f; if (f < 120) low += p[i]; if (f >= 2000 && f <= 6000) mid += p[i]; }
        if (s + N > end) break;
      }
      return { c: Math.round(c / all), low: +(low / all).toFixed(2), mid: +(mid / all).toFixed(2) };
    }
    const A = window.__game.audio, B = A.bank, avg = (k, f, ...a) => +(B[k].reduce((n, b) => n + look(b, ...a)[f], 0) / B[k].length).toFixed(2);
    const fall = B.crystalsDie[0];
    const out = { silent: A.silent(), crack: avg('crack', 'c', 0, 0.064), crackR: avg('crackR', 'c', 0, 0.064), boom: avg('boom', 'low'), roll: avg('roll', 'low'), blast: avg('blast', 'low'),
      canvas: avg('canvas', 'mid'), crystal: avg('crystal', 'mid'), dying: [look(fall, 0, 0.5).c, look(fall, fall.duration - 0.8, fall.duration).c] };
    const V = (x, y, z) => ({ x, y, z });
    out.broadside = await window.__game.sound.scene(5, (c, m) => { for (let i = 0; i < 10; i++) { m.clock = 0.1 + i * 0.055; c.fire({ owner: 'player', kind: 'broadside', battery: 'port', p: V(6, 900, 14 - i * 3), weight: 1.1, ship: 'frigate', i, n: 10, raider: null }); } });
    return out;
  });
  console.log(`the sounds made for the game: ${sounds.silent.length ? `SILENT: ${sounds.silent.join(', ')}` : 'none silent'}; the Captain's crack at ${sounds.crack} Hz, a raider's at ${sounds.crackR} Hz; under 120 Hz: boom ${sounds.boom}, roll ${sounds.roll}, blast ${sounds.blast}; in 2-6 kHz: canvas ${sounds.canvas}, crystal ${sounds.crystal}; crystals dying from ${sounds.dying[0]} Hz to ${sounds.dying[1]} Hz; a broadside peaks at ${sounds.broadside.peak} and rolls on ${sounds.broadside.ring} s`);
  if (sounds.silent.length) problems.push(`these recordings made for the game are silent: ${sounds.silent.join(', ')}`);
  if (!(sounds.crack > 2500) || !(sounds.crackR < sounds.crack - 500)) problems.push(`the Captain's crack should be bright (over 2.5 kHz) and a raider's darker: ${sounds.crack} Hz, ${sounds.crackR} Hz`);
  if (!(sounds.boom > 0.85 && sounds.roll > 0.85 && sounds.blast > 0.85)) problems.push(`a broadside's boom and roll and a blast should be deep (over 85% under 120 Hz): ${JSON.stringify(sounds)}`);
  if (!(sounds.canvas > 0.45 && sounds.crystal > 0.8)) problems.push(`tearing canvas and ringing crystal should sit in 2-6 kHz: ${JSON.stringify(sounds)}`);
  if (!(sounds.dying[1] < sounds.dying[0])) problems.push(`a ship's crystals dying should fall: ${sounds.dying}`);
  if (!(sounds.broadside.ring > 2) || sounds.broadside.clipped || sounds.broadside.peak > 0.95) problems.push(`a broadside should roll on for over 2 s, without clipping: ${JSON.stringify(sounds.broadside)}`);
  const fx0 = await page.evaluate(() => window.__game.audio.stats.effects);
  await page.click('#skies [data-skies="mael"]'); await page.click('#skies [data-skies="cross"]');
  await page.click('#btn-to-port');
  if (await mode(page) !== 'port') problems.push('"To port" does not open the port');
  await page.click('#port-ships [data-ship="cutter"]');
  if (!(await page.isDisabled('#btn-buy'))) problems.push('the Cutter can be bought with no shards');
  // a ship you don't own: the big gold button buys her (saying her price), and setting sail in your own ship is a
  // plain line under it; how she sails is in plain words (a full circle in so many seconds, metres a second, firepower
  // in words), and her guns too
  const unowned = await page.evaluate(() => {
    const $ = (id) => document.getElementById(id), stat = (k) => document.querySelector(`[data-stat="${k}"] b`).textContent;
    return { buy: $('btn-buy').textContent, shown: !$('pp-buy').hidden, sail: $('btn-sail').textContent, plain: $('btn-sail').classList.contains('alt'), need: $('pp-need').textContent,
      turn: stat('turn'), climb: stat('climb'), fire: stat('firepower'), guns: $('pp-cls').textContent };
  });
  console.log(`port, the Gale not owned: "${unowned.buy}", "${unowned.sail}" (${unowned.plain ? 'plain' : 'BIG'}), "${unowned.need}"; turning "${unowned.turn}", climbing "${unowned.climb}", firepower "${unowned.fire}"; "${unowned.guns}"`);
  if (unowned.buy !== 'Buy the Gale · ◆ 300' || !unowned.shown || unowned.sail !== 'or set sail in the Zephyr' || !unowned.plain || !unowned.need.includes('◆ 0')) problems.push(`a ship not owned should show a big "Buy the Gale · ◆ 300" and a plain "or set sail in the Zephyr": ${JSON.stringify(unowned)}`);
  if (!/^a full circle in \d+ s$/.test(unowned.turn) || !/^\d+ m a second$/.test(unowned.climb) || !['light', 'fair', 'heavy', 'very heavy'].includes(unowned.fire) || !unowned.guns.endsWith('Guns: 1 in the bow, 3 each side, 1 in the stern')) problems.push(`the port's stats should be in plain words: ${JSON.stringify(unowned)}`);
  // the fonts: Cinzel for the title and names, Fira Sans (three weights) for the rest, all inside the page and loading;
  // the old pixel fonts gone
  const fonts = await page.evaluate(async () => {
    const all = [...document.fonts]; await Promise.all(all.map((f) => f.load().catch(() => {})));
    const fam = (sel) => getComputedStyle(document.querySelector(sel)).fontFamily.split(',')[0].replace(/["']/g, '');
    return { faces: all.map((f) => `${f.family.replace(/["']/g, '')} ${f.weight} ${f.status}`), title: fam('#title h1'), name: fam('#pp-name'), body: fam('#pp-blurb'), price: fam('#btn-buy'),
      figures: getComputedStyle(document.querySelector('[data-stat="hull"] b')).fontVariantNumeric };
  });
  console.log(`fonts: ${fonts.faces.join(', ')}; the title in ${fonts.title}, ship names in ${fonts.name}, words in ${fonts.body}, prices in ${fonts.price} (${fonts.figures})`);
  if (fonts.faces.length !== 4 || fonts.faces.some((f) => !f.endsWith('loaded') || !/^(Cinzel|Fira Sans) /.test(f)) || fonts.title !== 'Cinzel' || fonts.name !== 'Cinzel' || fonts.body !== 'Fira Sans' || fonts.price !== 'Fira Sans' || !/tabular-nums/.test(fonts.figures) || !/lining-nums/.test(fonts.figures)) problems.push(`the fonts should be Cinzel for titles and names and Fira Sans for the rest (even, upright figures), all loading: ${JSON.stringify(fonts)}`);
  await page.evaluate(() => { window.__game.progress.data.shards = 2000; window.__game.port.refresh(); });
  const hullBefore = await page.textContent('[data-stat="hull"] b');
  await page.click('#btn-buy');
  await page.click('.mod[data-mod="armour"] button');
  await page.$eval('#pp-power', (el) => { el.value = '2'; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });
  const portState = await page.evaluate(() => { const d = window.__game.progress.data; return { shards: d.shards, cutter: d.ships.cutter, flying: d.flying, note: document.getElementById('pp-power-note').textContent }; });
  const hullAfter = await page.textContent('[data-stat="hull"] b');
  console.log(`port: bought the Cutter and armour (◆ 2,000 → ◆ ${portState.shards}); hull ${hullBefore} → ${hullAfter}; power "${portState.note}"`);
  if (!portState.cutter.owned || portState.cutter.mods.armour !== 1 || portState.shards !== 2000 - 300 - 95 || portState.flying !== 'cutter') problems.push(`buying in port went wrong: ${JSON.stringify(portState)}`);
  if (hullAfter === hullBefore || portState.cutter.power !== 2) problems.push('upgrades and crystal power do not change the ship');
  // the port's music (Market Day), and its sounds: the skies, the buttons, buying a ship, an upgrade, crystal power
  await wait(page, () => window.__game.audio.music === 'town', null, 'the port plays Market Day');
  const portSound = await page.evaluate((fx0) => { const A = window.__game.audio; return { effects: A.stats.effects - fx0, buy: A.stats.events['port:buy'], upgrade: A.stats.events['port:upgrade'], skies: A.stats.events['port:skies'], music: A.music }; }, fx0);
  console.log(`port sounds: ${portSound.effects} of Chris's effects played (skies ${portSound.skies}, buy ${portSound.buy}, upgrade ${portSound.upgrade}); the music "${portSound.music}"`);
  if (portSound.effects < 8 || portSound.buy !== 1 || portSound.upgrade !== 1 || portSound.skies !== 2) problems.push(`the port's sounds didn't all play: ${JSON.stringify(portSound)}`);
  await page.waitForTimeout(1500);
  await shot(page, 'laptop-port');
  if (await page.evaluate(() => document.elementFromPoint(innerWidth / 3, innerHeight / 2)?.id) !== 'stage') problems.push('in port, presses on the ship don\'t reach her');
  // and dragging there turns her round (port.js's own drag: the title's is title.js's)
  const spin0 = await page.evaluate(() => window.__game.port.spin);
  await page.mouse.move(352, 400); await page.mouse.down(); await page.mouse.move(502, 400, { steps: 5 }); await page.mouse.up();
  const spun = Math.abs((await page.evaluate(() => window.__game.port.spin)) - spin0);
  console.log(`port: dragging beside the panel turned her ${spun.toFixed(2)}`);
  if (spun < 0.8) problems.push(`in port, dragging the open space beside the panel should turn her round (turned ${spun.toFixed(2)})`);
  // Settings, from the gear in port: the music slider taken down to nothing silences the music straight away and stops
  // it (no notes made for nothing), and it's kept on this device (through the reload further on)
  await page.click('#btn-settings-port');
  const opened = await page.evaluate(() => !document.getElementById('settings').hidden);
  await page.$eval('#set-music', (el) => { el.value = '0'; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });
  await wait(page, () => window.__game.audio.mixer.music.gain.value < 0.01 && window.__game.audio.music === null, null, 'the music slider at nothing silences the music and stops it');
  await shot(page, 'laptop-settings');
  await page.click('#btn-settings-done');
  const settingsKept = await page.evaluate(() => ({ closed: document.getElementById('settings').hidden, saved: JSON.parse(localStorage.getItem('skies-of-aethermoor/settings-1') ?? '{}'), gain: +window.__game.audio.mixer.music.gain.value.toFixed(4), playing: window.__game.audio.music }));
  console.log(`settings: ${opened ? 'opened from the port' : 'DID NOT OPEN'}; music at nothing: the music's volume ${settingsKept.gain}, playing ${settingsKept.playing ?? 'nothing'}, saved ${JSON.stringify(settingsKept.saved)}`);
  if (!opened || !settingsKept.closed || settingsKept.saved.music !== 0 || settingsKept.gain >= 0.01 || settingsKept.playing !== null) problems.push(`the Settings card should open from the port, silence and stop the music at nothing, save it and close: ${JSON.stringify({ opened, ...settingsKept })}`);
  // the Settings card's other rows, chosen on the card at sea, each taking effect at once: the picture (Smooth: one
  // screen pixel to each of the page's, small shadows, half the cloud puffs, raiders' far models sooner, fewer sparks,
  // half the rain, no scud, no sun's rays and no glitter on the sea; Sharp, a laptop's own, back as it was), aim speed
  // (Fast swings the view 1.8 times as far for the same drag, Slow half as far), up and down flipped, and camera shake off (the view holds still when a hit would shake it)
  const rows = await page.evaluate(() => {
    const g = window.__game, S = g.settings, $ = (id) => document.getElementById(id), out = {};
    const pick = (id, v) => document.querySelector(`#set-${id} [data-value="${v}"]`).click();
    g.fly('brig'); g.waves.timer = 1e9; g.raiders.setAI(false); g.step(0.1, {});
    g.pause(true); $('btn-settings-pause').click();
    out.rows = [...document.querySelectorAll('#settings-rows .setting')].map((r) => r.dataset.setting).join(' ');
    out.default = S.data.picture;
    // (the big clouds drawn: all the instances but the bank's, which a wave can come out of; and the sky's: the share of
    // rain, the scud, the sun's rays, the sea's glitter)
    const pic = () => ({ ratio: g.renderer.getPixelRatio(), shadow: g.sun.shadow.mapSize.x, puffs: g.world.puffs.mesh.geometry.instanceCount - g.world.puffs.BANK, detail: g.raiders.detailAt, q: g.fx.q, wide: g.renderer.domElement.width / innerWidth,
      sky: { rain: g.sky.picked.rain, scud: g.sky.picked.scud, rays: g.world.rays, glitter: g.world.mood.uGlitter.value, towers: g.world.mood.uTowers.value } });
    pick('picture', 'smooth'); out.smooth = pic(); pick('picture', 'balanced'); out.balanced = pic(); pick('picture', 'sharp'); out.sharp = pic();
    $('btn-settings-done').click(); g.pause(false);
    const swing = (aim, flip) => {
      pick('aim', aim); pick('flip', flip); g.cam.yaw = 0; g.cam.pitch = 0.2; g.cam.zoom = 1;
      g.step(1 / 60, { look: { x: 100, y: 30 } }); return { yaw: -g.cam.yaw, pitch: g.cam.pitch - 0.2 };
    };
    const normal = swing(2, false), fast = swing(4, false), slow = swing(0, false), flipped = swing(2, true); swing(2, false);
    out.aim = { fast: +(fast.yaw / normal.yaw).toFixed(2), slow: +(slow.yaw / normal.yaw).toFixed(2), flipped: +(flipped.pitch / normal.pitch).toFixed(2) };
    // (how far the camera is from where it would be with no shake, at its worst over a few frames of a big jolt)
    const jolt = () => {
      g.fx.cam.trauma = 1; let most = 0;
      for (let i = 0; i < 6; i++) {
        g.step(1 / 60, {});
        const P = g.player, t = P.pos.clone(); t.y += P.ship.recipe.length * 0.42 + 2;
        most = Math.max(most, g.camera.position.distanceTo(t.addScaledVector(g.cam.look, -g.cam.dist * g.cam.zoom)));
      }
      return +most.toFixed(4);
    };
    out.shakeOn = jolt(); $('set-shake').click(); out.shakeOff = jolt(); out.shakeSaved = JSON.parse(localStorage.getItem('skies-of-aethermoor/settings-1')).shake; $('set-shake').click();
    g.fx.cam.trauma = 0; g.endVoyage(0);
    return out;
  });
  console.log(`settings: rows ${rows.rows}; picture ${rows.default} by default; Smooth ${JSON.stringify(rows.smooth)}, Balanced ${JSON.stringify(rows.balanced)}, Sharp ${JSON.stringify(rows.sharp)}; aim Fast ×${rows.aim.fast}, Slow ×${rows.aim.slow}, flipped ×${rows.aim.flipped}; a big jolt moves the view ${rows.shakeOn} m, ${rows.shakeOff} m with the shake off`);
  if (rows.rows !== 'sound music effects aim flip picture shake' || rows.default !== 'sharp') problems.push(`a laptop's Settings card should have sound, music, sounds, aim speed, up and down, picture (Sharp at first) and camera shake: ${JSON.stringify(rows)}`);
  const dpr2 = Math.min(2, await page.evaluate(() => devicePixelRatio));
  if (rows.smooth.ratio > 1 || rows.smooth.shadow !== 512 || rows.smooth.puffs !== 55 || rows.smooth.detail !== 0.09 || !(rows.smooth.q < rows.sharp.q) || Math.abs(rows.smooth.wide - rows.smooth.ratio) > 0.01
    || rows.balanced.shadow !== 1024 || rows.balanced.puffs !== 85 || rows.sharp.ratio !== dpr2 || rows.sharp.shadow !== 2048 || rows.sharp.puffs !== 110 || rows.sharp.q !== 1 || rows.sharp.detail !== 0.06) problems.push(`the picture setting should change the drawing at once: ${JSON.stringify(rows)}`);
  const skyPic = (p) => `${p.rain}/${p.scud}/${p.rays}/${p.glitter}/${p.towers}`;
  if (skyPic(rows.smooth.sky) !== '0.5/0/0/0/1' || skyPic(rows.balanced.sky) !== '1/1/1/1/1' || skyPic(rows.sharp.sky) !== '1/1/1/1/1') problems.push(`the picture setting should trim the sky on Smooth (half the rain, no scud, no sun's rays, no glitter on the sea) and leave it whole otherwise: ${JSON.stringify([rows.smooth.sky, rows.balanced.sky, rows.sharp.sky])}`);
  if (Math.abs(rows.aim.fast - 1.8) > 0.05 || Math.abs(rows.aim.slow - 0.5) > 0.05 || Math.abs(rows.aim.flipped + 1) > 0.05) problems.push(`aim speed and flipped up and down should change how far a drag swings the view: ${JSON.stringify(rows.aim)}`);
  if (!(rows.shakeOn > 0.02) || rows.shakeOff > 1e-4 || rows.shakeSaved !== false) problems.push(`with camera shake off the view should hold still: ${JSON.stringify(rows)}`);
  // the window changing size while the HUD is hidden (a phone turned in port), then setting sail: the corner map
  // still has a size and is drawn; the big map is drawn at its own size
  await page.setViewportSize({ width: 1200, height: 760 }); await page.waitForTimeout(300); await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(300);
  // the big map fits the screen, over a dimmed sky, with a cross to close it at its top right (a tap on the map closes
  // it too)
  const map = await page.evaluate(() => {
    const g = window.__game, $ = (id) => document.getElementById(id), m = $('minimap'); g.fly('brig'); g.waves.timer = 1e9; g.step(0.2, {});
    const small = m.width; m.click(); g.step(0.05, {}); const big = m.width;
    const b = m.getBoundingClientRect(), x = $('map-close').getBoundingClientRect();
    const open = { fits: b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight, cross: !$('map-close').hidden && x.left >= b.left && x.right <= b.right && x.top >= b.top && x.bottom <= b.bottom, dim: !$('map-dim').hidden };
    $('map-close').click(); g.step(0.05, {});
    const closed = !m.classList.contains('big') && $('map-dim').hidden && $('map-close').hidden;
    m.click(); m.click(); g.step(0.05, {});
    return { small, shown: Math.round(m.clientWidth), big, ...open, closed, tapped: !m.classList.contains('big') };
  });
  console.log(`corner map after a resize in port: ${map.small} px wide (shown ${map.shown}), big map ${map.big} px, ${map.fits ? 'fitting the screen' : 'NOT FITTING'}, ${map.dim ? 'the sky dimmed' : 'NOT DIMMED'}, ${map.cross ? 'with' : 'WITHOUT'} its cross, ${map.closed ? 'which closes it' : 'WHICH DOESN\'T CLOSE IT'}`);
  if (!map.small || map.big < map.small * 2) problems.push(`the corner map isn't drawn after the window changes size in port: ${JSON.stringify(map)}`);
  if (!map.fits || !map.dim || !map.cross || !map.closed || !map.tapped) problems.push(`the big map should fit the screen over a dimmed sky, and close with its cross or a tap: ${JSON.stringify(map)}`);

  // Each of the six ships flown on the game's own clock (software drawing is too slow to fly in real time), with no
  // upgrades and no wind: 20 seconds at full sail turning and climbing, then each battery fired at a raider of the same
  // class sitting 260 m off on its side.
  const quiet0 = await page.evaluate(() => { const A = window.__game.audio; return { fire: A.stats.events.fire ?? 0, started: Object.values(A.mixer.stats.started).reduce((a, b) => a + b, 0) }; });
  const flown = await page.evaluate((ships) => {
    const g = window.__game, res = [], PARTS = ['hull', 'sails', 'crystals'];
    // the marks on the crosshair: what each hit was, and the mark's colour for it
    const HIT_COLOUR = { hull: '#e2bd67', sails: '#ecdcb8', crystals: '#ff9f45', kill: '#ff4636' }, hits = [];
    const mark = document.getElementById('hitmark'), playing = (id) => document.getAnimations().some((a) => a.effect?.target?.id === id);
    g.events.on('hit', (e) => { if (e.target === 'raider') hits.push(e.part); });
    // (or, if the shots brought her down, the kill's red X: the Captain's Galleon strikes a raider Galleon's colours)
    const marked = (foe) => ({ playing: playing('hitmark'), part: mark.dataset.part, right: mark.getAttribute('stroke') === HIT_COLOUR[mark.dataset.part] && (hits.includes(mark.dataset.part) || (mark.dataset.part === 'kill' && !!foe?.f.down)) });
    g.progress.reset(); g.progress.data.skies = 'cross'; // (a new save starts on Fair Winds: these fights are on Crosswinds)
    const voyage = (id) => { g.fly(id); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); return g.player; };
    const aimAt = (P, tp) => {
      const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = tp.clone().sub(T).normalize(), a = Math.atan2(look.x, look.z) - P.heading;
      g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
    };
    const still = (P) => { P.speed = 3; P.sail = 0.05; P.vy = 0; P.turn = 0; P.climb = 0; };
    for (const id of ships) {
      const P = voyage(id);
      P.pos.set(0, 700, 6000); P.heading = 0; P.sail = 1; P.vy = 0; P.turn = 0; P.climb = 0;
      g.step(20, { sail: 1, turn: 1, climb: 1 });
      const r = { id, kmh: Math.round(P.speed * 3.6), turned: Math.round(Math.abs(P.heading) * 180 / Math.PI), climbed: Math.round(P.pos.y - 700), guns: {} };
      for (const [b, rel] of [['bow', 0], ['port', Math.PI / 2], ['starboard', -Math.PI / 2], ['stern', Math.PI]]) {
        const n = g.gunnery.count(b); if (!n) continue;
        g.raiders.clear(); P.pos.set(0, 900, 0); P.heading = 0.4; still(P);
        const dir = 0.4 + rel, tp = P.pos.clone().add({ x: Math.sin(dir) * 260, y: 6, z: Math.cos(dir) * 260 });
        const foe = g.raiders.spawn(id, tp, 1.0, true);
        aimAt(P, tp); g.step(0.05, { fire: false });
        const label = document.getElementById('battery-name').textContent, reach = document.getElementById('battery-count').textContent;
        const locked = g.locked === foe;
        hits.length = 0;
        aimAt(P, tp); g.step(6, { fire: true }); // three broadside volleys: a single one can spread wide
        r.guns[b] = { n, label, locked, reach, parts: PARTS.filter((k) => foe.f.health[k] < foe.f.full[k]), mark: marked(foe) };
      }
      res.push(r);
    }
    // a raider Brig brought down: one more shot to her hull (its splinters fly), then she blows apart: a chain of
    // blasts, her crystals going dark, her bounty rising from the wreck; she falls through the cloud deck and is gone
    // below it, spilling her shards
    let P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P);
    const foe = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 4, z: 240 }), 2, true); foe.f.health.hull = 10;
    let clock = 0, downAt = -1;
    const wreck = { blasts: [], deck: -1, gone: -1, splinters: 0 };
    const offW = [g.events.on('blast', () => wreck.blasts.push(clock)), g.events.on('wreck:deck', () => { wreck.deck = clock; }),
      g.events.on('hit', (e) => { if (e.target === 'raider' && e.part === 'hull') wreck.splinters = Math.max(wreck.splinters, g.fx.stats().debris.wood); })];
    const d0 = g.downed; aimAt(P, foe.f.pos);
    while (clock < 2 && downAt < 0) { g.step(1 / 60, { fire: true }); clock += 1 / 60; if (foe.f.down) downAt = clock; }
    const killMark = { ring: playing('killring'), x: mark.dataset.part };
    g.step(1 / 60, {}); clock += 1 / 60; // (her end is told the moment after)
    const why = foe.f.down?.why, spilled = g.pickups.list.length;
    const label = [...document.querySelectorAll('.bounty')].find((b) => !b.hidden && +b.style.opacity > 0);
    const bounty = { text: label?.textContent ?? '', worth: Math.round(g.pickups.list.reduce((a, s) => a + s.value, 0)).toLocaleString('en') };
    while (clock < downAt + 2) { g.step(1 / 60, {}); clock += 1 / 60; }
    wreck.dark = foe.ship.parts.glows.every((x) => !x.visible);
    while (clock < downAt + 3) { g.step(1 / 60, {}); clock += 1 / 60; }
    bounty.after = [...document.querySelectorAll('.bounty')].filter((b) => !b.hidden).length;
    while (clock < downAt + 18 && g.raiders.list.includes(foe)) { g.step(0.25, {}); clock += 0.25; }
    wreck.gone = g.raiders.list.includes(foe) ? -1 : clock; offW.forEach((f) => f());
    wreck.early = wreck.blasts.filter((t) => t <= downAt + 3).length;
    g.step(2, {});
    const sinking = { why, counted: g.downed - d0, gone: !g.raiders.list.includes(foe), spilled };
    // shots on a raider Brig's crystals (60 m below and 260 m ahead, the guns aimed at the middle of her crystals) are
    // marked in the crystals' colour
    P.pos.set(0, 900, 0); P.heading = 0; still(P); g.raiders.clear();
    const gems = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: -60, z: 260 }), 1.0, true), box = gems.zones.crystals[1] ?? gems.zones.crystals[0];
    const gc = box.getCenter(gems.f.pos.clone()), gat = gc.clone(); gems.f.aimAt = () => gat.copy(gc).applyMatrix4(gems.ship.body.matrixWorld);
    for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
    let shards = 0; const offC = g.events.on('hit', (e) => { if (e.part === 'crystals') shards = Math.max(shards, g.fx.stats().debris.crystal); });
    hits.length = 0; aimAt(P, gems.f.aimAt()); g.step(3, { fire: true }); offC();
    const crystalMark = { ...marked(), hits: hits.join(' '), shards };
    g.raiders.clear();
    // the shards: fly through them and they're gathered; the count in the corner pops gold and counts up to them
    g.pickups.spill(P.pos.clone().add({ x: 0, y: 0, z: 60 }), P.velocity, 100); const s0 = g.voyage.shards;
    const shown = () => +document.getElementById('voyage-n').textContent.replace(/,/g, '');
    let first = null;
    for (let k = 0; k < 240 && !first; k++) { g.step(1 / 60, { sail: 0.3 }); if (g.voyage.shards > s0) first = { shown: shown(), held: g.voyage.shards }; }
    g.step(4, { sail: 0.3 });
    const gathered = Math.round(g.voyage.shards - s0), score = document.getElementById('score');
    const popped = document.getAnimations().some((a) => a.effect?.target === score);
    const counted = { first, end: shown(), held: Math.round(g.voyage.shards) };
    // a raider brought down low, under the clouds: she still goes down (falling at least 150 m), not vanishing at once
    P.pos.set(0, 260, 0); still(P);
    const low = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: -10, z: 220 }), 2, true); low.f.hit('hull', 1e9);
    g.step(1 / 60, {});
    const lowSeen = g.raiders.list.includes(low), y0 = low.f.pos.y;
    let lowT = 0; while (lowT < 20 && g.raiders.list.includes(low)) { g.step(0.25, {}); lowT += 0.25; }
    const lowFall = { seen: lowSeen, fell: Math.round(y0 - low.f.pos.y), t: lowT };
    // the sun's shadows reach the ship (so her masts and sails shade her deck)
    g.sun.updateMatrixWorld(); g.sun.target.updateMatrixWorld(); g.sun.shadow.updateMatrices(g.sun);
    const sp = P.pos.clone().applyMatrix4(g.sun.shadow.matrix), shadowed = [sp.x, sp.y, sp.z].every((v) => v > 0 && v < 1);
    // detail: a raider far off uses the far model, a near one the middle
    const far = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 0, z: 2500 }), 0, true), near = g.raiders.spawn('brig', P.pos.clone().add({ x: 60, y: 0, z: 80 }), 0, true);
    g.step(0.05, {});
    const detail = { far: far.ship.level, near: near.ship.level };
    // the raiders fight: wave 3 (a Cutter) sent at a Captain who does nothing for a minute
    P = voyage('brig'); g.raiders.setAI(true); P.pos.set(0, 800, 3000); P.heading = Math.PI; P.sail = 0.5;
    Object.assign(g.waves, { n: 2, state: 'calm', timer: 0.1, next: null });
    g.step(60, {});
    const fight = { raiders: g.raiders.list.map((r) => r.id).join(' '), hurt: PARTS.filter((k) => P.health[k] < P.full[k]) };
    // a raider captain leads wave 5; wave 6 brings a treasure ship, wave 12 a Man-o'-war, wave 15 both a Man-o'-war
    // and a captain (who isn't the Man-o'-war)
    Object.assign(g.waves, { n: 4, state: 'calm', timer: 0.1, next: null }); g.raiders.clear(); g.step(0.2, {});
    const captain = g.raiders.list.filter((r) => r.captain).map((r) => `${r.id} (hull ${r.f.full.hull})`).join(' ');
    // how tough a raider captain's Brig is against one of her crew's, on Crosswinds and on Fair Winds (no tougher there)
    const tougher = {};
    for (const sk of ['cross', 'fair']) {
      g.raiders.clear(); g.progress.data.skies = sk;
      const cap = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 0, z: 400 }), 0, true, true), crew = g.raiders.spawn('brig', P.pos.clone().add({ x: 200, y: 0, z: 400 }), 0, true);
      tougher[sk] = +(cap.f.full.hull / crew.f.full.hull).toFixed(2);
    }
    g.progress.data.skies = 'cross';
    // giant raiders only once the Captain owns one (Chris), whichever ship she sails: owning neither, wave 6's treasure
    // ship is a treasure Brig (worth a Galleon's ◆ 300) and wave 12's Man-o'-war a raider captain's Frigate leading the
    // two Cutters, and the card before each and its banner say so; owning the Galleon, wave 6 brings one (but
    // wave 12 no Man-o'-war yet); owning both, waves 12 and 15 bring the Man-o'-war (wave 15's captain sailing another);
    // and each giant on its own: owning only the Man-o'-war (an old save's, as the port sells her only after the
    // Galleon), wave 6 still brings a treasure Brig, and wave 12 the Man-o'-war
    const sailed = () => g.raiders.list.map((r) => r.id + (r.role === 'prize' ? ' (treasure)' : '') + (r.captain ? ' (captain)' : '')).join(' ');
    const waveOf = (n) => { Object.assign(g.waves, { n, state: 'calm', timer: 0.1, next: null }); g.raiders.clear(); g.step(0.2, {}); return sailed(); };
    const banner = () => `${document.getElementById('banner-title').textContent}: ${document.getElementById('banner-line').textContent}`;
    // (the card after wave n, saying what comes next)
    const cardAfter = (n) => { g.raiders.clear(); Object.assign(g.waves, { n: n - 1, state: 'fight', next: null }); g.step(0.05, {}); const t = document.getElementById('calm-line').textContent; g.sailOn(); return t.slice(t.indexOf('Next:')); };
    const owning = (galleon, manowar) => { Object.assign(g.progress.data.ships.galleon, { owned: galleon }); Object.assign(g.progress.data.ships.manowar, { owned: manowar }); P = voyage('brig'); P.pos.set(0, 800, 3000); };
    const giants = {};
    for (const [key, gal, mow] of [['none', false, false], ['galleon', true, false], ['manowar', false, true], ['both', true, true]]) {
      owning(gal, mow);
      const G = giants[key] = { card6: cardAfter(5), wave6: waveOf(5), banner6: banner() };
      G.bounty6 = g.raiders.list.find((r) => r.role === 'prize')?.bounty ?? 0;
      G.card12 = cardAfter(11); G.wave12 = waveOf(11); G.banner12 = banner(); G.wave15 = waveOf(14);
    }
    owning(false, false);
    const wave6 = giants.none.wave6, wave12 = giants.both.wave12, wave15 = giants.both.wave15;
    // and every wave to the fortieth, twenty times over (the waves after the fifteenth are drawn at random): no giant
    // the Captain doesn't own, and never more than one treasure ship in a wave drawn at random; owned, the Man-o'-war
    // growing common in the late waves (in more of them), and the treasure ships not: a late wave brings one about as
    // often (in under half of them) whichever giants the Captain owns, so late waves stay fights
    const sweep = (own, from, to, times) => {
      const seen = { galleon: 0, manowar: 0, treasureBrig: 0, ships: 0, waves: 0, withMow: 0, withPrize: 0, twoPrizes: 0 };
      for (let k = 0; k < times; k++) for (let n = from; n < to; n++) {
        const w = g.waveAt(n, 1, null, own), prizes = w.ids.filter((id, i) => g.treasureShip(w, i)).length; seen.ships += w.ids.length; seen.waves++;
        w.ids.forEach((id, i) => { if (id in seen) seen[id]++; if (id === 'brig' && w.treasure.includes(i)) seen.treasureBrig++; });
        if (w.ids.includes('manowar')) seen.withMow++;
        if (prizes) seen.withPrize++;
        if (prizes > 1 && n >= 15) seen.twoPrizes++;
      }
      return seen;
    };
    const gate = { none: sweep(null, 0, 40, 20), galleon: sweep({ galleon: true }, 0, 40, 20), manowar: sweep({ manowar: true }, 0, 40, 20), both: sweep({ galleon: true, manowar: true }, 0, 40, 20) };
    const early = sweep({ galleon: true, manowar: true }, 15, 19, 200), late = sweep({ galleon: true, manowar: true }, 28, 32, 200);
    const lateNone = sweep(null, 20, 30, 100), lateGalleon = sweep({ galleon: true }, 20, 30, 100);
    gate.common = { early: +(early.withMow / early.waves).toFixed(2), late: +(late.withMow / late.waves).toFixed(2) };
    gate.prizes = { none: +(lateNone.withPrize / lateNone.waves).toFixed(2), galleon: +(lateGalleon.withPrize / lateGalleon.waves).toFixed(2), both: +(late.withPrize / late.waves).toFixed(2),
      two: lateNone.twoPrizes + lateGalleon.twoPrizes + late.twoPrizes + early.twoPrizes };
    // a treasure ship: shoot her sails and she strikes her colours; let her run far enough and she gets away. (No bank
    // of cloud is left from wave 15's arrival: placed at random, it could hide her from the guns)
    g.raiders.clear(); g.world.clear(); g.waves.timer = 1e9; still(P); P.pos.set(0, 900, 0); P.heading = 0;
    const prize = g.raiders.spawn('galleon', P.pos.clone().add({ x: 0, y: 6, z: 380 }), Math.PI / 2, true);
    let t = 0, canvas = 0; const offS = g.events.on('hit', (e) => { if (e.part === 'sails') canvas = Math.max(canvas, g.fx.stats().debris.canvas); });
    while (t < 90 && !prize.f.down) { aimAt(P, prize.f.pos.clone().add({ x: 0, y: 12, z: 0 })); g.step(0.5, { fire: true }); t += 0.5; }
    offS();
    // she gives up without blowing up: no blasts, and her pennants come down
    let gaveUp = 0; const offB = g.events.on('blast', () => gaveUp++); g.step(3, {}); offB();
    const struck = { why: prize.f.down?.why, t, sails: Math.round(prize.f.health.sails), canvas, blasts: gaveUp, flags: prize.ship.parts.flags.every((m) => !m.visible) };
    // then she settles away, faster and faster, through the cloud deck (tearing it) before she's gone, from 906 m; so does
    // a raider Brig whose crystals die at 740 m. (When each crossed the deck and was gone, in seconds since she went down)
    const through = (r, t0) => {
      let s = t0, deck = -1; const off = g.events.on('wreck:deck', () => { if (deck < 0) deck = s; });
      while (s < 45 && g.raiders.list.includes(r)) { g.step(0.25, {}); s += 0.25; }
      off(); return { deck, gone: g.raiders.list.includes(r) ? -1 : s };
    };
    struck.sank = through(prize, 3);
    g.raiders.clear();
    const dead = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: -160, z: 300 }), 0, true); g.step(0.1, {}); dead.f.hit('crystals', 1e9);
    const crystalsDead = { why: dead.f.down?.why, ...through(dead, 0) };
    g.raiders.clear(); g.raiders.setAI(true);
    // (laden with her treasure she sails a little slower than her class, so she's given up to 40 s to get away)
    const runner = g.raiders.spawn('galleon', P.pos.clone().add({ x: 0, y: 0, z: 3400 }), 0);
    runner.fleeing = true; let ran = 0;
    while (ran < 40 && g.raiders.list.includes(runner)) { g.step(1, {}); ran++; }
    const away = { gone: !g.raiders.list.includes(runner), escaped: !!runner.escaped, after: ran };
    g.raiders.setAI(false); g.raiders.clear();
    const tagsLeft = document.getElementById('tags').children.length; // a raider's tag goes with her
    // a hole torn in the clouds just before going back to port is closed for the next voyage
    g.world.tear(P.pos.x, P.pos.z, 120); g.step(0.5, {});
    const holes = { open: +Math.max(...g.world.holes.map((h) => h.w)).toFixed(2) };
    g.endVoyage(0); g.fly('brig'); g.waves.timer = 1e9; g.step(1 / 60, {});
    holes.next = +Math.max(...g.world.holes.map((h) => h.w)).toFixed(2);
    g.endVoyage(0);
    return { res, sinking, gathered, popped, counted, lowFall, shadowed, tagsLeft, detail, fight, captain, tougher, wave6, wave12, wave15, giants, gate, struck, crystalsDead, away, killMark, crystalMark, wreck, bounty, holes };
  }, fleet);
  // (all that ran the game's clock without drawing: the sound counted its news, and played none of it)
  const quiet1 = await page.evaluate(() => { const A = window.__game.audio; return { fire: A.stats.events.fire ?? 0, started: Object.values(A.mixer.stats.started).reduce((a, b) => a + b, 0) }; });
  console.log(`running the clock without drawing: ${quiet1.fire - quiet0.fire} guns fired were counted, ${quiet1.started - quiet0.started} sounds played`);
  if (quiet1.fire - quiet0.fire < 20 || quiet1.started !== quiet0.started) problems.push(`while tests run the clock, the sound should only count the news: ${JSON.stringify({ quiet0, quiet1 })}`);
  const NAMES = { bow: 'Bow guns', port: 'Port broadside', starboard: 'Starboard broadside', stern: 'Stern guns' };
  for (const r of flown.res) {
    console.log(`${r.id.padEnd(8)} ${String(r.kmh).padStart(3)} km/h, turned ${String(r.turned).padStart(3)}° and climbed ${String(r.climbed).padStart(3)} m in 20 s;`,
      Object.entries(r.guns).map(([b, x]) => `${b} ${x.n} ${x.parts.length ? 'hit ' + x.parts.join('+') : 'MISSED'}`).join(', '));
    if (r.kmh < 60 || r.turned < 90 || r.climbed < 100) problems.push(`${r.id}: flies badly (${r.kmh} km/h, ${r.turned}°, ${r.climbed} m)`);
    for (const [b, x] of Object.entries(r.guns)) {
      if (!x.parts.length) problems.push(`${r.id}: ${b} guns missed a raider 260 m away`);
      if (!x.mark.playing || !x.mark.right) problems.push(`${r.id}: ${b} guns' hits aren't marked on the crosshair in the part's colour: ${JSON.stringify(x.mark)}`);
      if (x.label !== NAMES[b]) problems.push(`${r.id}: looking ${b} picked "${x.label}"`);
      if (!x.locked || x.reach === 'out of reach') problems.push(`${r.id}: ${b} guns didn't lock on to a raider in reach`);
    }
  }
  const { sinking, gathered, popped, counted, lowFall, shadowed, tagsLeft, detail, fight, captain, tougher, wave6, wave12, wave15, giants, gate, struck, crystalsDead, away, killMark, crystalMark, wreck, bounty, holes } = flown;
  console.log(`hit marks: every battery's hits marked in the part's colour; a kill ${killMark.ring && killMark.x === 'kill' ? 'rings red' : 'DOES NOT RING'}; shots on a raider's crystals marked "${crystalMark.part}" (hits: ${crystalMark.hits})`);
  if (!killMark.ring || killMark.x !== 'kill') problems.push(`the shot that brings a raider down isn't marked with the red kill ring: ${JSON.stringify(killMark)}`);
  if (!crystalMark.playing || crystalMark.part !== 'crystals' || !crystalMark.right) problems.push(`shots on a raider's crystals aren't marked in the crystals' colour: ${JSON.stringify(crystalMark)}`);
  console.log(`a raider downed low: ${lowFall.seen ? `fell ${lowFall.fell} m in ${lowFall.t} s` : 'VANISHED AT ONCE'}; the shard counter ${popped ? 'pops' : 'DOES NOT POP'}; sun shadows ${shadowed ? 'reach' : 'MISS'} the ship`);
  if (!lowFall.seen || lowFall.fell < 140) problems.push(`a raider brought down low should fall before she goes: ${JSON.stringify(lowFall)}`);
  if (!popped) problems.push('gathering shards doesn\'t make the shard counter pop');
  console.log(`the shard count counts up: ${counted.first ? `${counted.first.shown} shown as ${Math.round(counted.first.held)} came in` : 'NOTHING CAME IN'}, then ${counted.end} of ${counted.held}`);
  if (!counted.first || counted.first.shown >= counted.first.held || counted.end !== counted.held) problems.push(`the shard count should count up to what's in the hold: ${JSON.stringify(counted)}`);
  if (!shadowed) problems.push('the sun\'s shadows don\'t reach the Captain\'s ship');
  if (tagsLeft) problems.push(`${tagsLeft} raider tags left on screen with no raiders`);
  console.log(`raider shot down: ${sinking.why}, counted ${sinking.counted}, spilled ${sinking.spilled} shards, ${sinking.gone ? 'gone below the clouds' : 'STILL THERE'}; gathered ◆ ${gathered} of 100 flown through`);
  console.log(`detail far ${detail.far}, near ${detail.near}; raiders fighting a Captain doing nothing for a minute (${fight.raiders || 'none left'}): hurt ${fight.hurt.join('+') || 'NOTHING'}; wave 5 captain: ${captain || 'NONE'}`);
  if (sinking.why !== 'hull' || sinking.counted !== 1 || !sinking.gone || !sinking.spilled) problems.push(`a raider shot down didn't go down properly: ${JSON.stringify(sinking)}`);
  console.log(`her wreck: ${wreck.early} blasts in 3 s, crystals ${wreck.dark ? 'dark' : 'STILL LIT'} by 2 s, through the cloud deck at ${wreck.deck.toFixed(1)} s, gone at ${wreck.gone.toFixed(1)} s; her hull hit threw ${wreck.splinters} splinters; her bounty "${bounty.text}" (◆ ${bounty.worth} spilled), ${bounty.after} showing 3 s later`);
  if (wreck.early < 3) problems.push(`a raider Brig blown apart should go up in at least 3 blasts within 3 s: ${JSON.stringify(wreck)}`);
  if (!wreck.dark) problems.push('a raider blown apart should have her crystals dark within 2 s');
  if (wreck.deck < 0 || wreck.gone < 0 || wreck.deck > wreck.gone) problems.push(`a wreck should fall through the cloud deck before she's gone: ${JSON.stringify(wreck)}`);
  if (!wreck.splinters) problems.push('a shot in a raider\'s hull should throw splinters of wood');
  if (!bounty.text.includes(bounty.worth) || bounty.after) problems.push(`a raider's bounty should rise from her wreck, showing the shards she spilled, and be gone 3 s later: ${JSON.stringify(bounty)}`);
  console.log(`debris: a crystal hit throws ${crystalMark.shards} shards; a treasure ship's sails shed ${struck.canvas} scraps of canvas; striking her colours: ${struck.blasts} blasts, pennants ${struck.flags ? 'down' : 'STILL UP'}`);
  if (!crystalMark.shards) problems.push('a shot in a raider\'s crystals should throw crystal shards');
  if (!struck.canvas) problems.push('shots in a treasure ship\'s sails should tear off scraps of canvas');
  if (struck.blasts || !struck.flags) problems.push(`a treasure ship striking her colours shouldn't blow up, and her pennants should come down: ${JSON.stringify(struck)}`);
  if (gathered < 99) problems.push(`flying through shards gathered only ${gathered} of 100`);
  if (detail.far !== 'far' || detail.near !== 'middle') problems.push(`raider detail levels wrong: ${JSON.stringify(detail)}`);
  if (!fight.hurt.length) problems.push('the raiders never hurt the Captain in a minute');
  if (!captain.startsWith('brig')) problems.push(`wave 5 should be led by a Brig captain: ${captain}`);
  console.log(`a raider captain's Brig is ${tougher.cross} times as tough as her crew's on Crosswinds, ${tougher.fair} times on Fair Winds`);
  if (tougher.cross !== 2 || tougher.fair !== 1) problems.push(`a raider captain should be twice as tough as her crew on Crosswinds, and no tougher on Fair Winds: ${JSON.stringify(tougher)}`);
  for (const [key, G] of Object.entries(giants)) console.log(`owning ${{ none: 'no giant', galleon: 'the Galleon', manowar: 'only the Man-o\'-war', both: 'both giants' }[key]}: wave 6 ${G.wave6} (${G.card6} "${G.banner6}", her hold ◆ ${G.bounty6}); wave 12 ${G.wave12} (${G.card12} "${G.banner12}"); wave 15 ${G.wave15}`);
  console.log(`every wave to the 40th, 20 times: owning no giant ${gate.none.galleon} Galleons, ${gate.none.manowar} Men-o'-war, ${gate.none.treasureBrig} treasure Brigs; owning the Galleon ${gate.galleon.galleon} Galleons, ${gate.galleon.manowar} Men-o'-war; owning only the Man-o'-war ${gate.manowar.galleon} Galleons, ${gate.manowar.manowar} Men-o'-war, ${gate.manowar.treasureBrig} treasure Brigs; owning both ${gate.both.galleon} and ${gate.both.manowar}; owned, a Man-o'-war in ${Math.round(gate.common.early * 100)}% of waves 16 to 19, ${Math.round(gate.common.late * 100)}% of waves 29 to 32; a treasure ship in ${Math.round(gate.prizes.none * 100)}% of waves 21 to 30 owning no giant, ${Math.round(gate.prizes.galleon * 100)}% owning the Galleon, ${Math.round(gate.prizes.both * 100)}% of 29 to 32 owning both; ${gate.prizes.two} waves drawn at random with two`);
  console.log(`a treasure ship shot in her sails: ${struck.why ? `strikes her colours after ${struck.t} s` : 'DID NOT STRIKE'}; one running far: ${away.escaped ? `got away after ${away.after} s` : 'STILL THERE'}`);
  const N = giants.none, GA = giants.galleon, MO = giants.manowar, B2 = giants.both;
  if (N.wave6 !== 'brig (treasure) cutter' || N.bounty6 !== 300 || N.card6 !== 'Next: a treasure Brig and a Cutter.' || !N.banner6.startsWith('Wave 6: a treasure ship: a treasure Brig and a Cutter,') || !N.banner6.includes('shoot her sails')) problems.push(`owning no Galleon, wave 6 should bring a treasure Brig worth ◆ 300, said so on the card before it and its banner: ${JSON.stringify(N)}`);
  if (N.wave12 !== 'frigate (captain) cutter cutter' || N.card12 !== 'Next: a raider captain\'s Frigate and two Cutters.' || !N.banner12.startsWith('Wave 12: a raider captain: a raider captain\'s Frigate and two Cutters,')) problems.push(`owning no Man-o'-war, wave 12 should bring a raider captain's Frigate and two Cutters, and say so: ${JSON.stringify(N)}`);
  if (N.wave15.includes('manowar') || N.wave15.includes('galleon') || (N.wave15.match(/\(captain\)/g) ?? []).length !== 1) problems.push(`owning no giant, wave 15 should bring no giant, and one captain: ${N.wave15}`);
  if (GA.wave6 !== 'galleon (treasure) cutter' || GA.card6 !== 'Next: a treasure Galleon and a Cutter.' || !GA.banner6.startsWith('Wave 6: a treasure ship: a treasure Galleon and a Cutter,') || GA.wave12.includes('manowar')) problems.push(`owning the Galleon (not the Man-o'-war), wave 6 should bring a treasure Galleon and wave 12 no Man-o'-war yet: ${JSON.stringify(GA)}`);
  if (!wave6.includes('brig (treasure)')) problems.push(`wave 6 should bring a treasure ship: ${wave6}`);
  if (B2.wave12 !== 'manowar cutter cutter' || B2.card12 !== 'Next: a Man-o\'-war and two Cutters.' || !B2.banner12.startsWith('Wave 12: a Man-o\'-war:')) problems.push(`owning the Man-o'-war, wave 12 should bring one, and say so: ${JSON.stringify(B2)}`);
  if (!wave15.includes('manowar') || wave15.includes('manowar (captain)') || !wave15.includes('(captain)')) problems.push(`owning the Man-o'-war, wave 15 should have one and a captain who isn't her: ${wave15}`);
  if (MO.wave6 !== 'brig (treasure) cutter' || MO.card6 !== 'Next: a treasure Brig and a Cutter.' || MO.wave12 !== 'manowar cutter cutter' || MO.wave15.includes('galleon') || !MO.wave15.includes('manowar')) problems.push(`owning only the Man-o'-war, wave 6 should still bring a treasure Brig, and waves 12 and 15 the Man-o'-war: ${JSON.stringify(MO)}`);
  if (gate.none.galleon || gate.none.manowar || !gate.none.treasureBrig || gate.galleon.manowar || !gate.galleon.galleon || !gate.both.galleon || !gate.both.manowar || gate.manowar.galleon || !gate.manowar.manowar || !gate.manowar.treasureBrig) problems.push(`giant raiders should sail only once the Captain owns that giant, each on its own (and a treasure Brig before the Galleon): ${JSON.stringify(gate)}`);
  if (!(gate.common.late > gate.common.early * 1.25)) problems.push(`owned, the Man-o'-war should grow common in the late waves: ${JSON.stringify(gate.common)}`);
  if (gate.prizes.two || !(gate.prizes.galleon < 0.5) || !(gate.prizes.both < 0.5) || !(gate.prizes.none < 0.5)) problems.push(`a wave drawn at random should bring at most one treasure ship, and late waves one in under half of them whichever giants the Captain owns: ${JSON.stringify(gate.prizes)}`);
  if (struck.why !== 'struck') problems.push(`a treasure ship shot in her sails didn't strike: ${JSON.stringify(struck)}`);
  console.log(`wrecks sinking: a struck treasure ship from 906 m through the cloud deck at ${struck.sank.deck} s, gone at ${struck.sank.gone} s; a raider whose crystals died at 740 m (${crystalsDead.why}) through at ${crystalsDead.deck} s, gone at ${crystalsDead.gone} s`);
  for (const [what, x, most] of [['a struck treasure ship from 906 m', struck.sank, 16], ['a raider whose crystals died at 740 m', crystalsDead, 14]]) {
    if (x.deck < 0 || x.gone < 0 || x.deck > x.gone || x.deck > most) problems.push(`${what} should sink through the cloud deck within ${most} s, before she's gone: ${JSON.stringify(x)}`);
  }
  if (crystalsDead.why !== 'crystals') problems.push(`a raider whose crystals were shot away should sink with them dead: ${crystalsDead.why}`);
  console.log(`a hole torn in the clouds (open ${holes.open}) before going back to port: ${holes.next ? `STILL OPEN (${holes.next})` : 'closed'} on the next voyage`);
  if (!(holes.open > 0.5) || holes.next !== 0) problems.push(`the holes torn in the cloud deck should be closed when a new voyage starts: ${JSON.stringify(holes)}`);
  if (!away.gone || !away.escaped) problems.push(`a treasure ship running far didn't get away: ${JSON.stringify(away)}`);
  // ---------- the Captain's late-game ships: the Galleon and the Man-o'-war bought and sailed ----------
  console.log(`laptop, the big two: ${bigTwoProblems(await bigTwoAt(page, 'laptop', (sel) => page.click(sel)), 'laptop')}`);

  // ---------- ships that show their scars (src/ship/dress.js, looks.js) ----------
  // three raider Frigates of one class in view share one set of shaders (the second and third add none), each with her
  // own looks; a real shot through a raider Brig's sail (from astern) makes a hole where it went through the canvas, and
  // one into her planks (from abeam) a scar where it struck them, its embers cooling within 5 s; a Frigate's first cluster of crystals hit dims and
  // cracks alone, and below a third of her crystals they all sputter (and the Captain's dimmed cluster's lamp with
  // them); torn sails fray; a badly holed raider lists towards the side that took the hits; below a quarter of her hull
  // she burns from her worst scars (in one more draw for every flame in the sky), and the fire goes out above it; a
  // damaged ship's smoke pours from where she was hit; between waves the Captain's holes are patched and her embers go
  // out, and the next voyage she sails as good as new
  const scars = await page.evaluate(() => {
    const g = window.__game, out = {}, rr = g.renderer, V = g.camera.position.constructor, L = g.looks;
    g.progress.data.skies = 'cross';
    g.fly('brig'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player; P.pos.set(0, 900, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0; g.cam.yaw = 0; g.cam.pitch = 0.2; g.step(0.1, {});
    const f = P.forward(), right = new V(-f.z, 0, f.x), at = (d, x) => P.pos.clone().addScaledVector(f, d).addScaledVector(right, x);
    const draw = () => { rr.render(g.scene, g.camera); return { programs: rr.info.programs.length, calls: rr.info.render.calls }; };
    const sturdy = (r) => { for (const k of ['hull', 'sails', 'crystals']) r.f.full[k] = r.f.health[k] = 1e6; return r; };
    g.raiders.spawn('frigate', at(240, 0), P.heading, true); g.step(0.05, {});
    const one = draw();
    g.raiders.spawn('frigate', at(270, -80), P.heading, true); g.raiders.spawn('frigate', at(270, 80), P.heading, true); g.step(0.05, {});
    const three = draw();
    out.programs = { one: one.programs, three: three.programs, calls: [one.calls, three.calls], levels: g.raiders.list.map((r) => r.ship.level).join(), own: new Set(g.raiders.list.map((r) => r.ship.U)).size };
    // (a raider far off keeps the wave going, so the Captain's crew don't patch her up meanwhile)
    g.raiders.clear(); sturdy(g.raiders.spawn('skiff', at(-3000, 0), P.heading, true)); g.waves.state = 'fight';
    // a shot through a raider Brig's sail (the wing facing the Captain), and one into her planks just under her ports
    const b = sturdy(g.raiders.spawn('brig', at(0, 200), P.heading, true)); g.step(0.05, {});
    const B = b.ship, W = L.of(B), mine = B.body.worldToLocal(P.pos.clone()), side = Math.sign(mine.x) || 1;
    const hits = [], off = g.events.on('hit', (e) => { if (e.raider === b) hits.push({ part: e.part, size: e.size }); });
    // (a chaser's shot, from 60 m: it flies true)
    const fireAt = (local, out, kind = 'chaser') => {
      const target = B.body.localToWorld(local.clone()), from = target.clone().add(B.body.localToWorld(out.clone()).sub(B.body.localToWorld(new V())).normalize().multiplyScalar(60));
      g.bolts.fire(from, target.clone().sub(from).normalize(), kind, 'player', null, 1);
      for (let t = 0; t < 1.2 && g.bolts.bolts.length; t += 0.05) g.step(0.05, {});
    };
    // (a sail is hit from astern, through its face: from abeam a shot flies along it, edge on)
    const aft = b.R.masts.indexOf(b.R.masts.reduce((m, x) => (x.z < m.z ? x : m))), w = B.wings.find((x) => x.mast === aft && x.side === side);
    // (aimed where the canvas is drawn: her wings fold a little with her sails at 85%; the hole is kept on the canvas as
    // it was made, spread)
    const aim = w.A.clone().add(w.B).add(w.C).divideScalar(3).addScaledVector(w.n, w.belly);
    fireAt(L.foldPoint(aim.clone(), w.side, w.mz, B.U.uFold.value.x), new V(0.3 * side, 0.05, -1));
    const hole = W.holes.find((h) => h.on);
    out.sail = { part: hits[0]?.part, size: hits[0]?.size, w: +B.U.uHole.value[3].toFixed(2), off: hole ? +aim.distanceTo(new V(hole.x, hole.y, hole.z)).toFixed(2) : -1, wing: B.U.uHoleWing.value[0], want: w.i };
    const R = B.recipe, H = B.hull, pz = (R.ports.z[2] + R.ports.z[3]) / 2, t = H.tAt(pz, R.ports.y - R.ports.h * 0.85), q = H.at(pz, t, side), n = H.normal(pz, t, side);
    const spot = new V(...q);
    fireAt(spot, n.clone().setY(0.03));
    const scar = W.scars.find((x) => x.on);
    out.hull = { part: hits[1]?.part, r: scar ? +scar.r.toFixed(2) : 0, heat: scar ? scar.heat : 0, off: scar ? +spot.distanceTo(new V(scar.x, scar.y, scar.z)).toFixed(2) : -1, w: +B.U.uScar.value[3].toFixed(2) };
    off();
    g.step(5, {}); out.hull.cooled = +B.U.uHeat.value[0].toFixed(2);
    // her sails torn to a fifth: they fray
    b.f.health.sails = b.f.full.sails * 0.2; g.step(0.2, {}); out.fray = +B.U.uWear.value.y.toFixed(2);
    // a Frigate's first cluster takes 60% of its share; then her crystals fall to 30%
    const fr = g.raiders.spawn('frigate', at(150, -260), P.heading, true); g.step(0.05, {});
    const share = fr.f.full.crystals / fr.R.clusters.length, c0 = fr.zones.crystals[0].getCenter(new V());
    fr.f.hit('crystals', share * 0.6); L.hit(fr.ship, 'crystals', fr.ship.body.localToWorld(c0), new V(0, -1, 0), share * 0.6, 1); g.step(0.05, {});
    const U = fr.ship.U;
    out.crystals = { crys: Array.from(U.uCrys.value.slice(0, 3)).map((v) => +v.toFixed(2)), crack: Array.from(U.uCrack.value.slice(0, 3)).map((v) => +v.toFixed(2)), glows: fr.ship.parts.glows.every((x) => x.material.uniforms.uCrys === U.uCrys) };
    fr.f.health.crystals = fr.f.full.crystals * 0.3;
    const sparks = new Set();
    for (let k = 0; k < 40; k++) { g.step(0.05, {}); sparks.add(U.uSpark.value); }
    out.crystals.sputter = [...sparks].sort().join('/');
    // the Captain's Brig: her first cluster takes 90% of its share, and its lamp dims with it
    P.hit('crystals', P.full.crystals / 2 * 0.9); L.hit(P.ship, 'crystals', P.ship.body.localToWorld(g.raiders.templates.brig.zones.crystals[0].getCenter(new V())), new V(0, -1, 0), P.full.crystals / 2 * 0.9, 1); g.step(0.05, {});
    const lamps = P.ship.lamps;
    out.lamps = +(lamps[0].intensity / lamps[1].intensity).toFixed(2);
    P.repair(1); g.step(0.05, {});
    // a raider Frigate sailing on, holed three times in her port side, her hull down to a fifth: she lists to port
    const lister = g.raiders.spawn('frigate', at(400, 300), P.heading, false); g.step(0.05, {});
    const LH = lister.ship.hull;
    for (const zz of [-6, 0, 6]) { const tt = LH.tAt(zz, -1.4), qq = LH.at(zz, tt, 1), nn = LH.normal(zz, tt, 1); L.hit(lister.ship, 'hull', lister.ship.body.localToWorld(new V(...qq).addScaledVector(nn, 0.2)), nn.clone().negate().transformDirection(lister.ship.body.matrixWorld), 55, 1.35); }
    lister.f.health.hull = lister.f.full.hull * 0.2; g.step(3, {});
    out.list = +lister.f.list.toFixed(3);
    lister.gone = true; g.step(0.05, {}); // (taken away)
    // the Brig holed more, down to a fifth of her hull: she burns from her two worst scars, in one draw
    for (const zz of [-5, 4]) { const tt = H.tAt(zz, R.ports.y - R.ports.h * 0.85), qq = H.at(zz, tt, side), nn = H.normal(zz, tt, side); L.hit(B, 'hull', B.body.localToWorld(new V(...qq).addScaledVector(nn, 0.2)), nn.clone().negate().transformDirection(B.body.matrixWorld), 55, 1.35); }
    b.f.health.hull = b.f.full.hull * 0.2; g.step(0.2, {});
    const F = L.flames, pos = F.mesh.geometry.attributes.iPos.array, near = [];
    for (let i = W.firstFlame; i < W.firstFlame + W.fires; i++) {
      const p = new V(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      near.push(Math.min(...W.scars.filter((x) => x.on).map((x) => B.body.localToWorld(new V(x.x, x.y, x.z)).distanceTo(p))));
    }
    const lit = draw().calls; F.mesh.visible = false; const dark = draw().calls; F.mesh.visible = true;
    out.fire = { flames: W.fires, near: Math.max(0, ...near).toFixed(2), draws: lit - dark };
    b.f.health.hull = b.f.full.hull * 0.6; g.step(0.2, {}); out.fire.after = W.fires;
    // a fresh raider Brig hit four times in one spot, her hull down to 40%: where her smoke comes from
    const sm = sturdy(g.raiders.spawn('brig', at(120, 320), P.heading, true)); g.step(0.05, {});
    const SH = sm.ship.hull, sq = SH.at(-1, 0.4, 1), sn = SH.normal(-1, 0.4, 1);
    for (let k = 0; k < 4; k++) L.hit(sm.ship, 'hull', sm.ship.body.localToWorld(new V(...sq).addScaledVector(sn, 0.2)), sn.clone().negate().transformDirection(sm.ship.body.matrixWorld), 55, 1.35);
    sm.f.health.hull = sm.f.full.hull * 0.4; g.fx.clear();
    const puffs = [], emit = g.fx.smoke.emit;
    g.fx.smoke.emit = (p, ...rest) => { puffs.push(p.clone()); return emit(p, ...rest); };
    try { g.step(2, {}); } finally { g.fx.smoke.emit = emit; }
    const mark = sm.ship.body.localToWorld(new V(...sq)), from = puffs.filter((p) => p.distanceTo(sm.f.pos) < 40);
    out.smoke = { puffs: from.length, there: from.length ? +(from.filter((p) => p.distanceTo(mark) < 3).length / from.length).toFixed(2) : 0 };
    // a raider Frigate in a long fight: two ten-gun broadsides into her port side (the second's shots a metre from the
    // first's, each a little more than a scar's reach from the next), then two shots into her starboard side. Every hit
    // keeps its mark: the first broadside's and the starboard ones each their own scar where they struck, the second's
    // growing the scars beside them
    const kf = sturdy(g.raiders.spawn('frigate', at(-200, 320), P.heading, true)); g.step(0.05, {});
    const KS = kf.ship, KH = KS.hull, KB = KS.body, KR = KS.recipe, KL = KH.zb - KH.zs, reach = Math.max(1.6 * 1.4 * 1.35, KL / 15), apart = (KL - 6) / 9, spots = [];
    for (const [sd, dz, n] of [[1, 0, 10], [1, 1, 10], [-1, 0, 2]]) for (let k = 0; k < n; k++) {
      const zz = KH.zs + 2 + dz + k * apart, tt = KH.tAt(zz, KR.ports.y - KR.ports.h * 0.85), qq = new V(...KH.at(zz, tt, sd)), nn = KH.normal(zz, tt, sd);
      spots.push(qq); L.hit(KS, 'hull', KB.localToWorld(qq.clone().addScaledVector(nn, 0.2)), nn.clone().negate().transformDirection(KB.matrixWorld), 55, 1.35);
    }
    const KW = L.of(KS), marks = spots.map((q) => Math.min(...KW.scars.filter((x) => x.on).map((x) => q.distanceTo(new V(x.x, x.y, x.z)))));
    out.kept = { apart: +apart.toFixed(2), reach: +reach.toFixed(2), own: marks.slice(0, 10).concat(marks.slice(20)).map((v) => +v.toFixed(2)), grown: +Math.max(...marks.slice(10, 20)).toFixed(2), scars: KW.scars.filter((x) => x.on).length };
    kf.gone = true; g.step(0.05, {}); // (taken away)
    // the Captain holed in her hull and sails, then the card between waves for 25 s: patched; then home, and out again
    g.raiders.clear(); sturdy(g.raiders.spawn('skiff', at(-3000, 0), P.heading, true)); g.waves.state = 'fight';
    const PB = P.ship.body, PW = L.of(P.ship), PH = P.ship.hull;
    for (const zz of [-4, 2]) { const tt = PH.tAt(zz, -2.5), qq = PH.at(zz, tt, 1), nn = PH.normal(zz, tt, 1); L.hit(P.ship, 'hull', PB.localToWorld(new V(...qq).addScaledVector(nn, 0.2)), nn.clone().negate().transformDirection(PB.matrixWorld), 55, 1.35); }
    // (her sails in, her wings are folded: each shot comes straight at the middle of a wing as it's drawn)
    for (const wing of P.ship.wings.slice(0, 2)) {
      const c = wing.A.clone().add(wing.B).add(wing.C).divideScalar(3), f = P.ship.U.uFold.value.x, fold = (q) => L.foldPoint(q, wing.side, wing.mz, f);
      const at = fold(c.clone().addScaledVector(wing.n, 0.3)), to = fold(c.clone());
      L.hit(P.ship, 'sails', PB.localToWorld(at.clone()), to.sub(at).normalize().transformDirection(PB.matrixWorld), 28, 1);
    }
    P.hit('hull', P.full.hull * 0.4); P.hit('sails', P.full.sails * 0.3); g.step(0.5, {});
    const before = { holes: PW.holes.filter((h) => h.on).length, scars: PW.scars.filter((x) => x.on).length };
    g.raiders.clear(); Object.assign(g.waves, { state: 'choose', choose: 1e9 }); g.step(25, {});
    const ws = (u) => Array.from(u).filter((v, i) => i % 4 === 3 && v !== 0).map((v) => +v.toFixed(2));
    out.patched = { before, holes: ws(P.ship.U.uHole.value), scars: ws(P.ship.U.uScar.value), heat: Math.max(...P.ship.U.uHeat.value) };
    // the next wave: one fresh hit in her planks, well clear of her patches, her hull down to 40%. Her smoke pours from
    // that open wound, not from the patches; and as the crew start patching again, the old patches keep their size
    const old = PW.scars.filter((x) => x.on && x.patched), sizes = old.map((x) => x.r);
    sturdy(g.raiders.spawn('skiff', at(-3000, 0), P.heading, true)); g.waves.state = 'fight';
    { const zz = 7, tt = PH.tAt(zz, -2.5), qq = PH.at(zz, tt, 1), nn = PH.normal(zz, tt, 1); L.hit(P.ship, 'hull', PB.localToWorld(new V(...qq).addScaledVector(nn, 0.2)), nn.clone().negate().transformDirection(PB.matrixWorld), 55, 1.35); }
    const fresh = PW.scars.find((x) => x.on && !x.patched), wound = new V(fresh.x, fresh.y, fresh.z);
    P.health.hull = P.full.hull * 0.4; g.fx.clear();
    const hers = [], pour = g.fx.smoke.emit;
    g.fx.smoke.emit = (p, ...rest) => { if (p.distanceTo(P.pos) < 40) hers.push(PB.worldToLocal(p.clone())); return pour(p, ...rest); };
    try { g.step(2, {}); } finally { g.fx.smoke.emit = pour; }
    out.patched.smoke = { puffs: hers.length, wound: hers.length ? +(hers.filter((p) => p.distanceTo(wound) < 2.5).length / hers.length).toFixed(2) : 0 };
    g.raiders.clear(); Object.assign(g.waves, { state: 'choose', choose: 1e9 }); g.step(0.1, {});
    const grew = () => +Math.max(0, ...old.map((x, i) => x.r - sizes[i])).toFixed(3);
    out.patched.regrew = grew(); g.step(20, {}); out.patched.regrew = Math.max(out.patched.regrew, grew());
    // home with her freshly hurt (a hit in her planks and her sails, a cluster of crystals cracked, her hull low): in port
    // she's spotless
    sturdy(g.raiders.spawn('skiff', at(-3000, 0), P.heading, true)); g.waves.state = 'fight';
    { const zz = -8, tt = PH.tAt(zz, -2.5), qq = PH.at(zz, tt, -1), nn = PH.normal(zz, tt, -1); L.hit(P.ship, 'hull', PB.localToWorld(new V(...qq).addScaledVector(nn, 0.2)), nn.clone().negate().transformDirection(PB.matrixWorld), 55, 1.35); }
    P.hit('crystals', P.full.crystals / 2 * 0.9); L.hit(P.ship, 'crystals', PB.localToWorld(g.raiders.templates.brig.zones.crystals[0].getCenter(new V())), new V(0, -1, 0), P.full.crystals / 2 * 0.9, 1);
    P.health.hull = P.full.hull * 0.2; P.health.sails = P.full.sails * 0.2; g.step(0.3, {});
    const PU = P.ship.U, worn = () => ({ scars: ws(PU.uScar.value).length, holes: ws(PU.uHole.value).length, heat: +Math.max(...PU.uHeat.value).toFixed(2), grime: +PU.uWear.value.x.toFixed(2), fray: +PU.uWear.value.y.toFixed(2),
      dim: +(1 - Math.min(...PU.uCrys.value)).toFixed(2), cracks: +Math.max(...PU.uCrack.value).toFixed(2), spark: PU.uSpark.value, flames: L.flames.count });
    out.port = { before: worn() };
    g.endVoyage(1); out.port.after = worn();
    g.fly('brig'); g.waves.timer = 1e9; g.step(0.1, {});
    out.patched.next = ws(P.ship.U.uScar.value).length + ws(P.ship.U.uHole.value).length;
    g.raiders.clear();
    return out;
  });
  console.log(`scars: three raider Frigates (${scars.programs.levels}) drawn with ${scars.programs.one} shaders for one, ${scars.programs.three} for three, each with her own looks (${scars.programs.own}); a shot through a sail (${scars.sail.part}, size ${scars.sail.size}) made a hole ${scars.sail.w} m across ${scars.sail.off} m from where it went through; one in the planks (${scars.hull.part}) a scar ${scars.hull.r} m ${scars.hull.off} m from where it struck, its embers ${scars.hull.heat.toFixed(2)} then ${scars.hull.cooled} 5 s later; sails torn to a fifth fray ${scars.fray}`);
  console.log(`scars: a Frigate's first cluster hit: brightness ${scars.crystals.crys.join(' / ')}, cracks ${scars.crystals.crack.join(' / ')}, her glows reading her own; at 30% they sputter (${scars.crystals.sputter}); the Captain's dimmed cluster's lamp at ${scars.lamps} of the other's; a raider holed to port lists ${scars.list} rad; burning at a fifth of her hull: ${scars.fire.flames} flames within ${scars.fire.near} m of her scars, in ${scars.fire.draws} draw, ${scars.fire.after} once mended to 60%; her smoke: ${Math.round(scars.smoke.there * 100)}% of ${scars.smoke.puffs} puffs from where she was hit`);
  console.log(`scars: a Frigate's long fight (two broadsides into her port side, ${scars.kept.apart} m between shots, her scars reaching ${scars.kept.reach} m, then two into her starboard side): the first broadside's and the starboard shots' scars ${scars.kept.own.join(', ')} m from where they struck, each of the second's within ${scars.kept.grown} m of one, growing it (${scars.kept.scars} scars)`);
  console.log(`scars: between waves the Captain's ${scars.patched.before.holes} holes and ${scars.patched.before.scars} scars patched (sails ${scars.patched.holes.join(', ')}; planks ${scars.patched.scars.join(', ')}), embers at ${scars.patched.heat}; hit again next wave, ${Math.round(scars.patched.smoke.wound * 100)}% of her ${scars.patched.smoke.puffs} puffs from the open wound, her old patches growing ${scars.patched.regrew} m as the crew start again; next voyage ${scars.patched.next} scars left`);
  console.log(`scars: home freshly hurt (${JSON.stringify(scars.port.before)}), in port: ${JSON.stringify(scars.port.after)}`);
  if (scars.programs.three !== scars.programs.one || scars.programs.levels !== 'middle,middle,middle' || scars.programs.own !== 3) problems.push(`three raiders of one class should share one set of shaders, each with her own looks: ${JSON.stringify(scars.programs)}`);
  if (scars.sail.part !== 'sails' || scars.sail.size !== 1 || !(scars.sail.w > 0) || !(scars.sail.off >= 0 && scars.sail.off < 0.5) || scars.sail.wing !== scars.sail.want) problems.push(`a shot through a raider's sail should hole it where it went through: ${JSON.stringify(scars.sail)}`);
  if (scars.hull.part !== 'hull' || Math.abs(scars.hull.r - 1.4) > 0.01 || !(scars.hull.heat > 0.9) || !(scars.hull.off >= 0 && scars.hull.off < 0.5) || !(scars.hull.w > 0) || !(scars.hull.cooled < 0.3)) problems.push(`a shot into a raider's planks should scar them where it struck, its embers cooling within 5 s: ${JSON.stringify(scars.hull)}`);
  if (!(scars.fray > 0.3)) problems.push(`sails torn to a fifth should fray: ${scars.fray}`);
  const cr = scars.crystals;
  if (!(cr.crys[0] < 0.6) || cr.crys[1] !== 1 || cr.crys[2] !== 1 || !(cr.crack[0] > 0) || cr.crack[1] || !cr.glows || cr.sputter !== '0.25/1') problems.push(`a hit cluster of crystals should dim and crack alone, and all sputter below a third: ${JSON.stringify(cr)}`);
  if (!(scars.lamps < 0.5)) problems.push(`the lamp of the Captain's dimmed cluster should dim with it: ${scars.lamps} of the other's`);
  if (!(scars.list < -0.03)) problems.push(`a raider badly holed in her port side should list to port: ${scars.list} rad`);
  if (!(scars.fire.flames >= 2) || !(+scars.fire.near <= 1.2) || scars.fire.draws !== 1 || scars.fire.after !== 0) problems.push(`a raider below a quarter of her hull should burn from her worst scars, in one draw, and not once mended: ${JSON.stringify(scars.fire)}`);
  if (!(scars.smoke.puffs >= 5) || !(scars.smoke.there > 0.6)) problems.push(`a damaged raider's smoke should come from where she was hit: ${JSON.stringify(scars.smoke)}`);
  const pt = scars.patched;
  if (!pt.before.holes || !pt.before.scars || pt.holes.length !== pt.before.holes || pt.holes.some((v) => v >= 0) || pt.scars.length !== pt.before.scars || pt.scars.some((v) => v >= 0) || pt.heat !== 0 || pt.next !== 0) problems.push(`between waves the Captain's holes should be patched and her embers out, and the next voyage she should be as good as new: ${JSON.stringify(pt)}`);
  const kp = scars.kept;
  if (kp.own.length !== 12 || kp.own.some((v) => !(v < 0.3)) || !(kp.grown <= kp.reach) || !(kp.apart > kp.reach)) problems.push(`a ship in a long fight should keep a mark of every hit, the first ones where they struck: ${JSON.stringify(kp)}`);
  if (!(pt.smoke.puffs >= 5) || !(pt.smoke.wound > 0.9)) problems.push(`the Captain's smoke should pour from her open wound, not her patches: ${JSON.stringify(pt.smoke)}`);
  if (!(pt.regrew <= 0.001)) problems.push(`a patch from an earlier wave should keep its size as the crew start patching again: grew ${pt.regrew} m`);
  const pb = scars.port.before, pa = scars.port.after;
  if (!pb.scars || !(pb.heat > 0.5) || !(pb.grime > 0) || !(pb.fray > 0) || !(pb.dim > 0) || !(pb.cracks > 0)) problems.push(`the Captain should come home freshly hurt for the port test: ${JSON.stringify(pb)}`);
  if (pa.scars || pa.holes || pa.heat || pa.grime || pa.fray || pa.dim || pa.cracks || pa.spark !== 1 || pa.flames) problems.push(`in port the Captain's ship should be spotless: ${JSON.stringify(pa)}`);

  // ---------- ships that move like they're alive (src/ship/dress.js, looks.js, wakes.js, livery.js) ----------
  // her wings fold back as she takes in sail and spread as she sets it (a Surge snaps them right open); her pennants
  // follow her speed; her lids are shut in calm, and as a wave arrives they fly open and her guns run out; her
  // broadside's guns kick back in on the model each at its own turn as the side ripples off (the model's turns the very
  // ones guns.js fires them at), stay in while she reloads and run out again once loaded; a raider readying a broadside
  // opens her lids on that side before it goes off; a shot through the middle of a raider's folded wing holes the
  // canvas where it went through; every ship's wake drawn in one go behind her (and a raider's 1.6 km off still
  // glowing), with no new shaders for a captain's and a treasure ship's colours; a Man-o'-war's column blown out once,
  // dark, and her dipping at that end
  const life = await page.evaluate(() => {
    const g = window.__game, out = {}, rr = g.renderer, V = g.camera.position.constructor, L = g.looks;
    g.progress.data.skies = 'cross';
    g.fly('frigate'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player, U = P.ship.U; P.pos.set(0, 900, 0); P.heading = 0; g.step(0.1, {});
    // the wings and pennants
    P.speed = P.H.vmax; P.sail = 1; g.step(1.5, { sail: 1 }); out.fold = { fast: +U.uWind.value.x.toFixed(2) };
    g.step(5, { sail: -1 }); out.fold.in = +U.uFold.value.x.toFixed(2); out.fold.slow = +U.uWind.value.x.toFixed(2);
    g.step(4, { sail: 1 }); out.fold.out = +U.uFold.value.x.toFixed(2);
    P.startSurge(); g.step(0.5, { sail: 1 }); out.fold.surge = +U.uFold.value.x.toFixed(2); g.step(3, {});
    const w = P.ship.wings.find((q) => q.top && q.side > 0);
    out.fold.aft = +(L.foldPoint(w.tip.clone(), 1, w.mz, 0).z - L.foldPoint(w.tip.clone(), 1, w.mz, 1).z).toFixed(2);
    // (the rig of her port guns, kind 3, port side +x: each one's turn as her side fires, first to last)
    const rig = [], seen = new Set(), geo = P.ship.body.children.find((o) => o.name === 'rigMetal').geometry.attributes.rig;
    for (let i = 0; i < geo.count; i++) if (geo.getX(i) === 3 && geo.getY(i) > 0) { const k = geo.getZ(i).toFixed(4); if (!seen.has(k)) { seen.add(k); rig.push([3, geo.getY(i), geo.getZ(i), geo.getW(i)]); } }
    rig.sort((a, b) => a[2] - b[2]);
    // her lids: shut in calm. Her port side fired in calm: its lids burst open with its first gun, which goes off run out
    // (as drawn the moment it fires), and they shut again a while after. A wave arriving (wave 1, a Skiff, far off): open
    // and her guns out within two seconds
    out.lids = { calm: +U.uGun.value.x.toFixed(2) };
    g.cam.yaw = Math.PI / 2; g.cam.pitch = 0; g.step(1 / 60, { locked: true });
    let shots = 0; const offC = g.events.on('fire', (e) => { if (e.owner === 'player' && e.battery === 'port') shots++; });
    g.step(1 / 60, { fire: true, locked: true }); offC();
    out.lids.first = { shots, lid: +U.uGun.value.x.toFixed(2), gunIn: +L.gunIn(U, rig[0], g.time).toFixed(2) };
    g.cam.yaw = 0; g.step(10, { locked: true }); out.lids.shutAgain = +U.uGun.value.x.toFixed(2);
    g.waves.timer = 0.05; g.step(2, { locked: true }); out.lids.fight = [+U.uGun.value.x.toFixed(2), +U.uGun.value.y.toFixed(2)]; out.lids.state = g.waves.state;
    for (const r of g.raiders.list) { r.frozen = true; r.f.pos.set(0, 900, -4000); for (const k of ['hull', 'sails', 'crystals']) r.f.full[k] = r.f.health[k] = 1e6; }
    // her port broadside, in steps of a 60th of a second: each gun's 'fire' and the moment its gun on the model kicks
    // back
    const turns = g.gunnery.B.port.map((q) => q.delay).filter((d, i, a) => a.indexOf(d) === i).sort((a, b) => a - b);
    out.turns = { model: rig.map((q) => +q[2].toFixed(3)).join(), guns: turns.map((d) => +d.toFixed(3)).join() };
    const fired = [], off = g.events.on('fire', (e) => { if (e.owner === 'player' && e.battery === 'port') fired.push({ i: e.i, t: g.time }); });
    g.cam.yaw = Math.PI / 2; g.cam.pitch = 0; g.step(1 / 60, { locked: true });
    const kicked = rig.map(() => null), t0 = g.time;
    for (let f = 0; f < 60; f++) {
      g.step(1 / 60, { fire: f === 0, locked: true });
      rig.forEach((q, i) => { if (kicked[i] === null && L.gunIn(U, q, g.time) > Math.abs(q[1]) * 0.15) kicked[i] = g.time; });
    }
    off();
    // (each gun's shot, matched to its turn: a broadside's guns fire both decks at once, but a Frigate has one)
    const byTurn = turns.map((d) => fired.filter((x) => Math.abs(g.gunnery.B.port[x.i].delay - d) < 1e-6).map((x) => x.t)[0]);
    out.ripple = { shots: fired.length, lag: Math.max(...byTurn.map((t, i) => Math.abs((kicked[i] ?? 99) - t))).toFixed(3), first: +((kicked[0] ?? 99) - t0).toFixed(3), last: +((kicked[kicked.length - 1] ?? 99) - t0).toFixed(3) };
    out.ripple.inM = +L.gunIn(U, rig[0], g.time).toFixed(2);
    g.step(g.gunnery.reload('port') + 0.3, { locked: true }); out.ripple.outAgain = +L.gunIn(U, rig[0], g.time).toFixed(2);
    // a raider Brig alongside readying a broadside: her lids on that side open, and her guns out, before it goes off
    g.raiders.setAI(true);
    const rb = g.raiders.spawn('brig', P.pos.clone().add(new V(250, 0, 30)), Math.PI, false);
    for (const k of ['hull', 'sails', 'crystals']) rb.f.full[k] = rb.f.health[k] = 1e6;
    let ready = null;
    for (let t = 0; t < 14 && !ready; t += 1 / 30) {
      g.step(1 / 30, { locked: true });
      if (rb.charge.b && rb.charge.t < 0.03) { const s = rb.charge.b === 'port' ? 0 : 1; ready = { side: rb.charge.b, open: +rb.ship.U.uGun.value.getComponent(s).toFixed(2) }; }
    }
    out.raider = ready ?? { side: null };
    g.raiders.setAI(false); g.raiders.clear();
    // a shot through the middle of a raider's folded wing (a frozen Brig with her sails in: her wings fold back)
    const fb = g.raiders.spawn('brig', P.pos.clone().add(new V(0, 0, 220)), 0, true);
    for (const k of ['hull', 'sails', 'crystals']) fb.f.full[k] = fb.f.health[k] = 1e6;
    fb.f.sail = 0; g.step(3, { locked: true });
    const B = fb.ship, fw = B.wings.find((q) => q.top && q.side > 0), mid = fw.A.clone().add(fw.B).add(fw.C).divideScalar(3).addScaledVector(fw.n, fw.belly);
    // (from in front of the wing's face as it's drawn, folded: straight through it)
    const fold = B.U.uFold.value.x, drawn = L.foldPoint(mid.clone(), 1, fw.mz, fold), face = L.foldPoint(mid.clone().add(fw.n), 1, fw.mz, fold).sub(drawn).normalize();
    const target = B.body.localToWorld(drawn.clone()), from = B.body.localToWorld(drawn.clone().addScaledVector(face, 60));
    const parts = [], off2 = g.events.on('hit', (e) => { if (e.raider === fb) parts.push(e.part); });
    g.bolts.fire(from, target.clone().sub(from).normalize(), 'chaser', 'player', null, 1);
    for (let t = 0; t < 1 && g.bolts.bolts.length; t += 0.05) g.step(0.05, { locked: true });
    off2();
    const hole = L.of(B).holes.find((h) => h.on);
    out.folded = { fold: +fold.toFixed(2), part: parts[0], off: hole ? +mid.distanceTo(new V(hole.x, hole.y, hole.z)).toFixed(2) : -1 };
    g.raiders.clear();
    // the wakes: the Captain's (and her two vapour trails), each raider's, all in one draw; one 1.6 km off still glowing
    const rs = [g.raiders.spawn('brig', P.pos.clone().add(new V(-150, -40, 500)), Math.PI / 2, false), g.raiders.spawn('cutter', P.pos.clone().add(new V(0, -60, 1600)), Math.PI / 2, false)];
    for (const r of rs) { r.f.sail = 1; r.f.speed = r.f.H.vmax; }
    g.waves.timer = 1e9; g.waves.state = 'calm'; g.cam.yaw = 0; g.step(2.5, { sail: 1, locked: true });
    const draw = () => { rr.render(g.scene, g.camera); return rr.info.render.calls; };
    // (and the pictures with and without them: of the pixels the wakes change, how many burn out to white-gold, the
    // brightest of their colours at the top where it wasn't before; her own, which the camera looks straight down, is
    // most of them)
    const cv = rr.domElement, k2 = document.createElement('canvas'), x2 = k2.getContext('2d', { willReadFrequently: true }); k2.width = cv.width; k2.height = cv.height;
    const px = () => { x2.drawImage(cv, 0, 0); return x2.getImageData(0, 0, k2.width, k2.height).data; };
    const seenW = draw(), withW = px(); g.wakes.mesh.visible = false; const hidden = draw(), noW = px(); g.wakes.mesh.visible = true;
    let wakePx = 0, burnt = 0;
    for (let i = 0; i < withW.length; i += 4) {
      if (Math.max(Math.abs(withW[i] - noW[i]), Math.abs(withW[i + 1] - noW[i + 1]), Math.abs(withW[i + 2] - noW[i + 2])) <= 16) continue;
      wakePx++; if (Math.max(withW[i], withW[i + 1], withW[i + 2]) >= 254 && Math.max(noW[i], noW[i + 1], noW[i + 2]) < 254) burnt++;
    }
    const mine = g.wakes.of(P), far = g.wakes.of(rs[1].f);
    out.wakes = { ...g.wakes.stats(), draws: seenW - hidden, length: +mine.length.toFixed(1), speed: +P.speed.toFixed(1), mine: mine.color.toString(16), far: far ? +far.bright.toFixed(2) : 0, farKind: far?.kind, farAt: Math.round(rs[1].f.pos.distanceTo(P.pos)),
      pixels: +(wakePx / (withW.length / 4) * 100).toFixed(2), burnt: +(burnt / Math.max(1, wakePx) * 100).toFixed(1) };
    // a raider captain's and a treasure ship's colours: no new shaders (after a crew Brig's); her iron, her banner
    g.raiders.clear(); g.raiders.spawn('brig', P.pos.clone().addScaledVector(P.forward(), 300).add(new V(-60, 0, 0)), 0, true); g.step(0.05, { locked: true }); draw();
    const p0 = rr.info.programs.length;
    const ahead = (d, x, y) => P.pos.clone().addScaledVector(P.forward(), d).add(new V(x, y, 0));
    const cb = g.raiders.spawn('brig', ahead(300, 60, 0), 0, true, true), tb = g.raiders.spawn('brig', ahead(330, 0, 30), 0, true, false, true);
    g.step(0.05, { locked: true }); draw();
    out.colours = { inView: [cb, tb].every((r) => { const q = r.f.pos.clone().project(g.camera); return Math.abs(q.x) < 1 && Math.abs(q.y) < 1 && q.z < 1; }) };
    Object.assign(out.colours, { programs: rr.info.programs.length - p0, captain: cb.livery, treasure: tb.livery, role: tb.role, wake: g.wakes.of(tb.f)?.kind, iron: g.raiders.templates['brig:captain'].mid.M.brass.color.getHexString() });
    // a treasure Brig's glints on metal that moves (a spike at a yard's tip, a gun) carry its rig, so they move with it
    const TB = g.raiders.templates['brig:treasure'].mid, gl = TB.glow.geometry.attributes, rm = TB.body.children.find((o) => o.name === 'rigMetal').geometry.attributes;
    let onRig = 0, unrigged = 0;
    for (let i = 0; i < gl.kind.count; i++) {
      if (gl.kind.getX(i) !== 3) continue;
      for (let j = 0; j < rm.position.count; j++) {
        if (Math.abs(rm.position.getX(j) - gl.position.getX(i)) > 1e-4 || Math.abs(rm.position.getY(j) - gl.position.getY(i)) > 1e-4 || Math.abs(rm.position.getZ(j) - gl.position.getZ(i)) > 1e-4) continue;
        if (rm.rig.getX(j) > 0.5) { onRig++; if ([0, 1, 2, 3].some((c) => Math.abs(rm.rig.getComponent(j, c) - gl.rig.getComponent(i, c)) > 1e-4)) unrigged++; }
        break;
      }
    }
    out.colours.glints = { onRig, unrigged };
    // a wave with a treasure Brig in it (any class can sail as one): told as a treasure ship's wave, her sails to shoot,
    // with the treasure ship's sound; the Brig in a treasure ship's colours, running, and her hold worth a Galleon's
    // (◆ 300, five times a crew Brig's bounty: she plays the Galleon's part until the Captain owns one). A wave led by a
    // Galleon captain: she runs, as every Galleon does, so she comes in close (about 1.2 km off)
    // and across the Captain's path, in a captain's colours
    const told = [], offT = g.events.on('wave:start', (e) => told.push({ title: e.title, prize: e.prize }));
    const comes = (wave) => { g.raiders.clear(); Object.assign(g.waves, { n: 7, state: 'calm', timer: 0.05, next: wave }); g.step(0.1, { locked: true }); };
    comes({ ids: ['brig', 'cutter'], treasure: [0], captain: -1 });
    const tbr = g.raiders.list.find((r) => r.id === 'brig'), crewBrig = g.raiders.spawn('brig', ahead(600, 0, 0), 0, true);
    out.treasureWave = { ...told.at(-1), line: document.getElementById('banner-line').textContent, role: tbr?.role, livery: tbr?.livery, hold: tbr?.bounty, bounty: tbr ? +(tbr.bounty / crewBrig.bounty).toFixed(2) : 0 };
    comes({ ids: ['galleon', 'cutter'], captain: 0 });
    const gc = g.raiders.list.find((r) => r.id === 'galleon'), toGc = Math.atan2(gc.f.pos.x - P.pos.x, gc.f.pos.z - P.pos.z);
    out.galleonCaptain = { ...told.at(-1), captain: gc.captain, livery: gc.livery, role: gc.role, d: Math.round(Math.hypot(gc.f.pos.x - P.pos.x, gc.f.pos.z - P.pos.z)), across: +Math.abs(Math.sin(gc.f.heading - toGc)).toFixed(2) };
    offT(); g.raiders.clear(); Object.assign(g.waves, { state: 'calm', timer: 1e9, next: null });
    // a Man-o'-war's second column given its share and one more: it blows out, once; dark; she dips at that end
    g.raiders.clear();
    const m = g.raiders.spawn('manowar', P.pos.clone().add(new V(0, -30, 420)), Math.PI / 2, true);
    for (const k of ['hull', 'sails']) m.f.full[k] = m.f.health[k] = 1e6;
    g.step(0.05, {});
    let blown = 0; const off3 = g.events.on('blowout', (e) => { if (e.raider === m) blown++; });
    const share = m.f.full.crystals / m.R.clusters.length, c1 = m.zones.crystals[1].getCenter(new V());
    m.f.hit('crystals', share + 1); L.hit(m.ship, 'crystals', m.ship.body.localToWorld(c1), new V(0, -1, 0), share + 1, 1);
    const rx = m.ship.body.rotation.x;
    g.step(2, {}); off3();
    out.blowout = { told: blown, crys: Array.from(m.ship.U.uCrys.value.slice(0, 5)).map((v) => +v.toFixed(2)), dip: +(m.f.trim).toFixed(3), side: Math.sign(m.R.clusters[1].z) };
    g.raiders.clear();
    return out;
  });
  const LF = life;
  console.log(`alive: her wings folded ${LF.fold.in} with her sails in, ${LF.fold.out} set, ${LF.fold.surge} in a Surge (a tip ${LF.fold.aft} m further aft folded); her pennants ${LF.fold.slow} slow, ${LF.fold.fast} at speed; her lids ${LF.lids.calm} in calm, ${LF.lids.first.lid} as her side fired in calm (${LF.lids.first.shots} shot, its gun ${LF.lids.first.gunIn} m in) and ${LF.lids.shutAgain} again 10 s later, ${LF.lids.fight.join('/')} as the wave came (${LF.lids.state})`);
  console.log(`alive: a Frigate's port broadside: the model's turns ${LF.turns.model} (the guns' ${LF.turns.guns}); ${LF.ripple.shots} shots, each gun kicking back within ${LF.ripple.lag} s of its shot (the first ${LF.ripple.first} s in, the last ${LF.ripple.last} s), ${LF.ripple.inM} m in, ${LF.ripple.outAgain} m once loaded; a raider readying her ${LF.raider.side} broadside, her lids at ${LF.raider.open} of 2`);
  console.log(`alive: a shot through a raider's folded wing (folded ${LF.folded.fold}) hit her ${LF.folded.part}, holed ${LF.folded.off} m from where it went through; ${LF.wakes.trails} wakes (${LF.wakes.points} points) in ${LF.wakes.draws} draw, hers #${LF.wakes.mine} ${LF.wakes.length} m long at ${LF.wakes.speed} m/s, a ${LF.wakes.farKind}'s ${LF.wakes.farAt} m off at ${LF.wakes.far}, ${LF.wakes.pixels}% of the picture with ${LF.wakes.burnt}% of it burnt out; a captain's and a treasure ship's colours ${LF.colours.programs} new shaders (#${LF.colours.iron} iron; a ${LF.colours.treasure} ${LF.colours.role} with a ${LF.colours.wake} wake); a Man-o'-war's column blown out ${LF.blowout.told} time(s): ${LF.blowout.crys.join(' / ')}, dipping ${LF.blowout.dip} rad`);
  if (!(LF.fold.in > 0.9) || !(LF.fold.out < 0.1) || !(LF.fold.surge < 0) || !(LF.fold.aft >= 3)) problems.push(`her wings should fold with her sails in, spread with them set and snap open in a Surge: ${JSON.stringify(LF.fold)}`);
  if (!(LF.fold.slow < 0.2) || !(LF.fold.fast > 0.7)) problems.push(`her pennants should follow her speed: ${JSON.stringify(LF.fold)}`);
  if (!(LF.lids.calm < 0.05) || !(LF.lids.fight[0] > 1.95 && LF.lids.fight[1] > 1.95) || LF.lids.state !== 'fight') problems.push(`her lids should be shut in calm, and open with her guns out as a wave comes: ${JSON.stringify(LF.lids)}`);
  if (!(LF.lids.first.shots >= 1) || !(LF.lids.first.lid > 1.99) || !(LF.lids.first.gunIn < 0.2) || !(LF.lids.shutAgain < 0.05)) problems.push(`a side fired in calm should burst its lids open with its first gun, run out as it fires, and shut them again later: ${JSON.stringify(LF.lids)}`);
  if (LF.turns.model !== LF.turns.guns || LF.ripple.shots !== 10 || !(+LF.ripple.lag <= 0.05) || !(LF.ripple.inM > 0.3) || !(LF.ripple.outAgain < 0.05)) problems.push(`her broadside's guns should kick back on the model each as it fires, and run out again once loaded: ${JSON.stringify({ turns: LF.turns, ripple: LF.ripple })}`);
  if (!LF.raider.side || !(LF.raider.open > 1.5)) problems.push(`a raider readying a broadside should open her lids on that side first: ${JSON.stringify(LF.raider)}`);
  if (!(LF.folded.fold > 0.9) || LF.folded.part !== 'sails' || !(LF.folded.off >= 0 && LF.folded.off < 0.6)) problems.push(`a shot through a folded wing should hole the sail where it went through: ${JSON.stringify(LF.folded)}`);
  if (LF.wakes.draws !== 1 || LF.wakes.trails !== 5 || LF.wakes.mine !== 'ffc860' || !(LF.wakes.length > 0.8 * LF.wakes.speed * 1.5) || !(LF.wakes.far > 0.2) || !(LF.wakes.farAt > 1400) || !(LF.wakes.pixels > 0.05) || !(LF.wakes.burnt < 10)) problems.push(`every ship's wake should be drawn in one go behind her, soft (never burnt out to white-gold), a raider's far off still glowing: ${JSON.stringify(LF.wakes)}`);
  if (!LF.colours.inView || LF.colours.programs !== 0 || LF.colours.captain !== 'captain' || LF.colours.treasure !== 'treasure' || LF.colours.role !== 'prize' || LF.colours.wake !== 'treasure' || LF.colours.iron !== '2c2a2e') problems.push(`a raider captain's and a treasure Brig's colours should need no new shaders: ${JSON.stringify(LF.colours)}`);
  console.log(`alive: a treasure Brig's ${LF.colours.glints.onRig} glints on metal that moves, ${LF.colours.glints.unrigged} not moving with it; a wave with a treasure Brig told "${LF.treasureWave.title}" (${LF.treasureWave.line}), her colours ${LF.treasureWave.livery}, ${LF.treasureWave.role === 'prize' ? 'running' : 'NOT RUNNING'}, her hold ◆ ${LF.treasureWave.hold} (${LF.treasureWave.bounty} times a crew Brig); a Galleon captain's wave told "${LF.galleonCaptain.title}", her colours ${LF.galleonCaptain.livery}, coming in ${LF.galleonCaptain.d} m off and ${LF.galleonCaptain.across > 0.9 ? 'across' : 'NOT ACROSS'} the Captain's path`);
  if (!(LF.colours.glints.onRig >= 1) || LF.colours.glints.unrigged) problems.push(`a treasure ship's glints on metal that moves should move with it: ${JSON.stringify(LF.colours.glints)}`);
  const TW = LF.treasureWave, GC = LF.galleonCaptain;
  if (!TW.title?.includes('a treasure ship') || !TW.prize || !TW.line.includes('shoot her sails') || TW.role !== 'prize' || TW.livery !== 'treasure' || TW.hold !== 300 || TW.bounty !== 5) problems.push(`a wave with a treasure Brig should be told as a treasure ship's wave, and she should run in her colours, her hold worth a Galleon's ◆ 300: ${JSON.stringify(TW)}`);
  if (!GC.title?.includes('a treasure ship') || !GC.prize || !GC.captain || GC.livery !== 'captain' || GC.role !== 'prize' || !(GC.d > 1050 && GC.d < 1450) || !(GC.across > 0.9)) problems.push(`a Galleon captain runs, so she should come in close, across the Captain's path: ${JSON.stringify(GC)}`);
  if (LF.blowout.told !== 1 || LF.blowout.crys.join() !== '1,0,1,1,1' || !(Math.sign(LF.blowout.dip) === LF.blowout.side && Math.abs(LF.blowout.dip) > 0.005)) problems.push(`a Man-o'-war's column given out should blow out once, go dark, and dip her at that end: ${JSON.stringify(LF.blowout)}`);

  // ---------- reading a fight from afar: raiders' glows, scars and fire, far wakes, stacked tags, the storm on its way ----------
  {
    const ga = await glowScales(page); await sized(page, 1200, 760, 'laptop'); const gb = await glowsAgain(page); await sized(page, 1280, 800, 'laptop');
    console.log(`reading a fight from afar: ${glowProblems(ga, gb, 'laptop')}; ${fireProblems(await fireAt(page), 'laptop')}; ${wakeProblems(await wakesFar(page), 'laptop', { screen: 60, pixels: 300 })}; ${hiddenWakeProblems(await hiddenWake(page), 'laptop')}; ${tagProblems(await tagsAt(page), 'laptop')}; ${tagEdgeProblems(await tagEdges(page), 'laptop')}`);
    const SW = await stormWall(page);
    console.log(`the storm on its way: a wall of cloud whose crest shows in ${Math.round(SW.found * 100)}% of the view, heaped ${SW.heaped} px high and low, its tops at ${SW.top} against its foot at ${SW.foot}, its crests moving ${SW.moved} px in two minutes, lumpy all along (${SW.lumps} px), and looking due north its crest stepping at most ${SW.seam.join(' / ')} px from one column to the next`);
    if (!(SW.found >= 0.7) || !(SW.heaped >= 20) || !(SW.top >= SW.foot * 1.5) || !(SW.moved >= 3) || !(SW.lumps >= 1.35)) problems.push(`the storm on its way should be a billowing wall of cloud (its crest lit against the sky, heaped, lumpy all along, lighter on top than at its foot, and moving): ${JSON.stringify(SW)}`);
    if (!(Math.max(...SW.seam) <= 4)) problems.push(`the storm's wall should have no seam round the sky (looking due north, where the directions round the sky start again, its crest should step at most 4 px from one column to the next): ${JSON.stringify(SW.seam)}`);
  }
  // ---------- storms, clouds you fly through and hide in, and a sky with depth (sky.js, weather.js, world.js) ----------
  // The cloud floor worked out in JavaScript (where a ship can hide) agrees with the graphics card's own picture at 64
  // places (the card reading the baked picture at its finest): on average within 0.03. Which waves storm: none on Fair
  // Winds, waves 8 and 13 on Crosswinds, 4, 8 and 12 on the Maelstrom; a storm wave and every third come out of a bank
  // of cloud. The card before a storm wave says it's coming (and the storm shows on the horizon); wave 4 on the
  // Maelstrom storms: 25 s in, the storm is in, rain falling, the cloud thicker and the wind 16% or more; 30 s more
  // brings two lightning strikes or more (each told, with its thunder); the storm draws in at most two more goes than the
  // clear sky (the rain and the scud; the lightning's own only while it shows); beaten, the storm clears within 25 s.
  // Wave 3 on Crosswinds comes out of a bank of cloud: each of its six drawn at the place and size the game reckons
  // (where it hides ships), changing a tenth of the picture or more looking at it; beaten, the bank fades within 5 s.
  // Inside a big cloud: the mist (its veil showing, the haze closing in under 600 m), and 2 km off and 500 m up, gone.
  // Hiding in the cloud floor: 15 m under its top in thick cloud, a raider 500 m off who never saw her there fires not
  // once in 10 s; out of it, 250 m over it, the raider fires within 15 s; a broadside from the cloud gives her away
  // for 4 s (told as she hides and as she's given away). A raider hidden in cloud far off is lost: no locking on to her,
  // her tag saying so, and giving how far off the spot she was last seen is (not where she's moved on to in the cloud);
  // readying a broadside she shows herself (her tag at her, with her own distance), lost again once it's fired. Inside
  // a cloud (seen), the raiders' shots land less than 60% as often as outside it, with the same luck. The region's air:
  // the Sunscorch Wastes warmer and dusty, with its line under the name; the Ironspire Peaks colder and snowing; a storm
  // over the Wastes' dust brings its rain in from nothing (never more shown than falling), all of it within 20 s. The glory and her shadow on the cloud follow her; the towering clouds make the horizon
  // uneven; the sun's glare shows looking into the sun, and goes looking away or behind a cloud
  const sky = await page.evaluate(() => {
    const g = window.__game, out = {}, M = g.world.mood;
    const seeded = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };
    // the cloud floor, worked out in JavaScript and by the card
    const pts = Array.from({ length: 64 }, (_, i) => ({ x: (i % 8) * 1937 - 7000 + (i * 131) % 400, z: Math.floor(i / 8) * 1711 - 6000 + (i * 97) % 300 }));
    const T = 123.4, card = g.world.coverOnCard(pts, T, 0), js = pts.map((p) => g.world.coverAt(p.x, p.z, T, 0));
    const diffs = js.map((v, i) => Math.abs(v - card[i]));
    out.cover = { mean: +(diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(4), most: +Math.max(...diffs).toFixed(3), thick: js.filter((v) => v > 0.7).length };
    // which waves storm, on each skies
    const storms = (id) => Array.from({ length: 15 }, (_, n) => g.waveAt(n, 0, g.SKIES[id].storms)).map((w, n) => (w.storm ? n + 1 : 0)).filter(Boolean).join(' ');
    out.storms = { fair: storms('fair'), cross: storms('cross'), mael: storms('mael'), banks: Array.from({ length: 9 }, (_, n) => g.waveAt(n, 0, g.SKIES.cross.storms)).map((w, n) => (w.bank ? n + 1 : 0)).filter(Boolean).join(' ') };
    // the storm wave on the Maelstrom: the card before it, then the wave
    g.progress.data.skies = 'mael'; g.fly('brig'); g.raiders.setAI(false); const P = g.player; P.full.hull = P.health.hull = 1e6;
    P.pos.set(1500, 900, -800); P.heading = 0.4; g.cam.yaw = 0; g.cam.pitch = 0.15;
    const told = {}; const offs = ['storm', 'lightning', 'gust', 'hidden'].map((k) => g.events.on(k, (e) => { told[k] = (told[k] ?? 0) + 1; if (k === 'storm') told[e.stage] = (told[e.stage] ?? 0) + 1; }));
    try {
      Object.assign(g.waves, { n: 2, state: 'fight', next: null }); g.raiders.clear(); g.step(0.1, {});
      out.card = document.getElementById('calm-line').textContent; out.front = g.sky.weather.frontWant;
      g.sailOn(); const calls = () => { g.renderer.render(g.scene, g.camera); return g.renderer.info.render.calls; };
      Object.assign(g.waves, { n: 3, state: 'calm', timer: 0.1, next: null });
      g.step(25, {}, 1 / 30);
      const W = g.sky.weather;
      out.storm = { storm: +W.storm.toFixed(2), rain: g.sky.air.mesh.visible && g.sky.air.kind === 'rain', cover: +M.uCover.value.toFixed(3), wind: +g.wind.strength.toFixed(3), wave: g.waves.n + 1, raiders: g.raiders.list.length };
      // (the storm's own draws: the frame as it is, against the same frame with its weather hidden)
      W.strike = 99; g.sky.bolt.clear(); g.step(0.05, {}); out.stormCalls = calls();
      const S = g.sky, shown = [S.air.mesh, S.scud.mesh, S.bolt.mesh, S.veil.mesh, S.glare.mesh].map((m) => m.visible);
      [S.air.mesh, S.scud.mesh, S.bolt.mesh, S.veil.mesh, S.glare.mesh].forEach((m) => { m.visible = false; }); out.clearCalls = calls();
      [S.air.mesh, S.scud.mesh, S.bolt.mesh, S.veil.mesh, S.glare.mesh].forEach((m, i) => { m.visible = shown[i]; }); W.strike = 1;
      const n0 = g.sky.lightningCount; g.step(30, {}, 1 / 30); out.storm.lightning = g.sky.lightningCount - n0;
      for (const r of g.raiders.list) r.f.hit('hull', 1e9);
      g.step(0.5, {}); out.storm.beaten = g.waves.state; g.step(25, {}, 1 / 30); out.storm.after = +W.storm.toFixed(3);
      g.raiders.clear(); g.waves.timer = 1e9; g.waves.state = 'calm';
      // the bank of cloud wave 3 on Crosswinds comes out of: drawn where the game reckons it is (each of the six drawn at
      // the place and size the hiding reads), and changing the picture looking at it (against the same frame without
      // it); beaten, the wave's bank fades away
      g.progress.data.skies = 'cross'; g.sky.reset(); P.pos.set(1500, 900, -800); P.heading = 0.4;
      Object.assign(g.waves, { n: 2, state: 'calm', timer: 0.01, next: null }); g.step(3, {}, 1 / 30);
      {
        const pf = g.world.puffs, GA = pf.mesh.geometry.attributes, c = new P.pos.constructor(), mid = new P.pos.constructor();
        let off = 0;
        for (let i = 0; i < pf.BANK; i++) { pf.positionOf(i, c); mid.add(c); off = Math.max(off, Math.abs(GA.offset.getX(i) - c.x), Math.abs(GA.offset.getY(i) - c.y), Math.abs(GA.offset.getZ(i) - c.z), Math.abs(GA.size.getX(i) - pf.sizeOf(i))); }
        mid.divideScalar(pf.BANK);
        const look = mid.clone().sub(g.camera.position).normalize();
        g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading; g.step(0.05, {});
        const gl = g.renderer.getContext(), Wd = g.renderer.domElement.width, Ht = g.renderer.domElement.height;
        const frame = () => { g.renderer.render(g.scene, g.camera); const px = new Uint8Array(Wd * Ht * 4); gl.readPixels(0, 0, Wd, Ht, gl.RGBA, gl.UNSIGNED_BYTE, px); return px; };
        const U = pf.mesh.material.uniforms.uBank, withBank = frame(); U.value = 0; const without = frame(); U.value = pf.banked;
        let changed = 0;
        for (let i = 0; i < withBank.length; i += 4) if (Math.abs(withBank[i] - without[i]) + Math.abs(withBank[i + 1] - without[i + 1]) + Math.abs(withBank[i + 2] - without[i + 2]) > 24) changed++;
        out.bank = { wave: g.waves.n + 1, banked: pf.banked, off: +off.toFixed(3), smallest: Math.round(Math.min(...Array.from({ length: pf.BANK }, (_, i) => GA.size.getX(i)))), changed: +(changed / (Wd * Ht)).toFixed(3), inside: +pf.inside(mid).toFixed(2) };
        for (const r of g.raiders.list) r.f.hit('hull', 1e9);
        g.step(0.5, {}); out.bank.beaten = g.waves.state; g.step(4.5, {}, 1 / 30); out.bank.after = pf.banked; out.bank.insideAfter = +pf.inside(mid).toFixed(2);
        g.raiders.clear(); g.waves.timer = 1e9; g.waves.state = 'calm';
      }
      // inside a big cloud, and out of it
      g.progress.data.skies = 'cross'; g.sky.reset();
      const k = g.world.puffs.BANK + 30, at = () => g.world.puffs.positionOf(k, P.pos);
      for (let i = 0; i < 5; i++) { at(); P.speed = 0; g.step(0.1, {}); }
      out.inside = { inCloud: +g.sky.inCloud.toFixed(2), veil: g.sky.veil.mesh.visible, far: Math.round(g.scene.fog.far), mist: +M.uMist.value.toFixed(2) };
      // ...and the raiders aiming at her there (seen: her guns just gave her away), against out in the open sky, with
      // the same luck
      const shots = (inCloud) => {
        const rnd = Math.random; Math.random = seeded(7);
        let hits = 0; const off = g.events.on('hit', (e) => { if (e.target === 'player') hits++; });
        try {
          g.raiders.clear(); g.sky.reset();
          if (inCloud) at(); else P.pos.set(-9000, 1800, -6500);
          const spot = P.pos.clone(); P.heading = 0; P.speed = 0;
          g.raiders.setAI(true);
          for (const [a, d] of [[1.6, 320], [-1.5, 360]]) g.raiders.spawn('frigate', spot.clone().add({ x: Math.sin(a) * d, y: 10, z: Math.cos(a) * d }), a + Math.PI / 2, false);
          for (let t = 0; t < 60; t += 0.5) { g.sky.reveal(1); P.pos.copy(spot); P.speed = 0; P.health.hull = 1e6; g.step(0.5, { sail: -1 }, 1 / 30); }
          return { hits, cloud: +P.cloud.toFixed(2) };
        } finally { Math.random = rnd; off(); g.raiders.setAI(false); g.raiders.clear(); }
      };
      const free = { x: -9000, z: -6500 };
      out.aim = { open: shots(false), cloud: shots(true), openInside: +Math.max(0, g.world.puffs.inside({ x: free.x, y: 1800, z: free.z })).toFixed(2) };
      P.pos.set(free.x, 2390, free.z); g.step(1, {}); // (2 km off, and over every big cloud's top)
      out.outside = { inCloud: +g.sky.inCloud.toFixed(3), veil: g.sky.veil.mesh.visible };
      // hiding in the cloud floor
      let spot = null;
      for (let i = 0; i < 3000 && !spot; i++) { const x = (i % 50) * 120 - 3000, z = Math.floor(i / 50) * 120 - 3000; if ([[0, 0], [150, 0], [-150, 0], [0, 150], [0, -150]].every(([a, b]) => g.world.coverAt(x + a, z + b) > 0.85)) spot = { x, z }; }
      // (the Captain held still at a height there, the clock running in short steps)
      const pin = (y, secs, ctl = {}) => { for (let t = 0; t < secs - 1e-6; t += 0.1) { P.pos.set(spot.x, y, spot.z); P.speed = 0; g.step(0.1, ctl, 1 / 30); } };
      out.hide = { spot: !!spot };
      if (spot) {
        g.sky.reset(); g.raiders.clear(); P.heading = 0; pin(415, 0.3);
        out.hide.hidden = P.hidden; out.hide.cloud = +P.cloud.toFixed(2);
        let fired = 0; const off = g.events.on('fire', (e) => { if (e.owner === 'raider') fired++; });
        try {
          g.raiders.setAI(true);
          // (out of the cloud first, then a raider far off who never saw her, and in a fight, so the screen says she's
          // hidden as she slips in: under the crosshair, and in a toast)
          pin(700, 0.2);
          const r = g.raiders.spawn('brig', new P.pos.constructor(spot.x + 500, 415, spot.z), -Math.PI / 2 + 0.3, true);
          g.waves.state = 'fight'; pin(415, 0.3);
          r.frozen = false; r.seen = null; fired = 0; // (and now the raider sails, never having seen her)
          pin(415, 10);
          out.hide.firedHidden = fired; out.hide.sees = r.sees;
          out.hide.note = document.getElementById('warn').hidden ? '' : document.getElementById('warn').textContent; out.hide.toast = document.getElementById('toast').textContent;
          g.waves.state = 'calm'; g.waves.timer = 1e9;
          let at = -1;
          for (let t = 0; t < 15 && at < 0; t += 0.25) { pin(665, 0.25); if (fired) at = t; }
          out.hide.firedSeen = at;
        } finally { off(); g.raiders.setAI(false); g.raiders.clear(); }
        // a broadside from in the cloud gives her away for 4 s
        pin(415, 5); g.gunnery.cancel();
        const before = P.hidden; g.cam.yaw = Math.PI / 2; g.cam.pitch = 0.2;
        for (const b of ['port', 'starboard']) g.gunnery.ready[b] = 0;
        P.pos.set(spot.x, 415, spot.z); g.step(1 / 30, { fire: true }, 1 / 30);
        const after = P.hidden; pin(415, 3); const at3 = P.hidden; pin(415, 1.5); const at45 = P.hidden;
        out.hide.reveal = { before, after, at3, at45 };
        // a raider hidden in cloud far off: lost (no locking on, her tag saying so)
        g.raiders.setAI(false);
        const lostR = g.raiders.spawn('cutter', P.pos.clone().add({ x: 400, y: 0, z: 0 }), 0, true);
        P.pos.y = 700; g.cam.yaw = 0; g.step(0.2, {});
        const look = lostR.f.pos.clone().sub(g.camera.position).normalize();
        g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading; g.step(0.1, {}); g.placeTags();
        out.hide.lost = { lost: lostR.lost, locked: g.locked === lostR, tag: lostR.tag?.classList.contains('lost') ?? false, words: lostR.tag?.querySelector('.lost')?.textContent ?? '' };
        // (her tag gives how far off the spot she was last seen is, where it waits, even once she's moved on in the
        // cloud; readying a broadside there she shows herself: not lost, her tag at her, with her own distance)
        const tagged = () => parseInt(lostR.tag.querySelector('.d').textContent, 10), ten = (v) => Math.round(v.distanceTo(P.pos) / 10) * 10;
        const seen = lostR.seenAt.clone(); let to = null;
        for (let i = 0; i < 400 && !to; i++) { const q = seen.clone().add({ x: Math.sin(i * 0.7) * (120 + (i % 10) * 20), y: 0, z: Math.cos(i * 0.7) * (120 + (i % 10) * 20) }); if (q.distanceTo(P.pos) > 300 && Math.abs(q.distanceTo(P.pos) - seen.distanceTo(P.pos)) > 60 && g.sky.cloudAt(q) > 0.75) to = q; }
        if (to) { lostR.f.pos.copy(to); g.step(0.2, {}); g.placeTags(); }
        out.hide.lost.moved = { found: !!to, lost: lostR.lost, tag: tagged(), seen: ten(lostR.seenAt), real: ten(lostR.f.pos), still: lostR.seenAt.distanceTo(seen) < 1 };
        Object.assign(lostR.charge, { b: 'port', t: 0.5, T: 0.5 }); g.sky.update(1 / 60, { player: P, camera: g.camera, raiders: g.raiders.list }); g.placeTags();
        out.hide.lost.broadside = { lost: lostR.lost, tagLost: lostR.tag.classList.contains('lost'), tag: tagged(), real: ten(lostR.f.pos) };
        lostR.charge.b = null; g.sky.update(1 / 60, { player: P, camera: g.camera, raiders: g.raiders.list });
        out.hide.lost.after = { lost: lostR.lost, seenAtHer: lostR.seenAt.distanceTo(lostR.f.pos) < 1 };
        g.raiders.clear();
      }
      // the region's air
      const cell = (ch) => { const G = ['sssswwsppppp', 'sssswwhppppp', 'swwwwhhppppp', 'swwwwhhppkks', 'sggwwhhkkkks', 'sggwwfhkkkks', 'sswfffkkkkss', 'ssssssssssss'];
        for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) if (G[r][c] === ch && G[r][Math.max(0, c - 1)] === ch && G[r][Math.min(11, c + 1)] === ch) return { x: ((c + 0.5) / 12 - 0.5) * 23040, z: ((r + 0.5) / 8 - 0.5) * 15360 }; };
      const air = (ch) => {
        const c = cell(ch); P.pos.set(c.x, 900, c.z); g.sky.reset(); g.step(8, {}, 1 / 30);
        const f = g.scene.fog.color;
        return { region: g.sky.weather.region, kind: g.sky.airKind, shown: g.sky.air.mesh.visible, warm: +(f.r - f.b).toFixed(3), line: g.sky.line(g.sky.weather.region) };
      };
      out.air = { day: (() => { const f = g.scene.fog.color; g.sky.reset(); P.pos.set(free.x, 900, free.z); g.step(0.1, {}); return +(f.r - f.b).toFixed(3); })(), wastes: air('k'), peaks: air('p') };
      // (a storm over the Wastes' dust: the dust goes first, then the rain comes in from nothing with the storm, never
      // more of it shown than is falling, and all of it in 20 s)
      {
        const c = cell('k'), W = g.sky.weather; P.pos.set(c.x, 900, c.z); g.sky.reset(); g.step(8, {}, 1 / 30);
        const from = g.sky.airKind; let over = 0, at = -1; g.sky.startStorm();
        for (let t = 0; t < 20; t += 0.25) { P.pos.set(c.x, 900, c.z); g.step(0.25, {}, 1 / 30); if (W.kind === 'rain') { if (at < 0) at = t; over = Math.max(over, g.sky.air.U.uOn.value - W.rain); } }
        out.air.storm = { from, at, over: +over.toFixed(3), kind: g.sky.airKind, on: +g.sky.air.U.uOn.value.toFixed(2) };
        g.sky.reset();
      }
      // the glory and her shadow follow her; the towering clouds; the sun's glare
      P.pos.set(free.x, 1100, free.z); g.sky.reset(); g.step(0.2, {});
      out.glory = { on: M.uGlory.value, ship: +M.uShip.value.distanceTo(P.pos).toFixed(3), height: M.uShipH.value.x };
      g.sky.startStorm(); g.step(25, {}, 1 / 30); out.glory.storm = +M.uGlory.value.toFixed(3); g.sky.reset(); g.step(0.1, {});
      // (a row of the picture just over the horizon, high over every big cloud so none is in the way, looking three ways
      // round the sky: how much its brightness varies along the row, added up)
      P.pos.set(free.x, 2380, free.z); P.heading = 0; g.step(0.1, {});
      const row = (towers) => { let sum = 0; for (const yaw of [0.4, 2.5, 4.6]) sum += row1(towers, yaw); return +sum.toFixed(1); };
      const row1 = (towers, yaw) => {
        M.uTowers.value = towers; g.cam.pitch = -0.08; g.cam.yaw = yaw; P.pos.set(free.x, 2380, free.z); g.step(1 / 60, {}); g.renderer.render(g.scene, g.camera);
        const gl = g.renderer.getContext(), Wd = g.renderer.domElement.width, h = new g.sun.position.constructor(0, 0, 0);
        h.copy(g.camera.position).add(g.camera.getWorldDirection(new g.sun.position.constructor()).setY(0).normalize().multiplyScalar(40000)); h.y = g.camera.position.y + 40000 * 0.012; h.project(g.camera);
        const y = Math.round((h.y + 1) / 2 * g.renderer.domElement.height), px = new Uint8Array(Wd * 4); gl.readPixels(0, y, Wd, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        const l = []; for (let i = 0; i < Wd; i++) l.push(0.3 * px[i * 4] + 0.59 * px[i * 4 + 1] + 0.11 * px[i * 4 + 2]);
        const m = l.reduce((a, b) => a + b, 0) / l.length; return Math.sqrt(l.reduce((a, b) => a + (b - m) ** 2, 0) / l.length);
      };
      out.towers = { on: row(1), off: row(0) }; M.uTowers.value = 1;
      out.towers.y = Math.round(P.pos.y);
      // (still high over every big cloud, so none stands between her and the sun)
      const sunA = Math.atan2(g.sun.position.x - g.sun.target.position.x, g.sun.position.z - g.sun.target.position.z);
      g.cam.yaw = sunA - P.heading; g.cam.pitch = -0.34; g.step(0.2, {}); out.glare = { at: +g.sky.glare.strength.toFixed(2) };
      g.cam.yaw += Math.PI; g.cam.pitch = 0.2; g.step(0.2, {}); out.glare.away = g.sky.glare.on;
    } finally { offs.forEach((f) => f()); g.raiders.setAI(false); g.raiders.clear(); g.sky.reset(); g.progress.data.skies = 'cross'; }
    out.told = told;
    return out;
  });
  console.log(`the cloud floor in JavaScript against the card's: within ${sky.cover.mean} on average (at most ${sky.cover.most}; ${sky.cover.thick} of 64 places thick); storms on Fair Winds: ${sky.storms.fair || 'none'}, Crosswinds ${sky.storms.cross}, Maelstrom ${sky.storms.mael}; banks of cloud ${sky.storms.banks}; the card before wave 4: "${sky.card}"`);
  console.log(`a storm wave (wave ${sky.storm.wave}): 25 s in storm ${sky.storm.storm}, rain ${sky.storm.rain ? 'falling' : 'NONE'}, cloud ${sky.storm.cover}, wind ${sky.storm.wind}; ${sky.storm.lightning} lightning strikes in 30 s; drawn in ${sky.stormCalls} goes (${sky.clearCalls} clear); beaten (${sky.storm.beaten}), 25 s later ${sky.storm.after}; told ${JSON.stringify(sky.told)}`);
  console.log(`the bank of cloud wave ${sky.bank.wave} comes out of: ${sky.bank.banked} in sight, drawn ${sky.bank.off} m from where the game reckons it is (the smallest ${sky.bank.smallest} m), changing ${Math.round(sky.bank.changed * 100)}% of the picture looking at it; beaten (${sky.bank.beaten}), 5 s later ${sky.bank.after}`);
  console.log(`in a cloud: ${JSON.stringify(sky.inside)}, 2 km off and 500 m up ${JSON.stringify(sky.outside)}; raiders' hits in 60 s: in the open ${sky.aim.open.hits}, inside a cloud ${sky.aim.cloud.hits} (how deep: ${sky.aim.cloud.cloud})`);
  console.log(`hiding in the cloud floor: ${JSON.stringify(sky.hide)}`);
  console.log(`a storm over the Wastes' ${sky.air.storm.from}: the rain coming in ${sky.air.storm.at} s after it starts, at most ${sky.air.storm.over} more shown than falling, ${sky.air.storm.on} of it after 20 s`);
  console.log(`the region's air: the afternoon's haze ${sky.air.day} warmer than blue; ${JSON.stringify(sky.air.wastes)}; ${JSON.stringify(sky.air.peaks)}; the glory ${JSON.stringify(sky.glory)}; the horizon's brightness varying ${sky.towers.on} with its towering clouds, ${sky.towers.off} without; the sun's glare ${sky.glare.at} looking at it, ${sky.glare.away ? 'STILL SHOWING' : 'gone'} looking away`);
  if (!(sky.cover.mean < 0.03) || sky.cover.thick < 8) problems.push(`the cloud floor worked out in JavaScript should match the card's picture (within 0.03 on average): ${JSON.stringify(sky.cover)}`);
  if (sky.storms.fair !== '' || sky.storms.cross !== '8 13' || sky.storms.mael !== '4 8 12' || sky.storms.banks !== '3 6 8 9') problems.push(`storms should come on waves 8 and 13 on Crosswinds, 4, 8 and 12 on the Maelstrom, never on Fair Winds; banks of cloud on every third wave and storm waves: ${JSON.stringify(sky.storms)}`);
  if (sky.bank.wave !== 3 || sky.bank.banked !== 1 || !(sky.bank.off < 0.01) || !(sky.bank.smallest >= 480) || !(sky.bank.changed > 0.1) || !(sky.bank.inside > 0.5) || sky.bank.beaten !== 'choose' || sky.bank.after !== 0 || sky.bank.insideAfter !== 0) problems.push(`wave 3 should come out of a bank of cloud, drawn where the game reckons it is, and the bank should fade once the wave is beaten: ${JSON.stringify(sky.bank)}`);
  if (!/A storm is rolling in from the (north|south|east|west)/.test(sky.card) || !sky.front) problems.push(`the card before a storm wave should say a storm is rolling in, and show it on the horizon: "${sky.card}"`);
  if (!(sky.storm.storm > 0.9) || !sky.storm.rain || !(sky.storm.cover > 0.1) || !(sky.storm.wind >= 0.16) || sky.storm.wave !== 4) problems.push(`wave 4 on the Maelstrom should storm: ${JSON.stringify(sky.storm)}`);
  if (!(sky.storm.lightning >= 2) || !(sky.told.lightning >= 2) || !sky.told.gust || !sky.told.coming || !sky.told.here || !sky.told.passing) problems.push(`a storm should bring lightning (told) and gusts: ${JSON.stringify({ lightning: sky.storm.lightning, told: sky.told })}`);
  if (sky.stormCalls > sky.clearCalls + 2) problems.push(`a storm should draw in at most two more goes than a clear sky: ${sky.stormCalls} against ${sky.clearCalls}`);
  if (sky.storm.beaten !== 'choose' || !(sky.storm.after < 0.1)) problems.push(`a storm should clear once its wave is beaten: ${JSON.stringify(sky.storm)}`);
  if (!(sky.inside.inCloud > 0.6) || !sky.inside.veil || !(sky.inside.far < 600) || !(sky.inside.mist > 0.5)) problems.push(`inside a big cloud the mist should show and the haze close in: ${JSON.stringify(sky.inside)}`);
  if (sky.outside.inCloud > 0.05 || sky.outside.veil) problems.push(`out of the clouds the mist should be gone: ${JSON.stringify(sky.outside)}`);
  if (!(sky.aim.open.hits >= 8) || !(sky.aim.cloud.hits < sky.aim.open.hits * 0.6) || !(sky.aim.cloud.cloud > 0.6) || sky.aim.openInside > 0) problems.push(`inside a cloud the raiders should aim worse: ${JSON.stringify(sky.aim)}`);
  const H = sky.hide;
  if (!H.spot || !H.hidden || H.firedHidden !== 0 || H.sees || !(H.firedSeen >= 0) || !H.reveal?.before || H.reveal.after || H.reveal.at3 || !H.reveal.at45) problems.push(`hiding in the cloud floor should keep far raiders from firing until she's out of it, and her broadside should give her away for 4 s: ${JSON.stringify(H)}`);
  if (H.note !== 'Hidden in the cloud' || !/^Hidden in the cloud/.test(H.toast)) problems.push(`hidden in a fight, the screen should say so: ${JSON.stringify({ note: H.note, toast: H.toast })}`);
  if (!H.lost?.lost || H.lost.locked || !H.lost.tag || H.lost.words !== 'Lost in the cloud') problems.push(`a raider hidden in cloud far off should be lost to the guns, her tag saying so: ${JSON.stringify(H.lost)}`);
  const LM = H.lost?.moved, LB = H.lost?.broadside;
  if (!LM?.found || !LM.lost || !LM.still || LM.tag !== LM.seen || LM.tag === LM.real) problems.push(`a raider lost in cloud: her tag should give how far off she was last seen, where it waits, not where she's moved on to: ${JSON.stringify(LM)}`);
  if (!LB || LB.lost || LB.tagLost || LB.tag !== LB.real || H.lost.after?.lost !== true || !H.lost.after.seenAtHer) problems.push(`a raider lost in cloud readying a broadside should show herself (her tag at her, with her own distance), and be lost again where she fired from: ${JSON.stringify({ LB, after: H.lost?.after })}`);
  if (!sky.told.hidden) problems.push('hiding in the cloud should be told');
  const A = sky.air;
  if (A.wastes.region !== 'The Sunscorch Wastes' || A.wastes.kind !== 'dust' || !A.wastes.shown || !(A.wastes.warm > A.day + 0.05) || A.wastes.line !== 'Hot, dusty air') problems.push(`the Sunscorch Wastes' air should be warm and dusty: ${JSON.stringify(A)}`);
  if (A.storm.from !== 'dust' || !(A.storm.at > 0) || A.storm.over > 0.01 || A.storm.kind !== 'rain' || !(A.storm.on > 0.8)) problems.push(`a storm over the Wastes' dust should bring its rain in gently, from nothing (the dust gone first): ${JSON.stringify(A.storm)}`);
  if (A.peaks.region !== 'The Ironspire Peaks' || A.peaks.kind !== 'snow' || !A.peaks.shown || !(A.peaks.warm < A.day)) problems.push(`the Ironspire Peaks' air should be cold and snowing: ${JSON.stringify(A)}`);
  if (sky.glory.on !== 1 || sky.glory.ship > 0.01 || sky.glory.storm !== 0) problems.push(`the glory and her shadow should follow her in fair weather, and go in a storm: ${JSON.stringify(sky.glory)}`);
  if (!(sky.towers.on > sky.towers.off + 8)) problems.push(`the towering clouds should make the horizon uneven: ${JSON.stringify(sky.towers)}`);
  if (!(sky.glare.at > 0.5) || sky.glare.away) problems.push(`the sun's glare should show looking into the sun, and go looking away: ${JSON.stringify(sky.glare)}`);
  // pictures for Chris: a storm front on the horizon, the storm with rain and lightning, inside a cloud and coming out,
  // hiding in the cloud floor, the towering clouds, the glory, the Sunscorch Wastes' air and a raider coming out of a
  // bank of cloud
  {
    const pose = (fn) => page.evaluate(fn);
    const hold = () => page.evaluate(() => { window.__held = []; window.__raf = window.requestAnimationFrame; window.requestAnimationFrame = (f) => { window.__held.push(f); return 0; }; });
    const free = () => page.evaluate(() => { window.requestAnimationFrame = window.__raf; for (const f of window.__held) window.__raf(f); });
    const snap = async (name) => { const png = await page.evaluate(() => { const g = window.__game; g.renderer.render(g.scene, g.camera); return g.renderer.domElement.toDataURL('image/png'); }); writeFileSync(`${out}/${name}.png`, Buffer.from(png.split(',')[1], 'base64')); };
    await hold();
    try {
      await pose(() => { const g = window.__game; g.fly('brig'); const P = g.player; g.waves.timer = 1e9; g.raiders.setAI(false); P.pos.set(1500, 900, -800); P.heading = 0.4; g.cam.yaw = 0.3; g.cam.pitch = 0.08; g.sky.front(P.heading + 1.3); g.step(10, {}, 1 / 30); });
      await snap('sky-storm-front');
      await pose(() => { const g = window.__game, P = g.player; g.cam.pitch = 0.12; g.sky.startStorm(); g.sky.weather.strike = 99; g.step(24, {}, 1 / 30); const fw = g.camera.getWorldDirection(P.pos.clone()); const foot = P.pos.clone().addScaledVector(fw.setY(0).normalize(), 2400); foot.y = 420; g.sky.bolt.strike(foot.clone().setY(2100), foot); g.sky.weather.flashT = 0.12; g.step(1 / 60, {}); });
      await snap('sky-storm-lightning');
      await pose(() => { const g = window.__game, P = g.player; g.sky.reset(); const k = g.world.puffs.BANK + 30; for (let i = 0; i < 5; i++) { g.world.puffs.positionOf(k, P.pos); P.speed = 40; g.step(0.1, {}); } });
      await snap('sky-inside-a-cloud');
      await pose(() => { const g = window.__game, P = g.player; const k = g.world.puffs.BANK + 30, c = g.world.puffs.positionOf(k), s = g.world.puffs.sizeOf(k); P.pos.copy(c).addScaledVector(P.forward(), s * 0.78); P.speed = 0; g.step(0.25, { sail: -1 }); });
      await snap('sky-coming-out-of-a-cloud');
      await pose(() => { const g = window.__game, P = g.player; let spot = null; for (let i = 0; i < 3000 && !spot; i++) { const x = (i % 50) * 120 - 3000, z = Math.floor(i / 50) * 120 - 3000; if (g.world.coverAt(x, z) > 0.9) spot = { x, z }; } g.sky.reset(); P.pos.set(spot.x, 426, spot.z); g.cam.pitch = 0.3; g.cam.yaw = 0.6; g.cam.zoom = 1.8; g.step(1, {}); P.pos.set(spot.x, 426, spot.z); g.step(0.1, {}); });
      await snap('sky-hiding-in-the-cloud-floor');
      await pose(() => { const g = window.__game, P = g.player; g.cam.zoom = 1; g.sky.reset(); P.pos.set(-1500, 1200, 3000); P.heading = 2.6; g.cam.yaw = 0.4; g.cam.pitch = -0.12; g.step(0.5, {}); });
      await snap('sky-towering-clouds');
      // (the glory: looking down and away from the sun, past her, at the cloud where her shadow falls)
      await pose(() => { const g = window.__game, P = g.player, S = g.sun.position.clone().sub(g.sun.target.position).normalize(), away = Math.atan2(-S.x, -S.z), drop = (900 - 430) / S.y;
        let spot = null; for (let i = 0; i < 3000 && !spot; i++) { const x = (i % 50) * 150 - 4000, z = Math.floor(i / 50) * 150 - 4000; if (g.world.coverAt(x, z) > 0.92) spot = { x, z }; }
        P.pos.set(spot.x + S.x * drop, 900, spot.z + S.z * drop); P.heading = away + 1.2; g.cam.yaw = away - P.heading + 0.35; g.cam.pitch = Math.asin(S.y); g.sky.reset(); g.step(0.3, {}); });
      await snap('sky-the-glory');
      await pose(() => { const g = window.__game, P = g.player; P.pos.set(7500, 900, 1500); P.heading = 0; g.cam.yaw = 0.2; g.cam.pitch = 0.15; g.sky.reset(); g.step(8, {}, 1 / 30); });
      await snap('sky-the-sunscorch-air');
      // (wave 3's bank of cloud on Crosswinds, a Frigate's red sails coming out of it, 140 m out of its middle)
      await pose(() => { const g = window.__game, P = g.player; g.progress.data.skies = 'cross'; g.sky.reset(); g.raiders.clear(); P.pos.set(1500, 900, -800); P.heading = 0.4;
        Object.assign(g.waves, { n: 2, state: 'calm', timer: 0.01, next: null }); g.step(3, {}, 1 / 30); g.waves.timer = 1e9;
        const pf = g.world.puffs, mid = P.pos.clone().set(0, 0, 0), c = P.pos.clone(); for (let i = 0; i < pf.BANK; i++) mid.add(pf.positionOf(i, c)); mid.divideScalar(pf.BANK);
        const to = P.pos.clone().sub(mid).setY(0).normalize(), at = mid.clone().addScaledVector(to, 140); at.y = mid.y - 30;
        g.raiders.clear(); const r = g.raiders.spawn('frigate', at, Math.atan2(to.x, to.z) + 0.55, false);
        P.pos.copy(at).addScaledVector(to, 420); P.pos.y = at.y + 40; P.heading = Math.atan2(-to.x, -to.z) - 0.3; g.step(0.05, {});
        const look = r.f.pos.clone().sub(g.camera.position).normalize(); g.cam.pitch = -Math.asin(look.y) + 0.06; g.cam.yaw = Math.atan2(look.x, look.z) - P.heading + 0.12; g.step(0.05, {}); });
      await snap('sky-cloud-bank');
    } finally { await free(); await page.evaluate(() => { const g = window.__game; g.sky.reset(); g.endVoyage(0); }); }
  }
  // ---------- how a fight feels (fx.js, events.js) ----------
  // a broadside fired once into empty sky by the Frigate (port side): how far the view kicks back, at its most
  const volley = () => page.evaluate(() => {
    const g = window.__game, P = g.player, FX = g.fx;
    P.pos.set(0, 900, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0; P.turn = 0; P.climb = 0; P.heel = P.heelV = 0;
    g.step(0.1, {}); g.bolts.clear(); FX.clear();
    for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
    g.cam.yaw = Math.PI / 2; g.cam.pitch = 0.05;
    let peak = 0;
    g.step(1 / 60, { fire: true });
    for (let t = 0; t < 0.6; t += 1 / 60) { g.step(1 / 60, {}); peak = Math.max(peak, FX.cam.back); }
    return peak;
  });
  const feel = await page.evaluate(() => {
    const g = window.__game, out = {}, E = g.events, FX = g.fx;
    g.progress.reset(); g.progress.data.skies = 'cross';
    const voyage = (id) => { g.fly(id); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); return g.player; };
    const still = (P) => { P.speed = 3; P.sail = 0.05; P.vy = 0; P.turn = 0; P.climb = 0; };
    // a rippling broadside: the Frigate's port side once into empty sky. One shot at once, all ten by 0.7 s, bow first,
    // a puff of gunsmoke from each port, the view kicked back and settled within a second, the ship heeled to starboard
    let P = voyage('frigate'); P.pos.set(0, 900, 0); P.heading = 0; still(P); g.step(0.1, {});
    g.bolts.clear(); FX.clear(); for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
    g.cam.yaw = Math.PI / 2; g.cam.pitch = 0.05;
    const fired = [], off = E.on('fire', (e) => { if (e.owner === 'player') fired.push(e.p.clone().sub(P.pos).dot(P.forward())); });
    const puffs0 = FX.stats().puffs;
    g.step(1 / 60, { fire: true });
    const first = g.bolts.bolts.length;
    let back = 0, heel = 0;
    for (let t = 0; t < 0.3; t += 1 / 60) { g.step(1 / 60, {}); back = Math.max(back, FX.cam.back); heel = Math.max(heel, P.heel); }
    for (let t = 0; t < 0.4; t += 1 / 60) { g.step(1 / 60, {}); heel = Math.max(heel, P.heel); }
    const a = g.bolts.mesh.instanceMatrix.array;
    out.ripple = { first, all: g.bolts.bolts.length, bowFirst: fired.length === 10 && fired[0] > fired[9] + 15, puffs: FX.stats().puffs - puffs0, back: +back.toFixed(2), heel: +heel.toFixed(3),
      tail: +Math.hypot(a[8], a[9], a[10]).toFixed(1) };
    g.step(0.3, {}); out.ripple.settled = +FX.cam.back.toFixed(3);
    off();
    // a raider's shot into the Captain's hull shakes the view; one that takes the hull below 30% is told
    let shook = -1, low = '';
    const offs = [E.on('hit', (e) => { if (e.target === 'player') shook = FX.cam.trauma; }), E.on('player:low', (e) => { low = e.part; })];
    const shoot = (dx, weight = 1) => { const at = P.aimAt().clone(), from = at.clone().add({ x: dx, y: 0, z: 0 }); g.bolts.fire(from, at.clone().sub(from).normalize(), 'broadside', 'raider', null, weight); };
    P.repair(1); FX.clear(); g.cam.yaw = 0; g.cam.pitch = 0.2; g.step(0.05, {});
    shoot(120); g.step(0.6, {});
    out.shake = { trauma: +shook.toFixed(2) };
    // (a heavy shot from close by: between waves the crew patch her up as the shot flies)
    P.health.hull = P.full.hull * 0.33; shoot(30, 4); g.step(0.3, {});
    out.shake.low = low;
    offs.forEach((f) => f());
    // a raider's shot passing 10 m beside her: one near miss, no harm done
    P.repair(1); let nears = 0; const offN = E.on('nearMiss', () => nears++); const h0 = JSON.stringify(P.health);
    const from = P.aimAt().clone().add({ x: 10, y: 0, z: 300 }); g.bolts.fire(from, P.forward().negate(), 'chaser', 'raider', null, 1);
    g.step(2, {}); offN();
    out.near = { told: nears, harmed: JSON.stringify(P.health) !== h0 };
    // a raider Frigate 300 m off the side of a still Captain readies her broadside, her ports glowing, at least 0.45 s
    // before her first shot; when it lands, the red arc on the screen points at her
    P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P); P.full.hull = P.health.hull = 1e6; g.cam.yaw = 0; g.cam.pitch = 0.2;
    const rf = g.raiders.spawn('frigate', P.pos.clone().add({ x: 300, y: 0, z: 0 }), Math.PI, false); g.raiders.setAI(true);
    let t = 0, chargedAt = -1, boltAt = -1, shooter = null, named = null;
    // (where she is on the screen, as each of her shots lands: the arc is drawn in the same moment; and the hit names her)
    const offH = E.on('hit', (e) => { if (e.target === 'player') { const c = rf.f.pos.clone().applyMatrix4(g.camera.matrixWorldInverse); shooter = Math.atan2(c.x, c.y); named = e.raider === rf; } });
    while (t < 40 && !(shooter !== null && boltAt >= 0)) {
      g.step(0.05, {}); t += 0.05;
      if (chargedAt < 0 && rf.charge.b) chargedAt = t;
      if (boltAt < 0 && g.bolts.bolts.some((b) => b.owner === 'raider')) boltAt = t;
    }
    const arc = shooter === null ? null : { shooter, arc: g.lastArc };
    offH(); g.raiders.setAI(false);
    const playing = document.getAnimations().some((x) => x.effect?.target?.parentElement?.id === 'incoming');
    out.warn = { chargedAt: +chargedAt.toFixed(2), boltAt: +boltAt.toFixed(2) };
    if (arc) { const d = Math.abs(Math.atan2(Math.sin(arc.arc - arc.shooter), Math.cos(arc.arc - arc.shooter))); out.arc = { off: Math.round(d * 180 / Math.PI), playing, named }; }
    // her ports can't be seen while she's off screen: as she readies her broadside there, her tag at the edge flashes
    // red (and its arrow) and says "Broadside!", and stops once she has fired; with her on screen, readying another,
    // her tag doesn't (her glowing ports show)
    g.raiders.clear(); g.bolts.clear(); P.repair(1);
    const re = g.raiders.spawn('frigate', P.pos.clone().add({ x: 300, y: 0, z: 0 }), Math.PI, false); g.raiders.setAI(true);
    const tagNow = () => {
      const el = re.tag, bs = el?.querySelector('.bs');
      return { edge: !!el?.classList.contains('edge'), warn: !!el?.classList.contains('warn'), says: bs && getComputedStyle(bs).display !== 'none' ? bs.textContent : '',
        flashing: !!el?.getAnimations().some((x) => x.animationName === 'tag-warn'), arrow: el ? getComputedStyle(el.querySelector('.arrow')).color : '' };
    };
    const edgeTag = { readying: null, fired: null, onScreen: null };
    t = 0;
    while (t < 30 && !edgeTag.fired) {
      g.cam.yaw = 0; g.cam.pitch = 0.2; g.step(0.05, {}); still(P); t += 0.05;
      if (re.charge.b && !edgeTag.readying) edgeTag.readying = tagNow();
      else if (!re.charge.b && edgeTag.readying) edgeTag.fired = tagNow();
    }
    t = 0;
    while (t < 30 && !edgeTag.onScreen) {
      const look = re.f.pos.clone().sub(P.pos); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading; g.cam.pitch = 0.1;
      g.step(0.05, {}); still(P); t += 0.05;
      if (re.charge.b) edgeTag.onScreen = tagNow();
    }
    out.edgeTag = edgeTag;
    g.raiders.setAI(false); g.raiders.clear(); g.bolts.clear();
    // a raider brought down in the middle of her broadside fires no more: a raider Frigate fires both sides, and is
    // brought down 0 to 5 frames later (one of her waiting guns comes due in one of them); not one more goes off
    let fromWreck = 0, waited = 0;
    for (let extra = 0; extra <= 5; extra++) {
      g.raiders.clear(); g.bolts.clear();
      const r = g.raiders.spawn('frigate', P.pos.clone().add({ x: 300, y: 0, z: 0 }), Math.PI, false); g.step(1 / 60, {});
      let down = false; const offD = E.on('fire', (e) => { if (e.owner === 'raider' && down) fromWreck++; });
      r.gun.fire('port', P.pos, g.bolts, 'raider', r.f.velocity); r.gun.fire('starboard', P.pos, g.bolts, 'raider', r.f.velocity);
      for (let k = 0; k < extra; k++) g.step(1 / 60, {});
      waited = Math.max(waited, r.gun.pending); r.f.hit('hull', 1e9); down = true;
      g.step(1, {}); offD();
    }
    out.stopped = { fromWreck, waited };
    // a Man-o'-war firing all four batteries at once (two decks of twelve a side, and her chasers): every gun still waits
    // its turn, so only a few go off together, and every one of them fires
    g.raiders.clear(); g.bolts.clear();
    const mw = g.raiders.spawn('manowar', P.pos.clone().add({ x: 0, y: 0, z: 500 }), Math.PI / 2, false); g.step(1 / 60, {});
    let frame = 0; const per = new Map(), offM = E.on('fire', (e) => { if (e.owner === 'raider') per.set(frame, (per.get(frame) ?? 0) + 1); });
    for (const b of ['port', 'starboard', 'bow', 'stern']) mw.gun.fire(b, P.pos, g.bolts, 'raider', mw.f.velocity);
    const waiting = mw.gun.pending;
    for (; frame < 60; ) { frame++; g.step(1 / 60, {}); }
    offM();
    out.big = { guns: Object.values(mw.gun.B).reduce((n, l) => n + l.length, 0), waiting, together: Math.max(...per.values()), fired: [...per.values()].reduce((a, b) => a + b, 0) };
    g.raiders.clear(); g.bolts.clear();
    // a busy fight: a Frigate against a raider Frigate, Brig and Cutter for 15 s, firing all the while, the Cutter blown
    // apart 5 s in and the Brig 10 s in (their wrecks' blasts, fire and smoke in the thick of it). The sparks and smoke
    // never need more room than they have, and a step of the game stays quick (the middle of 15 one-second timings)
    P = voyage('frigate'); P.pos.set(0, 900, 0); P.heading = 0; P.full.hull = P.health.hull = 1e6; P.full.crystals = P.health.crystals = 1e6;
    const f = P.forward();
    const foes = ['frigate', 'brig', 'cutter'].map((id, i) => g.raiders.spawn(id, P.pos.clone().addScaledVector(f, 260 + i * 90).add({ x: (i - 1) * 140, y: 10, z: 0 }), P.heading + (i ? 2.4 : -1.2), false));
    g.raiders.setAI(true); FX.clear(); FX.resetStats();
    const times = []; let most = 0;
    for (let s = 0; s < 15; s++) {
      if (s === 5) foes[2].f.hit('hull', 1e9);
      if (s === 10) foes[1].f.hit('hull', 1e9);
      const t0 = performance.now();
      for (let k = 0; k < 4; k++) {
        const live = g.raiders.list.filter((r) => !r.f.down).sort((a, b) => a.f.pos.distanceTo(P.pos) - b.f.pos.distanceTo(P.pos));
        if (live[0]) {
          const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
          const look = live[0].f.pos.clone().sub(T).normalize(), a2 = Math.atan2(look.x, look.z) - P.heading;
          g.cam.pitch = Math.max(-0.3, -Math.asin(look.y) + 0.08); g.cam.yaw = Math.atan2(Math.sin(a2), Math.cos(a2));
        }
        g.step(0.25, { fire: true, sail: 0 });
        most = Math.max(most, FX.stats().sparks);
      }
      times.push((performance.now() - t0) / 60);
    }
    times.sort((x, y) => x - y);
    const st = FX.stats();
    out.fight = { peak: st.peak, most, cap: st.sparkCap, dropped: st.dropped, puffs: st.puffs, puffsDropped: st.puffsDropped, ms: +times[7].toFixed(2), downed: g.downed };
    // a raider brought down: her blast throws at least 90 sparks at once
    g.raiders.setAI(false); g.raiders.clear(); FX.clear();
    const k1 = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: 0, z: 300 }), 0, true); k1.f.hit('hull', 1e9); g.step(1 / 60, {});
    out.fight.blast = FX.stats().sparks;
    // a barrage of 60 shots in a second into a raider Frigate's hull, sails and crystals (a big broadside's worth): the
    // debris never needs more room than its batches have (not one piece cut short), and it has all fallen away 4 s later
    g.raiders.clear(); P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P); FX.clear(); FX.resetStats();
    const tgt = g.raiders.spawn('frigate', P.pos.clone().add({ x: 0, y: 0, z: 200 }), Math.PI / 2, true);
    for (const k of ['hull', 'sails', 'crystals']) tgt.f.full[k] = tgt.f.health[k] = 1e9;
    g.step(1 / 60, {});
    const boxes = [tgt.zones.hullBox, ...tgt.zones.sails, ...tgt.zones.crystals].filter((b) => !b.isEmpty()), heaps = { wood: 0, canvas: 0, crystal: 0 };
    const track = () => { const d = FX.stats().debris; for (const k in heaps) heaps[k] = Math.max(heaps[k], d[k]); };
    for (let i = 0; i < 60; i++) {
      const b = boxes[i % boxes.length], c = P.pos.clone().set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2).applyMatrix4(tgt.ship.body.matrixWorld);
      const dir = c.clone().sub(P.pos).normalize();
      g.bolts.fire(c.clone().addScaledVector(dir, -40), dir, 'broadside', 'player', null, 1);
      if (i % 6 === 5) { g.step(0.1, {}); track(); }
    }
    for (let k = 0; k < 10; k++) { g.step(0.05, {}); track(); }
    const sd = FX.stats().debris;
    out.barrage = { most: heaps, caps: sd.caps, cut: sd.cut, tossed: sd.tossed, hits: ['hull', 'sails', 'crystals'].filter((k) => tgt.f.health[k] < 1e9).join('+') };
    g.step(4, {}); const left = FX.stats().debris; out.barrage.left = left.wood + left.canvas + left.crystal;
    // a Surge: half a second in, streaks of wind rush past and the view is over 9 degrees wider; 4 s later they're gone
    // and the view is back (within half a degree), and her vapour trails made smoke while it lasted
    g.raiders.clear(); P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; P.sail = 1; P.speed = P.H.vmax * 0.8; FX.clear(); g.step(1, { sail: 1 });
    const fov0 = g.camera.fov, puffs1 = FX.stats().puffs;
    g.step(1 / 60, { sail: 1, pressed: new Set(['r']) }); g.step(0.5, { sail: 1 });
    out.surge = { on: P.surge.on > 0, streaks: g.surge.streaks.visible, wider: +(g.camera.fov - fov0).toFixed(1), smoke: FX.stats().puffs - puffs1, flare: +P.ship.glow.material.uniforms.uBoost.value.toFixed(2) };
    g.step(4, { sail: 1 });
    Object.assign(out.surge, { after: g.surge.streaks.visible, back: +Math.abs(g.camera.fov - fov0).toFixed(2), flareAfter: +P.ship.glow.material.uniforms.uBoost.value.toFixed(2) });
    // on a laptop, a raider Frigate blown apart 150 m off at 900 m: her three masts crack and topple, her canvas all
    // going with them, and each one goes only once it's all under the cloud deck (or shrinks away, kept too long), never
    // vanishing in the open sky. (Each one's top, as it was last seen a 20th of a second before it went)
    g.raiders.clear(); P = voyage('brig'); P.pos.set(0, 900, 0); P.heading = 0; still(P); FX.clear();
    const mf = g.raiders.spawn('frigate', P.pos.clone().add({ x: 40, y: 0, z: 150 }), Math.PI / 2, true); g.step(0.1, {});
    mf.f.hit('hull', 1e9); g.step(2.5, {});
    // (her far model, drawn once she's fallen far enough away, has lost its masts too: its wood is all masts and yards,
    // and its brass loses their bands and tops but keeps the hull's)
    const farLeft = (name) => { const geo = mf.ship.parts.farMeshes[name].geometry; return [geo.index?.count ?? geo.attributes.position.count, g.raiders.templates.frigate.far.body.children.find((o) => o.name === name).geometry.attributes.position.count]; };
    out.masts = { level: mf.ship.level, falling: g.wrecks.falling(), canvas: mf.ship.parts.meshes.canvas.geometry.index?.count ?? -1, deck: g.world.deck.position.y,
      farWood: farLeft('wood'), farBrass: farLeft('brass'), farRig: mf.ship.parts.farRig.every((m) => !m.visible) };
    const lastSeen = new Map(); let mt = 2.5;
    while (mt < 16 && g.wrecks.falling().length) { for (const m of g.wrecks.falling()) lastSeen.set(m.i, m); g.step(0.05, {}); mt += 0.05; }
    Object.assign(out.masts, { left: g.wrecks.falling().length, t: +mt.toFixed(1), went: [...lastSeen.values()].map((m) => ({ top: +(m.y + m.H).toFixed(1), s: m.s })) });
    // paused, then back to port from the pause menu: the pause is told as ended, before the voyage's end
    g.raiders.clear();
    const told = [], offP = [E.on('pause', (e) => told.push(`pause ${e.on}`)), E.on('voyage:end', () => told.push('voyage:end'))];
    g.pause(true); document.getElementById('btn-abandon').click(); offP.forEach((x) => x());
    out.leave = { told: told.join(', '), paused: g.paused, mode: g.mode };
    return out;
  });
  const { ripple, shake, near, warn, arc, stopped, big, fight: busy, barrage, surge, masts, leave } = feel;
  console.log(`a Frigate's broadside: ${ripple.first} shot at once, ${ripple.all} by 0.7 s, ${ripple.bowFirst ? 'bow first' : 'NOT BOW FIRST'}, ${ripple.puffs} puffs of gunsmoke, tails ${ripple.tail} m; the view kicked back ${ripple.back} m (${ripple.settled} m after 1 s), the ship heeled ${ripple.heel}`);
  if (ripple.first > 2 || ripple.all !== 10 || !ripple.bowFirst) problems.push(`a broadside should ripple bow to stern, one shot at once and all ten by 0.7 s: ${JSON.stringify(ripple)}`);
  if (ripple.puffs < 20) problems.push(`a broadside should billow gunsmoke from each port, two puffs a port on a laptop: ${ripple.puffs} puffs`);
  if (ripple.tail < 20) problems.push(`a broadside bolt's tail should be at least 20 m long: ${ripple.tail}`);
  if (ripple.back <= 0.5 || ripple.settled >= 0.02) problems.push(`the view should kick back over half a metre with a broadside and settle within a second: ${ripple.back} m, then ${ripple.settled} m`);
  if (ripple.heel <= 0.005) problems.push(`a port broadside should heel the ship to starboard: ${ripple.heel}`);
  console.log(`a raider's shot in the hull shakes the view (trauma ${shake.trauma}); the hull dropping below 30% is told (${shake.low || 'NOT TOLD'}); a shot passing 10 m off: ${near.told} near miss, ${near.harmed ? 'HARMED' : 'no harm'}`);
  if (shake.trauma <= 0.3) problems.push(`a raider's shot in the hull should shake the view (trauma over 0.3): ${shake.trauma}`);
  if (shake.low !== 'hull') problems.push('the hull dropping below 30% isn\'t told (player:low)');
  if (near.told !== 1 || near.harmed) problems.push(`a raider's shot passing 10 m off should be one near miss and do no harm: ${JSON.stringify(near)}`);
  console.log(`a raider Frigate's ports glow from ${warn.chargedAt} s, her first shot at ${warn.boltAt} s; her hit's red arc points ${arc ? `${arc.off}° off her, and the hit ${arc.named ? 'names her' : 'DOESN\'T NAME HER'}` : 'NOWHERE'}`);
  if (warn.chargedAt < 0 || warn.boltAt < 0 || warn.boltAt - warn.chargedAt < 0.45) problems.push(`a raider's ports should glow at least 0.45 s before her broadside: ${JSON.stringify(warn)}`);
  if (!arc || arc.off > 30 || !arc.playing) problems.push(`a hit on the Captain should show a red arc pointing to the shooter: ${JSON.stringify(arc)}`);
  if (arc && !arc.named) problems.push('a raider\'s hit on the Captain should name the raider that fired it (hit.raider)');
  const et = feel.edgeTag, tagWords = (x) => (x ? `${x.edge ? 'at the edge' : 'on screen'}${x.warn ? `, flashing red${x.flashing ? '' : ' (BUT NOT ANIMATED)'}, "${x.says}", arrow ${x.arrow}` : ', not flashing'}` : 'NEVER SEEN');
  console.log(`a raider Frigate off screen readying her broadside: her tag ${tagWords(et.readying)}; once she's fired: ${tagWords(et.fired)}; on screen, readying another: ${tagWords(et.onScreen)}`);
  if (!et.readying?.edge || !et.readying.warn || !et.readying.flashing || et.readying.says !== 'Broadside!' || et.readying.arrow !== 'rgb(255, 58, 40)') problems.push(`an off-screen raider readying her broadside should flash her edge tag and its arrow red and say "Broadside!": ${JSON.stringify(et.readying)}`);
  if (!et.fired || et.fired.warn || et.fired.says) problems.push(`a raider's edge tag should stop flashing once she has fired: ${JSON.stringify(et.fired)}`);
  if (!et.onScreen || et.onScreen.edge || et.onScreen.warn) problems.push(`a raider on screen readying her broadside shouldn't flash her tag (her ports show): ${JSON.stringify(et.onScreen)}`);
  console.log(`a raider Frigate downed mid-broadside (${stopped.waited} guns waiting): ${stopped.fromWreck} more fired; a Man-o'-war's four batteries at once: ${big.waiting} of ${big.guns} guns wait their turn, at most ${big.together} go off together, ${big.fired} fire`);
  if (stopped.fromWreck || !stopped.waited) problems.push(`a raider brought down mid-broadside shouldn't fire another gun: ${JSON.stringify(stopped)}`);
  if (big.fired !== big.guns || big.together > 6 || big.waiting < big.guns - 6) problems.push(`a Man-o'-war's four batteries fired at once should all ripple, a few guns at a time: ${JSON.stringify(big)}`);
  console.log(`a busy fight (3 raiders, 15 s): at most ${busy.most} sparks of ${busy.cap} (${busy.dropped} cut short), ${busy.puffs} puffs (${busy.puffsDropped} cut short), ${busy.ms} ms a step, ${busy.downed} downed; a raider's blast: ${busy.blast} sparks`);
  if (busy.downed < 2) problems.push(`two raiders should go down in the busy fight (their wrecks count against the budgets): ${busy.downed} did`);
  if (busy.dropped || busy.most > busy.cap || busy.puffsDropped) problems.push(`a busy fight's sparks or smoke ran out of room: ${JSON.stringify(busy)}`);
  if (busy.ms >= 1) problems.push(`a step of a busy fight takes ${busy.ms} ms (should be under 1)`);
  if (busy.blast < 90) problems.push(`a raider's blast should throw at least 90 sparks: ${busy.blast}`);
  console.log(`a 60-shot barrage (hit ${barrage.hits}): at most ${barrage.most.wood} splinters, ${barrage.most.canvas} scraps and ${barrage.most.crystal} shards (room for ${barrage.caps.wood}, ${barrage.caps.canvas} and ${barrage.caps.crystal}; cut short ${barrage.cut.wood}, ${barrage.cut.canvas} and ${barrage.cut.crystal}), ${barrage.left} left 4 s later`);
  if (['wood', 'canvas', 'crystal'].some((k) => barrage.cut[k] > 0 || !barrage.most[k]) || barrage.left) problems.push(`a barrage's debris should show every kind, all fit its batches (none cut short), and fall away within 4 s: ${JSON.stringify(barrage)}`);
  console.log(`a Surge, 0.5 s in: streaks ${surge.streaks ? 'showing' : 'MISSING'}, the view ${surge.wider}° wider, ${surge.smoke} puffs of vapour, crystals at ${surge.flare}x; 4 s later: streaks ${surge.after ? 'STILL SHOWING' : 'gone'}, the view ${surge.back}° off, crystals at ${surge.flareAfter}x`);
  if (!surge.on || !surge.streaks || surge.wider <= 9 || surge.smoke <= 0 || surge.flare < 1.5) problems.push(`a Surge should show streaks, widen the view over 9 degrees, trail vapour and flare the crystals: ${JSON.stringify(surge)}`);
  if (surge.after || surge.back > 0.5 || surge.flareAfter > 1.05) problems.push(`after a Surge the streaks should go and the view and crystals come back: ${JSON.stringify(surge)}`);
  console.log(`a raider Frigate blown apart 150 m off (${masts.level}): 2.5 s later ${masts.falling.length} masts falling (tops come down ${masts.falling.map((m) => m.fell + ' m').join(', ')}), her canvas left on her: ${masts.canvas}, her far model's masts cut out (wood ${masts.farWood[0]} of ${masts.farWood[1]} corners left, brass ${masts.farBrass[0]} of ${masts.farBrass[1]}); all gone ${masts.t} s after, last seen with their tops at ${masts.went.map((m) => m.top + ' m' + (m.s < 1 ? ` (shrunk to ${m.s})` : '')).join(', ')} (the clouds at ${masts.deck} m)`);
  if (masts.falling.length !== 3 || masts.falling.some((m) => !(m.fell > 0)) || masts.canvas !== 0) problems.push(`a raider Frigate blown apart should topple her three masts with all their canvas: ${JSON.stringify(masts)}`);
  if (!(masts.farWood[0] < masts.farWood[1] * 0.1 && masts.farBrass[0] > masts.farBrass[1] * 0.5 && masts.farBrass[0] < masts.farBrass[1]) || !masts.farRig) problems.push(`a raider whose masts fell should have none on her far model either (its masts and their brass cut out, its rigging hidden): ${JSON.stringify(masts)}`);
  if (masts.left || masts.went.length !== 3 || masts.went.some((m) => !(m.top < masts.deck || m.s < 0.5))) problems.push(`a falling mast should go only once it's under the cloud deck (or shrink away), never vanish in the open sky: ${JSON.stringify(masts)}`);
  console.log(`paused, then back to port from the pause menu: told "${leave.told}"`);
  if (leave.told !== 'pause true, pause false, voyage:end' || leave.paused || leave.mode !== 'port') problems.push(`going back to port from the pause menu should tell the pause ended before the voyage's end: ${JSON.stringify(leave)}`);
  // a raider captain brought down as a banner shows, where her bounty (tall: "Captain's bounty" over a big number)
  // would rise right over the banner, or rise into it from just under it: it shows just under the banner instead, clear
  // of its words all the while it can be read (looked at every 0.1 s while it's over half opaque), and is drawn over it
  const overBanner = await page.evaluate(() => {
    const g = window.__game, $ = (id) => document.getElementById(id), out = { drawnOver: !!($('banner').compareDocumentPosition($('bounties')) & Node.DOCUMENT_POSITION_FOLLOWING), runs: [] };
    g.raiders.prepare('cutter', true); // (built first, so the banner is still showing when she goes down)
    for (const below of [null, 50]) {
      g.progress.reset(); g.progress.data.skies = 'cross'; g.fly('brig'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); // (setting sail shows a banner)
      const P = g.player; P.speed = 3; P.sail = 0.05; g.step(0.05, {});
      const bn = $('banner').getBoundingClientRect(), V = P.pos.constructor, y = below === null ? (bn.top + bn.bottom) / 2 : bn.bottom + below;
      const at = new V(0, 1 - 2 * y / innerHeight, 0.5).unproject(g.camera).sub(g.camera.position).normalize().multiplyScalar(260).add(g.camera.position);
      const r = g.raiders.spawn('cutter', at, Math.PI / 2, true, true);
      r.f.pos.y -= 2 + r.R.length * 0.3; r.ship.root.position.copy(r.f.pos); g.step(0.05, {});
      r.f.hit('hull', 1e9);
      const words = [$('banner-title').getBoundingClientRect(), $('banner-line').getBoundingClientRect()];
      const over = (a, c) => a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top;
      const run = { where: below === null ? 'over the banner' : `${below} px under it`, seen: 0, over: [], label: '' };
      for (let t = 0.1; t < 2.2; t += 0.1) {
        g.step(0.1, {});
        const b = [...document.querySelectorAll('#bounties .bounty')].find((x) => !x.hidden);
        if (!b || +b.style.opacity <= 0.5) continue;
        const br = b.getBoundingClientRect(); run.seen++; run.label = b.querySelector('small').textContent;
        if (words.some((w) => over(br, w))) run.over.push(+t.toFixed(1));
      }
      out.runs.push(run);
      g.endVoyage(0);
    }
    return out;
  });
  console.log(`a captain's bounty where a banner shows: ${overBanner.runs.map((r) => `rising ${r.where}, ${!r.seen ? 'NOT SHOWN' : r.over.length ? `OVER ITS WORDS at ${r.over.join(', ')} s` : `clear of its words (looked at ${r.seen} times)`}`).join('; ')}; ${overBanner.drawnOver ? 'drawn over it' : 'DRAWN UNDER IT'}`);
  if (overBanner.runs.some((r) => r.seen < 8 || r.label !== 'Captain\'s bounty' || r.over.length) || !overBanner.drawnOver) problems.push(`a bounty rising where a banner shows should keep clear of its words all the while it can be read, and be drawn over it: ${JSON.stringify(overBanner)}`);
  // scraps of canvas flap each to its own beat: two handfuls thrown a second apart; when the first burns out and the
  // second's are moved into its places in the batch, each scrap keeps its beat (it goes to the screen with the scrap,
  // and the canvas's shader uses it), so its flapping never jumps
  const scraps = await page.evaluate(() => {
    const g = window.__game, FX = g.fx, D = FX.debris;
    g.progress.reset(); g.progress.data.skies = 'cross'; g.fly('brig'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player, V = P.pos.constructor, from = P.aimAt().clone().addScaledVector(P.forward(), 40), up = new V(0, 1, 0), none = new V();
    FX.clear(); g.step(1 / 60, {});
    D.toss('canvas', from, up, 1, none, 6); g.step(1, {});
    const first = D.stats().canvas; D.toss('canvas', from, up, 1, none, 6); g.step(1 / 60, {});
    const mesh = g.scene.getObjectByName('debris-canvas'), seed = mesh.geometry.getAttribute('aSeed'), m = mesh.instanceMatrix.array;
    // a piece is known by its size (each its own, and steady until it fades in its last half second)
    const key = (i) => [0, 4, 8].map((c) => Math.hypot(m[i * 16 + c], m[i * 16 + c + 1], m[i * 16 + c + 2]).toFixed(4)).join();
    g.renderer.render(g.scene, g.camera);
    const used = g.renderer.info.programs.some((p) => p.getAttributes().aSeed !== undefined);
    g.step(1.9, {});
    const before = new Map(), slotOf = new Map();
    for (let i = first; i < mesh.count; i++) { before.set(key(i), seed.array[i]); slotOf.set(key(i), i); }
    const v0 = seed.version; g.step(0.2, {});
    let moved = 0, kept = 0, n = mesh.count;
    for (let i = 0; i < n; i++) { const k = key(i); if (slotOf.get(k) !== i) moved++; if (before.get(k) === seed.array[i]) kept++; }
    const out = { first, second: before.size, left: n, moved, kept, uploaded: seed.version > v0, used };
    g.endVoyage(0);
    return out;
  });
  console.log(`canvas scraps: ${scraps.moved} of ${scraps.left} moved in the batch as ${scraps.first} older ones burnt out, ${scraps.kept} kept their flapping's beat (${scraps.uploaded ? 'sent to the screen' : 'NOT SENT TO THE SCREEN'}, ${scraps.used ? 'used by the shader' : 'NOT USED BY THE SHADER'})`);
  if (scraps.first !== 6 || scraps.left !== 6 || scraps.moved !== 6 || scraps.kept !== 6 || !scraps.uploaded || !scraps.used) problems.push(`a canvas scrap should keep its own flapping beat when it's moved in the batch: ${JSON.stringify(scraps)}`);
  // less motion: a player whose device asks for it gets at most 0.35 of the kick
  await page.evaluate(() => { const g = window.__game; g.fly('frigate'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false); });
  const full = await volley();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const calm = await volley();
  await page.emulateMedia({ reducedMotion: null });
  await page.evaluate(() => window.__game.endVoyage(0));
  console.log(`reduced motion: the view kicks back ${calm.toFixed(2)} m instead of ${full.toFixed(2)} m`);
  if (!(full > 0.5) || calm > full * 0.35) problems.push(`with reduced motion the kick should be at most 0.35 of the full one: ${calm} of ${full}`);
  // a Surge on a phone running slowly (20 frames a second), with less motion and without: the view widens just as it
  // does at 60 frames a second, and never flies off (the most and least it's widened, where it ends, and how far the
  // camera got from the ship)
  const surgeAt = (frame) => page.evaluate((frame) => {
    const g = window.__game; g.fly('brig'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player; P.pos.set(0, 900, 0); P.heading = 0; P.sail = 1; P.speed = P.H.vmax * 0.8;
    g.step(0.5, { sail: 1 }, frame); g.step(frame, { sail: 1, pressed: new Set(['r']) }, frame);
    let lo = Infinity, hi = -Infinity, far = 0;
    for (let t = 0; t < 5; t += frame) { g.step(frame, { sail: 1 }, frame); lo = Math.min(lo, g.surgeView); hi = Math.max(hi, g.surgeView); far = Math.max(far, g.camera.position.distanceTo(P.pos)); }
    const out = { lo: +lo.toFixed(2), hi: +hi.toFixed(2), end: +g.surgeView.toFixed(2), far: +far.toFixed(1) };
    g.endVoyage(0);
    return out;
  }, frame);
  const surge60 = await surgeAt(1 / 60), surge20 = await surgeAt(0.05);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const calm60 = await surgeAt(1 / 60), calm20 = await surgeAt(0.05);
  await page.emulateMedia({ reducedMotion: null });
  console.log(`a Surge at 20 frames a second: the view widens ${surge20.lo}° to ${surge20.hi}° (at 60: ${surge60.lo}° to ${surge60.hi}°), camera at most ${surge20.far} m off (${surge60.far}); with less motion ${calm20.lo}° to ${calm20.hi}° (at 60: ${calm60.lo}° to ${calm60.hi}°)`);
  if (!(surge60.hi > 9) || Math.abs(surge20.hi - surge60.hi) > 1 || Math.abs(surge20.lo - surge60.lo) > 1 || Math.abs(surge20.end) > 0.5 || surge20.far > surge60.far * 1.05) problems.push(`a Surge on a slow phone should widen the view as it does at 60 frames a second: ${JSON.stringify({ surge20, surge60 })}`);
  for (const c of [calm20, calm60]) if (!(c.lo >= -0.1 && c.hi <= 12.5 && c.hi > 9 && Math.abs(c.end) < 0.5)) problems.push(`with less motion a Surge should widen the view by up to 12 degrees with no overshoot, at any frame rate: ${JSON.stringify({ calm20, calm60 })}`);

  // the title screen is Aethermoor itself at sunset, not the port's void: each frame draws the world (the map, the sky,
  // the clouds), with the Captain's ship flying her slow circle 700 m up over the Hearthsea and two or three raiders
  // crossing far off (not raiders that fight: none are in the fight's list), under a low sun with rays, in its own sky
  // light on the brass; the sky up beside her is warm and bright (the void is near black). The skies tint it: the
  // Maelstrom's darker than Fair Winds'. A new Captain is offered a big "Set sail" (and "To port" plainly beside it),
  // with Fair Winds marked as best for a first voyage; "Set sail" starts a voyage in her ship at once, with its own
  // banner, and puts back the afternoon sky (sun, rays, haze and light: exactly, but for a hair of the region's air
  // blending in over the first few seconds); back from the sea, the button names her
  // ship and the shards waiting are shown, and "To port" opens the port in its void. Each change of screen dips
  // through the night (the veil): to the title, to sea, home to port, back to the title, and to port.
  // A drag on its sky swings the view round her; let go, and it coasts on (the same at any frame rate, and not at all
  // while no time passes), then eases back to show the sun again within ten seconds; and the title always opens framed,
  // whatever a drag did last time. And the sun's shadows: their box sized to her on the title every time, even when the
  // last voyage was in a smaller ship
  const titleSky = await page.evaluate(async () => {
    const g = window.__game, $ = (id) => document.getElementById(id), R = g.renderer, gl = R.getContext(), out = {};
    const frames = (n) => new Promise((r) => { const f = () => (--n ? requestAnimationFrame(f) : r()); requestAnimationFrame(f); });
    const drawn = async () => { const real = R.render, seen = []; R.render = function (sc, c) { seen.push(sc === g.scene ? 'world' : sc === g.port.scene ? 'port void' : 'other'); return real.call(this, sc, c); }; await frames(2); R.render = real; return [...new Set(seen)].join(' '); };
    // (the mean colour of a block of the picture just drawn, x and y as shares of the screen from the top left, 0 to 255)
    const block = (x0, y0, x1, y1) => {
      const W = R.domElement.width, H = R.domElement.height, x = Math.round(x0 * W), y = Math.round((1 - y1) * H), w = Math.round((x1 - x0) * W), h = Math.round((y1 - y0) * H), px = new Uint8Array(w * h * 4);
      gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px); const m = [0, 0, 0];
      for (let i = 0; i < px.length; i += 4) for (let k = 0; k < 3; k++) m[k] += px[i + k];
      return m.map((v) => Math.round(v / (w * h)));
    };
    const shot = (skies) => { if (skies) { document.querySelector(`#skies [data-skies="${skies}"]`).click(); g.title.update(0.05); g.title.update(2); } g.title.update(1 / 60); g.title.render(); return { sky: block(0.75, 0.04, 0.95, 0.3), all: block(0.6, 0, 1, 1) }; };
    const veil = () => $('veil').getAnimations().map((a) => a.effect.getKeyframes()[0].opacity).join(' '), veils = out.veils = {};
    g.progress.reset(); g.port.setMode('port'); await frames(2); g.port.setMode('title');
    veils.title = veil();
    out.fresh = { button: $('btn-title-sail').textContent, toPort: $('btn-to-port').classList.contains('plain') && $('btn-to-port').offsetHeight > 0, rank: $('title-rank').hidden,
      chosen: [...document.querySelectorAll('#skies [aria-checked="true"]')].map((b) => b.dataset.skies).join(),
      first: [...document.querySelectorAll('#skies button')].filter((b) => b.querySelector('.first') && !b.querySelector('.first').hidden).map((b) => b.dataset.skies + ': ' + b.querySelector('.first').textContent).join() };
    out.drawn = await drawn();
    out.paintings = g.raiders.paintings(); // (the title's raiders coloured from their paintings, and their pixels let go since)
    const T = g.title, S = T.ship, a = S.root.position.clone(); T.update(1); const b = S.root.position.clone();
    out.ship = { name: S.recipe.name, inWorld: S.root.parent === g.scene, level: S.level, up: Math.round(b.y), fromCity: Math.round(Math.hypot(b.x - 30, b.z - 180)), moved: +a.distanceTo(b).toFixed(1) };
    out.raiders = T.raiders.map((r) => `${r.recipe.cls} ${r.level}${r.root.parent === g.scene ? '' : ' NOT IN THE SKY'}`).join(', ');
    out.fighting = g.raiders.list.length;
    out.sun = { y: +g.sun.position.clone().sub(g.sun.target.position).normalize().y.toFixed(2), rays: g.world.mood.uRays.value, ownLight: g.scene.environment !== g.port.scene.environment };
    out.cross = shot('cross'); out.fair = shot('fair'); out.mael = shot('mael'); shot('cross');
    // the wind: the big clouds carried as far, and the same way, as the cloud deck's pattern (world.js cover() moves it
    // 0.0022 and 0.0009 of its 1/0.00045-metre cells each tick of its clock)
    out.wind = { drift: g.world.mood.uDrift.value.toArray(), deck: [-0.0022 / 0.00045 * g.world.time.value, -0.0009 / 0.00045 * g.world.time.value] };
    // a drag on the sky (40 pixels a frame for five frames at 30 a second), then let go
    const C = g.renderer.domElement, ptr = (type, x, on = window) => on.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: 400, pointerId: 9, pointerType: 'mouse', bubbles: true }));
    const drag = (moves, px) => { ptr('pointerdown', 900, C); for (let i = 1; i <= moves; i++) { ptr('pointermove', 900 + i * px); T.update(1 / 30); } ptr('pointerup', 900 + moves * px); };
    const sunAt = () => { const p = T.camera.position.clone().addScaledVector(g.sun.position.clone().sub(g.sun.target.position).normalize(), 30000).project(T.camera); return [+p.x.toFixed(2), +p.y.toFixed(2), p.z < 1]; };
    T.update(0.1); const y0 = T.yaw, sun0 = sunAt();
    drag(5, 40);
    const swung = T.yaw - y0; T.update(0); T.update(0);
    out.drag = { sun0, swung: +swung.toFixed(2), still: T.yaw - y0 - swung };
    for (let i = 0; i < 40; i++) T.update(0.25);
    Object.assign(out.drag, { back: +T.yaw.toFixed(4), sun: sunAt() });
    // its coast over the two seconds after letting go, at 60 frames a second and at 15
    const coast = (step) => { drag(3, 30); const a = T.yaw; for (let i = 0; i < Math.round(2 / step); i++) T.update(step); const c = T.yaw - a; for (let i = 0; i < 40; i++) T.update(0.25); return +c.toFixed(3); };
    out.drag.coast = [coast(1 / 60), coast(1 / 15)];
    // dragged, then the port and back: the title opens framed
    drag(2, 50); const before = T.yaw; g.port.setMode('port'); g.port.setMode('title');
    out.drag.reopened = [+before.toFixed(2), T.yaw];
    // set sail from the title
    $('btn-title-sail').click(); veils.sail = veil(); g.waves.timer = 1e9; g.step(1 / 60, {});
    const P = g.player, day = new g.sun.position.constructor(-0.55, 0.52, 0.25).normalize(), sunNow = g.sun.position.clone().sub(g.sun.target.position).normalize();
    const names = [...document.querySelectorAll('#port-ships button b')].map((x) => x.textContent);
    out.sailed = { mode: g.mode, ship: P?.ship.recipe.id, banner: $('banner-title').textContent, sun: +sunNow.distanceTo(day).toFixed(5), rays: g.world.mood.uRays.value, cover: g.world.mood.uCover.value,
      haze: g.scene.fog.near, light: g.sun.intensity, env: g.scene.environment === g.port.scene.environment, ships: g.scene.children.filter((o) => names.includes(o.name)).map((o) => o.name).join(' '),
      titleRaiders: T.raiders.filter((r) => r.root.parent).length };
    out.drawnAtSea = await drawn();
    g.endVoyage(1); veils.home = veil(); g.port.setMode('title'); veils.back = veil();
    out.back = { voyages: g.progress.data.voyages, button: $('btn-title-sail').textContent, rank: $('title-rank').hidden ? '' : $('title-rank').textContent, first: !!document.querySelector('#skies .first:not([hidden])') };
    $('btn-to-port').click(); veils.port = veil();
    out.port = { mode: g.mode, drawn: await drawn(), rays: g.world.mood.uRays.value };
    // the sun's shadows: on the title in the Frigate, then a voyage in the Skiff, then the title in the Frigate again
    const d = g.progress.data, box = () => +g.sun.shadow.camera.right.toFixed(1);
    d.ships.frigate.owned = true; d.flying = 'frigate'; g.port.setMode('title'); out.shadow = [box()];
    g.fly('skiff'); g.waves.timer = 1e9; out.shadow.push(box()); g.endVoyage(0);
    d.flying = 'frigate'; g.port.setMode('title'); out.shadow.push(box(), g.sun.shadow.camera.far - g.sun.shadow.camera.near);
    g.port.setMode('port');
    return out;
  });
  console.log(`the title screen: drawing "${titleSky.drawn}"; her ship the ${titleSky.ship.name} (${titleSky.ship.level} detail) ${titleSky.ship.up} m up, ${titleSky.ship.fromCity} m from the island city, flying ${titleSky.ship.moved} m in a second; raiders crossing: ${titleSky.raiders} (${titleSky.fighting} fighting), coloured from ${titleSky.paintings.read} paintings, ${titleSky.paintings.held} still holding their pixels; the sun ${titleSky.sun.y} up, rays ${titleSky.sun.rays}, ${titleSky.sun.ownLight ? 'its own' : 'THE AFTERNOON\'S'} light on the brass; the sky beside her ${titleSky.cross.sky}; the whole picture Fair Winds ${titleSky.fair.all}, Maelstrom ${titleSky.mael.all}`);
  console.log(`the title for a new Captain: "${titleSky.fresh.button}", ${titleSky.fresh.toPort ? '"To port" plain beside it' : 'NO PLAIN "To port"'}, ${titleSky.fresh.first || 'NO FIRST-VOYAGE HINT'}; Set sail: ${titleSky.sailed.mode} in the ${titleSky.sailed.ship}, "${titleSky.sailed.banner}", the afternoon back (the sun ${titleSky.sailed.sun} off, rays ${titleSky.sailed.rays}, haze from ${titleSky.sailed.haze} m, ${titleSky.sailed.env ? 'its light on the brass' : 'THE SUNSET\'S LIGHT'}), drawing "${titleSky.drawnAtSea}", ships in the sky: ${titleSky.sailed.ships}; back from ${titleSky.back.voyages} voyage: "${titleSky.back.button}", "${titleSky.back.rank}"; To port draws "${titleSky.port.drawn}"; the veil from ${Object.entries(titleSky.veils).map(([k, v]) => `${k} ${v || 'NEVER'}`).join(', ')}`);
  const D = titleSky.drag;
  // (the sun on the screen: x and y from -1 to 1 across it, and whether it's in front of the camera)
  const sunBack = D.sun0[2] && Math.abs(D.sun0[0]) < 1.3 && Math.abs(D.sun0[1]) < 1.3 && D.sun[2] && Math.abs(D.sun[0] - D.sun0[0]) < 0.25 && Math.abs(D.sun[1] - D.sun0[1]) < 0.25;
  console.log(`the title's drag: swung ${D.swung}, ${D.still ? `MOVED ${D.still} WITH NO TIME PASSING` : 'still while no time passes'}, back to ${D.back} ten seconds after (the sun at ${D.sun0.slice(0, 2).join(', ')} on the screen before, ${D.sun[2] ? D.sun.slice(0, 2).join(', ') : 'BEHIND THE CAMERA'} after); its coast ${D.coast[0]} at 60 frames a second, ${D.coast[1]} at 15; dragged to ${D.reopened[0]}, it opens next time at ${D.reopened[1]}; the shadows' box ${titleSky.shadow.slice(0, 3).join(', ')} m (the Frigate, the Skiff, the Frigate)`);
  if (titleSky.drawn !== 'world' || !titleSky.ship.inWorld || titleSky.ship.level !== 'full' || Math.abs(titleSky.ship.up - 700) > 30 || titleSky.ship.fromCity > 600 || !(titleSky.ship.moved > 5)) problems.push(`the title screen should draw the world, with her ship flying over the Hearthsea: ${JSON.stringify({ drawn: titleSky.drawn, ship: titleSky.ship })}`);
  if (!titleSky.paintings.read || titleSky.paintings.held) problems.push(`the title's raiders should be coloured from their paintings, and let go of the paintings' pixels once they're put together (about 2 MB kept otherwise): ${JSON.stringify(titleSky.paintings)}`);
  if (!/^\w+ far, \w+ far(, \w+ far)?$/.test(titleSky.raiders) || titleSky.fighting) problems.push(`two or three raiders should cross the title's sky far off (their far models), not fighting: ${titleSky.raiders} (${titleSky.fighting} in the fight)`);
  if (!(titleSky.sun.y < 0.2) || titleSky.sun.rays !== 1 || !titleSky.sun.ownLight) problems.push(`the title screen should have its own low sun, with rays and its own light on the brass: ${JSON.stringify(titleSky.sun)}`);
  const lum = ([r, g, b]) => 0.3 * r + 0.59 * g + 0.11 * b;
  if (!(lum(titleSky.cross.sky) > 70) || !(titleSky.cross.sky[0] > titleSky.cross.sky[2])) problems.push(`the sky beside her on the title screen should be warm and bright (the port's void is near black): ${titleSky.cross.sky}`);
  if (!(lum(titleSky.mael.all) < lum(titleSky.fair.all) * 0.85)) problems.push(`the Maelstrom's skies should tint the title darker than Fair Winds': ${titleSky.mael.all} against ${titleSky.fair.all}`);
  if (titleSky.fresh.button !== 'Set sail' || !titleSky.fresh.toPort || !titleSky.fresh.rank || titleSky.fresh.first !== 'fair: Best for your first voyage' || titleSky.fresh.chosen !== 'fair') problems.push(`a new Captain's title should offer "Set sail", a plain "To port", and mark Fair Winds for a first voyage, chosen: ${JSON.stringify(titleSky.fresh)}`);
  if (titleSky.sailed.mode !== 'voyage' || titleSky.sailed.ship !== 'skiff' || !titleSky.sailed.banner.includes('first voyage') || titleSky.drawnAtSea !== 'world') problems.push(`"Set sail" on the title should start a voyage in her ship at once: ${JSON.stringify(titleSky.sailed)}`);
  // (exactly the afternoon's, but for the region's air: a little of it blends in over a few seconds, a hair of it in the
  // frame after setting sail)
  if (titleSky.sailed.sun > 1e-4 || titleSky.sailed.rays !== 0 || Math.abs(titleSky.sailed.cover) > 0.002 || Math.abs(titleSky.sailed.haze - 4000) > 25 || Math.abs(titleSky.sailed.light - 2.6) > 0.01 || !titleSky.sailed.env || titleSky.sailed.ships !== 'Zephyr' || titleSky.sailed.titleRaiders) problems.push(`setting sail should put the afternoon sky back exactly, and leave only her ship in the sky: ${JSON.stringify(titleSky.sailed)}`);
  if (titleSky.back.voyages !== 1 || titleSky.back.button !== 'Set sail in the Zephyr' || !titleSky.back.rank || titleSky.back.first) problems.push(`back from the sea, the title should name her ship and show the shards: ${JSON.stringify(titleSky.back)}`);
  if (titleSky.port.mode !== 'port' || titleSky.port.drawn !== 'port void' || titleSky.port.rays !== 0) problems.push(`"To port" from the title should open the port in its void: ${JSON.stringify(titleSky.port)}`);
  const wind = titleSky.wind;
  if (!(Math.hypot(...wind.deck) > 10) || Math.hypot(wind.drift[0] - wind.deck[0], wind.drift[1] - wind.deck[1]) > Math.hypot(...wind.deck) * 0.001) problems.push(`on the title the big clouds should drift with the cloud deck, on one wind: carried ${wind.drift.map(Math.round)} m, the deck ${wind.deck.map(Math.round)} m`);
  if (Object.keys(titleSky.veils).length !== 5 || Object.values(titleSky.veils).some((v) => v !== '1')) problems.push(`every change of screen should dip through the night (the title, to sea, home to port, back to the title, to port): ${JSON.stringify(titleSky.veils)}`);
  if (!sunBack || !(Math.abs(D.swung) > 0.8) || D.still !== 0 || !(Math.abs(D.back) < 0.02)) problems.push(`a drag on the title's sky should swing the view, stand still while no time passes, and ease back to show the sun where it was within ten seconds: ${JSON.stringify(D)}`);
  if (!(Math.abs(D.coast[0]) > 0.1) || Math.abs(D.coast[0] - D.coast[1]) > Math.abs(D.coast[0]) * 0.05 + 0.01) problems.push(`the title's view should coast on as far after a drag at any frame rate: ${D.coast[0]} at 60 frames a second, ${D.coast[1]} at 15`);
  if (!(Math.abs(D.reopened[0]) > 0.3) || D.reopened[1] !== 0) problems.push(`the title should open framed, whatever a drag did last time: dragged to ${D.reopened[0]}, it opened at ${D.reopened[1]}`);
  if (titleSky.shadow.slice(0, 3).join() !== '34,6.8,34' || titleSky.shadow[3] > 34 * 4 + 0.1) problems.push(`the sun's shadows on the title should be sized to her every time (34 m for the Frigate, even after a voyage in the Skiff): ${titleSky.shadow.join(', ')}`);
  // the title at a laptop's size, and a narrow window's (a tablet held upright): raiders in sight, clear of the card
  const titles = [];
  for (const [w, h] of [[1280, 800], [768, 1024]]) titles.push(titleProblems(await titleAt(page, w, h), w === 1280));
  await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(300);
  console.log(`the title screen: ${titles.join('; ')}`);

  // between waves, back to port and out again, the way a player moves up: look at the Cutter in port (too dear), sail
  // the Skiff, beat wave 4 (the card shows a raider captain's Brig coming next, built while the card is up), bank the
  // shards, buy the Cutter and sail her. The new voyage starts again at wave 1, one Skiff, and the Skiff isn't left
  // hanging in the sky
  const again = await page.evaluate(() => {
    const g = window.__game, out = {}, $ = (id) => document.getElementById(id);
    g.progress.reset(); g.progress.data.skies = 'cross'; g.port.setMode('port');
    document.querySelector('#port-ships [data-ship="cutter"]').click(); $('btn-sail').click();
    out.first = g.player.ship.recipe.id;
    delete g.raiders.templates['brig:captain'];
    g.raiders.clear(); Object.assign(g.waves, { n: 3, state: 'fight', next: null }); g.step(0.1, {});
    out.card = !$('calm').hidden && $('calm-line').textContent.includes('raider captain');
    out.prepared = !!g.raiders.templates['brig:captain'];
    $('btn-go-port').click();
    out.port = g.mode === 'port';
    g.progress.data.shards += 1000; g.port.refresh(); $('btn-buy').click(); $('btn-sail').click();
    out.second = g.player.ship.recipe.id;
    g.wind.strength = 0; g.step(5.5, {});
    out.wave1 = g.raiders.list.map((r) => r.id + (r.captain ? ' (captain)' : '')).join(' ');
    out.banner = $('banner-title').textContent;
    const names = [...document.querySelectorAll('#port-ships button b')].map((b) => b.textContent);
    out.ships = g.scene.children.filter((o) => names.includes(o.name)).map((o) => o.name).join(' ');
    g.endVoyage(0);
    return out;
  });
  console.log(`banked from the card after wave 4 (a captain prepared: ${again.prepared}), sailed again in the ${again.second}: wave 1 is "${again.wave1}" (${again.banner}); ships in the sky: ${again.ships}`);
  if (again.first !== 'skiff' || !again.card || !again.port || again.second !== 'cutter') problems.push(`going back to port from the card between waves went wrong: ${JSON.stringify(again)}`);
  if (again.wave1 !== 'skiff' || again.banner !== 'Raiders, wave 1') problems.push(`after banking from the card, the next voyage's wave 1 should be one Skiff, got "${again.wave1}" (${again.banner})`);
  if (!again.prepared) problems.push('a raider captain\'s ship isn\'t built while the card before her wave is up');
  if (again.ships !== 'Gale') problems.push(`the voyage sky should hold only the Captain's ship, it holds: ${again.ships}`);

  // a whole voyage, played: set sail from port, beat wave 1 (bringing down its only raider slows the world for a moment,
  // and the card rises only after it), sail on, then sink and get home with half
  const fought = await page.evaluate(async () => {
    const g = window.__game, out = {};
    g.progress.reset(); g.progress.data.skies = 'cross'; g.port.setMode('port');
    document.getElementById('btn-sail').click();
    const P = g.player; g.wind.strength = 0;
    out.sailed = g.mode === 'voyage' && P.ship.recipe.id === 'skiff';
    const slow = [], off = g.events.on('slowmo', () => slow.push(g.raiders.list.every((r) => r.f.down) ? 'last' : 'NOT LAST'));
    let t = 0;
    while (t < 200 && g.waves.state !== 'choose') {
      const live = g.raiders.list.filter((r) => !r.f.down);
      if (live.length && !out.raiders) out.raiders = g.raiders.list.map((r) => r.id).join(' '); // wave 1, as it came
      let c = { sailTo: 0.6 };
      if (live[0]) {
        const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2; const look = live[0].f.pos.clone().sub(T).normalize();
        g.cam.pitch = Math.max(-0.35, -Math.asin(look.y)); const a = Math.atan2(look.x, look.z) - P.heading; g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
        c = { fire: true, turn: Math.max(-1, Math.min(1, -g.cam.yaw * 2)), climb: Math.max(-1, Math.min(1, (live[0].f.pos.y - P.pos.y) / 40)) };
      }
      g.step(0.25, c); t += 0.25;
    }
    off();
    const calm = document.getElementById('calm');
    // (the card is shown at once, for the game, but waits for the slow motion before it rises: its rising is held back)
    out.wave1 = Math.round(t); out.choose = !calm.hidden; out.shards = Math.round(g.voyage.shards); out.slow = slow.join(' ');
    out.waits = parseFloat(getComputedStyle(calm).animationDelay) || 0;
    window.__voyageP = P;
    return out;
  });
  // in real time: a moment after the last raider went down the world is still slow, and the card not yet in view (as
  // long as its rising is still held back: `since`, how long its rising has been under way, in ms on the page's own
  // animation clock, which moves on as frames are drawn); then the card rises, and Sail on can be pressed once it's there
  await page.waitForTimeout(300); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  fought.dial = await page.evaluate(() => +window.__game.fx.timeScaleNow.toFixed(2));
  // (drawn slowly, in software, the card's rising can wait a few frames to get under way: it's read once it has)
  await page.waitForFunction(() => { const a = document.getElementById('calm').getAnimations()[0]; return a && !a.pending && a.currentTime > 0; }, null, { timeout: 30000 }).catch(() => {});
  Object.assign(fought, await page.evaluate(() => {
    const c = document.getElementById('calm'), cs = getComputedStyle(c), a = c.getAnimations()[0];
    return { unseen: cs.visibility === 'hidden' && +cs.opacity === 0, since: a ? Math.round(a.currentTime) : -1 };
  }));
  await page.waitForFunction(() => { const c = getComputedStyle(document.getElementById('calm')); return c.visibility === 'visible' && +c.opacity > 0.99; }, null, { timeout: 30000 }).catch(() => problems.push('the card between waves never rose into view'));
  await page.click('#btn-sail-on');
  const voyage = await page.evaluate(async (out) => {
    const g = window.__game, P = window.__voyageP;
    g.step(5, {});
    out.wave2 = g.waves.state === 'fight' && g.waves.n === 1;
    P.hit('hull', 1e6); g.step(6, {});
    out.sunk = !document.getElementById('paused').hidden && document.getElementById('paused-title').textContent.includes('went down');
    const before = g.progress.data.shards; out.half = Math.round(g.voyage.shards / 2);
    document.getElementById('btn-abandon').click();
    out.home = g.mode === 'port'; out.banked = g.progress.data.shards - before;
    return out;
  }, fought);
  console.log(`voyage: wave 1 (${voyage.raiders}) beaten in ${voyage.wave1} s (◆ ${voyage.shards}), sailed on, sank, home with ◆ ${voyage.banked}`);
  console.log(`the last raider of wave 1 down: slow motion told "${voyage.slow}", the world at ${voyage.dial} of its speed 0.3 s later; the card ${voyage.choose ? 'shown' : 'NOT SHOWN'} at once, held back ${voyage.waits} s before it rises, ${voyage.unseen ? 'not yet in view' : 'IN VIEW'} ${voyage.since} ms after it was shown`);
  if (voyage.slow !== 'last' || !(voyage.dial < 0.5)) problems.push(`bringing down a wave's last raider should slow the world once: ${JSON.stringify({ slow: voyage.slow, dial: voyage.dial })}`);
  if (!(voyage.waits >= 1.2) || !(voyage.since > 0) || (voyage.since < 1200 && !voyage.unseen)) problems.push(`the card between waves should wait for the slow motion before it rises: ${JSON.stringify({ waits: voyage.waits, since: voyage.since, unseen: voyage.unseen })}`);
  if (voyage.raiders !== 'skiff') problems.push(`a voyage's wave 1 should be one Skiff, got: ${voyage.raiders}`);
  if (!voyage.sailed || !voyage.choose || !voyage.shards || !voyage.wave2 || !voyage.sunk || !voyage.home || Math.abs(voyage.banked - voyage.half) > 1) problems.push(`a voyage went wrong: ${JSON.stringify(voyage)}`);
  // the save survives a reload
  await collect();
  await page.evaluate(() => { const d = window.__game.progress.data; d.shards = 1234; window.__game.progress.save(); document.querySelector('#set-aim [data-value="4"]').click(); });
  await page.reload();
  await page.waitForFunction(gameReady, null, { timeout: 180000 });
  await countEvents();
  const kept = await page.evaluate(() => window.__game.progress.data.shards);
  if (kept !== 1234) problems.push(`the save didn't survive a reload (${kept})`);
  const keptMusic = await page.evaluate(() => window.__game.settings.data.music);
  if (keptMusic !== 0) problems.push(`the music setting didn't survive a reload (${keptMusic})`);
  // (and the aim speed, on this device only: never in the save that goes between devices)
  const keptAim = await page.evaluate(() => ({ aim: window.__game.settings.data.aim, shown: document.querySelector('#set-aim [aria-checked="true"]')?.textContent, inSave: 'aim' in window.__game.progress.data || JSON.stringify(window.__game.progress.data).includes('picture') }));
  if (keptAim.aim !== 4 || keptAim.shown !== 'Fast' || keptAim.inSave) problems.push(`the aim speed should survive a reload, on this device only: ${JSON.stringify(keptAim)}`);
  await page.evaluate(() => document.querySelector('#set-aim [data-value="2"]').click());
  // the keys (a laptop) show on this device's first two voyages, and fold away as the first wave comes; from the third
  // voyage on they start folded (H, or the Keys button, brings them back)
  const keysShown = await page.evaluate(() => {
    const g = window.__game, $ = (id) => document.getElementById(id), out = [];
    const state = () => (!$('help').hidden && $('btn-help').hidden ? 'shown' : $('help').hidden && !$('btn-help').hidden ? 'folded' : 'BOTH OR NEITHER');
    g.settings.keep('voyages', 0);
    for (let i = 0; i < 3; i++) { g.fly('brig'); out.push(state()); }
    g.settings.keep('voyages', 0); g.fly('brig'); g.raiders.setAI(false); g.wind.strength = 0; g.waves.timer = 0.05; g.step(0.2, {});
    out.push(g.waves.state === 'fight' ? `${state()} at the first wave` : 'NO WAVE');
    $('btn-help').click(); out.push(`${state()} by the button`);
    g.raiders.clear(); g.endVoyage(0); g.settings.keep('voyages', 5);
    return out.join(', ');
  });
  console.log(`the keys on a laptop's voyages: ${keysShown}`);
  if (keysShown !== 'shown, shown, folded, folded at the first wave, shown by the button') problems.push(`the keys should show for a device's first two voyages, fold at the first wave, and come back with the button: ${keysShown}`);
  // directions in plain words, the right way round: a raider ahead and to the right (her bearing a little less than the
  // heading) is said to be "ahead on your right" and shows on the right of the screen looking ahead; the wind is said
  // to be behind you, or a head wind, by the banner and the compass; a wave's banner says where she is the same way
  const words = await page.evaluate(() => {
    const g = window.__game, $ = (id) => document.getElementById(id);
    g.fly('brig'); g.waves.timer = 1e9; g.raiders.setAI(false); const P = g.player; P.heading = 0.3;
    const seen = (rel) => {
      const r = g.raiders.spawn('skiff', P.pos.clone().add({ x: Math.sin(P.heading + rel) * 400, y: 0, z: Math.cos(P.heading + rel) * 400 }), 0, true);
      g.cam.yaw = 0; g.cam.pitch = 0; g.step(1 / 60, {}); const x = r.f.pos.clone().project(g.camera).x; g.raiders.clear(); return x;
    };
    const out = { right: g.words.side(-0.6), rightX: seen(-0.6), left: g.words.side(0.6), leftX: seen(0.6), ahead: g.words.side(0.1), behind: g.words.side(3) };
    Object.assign(g.wind, { dir: P.heading, strength: 0.1 }); g.step(0.2, {}); out.tail = [g.words.wind(), $('compass').textContent];
    Object.assign(g.wind, { dir: P.heading + Math.PI, strength: 0.1 }); g.step(0.2, {}); out.head = [g.words.wind(), $('compass').textContent];
    g.waves.timer = 0.05; g.step(0.1, {}); out.banner = $('banner-line').textContent;
    g.raiders.clear(); g.endVoyage(0);
    return out;
  });
  console.log(`directions: "${words.right}" (on screen at ${words.rightX.toFixed(2)}), "${words.left}" (${words.leftX.toFixed(2)}), "${words.ahead}", "${words.behind}"; the wind "${words.tail[0]}" ("${words.tail[1]}"), "${words.head[0]}" ("${words.head[1]}"); wave 1: "${words.banner}"`);
  if (words.right !== 'ahead on your right' || !(words.rightX > 0.1) || words.left !== 'ahead on your left' || !(words.leftX < -0.1) || words.ahead !== 'dead ahead' || words.behind !== 'behind you') problems.push(`directions should be left and right, the right way round: ${JSON.stringify(words)}`);
  if (words.tail[0] !== 'the wind behind you' || !words.tail[1].includes('Wind behind: 10% faster') || words.head[0] !== 'a head wind' || !words.head[1].includes('Head wind: 10% slower')) problems.push(`the wind should be told in words: ${JSON.stringify(words)}`);
  if (!/^a Skiff, (dead ahead|ahead on your (left|right)|off your (left|right) side|behind you on your (left|right)|behind you) · (the wind behind you|a head wind|a wind from your (left|right))$/.test(words.banner)) problems.push(`a wave's banner should say where she is in left and right: "${words.banner}"`);
  await page.evaluate(() => { const el = document.getElementById('set-music'); el.value = '0.8'; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });

  // the real keys and mouse, at sea in the Brig
  await page.evaluate(() => { const g = window.__game; g.fly('brig'); g.waves.timer = 1e9; g.raiders.setAI(false); g.cam.yaw = 0; });
  await undrawn(page, true);
  const s0 = await page.evaluate(() => window.__game.player.sail);
  await page.keyboard.down('w'); await page.keyboard.down('d');
  await wait(page, (s0) => window.__game.player.sail > s0 + 0.01 && window.__game.player.turn > 0.02, s0, 'W and D set more sail and turn');
  await page.keyboard.up('d'); await page.keyboard.up('w');
  await page.keyboard.press('r');
  await wait(page, () => window.__game.player.surge.on > 0, null, 'R surges');
  await page.mouse.move(640, 300); await page.mouse.down(); await page.mouse.move(760, 330, { steps: 6 }); await page.mouse.up();
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.1, null, 'dragging the mouse swings the camera');
  // the wheel: a trackpad's flick (many small nudges) moves the camera a little; a mouse's notch about one step
  const frames = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  await page.evaluate(() => { window.__game.cam.zoom = 1; }); await frames();
  for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 3);
  await frames(); const flick = await page.evaluate(() => window.__game.cam.zoom);
  await page.evaluate(() => { window.__game.cam.zoom = 1; }); await frames();
  await page.mouse.wheel(0, 100); await frames(); const notch = await page.evaluate(() => window.__game.cam.zoom);
  console.log(`wheel: a trackpad flick zooms ×${flick.toFixed(2)}, a mouse notch ×${notch.toFixed(2)}`);
  if (flick < 1.02 || flick > 1.2 || notch < 1.08 || notch > 1.16) problems.push(`the wheel zooms wrongly: a trackpad flick ×${flick.toFixed(2)}, a mouse notch ×${notch.toFixed(2)}`);
  await page.evaluate(() => { window.__game.cam.zoom = 1; });
  const reloaded = () => page.evaluate(() => { const g = window.__game; for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0; g.bolts.bolts.length = 0; g.cam.yaw = 0.15; g.cam.pitch = 0.12; });
  await page.mouse.click(640, 300);
  await wait(page, () => /\b(locked|nolock)\b/.test(document.body.className), null, 'a click locks the mouse to the view (or the page says to drag instead)');
  console.log(`mouse: ${await page.evaluate(() => document.body.classList.contains('locked') ? 'locked to the view' : 'drag to aim')}`);
  await reloaded(); await page.mouse.down();
  await wait(page, () => window.__game.bolts.bolts.length > 0, null, 'left click fires');
  await page.mouse.up(); await page.keyboard.press('Escape');
  // (how loud the sound has been since the audio clock read `from`, measured on the sound's own thread: `mark` reads it)
  const mark = () => page.evaluate(() => window.__game.audio.ctx.currentTime);
  const loudestSince = (from) => page.evaluate((from) => +window.__game.audio.mixer.peak(from).toFixed(3), from);
  await wait(page, () => window.__game.audio.state === 'running' && window.__game.audio.ready, null, 'the sound starts again with a key after the page is reloaded');
  await wait(page, () => window.__game.audio.music === 'flight' || window.__game.audio.music === 'marsh' || window.__game.audio.music === 'desert', null, 'the music turned up again starts again (at sea between waves)');
  await page.evaluate(() => window.__game.audio.level()); await wait(page, () => window.__game.audio.mixer.metered, null, 'the sound\'s level meter starts');
  await page.evaluate(() => window.__game.gunnery.cancel()); await page.waitForTimeout(900); // (the last volley's guns all gone quiet)
  await reloaded(); const calm0 = await mark(); await page.waitForTimeout(400); const calmLevel = await loudestSince(calm0); // (the music and the wind)
  const guns0 = await page.evaluate(() => window.__game.audio.mixer.stats.started.gun), volley0 = await mark();
  await page.keyboard.down('f');
  await wait(page, () => window.__game.bolts.bolts.length > 0, null, 'F fires');
  await page.keyboard.up('f');
  await page.waitForTimeout(900);
  const volleyLevel = await loudestSince(volley0), gunsPlayed = await page.evaluate((g0) => window.__game.audio.mixer.stats.started.gun - g0, guns0);
  console.log(`a real volley: ${gunsPlayed} gun sounds, the sound peaking at ${volleyLevel} (${calmLevel} before, the wind and the music)`);
  if (!gunsPlayed || !(volleyLevel > 0.2) || !(volleyLevel > calmLevel + 0.1)) problems.push(`a real volley should be heard: ${JSON.stringify({ gunsPlayed, volleyLevel, calmLevel })}`);
  await page.keyboard.press('p');
  await wait(page, () => window.__game.paused && !document.getElementById('paused').hidden, null, 'P pauses');
  await wait(page, () => window.__game.audio.mixer.hold.gain.value < 0.05, null, 'the sounds go quiet while paused');
  // Settings from the pause card too
  await page.click('#btn-settings-pause');
  if (await page.evaluate(() => document.getElementById('settings').hidden)) problems.push('the pause card\'s Settings button doesn\'t open the Settings card');
  await page.keyboard.press('Escape');
  if (!(await page.evaluate(() => document.getElementById('settings').hidden))) problems.push('Esc doesn\'t close the Settings card');
  // How to fly, from the pause card: a laptop's keys (not the touch controls); Esc goes back to the pause card
  await page.click('#btn-howto');
  const howto = await page.evaluate(() => { const c = document.querySelector('#howto .card'), b = c.getBoundingClientRect(), shown = (sel) => getComputedStyle(document.querySelector(sel)).display !== 'none';
    return { open: !document.getElementById('howto').hidden, keys: shown('#howto dl.mouse-only'), touch: shown('#howto dl.touch-only'), fits: b.top >= 0 && b.bottom <= innerHeight, says: c.textContent.includes('Left click or F') }; });
  await page.keyboard.press('Escape');
  const backToPause = await page.evaluate(() => document.getElementById('howto').hidden && !document.getElementById('paused').hidden && window.__game.paused);
  console.log(`How to fly: ${howto.open ? 'opens from the pause card' : 'DOES NOT OPEN'}, ${howto.keys && !howto.touch ? 'showing the keys' : 'SHOWING THE WRONG CONTROLS'}; Esc ${backToPause ? 'goes back to the pause card' : 'DOESN\'T GO BACK'}`);
  if (!howto.open || !howto.keys || howto.touch || !howto.fits || !howto.says || !backToPause) problems.push(`How to fly should open from the pause card with a laptop's keys, fit the screen, and Esc go back to the pause card: ${JSON.stringify({ ...howto, backToPause })}`);
  await page.click('#btn-resume');
  if (await page.evaluate(() => window.__game.paused)) problems.push('Resume does not resume');
  await wait(page, () => window.__game.audio.mixer.hold.gain.value > 0.9, null, 'the sounds come back on Resume');
  // sounds for a fight, played as the game's clock runs (a test asking for them): a raider Brig 240 m ahead, nearly
  // sunk, shot by the bow guns (a crack, hits), blown apart (blasts), her shards spilling (coins) and gathered (chimes)
  const fightSound = await page.evaluate(() => {
    const g = window.__game, A = g.audio, S = A.mixer.stats.started, was = { ...S }, fx0 = A.stats.effects, P = g.player;
    A.loudSteps = true;
    let down = '';
    try {
      g.raiders.clear(); g.bolts.clear(); g.waves.timer = 1e9; P.pos.set(0, 900, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0; P.repair(1);
      const foe = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 4, z: 240 }), 2, true); foe.f.health.hull = 40;
      for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
      let t = 0;
      while (t < 4 && !foe.f.down) {
        const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2; const look = foe.f.pos.clone().sub(T).normalize();
        g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading;
        g.step(0.05, { fire: true }); t += 0.05;
      }
      down = foe.f.down?.why ?? '';
      g.step(2, {});
      g.pickups.spill(P.pos.clone().add({ x: 0, y: 0, z: 30 }), P.velocity, 60); g.step(2, { sail: 0.2 });
    } finally { A.loudSteps = false; }
    const d = {}; for (const k in S) d[k] = S[k] - was[k];
    return { ...d, effects: A.stats.effects - fx0, down };
  });
  console.log(`a fight's sounds: a raider Brig shot down (${fightSound.down || 'NOT DOWN'}): ${fightSound.gun} gun, ${fightSound.hit} hit, ${fightSound.blast} blast and ${fightSound.chime} shard sounds, ${fightSound.effects} of Chris's`);
  if (fightSound.down !== 'hull' || !fightSound.gun || !fightSound.hit || !fightSound.blast || !fightSound.chime || !fightSound.effects) problems.push(`firing, hits, a raider blown apart and shards gathered should all sound: ${JSON.stringify(fightSound)}`);
  // the sound turned off in Settings: its clock stops, and nothing at all is played meanwhile, not a fight's sounds, nor
  // Chris's effects, nor the port's notes (or they'd all wait, and burst out together when it came back): so turning it
  // back on brings only the tick that says so. And the Sounds slider at nothing: the game's sounds and the sky's let go,
  // and back when it's turned up
  const offSound = await page.evaluate(async () => {
    const g = window.__game, A = g.audio, S = A.mixer.stats.started, P = g.player, pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const total = () => { let n = 0; for (const k in S) n += S[k]; return n; };
    const fight = (secs) => {
      g.raiders.clear(); g.bolts.clear(); P.pos.set(0, 900, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0; P.repair(1);
      const foe = g.raiders.spawn('brig', P.pos.clone().add({ x: 0, y: 4, z: 220 }), 2, true);
      for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0;
      for (let t = 0; t < secs; t += 0.05) {
        const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2; const look = foe.f.pos.clone().sub(T).normalize();
        g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading;
        g.step(0.05, { fire: true });
      }
      g.raiders.clear(); g.bolts.clear();
    };
    const try_ = () => { g.sound.ui('ui-confirm'); g.sound.effect('coins'); g.sound.effect('boss'); A.tone({ f: 440, ratio: 2, index: 0.8, d: 0.4, g: 0.1 }); };
    const out = {};
    A.loudSteps = true;
    try {
      g.settings.set('sound', false);
      for (let i = 0; i < 60 && A.state === 'running'; i++) await pause(50);
      const n0 = total(), fx0 = A.stats.effects, t0 = A.stats.tones, fire0 = A.stats.events.fire ?? 0, hit0 = A.stats.events.hit ?? 0;
      try_(); fight(3);
      out.off = { state: A.state, sounds: total() - n0, effects: A.stats.effects - fx0, tones: A.stats.tones - t0, fire: (A.stats.events.fire ?? 0) - fire0, hits: (A.stats.events.hit ?? 0) - hit0 };
      const tick0 = A.stats.played['ui-cursor'] ?? 0, fx1 = A.stats.effects;
      g.settings.set('sound', true);
      for (let i = 0; i < 60 && (A.stats.played['ui-cursor'] ?? 0) === tick0; i++) await pause(50);
      out.back = { state: A.state, tick: (A.stats.played['ui-cursor'] ?? 0) - tick0, effects: A.stats.effects - fx1 };
      // the Sounds slider at nothing
      g.settings.set('effects', 0);
      for (let i = 0; i < 80 && g.sound.sky; i++) await pause(50); // (let go at the next frame drawn)
      const n1 = total(), fx2 = A.stats.effects;
      try_(); fight(1.5);
      out.none = { sky: !!g.sound.sky, sounds: total() - n1, effects: A.stats.effects - fx2 };
      g.settings.set('effects', 1);
      for (let i = 0; i < 80 && !g.sound.sky; i++) await pause(50);
      const n2 = total(); fight(1.5);
      out.up = { sky: !!g.sound.sky, sounds: total() - n2 };
    } finally { A.loudSteps = false; g.settings.set('sound', true); g.settings.set('effects', 1); }
    return out;
  });
  console.log(`the sound off: ${offSound.off.state}, a fight (${offSound.off.fire} guns, ${offSound.off.hits} hits) and Chris's effects made ${offSound.off.sounds} sounds, ${offSound.off.effects} effects and ${offSound.off.tones} notes; on again: ${offSound.back.state}, with ${offSound.back.tick} tick (${offSound.back.effects} effects in all); the Sounds slider at nothing: the sky's sound ${offSound.none.sky ? 'STILL MADE' : 'let go'}, ${offSound.none.sounds} sounds and ${offSound.none.effects} effects made; turned up: the sky ${offSound.up.sky ? 'back' : 'NOT BACK'}, ${offSound.up.sounds} sounds`);
  if (offSound.off.state !== 'suspended' || !offSound.off.fire || !offSound.off.hits || offSound.off.sounds || offSound.off.effects || offSound.off.tones) problems.push(`with the sound off nothing should be played (or kept to play later): ${JSON.stringify(offSound.off)}`);
  if (offSound.back.state !== 'running' || offSound.back.tick !== 1) problems.push(`turning the sound back on should play just its tick: ${JSON.stringify(offSound.back)}`);
  if (offSound.none.sky || offSound.none.sounds || offSound.none.effects || !offSound.up.sky || !offSound.up.sounds) problems.push(`with the Sounds slider at nothing, none of the game's sounds should be made, and they should come back when it's turned up: ${JSON.stringify(offSound)}`);
  // crossing into another region between waves: its name shown, and a soft chord (Chris's new-area)
  const crossing = await page.evaluate(async () => {
    const g = window.__game, A = g.audio, P = g.player, pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const n0 = A.stats.events.region ?? 0, chord0 = A.stats.played['new-area'] ?? 0, spots = [[6000, -4000], [-6000, 4000], [-6000, -4000], [6000, 4000], [0, 6000], [0, -6000]];
    A.loudSteps = true;
    try {
      for (let i = 0; i < 40 && (A.stats.events.region ?? 0) === n0; i++) {
        const [x, z] = spots[i % spots.length]; P.pos.set(x, 900, z); g.step(0.25, {});
        if ((A.stats.events.region ?? 0) === n0) await pause(150); // (a banner's place is kept for it for a few seconds)
      }
    } finally { A.loudSteps = false; }
    const out = { told: (A.stats.events.region ?? 0) - n0, name: `${document.getElementById('region-name').textContent} ("${document.getElementById('region-air').textContent}")`, chord: (A.stats.played['new-area'] ?? 0) - chord0 };
    P.pos.set(0, 900, 0);
    return out;
  });
  console.log(`crossing into ${crossing.name}: told ${crossing.told} time${crossing.told === 1 ? '' : 's'}, ${crossing.chord} chord`);
  if (crossing.told !== 1 || crossing.chord !== 1) problems.push(`crossing into another region should show its name and play a soft chord, once: ${JSON.stringify(crossing)}`);
  // a wave arriving changes the music: Break the Grip for a wave of raiders
  await page.evaluate(() => { const g = window.__game; g.raiders.clear(); g.raiders.setAI(false); Object.assign(g.waves, { n: 0, state: 'calm', timer: 0.05, next: null }); });
  await wait(page, () => window.__game.audio.music === 'battle', null, 'a wave of raiders arriving plays Break the Grip');
  // the worst a fight can sound (five raiders and a Man-o'-war, the Captain's broadside, hits, a blast, shards...), with
  // Chris's effects that come in the same moments (a captain's wave banner, the hull's alarm bell, coins, a shard's
  // pickup: recorded live, as they can't be played offline), over three seconds of the battle music recorded as it
  // plays, every slider at the top: an offline render. What goes into the soft clip must stay under 0.95 (the clip only
  // rounds it a little, never flattening it), and what comes out never clips
  const self = await page.evaluate(async () => {
    const g = window.__game, A = g.audio, [rec, chris] = await Promise.all([A.recordMusic(3), g.sound.worstChris()]);
    const top = (b) => { let p = 0; if (b) for (const d of [b.getChannelData(0), b.getChannelData(1)]) for (let i = 0; i < d.length; i++) p = Math.max(p, Math.abs(d[i])); return +p.toFixed(3); };
    return { ...(await g.sound.selfTest(rec, chris)), music: top(rec), chris: top(chris) };
  });
  console.log(`the worst fight (offline, ${self.stats.started.gun + self.stats.started.foe} gun sounds, ${self.stats.merged} hits merged, ${self.stats.dropped} sounds left out, and Chris's effects peaking at ${self.chris}), over the battle music (peaking at ${self.music}): into the soft clip it peaks at ${self.into.peak}, ${self.into.over} samples past its ${self.knee} knee; out of it ${self.peak}, ${self.clipped} samples clipped, ${self.rmsDb} dB; 7 s made in ${self.made} ms and rendered in ${self.rendered} ms`);
  if (!(self.music > 0.05) || !(self.chris > 0.05)) problems.push(`the battle music or Chris's effects didn't record: ${self.music}, ${self.chris}`);
  if (self.into.peak > 0.95 || self.peak > 0.98 || self.clipped || !(self.rmsDb > -40)) problems.push(`the worst fight's sound should stay under 0.95 going into the soft clip, and never clip: ${JSON.stringify({ ...self, stats: undefined })}`);
  // what the sound costs: each volley's sounds and each frame's (the music and the sky), on this machine
  const cost = await page.evaluate(() => {
    const g = window.__game, A = g.audio, ms0 = A.stats.ms, P = g.player, hull0 = P.full.hull;
    let volleys = 0; const off = g.events.on('volley', () => volleys++);
    A.loudSteps = true;
    try {
      g.raiders.clear(); g.raiders.setAI(true); g.waves.timer = 1e9; P.full.hull = P.health.hull = 1e6;
      const f = P.forward();
      ['frigate', 'brig', 'cutter'].forEach((id, i) => g.raiders.spawn(id, P.pos.clone().addScaledVector(f, 260 + i * 90).add({ x: (i - 1) * 140, y: 10, z: 0 }), P.heading + (i ? 2.4 : -1.2), false));
      for (let k = 0; k < 24; k++) {
        const r = g.raiders.list.find((x) => !x.f.down);
        if (r) { const T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2; const look = r.f.pos.clone().sub(T).normalize(); g.cam.pitch = -Math.asin(look.y); g.cam.yaw = Math.atan2(look.x, look.z) - P.heading; }
        g.step(0.25, { fire: true, sail: 0 });
      }
    } finally { A.loudSteps = false; off(); g.raiders.setAI(false); g.raiders.clear(); P.full.hull = hull0; P.repair(1); }
    return { volleys, perVolley: +((A.stats.ms - ms0) / Math.max(1, volleys)).toFixed(2), perFrame: +(g.sound.frame.ms / Math.max(1, g.sound.frame.frames)).toFixed(3), frames: g.sound.frame.frames };
  });
  console.log(`what the sound costs here: ${cost.perVolley} ms a volley (${cost.volleys} volleys, with their hits), ${cost.perFrame} ms a frame (${cost.frames} frames)`);
  if (cost.perVolley > 2 || cost.perFrame > 0.25) problems.push(`the sound costs too much: ${JSON.stringify(cost)}`);
  // a battle to look at: a raider captain's Frigate and two Cutters against the Brig (drawn again)
  await undrawn(page, false);
  await page.evaluate(battle, ['frigate', 'cutter', 'cutter']);
  await page.waitForTimeout(2500);
  await shot(page, 'laptop-battle');
  // the drawing context lost and given back (a phone does this after a long time in the background): the voyage
  // pauses, and the sky's light and the cloud pattern are drawn again, as cloudy as ever
  const clouds = () => page.evaluate(() => {
    const g = window.__game, T = g.world.clouds.target, n = T.width, px = new Uint8Array(n * n * 2); let sum = 0;
    g.renderer.readRenderTargetPixels(T, 0, 0, n, n, px); for (let i = 0; i < n * n; i++) sum += (px[i * 2] * 256 + px[i * 2 + 1]) / 65535;
    return +(sum / (n * n)).toFixed(3);
  });
  const cloudy = await clouds();
  const lost = await page.evaluate(async () => {
    const g = window.__game, gl = g.renderer.getContext(), ext = gl.getExtension('WEBGL_lose_context'), c = g.renderer.domElement;
    const event = (name) => new Promise((r, no) => { c.addEventListener(name, r, { once: true }); setTimeout(() => no(new Error(`no ${name} event`)), 60000); });
    const was = event('webglcontextlost'); ext.loseContext(); await was;
    const paused = g.paused;
    await new Promise((r) => setTimeout(r, 300)); // (the browser allows it back only once the lost event is over)
    const back = event('webglcontextrestored'); ext.restoreContext(); await back;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const env = g.scene.environment, tex = (t) => !!g.renderer.properties.get(t).__webglTexture;
    return { paused, sky: tex(env) && g.port.scene.environment === env, clouds: tex(g.world.clouds.texture) };
  }).catch((e) => ({ error: e.message }));
  const cloudyAfter = await clouds();
  console.log(`drawing context lost: ${lost.paused ? 'paused' : 'NOT PAUSED'}; given back: sky light ${lost.sky ? 'back' : 'GONE'}, clouds ${lost.clouds ? 'back' : 'GONE'} (the cloud pattern's mean ${cloudy} → ${cloudyAfter})`);
  if (!lost.paused || !lost.sky || !lost.clouds || Math.abs(cloudy - cloudyAfter) > 0.002 || cloudy < 0.47 || cloudy > 0.5) problems.push(`losing the drawing context went wrong: ${JSON.stringify({ ...lost, cloudy, cloudyAfter })}`);
  // between waves the card is a strip docked at the bottom, clear of the middle (where the wreck and her shards are);
  // with the mouse locked it can't be clicked, so Enter sails on and B goes back to port, as its buttons say
  await page.evaluate(() => { const g = window.__game; g.pause(false); document.activeElement?.blur?.(); g.raiders.clear(); g.raiders.setAI(false); Object.assign(g.waves, { n: 1, state: 'fight', next: null }); g.step(0.05, {}); });
  const strip = await page.evaluate(() => { const g = window.__game, b = document.getElementById('calm').getBoundingClientRect();
    return { state: g.waves.state, top: Math.round(b.top), bottom: Math.round(b.bottom), h: innerHeight, keys: [...document.querySelectorAll('#calm kbd')].map((k) => k.textContent).join(' '), gunsHidden: getComputedStyle(document.getElementById('battery')).display === 'none' }; });
  await page.keyboard.press('Enter');
  await wait(page, () => window.__game.waves.state === 'calm' && document.getElementById('calm').hidden, null, 'Enter sails on from the card between waves');
  await page.evaluate(() => { const g = window.__game; g.raiders.clear(); Object.assign(g.waves, { n: 2, state: 'fight', next: null }); g.step(0.05, {}); });
  await page.keyboard.press('b');
  await wait(page, () => window.__game.mode === 'port', null, 'B goes back to port from the card between waves');
  console.log(`the card between waves: a strip from ${strip.top} to ${strip.bottom} px of ${strip.h}, keys "${strip.keys}", the guns' label ${strip.gunsHidden ? 'out of its way' : 'STILL SHOWING'}`);
  if (strip.state !== 'choose' || strip.bottom < strip.h - 60 || strip.top < strip.h * 0.62 || strip.keys !== 'Enter B' || !strip.gunsHidden) problems.push(`between waves the card should be a strip docked at the bottom, saying Enter and B: ${JSON.stringify(strip)}`);
  // nothing on the screen lands on anything else on a laptop either (layoutAt, with the keys: shown on the first two
  // voyages, then the Keys button), at this size and on two shorter windows (a 1366 by 768 laptop, a small window); the
  // ship going down with the big map open, at the smallest
  {
    const HUD = ['ship', 'compass', 'btn-pause', 'minimap', 'score', 'battery', 'toast', 'warn', 'banner', 'region', 'aim', 'help', 'btn-help', 'calm'];
    const PANELS = ['ship', 'compass', 'btn-pause', 'minimap', 'score', 'battery', 'help', 'btn-help'];
    const voyages = await page.evaluate(() => { const S = window.__game.settings, n = S.data.voyages; S.keep('voyages', 0); return n; });
    const layouts = [];
    for (const [w, h] of [[1280, 800], [1366, 768], [1024, 640]]) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(500);
      await page.waitForFunction(([w, h]) => Math.abs(window.__game.camera.aspect - w / h) < 1e-6, [w, h], { timeout: 30000 }).catch(() => problems.push(`laptop ${w}x${h}: the game never heard the window change size`));
      const keys = await page.evaluate(() => window.__game.settings.data.voyages < 2 ? 'the keys' : 'the Keys button');
      layouts.push(`${w}x${h} with ${keys}: ${layoutProblems(await layoutAt(page, HUD, PANELS, w === 1024), `laptop ${w}x${h}`)}; a bounty ${bountyProblems(await bountyCard(page), `laptop ${w}x${h}`)}`);
    }
    console.log(`laptop layouts: ${layouts.join('; ')}`);
    await page.evaluate((n) => window.__game.settings.keep('voyages', n + 3), voyages);
    await page.setViewportSize({ width: 1280, height: 800 });
  }
  await collect();
  const untold = (await page.evaluate(() => Object.keys(window.__game.events.PAYLOAD))).filter((k) => !told.has(k));
  console.log(`the game's news: ${told.size} kinds told${untold.length ? `, NEVER: ${untold.join(', ')}` : ', every kind'}`);
  if (untold.length) problems.push(`these events were never told while the game was played: ${untold.join(', ')}`);
  await page.close();
}
if (!quick && !demoOnly) {
  const page = await open('game', 'phone', gameReady);
  await page.evaluate(() => { const p = window.__game.progress; p.reset(); p.data.skies = 'cross'; });
  const start = await page.evaluate(() => ({ touch: document.body.classList.contains('touch') }));
  if (!start.touch) problems.push('phone: the touch controls are not showing');
  await page.waitForTimeout(2500); // let the loading cover fade
  await shot(page, 'phone-title');
  const phoneBefore = await page.evaluate(() => window.__game.audio.state);
  await page.tap('#btn-to-port');
  // the first tap starts the sound; stopped (as an iPhone does after a call), the next tap starts it again
  await wait(page, () => window.__game.audio.state === 'running', null, 'phone: the first tap starts the sound');
  await page.evaluate(() => window.__game.audio.ctx.suspend());
  await wait(page, () => window.__game.audio.state === 'suspended', null, 'phone: the sound stops');
  // (as an iPhone has it: a finger landing on the screen may not start sound, only its lifting may, so the silent blip
  // must go with that too)
  await page.evaluate(() => { const A = window.__game.audio, C = A.ctx, real = C.resume.bind(C); window.__blips = { ...A.stats.blips }; C.resume = () => (/^(pointerdown|touchstart)$/.test(window.event?.type ?? '') ? Promise.resolve() : real()); });
  await page.tap('#port-ships [data-ship="skiff"]');
  await wait(page, () => window.__game.audio.state === 'running', null, 'phone: a tap starts the stopped sound again');
  const blipped = await page.evaluate(() => { const A = window.__game.audio; delete A.ctx.resume; return ['pointerup', 'touchend', 'click'].filter((k) => (A.stats.blips[k] ?? 0) > (window.__blips[k] ?? 0)); });
  // the Settings card fits the phone, and says to check the phone isn't on silent
  await page.tap('#btn-settings-port');
  const phoneSettings = await page.evaluate(() => { const b = document.querySelector('#settings .card').getBoundingClientRect(), n = document.querySelector('.settings-note'); return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom), note: n.offsetHeight > 0 && n.textContent.includes('isn\'t on silent'), rows: document.querySelectorAll('#settings-rows .setting').length }; });
  await shot(page, 'phone-settings');
  await page.tap('#btn-settings-done');
  console.log(`phone: sound ${phoneBefore === 'none' ? 'not made' : 'MADE'} before the first tap, started by it, and again after it stopped (the silent blip with ${blipped.join(', ') || 'NO TOUCH THAT COUNTS'}); Settings ${phoneSettings.left}-${phoneSettings.right} px across, ${phoneSettings.rows} rows, ${phoneSettings.note ? 'with' : 'WITHOUT'} the note about silent`);
  if (phoneBefore !== 'none') problems.push(`phone: the sound shouldn't start before the first tap (${phoneBefore})`);
  if (!blipped.length) problems.push('phone: a tap that finds the sound stopped should play the silent blip as the finger lifts (an iPhone needs it then)');
  if (phoneSettings.left < 0 || phoneSettings.right > 390 || phoneSettings.top < 0 || phoneSettings.bottom > 844 || !phoneSettings.note || phoneSettings.rows < 3) problems.push(`phone: the Settings card should fit the screen, with the note about silent: ${JSON.stringify(phoneSettings)}`);
  await page.evaluate(() => { window.__game.progress.data.shards = 500; window.__game.port.refresh(); });
  await page.tap('#port-ships [data-ship="cutter"]');
  await page.waitForTimeout(1500);
  await shot(page, 'phone-port');
  // the port's two tabs on a phone: her upgrades a tap away (a gold dot on the tab when there's one you can buy)
  await page.tap('#port-ships [data-ship="skiff"]');
  const dot = await page.evaluate(() => !document.querySelector('#pp-tab-upgrades .dot').hidden);
  await page.tap('#pp-tab-upgrades');
  const shows = () => page.evaluate(() => Object.fromEntries(['pp-stats', 'pp-mods', 'pp-power'].map((id) => [id, document.getElementById(id).getBoundingClientRect().height > 0])));
  const upgrades = await shows();
  await page.waitForTimeout(800);
  await shot(page, 'phone-port-upgrades');
  await page.tap('#pp-tab-ship');
  const ship = await shows();
  console.log(`phone port: the Upgrades tab ${dot ? 'has its gold dot' : 'HAS NO DOT'}, and shows ${Object.keys(upgrades).filter((k) => upgrades[k]).join(' ')}; the ship's tab ${Object.keys(ship).filter((k) => ship[k]).join(' ')}`);
  if (!dot || upgrades['pp-stats'] || !upgrades['pp-mods'] || !upgrades['pp-power'] || !ship['pp-stats'] || ship['pp-mods']) problems.push(`phone: the port's tabs should show the ship or her upgrades: ${JSON.stringify({ dot, upgrades, ship })}`);
  // the Galleon and the Man-o'-war bought and sailed with taps
  console.log(`phone, the big two: ${bigTwoProblems(await bigTwoAt(page, 'phone', (sel) => page.tap(sel)), 'phone')}`);
  await page.tap('#btn-sail');
  if (await mode(page) !== 'voyage') problems.push('phone: "Set sail" does not set sail');
  await page.evaluate(() => { const g = window.__game; g.waves.timer = 1e9; g.raiders.setAI(false); });
  await undrawn(page, true);
  // a thumb held on the left and pushed right steers; one held on Sail + sets sail; one on Fire fires; Surge surges
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, ...pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) });
  await touch('touchStart', [80, 560]); await touch('touchMove', [110, 560]); await touch('touchMove', [140, 560]);
  await wait(page, () => window.__game.player.turn > 0.05, null, 'the stick steers');
  await touch('touchEnd');
  const box = async (sel) => { const b = await page.locator(sel).boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
  const s0 = await page.evaluate(() => window.__game.player.sail);
  await touch('touchStart', await box('#btn-sail-up'));
  await wait(page, (s0) => window.__game.player.sail > s0 + 0.01, s0, 'Sail + sets more sail');
  await touch('touchEnd');
  await touch('touchStart', [300, 300]); await touch('touchMove', [260, 300]); await touch('touchMove', [220, 300]);
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.1, null, 'dragging on the right aims');
  // a thumb resting on the right, still, keeps the view where it's aimed (it doesn't swing back behind the ship)
  await page.evaluate(() => { window.__game.cam.yaw = 1; });
  await page.waitForTimeout(6000);
  const rested = await page.evaluate(() => window.__game.cam.yaw);
  if (rested < 0.98) problems.push(`phone: the view swings back while a thumb rests on the aiming side (${rested.toFixed(2)} of 1)`);
  await touch('touchEnd');
  // moving the aiming thumb while paused: nothing of it lands on Resume
  await page.evaluate(() => { window.__game.cam.yaw = 0; });
  await touch('touchStart', [300, 400]); await page.evaluate(() => window.__game.pause(true));
  await touch('touchMove', [200, 400]); await touch('touchMove', [100, 400]);
  await page.evaluate(() => window.__game.pause(false)); await page.waitForTimeout(1500);
  const jumped = await page.evaluate(() => Math.abs(window.__game.cam.yaw));
  if (jumped > 0.05) problems.push(`phone: a drag while paused swings the camera on Resume (${jumped.toFixed(2)})`);
  await touch('touchEnd');
  await page.evaluate(() => { const g = window.__game; g.cam.yaw = 0; g.bolts.clear(); for (const k in g.gunnery.ready) g.gunnery.ready[k] = 0; });
  await touch('touchStart', await box('#btn-fire'));
  await wait(page, () => window.__game.bolts.bolts.length > 0, null, 'Fire fires');
  // and sliding the thumb off Fire aims while it keeps firing
  const [fx, fy] = await box('#btn-fire');
  await touch('touchMove', [fx - 40, fy]); await touch('touchMove', [fx - 90, fy - 10]);
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.15 && document.getElementById('btn-fire').classList.contains('on'), null, 'sliding the thumb off Fire aims while firing');
  const slid = await page.evaluate(() => window.__game.cam.yaw);
  await touch('touchEnd');
  console.log(`phone: a resting thumb keeps the view (${rested.toFixed(2)} of 1); a drag while paused moves it ${jumped.toFixed(2)}; sliding off Fire aims ${slid.toFixed(2)} while firing`);
  await touch('touchStart', await box('#btn-surge')); await touch('touchEnd');
  await wait(page, () => window.__game.player.surge.on > 0, null, 'Surge surges');
  // on a phone held upright a raider alongside is off screen, so her glowing ports can't be seen: a raider Frigate 270 m
  // off the side readying her broadside flashes her tag at the edge red, and it says "Broadside!". A raider Brig held
  // just beyond her, a little higher, has her tag at the same edge: the two are stacked clear of each other (the warning
  // is taller), so the Frigate's name and distance can be read. Paused, the warning stops flashing; resumed, it goes on
  const phoneWarn = await page.evaluate(async () => {
    const g = window.__game, P = g.player, h = P.heading, hull0 = P.full.hull; g.raiders.clear(); g.bolts.clear(); P.full.hull = P.health.hull = 1e6;
    const side = (d, up) => P.pos.clone().add({ x: Math.cos(h) * d + Math.sin(h) * 30, y: up, z: -Math.sin(h) * d + Math.cos(h) * 30 });
    const r = g.raiders.spawn('frigate', side(270, 0), h + Math.PI, false), other = g.raiders.spawn('brig', side(330, 25), h + Math.PI, true);
    g.raiders.setAI(true);
    let t = 0, seen = null;
    while (t < 30 && !seen) {
      g.cam.yaw = 0; g.cam.pitch = 0.2; g.step(0.05, {}); t += 0.05;
      if (r.charge.b && r.tag && other.tag) {
        const bs = r.tag.querySelector('.bs'), a = r.tag.getBoundingClientRect(), b = other.tag.getBoundingClientRect();
        const lap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        seen = { edge: r.tag.classList.contains('edge'), warn: r.tag.classList.contains('warn'), says: getComputedStyle(bs).display !== 'none' ? bs.textContent : '',
          otherEdge: other.tag.classList.contains('edge'), apart: Math.round(Math.abs((a.top + a.bottom) - (b.top + b.bottom)) / 2), overlap: Math.round(lap) };
      }
    }
    if (seen) {
      // (her broadside held back while the game is paused and resumed)
      r.charge.t = r.charge.T = 1e9;
      const states = () => r.tag.getAnimations({ subtree: true }).map((x) => x.playState);
      const frames = async () => { for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame); };
      const held = () => document.getElementById('tags').classList.contains('held');
      g.pause(true); await frames(); seen.paused = states(); seen.held = held();
      g.pause(false); await frames(); seen.resumed = states(); seen.heldAfter = held(); // (empty if she has stopped readying it meanwhile)
    }
    g.raiders.setAI(false); g.raiders.clear(); g.bolts.clear(); P.full.hull = P.health.hull = hull0;
    return seen;
  });
  console.log(`phone: a raider alongside readying her broadside: her tag ${phoneWarn ? `${phoneWarn.edge ? 'at the edge' : 'ON SCREEN'}, ${phoneWarn.warn ? `flashing red, "${phoneWarn.says}"` : 'NOT FLASHING'}; another raider's tag at that edge too ${phoneWarn.apart} px from it, ${phoneWarn.overlap ? `OVERLAPPING BY ${phoneWarn.overlap} px²` : 'clear of it'}; paused, its flashing ${phoneWarn.paused.join(', ') || 'GONE'}; resumed, ${phoneWarn.heldAfter ? 'STILL HELD' : phoneWarn.resumed.join(', ') || 'no longer readying'}` : 'NEVER READIED ONE'}`);
  if (!phoneWarn?.edge || !phoneWarn.warn || phoneWarn.says !== 'Broadside!') problems.push(`phone: a raider alongside, off screen, readying her broadside should flash her tag red and say "Broadside!": ${JSON.stringify(phoneWarn)}`);
  if (phoneWarn && (!phoneWarn.otherEdge || phoneWarn.apart > 120 || phoneWarn.overlap)) problems.push(`phone: two raiders' tags at the same edge, one saying "Broadside!", should be stacked close but clear of each other: ${JSON.stringify(phoneWarn)}`);
  if (phoneWarn && (!phoneWarn.held || !phoneWarn.paused.length || phoneWarn.paused.some((s) => s !== 'paused') || phoneWarn.heldAfter || phoneWarn.resumed.some((s) => s !== 'running'))) problems.push(`phone: a tag's "Broadside!" should stop flashing while the game is paused, and flash again once it's resumed: ${JSON.stringify(phoneWarn)}`);
  // on a phone the effects have smaller budgets, and a raider's shot landing buzzes the phone (where it can: an
  // Android phone; an iPhone has no way to)
  const phoneFx = await page.evaluate(() => {
    const g = window.__game, P = g.player, calls = [], can = typeof Navigator.prototype.vibrate === 'function';
    navigator.vibrate = (p) => { calls.push(p); return true; };
    // (a true shot from close by: the Skiff is small)
    let hit = false; const off = g.events.on('hit', (e) => { if (e.target === 'player') hit = true; });
    // (held still for it: flying across its path at her speed, a small ship could slip past a shot aimed where she was)
    P.repair(1); P.speed = 0; P.sail = 0; P.vy = 0; P.velocity.set(0, 0, 0); const at = P.aimAt().clone(), from = at.clone().add({ x: 40, y: 0, z: 0 });
    g.bolts.fire(from, at.clone().sub(from).normalize(), 'chaser', 'raider', null, 1); g.step(0.4, {}); off();
    const buzzed = calls.includes(30);
    // a raider blown apart gives a longer buzz; a treasure ship striking her colours gives up quietly, with none
    g.raiders.setAI(false);
    const blown = g.raiders.spawn('cutter', P.pos.clone().add({ x: 0, y: 0, z: 300 }), Math.PI / 2, true), prize = g.raiders.spawn('galleon', P.pos.clone().add({ x: 150, y: 0, z: 450 }), Math.PI / 2, true);
    g.step(0.1, {}); calls.length = 0; blown.f.hit('hull', 1e9); g.step(0.3, {});
    const kill = calls.includes(60);
    calls.length = 0; prize.f.hit('sails', 1e9); g.step(0.3, {});
    const gaveUp = { why: prize.f.down?.why, buzzes: calls.length };
    g.raiders.clear();
    return { q: g.fx.q, sparks: g.fx.stats().sparkCap, puffs: g.fx.stats().puffCap, flames: g.looks.flames.max, can, hit, buzzed, kill, gaveUp };
  });
  console.log(`phone: effects at ${phoneFx.q} of a laptop's (${phoneFx.sparks} sparks, ${phoneFx.puffs} puffs, ${phoneFx.flames} flames); ${phoneFx.can ? `a hit ${phoneFx.buzzed ? 'buzzes the phone' : 'DOES NOT BUZZ'}, a raider blown apart ${phoneFx.kill ? 'buzzes longer' : 'DOES NOT BUZZ'}, a treasure ship striking ${phoneFx.gaveUp.buzzes ? 'BUZZES' : 'doesn\'t buzz'}` : 'can\'t buzz this browser'}`);
  if (phoneFx.q !== 0.6 || phoneFx.sparks !== 700 || phoneFx.puffs !== 600 || phoneFx.flames !== 16) problems.push(`phone: the effects' budgets should be smaller: ${JSON.stringify(phoneFx)}`);
  if (!phoneFx.hit) problems.push('phone: a raider\'s shot fired straight at the Skiff from 40 m missed her');
  if (phoneFx.can && phoneFx.hit && !phoneFx.buzzed) problems.push('phone: a hit on the ship doesn\'t buzz the phone');
  if (phoneFx.can && !phoneFx.kill) problems.push('phone: a raider blown apart doesn\'t buzz the phone');
  if (phoneFx.gaveUp.why !== 'struck' || (phoneFx.can && phoneFx.gaveUp.buzzes)) problems.push(`phone: a treasure ship striking her colours shouldn't buzz the phone: ${JSON.stringify(phoneFx.gaveUp)}`);
  await undrawn(page, false); // (drawn again: the worst case counts its draws)
  // the worst case for a phone: a Man-o'-war blown apart beside two other wrecks (a Frigate and a Brig), in a fight.
  // The sparks and smoke never run out of room, the debris's batches are big enough (hardly a piece cut short: at most
  // one in twenty of each kind), and a step of the game stays quick
  const worst = await page.evaluate(async () => {
    const g = window.__game, FX = g.fx;
    g.fly('frigate'); g.wind.strength = 0; g.waves.timer = 1e9; g.raiders.setAI(false);
    const P = g.player; P.pos.set(0, 1300, 0); P.heading = 0; P.speed = 3; P.sail = 0.05; P.vy = 0;
    for (const k of ['hull', 'crystals']) P.full[k] = P.health[k] = 1e6;
    const foes = [['manowar', 0, 360], ['frigate', -190, 270], ['brig', 190, 250]].map(([id, x, z]) => g.raiders.spawn(id, P.pos.clone().add({ x, y: -30, z }), Math.PI / 2, false));
    g.raiders.setAI(true); FX.clear(); FX.resetStats();
    const aim = () => {
      const r = g.raiders.list.find((x) => !x.f.down) ?? foes[0], T = P.pos.clone(); T.y += P.ship.recipe.length * 0.42 + 2;
      const look = r.f.pos.clone().sub(T).normalize(), a = Math.atan2(look.x, look.z) - P.heading;
      g.cam.pitch = Math.max(-0.3, -Math.asin(look.y) + 0.08); g.cam.yaw = Math.atan2(Math.sin(a), Math.cos(a));
    };
    let most = 0, puffs = 0, calls = 0; const times = [];
    for (let k = 0; k < 8; k++) { aim(); g.step(0.25, { fire: true }); most = Math.max(most, FX.stats().sparks); puffs = Math.max(puffs, FX.stats().puffs); }
    let masts = 0;
    for (const r of foes) { r.f.hit('hull', 1e9); aim(); g.step(0.3, { fire: true }); most = Math.max(most, FX.stats().sparks); masts = Math.max(masts, g.wrecks.falling().length); }
    for (let s = 0; s < 16; s++) {
      const t0 = performance.now();
      for (let k = 0; k < 4; k++) { aim(); g.step(0.25, { fire: true }); most = Math.max(most, FX.stats().sparks); puffs = Math.max(puffs, FX.stats().puffs); }
      times.push((performance.now() - t0) / 60);
      masts = Math.max(masts, g.wrecks.falling().length);
      if (s === 1) { await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); calls = g.renderer.info.render.calls; }
    }
    times.sort((a, b) => a - b);
    const st = FX.stats();
    g.raiders.setAI(false); g.raiders.clear(); FX.clear();
    g.fly('skiff'); g.waves.timer = 1e9; // (back in the Skiff, for the picture of a battle)
    return { most, cap: st.sparkCap, dropped: st.dropped, puffs, puffCap: st.puffCap, puffsDropped: st.puffsDropped, debris: st.debris.peak, caps: st.debris.caps, cut: st.debris.cut, tossed: st.debris.tossed, ms: +times[8].toFixed(2), calls, masts };
  });
  console.log(`phone, a Man-o'-war going down beside two other wrecks: at most ${worst.most} sparks of ${worst.cap} (${worst.dropped} cut short), ${worst.puffs} puffs of ${worst.puffCap} (${worst.puffsDropped} cut short), debris at most ${worst.debris.wood}/${worst.caps.wood} splinters, ${worst.debris.canvas}/${worst.caps.canvas} scraps, ${worst.debris.crystal}/${worst.caps.crystal} shards (cut short ${worst.cut.wood} of ${worst.tossed.wood}, ${worst.cut.canvas} of ${worst.tossed.canvas} and ${worst.cut.crystal} of ${worst.tossed.crystal}); ${worst.ms} ms a step, ${worst.calls} draws in a frame`);
  if (worst.dropped || worst.puffsDropped || worst.most > worst.cap || ['wood', 'canvas', 'crystal'].some((k) => worst.cut[k] > worst.tossed[k] * 0.05)) problems.push(`phone: three wrecks at once ran out of room: ${JSON.stringify(worst)}`);
  if (worst.ms >= 1) problems.push(`phone: a step with three wrecks takes ${worst.ms} ms (should be under 1)`);
  if (worst.masts) problems.push(`phone: masts shouldn't fall on a phone (${worst.masts} did)`);
  // Fire on the left (the Settings card, on a phone): the buttons swap sides, and so do the stick and the aiming; the
  // edge tags keep clear of the buttons where they are now; the hint and How to fly say so (the right thumb steers,
  // aiming on the left), and say it the other way round again when it's switched off
  await page.evaluate(() => { window.__game.pause(true); document.getElementById('btn-settings-pause').click(); });
  await page.tap('#set-leftFire'); await page.tap('#btn-settings-done');
  await page.evaluate(() => { const g = window.__game; g.pause(false); g.cam.yaw = 0; g.player.turn = 0; });
  const hands = () => page.evaluate(() => ({ hint: document.getElementById('touch-hint').textContent, howto: [...document.querySelectorAll('#howto dl.touch-only dt, #howto dl.touch-only dd')].slice(0, 3).map((e) => e.textContent).join(' | ') }));
  const left = await page.evaluate(() => { const f = document.getElementById('btn-fire').getBoundingClientRect(), h = document.getElementById('touch-hint').getBoundingClientRect(), b = document.getElementById('touch-buttons').getBoundingClientRect(), e = window.__game.edge.bottom;
    return { fire: Math.round(f.left + f.width / 2), hint: Math.round(h.left), saved: window.__game.settings.data.leftFire, edge: e.some((x) => Math.abs(x.l - b.left) < 1 && Math.abs(x.t - b.top) < 1) }; });
  const leftWords = await hands();
  await touch('touchStart', [300, 560]); await touch('touchMove', [330, 560]); await touch('touchMove', [360, 560]);
  await wait(page, () => window.__game.player.turn > 0.05, null, 'phone, Fire on the left: a thumb on the right steers');
  await touch('touchEnd');
  await touch('touchStart', [120, 300]); await touch('touchMove', [80, 300]); await touch('touchMove', [40, 300]);
  await wait(page, () => Math.abs(window.__game.cam.yaw) > 0.1, null, 'phone, Fire on the left: dragging on the left aims');
  await touch('touchEnd');
  console.log(`phone, Fire on the left: Fire at ${left.fire} px of 390, the hint at ${left.hint} px${left.edge ? ', the edge tags keeping clear of the buttons there' : ''}; steering on the right, aiming on the left`);
  console.log(`phone, Fire on the left, the hint: "${leftWords.hint}"; How to fly: "${leftWords.howto}"`);
  if (left.fire > 195 || left.hint < 195 || !left.saved || !left.edge) problems.push(`phone: Fire on the left should move the buttons to the left: ${JSON.stringify(left)}`);
  const says = (w, steer, aim) => w.hint.startsWith(`${steer} thumb: steer and climb. Drag on the ${aim} to aim.`) && w.howto.startsWith(`${steer} thumb | Put it down anywhere on the ${steer.toLowerCase()} and push`) && w.howto.endsWith(`| ${aim === 'left' ? 'Left' : 'Right'} thumb`);
  if (!says(leftWords, 'Right', 'left')) problems.push(`phone: with Fire on the left, the hint and How to fly should say the right thumb steers and aiming is on the left: ${JSON.stringify(leftWords)}`);
  await page.evaluate(() => { window.__game.pause(true); document.getElementById('btn-settings-pause').click(); });
  await page.tap('#set-leftFire'); await page.tap('#btn-settings-done');
  await page.evaluate(() => window.__game.pause(false));
  if (await page.evaluate(() => document.body.classList.contains('fire-left'))) problems.push('phone: Fire on the left doesn\'t switch off again');
  const rightWords = await hands();
  if (!says(rightWords, 'Left', 'right')) problems.push(`phone: with Fire back on the right, the hint and How to fly should say the left thumb steers again: ${JSON.stringify(rightWords)}`);
  // nothing on the screen lands on anything else, on a phone held upright or sideways (two sizes each): layoutAt,
  // with the touch buttons and the hint
  const HUD = ['ship', 'compass', 'btn-pause', 'minimap', 'score', 'battery', 'toast', 'warn', 'banner', 'region', 'aim', 'btn-fire', 'btn-surge', 'btn-sail-up', 'btn-sail-down', 'touch-hint', 'calm'];
  const PANELS = ['ship', 'compass', 'btn-pause', 'minimap', 'score', 'battery', 'touch-buttons', 'touch-hint'];
  const layouts = [];
  for (const [w, h] of [[390, 844], [360, 640], [844, 390], [740, 360]]) {
    // (the new size, once the game has heard of it: drawn in software, a frame can take longer than the half second)
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(500);
    await page.waitForFunction(([w, h]) => Math.abs(window.__game.camera.aspect - w / h) < 1e-6, [w, h], { timeout: 30000 }).catch(() => problems.push(`phone ${w}x${h}: the game never heard the window change size`));
    layouts.push(`${w}x${h}: ${layoutProblems(await layoutAt(page, HUD, PANELS, w === 360), `phone ${w}x${h}`)}; a bounty ${bountyProblems(await bountyCard(page), `phone ${w}x${h}`)}`);
  }
  console.log(`phone layouts: ${layouts.join('; ')}`);
  // reading a fight from afar on a phone: upright, a raider's glows, scars and fire and a far wake; held sideways, two
  // raiders' tags far off (the gate's case: the lower one used to be pushed down over her Brig), and the glows again
  await sized(page, 390, 844, 'phone');
  const pga = await glowScales(page); await sized(page, 667, 375, 'phone'); const pgb = await glowsAgain(page);
  const sidewaysTags = `${tagProblems(await tagsAt(page), 'phone 667x375')}; ${tagEdgeProblems(await tagEdges(page), 'phone 667x375')}`;
  await sized(page, 844, 390, 'phone'); const wideTags = tagProblems(await tagsAt(page), 'phone 844x390');
  await sized(page, 390, 844, 'phone');
  console.log(`phone, reading a fight from afar: ${glowProblems(pga, pgb, 'phone')}; ${fireProblems(await fireAt(page), 'phone')}; ${wakeProblems(await wakesFar(page), 'phone', { screen: 35, pixels: 100 })}; ${hiddenWakeProblems(await hiddenWake(page), 'phone')}; upright, ${tagProblems(await tagsAt(page), 'phone 390x844')}; ${tagEdgeProblems(await tagEdges(page), 'phone 390x844')}; held sideways, ${sidewaysTags} (and at 844 by 390, ${wideTags})`);
  // the port at the same four sizes, a narrow phone held sideways (640 by 360) and the smallest (568 by 320, an iPhone
  // SE's first one): its top line on one line, even with ◆ 12,345, and its panel clear of the top line, of the ships
  // along the bottom and of the longest note the port shows (as a ship is bought); every one of the six ships' buttons all inside the ships' rows (none cut off at an end); every
  // ship you can't buy yet (the Frigate, the Galleon and the Man-o'-war, short of shards, and the Man-o'-war before the
  // Galleon) showing all of how she sails above her Buy button, its words on one line, and on a phone held upright her
  // ship all above the panel's top; your own ship's tab showing all of how she sails above Set sail and its fade (at
  // least two of them on a small phone held upright, where her ship needs the room); her Upgrades tab showing two upgrades or more
  // above Set sail (one on a screen under 360 px tall, as with the browser's bars showing); each of the six ships'
  // blurbs (owned or not) all above the button's fade, not tucked under it; and on a phone held upright, the panel no taller than what's
  // in it, so her ship has the room above it (no empty band under the button)
  const ports = [];
  for (const [w, h] of [[844, 390], [740, 360], [640, 360], [568, 320], [390, 844], [360, 640]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    const P = await page.evaluate(() => {
      const g = window.__game, $ = (id) => document.getElementById(id), d = g.progress.data, r = (id) => $(id).getBoundingClientRect();
      if (g.mode === 'voyage') g.endVoyage(0); else g.port.setMode('port');
      const was0 = { flying: d.flying, galleon: d.ships.galleon.owned, manowar: d.ships.manowar.owned };
      const above = (el) => [...document.querySelectorAll('.stat')].filter((s) => s.getBoundingClientRect().bottom <= el.top + 1).length;
      const lines = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); return new Set([...rg.getClientRects()].map((b) => Math.round(b.top))).size; };
      let stats = 5; const buying = [], behind = [], owned = [];
      d.shards = 1999; d.ships.manowar.owned = false;
      for (const [id, gal] of [['frigate', false], ['galleon', false], ['manowar', false], ['manowar', true]]) {
        d.ships.frigate.owned = id !== 'frigate'; d.ships.galleon.owned = gal; d.flying = id === 'frigate' ? 'skiff' : 'frigate';
        $('port-ships').querySelector(`[data-ship="${id}"]`).click();
        const n = above(r('btn-buy')), l = lines($('btn-buy').firstElementChild), sb = g.port.shipBox(), pt = r('port-panel').top;
        stats = Math.min(stats, n); buying.push(`${id}${gal ? ' (Galleon owned)' : ''} ${n}/5${l > 1 ? ` ON ${l} LINES` : ''}`);
        if (l > 1) behind.push(`${id}'s Buy button on ${l} lines`);
        if (innerWidth <= 700 && innerHeight > 500 && sb.b > pt) behind.push(`${id}${gal ? ' (Galleon owned)' : ''}'s ship ${Math.round(sb.b - pt)} px behind the panel`);
      }
      for (const id of ['skiff', 'frigate', 'galleon', 'manowar']) {
        d.ships[id].owned = true; d.flying = id; $('port-ships').querySelector(`[data-ship="${id}"]`).click(); $('pp-tab-ship').click();
        owned.push(above(document.querySelector('.sail-out').getBoundingClientRect()));
      }
      Object.assign(d.ships.galleon, { owned: was0.galleon }); Object.assign(d.ships.manowar, { owned: was0.manowar }); d.ships.frigate.owned = false; d.flying = was0.flying === 'frigate' ? 'skiff' : was0.flying; // (the Frigate left unowned, for the pictures below)
      d.shards = 12345; d.flying = 'skiff'; $('port-ships').querySelector('[data-ship="skiff"]').click();
      const top = ['port-shards', 'btn-skies', 'btn-settings-port'].map(r), line = Math.max(...top.map((b) => b.height)), right = Math.round(Math.max(...top.map((b) => b.right)));
      $('pp-tab-upgrades').click();
      const sail = r('btn-sail'), mods = [...document.querySelectorAll('.mod')].filter((m) => m.getBoundingClientRect().bottom <= sail.top + 1).length;
      $('pp-tab-ship').click();
      const was = { flying: d.flying, owned: Object.fromEntries(Object.keys(d.ships).map((id) => [id, d.ships[id].owned])) }, tucked = [], empty = [], laps = new Set();
      const lap = (a, c) => a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1;
      $('port-note').textContent = 'The Doldrums is yours: from now on, the treasure ships are Galleons'; // (the longest note the port shows: kept clear of the panel too)
      const look = (id, own) => {
        d.ships[id].owned = own; $('port-ships').querySelector(`[data-ship="${id}"]`).click(); $('pp-tab-ship').click();
        const b = r('pp-blurb'), so = document.querySelector('.sail-out').getBoundingClientRect(), pn = r('port-panel');
        if (b.height && b.bottom > so.top + 1) tucked.push(`${id}${own ? '' : ' (not owned)'} by ${Math.round(b.bottom - so.top)} px`);
        if (innerWidth <= 700 && innerHeight > 500 && pn.bottom - so.bottom > 12) empty.push(`${id}${own ? '' : ' (not owned)'}: ${Math.round(pn.bottom - so.bottom)} px`);
        for (const other of ['port-ships', 'port-shards', 'btn-skies', 'btn-settings-port', 'port-note']) if (lap(pn, r(other))) laps.add(other);
      };
      for (const id of ['skiff', 'cutter', 'brig', 'frigate', 'galleon', 'manowar']) { if (id !== 'skiff') look(id, false); look(id, true); }
      $('port-note').textContent = '';
      const row = r('port-ships'), cut = [...$('port-ships').querySelectorAll('button')].filter((b) => { const x = b.getBoundingClientRect(); return x.left < row.left - 0.5 || x.right > row.right + 0.5 || x.top < row.top - 0.5 || x.bottom > row.bottom + 0.5; }).map((b) => b.dataset.ship);
      for (const id in was.owned) d.ships[id].owned = was.owned[id];
      d.flying = was.flying; $('port-ships').querySelector(`[data-ship="${was.flying}"]`).click();
      return { stats, buying, behind, owned, line: Math.round(line), right, w: innerWidth, mods, tucked, empty, laps: [...laps], cut };
    });
    const ownedLeast = w <= 700 && h > 500 && h <= 720 ? 2 : 5;
    ports.push(`${w}x${h}: ${P.stats} of 5 stats over Buy (${P.buying.join(', ')}), ${P.owned.join('/')} of 5 over Set sail in her own ship (Skiff/Frigate/Galleon/Man-o'-war)${P.behind.length ? `, ${P.behind.join(', ').toUpperCase()}` : ''}, and ${P.mods} upgrade${P.mods === 1 ? '' : 's'} in view, the top line ${P.line} px tall, ${P.cut.length ? `SHIPS CUT OFF: ${P.cut.join(', ')}` : 'all six ships in their rows'}, ${P.tucked.length ? `BLURBS UNDER THE FADE: ${P.tucked.join(', ')}` : 'every blurb clear of the fade'}${P.empty.length ? `, EMPTY UNDER THE BUTTON: ${P.empty.join(', ')}` : ''}${P.laps.length ? `, THE PANEL ON ${P.laps.join(', ')}` : ''}`);
    if (P.stats < 5 || P.mods < (h < 360 ? 1 : 2) || P.line > 44 || P.right > P.w) problems.push(`phone ${w}x${h}: the port should show all of how a ship not owned sails above her Buy button, ${h < 360 ? 'an upgrade' : 'two upgrades or more'} on her Upgrades tab, and its top line on one line: ${JSON.stringify(P)}`);
    if (P.behind.length) problems.push(`phone ${w}x${h}: in port a ship not owned should have her Buy button on one line and (upright) all of her ship above the panel: ${P.behind.join(', ')}`);
    if (Math.min(...P.owned) < ownedLeast) problems.push(`phone ${w}x${h}: your own ship's tab should show ${ownedLeast === 5 ? 'all of how she sails' : 'at least two of how she sails'} above Set sail and its fade: ${P.owned.join('/')} of 5 (Skiff/Frigate/Galleon/Man-o'-war)`);
    if (P.cut.length) problems.push(`phone ${w}x${h}: in port every ship's button should be all inside the ships' row, not cut off at its end: ${P.cut.join(', ')}`);
    if (P.laps.length) problems.push(`phone ${w}x${h}: in port the panel lands on ${P.laps.join(', ')}`);
    if (P.tucked.length) problems.push(`phone ${w}x${h}: in port a ship's blurb should be all above the button's fade, not tucked under it: ${P.tucked.join(', ')}`);
    if (P.empty.length) problems.push(`phone ${w}x${h}: in port on a phone held upright, the panel should be no taller than what's in it (her ship has the room above): empty under the button for ${P.empty.join(', ')}`);
    if (w === 360) { await page.click('#port-ships [data-ship="frigate"]'); await page.waitForTimeout(1200); await shot(page, 'phone-small-port'); }
    if (w === 568) { await page.waitForTimeout(1200); await shot(page, 'phone-smallest-sideways-port'); }
    if (w === 740) { await page.click('#pp-tab-upgrades'); await page.waitForTimeout(1200); await shot(page, 'phone-sideways-port-upgrades'); await page.click('#pp-tab-ship'); }
  }
  console.log(`phone port: ${ports.join('; ')}`);
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(500);
  await page.evaluate(() => window.__game.fly('skiff'));
  await page.evaluate(battle, ['cutter', 'skiff']);
  await page.waitForTimeout(2500);
  await shot(page, 'phone-battle');
  // the title screen on a phone is the first thing Chris sees: each of its frames costs no more than a voyage's (timed
  // in turns, the title and a voyage just set out, each frame finished before the next; the page's own frames held
  // meanwhile), and it's drawn in fewer goes than a voyage's. And how it looks held sideways
  const frameTimes = await page.evaluate(() => {
    const g = window.__game, gl = g.renderer.getContext(), px = new Uint8Array(4), raf = window.requestAnimationFrame, held = [];
    window.requestAnimationFrame = (f) => { held.push(f); return 0; };
    const T = [], V = [], calls = {};
    const time = (into, frame) => { for (let i = 0; i < 6; i++) { const t0 = performance.now(); frame(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); if (i) into.push(performance.now() - t0); } };
    const title = () => { g.endVoyage(0); g.port.setMode('title'); time(T, () => { g.title.update(1 / 60); g.title.render(); }); calls.title = g.renderer.info.render.calls; };
    const voyage = () => { g.fly('skiff'); g.waves.timer = 1e9; g.raiders.setAI(false); time(V, () => { g.step(1 / 60, {}); g.renderer.render(g.scene, g.camera); }); calls.voyage = g.renderer.info.render.calls; };
    try { voyage(); title(); voyage(); title(); } finally { window.requestAnimationFrame = raf; for (const f of held) raf(f); }
    const mid = (a) => { a.sort((x, y) => x - y); return +a[a.length >> 1].toFixed(1); };
    return { title: mid(T), voyage: mid(V), calls, ratio: g.renderer.getPixelRatio() };
  });
  console.log(`phone: a frame of the title screen ${frameTimes.title} ms (${frameTimes.calls.title} draws), of a voyage ${frameTimes.voyage} ms (${frameTimes.calls.voyage} draws), here in software at ${frameTimes.ratio} pixels to the page's`);
  if (!(frameTimes.title <= frameTimes.voyage * 1.1)) problems.push(`phone: the title screen's frames should cost no more than a voyage's: ${JSON.stringify(frameTimes)}`);
  if (!(frameTimes.calls.title < frameTimes.calls.voyage)) problems.push(`phone: the title screen should be drawn in fewer goes than a voyage: ${frameTimes.calls.title} draws against ${frameTimes.calls.voyage}`);
  // the weather on a phone: a storm's frames (its rain, scud and lightning, the darker sky), a frame inside a big cloud
  // (its mist over the whole view) and one looking at a wave's bank of cloud (a wall of it across the view) each cost
  // little more than a clear sky's (timed in turns the same way, a fifth more at the most, as the software drawing here
  // is uneven), and the storm draws in at most two more goes. On Smooth half the rain
  const weatherTimes = await page.evaluate(() => {
    const g = window.__game, gl = g.renderer.getContext(), px = new Uint8Array(4), raf = window.requestAnimationFrame, held = [];
    window.requestAnimationFrame = (f) => { held.push(f); return 0; };
    const T = { clear: [], storm: [], cloud: [], bank: [] }, calls = {};
    const time = (into, k) => { for (let i = 0; i < 6; i++) { const t0 = performance.now(); g.step(1 / 60, {}); g.renderer.render(g.scene, g.camera); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); if (i) into.push(performance.now() - t0); } calls[k] = g.renderer.info.render.calls; };
    try {
      g.fly('skiff'); g.waves.timer = 1e9; g.raiders.setAI(false);
      const P = g.player, pose = () => { P.pos.set(1500, 900, -800); P.heading = 0.4; g.cam.yaw = 0; g.cam.pitch = 0.2; };
      for (let k = 0; k < 2; k++) {
        pose(); g.sky.reset(); g.step(0.5, {}); time(T.clear, 'clear');
        pose(); g.sky.startStorm(); g.step(24, {}, 1 / 20); g.sky.weather.strike = 99; g.sky.bolt.clear(); time(T.storm, 'storm');
        g.sky.reset(); for (let i = 0; i < 4; i++) { g.world.puffs.positionOf(g.world.puffs.BANK + 30, P.pos); g.step(0.15, {}); } time(T.cloud, 'cloud');
        g.sky.reset(); pose(); g.world.puffs.bank(P.pos.clone().addScaledVector(P.forward(), 1600), P.pos, 650); g.step(2.5, {}, 1 / 20); pose(); time(T.bank, 'bank'); calls.banked = g.world.puffs.banked; g.world.clear();
      }
      // (the rain falling in a storm on Smooth, as a share of all its streaks; then back to Balanced, still raining)
      g.settings.set('picture', 'smooth'); g.sky.reset(); g.sky.startStorm(); g.step(12, {}, 1 / 20);
      calls.smoothRain = g.sky.air.kind === 'rain' ? g.sky.air.count / g.sky.air.N : -1;
      g.settings.set('picture', 'balanced'); g.step(0.1, {}); calls.balancedRain = g.sky.air.count / g.sky.air.N;
    } finally { window.requestAnimationFrame = raf; for (const f of held) raf(f); g.sky.reset(); }
    const mid = (a) => { a.sort((x, y) => x - y); return +a[a.length >> 1].toFixed(1); };
    return { clear: mid(T.clear), storm: mid(T.storm), cloud: mid(T.cloud), bank: mid(T.bank), calls };
  });
  console.log(`phone, the weather: a frame of clear sky ${weatherTimes.clear} ms (${weatherTimes.calls.clear} draws), in a storm ${weatherTimes.storm} ms (${weatherTimes.calls.storm} draws), inside a cloud ${weatherTimes.cloud} ms (${weatherTimes.calls.cloud} draws), looking at a bank of cloud ${weatherTimes.bank} ms (${weatherTimes.calls.bank} draws, ${weatherTimes.calls.banked} of it in sight); on Smooth ${weatherTimes.calls.smoothRain} of the rain, on Balanced ${weatherTimes.calls.balancedRain}`);
  if (!(weatherTimes.storm <= weatherTimes.clear * 1.2) || !(weatherTimes.cloud <= weatherTimes.clear * 1.2) || !(weatherTimes.bank <= weatherTimes.clear * 1.2) || weatherTimes.calls.banked !== 1 || weatherTimes.calls.storm > weatherTimes.calls.clear + 2) problems.push(`phone: the weather should cost little more than a clear sky: ${JSON.stringify(weatherTimes)}`);
  if (Math.abs(weatherTimes.calls.smoothRain - 0.5) > 0.01 || weatherTimes.calls.balancedRain !== 1) problems.push(`phone: the Smooth picture should draw half the rain: ${JSON.stringify(weatherTimes.calls)}`);
  // the title on phones upright and sideways, small ones too (an iPhone SE's, with the browser's bars showing): raiders
  // in sight, her ship clear of the card, and the card fitting the screen
  const phoneTitles = [];
  for (const [w, h] of [[390, 844], [360, 640], [844, 390], [640, 360], [667, 320]]) phoneTitles.push(titleProblems(await titleAt(page, w, h), w === 390 || w === 844));
  console.log(`phone, the title screen: ${phoneTitles.join('; ')}`);
  // (the picture once the title has come up out of the night: drawn in software, a frame can take seconds after the
  // window changes size, and the dip waits for it)
  await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(1000);
  await wait(page, () => !document.getElementById('veil').getAnimations().length, null, 'phone: the title coming up out of the night');
  await page.waitForTimeout(1500);
  await shot(page, 'phone-title-sideways');
  await page.close();
}

await browser.close();
console.log(`the check took ${((Date.now() - began) / 60000).toFixed(1)} minutes`);
if (problems.length) { console.log('PROBLEMS:\n' + [...new Set(problems)].join('\n')); process.exit(1); }
console.log(quick ? 'all good (quick)' : demoOnly ? 'all good (the ships demo only)' : 'all good');
