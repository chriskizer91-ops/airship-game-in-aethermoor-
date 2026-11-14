// finish.js: the shipwright's finish (stage 5), the same on every ship, in the game and in the ships demo. Three things,
// none of which adds a triangle or a draw call:
//   shade    how much of the sky each corner of the model can see, worked out once as she's built (bakeShade): the
//            creases under her rails, round her crystal towers, behind her bands and inside her gun ports are darker,
//            as they are in Chris's pictures. It's kept on the model (`occ`: 0 open sky, 1 shut in), so it costs nothing
//            a frame
//   timber   her planks, deck boards and spars: each board its own tone, streaked along its grain, grimy low down and
//            in the creases, so the small painted tile no longer repeats along her
//   metal    her brass and bronze: worn bright where it's open, tarnished dull and dark in the creases
//   cloth    her sails: the sun shines through the canvas when it's behind it, and the cloth is shaded towards her
//            mast, so her sails read as cloth from above (where the game looks from) and not as white card
// The shader pieces are added to three.js's own (finish), after dress.js's, by the material's kind (FINISH, by her
// meshes' names): a material keeps its kind in userData.finish, so copies (liveries, a ship's own) get the same.
import * as THREE from 'three';

// which finish each of a ship's materials gets, by its name (materials.js M)
export const FINISH = { hull: 'timber', deck: 'deck', wood: 'spar', plates: 'iron', band: 'band', brass: 'metal', bronze: 'metal', rigMetal: 'metal',
  canvas: 'cloth', rope: 'plain', dark: 'plain', parts: 'lit', crew: 'plain' };

