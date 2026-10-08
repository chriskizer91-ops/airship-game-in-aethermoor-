export const meta = {
  name: 'build-stage',
  description: 'Build packages of the polished airship game in stage4/: one at a time, each looked over by two reviewers and fixed, then a gate with the full check, balance runs and screenshots',
  phases: [
    { title: 'Build', detail: 'one package at a time, committed and pushed after the full check passes' },
    { title: 'Review', detail: 'two read-only reviewers per package (the code, and playing it), alongside the next build' },
    { title: 'Fix', detail: 'apply the real review findings' },
    { title: 'Gate', detail: 'final full check, balance runs and screenshots' },
  ],
}

// Run with Workflow({scriptPath, args: {stage, scratch, specs, branch, trailer, packages: [{key, title}], shots}}).
// scratch must be outside stage4/ (the builders commit everything under stage4/).
const SCRATCH = args.scratch, SPECS = args.specs, REPO = '/home/user/airship-game-in-aethermoor-', DIR = `${REPO}/stage4`
const BRANCH = args.branch, TRAILER = args.trailer
const CTX = `You are building the polished version of "Skies of Aethermoor", an airship combat game (three.js 0.186, esbuild, one self-contained HTML page) set in Aethermoor, the world Chris made for D&D. This version is the advanced one that must run smoothly on a smartphone (a separate laptop-only version exists elsewhere; nothing may be taken from it). Chris plays on his phone and a laptop, and wants the game as epic, rich and beautiful as a phone allows.

WHERE AND HOW
- Work ONLY inside ${DIR} (the stage4/ folder: a copy of polished/ made to build stage 4 on its own). Never change anything outside stage4/: not polished/ (another copy of this game, left as it was), not the repo's main folders (the original game). Use only this repository: never read, fetch or clone any other repository (chriskizer91-ops/20-min and New-game are off limits). stage4/src/audio/thareia/ holds two files Chris allowed from elsewhere, unchanged: never edit them. Notes in stage4/docs that say "polished/" mean this folder now.
- File the source properly as you write: game code in src/ (src/game/ for the game, src/ship/ and src/ships/ for the ships, src/audio/ for sound), tools and checks in tools/, page HTML in demos/, notes in docs/. Never leave work only in dist/ or in scratch space: anything the game needs is source under stage4/ and is committed.
- npm packages are installed in ${DIR}/node_modules (node finds them from stage4/ automatically). Never add anything the page loads from the web.
- Build: cd ${DIR} && node tools/build.mjs. Full check: cd ${DIR} && node tools/check.mjs (about 25 minutes in software rendering, less once package D0 has sped it up) must end with "all good"; node tools/check.mjs --quick runs the game page only. For focused tests write small playwright scripts in your scratch folder ${SCRATCH}/<package-key>/: import { chromium } from '${DIR}/node_modules/playwright/index.mjs'; launch with args ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] as tools/check.mjs does; drive the game with window.__game (defined at the end of src/game/main.js; __game.step(seconds, controls) runs the clock without drawing). To see what you made, take screenshots and look at them with the Read tool.
- The machine has 4 CPUs shared with another agent: close browsers when done, keep probes short, and never run two full checks at once (if a check is clearly starved, wait and retry rather than weakening it).
- Never skip, weaken or delete an existing check to get "all good"; fix the cause. A check may be updated only when the behaviour it tests was deliberately changed, and then it must test the new behaviour.

CHRIS'S DECISIONS so far are in ${SPECS}/../chris-decisions.md; read it: they override anything older (including notes in docs/ that say otherwise, e.g. that the Galleon and the Man-o'-war are only ever raiders).

HOW TO WRITE IT
- Match the existing code: compact modules, 2-space indent, single quotes, long lines are fine, and plain-words comments that say what each part is and why (like the header comment of each file).
- Anything Chris sees (HUD text, cards, the port, docs/game.md) is in plain words: short, friendly, no jargon.
- Phone first: smooth on a mid-range phone; no allocations in per-frame hot loops (reuse vectors and objects); effect budgets lower on touch; keep each ship near 100,000 triangles at full detail.
- Laptop (WASD, mouse aim with pointer lock, keys) and phone (touch stick, aiming drag, buttons) must both keep working.
- One HTML file that works with no internet, under 16 MB (about 4.9 MB now).
- Keep the Magpie's and the Witch's names out of the game; ship names stay off the models.
- Keep docs/game.md (and docs/ships.md if ships change) true to the game, in plain words.

COMMITTING AND SAVING (the container is temporary: work not pushed can be lost)
- When your work is done and the full check ends with "all good", commit everything you changed under stage4/ (including the rebuilt stage4/dist/): git -C ${REPO} add stage4 && git -C ${REPO} commit -F <message file>. The message: a short plain-words title line, a blank line, a plain-words body of what changed and why (and, if you copied anything from elsewhere in this repo, its source path), then a blank line and exactly these two lines:\n${TRAILER}\n- Then push it at once: git -C ${REPO} push -u origin ${BRANCH} (if it fails for a network error, retry up to 4 times, waiting a little longer each time). Push only to that branch.
- If your work is long, you may also commit and push a safe midway point once the full check passes on it.
- Never publish artifacts or open pull requests. Never put a model name in code or docs.`

