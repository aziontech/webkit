<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /**
   * The typography contract every documentation page inherits.
   *
   * MDX text compiles to plain semantic HTML — `h2`, `p`, `ul`, `table`, `a`,
   * `code`. This container is what gives that HTML the Azion type scale, the
   * semantic colors, and the vertical rhythm, so an author writes markdown and
   * never a class. It styles descendants (not itself), which means it works the
   * same over any markdown or MDX pipeline's output, a slot of hand-written
   * markup, or raw HTML from a CMS. The design system ships no renderer: the
   * consumer brings their own, and this contract meets whatever it emits.
   *
   * Rhythm: the reference is Mintlify's docs shell, measured on
   * docs.firecrawl.dev — h2 and h3 open at 48, h4 at 36, a heading landing
   * directly on another heading at 0, a paragraph or list at 20, list items at
   * 8, a nested list at 12, a block component at 16, an `hr` at 48, and the
   * gap *under* a heading tightened to 16 / 12 / 9. Identical at 390 and 1440.
   * Those numbers are refitted onto the nearest semantic spacing tokens: the
   * theme owns the scale, so prose may not invent a step between two rungs.
   *
   * The section step is the one rung that leaves the semantic scale — for a
   * primitive step of the same scale, never for a number typed here.
   *
   * The ladder: a flat 56 (`pt-14`) above h1, h2 and h3 — the SECTION STEP,
   * what opens a section — then `xl` / `sm:lg` above h4 (24 flat), `md` above a
   * paragraph or list (16), `lg` above a free-standing block component (16,
   * opening to 24 from `sm`), a flat 48 (`mt-12`) above an `hr` — a section
   * break, not a block: 48 is what CLOSES a section, and the heading under the
   * rule re-opens the next one at 56 — `xs` between list items (8) and `sm`
   * once an item holds a paragraph or a nested list, so a paragraph item pays
   * 8 + 12, the reference's 20.
   *
   * A BLOCK COMPONENT SITS ONE RUNG ABOVE FLOWING COPY, which is the one place
   * this ladder leaves the reference (which puts a block at 16, the same as a
   * paragraph). A card grid, a callout, a code group or a steps list is a
   * bordered, tinted, visually heavy object, and at the paragraph rung two of
   * them in sequence read as one glued stack — the common shape on these pages,
   * where blocks follow blocks far more often than they follow prose. The rung
   * moves and *flowing copy does not*: the paragraph gap stays the 16 the
   * reference was fitted to, so the section step keeps a 3.5:1 lead over body
   * rhythm at every width. Had the paragraph rung moved with it, flowing copy
   * would break at 24 from `sm` up — the same 24 h4 is pinned at — so the label
   * rung and body rhythm would land on one gap and a real level would be gone.
   *
   * The cost is that a block ties h4's 24 from `sm` up. That is the weakest tie
   * in the ladder and it is the right one to spend: h4 is separated from what
   * follows it by size and by the space above it, it is the only rung whose
   * neighbours are both pinned flat, and the alternative — lifting h4 to the
   * next semantic rung (`xxl` / `sm:xl`) — runs it 32 / 32 / 48 against a 56
   * section step, close enough at `xl` that an h4 would read as opening a
   * section rather than as a label inside one. That loses a real level instead
   * of a nominal one.
   *
   * h2 and h3 share a rung, exactly as the reference does: the hierarchy
   * between them is carried by type size, not by space.
   *
   * THE SECTION STEP IS 56 TO OPEN AND 48 TO CLOSE, FLAT AT EVERY WIDTH. It is
   * the one rung the semantic scale cannot express: `xxl` runs 32 / 64 / 96 and
   * `xl` runs 24 / 32 / 48, so the descending pair this rung used to be (`xxl` /
   * `sm:xl`) read 32 on a phone AND on a laptop, and only reached 48 at `xl`. A
   * section boundary is the gap a reader navigates by, and that made it the
   * least stable rung in the ladder — the same page broke its sections at 32 on
   * a 1024 window and at 48 on a 1440 one, where the reference is identical at
   * 390 and 1440. So it is pinned to the theme's own PRIMITIVE steps,
   * `--spacing-14` (56) and `--spacing-12` (48): a coarser rung of the same
   * ladder, not a number invented here.
   *
   * OPEN 56, CLOSE 48 — and nothing carries space below itself, so between two
   * consecutive sections there is exactly ONE gap, the opening 56. The closing
   * 48 only materialises where a section ends against something that is not
   * another section: an `hr` (whose following heading then re-opens at 56, so
   * an explicit break reads deliberately wider than a plain one) and the page's
   * own close, which belongs to the page shell rather than to this contract.
   *
   * A heading binds to whatever it introduces, and that binding belongs to the
   * heading, not to the thing below: after h2 the gap is the 16 base, after h3
   * it tightens to `sm` (12) and after h4 to `xs` (8) — the reference's 16 / 12
   * / 9. The *tightened* rungs are shared with blocks, rather than a block
   * keeping its own larger one: `h3` + card grid pays 12 where body copy + card
   * grid pays 24. h2 is the exception in both cases, because h2 does not
   * tighten — it introduces a whole section, so whatever follows it takes its
   * own rung (16 for a paragraph, 24 for a block) and the section reads as
   * opening rather than as a label bound to one object. So a heading landing directly on another heading pays that same small
   * gap (h2 → h3 is 16, h3 → h4 is 12) instead of the section rung, and a
   * stacked pair reads as one landmark. It is not zero: the reference reaches
   * the same place with margins, where the upper heading's `margin-bottom`
   * survives the collapse.
   *
   * Nothing carries space *below* itself, so every one of those is a `pt` on
   * the *following* element and two blocks can never fight over whose margin
   * wins. The first block opens flush — the reset reaches through the
   * renderer's wrapper so a page starting with an h1 does not pay for a gap
   * above it. That reset is *structural* (`>` from this root), not a descendant
   * `[data-doc-block]:first-child`: a descendant form also caught the first
   * block inside a tab panel, a step body or an accordion, gluing a card grid
   * to the tab strip that introduced it.
   *
   * Where a rung must hold still it is pinned by a *descending* responsive pair
   * (`pt-(--spacing-xl) sm:pt-(--spacing-lg)` reads 24 at every width, because
   * `xl` is 24 below `sm` and `lg` is 24 from `sm` up). The semantic scale is
   * fluid and its fluidity runs the wrong way for prose — `lg` and `md` are
   * both 1rem below `sm`, so one token per rung collapses h4, a block and a
   * paragraph onto a single 16px gap on a phone. The pairs are
   * same-specificity and the `sm:` rule is emitted second, so it wins inside
   * the media query with no `!`. The section step needs no pair — a primitive
   * step is flat already, which is the second reason to reach for one there.
   *
   * The base gap stays 16 against the reference's 20, because 20 is not a rung
   * we have and 16 is the closer of the two neighbours: body copy is 16px at
   * the relaxed line-height the prose register carries, a 26px line box, so 16
   * puts a paragraph break at 0.62 of the line box where the reference sits at
   * 0.71 — `lg`, the next rung up, would put it at 0.92. The same arithmetic
   * keeps the register at 1.625 rather than the looser 2, against the
   * reference's 1.75.
   *
   * Weight and leading are NOT stated here. Every element takes its type token
   * verbatim, because a page whose type differs from the design system's
   * definition of that register is a page the system cannot reason about: the
   * tokens put every heading *and* the prose body at `light` (300), and the
   * prose register carries its own relaxed line box. So the ladder here is SIZE
   * and SPACE only, and a `font-*` / `leading-*` utility in this contract would
   * be the layer disagreeing with the system it renders.
   *
   * Two consequences, deliberate and worth knowing:
   *
   *   · a heading and the copy under it carry the SAME weight, so the step
   *     between them is size (h2 is 24px over a 16px body at `md`) plus the
   *     space above — which is why the spacing rungs above matter more here
   *     than they did when weight was carrying part of the hierarchy;
   *   · the heading registers are fluid and they collapse at the bottom of the
   *     base column, so ONE REGISTER PER LEVEL does not survive a phone: h2 on
   *     `heading-md` was 16 at the base width — the body's own size — and h3 on
   *     `heading-sm` and h4 on `heading-xxs` were both 14, two rungs at one
   *     size and both SMALLER than the copy they head. Between 640 and 768 it
   *     inverted outright: the page title (`heading-lg`, 18) was overtaken by
   *     its own h2 (`heading-md`, 20).
   *
   * SO EACH LEVEL NAMES TWO REGISTERS, the base one and the one that takes over
   * at the width where the base one would run away — the same descending pair
   * the spacing rungs use, and for the same reason: the scale's jumps are sized
   * for marketing display, not for prose, so a register that is right at 390 is
   * a banner at 1440. Size only; no weight, no leading, nothing overridden.
   *
   *   h1 `2xl` / `sm:xl`   30 / 30 / 36   — the masthead's size too
   *   h2 `xl`  / `sm:md`   20 / 20 / 24
   *   h3 `lg`  / `md:sm`   18 / 18 / 18
   *   h4 `xs`              16 / 16 / 16
   *   body                 16 / 16 / 16
   *
   * Every column is strictly decreasing from h1 to h3 and no heading is ever
   * under the body it heads — the two things that were broken. h3 is flat at 18
   * rather than ramping: the scale has no 20 at `md` (`sm` gives 18, `md` jumps
   * to 24 and would tie h2), and 18 between a 24 h2 and the body is a clean step
   * both ways.
   *
   * H4 IS THE ONE LEVEL LEFT UNRESOLVED, and it cannot be resolved from here.
   * The base column holds exactly three sizes above the 16px body — 18, 20, 30 —
   * and h1, h2 and h3 spend all three. `heading-xs` at least stops h4 rendering
   * *under* its own copy, but at 16px and `light` it differs from the prose body
   * only by its tighter line box, so an h4 and a paragraph read nearly the same.
   * Separating them needs `texts.data.js` — the honest move is to give
   * `heading-xs` `normal` (400) against the body's `light` (300), the same step
   * `strong` already makes — not a `font-*` utility here.
   *
   * `strong` carries the one weight left, and it is `font-normal` (400) rather
   * than `font-medium` (500): 500 is a weight NO text token uses — the whole set
   * is light (300) and normal (400) — so inline emphasis steps to the only other
   * weight the system actually defines. The core `font-*` utilities sort after
   * the custom text tokens, so it wins with no `!`.
   *
   * Prose `h1` shares the section rung with h2. It is unreachable in practice:
   * the page title is `DocPageHeader`’s h1 and is chrome, so authored content
   * starts at h2.
   *
   * All prose ink is `--text-default` — headings, paragraphs, list items,
   * `strong` and inline `code` alike. Muting the body copy was carrying the
   * hierarchy that size and space now carry, and `--text-muted` is 3.95:1 on
   * surface, under AA. It survives only where the quieter voice is the point:
   * a `blockquote`’s body and a list’s marker glyphs.
   *
   * Inline `code` is a tag, so it takes the translucent `--bg-hover` rather
   * than a surface token. The two surface steps collapse in light mode —
   * `--bg-surface` and `--bg-surface-raised` resolve to the same pure white,
   * over a near-white `--bg-canvas` page — so a "raised" chip read 1.04:1 against
   * the page and its border was doing the whole job. A translucent neutral
   * composites over whatever sits behind it (the canvas, a card, a callout's
   * tint), which takes the chip to 1.20:1 light and 1.21:1 dark — the same
   * step in both themes, where the opaque token was half as strong in one of
   * them — and stops it punching a white hole through a tinted callout. Its
   * ink stays `--text-default` (14.76:1 light, 16.67:1 dark) even where the
   * copy around it is muted: the chip is the thing the reader types.
   *
   * Every rule stops at `[data-doc-chrome]`. A documentation component wraps
   * webkit internals that are themselves paragraphs, headings and code — the
   * Message body, the CodeBlock lines, the Accordion trigger — and restyling
   * those from here would break the component that owns them. Authored prose
   * nested inside a component (a step's body, a tab's panel) is not chrome and
   * keeps the contract.
   */
  defineOptions({ name: 'DocProse', inheritAttrs: false })

  defineSlots<{
    /** The document body: markdown-rendered HTML or hand-written markup. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prose')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-2xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xl [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:md:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-xs) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:py-0.5 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-l-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-12 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-lg) [&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