// a smooth noise in 3D (its own names: dress.js has one too, in the shaders that show scars)
const NOISE = `
float fH(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float fN(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(fH(i), fH(i + vec3(1.0, 0.0, 0.0)), f.x), mix(fH(i + vec3(0.0, 1.0, 0.0)), fH(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(fH(i + vec3(0.0, 0.0, 1.0)), fH(i + vec3(1.0, 0.0, 1.0)), f.x), mix(fH(i + vec3(0.0, 1.0, 1.0)), fH(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }
`;
// what each kind does to the painted colour (after map_fragment; fTone and fDirt are read again below). vFin: where
// the pixel is on her (her own frame, as built) and, in w, how open it is to the sky (1 open, 0 shut in); vFinN: her
// own up, as the surface faces
const COLOUR = {
  // planks: long streaks fore and aft, one board to the next; finer grain; bilge grime under her and in the creases
  timber: `
    float fS = fN(vec3(vFin.z * 0.31, vFin.y * 3.4 + vFin.x * 0.9, vFin.x * 1.7));
    float fG = fN(vec3(vFin.z * 2.6, vFin.y * 11.0, vFin.x * 6.0 + 7.0));
    fTone = 0.8 + 0.46 * fS + 0.14 * (fG - 0.5);
    fDirt = max(1.0 - smoothstep(0.1, 0.7, vFin.w), 0.45 * (1.0 - smoothstep(-0.9, 0.0, vFinN)));
    diffuseColor.rgb *= fTone * mix(vec3(1.0), vec3(0.5, 0.44, 0.42), fDirt);`,
  // deck boards: run fore and aft, scrubbed pale down the middle where the crew walk, darker by the rails and fittings
  deck: `
    float fS = fN(vec3(vFin.z * 0.27, vFin.x * 4.3, 3.0));
    float fG = fN(vec3(vFin.z * 2.2, vFin.x * 13.0, 9.0));
    fTone = 0.84 + 0.32 * fS + 0.12 * (fG - 0.5);
    fDirt = 1.0 - smoothstep(0.1, 0.75, vFin.w);
    diffuseColor.rgb *= fTone * mix(vec3(1.0), vec3(0.5, 0.42, 0.38), fDirt);`,
  // spars, stairs, crates: a little grain, darker in the creases
  spar: `
    fTone = 0.86 + 0.26 * fN(vFin.xyz * vec3(2.3, 0.7, 2.3) + 5.0);
    fDirt = 1.0 - smoothstep(0.1, 0.7, vFin.w);
    diffuseColor.rgb *= fTone * mix(vec3(1.0), vec3(0.55, 0.47, 0.42), fDirt);`,
  // the Man-o'-war's iron plates: each a little different, streaked with rust below her bands
  iron: `
    float fS = fN(vec3(vFin.z * 0.45, vFin.y * 1.9 + vFin.x * 0.6, vFin.x * 1.1));
    float fG = fN(vec3(vFin.z * 3.1, vFin.y * 1.3, vFin.x * 3.1 + 4.0));
    fTone = 0.8 + 0.34 * fS;
    fDirt = max(1.0 - smoothstep(0.1, 0.7, vFin.w), 0.4 * (1.0 - smoothstep(-0.9, 0.0, vFinN)));
    diffuseColor.rgb *= fTone * mix(vec3(1.0), vec3(0.55, 0.5, 0.5), fDirt);
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.5, 0.82, 0.52), 0.55 * smoothstep(0.58, 0.82, fG) * (0.4 + 0.6 * fS));`,
  // the painted brass bands: only darker in the creases
  band: `
    fDirt = 1.0 - smoothstep(0.2, 0.85, vFin.w);
    diffuseColor.rgb *= mix(vec3(1.0), vec3(0.5, 0.42, 0.34), fDirt);`,
  // brass and bronze: worn brighter in patches, tarnished brown and dull in the creases
  metal: `
    float fS = fN(vFin.xyz * 2.7) * 0.6 + fN(vFin.xyz * 9.5 + 3.0) * 0.4;
    fTone = 0.84 + 0.3 * fS;
    fDirt = 1.0 - smoothstep(0.15, 0.75, vFin.w);
    diffuseColor.rgb *= fTone * mix(vec3(1.0), vec3(0.45, 0.35, 0.25), fDirt);`,
  // canvas: shaded towards the mast and the yard (where the cloth gathers), a faint weave of lighter and darker cloth
  cloth: `
    fTone = 0.9 + 0.14 * fN(vFin.xyz * vec3(1.6, 5.0, 1.6));
    diffuseColor.rgb *= fTone * (0.8 + 0.2 * smoothstep(0.0, 0.5, vBelly));`,
  plain: `
    fDirt = 1.0 - smoothstep(0.2, 0.85, vFin.w);
    diffuseColor.rgb *= mix(vec3(1.0), vec3(0.55), fDirt);`,
  lit: '',
};
// dull where it's dirty (after roughnessmap_fragment and metalnessmap_fragment)
const ROUGH = { metal: 'roughnessFactor = clamp(roughnessFactor + (fTone - 1.0) * -0.5 + 0.5 * fDirt, 0.12, 1.0);', band: 'roughnessFactor = mix(roughnessFactor, 0.9, 0.7 * fDirt);',
  iron: 'roughnessFactor = clamp(roughnessFactor + 0.3 * fDirt - (fTone - 1.0) * 0.4, 0.2, 1.0);' };
const METAL = { metal: 'metalnessFactor *= 1.0 - 0.35 * fDirt;', band: 'metalnessFactor *= 1.0 - 0.4 * fDirt;' };
// the painted colour that glows a little by itself (materials.js: so a ship is never black in shadow) is shaded too
const GLOW = { timber: 1, deck: 1, spar: 1, iron: 1, band: 1, cloth: 1 };
// the light: the sky's (and the brass's reflections of it) by how much sky she sees; the sun's a little too, so a
// crease reads in full sun as it does in Chris's pictures
const LIGHT = `
  reflectedLight.indirectDiffuse *= vFin.w;
  reflectedLight.indirectSpecular *= 0.25 + 0.75 * vFin.w;
  reflectedLight.directDiffuse *= 0.6 + 0.4 * vFin.w;
  reflectedLight.directSpecular *= 0.5 + 0.5 * vFin.w;`;
// canvas lets the sun through: lit from behind, a sail glows warm
const THROUGH = `
  #if NUM_DIR_LIGHTS > 0
  for (int fi = 0; fi < NUM_DIR_LIGHTS; fi++) {
    float fBack = max(0.0, -dot(normal, directionalLights[fi].direction));
    reflectedLight.directDiffuse += directionalLights[fi].color * fBack * RECIPROCAL_PI * diffuseColor.rgb * vec3(0.62, 0.5, 0.36);
  }
  #endif`;

