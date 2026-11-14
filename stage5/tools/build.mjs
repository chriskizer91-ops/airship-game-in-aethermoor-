// build.mjs: makes the pages in dist/, each one file with everything inside (three.js, the ships, their painted
// textures, the map and the game's fonts: Cinzel for titles and names, Fira Sans for the rest), so they open on a
// phone with no internet.
//   dist/game.html     Skies of Aethermoor: fly the Captain's ships over the map
//   dist/hangar.html   the Captain's ships up close
// and, for each, a .artifact.html copy for publishing on claude.ai (which supplies the document around the page).
// Run: node tools/build.mjs   (after `npm install`)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const PAGES = [
  { name: 'game', entry: 'src/game/main.js', html: 'demos/game.html' },
  { name: 'hangar', entry: 'src/demo/hangar.js', html: 'demos/hangar.html' },
];
const font = (f) => 'data:font/woff2;base64,' + readFileSync(root + 'assets/fonts/' + f).toString('base64');
// the fonts, each put in where the page's CSS names it (/*FONT_CINZEL*/ and so on)
const FONTS = { CINZEL: 'cinzel.woff2', FIRA_400: 'fira-sans-400.woff2', FIRA_500: 'fira-sans-500.woff2', FIRA_600: 'fira-sans-600.woff2' };
mkdirSync(root + 'dist', { recursive: true });
for (const P of PAGES) {
  const out = await build({
    entryPoints: [root + P.entry], bundle: true, format: 'iife', minify: true, target: 'es2020', write: false,
    loader: { '.webp': 'dataurl', '.avif': 'dataurl', '.json': 'json' }, legalComments: 'none',
  });
  const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  let html = readFileSync(root + P.html, 'utf8');
  for (const [k, f] of Object.entries(FONTS)) html = html.replaceAll(`/*FONT_${k}*/`, () => font(f));
  html = html.replace('<!--SCRIPT-->', () => `<script>${js}</script>`);
  writeFileSync(`${root}dist/${P.name}.html`, html);
  const page = html.replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, '').replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/i, '')
    .replace(/<\/head>\s*<body>\s*/i, '').replace(/<\/body>\s*<\/html>\s*$/i, '\n');
  writeFileSync(`${root}dist/${P.name}.artifact.html`, page);
  console.log(`dist/${P.name}.html: ${(html.length / 1048576).toFixed(2)} MB`);
}
