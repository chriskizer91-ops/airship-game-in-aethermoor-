// build.mjs: makes dist/hangar.html, the demo page as one file with everything inside (three.js, the ships, their
// painted textures and the two game fonts), so it opens on a phone with no internet.
// Run: node tools/build.mjs   (after `npm install`)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const out = await build({
  entryPoints: [root + 'src/demo/hangar.js'], bundle: true, format: 'iife', minify: true, target: 'es2020', write: false,
  loader: { '.webp': 'dataurl', '.json': 'json' }, legalComments: 'none',
});
const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const font = (f) => 'data:font/woff;base64,' + readFileSync(root + 'assets/fonts/' + f).toString('base64');
let html = readFileSync(root + 'demos/hangar.html', 'utf8')
  .replace('/*FONT_DISPLAY*/', font('jacquard-12.woff'))
  .replace('/*FONT_BODY*/', font('pixelify-sans.woff'));
html = html.replace('<!--SCRIPT-->', () => `<script>${js}</script>`);
mkdirSync(root + 'dist', { recursive: true });
writeFileSync(root + 'dist/hangar.html', html);
console.log(`dist/hangar.html: ${(html.length / 1048576).toFixed(2)} MB`);