const after = (src, chunk, add) => src.replace(`#include <${chunk}>`, `#include <${chunk}>\n${add}`);

// Add the finish to a material's shader as three.js builds it (in onBeforeCompile, after any other edits: the colour
// goes in before a ship's scars, so soot and holes are drawn over it)
export function finish(sh, kind) {
  const cloth = kind === 'cloth';
  // (the sail's belly: 0 at its edges, 1 in its middle; dress.js declares the attribute for a ship's own sails, the
  // shared canvas does in materials.js)
  sh.vertexShader = `attribute float occ;\nvarying vec4 vFin;\nvarying float vFinN;\n${cloth ? 'varying float vBelly;\n' : ''}` + after(sh.vertexShader, 'begin_vertex', `vFin = vec4(position, 1.0 - occ); vFinN = normal.y;${cloth ? ' vBelly = billow;' : ''}`);
  let f = sh.fragmentShader;
  f = after(f, 'map_fragment', `float fTone = 1.0, fDirt = 0.0;\n{${COLOUR[kind] ?? ''}\n}`);
  if (ROUGH[kind]) f = after(f, 'roughnessmap_fragment', ROUGH[kind]);
  if (METAL[kind]) f = after(f, 'metalnessmap_fragment', METAL[kind]);
  if (GLOW[kind]) f = after(f, 'emissivemap_fragment', 'totalEmissiveRadiance *= fTone * (0.35 + 0.65 * vFin.w);');
  f = after(f, 'aomap_fragment', LIGHT + (cloth ? THROUGH : ''));
  sh.fragmentShader = `varying vec4 vFin;\nvarying float vFinN;\n${cloth ? 'varying float vBelly;\n' : ''}${NOISE}` + f;
}

// Give a material its finish: its kind is kept on it (userData.finish, which a copy keeps), and it's added after
// whatever else is done to the material's shader (`compile`, with its `key`: the material's own unless given, as a
// ship's own copy is: dress.js). A copy made with clone() loses what's done to its shader: give it the original's
// (sameFinish)
export function withFinish(m, kind = m.userData.finish, compile = Object.hasOwn(m, 'onBeforeCompile') ? m.onBeforeCompile : null, key = Object.hasOwn(m, 'customProgramCacheKey') ? m.customProgramCacheKey : null) {
  if (kind) m.userData.finish = kind;
  if (!kind && !compile) return m;
  m.onBeforeCompile = function (sh, renderer) { compile?.call(this, sh, renderer); if (kind) finish(sh, kind); };
  m.customProgramCacheKey = function () { return `${key?.call(this) ?? ''}|finish-${kind ?? 'none'}`; };
  return m;
}
export function sameFinish(copy, m) {
  if (Object.hasOwn(m, 'onBeforeCompile')) copy.onBeforeCompile = m.onBeforeCompile;
  if (Object.hasOwn(m, 'customProgramCacheKey')) copy.customProgramCacheKey = m.customProgramCacheKey;
  return copy;
}

