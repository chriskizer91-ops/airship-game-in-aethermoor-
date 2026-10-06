// Builds docs/art-requests/01-ships.md so every prompt shares the exact same style and fleet paragraphs.
import { writeFileSync } from 'node:fs';

const STYLE = `Stylized hand-painted 3D game art of a fantasy airship, like a detailed collectible model, made as reference for a 3D modeler. Clean readable shapes, strong silhouette, soft painterly textures with crisp edges. Storybook JRPG fantasy: not photoreal, not pixel art. The ship flies through the sky and has no gas balloon. Warm honey-brown wooden planks, polished brass bands, rivets and rails, riveted copper furnace columns, glowing amber sunstone crystals, and cream canvas sails with no emblem. No name, letters or numbers anywhere on the ship, and no people on board. Even flat studio lighting, no cast shadows, plain light grey background (#D9D9D9), no sky, no clouds, no water, no scenery.`;

const FLEET = `Like every ship in this fleet, it has a wooden hull with brass bands and a brass-capped prow. Clusters of amber sunstone crystals lift it: each cluster is a tall central crystal ringed by smaller ones on curved brass arms, rising from a riveted copper furnace column with a glowing grated window. Triangular cream wing sails on wooden booms reach out and up like wings. The booms are mounted high on the sides, well above the gun ports, so the broadside guns fire underneath the sails. It has a pair of small fins under the belly, a tall rudder at the stern, brass lanterns with warm glowing glass, and a ship's wheel near the stern. Its guns are crystal cannons: brass barrels with an amber crystal glowing at the breech. Bow and stern guns are long and slender, on swivel mounts. Broadside guns are short and heavy, and look out of square gun ports with hinged wooden lids.`;

const ships = [
  {
    id: 'brig', front: 'the two bow guns', back: 'the stern gun, the rudder and the stern windows', broadside: 'a broadside gun from the side, with its gun port and open lid', name: 'Brig', length: 25,
    look: `The Brig, a sturdy all-rounder about 25 m long and 7 m across: a deep, balanced hull with a raised quarterdeck at the stern, reached by short stairs, and a small cabin under it with a row of stern windows. Two crystal clusters of five crystals each, one forward and one aft of the middle, each on its own furnace column. Two pairs of wing sails. One row of six gun ports along each side. Two long bow guns, one on each side of the bowsprit, and one long stern gun under the stern windows.`,
    extras: 'the stern windows straight on',
  },
  {
    id: 'skiff', front: 'the bow gun', back: 'the rudder and the wheel', broadside: 'a broadside gun on its swivel mount from the side', name: 'Skiff', length: 8,
    look: `The Skiff, a small, nimble open boat about 8 m long and 2.6 m across, the size of a big rowing boat: a rounded open hull with a low rail all round and no cabin. One crystal cluster of three crystals on a short furnace column in the middle. One pair of wing sails, on booms that rise from short posts above the swivel guns. The wheel at the stern. One long bow gun on a swivel at the prow, and one short broadside gun on a swivel on the rail on each side, with no gun ports.`,
    extras: 'the swivel mount on the rail from the side',
  },
  {
    id: 'cutter', front: 'the bow gun and the bowsprit', back: 'the stern gun and the rudder', broadside: 'a broadside gun from the side, with its gun port and open lid', name: 'Cutter', length: 15,
    look: `The Cutter, a fast raider about 15 m long and 3.8 m across: long, low and narrow, with a sharp raked prow, a long bowsprit and thin brass trim. A flush deck with one small hatch. One small crystal cluster of three crystals in the middle. Two pairs of wing sails swept back like a swallow's wings. One row of three gun ports along each side, one long bow gun at the prow, and one long stern gun at the stern rail.`,
    extras: 'the bowsprit from the side',
  },
  {
    id: 'frigate', front: 'the two bow guns', back: 'the two stern guns and the rudder', broadside: 'a broadside gun from the side, with its gun port and open lid', name: 'Frigate', length: 40,
    look: `The Frigate, a sleek hunter about 40 m long and 10 m across: long and low, with a fine, sharp bow, a flush main deck and a low quarterdeck at the stern. Three crystal clusters of five crystals each along the centre line. Three pairs of large wing sails, which is a lot of sail for its size. One long, even row of ten gun ports along each side. Two long bow guns side by side at the prow, and two long stern guns in the stern.`,
    extras: 'the stern straight on',
  },
  {
    id: 'galleon', front: 'the bow gun', back: 'the two stern guns, the rudder and the stern castle windows', broadside: 'a broadside gun from the side, with its gun port and open lid', name: 'Galleon', length: 60,
    look: `The Galleon, a slow, rich treasure ship about 60 m long and 16 m across: tall and wide-bellied, with a towering three-storey stern castle full of leaded windows and gilded carved trim, a raised forecastle, and big cargo hatches with gratings on the main deck. Four crystal clusters along the centre line, but only two pairs of short wing sails for its great weight. Two rows of eight gun ports along each side, one row above the other. One long bow gun at the prow, and two long stern guns looking out of the stern castle.`,
    extras: 'the stern castle windows straight on, and one cargo hatch from above',
  },
  {
    id: 'man-o-war', front: 'the four bow guns', back: 'the two stern guns, the rudder and the stern castle windows', broadside: 'a broadside gun from the side, with its gun port and open lid', name: "Man-o'-war", length: 90,
    look: `The Man-o'-war, a huge flying fortress about 90 m long and 22 m across: massive and heavy, its hull clad in riveted iron and brass armour plates over the wood, with a high forecastle, a tall stern castle and a long main deck between them. Five large crystal clusters along the centre line. Three pairs of short, heavy wing sails. Two rows of twelve gun ports along each side, one row above the other. Four long bow guns at the prow, two above two, and two long stern guns in the stern castle.`,
    extras: 'one armour plate straight on, and the stern castle windows straight on',
  },
];

