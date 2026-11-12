# Handoff — WebKit v6 "AI-ready" branch (2026-11-12)

This file is the starting point for whoever picks the work up on another machine, human or AI.
The plan of record is [ROADMAP.md](./ROADMAP.md); this file says where things stand, how to set up,
and what to do next. Delete it once battery 2 has run and its results are in ROADMAP M2.7.

## Where things stand

- **Branch:** `feat/webkit-ai-ready` (PR #1170 in `aziontech/webkit`), up to date with `main` as of
  2026-11-12. Upcoming major **v6**.
- **Milestone 1:** done (M1.1–M1.11). M1.10 has no open row that blocks anything.
- **Milestone 2:**
  - M2.1 CLI, M2.2 `llms.txt`, M2.3 docs site (`apps/docs`), M2.4 generative-AI components,
    M2.5 demos (`apps/demos`) and the end of Storybook, M2.6 search quality: done.
  - M2.9, the catalog completed from the design sample, the Console Kit and Cloudscape: all 13
    work packages done.
  - M2.11 prepared the merge and stops before it (the "Ready to merge" block lists what the owner
    has to do).
  - **M2.7 final AI evaluation:** run 1 done; the owner reviewed it and asked for 8 fixes, all
    merged (below). **Battery 2 is prepared but not run.**
  - **Deferred by the owner, start only when asked:** M2.8 marketing-site migration, the console
    migration (M2.10 row 1), the merge into `main` and the release.
- **Last verification (final state):** gates 15/15, lint and type-check clean, pushed. The fix lanes
  ran the visual suite on their merged trees: blocks 315/315, examples 753/753, demos and geometry
  107/107.

### The 8 owner fixes after run 1 (all merged)

| #   | Owner finding                                 | Fix                                                                                                                                                          |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Extra band under the footer on the site pages | `Footer` checks slot presence at render time; mark placed by CSS only; check `computed-slot-presence`; lint `webkit/no-wrapped-page-chrome`                  |
| 2   | Contact: two blocks must be halves            | `CardGrid` `layout="balanced"` by default (never an empty cell)                                                                                              |
| 3   | Docs home far from the reference              | `CopyPromptButton` (AI-tool marks), `DocHero`, `DocAgentCard`; `shells/documentation#Landing` rebuilt; framework colours                                     |
| 4   | Command and its output in one block           | `CodeBlock` `kind="output"`; `$ ` prompt not copied; `DocCodeGroup` `output`; lint `webkit/no-output-in-command`; `rules/webkit-code-samples.md`             |
| 5   | Code blocks must show the language            | Language label on by default, with a name map                                                                                                                |
| 6   | ⌘K search missing everywhere                  | `SearchTrigger` binds ⌘K / Ctrl K; 76 files migrated; in every header/shell by default; lint `webkit/header-search-trigger`; `rules/webkit-header-search.md` |
| 7   | Diagram connectors on the box sides           | Connectors run centre to centre                                                                                                                              |
| 8   | `azion deploy` text must stay orange          | `--code-sintax-function` = primary-700 light / primary-500 dark                                                                                              |

### Open M2.10 rows (not blocking battery 2)

| Row | What                                                                  | Who / when                   |
| --- | --------------------------------------------------------------------- | ---------------------------- |
| 1   | Console migration                                                     | Deferred by the owner        |
| 8   | AI usage check "add an assistant to the workload page"                | Next M2.7 run                |
| 13  | Rubik 404 on fonts.azion.com                                          | Whoever deploys `apps/fonts` |
| 42  | Three sample scenes not ported                                        | With M2.8                    |
| 44  | Whole-page site parity needs a page renderer                          | With M2.8                    |
| 48  | Deploy `apps/docs` to webkit.azion.app                                | Owner of the Azion account   |
| 49  | Re-shoot baselines with real fonts                                    | After row 13                 |
| 51  | ProductWidget mock text overflows at 200 % zoom (Firefox/WebKit)      | Small decision + fix         |
| 52  | Two flaky tests under load                                            | Fix if they fail again       |
| 53  | Country/State/City autofill with a password manager                   | Manual 1Password check       |
| 54  | 9 components still cache slot presence in `computed()` (bug of fix 1) | Code fix, one per component  |
| 55  | Folded `SearchTrigger` has no visual tooltip                          | Code fix                     |
| 56  | `SearchTrigger` unfolds at 42rem; some blocks used 47rem              | Pick one threshold           |

## Set up on a new machine

```bash
git clone https://github.com/aziontech/webkit.git && cd webkit
git checkout feat/webkit-ai-ready
corepack enable && pnpm install
pnpm icons:build
cd packages/webkit && node scripts/gates.mjs          # expect 15 of 15
cd ../.. && pnpm --filter @aziontech/webkit lint && pnpm --filter @aziontech/webkit type-check
```

- Browser tests and the visual suite run in `mcr.microsoft.com/playwright:v1.62.0-noble`
  (`apps/visual`: `visual:test`, `visual:update`). Vitest browser tests run unstyled: no geometry
  asserts there; use `-t <name>` for the harness files.
- On a small machine run docs/demos builds and the visual suite one at a time (they take 8 GB heaps).
- Commit identity used on the branch: `rafaelumann <rafaelumann@users.noreply.github.com>`, message
  ending `Co-Authored-By: …`. Commits go to `feat/webkit-ai-ready` only.

## How the work is done (rules every agent followed)

- **Spec first** for any component change: `.specs/<name>.md` (template 2, `## Examples`) → body
  checksum (`bodyChecksum(parseSpecFile(p).body)` from `.claude/hooks/_lib/spec.mjs`) → `.vue` → test
  (behaviour, keyboard, axe, RTL) → example in `packages/webkit/examples/` → export + size budget →
  `node scripts/build-catalog.mjs` (catalog + `llms/`).
- **A defect the owner finds is fixed in WebKit itself** so the next AI gets it right untold: the
  component, its default, the Do/Don't in the spec, the `skills/webkit-*` skill, `rules/` when it is
  a hard rule, the block `guidelines.md`, a lint/check rule when detectable, a test and a reviewed
  visual baseline.
- `src/test/a11y-known.json` stays empty. Built-in strings go in en/pt-BR/es (new groups also in the
  default export list at the bottom of `en.ts`). Logical (RTL-safe) utilities only.
- Design source order: the design sample (`origin/design/sample`, `apps/webkit-sample`) > the Console
  Kit > Cloudscape. No design approvals: decisions are made and written down. Rubik is the font.
  Async/deploy toasts offer **Edit** + **Redeploy**, never "View deployments".
- Nothing is left behind: anything unfinished becomes a row in ROADMAP M2.10.
- Never push to the console or site repositories. No merge into `main`, no release, until the owner
  asks.

## Next: M2.7 battery 2 (prepared, not run)

**Goal (owner's request):** AI agents rebuild **all 46 site pages and 20 console screens** with the
updated WebKit; capture each result at desktop 1440 and iPhone 15; publish **two** side-by-side
comparison pages (one desktop, one iPhone, reference left, AI right); list the adjustments still
needed in WebKit.

**Material:**

- `packages/webkit/docs/reviews/m2.7/battery-2-kit/` — the reference kit (in this repo):
  - `README.md`: how the 66 references were captured (device profiles, themes, page list, fixes).
  - `pages.eval.json`: **what an agent gets** — one entry per page with the copy and structure, with
    the WebKit block-name hints (`▸` lines) stripped.
  - `pages.json`: the same with the hints (for the evaluator only).
  - `site-pages.json` and `structure/`. The capture scripts the README calls `tools/` are in
    `battery-2-capture-tools.tar.gz` on the preview server (paths inside are from the old machine).
- Reference screenshots (132 PNGs, 56 MB): `battery-2-ref-shots.tar.gz` on the preview server
  (`http://69.62.103.31:7090/compare/handoff/`), or recapture with the capture scripts (site from
  https://www.azion.com/en/, console from the design sample built at commit `06094cfce`, because the
  head of `design/sample` renders blank).
- Run 1, for the method: `packages/webkit/docs/reviews/m2.7/run-1/` (`SCORES.md`, `FINDINGS.md`,
  journals A/B/C, `GAPS-C.md`, `compare.html`) and the owner's feedback screenshots in
  `m2.7/owner-feedback/`; run-1 screenshots and AI outputs in `run-1-material.tar.gz` on the same
  server; live viewer `http://69.62.103.31:7090/compare/m27/`.

**Steps:**

1. Pack fresh tarballs from this branch: `pnpm pack` in `packages/webkit`, `packages/theme` and
   `packages/icons` (run `pnpm icons:build` first).
2. Rebuild by AI only. About 7 agents in parallel: 4 for the site (about 12 pages each; dark theme
   only, as the site) and 2–3 for the console (light). Each agent starts an empty Vite + Vue app,
   installs the three tarballs, and learns WebKit **only from the package** (its `llms/`, skills,
   rules, catalog, CLI). It gets its pages from `pages.eval.json` plus the reference screenshots,
   and writes a `JOURNAL.md` of where WebKit was unclear or missing.
3. Capture every AI page with the same profiles as the references: desktop 1440×900 full page (DPR 1)
   and Playwright `devices['iPhone 15']` full page at CSS scale (393 px wide).
4. Build two pages, `desktop.html` and `iphone.html`: reference and AI side by side per page, with
   filters by surface (site / console) and an overlay toggle, as `/compare/m27/` does. Publish them
   where the owner can open them.
5. Score fidelity 0–5 per page, write the findings ranked by impact, and turn each WebKit cause into a
   fix (rules above) or an M2.10 row. Record the results under ROADMAP M2.7.

## Prompt to resume in a new AI session

> You are continuing work on WebKit, Azion's Vue 3 design system (`aziontech/webkit`, branch
> `feat/webkit-ai-ready`, PR #1170, upcoming v6). Read `HANDOFF.md` and then `ROADMAP.md` at the
> repository root before anything else, and follow the rules in "How the work is done". I make no
> design approvals: you decide and write the decision down. Do not merge into `main`, release, or
> push to the console or site repositories; commit only to `feat/webkit-ai-ready`. Deferred until I
> ask: M2.8, the console migration, the merge and the release. Your task: run M2.7 battery 2 as
> described in `HANDOFF.md` ("Next: M2.7 battery 2"), then fix in WebKit what the comparison shows,
> each fix with spec, default, guidance, lint when detectable, test and visual baseline. Keep going
> without stopping until it is done; put anything you cannot finish in ROADMAP M2.10.
