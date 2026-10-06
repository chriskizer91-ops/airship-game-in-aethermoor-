// audio.js: the game's sound, switched on. Browsers (phones above all) only let a page make sound once the player has
// touched it, so nothing is made until the first tap, click or key anywhere on the page: then the game's one audio
// context is made and started inside that very touch (an iPhone needs it so, and a silent blip to be sure), the mix
// is built (mixer.js), Chris's instruments (src/audio/thareia/sounds.js) are set up in the same context, and the
// game's own sounds are made into short recordings off to one side (voices.js, a moment's work).
// Chris's two files are used exactly as they are: sounds.js sends everything it plays into its output, OUT, which is
// taken away from his own compressor and fed into the mix's music bus, so the music has its own volume; his effects
// are played through buses of the mix's own instead (withBus), each at a level measured for it here, so they sit
// with the cannon. The music plays with his musicPlay, which fades the last piece out itself.
// Leaving the page (another app, another tab, the phone locked) fades the sound out and stops the audio clock; coming
// back starts it again (or the next touch does, if the browser asks for one). Every touch checks it's running, which
// brings it back after an iPhone stops it for a call. Turning the sound off in Settings stops the clock as well.
// For checking: `quiet` (set while tests run the game's clock without drawing) means sounds are only counted, `stats`
// counts what was asked for and what played, `level()` says how loud it has been lately, offline() plays a scripted few
// seconds into an offline copy of the mix and measures them (sound.js's selfTest), and recordMusic() records the music.
import { SFX, sfxInit, sfxNodes, withBus, fm } from './thareia/sounds.js';
import { musicPlay, musicStop, musicPlaying } from './thareia/music.js';
import { makeMixer, measure } from './mixer.js';
import { bake } from './voices.js';

const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
const BY_ID = new Map(SFX.map((e) => [e.id, e]));

