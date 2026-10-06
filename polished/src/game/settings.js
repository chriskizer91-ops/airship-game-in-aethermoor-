// settings.js: the Settings card, opened from the gear on the title screen, in the port's top bar, or on the pause
// card. Each setting is a row: a switch, a slider, or a choice of a few buttons. They're kept on this device only (in
// the browser, not in the shared save), as each device wants its own: sound on a phone in a café, off on a laptop at
// work. Changing one takes effect at once (whoever listens: on(fn)); it's saved as soon as it's let go.
// Adding a setting is adding a row to ROWS: { id, kind: 'switch' | 'slider' | 'choice', label, def, touch: true for a
// phone only, options: [[value, 'Label'], ...] for a choice, min/max/step for a slider (0 to 1 in twentieths if not) }.
const KEY = 'skies-of-aethermoor/settings-1';
export const ROWS = [
  { id: 'sound', kind: 'switch', label: 'Sound on', def: true },
  { id: 'music', kind: 'slider', label: 'Music', def: 0.8 },
  { id: 'effects', kind: 'slider', label: 'Sounds', def: 1 },
];
const $ = (id) => document.getElementById(id);

export function makeSettings({ touch = false } = {}) {
  const data = {};
  for (const r of ROWS) data[r.id] = r.def;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    for (const r of ROWS) if (r.id in saved && typeof saved[r.id] === typeof r.def) data[r.id] = saved[r.id];
  } catch { /* no storage here, or something odd in it */ }
  const listeners = [];
  const tell = (id, done) => { for (const f of listeners) f(id, data[id], done); };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* no storage here */ } };

  // the card's rows, built from ROWS
  const rowsEl = $('settings-rows'), inputs = {};
  for (const r of ROWS) {
    if (r.touch && !touch) continue;
    const row = document.createElement('div');
    row.className = `setting ${r.kind}`; row.dataset.setting = r.id;
    const id = `set-${r.id}`;
    if (r.kind === 'switch') {
      row.innerHTML = `<label for="${id}">${r.label}</label><input id="${id}" type="checkbox" role="switch">`;
      const el = row.querySelector('input'); el.checked = !!data[r.id];
      el.addEventListener('change', () => { data[r.id] = el.checked; save(); tell(r.id, true); });
      inputs[r.id] = el;
    } else if (r.kind === 'slider') {
      row.innerHTML = `<label for="${id}">${r.label}</label><input id="${id}" type="range" min="${r.min ?? 0}" max="${r.max ?? 1}" step="${r.step ?? 0.05}"><output></output>`;
      const el = row.querySelector('input'), out = row.querySelector('output');
      const show = () => { out.textContent = r.max ? String(data[r.id]) : `${Math.round(data[r.id] * 100)}%`; };
      el.value = String(data[r.id]); show();
      el.addEventListener('input', () => { data[r.id] = +el.value; show(); tell(r.id, false); });
      el.addEventListener('change', () => { data[r.id] = +el.value; show(); save(); tell(r.id, true); });
      inputs[r.id] = el;
    } else {
      row.innerHTML = `<span>${r.label}</span><span class="pick" role="radiogroup" aria-label="${r.label}">${r.options.map(([v, l]) => `<button type="button" role="radio" data-value="${v}">${l}</button>`).join('')}</span>`;
      const buttons = [...row.querySelectorAll('button')];
      const show = () => { for (const b of buttons) b.setAttribute('aria-checked', String(b.dataset.value === String(data[r.id]))); };
      for (const b of buttons) b.addEventListener('click', () => { const o = r.options.find(([v]) => String(v) === b.dataset.value); data[r.id] = o[0]; show(); save(); tell(r.id, true); });
      show();
      inputs[r.id] = row;
    }
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
    // listen for changes: fn(id, value, done) (done: let go, and saved)
    on: (fn) => { listeners.push(fn); },
  };
}