// ---------- the shade, worked out once as a ship is built ----------
// The model is looked at from DIRS directions all round (each a small picture of how far away her surface is, drawn
// side by side into one sheet); a corner is shut in from a direction if something of hers is nearer than it. Its shade
// is the share of the light it would get from all round (more from straight out than from the side: the cosine) that's
// shut out.
// It's all done on the graphics card, and stays there: the pictures are drawn, then every corner of the model is run
// through a small program that looks itself up in them and writes its shade straight into the buffer the model is drawn
// with (WebGL's transform feedback; three.js has no word for it, so this part speaks to WebGL itself, and puts
// three.js's own state back after). Nothing is read back to the page, so building a ship never waits on the graphics
// card: on a phone it's a few thousandths of a second of the page's time.
// Thin things (canvas, ropes, pennants) and things that glow (crystals, the painted lamps) shut nothing in; and canvas,
// pennants and crystals aren't shaded.
const NO_SHADOW = new Set(['canvas', 'rope', 'flag', 'parts', 'gem', 'crystal', 'shade']), NO_SHADE = new Set(['canvas', 'flag', 'gem', 'crystal', 'shade']);
// how many directions and how many pixels across each picture, at each level of detail (a far model isn't shaded: it's
// a few pixels on the screen)
export const SHADE = { full: { dirs: 30, size: 320 }, middle: { dirs: 16, size: 192 }, far: null };
const MOST = 32; // (the most directions the program looks in)
const depthMat = new THREE.ShaderMaterial({
  uniforms: { uNear: { value: 0 }, uFar: { value: 1 } },
  vertexShader: 'uniform float uNear; uniform float uFar; varying float vD; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vD = (-mv.z - uNear) / (uFar - uNear); gl_Position = projectionMatrix * mv; }',
  fragmentShader: 'varying float vD; void main() { float d = clamp(vD, 0.0, 1.0) * 65535.0, hi = floor(d / 256.0); gl_FragColor = vec4(hi / 255.0, (d - hi * 256.0) / 255.0, 0.0, 1.0); }',
  side: THREE.DoubleSide,
});
// each corner: lifted a little off its surface, then looked for in each picture it faces (a surface seen at a slant
// is at many depths within one pixel of a picture: more is allowed for the more it slants)
const SHADE_VERT = `#version 300 es
precision highp float; precision highp int;
in vec3 position; in vec3 normal;
uniform mat4 uModel; uniform mat3 uTurn; uniform vec3 uMiddle;
uniform float uR, uTexel, uLift, uNear, uSpan, uSize; uniform int uCount;
uniform vec3 uRight[${MOST}]; uniform vec3 uUp[${MOST}]; uniform vec3 uDir[${MOST}]; uniform vec2 uCell[${MOST}];
uniform highp sampler2D uSheet;
out float vOcc;
void main() {
  vec3 n = normalize(uTurn * normal), q = (uModel * vec4(position, 1.0)).xyz + n * uLift - uMiddle;
  float sum = 0.0, shut = 0.0, hs = uSize * 0.5;
  for (int k = 0; k < ${MOST}; k++) {
    if (k >= uCount) break;
    float w = dot(n, uDir[k]);
    if (w <= 0.02) continue;
    sum += w;
    float u = floor(dot(q, uRight[k]) / uTexel + hs), v = floor(dot(q, uUp[k]) / uTexel + hs);
    if (u < 0.0 || v < 0.0 || u >= uSize || v >= uSize) continue;
    vec4 t = texelFetch(uSheet, ivec2(uCell[k]) + ivec2(int(u), int(v)), 0);
    float seen = uNear + (floor(t.r * 255.0 + 0.5) * 256.0 + floor(t.g * 255.0 + 0.5)) * uSpan;
    if (seen < uR * 1.5 - dot(q, uDir[k]) - uTexel * (1.0 + 0.7 * min(4.0, sqrt(max(0.0, 1.0 - w * w)) / w))) shut += w;
  }
  vOcc = sum > 0.0 ? shut / sum : 0.0;
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0); gl_PointSize = 1.0;
}`;
const SHADE_FRAG = '#version 300 es\nprecision lowp float; out vec4 o; void main() { o = vec4(0.0); }';
// the program, made once for each drawing context (and again if the context was lost)
const programs = new WeakMap();
function programFor(gl) {
  let P = programs.get(gl);
  if (P && gl.isProgram(P.program)) return P;
  const make = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
  const program = gl.createProgram(), vs = make(gl.VERTEX_SHADER, SHADE_VERT), fs = make(gl.FRAGMENT_SHADER, SHADE_FRAG);
  gl.attachShader(program, vs); gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, 'position'); gl.bindAttribLocation(program, 1, 'normal');
  gl.transformFeedbackVaryings(program, ['vOcc'], gl.SEPARATE_ATTRIBS);
  gl.linkProgram(program);
  const ok = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!ok) console.warn('the ships\' shade could not be worked out here:', gl.getProgramInfoLog(program) || gl.getShaderInfoLog(vs));
  gl.deleteShader(vs); gl.deleteShader(fs);
  const U = {};
  if (ok) for (const n of ['uModel', 'uTurn', 'uMiddle', 'uR', 'uTexel', 'uLift', 'uNear', 'uSpan', 'uSize', 'uCount', 'uRight', 'uUp', 'uDir', 'uCell', 'uSheet']) U[n] = gl.getUniformLocation(program, n);
  P = { program: ok ? program : null, U }; programs.set(gl, P);
  return P;
}
// directions spread evenly all round (a spiral over the sphere)
function directions(n) {
  const out = [], ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) { const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y); out.push(new THREE.Vector3(Math.cos(ga * i) * r, y, Math.sin(ga * i) * r)); }
  return out;
}
const _box = new THREE.Box3(), _sph = new THREE.Sphere(), _m3 = new THREE.Matrix3();
let sheet = null, sheetKey = '', letGo = 0;
// the ships shaded so far (while they last), so their shade can be worked out again if the drawing context is lost and
// comes back (the buffers it was written into go with the context): reshade(renderer), from the page
const shaded = new Set();
export function reshade(renderer) {
  for (const ref of [...shaded]) { const body = ref.deref(); shaded.delete(ref); if (body) bakeShade(renderer, body, body.userData.shadeLevel); }
}
// a mesh with no shade of its own: all open sky (a number for every corner, so its shader never reads a stray one)
const open = (g) => { if (!g.attributes.occ?.isGLBufferAttribute && !g.attributes.occ) g.setAttribute('occ', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count), 1)); };

