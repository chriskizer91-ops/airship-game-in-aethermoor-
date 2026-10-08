// map-art.mjs: packs Chris's nine map tiles (art/map/tiles/) for the game, as AVIF (about a third the size of WebP for
// the same look), plus a small copy of the whole map for the corner map.
//   assets/map/tile-1.avif ... tile-9.avif   in reading order, 01-northwest to 09-southeast
//   assets/map/minimap.webp                  the whole map, 768 wide
// Run: node tools/map-art.mjs
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const art = new URL('../../art/map/', import.meta.url).pathname; // the repo's map art, read only
const src = art + 'tiles/', out = root + 'assets/map/';
mkdirSync(out, { recursive: true });
const tiles = readdirSync(src).filter((f) => /^0\d-.*\.png$/.test(f)).sort();
let total = 0;
for (const [i, f] of tiles.entries()) {
  const file = `${out}tile-${i + 1}.avif`;
  await sharp(src + f).avif({ quality: 52, effort: 6, chromaSubsampling: '4:2:0' }).toFile(file);
  total += statSync(file).size;
}
await sharp(art + 'aethermoor-approved.webp').resize(768).webp({ quality: 82 }).toFile(out + 'minimap.webp');
console.log(`${tiles.length} tiles: ${(total / 1048576).toFixed(2)} MB · minimap ${(statSync(out + 'minimap.webp').size / 1024).toFixed(0)} KB`);
