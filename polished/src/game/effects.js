// effects.js: smoke. The white gunsmoke that billows from every port as a broadside goes off, the smoke from damaged
// ships, thickening and darkening as the hull goes, and the black trail of a ship going down. One batch of soft round
// puffs for the whole sky (fire and sparks are fx.js's glows).
// The puffs live in plain number arrays, a fixed number of them made once, so a phone never has to clear away
// thousands of little objects mid-fight: a puff that burns out is swapped for the last one, and when every puff is in
// use the oldest-placed is reused (and counted, as `dropped`).
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
  return { emit, update, clear, max, get count() { return n; }, get dropped() { return dropped; } };
}

// Smoke (and fire) pouring off a ship as it's damaged: none above half hull, then more and darker
const at = new THREE.Vector3(), drift = new THREE.Vector3(), rise = new THREE.Vector3();
export function smokeFrom(flyer, fx, dt) {
  const f = flyer.frac('hull'), L = flyer.ship.recipe.length;
  const burning = flyer.down ? 1 : Math.max(0, (0.5 - f) * 2);
  if (burning <= 0) return;
  flyer.smokeClock = (flyer.smokeClock ?? 0) - dt;
  if (flyer.smokeClock > 0) return;
  flyer.smokeClock = (flyer.down ? 0.03 : 0.12 - burning * 0.07) / fx.q; // (a phone gets fewer, bigger-spaced puffs)
  const body = flyer.ship.body;
  at.set((Math.random() - 0.5) * L * 0.08, 0.6, (Math.random() - 0.4) * L * 0.5).applyMatrix4(body.matrixWorld);
  drift.copy(flyer.velocity).multiplyScalar(0.15); drift.x += (Math.random() - 0.5) * 2; drift.y += 2 + Math.random() * 2; drift.z += (Math.random() - 0.5) * 2;
  fx.smoke.emit(at, drift, 2.5 + burning * 3, L * 0.05 + 0.6, L * (0.22 + burning * 0.3) + 3, 0.6 - burning * 0.5, 0.3 + burning * 0.35);
  if (burning > 0.5 && Math.random() < burning) fx.spark(at, rise.copy(drift).setY(drift.y + 3), 0.6 + Math.random() * 0.5, 1.2 + L * 0.06, Math.random() < 0.5 ? 0xff7a2a : 0xffc04a);
}
