// guns.js: a ship's guns as the game sees them. Every gun fires from where it really sits on the model, in the
// direction it really points, and only tilts a little; the camera's direction picks which battery fires (bow,
// port broadside, starboard broadside or stern), and the shots are glowing crystal bolts that take time to fly.
import * as THREE from 'three';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
// Long-focus chasers are fast, light and accurate; short-focus broadsides are heavy, slower and spread a little
export const KINDS = {
  chaser: { speed: 430, damage: 28, reload: 1.1, yaw: 0.62, pitch: 0.26, spread: 0.002, life: 3.2, size: 1 },
  broadside: { speed: 320, damage: 55, reload: 2.6, yaw: 0.75, pitch: 0.16, spread: 0.012, life: 2.6, size: 1.35 },
};

// Where each gun's muzzle is on a built ship (its own frame), and which way it points
export function gunsOf(ship) {
  const R = ship.recipe, hull = ship.hull, B = { bow: [], stern: [], port: [], starboard: [] };
  for (const g of R.bowGuns ?? []) B.bow.push({ p: V(g.x, g.y, g.z + g.len + 0.35), d: V(0, 0, 1), kind: 'chaser' });
  for (const g of R.swivels ?? []) { const sx = Math.sign(g.x); (sx > 0 ? B.port : B.starboard).push({ p: V(g.x + sx * (g.len + 0.3), g.y + R.rail.h * 0.9, g.z), d: V(sx, 0, 0), kind: 'chaser' }); }
  for (const g of R.sternGuns ?? []) {
    const z = g.port ? hull.zs + 0.3 - g.len - 0.15 : g.z - g.len - 0.15;
    B.stern.push({ p: V(g.x, g.y, z), d: V(0, 0, -1), kind: 'chaser' });
  }
  if (R.ports) for (const side of [1, -1]) for (const z of R.ports.z) {
    const t = hull.tAt(z, R.ports.y), p = hull.at(z, t, side), n = hull.normal(z, t, side);
    // the guns sit level in their ports, pointing straight out from the side (the hull itself curves away below)
    (side > 0 ? B.port : B.starboard).push({ p: V(...p).addScaledVector(n, 0.75 * R.ports.h), d: n.clone().setY(0).normalize(), kind: 'broadside' });
  }
  return B;
}

// Which battery faces a direction, given the angle between it and the bow (radians, + towards port)
export function batteryFor(rel) {
  const a = Math.atan2(Math.sin(rel), Math.cos(rel));
  if (Math.abs(a) < 0.87) return 'bow';
  if (Math.abs(a) > 2.27) return 'stern';
  return a > 0 ? 'port' : 'starboard';
}
export const BATTERY_NAMES = { bow: 'Bow guns', stern: 'Stern guns', port: 'Port broadside', starboard: 'Starboard broadside' };

// Turn `want` towards `axis` until it's inside the gun's swing (yaw) and tilt (pitch), measured in the gun's own frame
export function clampToArc(want, axis, yawMax, pitchMax) {
  const f = axis.clone().setY(0).normalize(), side = new THREE.Vector3(-f.z, 0, f.x); // side: f turned a quarter
  const h = want.clone().setY(0);
  const yaw = Math.max(-yawMax, Math.min(yawMax, Math.atan2(h.dot(side), h.dot(f))));
  const base = Math.atan2(axis.y, Math.hypot(axis.x, axis.z));
  const pitch = base + Math.max(-pitchMax, Math.min(pitchMax, Math.atan2(want.y, Math.hypot(want.x, want.z)) - base));
  const horiz = f.multiplyScalar(Math.cos(yaw)).addScaledVector(side, Math.sin(yaw));
  return horiz.multiplyScalar(Math.cos(pitch)).setY(Math.sin(pitch)).normalize();
}

