// world.js: Aethermoor to fly over. Chris's map (nine tiles, 5 m to a pixel, 23 km across) lies flat far below as the
// ground, the open sea runs on past its edges, a broken deck of cloud floats between, and big clouds drift at the
// ship's height. The sky is late afternoon with the sun low in the west. A wreck falling through the cloud deck tears
// a hole in it (tear), which closes again over a few seconds (update).
import * as THREE from 'three';
import tile1 from '../../assets/map/tile-1.avif';
import tile2 from '../../assets/map/tile-2.avif';
import tile3 from '../../assets/map/tile-3.avif';
import tile4 from '../../assets/map/tile-4.avif';
import tile5 from '../../assets/map/tile-5.avif';
import tile6 from '../../assets/map/tile-6.avif';
import tile7 from '../../assets/map/tile-7.avif';
import tile8 from '../../assets/map/tile-8.avif';
import tile9 from '../../assets/map/tile-9.avif';

export const MAP = { w: 23040, h: 15360, px: 5 }; // metres; x runs east, z runs south, the map's centre at the origin
export const SUN = new THREE.Vector3(-0.55, 0.52, 0.25).normalize();
export const CLOUD_Y = 430, THINNING = 2400;

// The regions, a 12 x 8 grid over the map read off Chris's painting (names from the Magpie page)
const GRID = ['sssswwsppppp', 'sssswwhppppp', 'swwwwhhppppp', 'swwwwhhppkks', 'sggwwhhkkkks', 'sggwwfhkkkks', 'sswfffkkkkss', 'ssssssssssss'];
const NAMES = { s: 'The Open Sea', w: 'The Verdant Wilds', g: 'The Gloamwood', f: 'The Gloomfen', h: 'The Hearthsea', p: 'The Ironspire Peaks', k: 'The Sunscorch Wastes' };
export function regionAt(x, z) {
  const c = Math.floor((x / MAP.w + 0.5) * 12), r = Math.floor((z / MAP.h + 0.5) * 8);
  if (c < 0 || c > 11 || r < 0 || r > 7) return NAMES.s;
  return NAMES[GRID[r][c]];
}

const SKY_GLSL = `
  vec3 skyColor(vec3 d, vec3 sun) {
    float h = d.y, s = max(dot(normalize(vec3(d.x, max(d.y, 0.0), d.z)), sun), 0.0);
    vec3 zen = vec3(0.13, 0.3, 0.66), mid = vec3(0.36, 0.58, 0.88), hor = vec3(0.84, 0.88, 0.93), warm = vec3(1.0, 0.86, 0.66);
    vec3 c = mix(hor, mid, smoothstep(0.0, 0.22, h));
    c = mix(c, zen, smoothstep(0.2, 0.9, h));
    c = mix(c, warm, pow(s, 5.0) * 0.55 * (1.0 - smoothstep(0.0, 0.5, h)));
    return c;
  }`;
export const HAZE = new THREE.Color(0xc9d6e6);