const IMPL = {
  type: 'object',
  properties: {
    base: { type: 'string', description: 'git HEAD before you started (git -C repo rev-parse HEAD at the very start)' },
    commit: { type: 'string', description: 'the last commit you made (full sha)' },
    pushed: { type: 'boolean', description: 'true if the commit is pushed to the branch' },
    summary_for_chris: { type: 'array', items: { type: 'string' }, description: '2-6 plain-words bullets of what he will notice' },
    changes: { type: 'string', description: 'technical summary of what changed, by file' },
    full_check: { type: 'string', description: 'the last lines of node tools/check.mjs: "all good" or the problems' },
    checks_added: { type: 'array', items: { type: 'string' } },
    measurements: { type: 'string', description: 'any numbers you measured (garbage per second, budgets, sim-fight results, sizes, check time)' },
    not_done: { type: 'string', description: 'anything in the spec you did not do, and why; empty if all done' },
  },
  required: ['base', 'commit', 'pushed', 'summary_for_chris', 'changes', 'full_check', 'checks_added', 'measurements', 'not_done'],
}
const REVIEW = {
  type: 'object',
  properties: {
    overall: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' }, severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          kind: { type: 'string', enum: ['bug', 'phone', 'laptop', 'looks', 'performance', 'spec-gap', 'test', 'wording'] },
          file: { type: 'string' }, line: { type: 'integer' },
          problem: { type: 'string' }, scenario: { type: 'string', description: 'concrete steps or state that show it' }, fix: { type: 'string' },
          evidence: { type: 'string', description: 'what you ran or looked at that shows it (a probe result, a screenshot path)' },
        },
        required: ['id', 'severity', 'kind', 'file', 'line', 'problem', 'scenario', 'fix', 'evidence'],
      },
    },
  },
  required: ['overall', 'findings'],
}
const FIX = {
  type: 'object',
  properties: {
    commit: { type: 'string', description: 'the fix commit sha, or empty if nothing needed fixing' },
    pushed: { type: 'boolean' },
    fixed: { type: 'array', items: { type: 'string' } },
    rejected: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, why: { type: 'string' } }, required: ['id', 'why'] } },
    full_check: { type: 'string' },
  },
  required: ['commit', 'pushed', 'fixed', 'rejected', 'full_check'],
}

const PKGS = args.packages
const build = (P) => agent(`${CTX}\n\nYOUR PACKAGE: ${P.key}: ${P.title}\nRead its spec: ${SPECS}/${P.key}.md (paths in it are relative to ${SPECS}). Read the code it touches before changing anything. Build it completely, test it (add checks to tools/check.mjs as the spec asks), run the full check until it ends with "all good", update docs/game.md, commit and push. Record git HEAD before you start, as 'base'.`, { label: `build:${P.key}`, phase: 'Build', schema: IMPL })

