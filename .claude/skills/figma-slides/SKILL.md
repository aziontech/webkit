---
name: figma-slides
description: Build an Azion-styled deck in Figma Slides from the /preview HTML deck — the framed 1920x1080 canvas, the token-resolved palette and type ladder, the layout library, the coordinate bridge, and what motion Figma Slides can and cannot carry.
status: active
last_updated: 2026-08-31
scope: webkit
enforced_by: [styling, migration, accessibility, dependencies, review]
---

# Skill: figma-slides

## Purpose

Produce a presentation that is unmistakably Azion — the **framed grid**: one bordered box per
slide with a registration tick in each corner, hairline dividers nobody draws twice, the type
ladder from `@aziontech/theme`, the brand orange used once per slide, and nothing rounded,
floating or invented.

It does that by building the deck **twice, in one direction**: first as HTML at `/preview` in the
sample app, then in Figma Slides from the coordinates the preview yields. The preview is not a
mock-up of the deck — it _is_ the deck, laid out on the real 1920x1080 artboard using the real
design system, and every number the Figma build needs is measured off it rather than invented.

## When to invoke

- The user asks for a deck, a presentation, or slides in the Azion style.
- The user asks to push the `/preview` deck into Figma, or to restyle an existing Figma Slides
  deck to match the design system.
- The user brings deck **content** from elsewhere (a Google Slides deck, a doc, an outline) and
  wants it wearing our design.

## The ordering rule, and why it is not negotiable

> **Content is the input. The design system is the source. The HTML preview is the spec. Figma is
> the output.**

A deck designed straight into Figma has nothing to check itself against: a colour is whatever was
picked that afternoon, a headline size is whatever looked right, and a token that changes next
month cannot reach it. Building the preview first inverts all three — the slide renders real
components against real tokens, so a wrong value is a visible defect rather than a plausible one,
and the whole deck re-renders when a token moves.

When the content comes from another deck, [`migration.md`](../../rules/migration.md) applies to it
exactly as it applies to a component: **take the content, rewrite the design.** Do not carry over
the source's colours, type sizes, drop shadows, rounded cards, icon style or slide furniture, and
do not try to reproduce its layouts. Read it for what each slide is _saying_, then choose the
layout from the library below that says that.

## Prerequisites

**Load the Figma skills first — they are mandatory prerequisites, not references.**

| Load                    | Before                                       |
| ----------------------- | -------------------------------------------- |
| `figma-use`             | every `use_figma` call                       |
| `figma-use-slides`      | every `use_figma` call against a Slides file |
| `figma-create-new-file` | every `create_new_file` call                 |
| `figma-use-motion`      | any keyframe work (see § Motion)             |

Pass them in `skillNames` (prefix with `resource:` if loaded via MCP resource).

**The libraries.** These are subscribed to the design-system file and are where the Figma-side
components and variables live. Scope a `search_design_system` call with the key you need:

| Library                                  | `libraryKey`                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Webkit                                   | `lk-39894be92786d3b34eef6328f64da01a78746398089b5d043cdefd879c22a6b89030aa6afd76947880f509c571838000bbbc59c0c78d2709569593e98ee31e04` |
| Azion Design System Components           | `lk-a5953fad27a3383ad6bbb26a7f60bf44a1f64e2a49ff24fb204abf043f2191010cdc51a5fd3a0abe60e3ea51a04289c1885f470d15d9b8d01e719dd0c84e39cf` |
| Assets (marks, logos)                    | `lk-48b353997ad5a05c859f6c6eccaad3a5e91919ba75f3ce167efcd4505395580f398e706c52e6da3b891447e92247633995640cfcaa75025c2cd6e949916c76e0` |
| Azion.com (the marketing frame language) | `lk-93b70f5a356da61103e5a1ab58ed8e85c7f251c95d718acb753728bcaa76c9e685262bfbe9961dcfe9b68b870c73c948a10edaee1e98aa3b7bdcdf24ce854507` |

