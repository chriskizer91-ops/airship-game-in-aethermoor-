// progress.js: what the Captain has earned and owns, kept between visits: Crystal Shards (Aethermoor's money), the
// ships bought (any of the six: the Galleon and the Man-o'-war late in the game), each ship's upgrades, crystal power
// setting and colours, which skies (difficulty) were chosen, the best wave reached, and how many voyages are behind the
// Captain (none: a new Captain, whom the title screen helps along, starting on Fair Winds, the skies marked best for a
// first voyage; a save already made keeps the skies it chose). And since version 2 of the save, the Captain's record
// (deeds.js counts it): what every voyage brought down and brought home, the commendations won, the stars on each skies,
// the renown and the rank it brings, the tips already given, the lands flown over, the sail and pennant colours bought,
// the day's harbour orders and a log of the last twelve voyages. Kept in the browser on this device, and, when the game
// is opened on claude.ai, also in the page's own private store for this person, so it follows them between devices.
// (No imports here: tools/check.mjs runs this file on its own, as two devices sharing a save. So the lists of what the
// save keeps by name are here, plain: deeds.js, coach.js and paint.js give them their words and their rules)
// the three skies: how well the raiders aim, how quickly they reload, how hard they hit, how much they take, how fast
// they fly, how many more of them come, what shards pay, and how much of a raider captain's edge over her crew she has
// (raiders.js: on Fair Winds none, as she's the first big fight a new Captain meets, in a Skiff; only her bounty is
// bigger); which waves bring a storm (`storms`: their numbers, from 1, and after the fifteenth, this share of them at
// random: sky.js), how near a raider still sees the Captain hidden in cloud (`sight`, metres), how long a raider's gun
// ports glow before her broadside (`warn`, seconds: her gunners aim where you'd be if you held your course, so it's time
// to climb out of her red fan: raiders.js), how smart the raiders fight (`smart`: 0 simply; 1 big ones
// try to cross your bow and rake you; 2 also small ones coming at your stern, and raiders climbing or diving out of
// your loaded broadside: tactics.js SMART), the chance a hurt raider runs for the clouds (`flee`: tactics.js NERVE), and
// how much renown a deed there brings (`renown`: deeds.js; braving the Maelstrom raises a Captain's rank sooner)
export const SKIES = {
  fair: { name: 'Fair Winds', line: 'Raiders aim poorly, hit lightly and break easily. For learning the ropes.', aim: 1.8, reload: 1.35, damage: 0.45, toughness: 0.76, pace: 0.88, extra: 0, shards: 1, captain: 0,
    storms: { waves: [], after: 0 }, sight: 180, warn: 1, smart: 0, flee: 0.3, renown: 0.75 },
  cross: { name: 'Crosswinds', line: 'A fair fight. Shards pay a quarter more.', aim: 1, reload: 1, damage: 1, toughness: 1, pace: 0.92, extra: 0, shards: 1.25, captain: 1,
    storms: { waves: [8, 13], after: 0 }, sight: 250, warn: 0.8, smart: 1, flee: 0.5, renown: 1 },
  mael: { name: 'Maelstrom', line: 'Raiders hunt in bigger packs, hit harder and aim truer. Shards pay over half as much again.', aim: 0.8, reload: 0.92, damage: 1.15, toughness: 1.15, pace: 0.96, extra: 1, shards: 1.6, captain: 1,
    storms: { waves: [4, 8, 12], after: 0.4 }, sight: 350, warn: 0.6, smart: 2, flee: 0.6, renown: 1.5 },
};
// what each ship costs in port: the first four as the Captain climbs, and the Galleon and the Man-o'-war as her
// late-game goals, after many voyages (tools/sim-fight.mjs; docs/game.md "The port")
export const PRICES = { skiff: 0, cutter: 300, brig: 900, frigate: 2200, galleon: 12000, manowar: 30000 };
// a ship the port sells only to a Captain who owns another first: the Man-o'-war after the Galleon. (Owning her alone,
// the treasure ships would still be treasure Brigs, and a laden Brig outruns a Man-o'-war: raiders.js)
export const NEEDS = { manowar: 'galleon' };

