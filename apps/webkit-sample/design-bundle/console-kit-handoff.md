# Design foundations handoff — console-kit

**Scope: the design bundle only.** Typography, rhythm and size, spacing, containers.
No components, no composition APIs, no webkit features.

This is written against the versions console-kit actually pins:

```json
"@aziontech/icons": "^4.1.0",
"@aziontech/theme": "^2.0.4",
"@aziontech/webkit": "3.0.5"
```

The reference implementation is `apps/webkit-sample` in the webkit monorepo, which runs
`@aziontech/theme` **4.3.1**. Every rule below is stated in terms of what **2.0.4** actually
ships — verified by building `dist/v3/globals.css` from the 2.0.4 tag, not by reading current
docs. Where the sample uses something 2.0.4 does not have, the gap is called out with a
substitution rather than left for you to discover.

---

## 0. What you are consuming

`@aziontech/theme@2.0.4` ships a **generated stylesheet**, not just a Tailwind preset:

| Export                             | File                         | Use                                        |
| ---------------------------------- | ---------------------------- | ------------------------------------------ |
| `@aziontech/theme/globals.css`     | `dist/v3/globals.css`        | Tailwind **v3** — the one you want         |
| `@aziontech/theme/v4/globals.css`  | `dist/v4/globals.css`        | Tailwind v4, if/when you migrate           |
| `@aziontech/theme/tailwind-preset` | `dist/v3/tailwind-preset.js` | v3 preset (colors, screens, spacing scale) |

Two things live in that stylesheet, and the distinction matters:

1. **CSS custom properties** — `--spacing-md`, `--container-4xl`, `--text-heading-lg-font-size`,
   `--font-code`, `--shape-button`, and the whole semantic color set. These are the real API.
   They are plain CSS: they work in v3, in v4, in a `<style>` block, in an inline style.
2. **Pre-generated component classes** — `.text-heading-lg`, `.gap-spacing-md`, `.p-spacing-md`,
   `.px-container`, `.py-container`, `.max-container-width`. These are **emitted literally into
   `globals.css`**, not produced by Tailwind's JIT. They work regardless of Tailwind version and
   they cannot be purged.

Everything else — `px-…`, `py-…`, `mt-…`, `max-w-…` — is Tailwind doing arbitrary-value
substitution over those custom properties. **That is where the syntax differs by Tailwind
major**, and it is the single most common porting mistake:

```html
<!-- Tailwind v4 (what the sample is written in) -->
<div class="px-(--spacing-md) max-w-(--container-4xl)">
  <!-- Tailwind v3 (what you write in console-kit today) -->
  <div class="px-[var(--spacing-md)] max-w-[var(--container-4xl)]"></div>
</div>
```

Same compiled CSS. When you copy a class string out of the sample, convert `-(--x)` to
`-[var(--x)]`. The paren shorthand emits **nothing** on v3, silently — no build error, no lint
error, the class just does not exist.

---

## 1. Typography

### 1.1 The ladder you have (theme 2.0.4 — 21 tokens, exact)

Sizes are `rem` in the token, shown here in px at a 16px root. The `→` columns are the
**responsive ramp built into the token** — you do not write breakpoint variants for these.