**Fonts — the one that will bite you.** The deck uses three families: **Sora** (copy), **Roboto
Mono** (code), and **Proto Mono** (overlines, big numbers). Sora and Roboto Mono are on Google
Fonts and are available in Figma. **Proto Mono is proprietary and is not** — it loads in the
browser from Azion's own font CDN, which Figma cannot reach.

So before the first text mutation:

1. Call `listAvailableFontsAsync()` and check all three families **and the exact style strings**
   (Figma's names are not guessable — Inter's is `Semi Bold` with a space).
2. If Proto Mono is missing, **stop and tell the user** it has to be added to the organisation's
   font service or installed locally with the Figma desktop app running. Then either wait, or
   proceed with `Roboto Mono` in its place and **say so in the summary** — an overline in the
   wrong face is the one substitution that reads as off-brand immediately.
3. Never silently fall back. A missing font throws
   `Cannot write to node with unloaded font` on the first mutation, and guessing a style name is
   the most common cause of that error even when `loadFontAsync` was called.

## Phase 0 — read the source of truth

1. **The design language.** [`DESIGN.md`](../../docs/DESIGN.md) for the token catalogue,
   [`CONTAINERS.md`](../../docs/CONTAINERS.md) for the framed grid and the one-frame principle.
2. **The canvas contract.** `apps/webkit-sample/src/preview/lib/deck-canvas.js` — the geometry,
   the pinned tokens and the resolved palette, in one module that the preview and this skill both
   read. **If a number in this file and that module ever disagree, the module wins.**
3. **The deck.** `apps/webkit-sample/src/preview/data/deck.js` — one entry per slide: `kind`,
   `section`, copy, `notes`. Content edits happen here and nowhere else.
4. **An existing Figma deck**, if the task is to restyle one. `get_metadata` does **not** work on
   Slides files — inspect with a read-only `use_figma` script and `get_screenshot`. Modify slides
   in place; never delete and rebuild unless the user asked to start over.

## Phase 1 — the canvas contract

Every number below is a design-system token resolved for a fixed artboard. Nothing here is a
round number someone liked.

|                 | Value                                     | Where it comes from                                           |
| --------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Canvas          | `1920 x 1080`                             | what Figma Slides gives you                                   |
| Frame           | `1620 x 888` at `(150, 96)`               | width is `--container-7xl`; vertical inset is `--spacing-xxl` |
| Frame rules     | 1px, `--border-default`                   | the page layer's hairline                                     |
| Corner ticks    | `6 x 6` filled, inset `4` from both rules | `FrameBox`'s own `m-1 size-1.5`                               |
| Frame padding   | `96`                                      | `--spacing-xxl`                                               |
| Content box     | `1428 x 696` at `(246, 192)`              | frame minus padding                                           |
| Grid            | 12 columns of `97`, gutter `24`           | `12x97 + 11x24 = 1428`, exactly                               |
| Headline cap    | `1024`                                    | `--container-4xl`, the system's hero cap                      |
| Description cap | `752`                                     | `--container-2xl`                                             |
| Statement cap   | `1192`                                    | `--container-5xl` — for a slide that IS its headline          |

**Why the frame takes the widest container.** A slide is chrome held at the two ends of a fixed
canvas, not a column of prose read down a scrolling page — the same argument that gives the
marketing site's top bar `--layout-measure-site-header` while its page frame takes
`--layout-measure-site`. The **copy inside** is then capped exactly as the site caps its hero
copy, which is what keeps a 56px headline in the same proportion to its measure here as on
azion.com.

**Why the tokens are pinned.** The theme's spacing and type scales carry breakpoint maps resolved
against the window. A slide has no window. The preview's stage re-declares those custom
properties at their widest step (`CANVAS_TOKENS`), which is why every value in the tables below is
a single number and not a range — and why the preview must never be built responsively.

## Phase 2 — the translation tables

### Colour — dark only

The deck is dark, like the marketing site: the framed language was designed against
`--bg-canvas` at `#000000`, and the hairlines and corner ticks are tuned to read on it. Do not
produce a light variant unless the user asks; it is a different set of border decisions, not a
palette swap.