const fence = s => '```text\n' + s + '\n```';
const keep = name => `Keep the design of the ${name} in the attached picture exactly: the same hull, crystals, sails, guns and colours.`;
const short = s => s.look.split(':')[0]; // "The Brig, a sturdy all-rounder about 25 m long and 7 m across"

const prompts = s => [
  {
    title: 'Concept view', file: `${s.id}-concept.png`, attach: 'the lineup',
    text: `${STYLE}\n\n${FLEET}\n\n${s.look}\n\nKeep the design of the ${s.name} in the attached lineup. One picture of the whole ship flying, in a three-quarter view from the front left and a little above, with the wing sails spread and the crystals glowing. The only figure is a plain grey 1.8 m human silhouette standing on the deck for scale.`,
  },
  {
    title: 'Hull views', file: `${s.id}-hull.png`, attach: `the ${s.name}'s concept view`,
    text: `${STYLE}\n\n${keep(s.name)} ${short(s)}.\n\nTwo orthographic views at exactly the same scale, one above the other, filling the width of the picture. On top, the side view with the bow pointing right. Below it, the top view looking straight down, with the bow pointing right and the bow and stern lined up under the side view's. Leave out the wing sails and their booms, but show the mounts where the booms attach, above the ${s.id === 'skiff' ? 'swivel guns' : 'gun ports'}. Show everything else fixed to the hull: the rails, the crystal clusters on their furnace columns, every gun${s.id === 'skiff' ? '' : ' with its gun port lid open'}, the lanterns, hatches, wheel, rudder and belly fins. No perspective.`,
  },
  {
    title: 'Front and back', file: `${s.id}-front-back.png`, attach: `the ${s.name}'s concept view`,
    text: `${STYLE}\n\n${keep(s.name)} ${short(s)}.\n\nTwo orthographic views side by side at the same scale, on one ground line. On the left, the front view, looking straight at the bow. On the right, the back view, looking straight at the stern. The wing sails are spread. Show ${s.front} in the front view, and ${s.back} in the back view. No perspective.`,
  },
  {
    title: 'Parts sheet', file: `${s.id}-parts.png`, attach: `the ${s.name}'s concept view`,
    text: `${STYLE}\n\n${keep(s.name)} ${short(s)}.\n\nParts sheet. Draw each part on its own, flat and straight on, spread out with space between them, with small labels only: one wing sail laid flat with its boom; one crystal cluster from the side and from above; one furnace column from the side; a bow gun from the side; ${s.broadside}; the rudder from the side; one belly fin from the side and from above; one lantern; the ship's wheel straight on; a short length of deck rail; ${s.extras}.`,
  },
];

const lineup = `${STYLE}\n\n${FLEET}\n\nSize lineup of the six airships of one fleet. They are all in side view with the bow pointing right, all at exactly the same scale and standing on one ground line, from the smallest at the left to the largest at the right, with each class name in small print underneath:\n1. Skiff, 8 m long: an open boat with one crystal cluster and one pair of wing sails.\n2. Cutter, 15 m: long, low and narrow, with two pairs of swept-back wing sails.\n3. Brig, 25 m: a deep, balanced hull with a raised stern deck, two crystal clusters, two pairs of wing sails and one row of six gun ports.\n4. Frigate, 40 m: long and sleek, with three crystal clusters, three pairs of large wing sails and one row of ten gun ports.\n5. Galleon, 60 m: tall and wide, with a towering stern castle, four crystal clusters, two pairs of short wing sails and two rows of eight gun ports.\n6. Man-o'-war, 90 m: a huge armoured fortress with five crystal clusters, three pairs of short, heavy wing sails and two rows of twelve gun ports.\nA plain grey 1.8 m human silhouette stands at the far left, with a ruler in metres along the bottom.`;

