# Judge brief — M2.7 battery 2

You are an independent judge. AI builders rebuilt Azion pages with the WebKit design system (Vue 3), learning
WebKit only from its npm package. Score how faithful each rebuild is to its reference, and say **why** each
difference exists. Work only under `/data/eval-m27b/`; do not edit any app or anything outside
`/data/eval-m27b/compare/scores/`. Write everything in English.

## Material, per page id

- `/data/eval-m27b/compare/pairs/<id>--desktop-NN.jpg` and `<id>--iphone-NN.jpg`: side-by-side tiles, the
  **reference on the left**, the **AI rebuild on the right**, separated by a magenta bar, top to bottom. Desktop is
  1440 px wide per side (tiles shown at half scale); iPhone is 393 px per side. A solid red right side means no AI page.
- Full-size PNGs if you need detail: `/data/eval-m27b/ref/shots/<id>--<profile>.png` and
  `/data/eval-m27b/ai-shots/<id>--<profile>.png`.
- The page brief the builder got: `pages.json` in its job folder (`/data/eval-m27b/jobs/<JOB>/pages.json`).
  The evaluator version with WebKit block-name hints (`▸` lines) is
  `/data/claude/webkit/packages/webkit/docs/reviews/m2.7/battery-2-kit/pages.json` (read-only).
- The builder's code: `/data/eval-m27b/jobs/<JOB>/app/src/` (read-only), its `JOURNAL.md` and `DONE.md`.
- The WebKit package the builder used: `/data/eval-m27b/jobs/<JOB>/app/node_modules/@aziontech/webkit/` (read-only).

## Scale (fidelity 0–5, the same as run 1)

The score covers layout regions, components, content and copy, visible states, and the iPhone behaviour.

- 5: indistinguishable except for harness or data noise.
- 4: same regions and components, with small component or copy deviations.
- 3: same skeleton, but visible content or component substitutions.
- 2: several regions missing or wrong.
- 1: barely related.

Half points are allowed. Score desktop and iPhone separately; the page score is their mean. Ignore differences
that come only from fonts (Rubik does not load from fonts.azion.com in this harness, so both sides may use a
fallback), from frozen carousel or marquee offsets, and from timestamps.

## For every difference that costs points, name its cause

- `webkit`: WebKit made it hard or impossible. Missing component or variant, wrong default, broken block,
  misleading docs, a CLI/lint problem. Name the component, block, doc or command, and say what WebKit should do.
- `builder`: WebKit had what was needed and the builder did not use it or used it wrong. Name what existed (path
  in the package). These still matter: if several builders miss the same thing, WebKit's guidance failed.
- `harness`: capture or data noise.

Verify a `webkit` cause in the package source before you claim it.

## Output

Write `/data/eval-m27b/compare/scores/<BATCH>.json`:

```json
{ "<id>": { "desktop": 4.5, "iphone": 4, "page": 4.25,
            "notes": "one to three sentences on the visible differences, most important first",
            "causes": [ { "kind": "webkit", "severity": "high|medium|low", "where": "component/block/doc", "text": "…", "fix": "what WebKit should change" } ] } }
```

Then end with a short report: the mean per profile, the three worst pages and why, and the WebKit causes ranked by
how many pages they cost points on.