| Class                | Size (base → sm 640 → md 768) | Line-height | Weight  | Family         | Notes                     |
| -------------------- | ----------------------------- | ----------- | ------- | -------------- | ------------------------- |
| `text-heading-2xl`   | 30 → 48 → 60                  | 1.2         | inherit | Sora           | page hero                 |
| `text-heading-xl`    | 20 → 30 → 36                  | 1.2         | inherit | Sora           | page title                |
| `text-heading-lg`    | 18 → **30 (md)**              | 1.2         | inherit | Sora           | section title             |
| `text-heading-md`    | 16 → 20 → 24                  | 1.2         | inherit | Sora           | subsection                |
| `text-heading-sm`    | 14 → 16 → 18                  | 1.2         | inherit | Sora           | smallest heading          |
| `text-label-lg`      | 16                            | 1.5         | **500** | Sora           | form label                |
| `text-label-md`      | 14                            | 1.5         | **500** | Sora           | field label, table header |
| `text-label-sm`      | 12                            | 1.5         | **500** | Sora           | dense label, meta key     |
| `text-body-lg`       | 16 → **18 (md)**              | 1.5         | inherit | Sora           | lead paragraph            |
| `text-body-md`       | 16                            | 1.5         | inherit | Sora           | default prose             |
| `text-body-sm`       | 14                            | 1.5         | inherit | Sora           | **the console workhorse** |
| `text-body-xs`       | 12                            | 1.5         | inherit | Sora           | helper, caption           |
| `text-body-xxs`      | 10                            | 1.5         | inherit | Sora           | legal, dense chrome       |
| `text-overline-md`   | 12 → 14                       | 1.4         | inherit | **Proto Mono** | `0.08em`, UPPERCASE       |
| `text-overline-sm`   | 12                            | 1.4         | inherit | **Proto Mono** | `0.08em`, UPPERCASE       |
| `text-overline-xs`   | 10                            | 1.4         | inherit | **Proto Mono** | `0.08em`, UPPERCASE       |
| `text-button-lg`     | 14                            | 1           | **600** | Sora           | 40px control              |
| `text-button-md`     | 12                            | 1           | **600** | Sora           | 32px control              |
| `text-big-number-lg` | 24 → 36 → 60                  | 1.2         | inherit | **Proto Mono** | metric hero               |
| `text-big-number-md` | 20 → 24 → 36                  | 1.2         | inherit | **Proto Mono** | metric card               |
| `text-big-number-sm` | 16 → 20                       | 1.2         | inherit | **Proto Mono** | metric inline             |

Three families, all declared by the theme: `--font-sans: Sora`, `--font-code: Roboto Mono`,
`--font-display: Proto Mono`. Proto Mono is proprietary and is what carries the industrial
register — it is reserved for overlines and numerals, never for prose.

### 1.2 Role → token (how the sample actually assigns them)

The rule is **role first, size second**. Pick the family (`heading` / `label` / `body` /
`overline` / `button`) from what the text _is_, then the step from where it sits. Never pick a
`heading` token because you want something big, and never pick a `body` token because you want
something small.

| Surface                            | Token                    | Why                                          |
| ---------------------------------- | ------------------------ | -------------------------------------------- |
| Page hero (marketing, auth)        | `text-heading-2xl`       | only one per page                            |
| Page title                         | `text-heading-xl`        | one per page, in the page header             |
| Section title                      | `text-heading-lg`        | the thing a reader scrolls _by_              |
| Card / panel title                 | `text-heading-md`        | see §1.3 — you will want a smaller step here |
| Group title inside a card          | `text-heading-sm`        |                                              |
| Eyebrow above a title              | `text-overline-sm`       | Proto Mono, uppercase; never two per band    |
| Field label, table column header   | `text-label-md`          |                                              |
| Dense label, metadata key          | `text-label-sm`          |                                              |
| Table cell, list row, most UI text | `text-body-sm`           | **the default**                              |
| Helper text, timestamps, counts    | `text-body-xs`           |                                              |
| Paragraph in a docs/prose column   | `text-body-md`           |                                              |
| Metric figure                      | `text-big-number-md`     | Proto Mono                                   |
| Button/control label               | `text-button-lg` / `-md` | pairs with the height, see §2.2              |

Frequency in the sample's **console** surface, as a sanity check on the shape of the
distribution — one token carries most of the product:

```
text-body-sm    175   ← default UI text
text-label-sm   125   ← labels and meta keys
text-body-xs     83   ← helper / secondary
text-label-md    45
text-heading-*   ~80 total, spread across five steps
```

If a new screen reaches for five different heading steps, the screen has a hierarchy problem,
not a token problem.

### 1.3 What 2.0.4 does **not** have, and what to write instead

The sample leans on eight tokens added after 2.0.4. These are the substitutions — each one
compiles to the same CSS the newer token would.

| Missing token        | What it is           | Write instead (v3)                                            |
| -------------------- | -------------------- | ------------------------------------------------------------- |
| `text-heading-xs`    | 16px / 1.375 / 400   | `text-body-md leading-snug`                                   |
| `text-heading-xxs`   | 14px / 1.375 / 400   | `text-body-sm leading-snug`                                   |
| `text-label-code-md` | mono 14px / 1        | `text-body-sm [font-family:var(--font-code)] leading-none`    |
| `text-label-code-sm` | mono 12px / 1        | `text-body-xs [font-family:var(--font-code)] leading-none`    |
| `text-body-code-sm`  | mono 12px / 1.625    | `text-body-xs [font-family:var(--font-code)] leading-relaxed` |
| `text-body-prose-md` | 16px / 1.625         | `text-body-md leading-relaxed`                                |
| `text-amount-*`      | figures at `-0.08em` | `text-big-number-md tracking-[-0.08em]`                       |
| `text-link`          | inline `<a>` styling | style `<a>` yourself against `--text-link`                    |

