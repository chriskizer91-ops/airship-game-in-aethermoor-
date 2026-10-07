// progress.js: what the Captain has earned and owns, kept between visits: Crystal Shards (Aethermoor's money), the
// ships bought, each ship's upgrades and crystal power setting, which skies (difficulty) were chosen, the best wave
// reached, and how many voyages are behind the Captain (none: a new Captain, whom the title screen helps along, starting
// on Fair Winds, the skies marked best for a first voyage; a save already made keeps the skies it chose). Kept
// in the browser on this device, and, when the game is opened on claude.ai, also in the page's own private store for
// this person, so it follows them between devices.
// the three skies: how well the raiders aim, how quickly they reload, how hard they hit, how much they take, how fast
// they fly, how many more of them come, what shards pay, and how much of a raider captain's edge over her crew she has
// (raiders.js: on Fair Winds none, as she's the first big fight a new Captain meets, in a Skiff; only her bounty is
// bigger); which waves bring a storm (`storms`: their numbers, from 1, and after the fifteenth, this share of them at
// random: sky.js), and how near a raider still sees the Captain hidden in cloud (`sight`, metres)
export const SKIES = {
  fair: { name: 'Fair Winds', line: 'Raiders aim poorly, hit lightly and break easily. For learning the ropes.', aim: 1.8, reload: 1.35, damage: 0.45, toughness: 0.76, pace: 0.88, extra: 0, shards: 1, captain: 0,
    storms: { waves: [], after: 0 }, sight: 180 },
  cross: { name: 'Crosswinds', line: 'A fair fight. Shards pay a quarter more.', aim: 1, reload: 1, damage: 1, toughness: 1, pace: 0.92, extra: 0, shards: 1.25, captain: 1,
    storms: { waves: [8, 13], after: 0 }, sight: 250 },
  mael: { name: 'Maelstrom', line: 'Raiders hunt in bigger packs, hit harder and aim truer. Shards pay over half as much again.', aim: 0.8, reload: 0.92, damage: 1.15, toughness: 1.15, pace: 0.96, extra: 1, shards: 1.6, captain: 1,
    storms: { waves: [4, 8, 12], after: 0.4 }, sight: 350 },
};
export const PRICES = { skiff: 0, cutter: 300, brig: 900, frigate: 2200 };

const KEY = 'skies-of-aethermoor/save-1';
const IDS = ['skiff', 'cutter', 'brig', 'frigate'];
// what the claude.ai store answers when it will never take a write on this page (others, like busy or out of reach, pass)
const STOP = ['invalid_argument', 'not_granted', 'revoked', 'capability_disabled', 'capability_removed', 'transform_error'];
const HELD = 600e3; // how long a voyage stays on this device's own list after the store took it (see adopt)
// `saved` is when this save was last changed; `synced` is the `saved` of the copy in the claude.ai store that this
// device last read or wrote (so saved > synced means this device has changes the store hasn't got yet). `got` names
// the voyages whose shards the store's copy holds (the latest 100). `banked` is this device's own voyages that the
// store hasn't got, or took less than ten minutes ago: { id, n: shards, sent: 1 once a write has carried it, at: when
// the store took it }
function fresh() {
  return {
    v: 1, saved: 0, synced: 0, skies: 'fair', shards: 0, flying: 'skiff', best: { fair: 0, cross: 0, mael: 0 }, voyages: 0,
    ships: Object.fromEntries(IDS.map((id) => [id, { owned: id === 'skiff', power: 0, mods: { armour: 0, canvas: 0, drill: 0, crystals: 0 } }])),
    got: [], banked: [],
  };
}
// fill in anything an older save is missing
function merge(base, d) {
  if (!d || typeof d !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (!(k in d)) continue;
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], d[k]);
    else if (typeof d[k] === typeof base[k] && Array.isArray(d[k]) === Array.isArray(base[k])) base[k] = d[k];
  }
  return base;
}

export function makeProgress() {
  let data = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) data = merge(fresh(), JSON.parse(raw)); } catch { /* no storage here */ }
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
    const old = data, now = Date.now();
    data = merge(fresh(), JSON.parse(JSON.stringify(d))); data.synced = data.saved;
    // this device's voyages the newer save hasn't got are added to it. One the store took a moment ago counts too:
    // another device saving at that same moment may have written over it
    const lost = old.banked.filter((b) => b?.n > 0 && !data.got.includes(b.id) && (!b.at || now - b.at < HELD));
    data.banked = lost.map((b) => ({ ...b, sent: 1, at: 0 }));
    for (const b of lost) data.shards += b.n;
    if (lost.length) { for (const k in data.best) data.best[k] = Math.max(data.best[k], old.best[k] ?? 0); data.voyages = Math.max(data.voyages, old.voyages); }
    writeLocal();
    // (whether this device had progress of its own, so a new browser isn't told it came from another device)
    for (const f of listeners) f(data, old.saved > 0, lost.length > 0);
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
  connect();
  return {
    get data() { return data; },
    save,
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
