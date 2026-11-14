# Package B2: clear type, a tidy screen on every phone, and plain words

Sources: the playtest `../surveys/survey1-playtest.json` (its issues, with measured overlaps and screenshots in
`../../survey/playtest/shots/`), the progression survey's settings-panel proposal in `../surveys/survey2-progression.json`,
and Chris's decisions `../chris-decisions.md`. Earlier packages (A1-B1) have changed the code since the playtest, so
re-check each issue against the game as it is now before fixing it.

1. **Clearer fonts (Chris asked).** Cinzel (`assets/fonts/cinzel.woff2`, a variable font, weights 400-900) for the
   game's title, banners, card headings and ship names; Fira Sans (`fira-sans-400/500/600.woff2`) for everything else,
   with `font-variant-numeric: lining-nums tabular-nums` wherever numbers are read (HUD, prices, stats, tags, cards).
   tools/build.mjs inlines them as woff2 data URLs (format('woff2')); remove Jacquard 12 and Pixelify Sans from the game
   page (the hangar page may switch too, for consistency). Tune sizes and weights so everything reads at a glance on a
   390 px phone; Cinzel is all small capitals, so size headings with that in mind. Look at the result.
2. **Every playtest layout issue that's still real**, on laptop 1280x800, phone upright 390x844 and 360x640, and phone
   sideways 844x390 and 740x360: the sideways title cut off; the sideways HUD; overlaps of the region name, toast,
   banner, battery label, touch hint and ship panel; the pause button size; toasts wrapping and shorter wording; the
   between-waves card docked at the bottom as a compact strip (and still clickable with the mouse locked: Enter works,
   and say so); the port's big button becoming "Buy the Tempest · ◆ 2,200" when looking at a ship you don't own; the
   port panel on phones (tabs or a peek strip so the upgrades are found); the big map (sharp, sized to fit, a close
   button, dim backdrop); directions in plain left/right words ("ahead on your right"); the wind in words; plain words
   in the port's stats and upgrades; the maker's note in the Brig's blurb; the laptop key panel folding away after the
   first two voyages; phone help.
3. **The Settings card** (B1 made it, with sound rows): add aim speed (5 steps), up/down (Normal/Flipped), picture
   (Smooth/Balanced/Sharp: pixel ratio cap, shadow map size, cloud puff count, raider detail distance, fx.q), camera
   shake (On/Off), and on phones "Fire button on the left". Default picture: Balanced on touch, Sharp on laptops.
   Kept per device.
4. **Keep it smooth**: if a phone-sized run shows the frame time is dominated by something cheap to trim, trim it.

Done means: screenshots at all five sizes of the title, port (owned and not owned ship), a battle, the between-waves
strip, the pause card, the settings card and the big map, with no overlaps (measure boxes like the playtest's
measure.mjs did), and you've looked at each; tools/check.mjs still taps/clicks everything it did (keep ids or update
the check to the new controls) plus a check that no two HUD boxes overlap at phone upright and sideways sizes; ends
"all good"; docs/game.md updated (controls, settings).