`text-heading-xs` / `-xxs` are the two that matter most: in the sample's console they are the
**card and group titles** (40 + 23 uses), the exact place a product UI needs a heading smaller
than `text-heading-sm`'s responsive ramp. `text-body-sm leading-snug` is a faithful stand-in —
14px, 1.375, weight 400 — and it is what a card title should be.

### 1.4 Differences that will bite you silently

These are not gaps; they are the _same token with different values_. Do not carry a value
from current webkit docs into console-kit without checking here.

- **`text-label-*` is weight 500 in 2.0.4** (it is 400 in current theme). Your labels already
  read medium. Do **not** stack `font-medium` on a label token — you will land on 500 twice and
  then someone "fixes" it to 600.
- **`text-button-*` is weight 600 in 2.0.4** (400 now). Same warning.
- **`text-body-xxs` is 10px in 2.0.4** (12px now). 10px is below the readable floor for
  anything a user must act on — treat it as chrome only.
- **`text-heading-2xl` tops out at 60px in 2.0.4** (56px now, because the `6xl` font-size
  primitive was reduced). Nothing to fix, just do not expect a pixel match with a current
  webkit screenshot.
- **No `text-wrap` behaviour.** Current theme bakes `text-wrap-style: balance` into every
  heading token and `pretty` into body tokens. 2.0.4 does not. If you want a balanced two-line
  title, add `text-balance` yourself — and note that once you do, it competes with `truncate`
  on the same element. Put the wrap on the heading, the truncation on a child.
- **`leading` values you can pair with:** `tight 1.25`, `snug 1.375`, `normal 1.5`,
  `relaxed 1.625`, `loose 2`. There is no `leading-none` token in 2.0.4's scale (Tailwind's own
  `leading-none` = 1 still works).

---

## 2. Rhythm and size

### 2.1 The grid is 4px

Every spacing, height and container value in the theme is a multiple of 4. The spacing scale is
`--spacing-1: 4px` through `--spacing-96: 384px`; the height and size scales are identical to
each other and to the spacing scale. Nothing in a screen should land on an odd pixel.

When a value is not on the grid, it is because it is _optical_, not structural — a 1px border,
a 1.5px icon stroke, a 28px control that exists to sit inside a 32px row. Those are decisions,
not rounding.

### 2.2 The control ladder — three heights, and the height _is_ the hierarchy

| Height   | Class  | Text token       | Where                                                                  |
| -------- | ------ | ---------------- | ---------------------------------------------------------------------- |
| **40px** | `h-10` | `text-button-lg` | page-heading actions, auth CTAs, the one primary action                |
| **32px** | `h-8`  | `text-button-md` | **the whole table-controls row** — search, filter, sort, per-row menus |
| **28px** | `h-7`  | `text-button-md` | shell chrome only (account switcher, breadcrumb affordances)           |

The important rule: **a row of controls picks one height and every control in it takes that
height.** A page heading is 40px; the controls row beneath a table is 32px, all of it. That
difference is what reads as hierarchy — not weight, not color. Mixing 40 and 32 in one row
reads as a mistake, because it is.

Below `md` (768px), a primary action in a page heading goes **full width** (`w-full md:w-auto`)
and the heading stacks. A 40px control does not shrink to fit a phone; it spans.

### 2.3 Line-height rhythm

Three regimes, and they are what makes a dense screen legible:

- **Headings: 1.2.** Tight, because a heading is one or two lines and the block should read as
  a unit.
- **Body and labels: 1.5.** The reading rhythm. A table cell at `text-body-sm` is 14 × 1.5 = 21px
  of line box, which is what makes a 48px row breathe.
- **Controls: 1.0.** A button label has no leading — the height comes from `h-*` and the
  padding, so the glyphs must sit flush in the middle. `leading-none` on anything vertically
  centred inside a fixed-height box.

Overlines are 1.4 with `0.08em` tracking — the extra letter-spacing is what makes 12px
uppercase Proto Mono legible, and removing it makes the token pointless.

---

## 3. Spacing

### 3.1 The seven-step semantic scale

**These values are byte-identical between 2.0.4 and current theme.** Everything in this section
ports 1:1.

