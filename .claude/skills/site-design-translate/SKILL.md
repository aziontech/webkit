---
name: site-design-translate
description: Translate a live marketing page (azion.com or any URL) into the webkit-sample Site, block for block, with its copy carried over verbatim and its layout re-expressed in our own page language — the site's marketing sections, assembled as page data. Use when asked to recreate, reshape, port, or "translate" a website page into /site.
scope: webkit
enforced_by: [migration, styling, dependencies, accessibility, no-invention, review]
---

# Translate a live page into the Site

You are given a URL. You produce a `/site` page that says **exactly what that page says**, in
**exactly the same blocks and the same order**, drawn in **our** page language.

Two halves, and they are not negotiable in either direction:

| Half | Rule |
| --- | --- |
| **Content** | Verbatim. Every headline, eyebrow, paragraph, list item, link label, stat, and mark that the source page renders appears on ours; nothing else does. No paraphrase, no tightening, no "improved" copy, no invented eyebrow, no dropped band. |
| **Form** | Ours. The source's grid, spacing, borders, colours, radii, and any positioning or animation library are **not** carried over. Every band becomes one of the site's sections (one per Storybook marketing template), and the page is a list of them — [`CONTAINERS.md`](../../docs/CONTAINERS.md) § A page is a list of sections. |

This is [`migration.md`](../../rules/migration.md) applied to a whole page: **never inherit,
always rewrite.** The source is the specification for *what*; our language is the specification
for *how*.

---

## Step 1 — read the page mechanically

Never translate from a screenshot, from memory of the site, or from the raw HTML by eye. Run the
extractor. It navigates the live page, dismisses the consent banner, walks the scroll so every
lazy band mounts, and writes an ordered block inventory plus one screenshot per band.

```bash
node .claude/skills/site-design-translate/references/extract-blocks.mjs \
  https://www.azion.com/en/ --out ./site-translate/azion-home
```

| Flag | Use |
| --- | --- |
| `--widths 1440,768,375` | Which viewports to read. The first is primary (the inventory and the band captures come from it); the others catch copy that only one breakpoint renders. |
| `--probe` | Click every tab / disclosure control once before reading, for content that mounts on activation. |
| `--out DIR` | Where to write. Defaults under `./site-translate/<host><path>`. |

It writes:

- **`blocks.md`** — the review-able inventory. One section per band: its shape, then every line of
  its copy. **This is the contract.** Read all of it before writing any Vue.
- **`blocks.json`** — the same, machine-readable, plus each band's verbatim `innerText`.
- **`band-NN.png`** — one capture per band, in order. Look at each one; the inventory tells you
  what a band *says*, and only the capture tells you what shape it *is*.
- **`page-<width>.png`** — the whole page, for the running order.

If Playwright cannot be resolved the script exits `2` and says so. Do not fall back to guessing —
say it is blocked.

### Bands the reader classifies for you

| Marker in `blocks.md` | What it means |
| --- | --- |
| `EMPTY (spacer)` | A rhythm band with no content. Ours is `<SectionGap hatch />`. |
| `viewport-tall` | A band about one screen tall. Candidate for `Hero kind="screen"`. |
| `repeating track (marquee)` | The band duplicates its own row for a CSS loop. It is **one** block, and the marks are listed once. |
| `N columns` | Measured from the cells' left edges, not from class names. |
| `horizontal scroller` | The band scrolls sideways: a marquee, a carousel, or a snap row. |

---

## Step 2 — map each band to a section

Go band by band, in order. For each one, name the section **before** writing anything. The
sections are the Storybook marketing templates (`Templates/Marketing/*`), ported to
`site/ui/sections/`. The mapping is fixed — it is not a menu of options:

| Source band | Our section |
| --- | --- |
| Opening band: `h1` + description + actions | `Heroes`, the `kind` that matches its shape (`centered-carousel`, `title-band`, `centered-band`, `pixel-floor`, `copy-beside-art`, `copy-on-top-art`); `HeroForm` when the opening holds a form |
| A logo strip / marquee of marks under the opening | The hero's `carouselMarks` + `carouselLabel` |
| A band that is only a heading (± eyebrow, ± description) | The heading of the section it introduces; it is never a section on its own |
| Three to six capabilities, guarantees or reasons (± glyph, title, sentence) | `CapabilityGrid` |
| A grid of product / primitive links in columns | `PlatformDirectory` |
| A grid of linked topics | `ResourceGrid`; with an illustration per card, `FeatureTiles` `illustrated` |
| A copy-beside-art band | `MediaSplitBand` (one action links the band, two leave it unlinked); a sticky run of them, `MediaSplitStack` |
| A row of tiles (picture over caption) | `FeatureTiles` |
| Tabs, one feature at a time | `FeatureTabs` |
| Copy beside code | `CodeSplit`; capabilities pinned beside their code, `StickyScrollCode` |
| Client testimonials | `ClientQuotes` with `quotesLedBy('<client>')` (site `data/solutions.js`) led by the source's quoted client; one quote alone, `QuoteBand`; marks beside one quote, `LogoWallQuote` |
| Analyst recognitions, client tiles, certifications | `RecognitionMarquee`, `ClientMosaic`, `ComplianceBadges` |
| A row of stats (big numeral + unit + label) | `StatsBand` |
| The network argument over the map | `NetworkSection`, `kind` by its floor: `quotes`, `benefits` or `stats` |
| Plans, plan matrix, tier matrix, competitor table | `PricingPlans`, `ComparePlans`, `CompareSupportTiers`, `ComparisonTable` |
| Deployable templates over a stack ticker | `TemplateGallery` |
| Linked guides | `ResourceGrid` |
| Questions and answers | `FaqSection` (rich answers through `body`) |
| An empty rhythm band | Nothing — `SitePage` puts a hatched gap between every two sections |
| The closing CTA | `ClosingCallToAction` (`split`, `panel`, or `frame` when the page ends with no ask) |

A band that fits none of them is not built by hand: add its Storybook template and its section
first ([`CONTAINERS.md`](../../docs/CONTAINERS.md) § Adding a band no section covers), then use it.

The page is then one list, and **only** that list:

```js
// site/data/pages/<page>.js
export const <PAGE>_PAGE = [
  { section: 'Heroes', kind: '…', … },   // the opening band, full-bleed
  { section: '…', … },                   // every band after it, in the source's order
  { section: 'ClosingCallToAction', … }  // the close
]
```

### Where the two halves collide, form wins

The source's numbers are **not** requirements. Three cases come up every time:

- **The source's hero is 500px tall.** Ours is `hero` — one viewport. Our rule wins.
- **The source pads a band 96px.** Ours is `--spacing-xl` band rhythm. Our token wins.
- **The source's eyebrow is a `<span>` in a bespoke uppercase style.** Ours is `Overline`, or
  `SectionTitle`'s / `HeroTitle`'s `eyebrow` prop. Our component wins.

What never bends is the **copy**, the **set** of blocks, and their **order**.

### The one-frame principle is not optional

The sections already obey it; it matters when you write a new one. Every edge is drawn once, by one owner ([`CONTAINERS.md`](../../docs/CONTAINERS.md) § the
one-frame principle). Translating a page is where this breaks, because the source draws its own
borders on every band and copying that shape gives you two hairlines on one pixel:

- The first brick in the column passes `:divided="false"` — the hero's `border-b` is its top edge.
- A band inside the column passes `borders="y"`: the vertical rules are the column's.
- A band under a `SectionGap` passes `flush` (and `marks="bottom"`) — the gap already drew that
  rule and ticked its corners.
- A cell inside a `gap-px` grid passes `borders="none" marks="none"` and fills its own
  `bg-(--bg-canvas)`. The seams are the gap; a bordered cell doubles them and a marked cell
  clusters four squares at every junction.

---

## Step 3 — resolve the assets honestly

A mark the source renders and we do not have is a **recorded gap**, never an invention.