function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uSun: { value: SUN } },
    vertexShader: 'varying vec3 vDir; void main() { vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }',
    fragmentShader: `varying vec3 vDir; uniform vec3 uSun; ${SKY_GLSL}
      void main() { vec3 d = normalize(vDir); float s = max(dot(d, uSun), 0.0);
        vec3 c = skyColor(d, uSun) + vec3(1.0, 0.92, 0.75) * (pow(s, 120.0) * 0.9 + smoothstep(0.9993, 0.9996, s) * 4.0);
        c = mix(c, vec3(0.78, 0.84, 0.92), smoothstep(0.0, -0.2, d.y));
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), mat);
  m.scale.setScalar(50000); m.frustumCulled = false; m.renderOrder = -10;
  return m;
}

// cloud shadows on the ground, and the deck of cloud itself, share one pattern so the shadows line up. The pattern
// (two layers of soft noise, each five octaves deep) is worked out once, on the graphics card, into a picture that
// repeats every 16 units (about 35 km), so each pixel of the ground and the deck reads it from the picture instead of
// working it out again: the deck and the ground used to work it out four times for every pixel, the biggest cost on a
// phone. The picture keeps 16 bits in two channels, so cloud edges stay smooth.
const CLOUD_P = 16, CLOUD_N = 1024, HOLES = 3;
const CLOUD_GLSL = `
  uniform sampler2D uCloud;
  float cloudAt(vec2 uv) { return dot(texture2D(uCloud, uv).rg, vec2(255.0 * 256.0, 255.0) / 65535.0); }
  float cover(vec2 xz, float t) { vec2 p = xz * 0.00045 + vec2(t * 0.0022, t * 0.0009);
    return smoothstep(0.44, 0.64, cloudAt(p / ${CLOUD_P.toFixed(1)}) * 0.85 + cloudAt((p * 3.3 + 7.0) / ${CLOUD_P.toFixed(1)}) * 0.25); }`;
// the pattern itself: value noise, octaves 2.07 times finer each, on lattices that wrap round so the picture tiles
function makeCloudBake(renderer) {
  const target = new THREE.WebGLRenderTarget(CLOUD_N, CLOUD_N, { format: THREE.RGFormat, type: THREE.UnsignedByteType, depthBuffer: false,
    wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, magFilter: THREE.LinearFilter, minFilter: THREE.LinearMipmapLinearFilter, generateMipmaps: true });
  target.texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const cells = Array.from({ length: 5 }, (_, k) => Math.round(CLOUD_P * Math.pow(2.07, k)).toFixed(1));
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `varying vec2 vUv;
      // (shifted to a part of the lattice whose values spread evenly, so the sky is exactly as cloudy as before)
      float h2(vec2 p) { p += vec2(111.0, 113.0); vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      float n2(vec2 q, float n) { vec2 i = floor(q), f = fract(q); f = f * f * (3.0 - 2.0 * f);
        vec2 a = mod(i, n), b = mod(i + 1.0, n);
        return mix(mix(h2(a), h2(vec2(b.x, a.y)), f.x), mix(h2(vec2(a.x, b.y)), h2(b), f.x), f.y); }
      void main() {
        float N[5]; N[0] = ${cells[0]}; N[1] = ${cells[1]}; N[2] = ${cells[2]}; N[3] = ${cells[3]}; N[4] = ${cells[4]};
        float v = 0.0, a = 0.5;
        for (int k = 0; k < 5; k++) { v += a * n2(vUv * N[k] + 13.3 * float(k), N[k]); a *= 0.5; }
        float w = floor(clamp(v, 0.0, 1.0) * 65535.0 + 0.5), hi = floor(w / 256.0);
        gl_FragColor = vec4(hi / 255.0, (w - hi * 256.0) / 255.0, 0.0, 1.0);
      }`,
  }));
  quad.frustumCulled = false; scene.add(quad);
  // drawn at start-up, and again if the phone drops the drawing context (main.js)
  const bake = () => { const was = renderer.getRenderTarget(); renderer.setRenderTarget(target); renderer.render(scene, camera); renderer.setRenderTarget(was); };
  bake();
  return { target, texture: target.texture, bake };
}

function loadTexture(url, renderer) {
  return new Promise((res, rej) => new THREE.TextureLoader().load(url, (t) => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; res(t);
  }, undefined, rej));
}

export async function makeWorld(renderer) {
  const group = new THREE.Group();
  const time = { value: 0 };
  group.add(makeSky());

  // the map: nine tiles, each 7.68 x 5.12 km, painted colours kept as Chris painted them, with cloud shadows passing over
  const urls = [tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9];
  const textures = await Promise.all(urls.map((u) => loadTexture(u, renderer)));
  const tw = MAP.w / 3, th = MAP.h / 3;
  const clouds = makeCloudBake(renderer), uCloud = { value: clouds.texture };
  const shade = (mat) => {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = time; sh.uniforms.uSun = { value: SUN }; sh.uniforms.uCloud = uCloud;
      sh.vertexShader = 'varying vec3 vWorld;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vWorld;\nuniform float uTime;\nuniform vec3 uSun;\n' + CLOUD_GLSL + '\n' + sh.fragmentShader.replace('#include <map_fragment>',
        '#include <map_fragment>\nvec2 sp = vWorld.xz - uSun.xz / uSun.y * ' + CLOUD_Y.toFixed(1) + ';\ndiffuseColor.rgb *= 1.0 - 0.38 * cover(sp, uTime);');
    };
    mat.customProgramCacheKey = () => 'ground-cloud-shadow-2';
    return mat;
  };
  textures.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(tw, th).rotateX(-Math.PI / 2), shade(new THREE.MeshBasicMaterial({ map: t, toneMapped: false })));
    m.position.set(-MAP.w / 2 + tw * (col + 0.5), 0, -MAP.h / 2 + th * (row + 0.5));
    group.add(m);
  });
  // the open sea past the map's edges, the same deep blue as its painted sea. It's drawn first and the map over it:
  // laid just under the map instead, the two would flicker where the far ground is too far off to tell them apart
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000).rotateX(-Math.PI / 2), shade(new THREE.MeshBasicMaterial({ color: 0x0a3b80, toneMapped: false, depthWrite: false })));
  sea.renderOrder = -5; group.add(sea);

  // the deck of cloud: white and gold-edged from above, grey from beneath, gaps where the ground shows through, and the
  // holes torn by wrecks falling through it (x, z, how wide, how open: 0 is closed, and then it costs nothing)
  const holes = Array.from({ length: HOLES }, () => new THREE.Vector4(0, 0, 1, 0)), torn = holes.map(() => ({ r: 1, age: 9 }));
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
    uniforms: { uTime: time, uSun: { value: SUN }, uCloud, uHoles: { value: holes } },
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `varying vec3 vW; uniform float uTime; uniform vec3 uSun; uniform vec4 uHoles[${HOLES}]; ${SKY_GLSL} ${CLOUD_GLSL}
      void main() {
        float c = cover(vW.xz, uTime);
        for (int i = 0; i < ${HOLES}; i++) { vec4 h = uHoles[i]; if (h.w > 0.0) c *= 1.0 - h.w * (1.0 - smoothstep(h.z * 0.4, h.z, length(vW.xz - h.xy))); }
        float lit = cover(vW.xz + uSun.xz * 160.0, uTime);
        vec3 top = mix(vec3(1.0, 0.97, 0.92), vec3(0.74, 0.77, 0.86), lit * 0.6) ;
        vec3 under = vec3(0.62, 0.65, 0.72);
        vec3 col = cameraPosition.y > vW.y ? top : under;
        vec3 toCam = vW - cameraPosition; float d = length(toCam);
        vec3 haze = skyColor(normalize(vec3(toCam.x, 0.0, toCam.z)), uSun);
        float fade = smoothstep(9000.0, 38000.0, d);
        col = mix(col, haze, fade);
        gl_FragColor = vec4(col, c * 0.94 * (1.0 - fade * 0.25));
        #include <colorspace_fragment>
      }`,
  }));
  deck.position.y = CLOUD_Y; deck.renderOrder = 1; group.add(deck);

  // big drifting clouds at the ship's height, kept round the ship as it flies
  const puffs = makePuffs();
  group.add(puffs.mesh);

  // a hole torn in the deck at (x, z), `r` metres across at its widest: it opens in a moment, holds, and closes over
  // about five seconds (the oldest is reused for a fourth)
  function tear(x, z, r) {
    let k = 0;
    for (let i = 1; i < HOLES; i++) if (torn[i].age > torn[k].age) k = i;
    holes[k].set(x, z, r * 0.5, 0); torn[k].r = r; torn[k].age = 0;
  }
  function update(dt) {
    for (let i = 0; i < HOLES; i++) {
      const t = (torn[i].age += dt), h = holes[i];
      h.w = t < 0.25 ? t / 0.25 : Math.min(1, Math.max(0, 1 - (t - 1.5) / 5));
      h.z = torn[i].r * (0.5 + 0.5 * Math.min(1, t / 0.8));
    }
  }
  // a fresh voyage (or back to port): every hole closed at once, so none is left open from the last fight
  function clear() { for (let i = 0; i < HOLES; i++) { holes[i].w = 0; torn[i].age = 9; } }
  return { group, time, puffs, deck, clouds, tear, update, clear, holes };
}

// A soft cumulus picture drawn once, and instanced billboards of it
function cloudTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 26; i++) {
    const x = 60 + rnd() * 136, y = 92 + rnd() * 90 - (i < 8 ? 30 : 0), r = 28 + rnd() * 44;
    const grd = g.createRadialGradient(x, y - r * 0.2, r * 0.1, x, y, r);
    const shade = 225 + Math.round(rnd() * 30);
    grd.addColorStop(0, `rgba(${shade},${shade},${Math.min(255, shade + 8)},0.85)`); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function makePuffs() {
  const N = 110, SPAN = 14000;
  const geo = new THREE.PlaneGeometry(1, 1);
  const offs = new Float32Array(N * 3), sizes = new Float32Array(N);
  let seed = 9; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < N; i++) { offs.set([rnd() * SPAN, 520 + rnd() * 1500, rnd() * SPAN], i * 3); sizes[i] = 260 + rnd() * 520; }
  geo.setAttribute('offset', new THREE.InstancedBufferAttribute(offs, 3));
  geo.setAttribute('size', new THREE.InstancedBufferAttribute(sizes, 1));
  const ig = new THREE.InstancedBufferGeometry().copy(geo); ig.instanceCount = N;
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, fog: false,
    uniforms: { uMap: { value: cloudTexture() }, uCenter: { value: new THREE.Vector3() }, uSpan: { value: SPAN }, uSun: { value: SUN } },
    vertexShader: `attribute vec3 offset; attribute float size; uniform vec3 uCenter; uniform float uSpan; varying vec2 vUv; varying float vFade;
      void main() {
        vec3 p = offset; p.xz = uCenter.xz + mod(offset.xz - uCenter.xz + uSpan * 0.5, uSpan) - uSpan * 0.5;
        vec4 mv = viewMatrix * vec4(p, 1.0);
        mv.xy += position.xy * vec2(size * 1.6, size);
        float d = length(p.xz - uCenter.xz);
        vFade = 1.0 - smoothstep(uSpan * 0.32, uSpan * 0.5, d);
        vFade *= smoothstep(60.0, 260.0, -mv.z);
        vUv = uv; gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform sampler2D uMap; varying vec2 vUv; varying float vFade;
      void main() { vec4 c = texture2D(uMap, vUv); c.rgb *= mix(0.82, 1.06, vUv.y); c.a *= vFade * 0.9; if (c.a < 0.01) discard; gl_FragColor = c;
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(ig, mat);
  mesh.frustumCulled = false; mesh.renderOrder = 2;
  return { mesh, follow: (p) => mat.uniforms.uCenter.value.copy(p) };
}
