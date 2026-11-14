// pace.js: keeping the picture smooth by itself (stage 5). The Picture setting says how sharp the game may draw; at sea
// this watches how long the frames really take on this device, and when they can't keep up it draws a little less
// sharply (fewer of the screen's pixels: the one thing that eases every part of the picture at once), and puts the
// sharpness back when there's room again. So a phone that's fine in a calm sky and struggles in a six-ship fight in a
// storm stays smooth through both, without the player touching a setting.
// How it decides, in plain steps (the numbers are PACE):
//   - it looks at the frames in windows of 45 (under a second at full speed), and goes by the middle frame of each (so
//     one slow frame, a ship being built, say, doesn't count)
//   - a frame over a quarter of a second isn't a slow picture, it's a stall (the page in the background, the browser
//     busy): the window starts again
//   - two slow windows in a row (the middle frame over a quarter longer than a 60th of a second): one step less sharp
//   - 20 seconds of good frames: one step sharper again, to try it. If that's slow at once, it steps back and waits
//     twice as long before trying again (up to 160 seconds), so it never flickers between two steps
//   - if it's at its least sharp and that made next to no difference, sharpness isn't what's slow (a screen that
//     refreshes slowly, a busy processor): it goes back to full sharpness and leaves it there for this voyage
// It has no three.js in it: `apply(ratio)` is told each change (main.js sets the renderer's pixel ratio), and frame(ms)
// is given each frame's real time, so the check can play it any device's frames (tools/check.mjs).
export const PACE = {
  goal: 1000 / 60, // (ms: a frame at 60 a second)
  slow: 1.25, fine: 1.1, // (a window is slow over goal x slow, good under goal x fine)
  stall: 250, // (ms: a frame this long starts the window again)
  window: 45, need: 2, // (frames in a window; slow windows in a row before a step down)
  hold: 20, holdMax: 160, // (seconds of good frames before a step up; doubled each time a step up failed, up to this)
  settle: 4, // (windows after a step up in which a slow one means it failed)
  skip: 8, warm: 60, // (frames left out after a change of sharpness, and as a voyage starts: shaders being made)
  steps: [1, 0.85, 0.72, 0.6], // (each step's share of the sharpness the Picture setting allows)
  floor: 0.75, // (never fewer screen pixels than this to each of the page's, unless the setting itself is lower)
  helped: 0.88, // (at the least sharp step, the middle frame must be under this share of the first slow one to count as helped)
};

export function makePace({ apply }) {
  const buf = new Float32Array(PACE.window), sorted = new Float32Array(PACE.window);
  let ratios = [1], level = 0, n = 0, slowRuns = 0, good = 0, hold = PACE.hold, probe = 0, skip = PACE.warm, first = 0, capped = false, changes = 0, last = 0;
  const set = (l) => { if (l === level) return; level = l; changes++; skip = PACE.skip; n = 0; slowRuns = 0; good = 0; apply(ratios[level]); };
  // a new voyage, or the page seen again: the frames are counted afresh, at the sharpness it had
  function reset(full = false) {
    n = 0; slowRuns = 0; good = 0; probe = 0; skip = PACE.warm; capped = false; first = 0;
    if (full) { hold = PACE.hold; if (level !== 0) { level = 0; changes++; apply(ratios[0]); } }
  }
  // the sharpness the Picture setting allows on this screen (the screen's own pixels to each of the page's, at most):
  // the steps start again from it
  function setCap(cap) {
    const floor = Math.min(cap, PACE.floor), out = [];
    for (const s of PACE.steps) { const r = Math.max(floor, Math.round(cap * s * 100) / 100); if (!out.length || r < out[out.length - 1] - 0.04) out.push(r); }
    ratios = out; level = 0; hold = PACE.hold; reset(); apply(ratios[0]);
  }
  // one frame took `ms`
  function frame(ms) {
    if (capped || ratios.length < 2) return;
    if (ms > PACE.stall) { n = 0; slowRuns = 0; return; }
    if (skip > 0) { skip--; return; }
    buf[n++] = ms;
    if (n < PACE.window) return;
    sorted.set(buf); sorted.sort();
    const mid = sorted[PACE.window >> 1];
    let sum = 0; for (let i = 0; i < n; i++) sum += buf[i];
    n = 0; last = mid;
    if (mid > PACE.goal * PACE.slow) {
      good = 0;
      // (a step up that's slow at once failed: back, and twice as long before the next try)
      if (probe > 0) { probe = 0; hold = Math.min(PACE.holdMax, hold * 2); set(Math.min(ratios.length - 1, level + 1)); return; }
      if (++slowRuns < PACE.need) return;
      slowRuns = 0;
      if (!first) first = mid;
      if (level < ratios.length - 1) set(level + 1);
      else if (mid > first * PACE.helped) { capped = true; set(0); } // (it didn't help: full sharpness, and left alone)
    } else {
      slowRuns = 0;
      if (probe > 0 && --probe === 0) hold = PACE.hold; // (the step up held)
      if (mid <= PACE.goal * PACE.fine) { good += sum / 1000; if (level > 0 && good >= hold) { set(level - 1); probe = PACE.settle; } } else good = 0;
    }
  }
  return {
    frame, reset, setCap,
    get level() { return level; }, get ratio() { return ratios[level]; }, get ratios() { return ratios.slice(); }, get capped() { return capped; },
    get changes() { return changes; }, get hold() { return hold; }, get middle() { return last; },
    // (for the check: many frames of the same length, or a list of them)
    feed(ms, count = 1) { if (Array.isArray(ms)) for (const m of ms) frame(m); else for (let i = 0; i < count; i++) frame(ms); },
  };
}