1. Resolve every mark name against the app's own client / brand registry.
2. A name with an asset goes in, in the source's order.
3. A name with **no** asset is omitted, and the omission is stated in your final report. Do not substitute a similar logo, do not draw a wordmark from the name,
   and do not download a third party's asset into the repo as part of this task.
4. A tile that carries a client's own brand colour reads it from that registry (a brand's colour
   is a fact about the client, like its logo file) — never as a literal in the page.

---

## Step 4 — compose the page

Write the page data, `site/data/pages/<page>.js`, and a view that is `SiteLayout` around
`SitePage` — nothing else. Every string goes in as a section prop, in the source's words; an
action is `{ label, href, kind?, trailing?, external? }`. Data another page already holds (a
client strip, a quote, the Earth network band) is imported, never copied.

If you had to write a new section, its constraints are the repo's, in full —
[`styling.md`](../../rules/styling.md), [`dependencies.md`](../../rules/dependencies.md) (**no**
carousel, positioning, or animation library — a marquee is a CSS translate of a doubled track),
[`accessibility.md`](../../rules/accessibility.md) (one `h1` per page, headings in order, every
motion-bearing class paired with `motion-reduce:`), and tokens only.

**State what the source claimed and we changed.** When a decision departs from the source (a
band folded into the nearest section, an omitted mark, a two-tone headline expressed as a muted
title), say so in your final report. The next reader must not have to re-derive it from the live
site.

---

## Step 5 — verify against the source, mechanically

Serve the app and run the **same extractor** against our own page, then diff the two inventories.
This is what makes "exactly the same content" a checked claim instead of an intention.

```bash
node .claude/skills/site-design-translate/references/extract-blocks.mjs \
  http://localhost:5173/site/home --out ./site-translate/ours

node .claude/skills/site-design-translate/references/diff-inventories.mjs \
  ./site-translate/azion-home/blocks.json ./site-translate/ours/blocks.json
```

The diff reports, per side, every line of copy the other does not have, and the band counts.
Work the **missing** list down until every remaining line is one you can name a reason for, then
account for every **extra** line the same way. A leftover on either side is either a translation
artifact to fix, or a deliberate, stated departure — never something you leave unexplained. The
categories that legitimately survive:

| Leftover | Why |
| --- | --- |
| A mark's name spelled differently (`Banco Itaú` / `Itaú`) | Our registry's name for the same client. |
| An `alt` from art we replaced (a background photo, a product screenshot) | Our art is different art; the copy it sat next to is still here. |
| A mark we have no file for | The recorded asset gap. |
| A source anchor whose label concatenates a headline and its action | We split those into a paragraph and a real control; both strings are present separately. |
| A name our art draws that the source's does not | Ours labels what it shows. State it. |

**The band counts are not comparable, and a mismatch there is not a finding.** The reader
counts `<section>` elements, and our primitives render bands as `<div>` (a `SectionGap`, a
`FrameBox`) — so our count comes back lower on a page that has every band. Check the sequence
instead: the number of spacer bands, and the running order of the named blocks, must match the
inventory. The **spacer count** is the one number worth comparing directly, because a spacer is
a block the source deliberately placed.

Finish by looking at our band captures next to the source's. The diff proves the words; only the
captures show whether a band reads as the same block.

---

## Hard prohibitions

- Do not paraphrase, shorten, "improve", translate, or re-tone a single line of source copy.
- Do not drop a band, add a band the source does not have, or reorder them.
- Do not invent an eyebrow, a description, a CTA label, or a link that the source does not render.
- Do not carry over the source's spacing values, border colours, radii, hex colours, class names,
  or its markup structure.
- Do not install or import a carousel / positioning / animation library to reproduce a behaviour.
- Do not substitute or fabricate a brand asset we do not have — omit it and report the gap.
- Do not draw an edge a neighbouring frame already draws.
- Do not write a band by hand in a view or a page file — every band is a section.
- Do not claim the translation is complete without running the Step 5 diff and reading its output.

## Report when you are done

State: the band count on each side, the diff result (missing / extra), every recorded asset gap,
and every block where our form deliberately departs from the source's.
