// settings.js: the Settings card, opened from the gear on the title screen, in the port's top bar, or on the pause
// card. Each setting is a row: a switch, a slider, or a choice of a few buttons. They're kept on this device only (in
// the browser, not in the shared save), as each device wants its own: sound on a phone in a café, off on a laptop at
// work; a phone drawing Smooth or Balanced, a laptop Sharp. Changing one takes effect at once (whoever listens:
// on(fn)); it's saved as soon as it's let go.
// Adding a setting is adding a row to ROWS: { id, kind: 'switch' | 'slider' | 'choice', label, def (or def(touch), a
// default for each kind of device), touch: true for a phone only, note: a line under it, options: [[value, 'Label'],
// ...] for a choice, min/max/step for a slider (0 to 1 in twentieths if not) }.
// The device also remembers a few things of its own here that aren't rows (KEEP): how many voyages it has sailed, so
// the laptop's key panel can fold away once you know the keys.
const KEY = 'skies-of-aethermoor/settings-1';
export const ROWS = [
  { id: 'sound', kind: 'switch', label: 'Sound on', def: true },
  { id: 'music', kind: 'slider', label: 'Music', def: 0.8 },
  { id: 'effects', kind: 'slider', label: 'Sounds', def: 1 },
  { id: 'aim', kind: 'choice', label: 'Aim speed', def: 2, options: [[0, 'Slow'], [1, 'Gentle'], [2, 'Normal'], [3, 'Quick'], [4, 'Fast']] },
  { id: 'flip', kind: 'choice', label: 'Up and down', def: false, options: [[false, 'Normal'], [true, 'Flipped']] },
  { id: 'picture', kind: 'choice', label: 'Picture', def: (touch) => (touch ? 'balanced' : 'sharp'), options: [['smooth', 'Smooth'], ['balanced', 'Balanced'], ['sharp', 'Sharp']],
    note: 'Smooth runs best on older phones; Sharp looks finest.' },
  { id: 'shake', kind: 'switch', label: 'Camera shake', def: true },
  { id: 'leftFire', kind: 'switch', label: 'Fire button on the left', def: false, touch: true },
];
// how far the view swings for a drag, at each aim speed
export const AIM = [0.5, 0.75, 1, 1.35, 1.8];
// what each picture setting draws: the most screen pixels for each of the page's (devicePixelRatio), the sun's shadow
// map, how many of the big cloud puffs, how big on screen (its length over the view's height) a raider must be to be
// drawn with her middle model rather than her far one, the effects' share (sparks, smoke, debris: fx.js), on a phone
// and on a laptop, and the sky's (sky.js, world.js): the share of rain streaks, the scraps of scud, the sun's rays, the
// sea's glitter and the towering clouds round the horizon
const SKY = { rain: 1, scud: true, rays: true, glitter: true, towers: true };
export const PICTURE = {
  smooth: { ratio: 1, shadow: 512, puffs: 55, detail: 0.09, fx: [0.45, 0.5], sky: { ...SKY, rain: 0.5, scud: false, rays: false, glitter: false } },
  balanced: { ratio: 1.5, shadow: 1024, puffs: 85, detail: 0.06, fx: [0.6, 0.75], sky: SKY },
  sharp: { ratio: 2, shadow: 2048, puffs: 110, detail: 0.06, fx: [0.75, 1], sky: SKY },
};
const KEEP = { voyages: 0 };
const $ = (id) => document.getElementById(id);

export function makeSettings({ touch = false } = {}) {
  const data = { ...KEEP };
  const def = (r) => (typeof r.def === 'function' ? r.def(touch) : r.def);
  for (const r of ROWS) data[r.id] = def(r);
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    for (const r of ROWS) if (r.id in saved && typeof saved[r.id] === typeof data[r.id] && (!r.options || r.options.some(([v]) => v === saved[r.id]))) data[r.id] = saved[r.id];
    for (const k in KEEP) if (typeof saved[k] === typeof KEEP[k]) data[k] = saved[k];
  } catch { /* no storage here, or something odd in it */ }
  const listeners = [];
  const tell = (id, done) => { for (const f of listeners) f(id, data[id], done); };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* no storage here */ } };

  // the card's rows, built from ROWS
  const rowsEl = $('settings-rows'), inputs = {}, shows = {};
  for (const r of ROWS) {
    if (r.touch && !touch) continue;
    const row = document.createElement('div');
    row.className = `setting ${r.kind}`; row.dataset.setting = r.id;
    const id = `set-${r.id}`;
    if (r.kind === 'switch') {
      row.innerHTML = `<label for="${id}">${r.label}</label><input id="${id}" type="checkbox" role="switch">`;
      const el = row.querySelector('input'); el.checked = !!data[r.id];
      el.addEventListener('change', () => { data[r.id] = el.checked; save(); tell(r.id, true); });
      shows[r.id] = () => { el.checked = !!data[r.id]; };
      inputs[r.id] = el;
    } else if (r.kind === 'slider') {
      row.innerHTML = `<label for="${id}">${r.label}</label><input id="${id}" type="range" min="${r.min ?? 0}" max="${r.max ?? 1}" step="${r.step ?? 0.05}"><output></output>`;
      const el = row.querySelector('input'), out = row.querySelector('output');
      const show = () => { out.textContent = r.max ? String(data[r.id]) : `${Math.round(data[r.id] * 100)}%`; };
      el.value = String(data[r.id]); show();
      el.addEventListener('input', () => { data[r.id] = +el.value; show(); tell(r.id, false); });
      el.addEventListener('change', () => { data[r.id] = +el.value; show(); save(); tell(r.id, true); });
      shows[r.id] = () => { el.value = String(data[r.id]); show(); };
      inputs[r.id] = el;
    } else {
      row.id = id;
      row.innerHTML = `<span>${r.label}</span><span class="pick" role="radiogroup" aria-label="${r.label}">${r.options.map(([v, l]) => `<button type="button" role="radio" data-value="${v}">${l}</button>`).join('')}</span>`;
      const buttons = [...row.querySelectorAll('button')];
      const show = () => { for (const b of buttons) b.setAttribute('aria-checked', String(b.dataset.value === String(data[r.id]))); };
      for (const b of buttons) b.addEventListener('click', () => { const o = r.options.find(([v]) => String(v) === b.dataset.value); data[r.id] = o[0]; show(); save(); tell(r.id, true); });
      show(); shows[r.id] = show;
      inputs[r.id] = row;
    }
    if (r.note) row.insertAdjacentHTML('beforeend', `<p class="note">${r.note}</p>`);
    rowsEl.append(row);
  }

  // opening and closing the card (Done, the dim sky around it, or Esc)
  const card = $('settings');
  const open = () => { card.hidden = false; };
  const close = () => { card.hidden = true; };
  $('btn-settings-done').addEventListener('click', close);
  card.addEventListener('click', (e) => { if (e.target === card) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !card.hidden) { close(); e.stopPropagation(); } }, true);
  for (const id of ['btn-settings-title', 'btn-settings-port', 'btn-settings-pause']) $(id)?.addEventListener('click', open);

  return {
    data, save, open, close, inputs,
    get shown() { return !card.hidden; },
    // change one from the game (or a test) as if it were chosen on the card
    set(id, v) { data[id] = v; shows[id]?.(); save(); tell(id, true); },
    // something this device remembers that isn't a row (KEEP), kept at once
    keep(id, v) { data[id] = v; save(); },
    // listen for changes: fn(id, value, done) (done: let go, and saved)
    on: (fn) => { listeners.push(fn); },
  };
}