export function makeAudio({ touch = false, settings = () => ({ sound: true, music: 0.8, effects: 1 }) } = {}) {
  let ctx = null, M = null, bank = null, piece = null, pieceLevel = 1, hidden = document.hidden, built = false;
  const stats = { events: {}, effects: 0, unlocked: 0, resumed: 0, suspended: 0, ms: 0, cues: 0 };
  const ready = [];
  const A = {
    quiet: false, loudSteps: false, stats, touch,
    get ctx() { return ctx; }, get state() { return ctx ? ctx.state : 'none'; }, get mixer() { return M; }, get bank() { return bank; },
    get ready() { return !!bank; }, get piece() { return piece; }, get music() { return musicPlaying(); },
    onReady(f) { if (built) f(); else ready.push(f); },
  };

  // ---------- starting, and stopping when the page is left ----------
  function create() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC({ latencyHint: 'interactive' }); } catch { ctx = new AC(); }
    // (an iPhone wants a sound started inside the touch that wakes it)
    try { const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0); } catch { /* fine */ }
    M = makeMixer(ctx, { touch });
    M.apply(settings(), pieceLevel);
    // Chris's instruments in the same context; their output, OUT, into the music bus
    sfxInit(ctx);
    const { OUT } = sfxNodes(); OUT.disconnect(); OUT.connect(M.musicIn);
    built = true; stats.unlocked++;
    if (!settings().sound) setTimeout(() => { if (!wanted()) ctx.suspend().catch(() => {}); }, 0); // (made, but kept still)
    for (const f of ready.splice(0)) f();
    bake({ high: 32000, low: 16000 }, ctx.sampleRate).then((b) => { bank = b; }).catch((e) => console.warn('sounds not made:', e));
    return true;
  }
  // (the sound turned off in Settings stops the audio clock too, so a phone does no sound work at all)
  const wanted = () => !hidden && settings().sound;
  function wake() {
    if (hidden) return;
    if (!ctx && !create()) return;
    if (ctx.state !== 'running' && wanted()) { const p = ctx.resume(); stats.resumed++; p?.catch?.(() => {}); }
  }
  for (const k of GESTURES) addEventListener(k, wake, { capture: true, passive: true });
  function away(now) {
    hidden = now;
    if (!ctx) return;
    const t = ctx.currentTime, g = M.master.gain;
    if (now) {
      g.cancelScheduledValues(t); g.setTargetAtTime(0, t, 0.02); stats.suspended++;
      setTimeout(() => { if (hidden && ctx.state === 'running') ctx.suspend().catch(() => {}); }, 80);
    } else if (wanted()) {
      const p = ctx.resume(); p?.catch?.(() => {});
      M.apply(settings(), pieceLevel);
    }
  }
  document.addEventListener('visibilitychange', () => away(document.hidden));
  addEventListener('pagehide', () => away(true));
  addEventListener('pageshow', () => { if (!document.hidden) away(false); });

  // ---------- what the game asks for ----------
  A.running = () => !!ctx && ctx.state === 'running' && !hidden;
  A.now = () => (M ? M.now() : 0);
  A.apply = () => {
    if (!M) return;
    M.apply(settings(), pieceLevel);
    if (wanted()) { if (ctx.state !== 'running') ctx.resume().catch?.(() => {}); }
    else if (!hidden) setTimeout(() => { if (!wanted() && ctx.state === 'running') ctx.suspend().catch(() => {}); }, 150); // (after the fade)
  };
  // one of Chris's effects (by its id in sounds.js), at `level` (measured for it), placed where the mix's P says (M.at /
  // M.here, called just before), into the effects bus (or the menus')
  const last = new Map();
  A.effect = (id, level, bus = 'fx', delay = 0, gap = 0.06) => {
    if (!M || A.quiet || hidden) return false;
    const e = BY_ID.get(id), t = M.now();
    if (!e || t - (last.get(id) ?? -9) < gap) return false;
    last.set(id, t);
    const c = M.chain(level, M.buses[bus] ?? M.fx);
    withBus(c.bus, c.rev, null, () => e.play(t + 0.02 + delay));
    stats.effects++;
    return true;
  };
  // a note on Chris's bell voice (his fm: { f, ratio, index, d, g }), placed where P says
  A.tone = (o, level = 1, bus = 'ui') => {
    if (!M || A.quiet || hidden) return;
    const c = M.chain(level, M.buses[bus] ?? M.fx), t = M.now() + 0.02;
    withBus(c.bus, c.rev, null, () => fm(t, o));
  };
  // the music: a piece of Chris's (an id in music.js), at a level of its own; musicPlay fades the last one out
  A.playMusic = (id, level = 1) => {
    if (!M || !A.running()) return false;
    pieceLevel = level; M.apply(settings(), level);
    if (musicPlaying() !== id) musicPlay(id);
    piece = id;
    return true;
  };
  A.stopMusic = () => { musicStop(0.8); piece = null; };
  A.level = () => (M ? M.level() : 0);

  // ---------- checking ----------
  // play a scripted few seconds into an offline copy of the mix: script(mixer) is given the copy (its clock set by the
  // script for each sound), and `music` (a recording of the music, or none) plays under it all. Returns the mix's peak,
  // how many samples clipped, its loudness and how long it rang, and how long it took to make
  A.offline = async (secs, script, music = null) => {
    const sr = ctx?.sampleRate ?? 44100, off = new OfflineAudioContext(2, Math.round(secs * sr), sr), m = makeMixer(off, { touch });
    m.apply(settings(), pieceLevel);
    if (music) { const s = off.createBufferSource(); s.buffer = music; s.connect(m.musicIn); s.start(0); }
    const t0 = performance.now();
    script(m);
    const made = performance.now() - t0, t1 = performance.now(), out = await off.startRendering();
    return { ...measure(out), made: +made.toFixed(1), rendered: Math.round(performance.now() - t1), stats: m.stats };
  };
  // a recording of what the music is playing now, `secs` long (as it goes into the mix, before its volume)
  A.recordMusic = (secs) => new Promise((done) => {
    if (!M) return done(null);
    const n = Math.round(secs * ctx.sampleRate), rec = ctx.createBuffer(2, n, ctx.sampleRate), sp = ctx.createScriptProcessor(4096, 2, 2), mute = ctx.createGain();
    let at = 0;
    mute.gain.value = 0; M.musicIn.connect(sp); sp.connect(mute); mute.connect(ctx.destination);
    sp.onaudioprocess = (e) => {
      const k = Math.min(e.inputBuffer.length, n - at);
      for (let c = 0; c < 2; c++) rec.getChannelData(c).set(e.inputBuffer.getChannelData(c).subarray(0, k), at);
      at += k;
      if (at >= n) { sp.onaudioprocess = null; M.musicIn.disconnect(sp); sp.disconnect(); mute.disconnect(); done(rec); }
    };
  });
  // every recording made for the game: none silent (its peak before scaling)
  A.silent = () => (bank ? Object.entries(bank).flatMap(([k, list]) => list.filter((b) => !(b.peak > 0.05)).map(() => k)) : ['(not made)']);
  return A;
}