// All the bolts in flight, for every ship, drawn as one batch of glowing streaks
export function makeBolts(scene, max = 320) {
  const geo = new THREE.CylinderGeometry(0.22, 0.22, 1, 6, 1, true).rotateX(Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const mesh = new THREE.InstancedMesh(geo, mat, max);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; mesh.count = 0;
  scene.add(mesh);
  // glows: the bolts' heads, muzzle flashes and bursts, in one batch of soft points
  const GMAX = 900, gpos = new Float32Array(GMAX * 3), gcol = new Float32Array(GMAX * 3), gsize = new Float32Array(GMAX);
  const ggeo = new THREE.BufferGeometry();
  ggeo.setAttribute('position', new THREE.BufferAttribute(gpos, 3).setUsage(THREE.DynamicDrawUsage));
  ggeo.setAttribute('color', new THREE.BufferAttribute(gcol, 3).setUsage(THREE.DynamicDrawUsage));
  ggeo.setAttribute('size', new THREE.BufferAttribute(gsize, 1).setUsage(THREE.DynamicDrawUsage));
  const gmat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: 500 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float size; varying vec3 vC; uniform float uScale; void main() { vC = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(size * uScale / -mv.z, 420.0); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vC; void main() { float r = length(gl_PointCoord - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - r), 2.0); if (a < 0.01) discard; gl_FragColor = vec4(vC * a, a); }',
    vertexColors: true,
  });
  const glows = new THREE.Points(ggeo, gmat); glows.frustumCulled = false; glows.renderOrder = 4; scene.add(glows);

  const bolts = [], sparks = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), FWD = V(0, 0, 1);
  const spark = (p, v, life, size, color) => { if (sparks.length < GMAX - max) sparks.push({ p: p.clone(), v: v.clone(), life, max: life, size, c: new THREE.Color(color) }); };
  function fire(from, dir, kind, owner, inherit) {
    if (bolts.length >= max) return;
    const K = KINDS[kind];
    const d = dir.clone().add(V((Math.random() - 0.5) * K.spread * 2, (Math.random() - 0.5) * K.spread * 2, (Math.random() - 0.5) * K.spread * 2)).normalize();
    bolts.push({ p: from.clone(), prev: from.clone(), v: d.multiplyScalar(K.speed).add(inherit ?? V(0, 0, 0)), life: K.life, K, owner });
    spark(from, inherit ?? V(0, 0, 0), 0.18, 9 * K.size, 0xffd27a);
    for (let i = 0; i < 4; i++) spark(from, d.clone().multiplyScalar(K.speed * 0.04).add(V((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6)), 0.5, 2.2, 0xff9a3a);
  }
  function burst(p, color = 0xffc070, n = 26, power = 1) {
    spark(p, V(0, 0, 0), 0.5, 30 * power, color);
    for (let i = 0; i < n; i++) spark(p, V(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize().multiplyScalar(20 + Math.random() * 40 * power), 0.6 + Math.random() * 0.8, 2.5 + Math.random() * 3, i % 3 ? color : 0xffffff);
  }
  // move everything; `hit(bolt, a, b)` is asked for each bolt's path this frame and returns true when it hit something
  function update(dt, hit, camera) {
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i];
      b.prev.copy(b.p); b.v.y -= 9.8 * dt * 0.15; b.p.addScaledVector(b.v, dt); b.life -= dt;
      if (b.life <= 0 || b.p.y < 0) { bolts.splice(i, 1); continue; }
      if (hit(b, b.prev, b.p)) { burst(b.p); bolts.splice(i, 1); }
    }
    for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.life -= dt; if (s.life <= 0) { sparks.splice(i, 1); continue; } s.p.addScaledVector(s.v, dt); s.v.multiplyScalar(1 - dt * 1.5); }
    bolts.forEach((b, i) => {
      const len = Math.min(14, b.v.length() * 0.03) * b.K.size;
      q.setFromUnitVectors(FWD, sc.copy(b.v).normalize());
      m4.compose(b.p.clone().addScaledVector(sc, -len / 2), q, V(b.K.size, b.K.size, len));
      mesh.setMatrixAt(i, m4);
    });
    mesh.count = bolts.length; mesh.instanceMatrix.needsUpdate = true;
    let n = 0;
    const put = (p, c, size) => { gpos.set([p.x, p.y, p.z], n * 3); gcol.set([c.r, c.g, c.b], n * 3); gsize[n] = size; n++; };
    const head = new THREE.Color(0xffc46a);
    for (const b of bolts) put(b.p, head, 4.5 * b.K.size);
    for (const s of sparks) { const k = s.life / s.max; put(s.p, s.c.clone().multiplyScalar(k), s.size * (0.6 + 0.4 * k)); }
    ggeo.setDrawRange(0, n);
    ggeo.attributes.position.needsUpdate = ggeo.attributes.color.needsUpdate = ggeo.attributes.size.needsUpdate = true;
    if (camera) gmat.uniforms.uScale.value = camera.userData.pixelScale ?? 500;
  }
  return { fire, update, burst, bolts };
}

// A ship's gunnery: reload clocks per battery, and firing the battery that faces the aim point
export function makeGunnery(ship) {
  const B = gunsOf(ship), ready = { bow: 0, stern: 0, port: 0, starboard: 0 };
  const world = new THREE.Vector3(), dirW = new THREE.Vector3(), nm = new THREE.Matrix3();
  return {
    B, ready,
    count: (b) => B[b].length,
    reload: (b) => (B[b][0] ? KINDS[B[b][0].kind].reload : 1),
    update(dt) { for (const k in ready) ready[k] = Math.max(0, ready[k] - dt); },
    // fire battery b at the aim point (world); returns how many guns fired
    fire(b, aim, bolts, owner, inherit) {
      if (ready[b] > 0 || !B[b].length) return 0;
      ship.root.updateWorldMatrix(true, true); // where the ship is now, not where it was last drawn
      nm.getNormalMatrix(ship.body.matrixWorld);
      for (const g of B[b]) {
        world.copy(g.p).applyMatrix4(ship.body.matrixWorld);
        dirW.copy(g.d).applyMatrix3(nm).normalize();
        const K = KINDS[g.kind], want = aim.clone().sub(world).normalize();
        bolts.fire(world, clampToArc(want, dirW, K.yaw, K.pitch), g.kind, owner, inherit);
      }
      ready[b] = KINDS[B[b][0].kind].reload;
      return B[b].length;
    },
  };
}
