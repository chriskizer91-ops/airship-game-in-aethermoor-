export const meta = {
  name: 'build-stage',
  description: 'Build one stage of the polished airship game: its packages one at a time, each reviewed and fixed, then a gate with the full check, balance runs and screenshots',
  phases: [
    { title: 'Build', detail: 'one package at a time, committed after the full check passes' },
    { title: 'Review', detail: 'a read-only reviewer per package, alongside the next build' },
    { title: 'Fix', detail: 'apply the real review findings' },
    { title: 'Gate', detail: 'final full check, balance runs and screenshots' },
  ],
}

const SCRATCH = args.scratch, SPECS = args.specs, REPO = '/home/user/airship-game-in-aethermoor-'
const TRAILER = 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01WXanCVx8UPDRRoLB6Xk2CQ'
const CTX = `You are building the polished version of "Skies of Aethermoor", an airship combat game (three.js 0.186, esbuild, one self-contained HTML page) set in Aethermoor, the world Chris made for D&D. This version is the advanced one that must run smoothly on a smartphone (a separate laptop-only version exists elsewhere; nothing may be taken from it). Chris plays on his phone and a laptop, and wants the game as epic, rich and beautiful as a phone allows.

WHERE AND HOW
- Work ONLY inside ${REPO}/polished. Never change anything outside polished/ (the repo's main folders hold the original game other versions build from). Use only this repository: never read, fetch or clone any other repository (chriskizer91-ops/20-min and New-game are off limits). polished/src/audio/thareia/ holds two files Chris allowed from elsewhere, unchanged: never edit them.
- npm packages are installed in ${REPO}/node_modules; node finds them from polished/ automatically. Never add anything the page loads from the web.
- Build: cd ${REPO}/polished && node tools/build.mjs. Full check: cd ${REPO}/polished && node tools/check.mjs (8-12 minutes; software rendering) must end with "all good". Once package A1 has added it, node tools/check.mjs --quick runs the game page only. For focused tests write small playwright scripts in your scratch folder ${SCRATCH}/<package-key>/: import { chromium } from '${REPO}/node_modules/playwright/index.mjs'; launch with args ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] as tools/check.mjs does; drive the game with window.__game (defined at the end of src/game/main.js; __game.step(seconds, controls) runs the clock without drawing). To see what you made, take screenshots and look at them with the Read tool.
- The machine has 4 CPUs shared with another agent: close browsers when done, keep probes short, and never run two full checks at once (if a check is clearly starved, wait and retry rather than weakening it).
- Never skip, weaken or delete an existing check to get "all good"; fix the cause. A check may be updated only when the behaviour it tests was deliberately changed, and then it must test the new behaviour.

CHRIS'S DECISIONS so far are in ${SPECS}/../chris-decisions.md; read it: they override anything older (including notes in docs/ that say otherwise, e.g. that the Galleon and the Man-o'-war are only ever raiders).

HOW TO WRITE IT
- Match the existing code: compact modules, 2-space indent, single quotes, long lines are fine, and plain-words comments that say what each part is and why (like the header comment of each file).
- Anything Chris sees (HUD text, cards, the port, docs/game.md) is in plain words: short, friendly, no jargon.
- Phone first: smooth on a mid-range phone; no allocations in per-frame hot loops (reuse vectors and objects); effect budgets lower on touch; keep each ship near 100,000 triangles at full detail.
- Laptop (WASD, mouse aim with pointer lock, keys) and phone (touch stick, aiming drag, buttons) must both keep working.
- One HTML file that works with no internet, under 16 MB (about 4.6 MB now).
- Keep the Magpie's and the Witch's names out of the game; ship names stay off the models.
- Keep docs/game.md (and docs/ships.md if ships change) true to the game, in plain words.

COMMITTING
- When your work is done and the full check ends with "all good", commit everything you changed under polished/ (including the rebuilt polished/dist/): git -C ${REPO} add polished && git -C ${REPO} commit -F <message file>. The message: a short plain-words title line, a blank line, a plain-words body of what changed and why, then a blank line and exactly these two lines:\n${TRAILER}\n- Never push, publish artifacts or open pull requests. Never put a model name in commits, code or docs.`

const IMPL = {
  type: 'object',
  properties: {
    base: { type: 'string', description: 'git HEAD before you started (git -C repo rev-parse HEAD at the very start)' },
    commit: { type: 'string', description: 'the commit you made (full sha)' },
    summary_for_chris: { type: 'array', items: { type: 'string' }, description: '2-6 plain-words bullets of what he will notice' },
    changes: { type: 'string', description: 'technical summary of what changed, by file' },
    full_check: { type: 'string', description: 'the last lines of node tools/check.mjs: "all good" or the problems' },
    checks_added: { type: 'array', items: { type: 'string' } },
    measurements: { type: 'string', description: 'any numbers you measured (garbage per second, budgets, sim-fight results, sizes)' },
    not_done: { type: 'string', description: 'anything in the spec you did not do, and why; empty if all done' },
  },
  required: ['base', 'commit', 'summary_for_chris', 'changes', 'full_check', 'checks_added', 'measurements', 'not_done'],
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
          kind: { type: 'string', enum: ['bug', 'phone', 'performance', 'spec-gap', 'test', 'wording'] },
          file: { type: 'string' }, line: { type: 'integer' },
          problem: { type: 'string' }, scenario: { type: 'string', description: 'concrete steps or state that show it' }, fix: { type: 'string' },
        },
        required: ['id', 'severity', 'kind', 'file', 'line', 'problem', 'scenario', 'fix'],
      },
    },
  },
  required: ['overall', 'findings'],
}
const FIX = {
  type: 'object',
  properties: {
    commit: { type: 'string', description: 'the fix commit sha, or empty if nothing needed fixing' },
    fixed: { type: 'array', items: { type: 'string' } },
    rejected: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, why: { type: 'string' } }, required: ['id', 'why'] } },
    full_check: { type: 'string' },
  },
  required: ['commit', 'fixed', 'rejected', 'full_check'],
}