| Token                 | Hex         | Role on a slide                                        |
| --------------------- | ----------- | ------------------------------------------------------ |
| `--bg-canvas`         | `#000000`   | the slide                                              |
| `--bg-surface`        | `#0A0A0A`   | the evidence half of a split, a code panel             |
| `--bg-surface-raised` | `#141414`   | one step further in, rarely needed                     |
| `--text-default`      | `#FAFAFA`   | headlines, claims, figures in a cell                   |
| `--text-muted`        | `#808080`   | every supporting line                                  |
| `--text-disabled`     | `#4D4D4D`   | a section index, a cell number                         |
| `--border-default`    | `#2B2B2B`   | the frame, cell-grid rules, corner ticks               |
| `--border-muted`      | `#242424`   | rules _inside_ a block (list rows, an aside)           |
| `--primary`           | `#F3652B`   | the overline, one figure, one CTA — **once per slide** |
| `--primary-mask`      | `#FE601F33` | a diagram fill that must be seen but not read          |
| `--accent`            | `#0072F5`   | a second path or state; never as a second brand colour |

The 0-1 float form of each is in
[`references/build-preamble.md`](references/build-preamble.md). Contrast note: `--text-muted` is
`3.95:1` on the canvas — fine for a slide's supporting line at 18px, **not** for anything a
reader must parse.

### Bind variables, don't paint literals

Before falling back to a literal fill, `search_design_system` the Webkit / Azion Design System
libraries for the token's Figma variable and bind it (`setBoundVariable`). A bound deck re-themes
with the library; a painted deck does not, and the drift shows the first time the brand orange
moves. Use the literals only for a token with no variable, and say which ones you had to paint.

### Type

`lh` is PERCENT (the tokens are unitless multipliers). `ls` is PIXELS. Case is `UPPER` only where
the token bakes it in. **Verify every style name with `listAvailableFontsAsync()` first.**

| Token                | Family      | Style   | Size | lh     | ls  | Case  |
| -------------------- | ----------- | ------- | ---- | ------ | --- | ----- |
| `text-heading-2xl`   | Sora        | Regular | 56   | 125%   | —   | —     |
| `text-heading-xl`    | Sora        | Regular | 36   | 125%   | —   | —     |
| `text-heading-lg`    | Sora        | Regular | 30   | 125%   | —   | —     |
| `text-heading-md`    | Sora        | Regular | 24   | 125%   | —   | —     |
| `text-heading-sm`    | Sora        | Regular | 18   | 137.5% | —   | —     |
| `text-body-lg`       | Sora        | Regular | 18   | 137.5% | —   | —     |
| `text-body-md`       | Sora        | Regular | 16   | 137.5% | —   | —     |
| `text-body-prose-md` | Sora        | Light   | 16   | 162.5% | —   | —     |
| `text-label-md`      | Sora        | Regular | 14   | 150%   | —   | —     |
| `text-label-sm`      | Sora        | Regular | 12   | 150%   | —   | —     |
| `text-overline-md`   | Proto Mono  | Medium  | 14   | 137.5% | 1.6 | UPPER |
| `text-overline-sm`   | Proto Mono  | Medium  | 12   | 137.5% | 1.6 | UPPER |
| `text-big-number-lg` | Proto Mono  | Regular | 56   | 125%   | —   | —     |
| `text-big-number-md` | Proto Mono  | Regular | 36   | 125%   | —   | —     |
| `text-label-code-md` | Roboto Mono | Regular | 14   | 100%   | —   | —     |
| `text-body-code-sm`  | Roboto Mono | Regular | 12   | 162.5% | —   | —     |
| `text-button-lg`     | Sora        | Regular | 14   | 125%   | —   | —     |
| `text-amount-lg`     | Sora        | Regular | 56   | 125%   | -8% | —     |

Two things this table decides for you:

