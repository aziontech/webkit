# M2.7 battery 2 — 66 pages rebuilt by AI from the WebKit package

Run on **2026-11-12**. AI builders rebuilt all **46 azion.com site pages** and **20 console screens** of the reference kit ([`../battery-2-kit/`](../battery-2-kit/)) with WebKit, learning WebKit only from its npm package. Every rebuild was captured with the same profiles as the references, compared side by side, and scored by independent judges.

## Comparison pages

- **Desktop 1440:** https://claude.ai/artifact/P6KDEkNDb3LL8hDyt61QfD
- **iPhone 15:** https://claude.ai/artifact/65sqkyQNsGU1BfvzNT6Nog

Each page shows the reference on the left and the AI rebuild on the right, with the score and the judge's notes, a site/console filter and an overlay toggle.

## Result

| Surface              | Pages  | Desktop  | iPhone   | **Page** |
| -------------------- | ------ | -------- | -------- | -------- |
| Site (dark)          | 46     | 4.00     | 3.85     | **3.92** |
| Console (light)      | 20     | 4.45     | 4.12     | **4.29** |
| **All**              | **66** | **4.14** | **3.93** | **4.03** |

Fidelity 0–5 on the run-1 scale. Every page was built; none scores below 3. Run 1 (16 pages, three builders) averaged 4.06; the eight pages rebuilt in both runs went from 4.09 to 4.38. Details: [SCORES.md](./SCORES.md).

The highest-impact WebKit causes ([FINDINGS.md](./FINDINGS.md)): `SiteNav` shows Login in the phone bar (34 pages); the illustration registry lacks the product-page scenes and has no visual index (20 pages); `ClientQuotes` cannot control autoplay (13 pages deducted); `SiteFooter` links have no external flag and the phone bottom bar differs (26 pages); `MediaSplitStack` cannot take a diagram, widget or framed image (8 pages); the collapsed `SearchTrigger` is oversized on touch (15 console pages). The builders' journals add what the screenshots cannot show: a fresh Vite vue-ts app does not type-check against the package (18 of 18 builders), and the lint wiring `init` writes blocks the first commit after a build (18 of 18).

## What ran

1. **Packages.** `pnpm pack` of `@aziontech/webkit` 5.12.0, `@aziontech/theme` 5.2.2 and `@aziontech/icons` 4.4.0 from `feat/webkit-ai-ready`. The run was set up at `be204072f`, but the tarballs were packed at 14:44 UTC, before that commit (14:57): the packed webkit still declares `@aziontech/theme ^4.0.0` as a dependency and its `init` still writes `latest`, both of which `be204072f` changed. The package code therefore matches `95012147e`, the parent of `be204072f`. `pnpm pack` exited 254 after writing a complete tarball (FINDINGS H8).
2. **Builders.** 18 headless Claude Opus 5.5 sessions (`claude -p --model claude-opus-5-5`, [`harness/run-job.sh`](./harness/run-job.sh.txt)), one per job of 2–4 pages: S1, S1b, S1c, S2, S2b, S2c, S3a–c, S4a–c for the site and C1, C1b, C1c, C2a–c for the console. Each got the brief rendered from [`harness/BRIEF.template.md`](./harness/BRIEF.template.md): its pages from `pages.eval.json` (copy and structure, with the WebKit block-name hints removed), the reference screenshots cut into tiles, and the three tarballs. Each started an **empty Vite + Vue 3 + TypeScript app**, installed the tarballs, and learned WebKit **only from the package** (README, `llms/`, `skills/`, `rules/`, `catalog`, `blocks/`, `examples/`, CLI); reading the repository, other jobs or the web was forbidden. Each built one route per page (site dark, console light), checked its pages with the capture helper, committed after every page, and wrote `JOURNAL.md` and `DONE.md`. The sessions ran 8–21 minutes each, between 14:48 and 15:12 UTC; all 18 finished.
3. **Capture.** Each built app was served as a static SPA and captured with [`harness/cap2.mjs`](./harness/cap2.mjs.txt) in `mcr.microsoft.com/playwright:v1.62.0-noble`, with the same profiles as the reference kit: desktop 1440×900 at DPR 1, full page; Playwright `devices['iPhone 15']` (393×659, DPR 3, touch) in Chromium, full page, saved at CSS scale (393 px wide). Site pages in the dark scheme; console screens in light, with the inner scroll container expanded so the full screen is shot.
4. **Comparison.** [`harness/compose.py`](./harness/compose.py.txt) builds the side-by-side tiles the judges read (reference left, AI right, magenta bar); [`harness/mkimg.py`](./harness/mkimg.py.txt) and [`harness/gen-compare.mjs`](./harness/gen-compare.mjs.txt) build the two published pages from [`harness/compare.template.html`](./harness/compare.template.html.txt).
5. **Judging.** Five independent judge agents (Claude Opus 5.5) followed [`harness/JUDGE.md`](./harness/JUDGE.md): score desktop and iPhone 0–5, write the visible differences, and name a cause for every deduction (`webkit`, `builder` or `harness`), verifying each `webkit` cause in the package source. They worked in batches (`console-1`, `mixed-4`, `site-1`, `site-2`, `site-3`, and `site-5` for the four S1 pages, which finished last); the merged result is [`scores.json`](./scores.json).