// ---------- what the Captain's record keeps by name (version 2 of the save) ----------
// the commendations (deeds.js MEDALS gives each its name, its deed and its reward): the day each was won, or 0
export const MEDAL_IDS = ['first', 'home', 'broadside', 'high', 'crystals', 'breaker', 'colours', 'flag', 'captain', 'bounty', 'fortress', 'untouched', 'shave', 'two', 'under', 'thin', 'fierce',
  'rake', 'flare', 'storm', 'road', 'hunter1', 'hunter2', 'hunter3', 'purse1', 'purse2', 'purse3', 'salt1', 'salt2', 'treasure1', 'treasure2', 'four', 'fleet', 'fitted', 'charted', 'captains'];
// the first voyage's tips (coach.js), each given once: 1 once given
export const TIP_IDS = ['steer', 'find', 'aim', 'fire', 'guns', 'shards', 'hurt', 'broadside', 'fan', 'card', 'surge', 'shot'];
// the colours a ship can fly (paint.js DYES): her sails' dye and her pennants'. The first of each is hers as built;
// the rest are bought in port or won (by rank, or a Maelstrom star): 1 once the Captain has it, for every ship
export const SAIL_DYES = ['sailcloth', 'sky', 'sea', 'honey', 'twilight', 'dusk', 'storm'];
export const PENNANT_DYES = ['plum', 'teal', 'silver', 'sunrise', 'emerald', 'royal', 'lightning'];
export const DYE_IDS = [...SAIL_DYES, ...PENNANT_DYES];
// the lands of Aethermoor flown over (world.js's regions, by their letter on its grid): 1 once charted
export const LANDS = ['w', 'g', 'f', 'h', 'p', 'k'];
// a star on each skies for beating its fifth, tenth and fifteenth waves the first time, paid at once (deeds.js); the
// Maelstrom's tenth and fifteenth win colours no shards can buy
export const STAR_WAVES = [5, 10, 15];
export const STAR_PAY = { fair: [50, 150, 300], cross: [100, 250, 500], mael: [200, 500, 1000] };
export const STAR_DYES = { mael: { 10: 'storm', 15: 'lightning' } };
// the renown each rank starts at (deeds.js RANKS names them), and the colours every other rank wins
export const RANK_AT = [0, 120, 400, 1000, 2000, 3500, 6000, 10000, 16000, 25000];
export const RANK_DYES = { 2: 'emerald', 4: 'twilight', 6: 'royal', 8: 'dusk' };
// the harbour orders' version: a new game whose list of orders is in another order gives every save fresh ones
export const ORDERS_V = 1;
// the last voyages the log keeps
export const LOG_KEEP = 12;
const SKIES_IDS = Object.keys(SKIES);
const zeros = (ids, v = 0) => Object.fromEntries(ids.map((id) => [id, v]));