- **56px is the ceiling.** No semantic text token in the system goes higher, so the deck's
  hierarchy comes from composition — the frame, the hairlines, the overline, the corner ticks —
  and not from display type. That is the Azion register, and it is why these slides read as
  technical drawings rather than as posters. See § Theme gaps if a deck genuinely needs more.
- **Never set a size the table does not list.** A one-off font size on a slide is the same defect
  as a one-off font size in a component ([`styling.md`](../../rules/styling.md)); if none fits,
  that is a theme gap to record, not a number to type.

### Spacing

Seven steps, pinned. Every gap, pad and inset on a slide is one of these — there is no eighth.

| Token           | px  | Typical use on a slide                                  |
| --------------- | --- | ------------------------------------------------------- |
| `--spacing-xxl` | 96  | the frame's bezel and its inner padding                 |
| `--spacing-xl`  | 48  | between the head block and the body                     |
| `--spacing-lg`  | 24  | grid gutter; between overline, headline and description |
| `--spacing-md`  | 16  | inside a list row, between a figure and its caption     |
| `--spacing-sm`  | 12  | tight label pairs                                       |
| `--spacing-xs`  | 8   | a row's own vertical padding in a dense specimen        |
| `--spacing-xxs` | 4   | the corner tick's inset                                 |

### Shape and elevation

`--shape-flat` (`0`) for anything structural — every band, cell and frame on a slide is square.
`--shape-button` / `--shape-elements` (`6px`) only on a real control or chip; `--shape-card`
(`8px`) is the ceiling and is rarely right here. **No shadow anywhere**: in this language a shadow
means _floating_, which belongs to overlays and has no meaning on a slide.

## Phase 3 — the layout library

