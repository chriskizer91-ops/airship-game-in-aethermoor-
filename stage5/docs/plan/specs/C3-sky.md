# Package C3: storms, clouds you fly through, and a sky with depth

Sources: the world survey `../surveys/survey2-world.json` (read its `architecture`: src/game/sky.js as the sky director
with shared uniforms) and Chris's decisions `../chris-decisions.md`: **storms yes, flying through clouds yes, day turning
to night NO** (the voyages keep the late-afternoon light; skip the sky-clock and moonlit-night proposals, but keep the
director so storms and region moods have one place to live). Package B3 gave the title screen its own sunset look:
keep that working.

Build: sky.js (without the day clock), storm-fronts (which waves storm, per skies; the front showing before; thicker
slate cloud; rain streaks; lightning with Chris's thunder sound from sounds.js through the sound module B1 made,
'aether-storm' and 'thunder' if they fit; gusts), fly-through-clouds (inside the big clouds: mist streaming past, the
world fading, scud wisps for speed; cloud banks raiders loom out of) **with the raiders aiming worse while the Captain
is inside a cloud (Chris asked for that)**, plus the gameplay survey's cloud-floor-hiding (`../surveys/survey2-gameplay.json`:
dive into the cloud floor and far raiders lose you until your broadside gives you away; raiders can hide too) so
clouds above and below work the same way, horizon-and-rays (the towering horizon clouds; sun rays only if they suit the
afternoon light), glory-and-shadow, region-moods (each region's air, gently), sea-glitter, sun-glare.

Phone cost matters most here: package A1 baked the cloud noise into a texture; keep everything within a few percent of
the frame time on the phone size, and let the Settings card's picture quality (B2) trim rain, scud and rays on Smooth.
Balance: tune the cloud hiding and storm effects with tools/sim-fight.mjs (keep docs/game.md "How hard it is" true).

Done means: screenshots of a storm front arriving, rain and lightning, being inside a cloud and coming out, hiding in
the cloud floor, the horizon clouds, the glory, a region mood, looked at; tools/check.mjs checks a storm wave storms,
that inside a cloud the raiders' aim gets worse and the mist shows, that hiding works and a broadside reveals you; "all
good"; docs/game.md and docs/map.md updated.