| Token           | Base | ≥ sm (640) | ≥ xl (1280) | Reads as               |
| --------------- | ---- | ---------- | ----------- | ---------------------- |
| `--spacing-xxs` | 4px  | —          | —           | glyph-to-label         |
| `--spacing-xs`  | 8px  | —          | —           | items inside a control |
| `--spacing-sm`  | 12px | —          | —           | rows in a dense list   |
| `--spacing-md`  | 16px | —          | —           | the default gap        |
| `--spacing-lg`  | 16px | 24px       | —           | page boundary inset    |
| `--spacing-xl`  | 24px | 32px       | 48px        | between sections       |
| `--spacing-xxl` | 32px | 64px       | 96px        | between page bands     |

Three of them (`lg`, `xl`, `xxl`) **grow with the viewport on their own**. That is the whole
point: you write `gap-[var(--spacing-xl)]` once and the section rhythm opens up on a desktop
without a single breakpoint variant in your markup. Do not wrap these in `sm:` / `lg:` — you
would be fighting the token.

The other four are **fixed**, because component-internal spacing should not change with the
window. An 8px gap between an icon and its label is 8px on a phone and on a 4K display.

### 3.2 How the sample assigns them

Actual usage across the sample's console surface, most-used first:

```
gap-(--spacing-xs)    296   ← 8px: inside a row of controls, icon + label, chip contents
gap-(--spacing-sm)    140   ← 12px: rows of a dense list
gap-(--spacing-xxs)   137   ← 4px: glyph to text
gap-(--spacing-lg)     73   ← 16→24px: between groups on a page
gap-(--spacing-md)     72   ← 16px: between fields in a form
px-(--spacing-xs)      72   ← 8px: horizontal padding of a small control
p-(--spacing-md)       46   ← 16px: card padding
```

The three structural rules the sample follows, which are worth adopting verbatim:

| Concern                                                             | Token          | Value          |
| ------------------------------------------------------------------- | -------------- | -------------- |
| **Page boundary** — the inset from the window/shell edge to content | `--spacing-lg` | 16 → 24px      |
| **Between sections** of a page                                      | `--spacing-xl` | 24 → 32 → 48px |
| **Between groups** inside one section                               | `--spacing-md` | 16px           |

Those three, applied consistently, are most of what makes a page look designed. A screen where
sections and groups are separated by the same distance has no structure, regardless of how good
the individual components are.

### 3.3 Only two spacing utilities are pre-generated

`globals.css` emits exactly `.gap-spacing-<step>` and `.p-spacing-<step>` — nothing else:

```css
.gap-spacing-md {
  gap: var(--spacing-md);
}
.p-spacing-md {
  padding: var(--spacing-md);
}
```

For every other axis (`px`, `py`, `pt`, `mt`, `space-y`, …) use Tailwind's arbitrary value over
the custom property:

```html
<div class="px-[var(--spacing-md)] py-[var(--spacing-sm)] mt-[var(--spacing-lg)]"></div>
```

Both forms compile to the same declaration, so mixing them is harmless — but pick one per file
so a reader is not asking why.

---

## 4. Containers

### 4.1 The measure ladder — **check this before copying any width**

`--container-*` exists in both versions with **different values**. This is the one place where
copying a class from a current-webkit screen gives you a silently wrong layout.

| Token             | 2.0.4 (yours) | 4.3.1 (sample) |
| ----------------- | ------------- | -------------- |
| `--container-3xs` | 256px         | 256px          |
| `--container-2xs` | 288px         | 300px          |
| `--container-xs`  | 320px         | 348px          |
| `--container-sm`  | 384px         | 408px          |
| `--container-md`  | 448px         | 472px          |
| `--container-lg`  | 512px         | 552px          |
| `--container-xl`  | 576px         | 644px          |
| `--container-2xl` | 672px         | 752px          |
| `--container-3xl` | 768px         | 876px          |
| `--container-4xl` | 896px         | 1024px         |
| `--container-5xl` | 1024px        | 1192px         |
| `--container-6xl` | 1152px        | **1388px**     |
| `--container-7xl` | 1280px        | **1620px**     |

Yours is the stock Tailwind ladder. The current one is a deliberate geometric progression —
anchored at 256 and 1620, every neighbouring pair ~16.6% apart, rounded to the 4px grid — so
that the whole set reads as one rhythm instead of two grids spliced together.

**Consequence:** `max-w-[var(--container-6xl)]` is **1152px** in console-kit and **1388px** in
the sample. When you port a measure, port the **intent** (below) and the **pixel value**, not
the token name.

