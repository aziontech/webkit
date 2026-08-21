<script setup lang="ts">
  /**
   * The typography contract every documentation page inherits.
   *
   * MDX text compiles to plain semantic HTML — `h2`, `p`, `ul`, `table`, `a`,
   * `code`. This container is what gives that HTML the Azion type scale, the
   * semantic colors, and the vertical rhythm, so an author writes markdown and
   * never a class. It styles descendants (not itself), which means it works the
   * same over `DocMarkdown` output, a slot of hand-written markup, or raw HTML
   * from any other pipeline.
   *
   * Rhythm: the reference is Mintlify's docs shell, measured on
   * docs.firecrawl.dev — h2 and h3 open at 48, h4 at 36, a heading landing
   * directly on another heading at 0, a paragraph or list at 20, list items at
   * 8, a nested list at 12, a block component at 16, an `hr` at 48, and the
   * gap *under* a heading tightened to 16 / 12 / 9. Identical at 390 and 1440.
   * Those numbers are refitted onto the nearest semantic spacing tokens: the
   * theme owns the scale, so prose may not invent a step between two rungs.
   *
   * The ladder, in tokens: `xxl` / `sm:xl` above h1, h2 and h3 (32, opening to
   * 48 at `xl`), `xl` / `sm:lg` above h4 (24 flat), `md` above a paragraph or
   * list (16), `lg` above a free-standing block component (16, opening to 24
   * from `sm`), `xxl` / `sm:xl` above an `hr` (a section break, not a block),
   * `xs` between list items (8) and `sm` once an item holds a paragraph or a
   * nested list — so a paragraph item pays 8 + 12, the reference's 20.
   *
   * A BLOCK COMPONENT SITS ONE RUNG ABOVE FLOWING COPY, which is the one place
   * this ladder leaves the reference (which puts a block at 16, the same as a
   * paragraph). A card grid, a callout, a code group or a steps list is a
   * bordered, tinted, visually heavy object, and at the paragraph rung two of
   * them in sequence read as one glued stack — the common shape on these pages,
   * where blocks follow blocks far more often than they follow prose. The rung
   * moves and *flowing copy does not*: the paragraph gap stays the 16 the
   * reference was fitted to, so the h2 rung keeps its 2:1 lead over body rhythm
   * at every width. Had the paragraph rung moved with it, the section break
   * would have run 32 against a 24 paragraph gap between `sm` and `xl` — an
   * 8px difference carrying the whole section hierarchy — and the scale has no
   * rung that reaches 48 at `sm` to open the gap back up.
   *
   * The cost is that a block ties h4's 24 from `sm` up. That is the weakest tie
   * in the ladder and it is the right one to spend: h4 is separated from what
   * follows it by size and by `font-medium` (see below), it is the only rung
   * whose neighbours are both pinned flat, and the alternative — lifting h4 —
   * ties it to the *section* rung at `sm` (32) and again at `xl` (48), which
   * loses a real level instead of a nominal one.
   *
   * h2 and h3 share a rung, exactly as the reference does: the hierarchy
   * between them is carried by type size, not by space. A flat 48 at every
   * width is unreachable here — the scale's base column stops at 32 — so the
   * section rung is pinned at 32 and opens to 48 from `xl`.
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
   * the media query with no `!`.
   *
   * The base gap stays 16 against the reference's 20, because 20 is not a rung
   * we have and 16 is the closer of the two neighbours: body copy is 16px at
   * `--leading-relaxed`, a 26px line box, so 16 puts a paragraph break at 0.62
   * of the line box where the reference sits at 0.71 — `lg`, the next rung up,
   * would put it at 0.92. Same arithmetic keeps `--leading-relaxed` (1.625)
   * over `--leading-loose` (2) against the reference's 1.75.
   *
   * Weight is stated here rather than inherited, so the ladder is readable in
   * one place instead of being spread across the type tokens (which put every
   * heading *and* body size at `light`, 300). Headings take `font-normal`
   * (400); flowing copy — paragraphs and list items — takes `font-light`
   * (300), which is what the body token already resolves to, written out so a
   * later token change cannot silently thicken the page. That leaves one step
   * of weight between a heading and the copy under it, with size and space
   * carrying the rest. The core `font-*` utilities sort after the custom text
   * tokens, so they win with no `!`.
   *
   * h4 is the one exception, and keeps `font-medium`: at `text-heading-xxs` it
   * is 14px, and so is h3 below `sm`, so weight is the only thing separating
   * the two on a phone. `text-heading-xs` was worse than a tie — flat 16px
   * against h3’s 14 → 16 → 18 ramp, so an h4 rendered *larger* than the h3
   * above it.
   *
   * Prose `h1` shares the section rung with h2. It is unreachable in practice:
   * the page title is `DocPageHeader`’s h1 and is chrome, so authored content
   * starts at h2.
   *
   * All prose ink is `--text-default` — headings, paragraphs, list items,
   * `strong` and inline `code` alike. Muting the body copy was carrying the
   * hierarchy that weight now carries, and `--text-muted` is 3.95:1 on
   * surface, under AA. It survives only where the quieter voice is the point:
   * a `blockquote`’s body and a list’s marker glyphs.
   *
   * Inline `code` is a tag, so it takes the translucent `--bg-hover` rather
   * than a surface token. The two surface steps collapse in light mode —
   * `--bg-surface` and `--bg-surface-raised` are both `#FFFFFF`, over a
   * `--bg-canvas` page of `#FAFAFA` — so a "raised" chip read 1.04:1 against
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
  defineOptions({ name: 'DocProse' })

  defineSlots<{
    /** The document body: markdown-rendered HTML or hand-written markup. */
    default(): unknown
  }>()
</script>

<template>
  <div
    data-testid="doc-prose"
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xxl) [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-xl) [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xxl) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-xl) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xxl) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-xl) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xxs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:font-medium [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:leading-(--leading-relaxed) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:font-light [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-medium [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-xs) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:py-0.5 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:leading-(--leading-relaxed) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:font-light [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-l-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-xxl) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:mt-(--spacing-xl) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-lg) [&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