const KEY = 'skies-of-aethermoor/save-1';
const IDS = ['skiff', 'cutter', 'brig', 'frigate', 'galleon', 'manowar']; // (a save from before the big two were sold gains them, not owned: merge)
// what the claude.ai store answers when it will never take a write on this page (others, like busy or out of reach, pass)
const STOP = ['invalid_argument', 'not_granted', 'revoked', 'capability_disabled', 'capability_removed', 'transform_error'];
const HELD = 600e3; // how long a voyage stays on this device's own list after the store took it (see adopt)
// `saved` is when this save was last changed; `synced` is the `saved` of the copy in the claude.ai store that this
// device last read or wrote (so saved > synced means this device has changes the store hasn't got yet). `got` names
// the voyages whose shards the store's copy holds (the latest 100). `shots`: the kinds of shot the Captain has besides
// round shot (tactics.js: chain shot and crystal breakers, earned by deeds or bought in port), for every ship she sails.
// `captains`: for each raider captain met (by her id: tactics.js CAPTAINS), how many times the Captain has brought her
// down, and how many times she has sunk the Captain's ship since and got away (the price on her head: main.js). `banked` is this device's own voyages that the
// store hasn't got, or took less than ten minutes ago: { id, n: shards, sent: 1 once a write has carried it, at: when
// the store took it }.
// Version 2 adds the Captain's record (deeds.js): `stats`, everything counted over every voyage (each class brought
// down, raider captains, treasure ships caught and got away, crews that struck, shots fired and hits, hits taken,
// shards brought home, seconds at sea, waves beaten, voyages home and sunk, and the renown that sets the rank);
// `records` (each skies' most shards brought home and most raiders downed in one voyage: the best wave is `best`);
// `stars`, `medals`, `tips`, `charted`, `rank` (the highest reached: a rise pays), `dyes`, each ship's `paint` (her
// sails' and her pennants' dyes); `orders` (today's three harbour orders: the day they're for, which of the list
// they are, how far each has got, which are done, and whether the harbourmaster's thanks for all three were paid);
// and `log`, the last voyages ({ d: the day, ship, skies, w: waves beaten, k: raiders downed, s: shards brought home,
// sunk })
function fresh() {
  return {
    v: 2, saved: 0, synced: 0, skies: 'fair', shards: 0, flying: 'skiff', best: { fair: 0, cross: 0, mael: 0 }, voyages: 0,
    ships: Object.fromEntries(IDS.map((id) => [id, { owned: id === 'skiff', power: 0, mods: { armour: 0, canvas: 0, drill: 0, crystals: 0 }, paint: { sails: SAIL_DYES[0], pennant: PENNANT_DYES[0] } }])),
    shots: { chain: false, breaker: false },
    captains: {},
    got: [], banked: [],
    stats: { home: 0, sunk: 0, waves: 0, downed: 0, ...zeros(IDS), captains: 0, prizes: 0, escaped: 0, struck: 0, shots: 0, hits: 0, taken: 0, banked: 0, secs: 0, renown: 0 },
    records: Object.fromEntries(SKIES_IDS.map((k) => [k, { shards: 0, downed: 0 }])),
    stars: Object.fromEntries(SKIES_IDS.map((k) => [k, zeros(STAR_WAVES.map((w) => `w${w}`))])),
    medals: zeros(MEDAL_IDS), tips: zeros(TIP_IDS), charted: zeros(LANDS), rank: 0,
    dyes: { ...zeros(DYE_IDS), [SAIL_DYES[0]]: 1, [PENNANT_DYES[0]]: 1 },
    orders: { day: '', picks: [-1, -1, -1], got: [0, 0, 0], done: [0, 0, 0], bonus: 0 },
    log: [],
  };
}
// fill in anything an older save is missing, keeping only what the fresh save lists (so a commendation, a tip or a dye
// the game no longer has is dropped, and one it gained starts at nothing). An empty object in the fresh save is a list
// kept by name, `captains`: taken whole. A list is taken whole only if the fresh one is empty or as long (today's three
// orders); a number only if it's a real one (not "not a number", not infinite)
const isMap = (o) => !!o && typeof o === 'object' && !Array.isArray(o);
function merge(base, d) {
  if (!isMap(d)) return base;
  for (const k of Object.keys(base)) {
    if (!(k in d)) continue;
    const b = base[k], v = d[k];
    if (isMap(b) && !Object.keys(b).length) { if (isMap(v)) base[k] = v; }
    else if (isMap(b)) base[k] = merge(b, v);
    else if (Array.isArray(b)) { if (Array.isArray(v) && (!b.length || v.length === b.length)) base[k] = v; }
    else if (typeof v === typeof b && (typeof v !== 'number' || Number.isFinite(v))) base[k] = v;
  }
  return base;
}
// and what a list or a name in it must be: the log's voyages each with their numbers (the last twelve), the orders'
// numbers, and each ship's colours ones the game has and the Captain owns
const num = (x) => typeof x === 'number' && Number.isFinite(x);
function sanitize(d) {
  d.log = d.log.filter((e) => isMap(e) && num(e.d) && num(e.w) && num(e.k) && num(e.s) && typeof e.ship === 'string' && typeof e.skies === 'string').slice(-LOG_KEEP);
  const O = d.orders;
  O.picks = O.picks.map((x) => (Number.isInteger(x) && x >= -1 ? x : -1)); O.got = O.got.map((x) => (num(x) ? x : 0)); O.done = O.done.map((x) => (x ? 1 : 0));
  d.dyes[SAIL_DYES[0]] = d.dyes[PENNANT_DYES[0]] = 1;
  for (const id of IDS) {
    const P = d.ships[id].paint;
    if (!SAIL_DYES.includes(P.sails) || !d.dyes[P.sails]) P.sails = SAIL_DYES[0];
    if (!PENNANT_DYES.includes(P.pennant) || !d.dyes[P.pennant]) P.pennant = PENNANT_DYES[0];
  }
  return d;
}
// the rank renown brings (RANK_AT), and the colours that rank and those below it win
const rankFor = (renown) => { let r = 0; while (r + 1 < RANK_AT.length && renown >= RANK_AT[r + 1]) r++; return r; };
function rankDyes(d) { for (const r in RANK_DYES) if (d.rank >= +r) d.dyes[RANK_DYES[r]] = 1; }
// A save from before version 2 (the Captain's record): what it already proves is credited. Each skies' best wave earns
// its stars, paid once now as back pay (with the Maelstrom's colours); the waves of her best voyage on each are
// credited as renown, so a Captain who has sailed far starts at a fitting rank (raised to it without its purses, which
// pay for rising at sea); everything else counted (the raiders, the shots, the voyages' log) starts now, as it can't be
// known. Returns the back pay (0 when there's nothing to do)
function migrate(d) {
  if (d.v >= 2) return 0;
  let pay = 0, renown = 0;
  for (const k of SKIES_IDS) {
    const n = d.best[k];
    STAR_WAVES.forEach((w, i) => { if (n >= w && !d.stars[k][`w${w}`]) { d.stars[k][`w${w}`] = 1; pay += STAR_PAY[k][i]; const dye = STAR_DYES[k]?.[w]; if (dye) d.dyes[dye] = 1; } });
    renown += 10 * (n * (n + 1)) / 2 * SKIES[k].renown;
  }
  d.stats.renown = Math.max(d.stats.renown, Math.round(renown));
  d.rank = Math.max(d.rank, rankFor(d.stats.renown)); rankDyes(d);
  d.shards += pay; d.v = 2;
  return pay;
}
// a save read from storage or the store, made whole: its shape (merge), its lists (sanitize), and an old one brought up
// to version 2 (migrate); `paid`: the back pay that brought (or 0)
function whole(raw) {
  const d = sanitize(merge(fresh(), raw));
  return { d, paid: migrate(d) };
}