const PKGS = args.packages
const build = (P) => agent(`${CTX}\n\nYOUR PACKAGE: ${P.key}: ${P.title}\nRead its spec: ${SPECS}/${P.key}.md (paths in it are relative to ${SPECS}). Read the code it touches before changing anything. Build it completely, test it (add checks to tools/check.mjs as the spec asks), run the full check until it ends with "all good", update docs/game.md, and commit. Record git HEAD before you start, as 'base'.`, { label: `build:${P.key}`, phase: 'Build', schema: IMPL })
const review = (P, impl) => agent(`${CTX}\n\nYOU ARE A READ-ONLY REVIEWER for package ${P.key} (${P.title}); its spec is ${SPECS}/${P.key}.md. Another agent built it in commits ${impl.base}..${impl.commit} (review with: git -C ${REPO} diff ${impl.base} ${impl.commit} -- polished ':!polished/dist'). It reported:\n${JSON.stringify({ changes: impl.changes, full_check: impl.full_check, not_done: impl.not_done, measurements: impl.measurements })}\n\nDO NOT edit, stage or commit anything in the repo: another agent is writing there now. To run anything, extract that exact commit into your scratch folder: mkdir -p ${SCRATCH}/review-${P.key} && git -C ${REPO} archive ${impl.commit} polished | tar -x -C ${SCRATCH}/review-${P.key} && ln -sfn ${REPO}/node_modules ${SCRATCH}/review-${P.key}/node_modules, then build and probe there (short runs only; don't run the full check, the builder did).\n\nHunt for real problems: bugs and edge cases in the new code (state carried between voyages, pause, going down, back to port, several raiders, the Galleon and Man-o'-war), anything that breaks or looks wrong on a phone (touch, small or sideways screens, iOS Safari quirks) or on a laptop (pointer lock, keys), per-frame allocations or effect budgets that would stutter a phone, parts of the spec missed or done differently without reason, checks that don't really prove what they claim, and wording Chris would find unclear. Report only concrete, verifiable problems, each with a fix; no style nits.`, { label: `review:${P.key}`, phase: 'Review', schema: REVIEW })
const fix = (P, rev) => agent(`${CTX}\n\nYOU ARE THE FIXER for package ${P.key} (${P.title}; spec ${SPECS}/${P.key}.md). A reviewer reported these findings on it (later packages may have been built on top since, so look at the code as it is now):\n${JSON.stringify(rev.findings)}\n\nFor each finding: check it against the current code. If it's real, fix it properly (and add or strengthen a check where that proves the fix). If it's wrong or no longer applies, reject it with the reason. Then run the full check until it ends with "all good" and commit the fixes (title like "Fixes after review: ${P.title}"). If nothing needed fixing, don't commit; return an empty commit.`, { label: `fix:${P.key}`, phase: 'Fix', schema: FIX })

const results = []
let current = await build(PKGS[0])
for (let i = 0; i < PKGS.length; i++) {
  const P = PKGS[i]
  if (!current) { log(`${P.key}: the builder returned nothing; stopping`); break }
  results.push({ key: P.key, impl: current })
  log(`${P.key}: built (${current.commit.slice(0, 7)}), check: ${current.full_check.slice(-60)}`)
  const rp = review(P, current)
  const np = i + 1 < PKGS.length ? build(PKGS[i + 1]) : null
  const rev = await rp
  current = np ? await np : null
  results[i].review = rev
  if (rev && rev.findings.length) {
    log(`${P.key}: ${rev.findings.length} review findings; fixing`)
    results[i].fix = await fix(P, rev)
  }
}

phase('Gate')
const gate = await agent(`${CTX}\n\nYOU ARE THE GATE for build stage ${args.stage} (packages ${PKGS.map((p) => p.key).join(', ')}; specs in ${SPECS}). Everything is committed. 1) Run the full check (cd ${REPO}/polished && node tools/build.mjs && node tools/check.mjs) and make it end with "all good" (fix any real cause; commit fixes as "Stage ${args.stage} gate fixes"). 2) Run node tools/sim-fight.mjs skiff 5 cross, skiff 5 fair, brig 8 cross and frigate 8 mael, each several times (one run is too random), and make sure docs/game.md "How hard it is" matches (update it if not, and commit). 3) Take screenshots for the lead to look at, into ${SCRATCH}/gate-${args.stage}/: laptop 1280x800, phone upright 390x844 (deviceScaleFactor 2, touch) and phone sideways 844x390: ${args.shots} Look at each one yourself and say plainly what looks good and what looks wrong. 4) Read docs/game.md and README.md through as Chris would: plain words, true to the game; fix what isn't. 5) Report git log --oneline of the stage.`, { label: `gate:stage-${args.stage}`, phase: 'Gate', schema: {
  type: 'object',
  properties: { full_check: { type: 'string' }, sim: { type: 'string' }, screenshots: { type: 'array', items: { type: 'object', properties: { path: { type: 'string' }, what: { type: 'string' }, verdict: { type: 'string' } }, required: ['path', 'what', 'verdict'] } }, log: { type: 'string' }, concerns: { type: 'string' } },
  required: ['full_check', 'sim', 'screenshots', 'log', 'concerns'],
} })
return { results, gate }
