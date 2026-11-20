# WebKit visual suite

`@aziontech/webkit-visual` is the styled visual regression of WebKit: Playwright screenshots, with
the real theme CSS, of the docs site's examples and blocks and of the demos. The browser unit
suite (`packages/webkit`, Vitest) runs without CSS and owns behavior, structure and ARIA; this
suite owns pixels: layout, color, contrast in context, focus rings, overflow.

```bash
pnpm build:docs && pnpm build:demos   # the suite serves apps/docs/dist and apps/demos/dist
pnpm test:visual                      # compare with apps/visual/baselines
pnpm update:visual                    # rewrite the baselines (only inside the Playwright image)
```

## What it covers

| Spec                          | Pages                                                                                                      | Matrix                                                                                                                                                                                                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/examples.spec.ts`      | `/example?path=<dir>/<file>` — the first example of every component                                        | light 1280, dark 1280, light 390                                                                                                                                                                                                                                  |
| `tests/blocks.spec.ts`        | `/frame/<state>/<id>` — the primary state of every block                                                   | light 1280, dark 1280, dark 390; every state of `ai/*` in light and dark at 320 and 1280 and right to left                                                                                                                                                        |
| `tests/demos.spec.ts`         | every demo route, plus the flows end to end                                                                | light 1280, dark 1280, dark 390; resource routes also light 1280 right to left in pt-BR                                                                                                                                                                           |
| `tests/geometry.spec.ts`      | styled geometry that the unstyled unit suite cannot see                                                    | `Table` cell presets at 360 / 768 / 1280, a reorder mid-drag beside frozen columns, the open `OverflowCount`, `OtpInput` at 320, team permissions, the token reveal and the account switcher at 320 / 1920 / right to left                                        |
| `tests/doubled-lines.spec.ts` | the docs home and foundation pages, the first example of every component, the primary state of every block | light 390 and 1280: fails on two visible borders flush or 1px apart                                                                                                                                                                                               |
| `tests/region-gaps.spec.ts`   | the same pages                                                                                             | light 390 and 1280: fails on two page regions (a surface over a surface or a heading) closer than `--layout-group-gap`                                                                                                                                            |
| `tests/keyboard.spec.ts`      | the same pages, plus every demo route                                                                      | light 1280: presses Tab through the page and fails on a control Tab never reaches, a stop with no visible focus ring, focus trapped outside a modal, the wrong entry focus, or Esc that skips the unsaved-changes guard, unless `keyboard-baseline.json` lists it |

## Keyboard sweep

`tests/keyboard.spec.ts` checks the console keyboard standard (owner decision 2026-11-20) on every
page it visits:

- **Reach**: every visible, enabled control (`button`, `a[href]`, a field, `[tabindex]` of 0 or
  more, `role=button|link|tab|menuitem|checkbox|switch|combobox`) is a Tab stop, outside inert or
  hidden regions. In a roving group (`radiogroup`, `tablist`, `toolbar`, `menu`, `listbox`, `grid`,
  `tree`) and among radios of one name, one member reached counts for the group. The sweep stops
  after 200 stops or when focus wraps.
- **Ring**: at every stop the control, its `::before` / `::after`, an ancestor (`focus-within`) or a
  neighbour (`peer-` and `group-` styles) shows an outline, a box shadow or a ring layer that it did
  not show before focus.
- **Trap**: focus never cycles without leaving the page, unless a modal is open. A text area or an
  editor gets one Escape before Tab, the way `CodeEditor` lets focus out; an iframe is stepped through.
- **Entry**: a task starts with focus in its first field; a page you browse starts on the body or
  the `h1`, or inside the overlay it opens. A block is a task when it is in the `create` group, and
  its `block.json` can say otherwise with `"keyboard": { "entry": "field" | "page" }`.
- **Esc**: a block whose `block.json` has `"keyboard": { "escape": "cancel" }`, and the demo's
  Create Resource page, open the unsaved-changes guard when Esc is pressed on a dirty form; the demo
  also leaves on Esc when the form is clean.

Known violations are listed per page in `keyboard-baseline.json`, which only shrinks: a new
violation fails the test, and a fixed one is reported as an annotation so the entry can go. The full
sweep runs against built sites and rewrites the baseline, keeping only what still fails (`--init`
records everything, for a first run only):

```bash
pnpm build:docs && pnpm build:demos
node ../docs/scripts/serve.mjs &   # PORT=4173
(cd ../demos && node node_modules/vite/bin/vite.js preview --port 4174) &
node scripts/keyboard.mjs                    # the CI scope at 1280
node scripts/keyboard.mjs --all --widths 390,1280   # every example and block state
node scripts/keyboard.mjs --write-baseline   # drop entries that pass now
```

New examples, blocks and demo routes are picked up from the files: add an example to
`packages/webkit/examples/<name>/` and the docs page and its visual test exist; the only manual
step is the baseline.

Each test fixes the clock (2026-11-10 12:00 UTC), the time zone (UTC) and the locale, reduces
motion, waits for fonts, and blocks every request that is not to `localhost` (remote avatars and
fonts render their fallback), so a screenshot changes only when WebKit does. States that
animate on timers (the `streaming` states of the AI blocks) run on Playwright's fake clock,
advanced a fixed 1.5 s. A comparison fails above 100 differing pixels (`maxDiffPixels`), small
enough to catch a legend swatch.

## Baselines

`baselines/` is committed and is the CI contract. Screenshots differ between machines (font
rasterization), so baselines are generated only in `mcr.microsoft.com/playwright:v1.62.0-noble`,
the image the `visual` job in `.github/workflows/governance.yml` runs in. To regenerate them for a
branch, dispatch `.github/workflows/visual-baselines.yml` (`pnpm update:baselines`) and
commit the artifact after reviewing it; the `baselines-regenerate` skill describes the flow. Locally,
run the suite inside the same image:

```bash
docker run --rm --ipc=host -v "$PWD":/w -w /w/apps/visual \
  mcr.microsoft.com/playwright:v1.62.0-noble npx playwright test
```

## Reviewing a change

Each place the suite runs leaves a page to review, linked from the run's job summary:

| Run                                                        | Artifact                  | What it shows                                                                         |
| ---------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `visual` job, a comparison fails                           | `visual-report-shard-<n>` | The Playwright HTML report: expected, actual and diff image of each failed screenshot |
| `visual` job, the pull request changes `baselines/`        | `visual-report-shard-<n>` | The same report for the shard, to confirm the new baselines pass                      |
| `visual-review` job, the pull request changes `baselines/` | `visual-baseline-review`  | Every added, modified and removed baseline, before and after, side by side            |
| `visual-baselines.yml` with `update_baselines=true`        | `visual-baseline-review`  | The committed and the regenerated baselines, side by side, for the files that changed |

Download the artifact, unzip it, and open `index.html` (for the Playwright report, run
`npx playwright show-report playwright-report`). The page comes from `scripts/review-baselines.mjs`,
which compares two folders of images; locally, after mirroring new baselines:

```bash
mkdir -p /tmp/before && git archive HEAD apps/visual/baselines | tar -x -C /tmp/before
node apps/visual/scripts/review-baselines.mjs --before /tmp/before/apps/visual/baselines \
  --after apps/visual/baselines --out apps/visual/baseline-review
```
