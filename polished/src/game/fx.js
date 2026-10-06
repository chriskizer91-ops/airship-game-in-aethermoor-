// fx.js: the effects engine, and how a fight feels. It owns every spark, flash and glowing point in the sky (in one
// batch with the bolts' heads), the smoke (effects.js), and the camera's shake and kick, and it listens to the game's
// news (events.js) to answer it:
//   a gun going off      a tongue of flame out of its muzzle and a puff of white gunsmoke; the Captain's own guns
//                        shove the view back a little each (a broadside rolls like thunder), and buzz an Android phone
//   a shot landing       a burst of sparks the colour of what it hit; hits on the Captain's ship shake the view (the
//                        hull hardest), lurch it towards the side hit, and buzz the phone
//   a near miss          a flash of white sparks where it passed, and a twitch of the view
//   a raider going down  her blast (told on as `blast`, which shakes the view when it's close), and a longer buzz
//   a Surge              a jolt
// The sparks live in plain number arrays made once (a fixed number: 1,100 on a laptop, 700 on a phone), so a fight
// leaves nothing for a phone to clear away; when every spark is in use the oldest-placed is reused and counted as
// `dropped`. Every count asked for is scaled by `q`: 1 on a laptop, 0.6 on a phone. Points are drawn no bigger than
// a phone can fill quickly.
// The time dial (slowmo, timeScale) slows the game's clock for a moment; tests step the game directly, at full speed.
// Players whose device asks for less motion get 0.3 of the shake and kick, and no buzzing.
import * as THREE from 'three';
import { upload, KINDS } from './guns.js';
import { makeSmoke } from './effects.js';
import { on, emit, payload } from './events.js';

export const MOTION = 0.3; // the share of shake and kick kept for reduced motion
export const SHAKE = { pos: 0.5, yaw: 0.07, pitch: 0.06, roll: 0.08 }; // the view's shake at full trauma (metres, radians)
const K = 130, C = 2 * 0.9 * Math.sqrt(K); // the kick springs: back to rest about half a second after the last shove
// a shot landing: the sparks' colour, how many, and how big, by what it hit
const BURST = { hull: [0xffa040, 30, 1.1], sails: [0xf5e6c8, 18, 0.8], crystals: [0xffe08a, 40, 1.4] };
const noise = (t, a, b) => Math.sin(t * 23.1 + a) * 0.6 + Math.sin(t * 37.7 + b) * 0.4; // smooth, never repeating quite the same
const CAM = ['back', 'pitch', 'side', 'fov'];