let md = `# Art Request 01: The six ships

Pictures for the six ships in \`docs/ships.md\`. Every gun, crystal and sail in these prompts matches the stats there.

## How to make them

- Every prompt is ready to paste. Make each picture **landscape, 1536 × 1024**.
- Generate each one two to four times and keep the one that follows the prompt best. Count the gun ports! Then send it back with the file name given. I'll save them in \`art/ships/\`.
- **Attach a picture** where it says to, so all the pictures of one ship match each other and the whole fleet matches.

## Order

1. **The lineup.** It sets the look of the whole fleet and the sizes side by side.
2. **The Brig's four pictures, then stop.** The Brig is the middle size and has every kind of part: bow guns, a stern gun, a row of gun ports, two crystal clusters, two pairs of sails and a raised stern deck. I'll build it first to check the pictures work for building. If the prompts need changing, that happens before you make the other twenty.
3. **The other five ships,** four pictures each.

| # | Picture | Attach | Save as |
|---|---|---|---|
| 1 | The lineup | Nothing | \`lineup.png\` |
`;
let n = 2;
for (const s of ships) for (const p of prompts(s)) md += `| ${n++} | ${s.name}: ${p.title.toLowerCase()} | ${p.attach[0].toUpperCase() + p.attach.slice(1)} | \`${p.file}\` |\n`;

md += `
The four pictures of each ship do different jobs:

- **Concept view:** how the whole ship looks together.
- **Hull views:** the side and top outlines the hull is built from. That's how the Magpie was made.
- **Front and back:** how far the sails reach out, and where the bow and stern guns sit.
- **Parts sheet:** the separate pieces placed on the hull.

## Style lock

Every prompt below starts with this paragraph, so the pictures match each other:

${fence(STYLE)}

If the lineup's sizes come out wrong, the lengths in \`docs/ships.md\` still decide. The lineup is mainly for the look.

## 1. The lineup

Save as \`lineup.png\`.

${fence(lineup)}
`;

let sec = 2;
for (const s of ships) {
  md += `\n## ${sec++}. ${s.name} (${s.length} m)\n`;
  for (const p of prompts(s)) {
    md += `\n### ${p.title}\n\nAttach ${p.attach}. Save as \`${p.file}\`.\n\n${fence(p.text)}\n`;
  }
}
writeFileSync(new URL("../docs/art-requests/01-ships.md", import.meta.url), md);

// The next two to build, on their own: their concept views are made with the built Brig's picture attached too,
// so they match the four ships already in the game
const next = ships.filter((s) => s.id === 'galleon' || s.id === 'man-o-war');
const brigNote = 'Also match the style and parts of the attached Brig picture: the same hull planks, brass bands, crystal clusters on their furnace columns, masts with wing sails, lanterns and guns, so it belongs to the same fleet.';
let md2 = `# Art Request 02: The Galleon and the Man-o'-war

The Captain's four ships are built (Skiff, Cutter, Brig and Frigate). These two are the enemies still to build: the Galleon (60 m, the rich prize) and the Man-o'-war (90 m, the fortress). Their stats are in \`docs/ships.md\`.

## How to make them

- Every prompt is ready to paste. Make each picture **landscape, 1536 × 1024**.
- Generate each one two to four times and keep the one that follows the prompt best. **Count the gun ports:** two rows of 8 a side on the Galleon, two rows of 12 on the Man-o'-war.
- Send them back with the file names below. I'll save them in \`art/ships/\`.

| # | Picture | Attach | Save as |
|---|---|---|---|
`;
let k = 1;
for (const s of next) for (const p of prompts(s)) {
  const attach = p.title === 'Concept view' ? 'The lineup and \`brig-concept.png\`' : p.attach[0].toUpperCase() + p.attach.slice(1);
  md2 += `| ${k++} | ${s.name}: ${p.title.toLowerCase()} | ${attach} | \`${p.file}\` |\n`;
}
md2 += `
\`lineup.png\` and \`brig-concept.png\` are the pictures you made before (they're in \`art/ships/\` too).
`;
let sec2 = 1;
for (const s of next) {
  md2 += `\n## ${sec2++}. ${s.name} (${s.length} m)\n`;
  for (const p of prompts(s)) {
    const concept = p.title === 'Concept view';
    const text = concept ? p.text.replace('Keep the design of the ' + s.name + ' in the attached lineup.', 'Keep the design of the ' + s.name + ' in the attached lineup. ' + brigNote) : p.text;
    md2 += `\n### ${p.title}\n\nAttach ${concept ? 'the lineup and the Brig\'s concept view (\`brig-concept.png\`)' : p.attach}. Save as \`${p.file}\`.\n\n${fence(text)}\n`;
  }
}
writeFileSync(new URL("../docs/art-requests/02-galleon-and-man-o-war.md", import.meta.url), md2);
console.log('prompts:', 1 + ships.length * 4, 'bytes:', md.length);