## Caveats

- **Fonts.** Rubik returns 404 from `fonts.azion.com`, so both sides render a fallback face; fonts were not scored.
- **Autoplaying quotes.** `ClientQuotes` cannot stop `QuoteTabs` autoplay, so the quote on screen depends on capture timing; the visible quote was not scored.
- **Package contamination.** The tarball shipped `docs/reviews/`, including this kit's `structure/` component trees and the run-1 journals. Two builders (S1b, S4c) used the structure trees as a section map; five read run-1 notes. See FINDINGS H5 and T14.
- **Console references are WebKit blocks.** The design sample was built from the same blocks the console builders copied, so console fidelity measures block discovery more than composition (as in run 1).
- The harness exit code 127 on nine jobs is an artifact of the runner script, not a failed session (FINDINGS H3).

## Files

| Path                                | What                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`SCORES.md`](./SCORES.md)          | Per-page desktop / iPhone / page scores by surface, means, and run 1 for context                                                                             |
| [`FINDINGS.md`](./FINDINGS.md)      | WebKit causes ranked by pages × severity, builder-reported causes, builder-cause patterns, harness notes; a Status column for the fix lanes                 |
| [`scores.json`](./scores.json)      | The judges' raw output: per page `desktop`, `iphone`, `page`, `notes`, and `causes` (`kind`, `severity`, `where`, `text`, `fix`)                            |
| [`journals/`](./journals/)          | Each builder's `JOURNAL.md` and `DONE.md`, verbatim                                                                                                          |
| [`harness/`](./harness/)            | Copies of the harness scripts, the builder brief and the judge brief. Scripts carry an extra `.txt` suffix (`cap2.mjs.txt`) so the package's authoring checks do not lint them as package code |

The reference and AI screenshots, the tiles and the builders' apps are not in the repository (about 270 MB of images, 6.4 GB of job folders with `node_modules`); they stay with the run material.

## Reproduce

Copy `harness/` out and drop the `.txt` suffix from the scripts first (`for f in *.txt; do mv "$f" "${f%.txt}"; done`). The scripts carry the absolute paths of the run machine (`/data/eval-m27b` for the run, `/data/claude/webkit` for this repository); change them, or recreate that layout. Prerequisites: Node 22+, pnpm, podman (or docker) with `mcr.microsoft.com/playwright:v1.62.0-noble`, Python 3 with Pillow, and the `claude` CLI.

1. **References.** Put the 132 reference PNGs in `<run>/ref/shots/` (`battery-2-ref-shots.tar.gz` on the preview server, or recapture them as [`../battery-2-kit/README.md`](../battery-2-kit/README.md) describes).
2. **Tarballs.** `pnpm icons:build`, then `pnpm pack` in `packages/webkit`, `packages/theme` and `packages/icons`; put the three `.tgz` files in `<run>/pkgs/`. Exclude `docs/reviews` from the webkit tarball first (H5).
3. **Jobs.** `node harness/mkjobs.mjs` writes `<run>/jobs/<JOB>/` with `pages.json`, `job.json`, the reference PNGs, their tiles ([`harness/tile.py`](./harness/tile.py.txt)) and the tarballs. It cuts six large jobs; battery 2 split them into the 18 jobs above (FINDINGS H4) by editing `job.json` / `pages.json` per job.
4. **Builders.** `harness/run-job.sh <JOB>` for each job (in parallel). It renders `BRIEF.md` with [`harness/render-brief.mjs`](./harness/render-brief.mjs.txt), runs one headless session, and resumes it if `.session` exists. Builders check their pages with [`harness/shoot.sh`](./harness/shoot.sh.txt).
5. **Capture.** For each job, `vite build`, then run `cap2.mjs` with `SERVE=<app>/dist:<port>` and a jobs file of `{ id, url, scheme, expand }` entries (site `dark`; console `light` with `expand: true`), output to `<run>/ai-shots/`.
6. **Tiles and pages.** `python harness/compose.py <ids…>` for the judges' tiles; `python harness/mkimg.py desktop <out>` and `node harness/gen-compare.mjs desktop <out>` (and the same with `iphone`) for the two comparison pages.
7. **Judges.** Give each judge [`harness/JUDGE.md`](./harness/JUDGE.md) and a batch of page ids; merge the batch files into `compare/scores.json`, then re-run `gen-compare.mjs` so the pages carry the scores.