export function bakeShade(renderer, body, level = 'full') {
  const S = SHADE[level], meshes = [];
  body.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const gl = renderer?.getContext?.(), P = S && gl && !gl.isContextLost() && gl.transformFeedbackVaryings ? programFor(gl) : null;
  if (!P?.program) { for (const o of meshes) open(o.geometry); return null; }
  const t0 = performance.now();
  body.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(body.matrixWorld).invert();
  // the model, as her own shapes only (in her body's frame), for the pictures
  const scene = new THREE.Scene(), rel = new Map(); _box.makeEmpty();
  for (const o of meshes) {
    const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld); rel.set(o, m);
    if (NO_SHADOW.has(o.name)) continue;
    const c = new THREE.Mesh(o.geometry, depthMat); c.matrixAutoUpdate = false; c.matrix.copy(m); c.matrixWorld.copy(m); c.frustumCulled = false; scene.add(c);
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    _box.union(new THREE.Box3().copy(o.geometry.boundingBox).applyMatrix4(m));
  }
  _box.getBoundingSphere(_sph);
  const C = _sph.center, R = _sph.radius * 1.02, n = Math.min(MOST, S.dirs), size = S.size, cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
  const W = cols * size, H = rows * size, near = 0.05, far = R * 3;
  if (!sheet || sheetKey !== `${W}x${H}`) {
    sheet?.dispose();
    sheet = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true, generateMipmaps: false });
    sheetKey = `${W}x${H}`;
  }
  depthMat.uniforms.uNear.value = near; depthMat.uniforms.uFar.value = far;
  const cam = new THREE.OrthographicCamera(-R, R, R, -R, near, far), D = directions(n);
  const right = new Float32Array(MOST * 3), up = new Float32Array(MOST * 3), dir = new Float32Array(MOST * 3), cell = new Float32Array(MOST * 2);
  // (the renderer as it was: put back after)
  const target = renderer.getRenderTarget(), clear = renderer.getClearColor(new THREE.Color()), alpha = renderer.getClearAlpha(), auto = renderer.autoClear;
  sheet.viewport.set(0, 0, W, H); sheet.scissorTest = false;
  renderer.setRenderTarget(sheet); renderer.setClearColor(0xffffff, 1); renderer.autoClear = false; renderer.clear();
  for (let k = 0; k < n; k++) {
    const d = D[k];
    cam.position.copy(C).addScaledVector(d, R * 1.5); cam.up.set(0, Math.abs(d.y) > 0.9 ? 0 : 1, Math.abs(d.y) > 0.9 ? 1 : 0); cam.lookAt(C); cam.updateMatrixWorld(true);
    const x = (k % cols) * size, y = Math.floor(k / cols) * size;
    sheet.viewport.set(x, y, size, size); sheet.scissor.set(x, y, size, size); sheet.scissorTest = true;
    renderer.setRenderTarget(sheet);
    renderer.render(scene, cam);
    const e = cam.matrixWorld.elements;
    right.set([e[0], e[1], e[2]], k * 3); up.set([e[4], e[5], e[6]], k * 3); dir.set([d.x, d.y, d.z], k * 3); cell.set([x, y], k * 2);
  }
  sheet.viewport.set(0, 0, W, H); sheet.scissor.set(0, 0, W, H); sheet.scissorTest = false;
  renderer.setRenderTarget(target); renderer.setClearColor(clear, alpha); renderer.autoClear = auto;
  // every corner of her through the program, its shade written into the buffer she's drawn with
  const texel = (2 * R) / size, U = P.U, tex = renderer.properties.get(sheet.texture).__webglTexture;
  let count = 0;
  gl.useProgram(P.program);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(U.uSheet, 0);
  gl.uniform3f(U.uMiddle, C.x, C.y, C.z); gl.uniform1f(U.uR, R); gl.uniform1f(U.uTexel, texel); gl.uniform1f(U.uLift, Math.max(0.05, texel * 0.9));
  gl.uniform1f(U.uNear, near); gl.uniform1f(U.uSpan, (far - near) / 65535); gl.uniform1f(U.uSize, size); gl.uniform1i(U.uCount, n);
  gl.uniform3fv(U.uRight, right); gl.uniform3fv(U.uUp, up); gl.uniform3fv(U.uDir, dir); gl.uniform2fv(U.uCell, cell);
  const vao = gl.createVertexArray(), tf = gl.createTransformFeedback(), pb = gl.createBuffer(), nb = gl.createBuffer();
  gl.bindVertexArray(vao); gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
  gl.enable(gl.RASTERIZER_DISCARD);
  for (const o of meshes) {
    const g = o.geometry, pos = g.attributes.position, nor = g.attributes.normal;
    if (NO_SHADE.has(o.name) || !nor || !pos?.array || !nor.array) { open(g); continue; }
    const m = rel.get(o); _m3.getNormalMatrix(m);
    gl.uniformMatrix4fv(U.uModel, false, m.elements); gl.uniformMatrix3fv(U.uTurn, false, _m3.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, pb); gl.bufferData(gl.ARRAY_BUFFER, pos.array, gl.STREAM_DRAW); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, nb); gl.bufferData(gl.ARRAY_BUFFER, nor.array, gl.STREAM_DRAW); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    const out = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, out); gl.bufferData(gl.ARRAY_BUFFER, pos.count * 4, gl.STATIC_COPY); gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, out);
    gl.beginTransformFeedback(gl.POINTS); gl.drawArrays(gl.POINTS, 0, pos.count); gl.endTransformFeedback();
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    // (a model shaded again keeps the same attribute, with its new buffer: pieces cut from her share it, raiders.js)
    const had = g.attributes.occ;
    if (had?.isGLBufferAttribute) { had.buffer = out; had.count = pos.count; had.needsUpdate = true; }
    else g.setAttribute('occ', new THREE.GLBufferAttribute(out, gl.FLOAT, 1, 4, pos.count));
    count += pos.count;
  }
  gl.disable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null); gl.bindVertexArray(null);
  gl.deleteTransformFeedback(tf); gl.deleteVertexArray(vao); gl.deleteBuffer(pb); gl.deleteBuffer(nb);
  gl.bindTexture(gl.TEXTURE_2D, null); gl.useProgram(null);
  renderer.resetState(); // (three.js told that the card's state was changed behind its back)
  if (!body.userData.shadeLevel) shaded.add(new WeakRef(body));
  body.userData.shadeLevel = level;
  // (the sheet is let go a little after the last ship is built: a few megabytes on the card)
  clearTimeout(letGo); letGo = setTimeout(() => { sheet?.dispose(); sheet = null; sheetKey = ''; }, 3000);
  return { ms: performance.now() - t0, corners: count, dirs: n, size };
}