export function makeProgress() {
  let data = fresh(), backPay = 0, migrated = false;
  try { const raw = localStorage.getItem(KEY); if (raw) { const W = whole(JSON.parse(raw)); data = W.d; backPay = W.paid; migrated = data.v === 2 && JSON.parse(raw).v !== 2; } } catch { /* no storage here */ }
  const listeners = [];
  let remote = null, writing = false, again = false, live = false, tries = 0;
  const writeLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* no storage here */ } };
  const later = (f) => setTimeout(f, 1000 + Math.random() * 2000); // a moment, and not the same moment on every device

  // On claude.ai: this person's own save in the page's store (data/users/<id>/save), shared by their devices. The newest
  // save wins: whenever the store holds a save this device hasn't seen (another device played since), this device
  // takes it, and it looks again just before every write, so a tab left open never writes its old save over newer
  // progress. Shards won on a voyage are never lost that way: the newer save takes them on (adopt). What this device
  // changed in port before it heard (a ship, an upgrade, the skies) gives way to the newer save, shards spent and all.
  // An open tab hears of another device's saves as they happen, and sends what it couldn't send before.
  const news = (d) => !!d && (d.saved ?? 0) > data.synced && d.saved !== data.saved;
  function adopt(d) {
    const old = data, now = Date.now(), W = whole(JSON.parse(JSON.stringify(d)));
    data = W.d; data.synced = data.saved; backPay = W.paid || backPay;
    // this device's voyages the newer save hasn't got are added to it. One the store took a moment ago counts too:
    // another device saving at that same moment may have written over it
    const lost = old.banked.filter((b) => b?.n > 0 && !data.got.includes(b.id) && (!b.at || now - b.at < HELD));
    data.banked = lost.map((b) => ({ ...b, sent: 1, at: 0 }));
    for (const b of lost) data.shards += b.n;
    if (lost.length) { for (const k in data.best) data.best[k] = Math.max(data.best[k], old.best[k] ?? 0); data.voyages = Math.max(data.voyages, old.voyages); }
    writeLocal();
    // (whether this device had progress of its own, so a new browser isn't told it came from another device)
    for (const f of listeners) f(data, old.saved > 0, lost.length > 0);
    // (a save from a device still on the old game, brought up to version 2 here, goes back up as one with this device's
    // next save: brought up again meanwhile, it comes out the same)
    if (lost.length) save();
  }
  async function connect() {
    if (!window.claude?.use) return;
    try {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      const id = db && user && await user.id();
      if (!id) return;
      remote = db.doc(`data/users/${id}/save`);
    } catch { return; }
    await look(); // the first look: take a newer save, or send what was played here while away from the store
    listen();
    // and a look when the page comes back into view, in case the stream slept, or died, while it was hidden
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { tries = 0; listen(); look(); } });
  }
  // another device's saves, as they come. A stream that dies is opened again after a pause, longer each time
  function listen() {
    if (!remote || live) return;
    live = true;
    try {
      remote.onSnapshot((s) => {
        if (writing || s.metadata?.hasPendingWrites) return;
        const d = s.exists ? s.data() : null;
        if (news(d)) adopt(d); else push(); // (push only sends this device's own changes the store hasn't got)
      }, (e) => { live = false; if (STOP.includes(e?.code)) remote = null; else if (tries < 5) setTimeout(listen, 2000 * 2 ** tries++ * (1 + Math.random())); });
    } catch { live = false; }
  }
  // a look at the store: take a newer save, or send this device's changes the store hasn't got
  async function look(retried = false) {
    if (!remote || writing) return;
    try {
      const snap = await remote.get(), d = snap.exists ? snap.data() : null;
      if (writing) return;
      if (news(d)) adopt(d); else push();
    } catch (e) { if (STOP.includes(e?.code)) remote = null; else if (!retried) later(() => look(true)); }
  }
  async function push(retried = false) {
    if (!remote || data.saved <= data.synced) return;
    if (writing) { again = true; return; }
    writing = true;
    let retry = false;
    try {
      // one last look: if another device has saved since this one last synced, its save wins
      const snap = await remote.get(), d = snap.exists ? snap.data() : null;
      if (news(d)) adopt(d);
      else {
        const sending = data.banked.filter((b) => !b.at), out = JSON.parse(JSON.stringify(data));
        for (const b of sending) b.sent = 1; // (a voyage won after this goes on a list of its own)
        out.got = [...new Set([...data.got, ...sending.map((b) => b.id)])].slice(-100); out.banked = []; out.synced = out.saved;
        await remote.set(out);
        const now = Date.now();
        for (const b of sending) b.at = now;
        data.got = out.got; data.synced = out.saved; writeLocal();
      }
    } catch (e) {
      if (STOP.includes(e?.code)) remote = null;
      else retry = !retried && e?.code !== 'quota_exceeded';
    }
    writing = false;
    // the store busy or out of reach: once more in a moment (after that, the next save, look or news sends it)
    if (retry) { again = false; later(() => push(true)); } else if (again) { again = false; push(); }
  }
  // the stamp never goes backwards, even on a device whose clock is slow
  function save() {
    const now = Date.now();
    data.saved = Math.max(now, data.synced + 1, data.saved + 1);
    data.banked = data.banked.filter((b) => !b.at || now - b.at < HELD); // the store has long had these
    writeLocal(); push();
  }
  // the stamp and this device's storage only, not the store (it goes up with the next save): for small news at sea, a tip
  // given, so a closed tab keeps it without a write to the store for each
  function mark() { data.saved = Math.max(Date.now(), data.synced + 1, data.saved + 1); writeLocal(); }
  if (migrated) save(); // (a save from this device brought up to version 2: kept so, and sent up)
  connect();
  return {
    get data() { return data; },
    save, mark,
    // send up what's only been kept on this device (mark), if anything
    flush: () => push(),
    // the back pay an old save was given as it was brought up to version 2 (migrate), once: told in port, then 0
    takeBackPay() { const n = backPay; backPay = 0; return n; },
    // shards brought home from a voyage, and the wave it reached
    bank(n, wave) {
      if (n > 0) {
        const last = data.banked[data.banked.length - 1];
        if (last && !last.sent) last.n += n; else data.banked.push({ id: Math.random().toString(36).slice(2, 10), n, sent: 0, at: 0 });
      }
      data.shards += n; data.best[data.skies] = Math.max(data.best[data.skies], wave); data.voyages++; save();
    },
    // a Captain who has never been to sea (a save from before voyages were counted shows it in what it holds)
    get newCaptain() { return !data.voyages && !data.shards && !Object.values(data.best).some((n) => n > 0) && !IDS.some((id) => id !== 'skiff' && data.ships[id].owned); },
    // (f(data, had, kept): `had` is whether this device had progress of its own, `kept` whether a voyage won here was added)
    onLoad: (f) => listeners.push(f),
    // a fresh start (it keeps the stamps and the voyages the store holds, or the store would bring them straight back)
    reset() { const { saved, synced, got } = data; data = fresh(); Object.assign(data, { saved, synced, got }); save(); },
  };
}
