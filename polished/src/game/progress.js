// progress.js: what the Captain has earned and owns, kept between visits: Crystal Shards (Aethermoor's money), the
// ships bought, each ship's upgrades and crystal power setting, which skies (difficulty) were chosen, and the best
// wave reached. Kept in the browser on this device, and, when the game is opened on claude.ai, also in the page's own
// private store for this person, so it follows them between devices.
export const SKIES = {
  fair: { name: 'Fair Winds', line: 'Raiders aim poorly and break easily. For learning the ropes.', aim: 1.8, reload: 1.35, damage: 0.6, toughness: 0.8, pace: 0.88, extra: 0, shards: 1 },
  cross: { name: 'Crosswinds', line: 'A fair fight. Shards pay a quarter more.', aim: 1, reload: 1, damage: 1, toughness: 1, pace: 0.92, extra: 0, shards: 1.25 },
  mael: { name: 'Maelstrom', line: 'Raiders hunt in bigger packs, hit harder and aim truer. Shards pay over half as much again.', aim: 0.8, reload: 0.92, damage: 1.15, toughness: 1.15, pace: 0.96, extra: 1, shards: 1.6 },
};
export const PRICES = { skiff: 0, cutter: 300, brig: 900, frigate: 2200 };

const KEY = 'skies-of-aethermoor/save-1';
const IDS = ['skiff', 'cutter', 'brig', 'frigate'];
// `saved` is when this save was last changed; `synced` is the `saved` of the copy in the claude.ai store that this
// device last read or wrote (so saved > synced means this device has changes the store hasn't got yet)
function fresh() {
  return {
    v: 1, saved: 0, synced: 0, skies: 'cross', shards: 0, flying: 'skiff', best: { fair: 0, cross: 0, mael: 0 },
    ships: Object.fromEntries(IDS.map((id) => [id, { owned: id === 'skiff', power: 0, mods: { armour: 0, canvas: 0, drill: 0, crystals: 0 } }])),
  };
}
// fill in anything an older save is missing
function merge(base, d) {
  if (!d || typeof d !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (!(k in d)) continue;
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], d[k]);
    else if (typeof d[k] === typeof base[k]) base[k] = d[k];
  }
  return base;
}

export function makeProgress() {
  let data = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) data = merge(fresh(), JSON.parse(raw)); } catch { /* no storage here */ }
  const listeners = [];
  let remote = null, writing = false, again = false;
  const writeLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* no storage here */ } };

  // On claude.ai: this person's own save in the page's store (data/users/<id>/save), shared by their devices. The newest
  // save wins: whenever the store holds a save this device hasn't seen (another device played since), this device
  // takes it, and it looks again just before every write, so a tab left open never writes its old save over newer
  // progress. An open tab also hears of another device's saves as they happen.
  const news = (d) => !!d && (d.saved ?? 0) > data.synced && d.saved !== data.saved;
  function adopt(d) {
    data = merge(fresh(), JSON.parse(JSON.stringify(d))); data.synced = data.saved; writeLocal();
    for (const f of listeners) f(data);
  }
  async function connect() {
    if (!window.claude?.use) return;
    try {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) return;
      const id = await user.id();
      if (!id) return;
      const ref = db.doc(`data/users/${id}/save`), snap = await ref.get();
      remote = ref;
      const d = snap.exists ? snap.data() : null;
      if (news(d)) adopt(d);
      else if (data.saved > data.synced) push(); // played here while away from the store: send it
      // another device's saves, as they come (this never writes: writes only follow the player's own changes)
      ref.onSnapshot((s) => { const n = s.exists ? s.data() : null; if (!writing && !s.metadata?.hasPendingWrites && news(n)) adopt(n); }, () => {});
      // and a look when the page comes back into view, in case the stream slept while it was hidden
      document.addEventListener('visibilitychange', () => { if (!document.hidden) refetch(); });
    } catch { remote = null; }
  }
  async function refetch() {
    if (!remote || writing) return;
    try { const snap = await remote.get(), d = snap.exists ? snap.data() : null; if (!writing && news(d)) adopt(d); } catch { /* try again next time */ }
  }
  async function push() {
    if (!remote || data.saved <= data.synced) return;
    if (writing) { again = true; return; }
    writing = true;
    try {
      // one last look: if another device has saved since this one last synced, its save wins
      const snap = await remote.get(), d = snap.exists ? snap.data() : null;
      if (news(d)) adopt(d);
      else { const out = JSON.parse(JSON.stringify(data)); out.synced = out.saved; await remote.set(out); data.synced = out.saved; writeLocal(); }
    } catch (e) { if (['invalid_argument', 'not_granted', 'revoked', 'capability_disabled', 'capability_removed'].includes(e?.code)) remote = null; }
    writing = false;
    if (again) { again = false; push(); }
  }
  connect();
  return {
    get data() { return data; },
    // the stamp never goes backwards, even on a device whose clock is slow
    save() { data.saved = Math.max(Date.now(), data.synced + 1, data.saved + 1); writeLocal(); push(); },
    onLoad: (f) => listeners.push(f),
    // a fresh start (it keeps the sync stamp, or the store would bring the old save straight back)
    reset() { const synced = data.synced; data = fresh(); data.synced = synced; this.save(); },
  };
}
