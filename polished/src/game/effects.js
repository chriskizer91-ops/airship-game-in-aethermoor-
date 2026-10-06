// effects.js: smoke and debris. The white gunsmoke that billows from every port as a broadside goes off, the smoke from
// damaged ships, thickening and darkening as the hull goes, and the trail of the Captain's ship going down (a raider
// going down pours a whole column of it: wrecks.js). One batch of soft round puffs for the whole sky (fire and sparks
// are fx.js's glows). And the debris a shot knocks off a ship, matching what it hit.
// The puffs and pieces live in plain number arrays, a fixed number of them made once, so a phone never has to clear
// away thousands of little objects mid-fight: one that burns out is swapped for the last, and when every one is in use
// the oldest-placed is reused (and counted, as `dropped`).
import * as THREE from 'three';
import { upload } from './guns.js';

const ATTRS = ['position', 'size', 'shade', 'alpha'];
// `max` puffs at once; `cap`: the most pixels across one may be drawn (a phone's limit is how much it fills)
export function makeSmoke(scene, max = 900, cap = 700) {
  const pos = new Float32Array(max * 3), size = new Float32Array(max), shade = new Float32Array(max), alpha = new Float32Array(max);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('size', new THREE.BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('shade', new THREE.BufferAttribute(shade, 1).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1).setUsage(THREE.DynamicDrawUsage));
  geo.setDrawRange(0, 0);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: 500 }, uMax: { value: cap } }, transparent: true, depthWrite: false,
    vertexShader: `attribute float size; attribute float shade; attribute float alpha; uniform float uScale; uniform float uMax; varying float vS; varying float vA;
      void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(size * uScale / -mv.z, uMax); vS = shade; vA = alpha; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vS; varying float vA;
      void main() { vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; float a = smoothstep(1.0, 0.25, r) * vA;
        if (a < 0.01) discard;
        vec3 c = mix(vec3(0.07, 0.06, 0.06), vec3(0.72, 0.71, 0.7), vS) * (1.0 - d.y * 0.35);
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false; points.renderOrder = 3; scene.add(points);
  // each puff: where, how it drifts, its life, its size from s0 to s1, shade, how opaque, how it grows and rises
  const F = () => new Float32Array(max);
  const px = F(), py = F(), pz = F(), vx = F(), vy = F(), vz = F(), life = F(), full = F(), s0 = F(), s1 = F(), sh = F(), al = F(), grow = new Uint8Array(max), rise = F();
  let n = 0, cursor = 0, dropped = 0;
  // a puff at p drifting with v, growing from a to b metres across over its life; shade 0 is black, 1 pale grey.
  // grow 0: quickly at first and slowing (smoke pouring off a ship); 1: billowing out at once, then hanging (gunsmoke,
  // blasts). rise: how fast it lifts as it drifts (m/s each second)
  function emit(p, v, lifeS, a, b, shadeOf, op = 0.75, growMode = 0, riseBy = 1.5) {
    let i;
    if (n < max) i = n++;
    else { i = cursor; cursor = (cursor + 1) % max; dropped++; }
    px[i] = p.x; py[i] = p.y; pz[i] = p.z; vx[i] = v.x; vy[i] = v.y; vz[i] = v.z;
    life[i] = full[i] = lifeS; s0[i] = a; s1[i] = b; sh[i] = shadeOf; al[i] = op; grow[i] = growMode; rise[i] = riseBy;
  }
  const ARR = [px, py, pz, vx, vy, vz, life, full, s0, s1, sh, al, grow, rise];
  const kill = (i) => { const j = --n; if (i !== j) for (let a = 0; a < ARR.length; a++) ARR[a][i] = ARR[a][j]; };
  function update(dt, camera) {
    const drag = 1 - dt * 0.6;
    for (let i = n - 1; i >= 0; i--) {
      if ((life[i] -= dt) <= 0) { kill(i); continue; }
      px[i] += vx[i] * dt; py[i] += vy[i] * dt; pz[i] += vz[i] * dt;
      vx[i] *= drag; vy[i] *= drag; vz[i] *= drag; vy[i] += dt * rise[i];
    }
    for (let i = 0; i < n; i++) {
      const k = 1 - life[i] / full[i], g = grow[i] ? 1 - (1 - k) * (1 - k) * (1 - k) : Math.sqrt(k);
      pos[i * 3] = px[i]; pos[i * 3 + 1] = py[i]; pos[i * 3 + 2] = pz[i];
      size[i] = s0[i] + (s1[i] - s0[i]) * g; shade[i] = sh[i]; alpha[i] = al[i] * Math.min(1, k * (grow[i] ? 14 : 6)) * (1 - k);
    }
    geo.setDrawRange(0, n);
    for (let a = 0; a < ATTRS.length; a++) upload(geo.attributes[ATTRS[a]], n);
    if (camera) mat.uniforms.uScale.value = camera.userData.pixelScale ?? 500;
  }
  const clear = () => { n = 0; cursor = 0; geo.setDrawRange(0, 0); };
  // room for smoke that can be left out (a wreck's column, a damaged ship's smoke, vapour trails): only while the batch
  // is less than this full, so gunsmoke and blasts always find room
  const room = (share = 0.85) => n < max * share;
  return { emit, update, clear, room, max, get count() { return n; }, get dropped() { return dropped; } };
}

// Debris: what a shot knocks off a ship, by what it hit. Splinters of wood tumble and fall fast; scraps of canvas, in
// the colour of her sails, flutter slowly down; amber crystal shards glitter as they fall (a glow each, in fx.js's
// batch). Three batches of pieces, one draw each, and none at all while nothing of theirs is in the air; how many of
// each at most (times fx's q: fewer on a phone):
export const DEBRIS = { wood: 96, canvas: 64, crystal: 64 };
// how each kind flies: gravity (m/s each second), how quickly the air slows it (a share a second), how fast it spins
// (radians a second, from..to), how long it lasts (seconds, from..to), and its size (metres, across x up x along)
const FLY = {
  wood: { grav: 9.8, drag: 0.3, spin: [6, 14], life: [1.8, 2.6], size: [[0.08, 0.14], [0.06, 0.06], [0.4, 1.1]] },
  canvas: { grav: 2.5, drag: 2.5, spin: [2, 5], life: [3, 3], size: [[0.5, 1.2]] },
  crystal: { grav: 6, drag: 0.6, spin: [10, 10], life: [1.6, 1.6], size: [[0.12, 0.12], [0.3, 0.3], [0.12, 0.12]] },
};
// `glowAt(p, r, g, b, size)` lights a point for one frame (fx.js): the crystal shards' glitter
export function makeDebris(scene, q = 1, glowAt = null) {
  const cloth = new THREE.PlaneGeometry(1, 1, 2, 1), cp = cloth.attributes.position; // a scrap, bent along its middle
  for (let i = 0; i < cp.count; i++) if (Math.abs(cp.getX(i)) < 1e-6) cp.setZ(i, 0.15);
  const shapes = {
    wood: [new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff })],
    canvas: [cloth, new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide })],
    crystal: [new THREE.OctahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0xffc061, toneMapped: false })],
  };
  const col = new THREE.Color(), B = {};
  for (const kind in shapes) {
    const cap = Math.round(DEBRIS[kind] * q), mesh = new THREE.InstancedMesh(shapes[kind][0], shapes[kind][1], cap);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; mesh.count = 0; mesh.visible = false; mesh.name = 'debris-' + kind;
    if (kind !== 'crystal') { mesh.setColorAt(0, col.set(0xffffff)); mesh.instanceColor.setUsage(THREE.DynamicDrawUsage); }
    scene.add(mesh);
    const F = () => new Float32Array(cap);
    const b = { kind, mesh, cap, n: 0, cursor: 0, dropped: 0, peak: 0, fly: FLY[kind], rgb: mesh.instanceColor?.array ?? null,
      px: F(), py: F(), pz: F(), vx: F(), vy: F(), vz: F(), ax: F(), ay: F(), az: F(), ang: F(), spin: F(), life: F(), full: F(), sx: F(), sy: F(), sz: F(), seed: F() };
    b.arrays = [b.px, b.py, b.pz, b.vx, b.vy, b.vz, b.ax, b.ay, b.az, b.ang, b.spin, b.life, b.full, b.sx, b.sy, b.sz, b.seed];
    B[kind] = b;
  }
  const KINDS = Object.values(B), sv = new THREE.Vector3(), lerp = (r, k) => r[0] + (r[1] - r[0]) * k;
  // `n` pieces (fewer on a phone) thrown from p along `dir` (a unit vector), each leaning off it by up to `spread`
  // (1 is about 50 degrees), at 10 to 24 m/s plus `vel` (the ship's own), `size` times their usual size, in colour `hex`
  function toss(kind, p, dir, spread, vel, n, size = 1, hex = 0xffffff) {
    const b = B[kind], m = Math.max(1, Math.round(n * q)), F = b.fly;
    col.setHex(hex);
    for (let k = 0; k < m; k++) {
      let i;
      if (b.n < b.cap) i = b.n++;
      else { i = b.cursor; b.cursor = (b.cursor + 1) % b.cap; b.dropped++; }
      sv.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(spread * Math.random()).add(dir).normalize().multiplyScalar(10 + Math.random() * 14);
      b.px[i] = p.x; b.py[i] = p.y; b.pz[i] = p.z; b.vx[i] = sv.x + vel.x; b.vy[i] = sv.y + vel.y; b.vz[i] = sv.z + vel.z;
      sv.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      b.ax[i] = sv.x; b.ay[i] = sv.y; b.az[i] = sv.z; b.ang[i] = Math.random() * 6.28; b.spin[i] = lerp(F.spin, Math.random());
      b.life[i] = b.full[i] = lerp(F.life, Math.random());
      const s = F.size, a = lerp(s[0], Math.random()) * size;
      b.sx[i] = a; b.sy[i] = s[1] ? lerp(s[1], Math.random()) * size : a; b.sz[i] = s[2] ? lerp(s[2], Math.random()) * size : 1;
      b.seed[i] = Math.random() * 6.28;
      if (b.rgb) { b.rgb[i * 3] = col.r; b.rgb[i * 3 + 1] = col.g; b.rgb[i * 3 + 2] = col.b; }
      if (b.n > b.peak) b.peak = b.n;
    }
  }
  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), at = new THREE.Vector3(), axis = new THREE.Vector3(), sc = new THREE.Vector3();
  let time = 0;
  function update(dt) {
    time += dt;
    for (let k = 0; k < KINDS.length; k++) {
      const b = KINDS[k], F = b.fly, d = Math.max(0, 1 - dt * F.drag), canvas = b.kind === 'canvas', crystal = b.kind === 'crystal';
      for (let i = b.n - 1; i >= 0; i--) {
        if ((b.life[i] -= dt) <= 0) {
          const j = --b.n;
          if (i !== j) { for (let a = 0; a < b.arrays.length; a++) b.arrays[a][i] = b.arrays[a][j]; if (b.rgb) for (let c = 0; c < 3; c++) b.rgb[i * 3 + c] = b.rgb[j * 3 + c]; }
          continue;
        }
        b.vy[i] -= F.grav * dt; b.vx[i] *= d; b.vy[i] *= d; b.vz[i] *= d;
        b.px[i] += b.vx[i] * dt; b.py[i] += b.vy[i] * dt; b.pz[i] += b.vz[i] * dt; b.ang[i] += b.spin[i] * dt;
        if (canvas) { const w = Math.sin(time * 9 + b.seed[i]) * 1.5 * dt; b.px[i] += Math.cos(b.seed[i]) * w; b.pz[i] += Math.sin(b.seed[i]) * w; } // a scrap flutters
      }
      for (let i = 0; i < b.n; i++) {
        const fade = Math.min(1, b.life[i] / (canvas ? 0.5 : 0.3)); // shrinking away at the end
        at.set(b.px[i], b.py[i], b.pz[i]);
        qt.setFromAxisAngle(axis.set(b.ax[i], b.ay[i], b.az[i]), b.ang[i]);
        b.mesh.setMatrixAt(i, m4.compose(at, qt, sc.set(b.sx[i] * fade, b.sy[i] * fade, b.sz[i] * fade)));
        if (crystal && glowAt) glowAt(at, 1, 0.72, 0.34, (3 + 2.5 * ((time * 11 + b.seed[i]) % 1 > 0.5 ? 1 : 0)) * fade); // its glitter
      }
      b.mesh.count = b.n; b.mesh.visible = b.n > 0;
      upload(b.mesh.instanceMatrix, b.n); if (b.rgb) upload(b.mesh.instanceColor, b.n);
    }
  }
  function clear() { for (const b of KINDS) { b.n = 0; b.cursor = 0; b.mesh.count = 0; b.mesh.visible = false; } }
  // for tests: how many of each are in the air, their caps, the most seen, and how many were cut short for room
  const stats = () => ({ wood: B.wood.n, canvas: B.canvas.n, crystal: B.crystal.n, caps: { wood: B.wood.cap, canvas: B.canvas.cap, crystal: B.crystal.cap },
    peak: { wood: B.wood.peak, canvas: B.canvas.peak, crystal: B.crystal.peak }, dropped: B.wood.dropped + B.canvas.dropped + B.crystal.dropped });
  const resetStats = () => { for (const b of KINDS) { b.peak = b.n; b.dropped = 0; } };
  return { toss, update, clear, stats, resetStats, meshes: KINDS.map((b) => b.mesh) };
}

// Smoke (and fire) pouring off a ship as it's damaged: none above half hull, then more and darker. A raider going down
// is a wreck, and wrecks.js pours her smoke (a treasure ship that struck her colours smokes only from her damage)
const at = new THREE.Vector3(), drift = new THREE.Vector3(), rise = new THREE.Vector3();
export function smokeFrom(flyer, fx, dt) {
  const down = flyer.down && flyer.down.why !== 'struck';
  if (down && flyer.wreck) return;
  const f = flyer.frac('hull'), L = flyer.ship.recipe.length;
  const burning = down ? 1 : Math.max(0, (0.5 - f) * 2);
  if (burning <= 0) return;
  flyer.smokeClock = (flyer.smokeClock ?? 0) - dt;
  if (flyer.smokeClock > 0 || !fx.smoke.room()) return;
  flyer.smokeClock = (down ? 0.03 : 0.12 - burning * 0.07) / fx.q; // (a phone gets fewer, bigger-spaced puffs)
  const body = flyer.ship.body;
  at.set((Math.random() - 0.5) * L * 0.08, 0.6, (Math.random() - 0.4) * L * 0.5).applyMatrix4(body.matrixWorld);
  drift.copy(flyer.velocity).multiplyScalar(0.15); drift.x += (Math.random() - 0.5) * 2; drift.y += 2 + Math.random() * 2; drift.z += (Math.random() - 0.5) * 2;
  fx.smoke.emit(at, drift, 2.5 + burning * 3, L * 0.05 + 0.6, L * (0.22 + burning * 0.3) + 3, 0.6 - burning * 0.5, 0.3 + burning * 0.35);
  if (burning > 0.5 && Math.random() < burning) fx.spark(at, rise.copy(drift).setY(drift.y + 3), 0.6 + Math.random() * 0.5, 1.2 + L * 0.06, Math.random() < 0.5 ? 0xff7a2a : 0xffc04a);
}