const SANDBOX = (P, impl, who) => `DO NOT edit, stage or commit anything in the repo: another agent is writing there now. To run anything, extract that exact commit into your scratch folder: mkdir -p ${SCRATCH}/${who}-${P.key} && git -C ${REPO} archive ${impl.commit} stage4 | tar -x -C ${SCRATCH}/${who}-${P.key} && ln -sfn ${DIR}/node_modules ${SCRATCH}/${who}-${P.key}/node_modules, then build and probe there (in ${SCRATCH}/${who}-${P.key}/stage4; short runs only; don't run the full check, the builder did).`
const REPORTED = (impl) => JSON.stringify({ changes: impl.changes, full_check: impl.full_check, not_done: impl.not_done, measurements: impl.measurements, checks_added: impl.checks_added })
const reviewCode = (P, impl) => agent(`${CTX}\n\nYOU ARE A READ-ONLY CODE REVIEWER for package ${P.key} (${P.title}); its spec is ${SPECS}/${P.key}.md. Another agent built it in commits ${impl.base}..${impl.commit} (review with: git -C ${REPO} diff ${impl.base} ${impl.commit} -- stage4 ':!stage4/dist'). It reported:\n${REPORTED(impl)}\n\n${SANDBOX(P, impl, 'code')}\n\nRead the diff closely and hunt for real problems: bugs and edge cases in the new code (state carried between waves and voyages, pause, going down, back to port, a reload, several raiders, the Galleon and the Man-o'-war, old saves), per-frame allocations or effect budgets that would stutter a phone, checks in tools/check.mjs that don't really prove what they claim (or were weakened), source left unfiled or missing from the commit, and parts of the spec missed or done differently without reason. Prove each one with a short probe where you can. Report only concrete, verifiable problems, each with a fix; no style nits.`, { label: `review-code:${P.key}`, phase: 'Review', schema: REVIEW })
const reviewPlay = (P, impl) => agent(`${CTX}\n\nYOU ARE A READ-ONLY PLAYTESTER for package ${P.key} (${P.title}); its spec is ${SPECS}/${P.key}.md. Another agent built it in commits ${impl.base}..${impl.commit}. It reported:\n${REPORTED(impl)}\n\n${SANDBOX(P, impl, 'play')}\n\nPlay what the package added as Chris would, at three sizes: laptop 1280x800 (mouse and keys), phone upright 390x844 and phone sideways 844x390 (deviceScaleFactor 2, hasTouch, isMobile; tap the real buttons). Take screenshots into ${SCRATCH}/play-${P.key}/shots and look at every one. Hunt for what a player would notice: things that look wrong, unclear or ugly, text clipped or overlapping, buttons crowding or hidden on a phone, controls that don't answer on one of the devices, effects too faint or too loud at real fight distance, wording Chris would find unclear, and parts of the spec that don't show up in play. Report only concrete problems you saw, each with the screenshot path as evidence and a fix.`, { label: `review-play:${P.key}`, phase: 'Review', schema: REVIEW })
const fix = (P, findings) => agent(`${CTX}\n\nYOU ARE THE FIXER for package ${P.key} (${P.title}; spec ${SPECS}/${P.key}.md). Two reviewers (one reading the code, one playing it) reported these findings on it (later packages may have been built on top since, so look at the code as it is now):\n${JSON.stringify(findings)}\n\nFor each finding: check it against the current code (reproduce it where you can). If it's real, fix it properly (and add or strengthen a check where that proves the fix). If it's wrong or no longer applies, reject it with the reason. Then run the full check until it ends with "all good", commit the fixes (title like "Fixes after review: ${P.title}") and push. If nothing needed fixing, don't commit; return an empty commit.`, { label: `fix:${P.key}`, phase: 'Fix', schema: FIX })

const results = []
let current = await build(PKGS[0])
for (let i = 0; i < PKGS.length; i++) {
  const P = PKGS[i]
  if (!current) { log(`${P.key}: the builder returned nothing; stopping`); break }
  results.push({ key: P.key, impl: current })
  log(`${P.key}: built (${current.commit.slice(0, 7)}, ${current.pushed ? 'pushed' : 'NOT pushed'}), check: ${current.full_check.slice(-60)}`)
  // the next build starts first so it holds one of the two agent slots; the reviewers share the other
  const np = i + 1 < PKGS.length ? build(PKGS[i + 1]) : null
  const impl = current
  const revs = await parallel([() => reviewCode(P, impl), () => reviewPlay(P, impl)])
  current = np ? await np : null
  results[i].reviews = revs
  const findings = revs.filter(Boolean).flatMap((r, k) => r.findings.map((f) => ({ ...f, id: `${k ? 'play' : 'code'}-${f.id}` })))
  if (revs.some((r) => !r)) log(`${P.key}: a reviewer returned nothing`)
  if (findings.length) {
    log(`${P.key}: ${findings.length} review findings; fixing`)
    results[i].fix = await fix(P, findings)
  }
}

phase('Gate')
const gate = await agent(`${CTX}\n\nYOU ARE THE GATE for build stage ${args.stage} (packages ${PKGS.map((p) => p.key).join(', ')}; specs in ${SPECS}). Everything is committed. 1) Run the full check (cd ${DIR} && node tools/build.mjs && node tools/check.mjs) and make it end with "all good" (fix any real cause; commit and push fixes as "Stage ${args.stage} gate fixes"). 2) Run node tools/sim-fight.mjs skiff 5 cross, skiff 5 fair, brig 8 cross and frigate 8 mael (and, once the Captain can sail them, galleon and manowar runs against the late waves), each several times (one run is too random), and make sure docs/game.md "How hard it is" matches (update it if not, commit and push). 3) Take screenshots for the lead to look at, into ${SCRATCH}/gate-${args.stage}/: laptop 1280x800, phone upright 390x844 (deviceScaleFactor 2, touch) and phone sideways 844x390: ${args.shots} Look at each one yourself and say plainly what looks good and what looks wrong. 4) Read docs/game.md and README.md through as Chris would: plain words, true to the game; fix what isn't. 5) Make sure everything is committed and pushed (git status clean under stage4/, branch level with origin). 6) Report git log --oneline of the stage.`, { label: `gate:stage-${args.stage}`, phase: 'Gate', schema: {
  type: 'object',
  properties: { full_check: { type: 'string' }, sim: { type: 'string' }, screenshots: { type: 'array', items: { type: 'object', properties: { path: { type: 'string' }, what: { type: 'string' }, verdict: { type: 'string' } }, required: ['path', 'what', 'verdict'] } }, log: { type: 'string' }, concerns: { type: 'string' } },
  required: ['full_check', 'sim', 'screenshots', 'log', 'concerns'],
} })
return { results, gate }
