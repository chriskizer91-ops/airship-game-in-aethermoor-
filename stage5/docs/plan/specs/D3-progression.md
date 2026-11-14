# Package D3: reasons to come back: the Captain's record, a gentle first voyage, homecomings, commendations, ranks, colours

Source: the progression survey `../surveys/survey2-progression.json` (read `summary` and `architecture` in full: save
version 2 and its pitfalls, e.g. progress.js must stay import-free because tools/check.mjs loads it in a vm) and
Chris's decisions `../chris-decisions.md`. Package B2 built the Settings card and B3 the title's "Set sail"; D1 made the
big two buyable; D2a/D2b added shot types, named captains and the road choice: commendations and orders should
include deeds from all of those.

Build: save-v2-tally (old saves keep everything; back pay as proposed), first-voyage-coach (one short tip at a time,
worded for phone or laptop, shown once, switchable in Settings; teach steering, aiming picks the guns, lock-on, the
broadside, the Surge, shards, the danger fan, shot types when first owned), homecoming-summary (with "Sail again"),
commendations-and-log (with shard rewards and the Captain's log in port), captain-ranks, skies-stars-records,
quartermaster-advice, paint-and-pennants (sail dyes and pennant colours, shown on the ship on the berth; raiders keep
their rust so they stay easy to tell apart), and harbour-orders (three small jobs a day) if the save and the port
panel can take it cleanly on a phone.

Done means: a brand-new save on a phone and a laptop plays a first voyage with the tips at the right moments
(screenshots, looked at); coming home shows the summary; commendations pay; ranks and stars show on the title and in
port; colours can be bought and show on the ship; an old version-1 save loads with everything kept; tools/check.mjs
checks all of that and ends "all good"; docs/game.md updated.