export function makeFx({ scene, camera, touch = false }) {
  const q = touch ? 0.6 : 1;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)'), motion = () => (reduce.matches ? MOTION : 1);

  // ---------- the glows: sparks, flashes, the bolts' heads and anything lit for one frame, in one batch ----------
  const SCAP = touch ? 700 : 1100, GCAP = 720, GMAX = SCAP + GCAP;
  const gpos = new Float32Array(GMAX * 3), gcol = new Float32Array(GMAX * 3), gsize = new Float32Array(GMAX);
  const ggeo = new THREE.BufferGeometry();
  ggeo.setAttribute('position', new THREE.BufferAttribute(gpos, 3).setUsage(THREE.DynamicDrawUsage));
  ggeo.setAttribute('color', new THREE.BufferAttribute(gcol, 3).setUsage(THREE.DynamicDrawUsage));
  ggeo.setAttribute('size', new THREE.BufferAttribute(gsize, 1).setUsage(THREE.DynamicDrawUsage));
  ggeo.setDrawRange(0, 0);
  const gmat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: 500 }, uMax: { value: touch ? 260 : 420 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float size; varying vec3 vC; uniform float uScale; uniform float uMax; void main() { vC = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(size * uScale / -mv.z, uMax); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vC; void main() { float r = length(gl_PointCoord - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - r), 2.0); if (a < 0.01) discard; gl_FragColor = vec4(vC * a, a); }',
    vertexColors: true,
  });
  const glows = new THREE.Points(ggeo, gmat); glows.frustumCulled = false; glows.renderOrder = 4; scene.add(glows);

  // sparks: where, how they fly, how long they last, how big, their colour, how fast the air slows them, and gravity
  const F = (n) => new Float32Array(n);
  const sx = F(SCAP), sy = F(SCAP), sz = F(SCAP), svx = F(SCAP), svy = F(SCAP), svz = F(SCAP), slife = F(SCAP), sfull = F(SCAP), ssize = F(SCAP),
    sr = F(SCAP), sg = F(SCAP), sb = F(SCAP), sdrag = F(SCAP), sgrav = F(SCAP);
  const SARR = [sx, sy, sz, svx, svy, svz, slife, sfull, ssize, sr, sg, sb, sdrag, sgrav];
  let ns = 0, cursor = 0, dropped = 0, peak = 0;
  const col = new THREE.Color(); // (colours are given as 0xrrggbb, turned into the light the shader adds, like three.js does)
  // a spark at p flying at v (both read, not kept), for `life` seconds, `size` metres across
  function spark(p, v, life, size, hex, drag = 1.5, grav = 0) {
    let i;
    if (ns < SCAP) i = ns++;
    else { i = cursor; cursor = (cursor + 1) % SCAP; dropped++; }
    col.setHex(hex);
    sx[i] = p.x; sy[i] = p.y; sz[i] = p.z; svx[i] = v.x; svy[i] = v.y; svz[i] = v.z; slife[i] = sfull[i] = life; ssize[i] = size;
    sr[i] = col.r; sg[i] = col.g; sb[i] = col.b; sdrag[i] = drag; sgrav[i] = grav;
    if (ns > peak) peak = ns;
  }
  const ZERO = new THREE.Vector3(), sv = new THREE.Vector3(), sp = new THREE.Vector3();
  // a burst of sparks flying out from p, with a flash at its heart: `n` sparks (fewer on a phone), `power` bigger and
  // faster, `flash` the flash's size (smaller for hits right in front of the camera, on the Captain's own ship)
  function burst(p, hex = 0xffc070, n = 26, power = 1, flash = 1) {
    spark(p, ZERO, 0.5, 30 * power * flash, hex);
    const m = Math.round(n * q);
    for (let i = 0; i < m; i++) {
      sv.set(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize().multiplyScalar(20 + Math.random() * 40 * power);
      spark(p, sv, 0.6 + Math.random() * 0.8, 2.5 + Math.random() * 3, i % 3 ? hex : 0xffffff, 1.5, 4);
    }
  }
  // a glowing point for this frame only (a bolt's head, a gun port glowing before a broadside): nothing is kept
  const gx = F(GCAP), gy = F(GCAP), gz = F(GCAP), gr = F(GCAP), gg = F(GCAP), gb = F(GCAP), gs = F(GCAP);
  let ng = 0;
  function glowAt(p, r, g, b, size) {
    if (ng >= GCAP) return;
    gx[ng] = p.x; gy[ng] = p.y; gz[ng] = p.z; gr[ng] = r; gg[ng] = g; gb[ng] = b; gs[ng++] = size;
  }

  const smoke = makeSmoke(scene, touch ? 600 : 900, touch ? 420 : 700);

  // ---------- the camera: trauma (shake) and kicks (springs back to rest) ----------
  const cam = { trauma: 0, back: 0, pitch: 0, side: 0, fov: 0 }, camV = { back: 0, pitch: 0, side: 0, fov: 0 };
  let clock = 0;
  const trauma = (a) => { cam.trauma = Math.min(1, cam.trauma + a); };
  // shove the view: back (metres, away from the ship), pitch (radians, up), FOV (degrees wider), side (metres, right)
  function kick(back, pitch = 0, fov = 0, side = 0) {
    const m = motion();
    cam.back += back * m; cam.pitch += pitch * m; cam.fov += fov * m; cam.side += side * m;
  }
  const R = new THREE.Vector3(), U = new THREE.Vector3();
  // after camera.lookAt: move and turn the camera by the kick and shake (look: which way it looks)
  function applyCamera(camera, look) {
    const s = cam.trauma * cam.trauma * motion(), t = clock;
    R.set(1, 0, 0).applyQuaternion(camera.quaternion); U.set(0, 1, 0).applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(R, noise(t, 0, 1.3) * s * SHAKE.pos + cam.side).addScaledVector(U, noise(t, 2.1, 4.7) * s * SHAKE.pos).addScaledVector(look, -cam.back);
    camera.rotateX(cam.pitch + noise(t, 5.3, 0.4) * s * SHAKE.pitch);
    camera.rotateY(noise(t, 3.7, 2.9) * s * SHAKE.yaw);
    camera.rotateZ(noise(t, 1.9, 6.1) * s * SHAKE.roll);
  }

  // ---------- the time dial ----------
  let dial = 1, hold = 0, low = 1;
  // slow the game to `scale` of its speed for `seconds` (real time), easing in and back out
  const slowmo = (seconds, scale = 0.3) => { hold = seconds; low = scale; };
  function timeScale(realDt) {
    const want = hold > 0 ? low : 1;
    hold = Math.max(0, hold - realDt);
    dial += (want - dial) * (1 - Math.exp(-realDt * 8));
    if (hold <= 0 && Math.abs(dial - 1) < 1e-3) dial = 1;
    return dial;
  }

  // ---------- buzzing an Android phone (iPhones have no way to; nor do laptops) ----------
  const canBuzz = touch && typeof navigator.vibrate === 'function';
  const PULSES = [0, 1, 2, 3, 4, 5, 6].map((n) => Array.from({ length: n * 2 - 1 }, (_, i) => (i % 2 ? 45 : 8))); // a volley: a pulse a gun, at most six
  function buzz(pattern) {
    if (!canBuzz || reduce.matches || navigator.userActivation?.hasBeenActive === false) return;
    try { navigator.vibrate(pattern); } catch { /* not allowed here */ }
  }

  // ---------- answering the game's news ----------
  let focus = null; // where the Captain is (blasts near her shake the view)
  const fp = new THREE.Vector3(), fv = new THREE.Vector3(), cs = new THREE.Vector3();
  on('fire', (e) => {
    const ks = KINDS[e.kind].size, big = e.kind === 'broadside' ? 1 : 0.6, mine = e.owner === 'player';
    // a tongue of flame: three glows along the barrel, carried along with the ship, white-gold to orange
    for (let i = 1; i <= 3; i++) spark(fp.copy(e.p).addScaledVector(e.dir, i * 1.1 * ks), e.vel, 0.1, (i === 1 ? 10 : i === 2 ? 7 : 4.5) * ks, i === 1 ? 0xfff2c0 : i === 2 ? 0xffc060 : 0xff8a30, 0);
    for (let i = 0, m = Math.round(2 * q); i < m; i++) spark(e.p, fv.copy(e.vel).addScaledVector(e.dir, KINDS[e.kind].speed * 0.04).add(sp.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(6)), 0.5, 2.2, 0xff9a3a);
    // and a puff of white gunsmoke that billows out and drifts back along her side (a phone smokes every other port of
    // a big raider broadside)
    if (!(touch && !mine && e.n > 8 && e.i % 2)) {
      fv.copy(e.vel).multiplyScalar(0.9).addScaledVector(e.dir, 16 * big); fv.y += 3;
      smoke.emit(fp.copy(e.p).addScaledVector(e.dir, 1), fv, 3.2, 2.5 * big, 14 * big, 0.92, mine ? 0.65 : 0.55, 1, 0.5);
    }
    if (mine) { kick(0.22 * e.weight * (e.kind === 'broadside' ? 1 : 0.5), 0.004, 0.35); trauma(0.015); }
  });
  on('volley', (e) => { if (e.owner === 'player') buzz(PULSES[Math.min(6, e.count)]); });
  on('hit', (e) => {
    const B = BURST[e.part], mine = e.target === 'player';
    burst(e.at, B[0], B[1], B[2], mine ? 0.45 : 1);
    if (!mine) return;
    const sev = Math.min(1.5, e.damage / 55);
    trauma((e.part === 'hull' ? 0.35 : e.part === 'crystals' ? 0.3 : 0.15) * sev);
    cs.copy(e.at).applyMatrix4(camera.matrixWorldInverse);
    kick(0, 0, 0, Math.sign(cs.x) * 0.6 * sev); // towards the side that was hit
    buzz(30);
  });
  on('nearMiss', (e) => {
    for (let i = 0; i < 3; i++) spark(e.at, sv.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(14), 0.3, 2.4, 0xffffff);
    trauma(0.05);
  });
  const blast = payload('blast');
  on('raider:down', (e) => {
    const L = e.raider?.R?.length ?? 25;
    burst(e.at, 0xff8a3a, 60, 2.2); burst(fp.copy(e.at).setY(e.at.y + 3), 0xffe08a, 30, 1.6);
    blast.at.copy(e.at); blast.size = L; blast.big = L >= 40; emit('blast', blast);
    buzz(60);
  });
  on('blast', (e) => { if (focus) { const d = focus.distanceTo(e.at); if (d < 250) trauma(0.25 * (1 - d / 250) * (e.big ? 1.4 : 1)); } });
  on('surge', () => trauma(0.2));

  // ---------- every frame ----------
  function update(dt) {
    clock += dt;
    // the camera's shake fades, and its kicks spring back
    cam.trauma = Math.max(0, cam.trauma - dt * 1.6);
    for (let i = 0; i < 4; i++) { const k = CAM[i], v = camV[k] + (-K * cam[k] - C * camV[k]) * dt; camV[k] = v; cam[k] += v * dt; }
    // sparks fly, slow and fall; a spent one is swapped for the last
    for (let i = ns - 1; i >= 0; i--) {
      if ((slife[i] -= dt) <= 0) { const j = --ns; if (i !== j) for (let a = 0; a < SARR.length; a++) SARR[a][i] = SARR[a][j]; continue; }
      const d = 1 - dt * sdrag[i];
      svy[i] -= sgrav[i] * dt;
      sx[i] += svx[i] * dt; sy[i] += svy[i] * dt; sz[i] += svz[i] * dt;
      svx[i] *= d; svy[i] *= d; svz[i] *= d;
    }
    // into the batch: this frame's glows, then the sparks, fading as they go
    let n = 0;
    for (let i = 0; i < ng; i++, n++) {
      gpos[n * 3] = gx[i]; gpos[n * 3 + 1] = gy[i]; gpos[n * 3 + 2] = gz[i]; gcol[n * 3] = gr[i]; gcol[n * 3 + 1] = gg[i]; gcol[n * 3 + 2] = gb[i]; gsize[n] = gs[i];
    }
    ng = 0;
    for (let i = 0; i < ns; i++, n++) {
      const k = slife[i] / sfull[i];
      gpos[n * 3] = sx[i]; gpos[n * 3 + 1] = sy[i]; gpos[n * 3 + 2] = sz[i]; gcol[n * 3] = sr[i] * k; gcol[n * 3 + 1] = sg[i] * k; gcol[n * 3 + 2] = sb[i] * k; gsize[n] = ssize[i] * (0.6 + 0.4 * k);
    }
    ggeo.setDrawRange(0, n);
    upload(ggeo.attributes.position, n); upload(ggeo.attributes.color, n); upload(ggeo.attributes.size, n);
    if (camera.userData.pixelScale) gmat.uniforms.uScale.value = camera.userData.pixelScale;
    smoke.update(dt, camera);
  }
  // a fresh voyage: no sparks, smoke, shake or kick left over
  function clear() {
    ns = 0; ng = 0; cursor = 0; ggeo.setDrawRange(0, 0); smoke.clear();
    for (const k of CAM) { cam[k] = 0; camV[k] = 0; } cam.trauma = 0; hold = 0; dial = 1;
  }
  return {
    q, touch, spark, burst, glowAt, smoke, cam, trauma, kick, applyCamera, slowmo, timeScale, update, clear, buzz,
    follow: (p) => { focus = p; },
    get dial() { return dial; },
    // for tests: how many sparks and puffs are alive, the most sparks seen, and how many were cut short for room
    stats: () => ({ sparks: ns, sparkCap: SCAP, peak, dropped, puffs: smoke.count, puffCap: smoke.max, puffsDropped: smoke.dropped }),
    resetStats: () => { peak = ns; dropped = 0; },
  };
}