Sixteen `kind`s, each a composition rather than a template. They are implemented in
`apps/webkit-sample/src/preview/components/`, and `SlideRenderer` maps `kind` to one of them
along with three stage decisions: **bleed** (the layout draws to the frame's rules and owns its
own padding), **hatch** (the frame's texture, for a band with no content of its own) and
**frame** (off for a layout that draws its own perimeter — only `cover` does, and it needs the
whole canvas because its mark and platform line sit outside the frame it drew).

| `kind`             | Composition                                                                                                                                                                                                                                                                 | Bleed | Hatch |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----- |
| `cover`            | Its OWN perimeter — rounded, top-left corner cut on the diagonal, three squares in the cut — the headline left, the `dither` panel on the last 5 columns, the mark and platform line below the frame                                                                        | —     | —     |
| `title`            | The hero, verbatim: overline, headline with an orange gradient phrase, description, then a footer strip with the mark and the deck's metadata over a `--border-muted` rule                                                                                                  | —     | —     |
| `section`          | A divider: the index in the display face at the frame's top-left, the section name and one line at the bottom-left                                                                                                                                                          | —     | ✓     |
| `statement`        | One sentence at `heading-xl`, vertically centred, capped at 1192. Nothing else                                                                                                                                                                                              | —     | —     |
| `quote`            | A sentence at `heading-lg` over a rule, attribution as an overline below                                                                                                                                                                                                    | —     | —     |
| `testimonial`      | A photograph full bleed, desaturated, cut by the frame's rules under one flat veil; the sentence on an opaque `--bg-surface` card over the first 4 columns, a hanging orange quote glyph, a half-measure orange rule, then the name and the role                            | ✓     | —     |
| `bullets`          | Head block, then claims across 7 columns as hairline-divided rows, and an aside table on the last 4                                                                                                                                                                         | —     | —     |
| `backdrop`         | The network map full bleed on its own `slide` framing, cut by the frame's rules, under a left-to-right wash; head block, hairline claims, a monochrome mark row and one closing line on the first 6 columns, and a route annotated ON the map — two discs and a dashed line | ✓     | —     |
| `vision`           | A claim block at the top, three hairline pillars at the bottom, and a turning globe between them — the same map spun inside a circular crop the frame cuts on two sides                                                                                                     | ✓     | —     |
| `split`            | Two halves in a `gap-px` grid: the argument left on the canvas, the evidence right on `--bg-surface`                                                                                                                                                                        | ✓     | —     |
| `grid`             | A padded header owning its bottom rule, then 2-4 hairline cells, each with an index, a title and a line                                                                                                                                                                     | ✓     | —     |
| `metrics`          | Same header, then 3 or 6 figures in the display face over their captions — six as two rows of three, one wall                                                                                                                                                               | ✓     | —     |
| `specimen-type`    | The type ladder: one row per token, the sample rendered _by_ that token, the spec beside it                                                                                                                                                                                 | ✓     | —     |
| `specimen-spacing` | The seven steps as bars measured by their own token, the canvas geometry at 1:4, the 12 columns at 1:1                                                                                                                                                                      | —     | —     |
| `specimen-motion`  | Durations and curves as live bars running the real tokens                                                                                                                                                                                                                   | —     | —     |
| `closing`          | The hero shape again, with real buttons                                                                                                                                                                                                                                     | —     | ✓     |

### The rules the library obeys — carry them into Figma

- **One rule per edge.** Every hairline is owned by exactly one element; the neighbour draws
  nothing. In Figma this means **drawing rules as 1px rectangles, not as frame borders** — two
  bordered frames sharing an edge composite into a heavier line, and there is nothing to point
  at when they do. `addRule` in the preamble is that rectangle.
- **A cell grid's internal rules are gaps.** In the browser a `gap-px` over a filled wrapper
  shows through as 1px rules and each cell fills its own background. In Figma, draw the wrapper
  fill, then the cells, then let the 1px gaps between them show the wrapper — same construction,
  same guarantee of one line per junction.
- **A bleeding layout has no perimeter.** Its outer edge is the frame's rules. Never draw a
  second border 96px inside the first.
- **The brand orange appears once per slide.** The overline, or one figure, or one CTA — not two.
  `testimonial` is the single exception, and only because its two marks are one signature: the
  hanging glyph opens the sentence and the rule closes it, on a card that carries no overline
  and no other accent anywhere on the slide.
- **Vertical extremes are deliberate.** `title` and `closing` fill the frame; `section` pushes its
  two blocks to opposite edges; `statement`, `quote` and `bullets` centre. A content slide whose
  copy ends halfway down leaves a void the frame points straight at.
- **A slide whose ground is artwork gets an IMAGE, not vectors.** `vision` and `backdrop` are
  drawn on the site's map — ~5,000 single-cell squares plus a 78-cell accent field. Export the
  rendered layer from the preview and place it as a fill; drawing it cell by cell through the
  Plugin API is thousands of nodes for a texture nobody will select. The wash over it is a
  rectangle with a linear gradient, and it goes ABOVE the image, which is what makes the copy
  column legible. Anything annotating the map — `backdrop`'s two discs, its labels and its
  dashed line — is drawn as real nodes ON TOP of that image, at the coordinates the measure
  script reports, so it stays selectable and editable in Figma. `testimonial`'s ground is
  already a photograph: place the file itself, set the fill's `saturation` to -1 rather than
  exporting a desaturated copy, and draw the veil as the rectangle above it.
- **Layout variety is a check, not a hope.** Read the deck's `kind` sequence before building. Four
  `bullets` in a row is a deck nobody finishes; rearrange in `deck.js`, which costs nothing, not
  in Figma, which costs a rebuild.

## Phase 4 — the coordinate bridge

Do not invent positions and do not eyeball a screenshot. Run the preview and measure it:

```bash
cd apps/webkit-sample && npx vite build && npx vite preview --port 4319 --strictPort &
OUT=/tmp/deck.json node .claude/skills/figma-slides/references/measure-preview.mjs
```

[`references/measure-preview.mjs`](references/measure-preview.mjs) emits, per slide, every element
that actually paints, with **absolute artboard coordinates** and its **class list** — and the
class list carries the token names (`text-heading-xl`, `text-(--text-muted)`, `bg-(--primary)`),
so no colour or size has to be reverse-engineered from a computed pixel. Look each class up in
the tables above.

Two cautions. Coordinates come back through a division by the stage scale, so they can land ±1px
off: take the frame, content box and grid from the contract in Phase 1 (exact), and the measured
values for everything inside. And the script waits for the deck's own entrance motion to settle —
a box measured mid-transition is a wrong box.

## Phase 5 — build

Follow `figma-use-slides`' two-phase deck workflow, with this deck's specifics:

1. **Plan the whole deck before the first `use_figma` call** — one line per slide naming its
   `kind`, its section row, and its copy. The plan comes from `deck.js`; you are not re-designing
   here.
2. **Paste [`references/build-preamble.md`](references/build-preamble.md) verbatim at the top of
   every build script.** Geometry, palette, type, the batched font load, and the append-first
   helpers. Copy it per batch; do not re-derive it — a palette re-typed halfway through is a deck
   that changes colour halfway through.
3. **`appendChild` before `x`/`y`, at every level of nesting.** New nodes in a Slides file are
   auto-parented at absolute `(240, 240)`, so a position written first lands at
   `intended - 240`. The bug is intermittent, so one frame looking right proves nothing, and
   **compensating by adding 240 back makes the next run worse**. Use the helpers.
4. **3–5 slides per call**, structurally similar ones batched together. Slides are independent
   subtrees, so large batches are safe.
5. **Validate every batch** with the batch validation script from `figma-use-slides`
   (`slide-gotchas.md`) — overlaps, text clipping, out-of-bounds, in ~3 seconds. If it is clean,
   move to the next batch without a screenshot or a re-plan.
6. **Screenshot at two checkpoints only**: after the first batch (does the visual system read?)
   and after the last (overall quality). Then compare against the preview's own render of the
   same slide — that comparison is the actual acceptance test for this skill.

## Phase 6 — motion

Motion in Figma Slides is **narrower than the design system's motion**, and pretending otherwise
produces a deck whose animation nobody can find. What is true today:

- **`setSlideTransition()` throws "not implemented".** Per-slide transitions cannot be set through
  the Plugin API at all. Set them by hand in the editor, and tell the user which values to pick:
  a chrome-scale change is `moderate-01` / **150ms** on `productive-entrance`; a full-bleed
  statement or section divider is `slow-02` / **700ms** on `expressive-entrance`. Both come from
  `primitives/animations/animate.js`; never type a duration the token set does not contain.
- **On-slide keyframes are gated.** The motion API sits behind the `metronome` user feature flag.
  Load `figma-use-motion`, and if a motion property throws `is not a supported API`, **bail out
  immediately** — say motion is not enabled for this user and stop. Do not retry.
- **When it is available**, keep the deck's motion to what the catalogue already names:
  `popup-scale-in` for a card arriving, `fade-in` for a block, `flow-dash` for a connector, the
  staggered line entrance the code panel already uses. No new easing curves, no bespoke
  timings — the four curves in the specimen are the whole vocabulary.
- **Duration ceiling.** Nothing decorative runs longer than 5 seconds unless it is pausable
  ([`DESIGN.md`](../../docs/DESIGN.md) § Forbidden in animations), and nothing spins without
  `aria-hidden` on the web side.
- **The reduced-motion contract is the preview's job.** Figma has no `prefers-reduced-motion`, so
  the `motion-reduce:` fallback lives in `/preview` — and the motion specimen slide is where the
  deck _states_ the durations and curves rather than only performing them. Keep that slide: it is
  how a deck about motion survives being exported to a static PDF.

## Phase 7 — sections and speaker notes

- **Sections are slide-grid rows.** A run of consecutive slides sharing `section` in `deck.js` is
  one `SLIDE_ROW`, and its `name` is what the editor labels beside the row and what Presenter View
  lets a speaker jump between. `getSlideGrid()` returns plain arrays — setting `.name` on those
  silently no-ops. Walk to the real `SLIDE_ROW` under the `SLIDE_GRID` and set it there.
- **Speaker notes come from `deck.js` unchanged.** They are written and reviewed in `/preview`
  (each slide has them under a disclosure) and copied into `slide.speakerNotes`. Figma renders a
  subset of markdown: lists, bold, italic, strikethrough. **Headings, code spans and links are
  stored literally** — so a note with a backticked token name shows the backticks. Write notes
  that complement the slide (why a number matters, the question it prompts, where the source is),
  never notes that read it aloud.

## Verification

| Check                                       | How                                                                                                                         |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| The preview compiles and no slide overflows | `npx vite build`, then measure: every slide's `scrollHeight` must equal its `clientHeight`                                  |
| Coordinates match the contract              | the frame in `/tmp/deck.json` is exactly `150, 96, 1620 x 888`                                                              |
| No off-catalogue value                      | grep the built slide data for a hex literal, a font size the type table lacks, a gap the spacing table lacks                |
| Both renders agree                          | screenshot the same slide from `/preview` and from Figma and compare                                                        |
| Motion actually moves                       | sample the animated property across frames, or `export_video` + extract; `get_screenshot` only ever shows the resting state |

## Theme gaps to record, not to work around

- **No semantic text token exceeds 56px**, while the primitive scale reaches 128px. A deck for a
  large room may genuinely want a display step above `heading-2xl`. That is an entry in the
  theme's own `texts.data.js` plus a rebuild — a separate PR, and per
  [`git-workflow.md`](../../rules/git-workflow.md) a shared-token change does not travel with
  deck code. Until it lands, compose the hierarchy instead of enlarging the type.
- **Proto Mono is not available to Figma** without an organisation font upload. Record it; do not
  substitute silently.
- **Figma has no radial mask on a background fill**, so the frame's hatch is reproduced with a
  per-line opacity ramp rather than the CSS mask. It is a deliberate approximation — note it if
  the two renders are being compared closely.

## Hard prohibitions

- Do not design straight into Figma. The preview is built first, and the Figma build reads its
  coordinates.
- Do not carry a source deck's design across — its palette, type sizes, shadows, rounded cards or
  slide furniture. Take the content, rewrite the design
  ([`migration.md`](../../rules/migration.md)).
- Do not use a colour, a font size, a line height or a spacing value that is not in the tables
  above. If none fits, it is a theme gap.
- Do not draw a frame's rules as borders on adjacent frames — one rule per edge, drawn as a 1px
  rectangle.
- Do not put a second border inside the frame on a bleeding layout.
- Do not use the brand orange twice on one slide, and do not introduce a second accent.
- Do not round a structural band, and do not add a shadow to anything.
- Do not write `x`/`y` before `appendChild`, and never compensate a `(-240, -240)` drift by adding
  240 back.
- Do not call `figma.createPage()` in a Slides file, and do not treat `SLIDE_GRID` / `SLIDE_ROW`
  as frames — only `SLIDE` has fills and layout.
- Do not delete existing slides to rebuild them unless the user asked to start over.
- Do not invent a slide transition value, and do not retry a motion call that reported the API is
  unsupported.
- Do not add speaker notes the user did not ask for on an existing deck.

## Enforcement

- [`styling.md`](../../rules/styling.md) governs every value the preview uses — the token checks
  block a hex literal, a raw font size, a raw spacing value and a dead token shorthand at write
  time and again in the CI ratchet. The Figma tables above are those same tokens resolved, so a
  value that would fail the hook fails here too.
- [`migration.md`](../../rules/migration.md) is what makes "content in, design ours" a rule rather
  than a preference, for a Google Slides deck exactly as for a Radix example.
- [`accessibility.md`](../../rules/accessibility.md) carries the `motion-reduce:` obligation on
  every motion-bearing surface in the preview, and the reduced-motion contract the motion
  specimen documents.
- [`dependencies.md`](../../rules/dependencies.md) keeps the preview's motion in CSS and tokens —
  no animation runtime is installed, and `validate-references` blocks the import.
- **Review** owns the rest: whether a slide's composition earns its layout, whether the deck's
  `kind` sequence has variety, and whether the two renders actually agree. No gate can judge
  those.