### 4.2 The page measures the sample uses

Expressed as intent + literal px, so you can map them onto whichever token you prefer:

| Intent                          | Sample value | Nearest 2.0.4 token        | Suggestion                                           |
| ------------------------------- | ------------ | -------------------------- | ---------------------------------------------------- |
| Standard page column            | 1388px       | none (`7xl` = 1280)        | `max-w-[1388px]`, or accept `7xl`                    |
| Single-task hero / focused flow | 1024px       | `--container-5xl` ✅ exact | `max-w-[var(--container-5xl)]`                       |
| Settings and forms              | 1024px       | `--container-5xl` ✅ exact | `max-w-[var(--container-5xl)]`                       |
| Create / wizard flows           | 1192px       | none (`6xl` = 1152)        | `max-w-[var(--container-6xl)]` — 40px narrower, fine |
| Prose / docs column             | 876px        | `--container-4xl` = 896    | `max-w-[var(--container-4xl)]` — 20px wider, fine    |
| Settings row control            | 256px        | `--container-3xs` ✅ exact | `max-w-[var(--container-3xs)]`                       |

The two exact hits (`5xl` and `3xs`) are not a coincidence — 1024 and 256 are anchors in both
ladders.

### 4.3 `.px-container` / `.py-container` / `.max-container-width`

2.0.4 emits three container component classes, driven by their own responsive vars:

| Class                  | Property       | Base  | ≥ sm (640) | ≥ xl (1280) |
| ---------------------- | -------------- | ----- | ---------- | ----------- |
| `.px-container`        | inline padding | 16px  | 40px       | **0**       |
| `.py-container`        | block padding  | 64px  | 128px      | 192px       |
| `.max-container-width` | max-width      | 448px | 1024px     | 1280px      |

**The sample does not use these, and neither should a console.** They are a marketing-page
rhythm: 192px of vertical padding is a landing-page band, and the inline padding dropping to
`0` at xl only makes sense when the max-width is doing the insetting. For a product surface,
compose the column yourself:

```html
<!-- the page column: centred, capped, inset by the boundary token -->
<div class="mx-auto w-full max-w-[var(--container-5xl)] px-[var(--spacing-lg)]"></div>
```

That is three decisions, all named: **centre** (`mx-auto w-full`), **cap** (a measure from
§4.2), **inset** (the page-boundary token from §3.2). Every page in the sample is that shape.

### 4.4 Breakpoints

Identical in both versions — `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

The responsive tokens only ever switch at **`sm` (640)**, **`md` (768)** and **`xl` (1280)**.
`lg` and `2xl` exist for your own layout variants; no token changes there.

---

## 5. Porting checklist

When moving a pattern from webkit-sample into console-kit:

1. **Convert the token syntax** — `px-(--spacing-md)` → `px-[var(--spacing-md)]`. The v4 paren
   form emits nothing on v3, with no error.
2. **Check the typography token exists** (§1.1). If it is `heading-xs`, `heading-xxs`, any
   `*-code-*`, `amount-*`, `tag-*`, `body-prose-md` or `text-link`, substitute per §1.3.
3. **Do not add `font-medium` / `font-semibold` to a label or button token** — 2.0.4 already
   sets 500 / 600.
4. **Re-derive any `--container-*` width** against §4.1. The token names match; the values do
   not.
5. **Leave the responsive spacing tokens alone** — `lg`, `xl`, `xxl` already ramp. Adding
   `sm:` / `lg:` variants on top double-applies the intent.
6. **Pick one control height per row** (§2.2). 40px for the heading action, 32px for everything
   in the table controls row.

## 6. What is worth pulling forward later

Not blocking, in rough order of payoff if console-kit ever bumps `@aziontech/theme`:

- **`text-heading-xs` / `text-heading-xxs`** — the two card/group title steps a product UI
  actually needs. Currently a two-class workaround on every card.
- **The recalibrated container ladder** — the geometric progression, and with it the
  `--layout-measure-*` semantic layer (`layout-measure`, `-form`, `-content`, `-control`) that
  names _why_ a column is that wide instead of restating the number.
- **`--layout-boundary-inline` and the section/group gap tokens** — the §3.2 rules as tokens
  rather than as a convention.
- **`text-wrap-style` on the heading tokens** — balanced titles without per-site `text-balance`.
- **The code/mono typography set** — `label-code-*` and `body-code-sm`, which a console needs
  constantly for ids, hashes and paths.
