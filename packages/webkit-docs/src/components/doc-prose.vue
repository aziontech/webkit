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
   * Rhythm: one base gap carries the whole flow, and only headings escalate
   * above it. The in-content ladder is 32 / 24 / 16 — h2, h3, h4 — over a 16
   * base gap for flowing text, 24 above a block component, hr or table, and
   * `--spacing-xxs` between list items (`md` once an item holds its own
   * paragraph or nested list). h2 alone opens further at `xl`, to 48.
   *
   * That ladder is deliberately **static**: the same 32 / 24 / 16 at every
   * width. The semantic spacing scale is fluid, and its fluidity runs the wrong
   * way for prose — `--spacing-lg` and `--spacing-md` are both 1rem below `sm`,
   * so a single token per rung collapsed h3, h4, a block and a paragraph onto
   * one 16px gap on a phone. Where a rung needs to hold still, it is pinned by
   * a *descending* responsive pair (`pt-(--spacing-xl) sm:pt-(--spacing-lg)`
   * reads 24 at every width, because `xl` is 24 below `sm` and `lg` is 24 from
   * `sm` up). The pairs are same-specificity and the `sm:` rule is emitted
   * second, so it wins inside the media query with no `!` needed.
   *
   * Compressing the prose gap instead was the other way to restore the phone
   * ladder, and it is the wrong one: body copy is 16px at `--leading-relaxed`,
   * a 26px line box, so a 12px paragraph gap puts a paragraph break at 1.46x
   * the line spacing where 16px puts it at 1.6x. The base gap is the one thing
   * on the page that must stay readable, so the headings moved and it did not.
   *
   * h4 is the one heading that does *not* escalate — it shares the base gap,
   * because it is a label inside a section rather than a new section. The scale
   * has no rung between 16 and 24 to give it, so it earns its level on type
   * instead: `font-medium` against the 300 that every heading and body token
   * carries, at `text-heading-xxs`. `text-heading-xs` was worse than a tie —
   * flat 16px against h3’s 14 → 16 → 18 ramp, so on a phone an h4 rendered
   * *larger* than the h3 above it, at the same weight and the same gap as the
   * paragraph beside it.
   *
   * Prose `h1` keeps `--spacing-xxl` and ties h2 at base (32/32). It is
   * unreachable in practice: the page title is `DocPageHeader`’s h1 and is
   * chrome, so authored content starts at h2.
   *
   * Nothing carries space *below* it, so the gap under a heading is always the
   * base gap and two blocks can never fight over whose margin wins. The first
   * block opens flush — the reset reaches through the renderer's wrapper so a
   * page starting with an h1 does not pay for a gap above it.
   *
   * Flowing text is `--text-muted`; headings, `strong` and list items stay
   * `--text-default`, so the page reads as landmarks over body copy.
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
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xxl) [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xxl) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-xl) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xxs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:font-medium [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:leading-(--leading-relaxed) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-medium [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-1 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:py-0.5 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:leading-(--leading-relaxed) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xxs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-md) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-l-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-md) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-xl) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:mt-(--spacing-lg) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-xl) [&_[data-doc-block]]:sm:mt-(--spacing-lg) [&_[data-doc-block]:first-child]:mt-0"
  >
    <slot />
  </div>
</template>
