<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

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
   * BODY COPY IS `--text-muted`; every other rung stays `--text-default`.
   * Paragraphs and list items are the quieter voice, and the things a reader
   * scans for or lifts out of the page stay in full ink: headings, `strong`,
   * and inline `code`. That is what makes `strong` work here — it is
   * `font-normal`, so its emphasis is ink and not weight, and against a muted
   * paragraph it finally has something to be emphatic against.
   *
   * THIS REVERSES AN EARLIER CALL, and the reason for that call has not gone
   * away: `--text-muted` is a mid grey that measures 3.78:1 on `--bg-canvas`
   * and 3.95:1 on `--bg-surface` in light mode — under the 4.5:1 AA needs for
   * body-size text. Dark is fine (5.32:1 / 5.01:1); it is light that fails.
   * The fix, when it is taken, is a documentation body ink one step darker
   * rather than a different hue: one stop down the neutral ramp reads as the
   * same quieter voice and clears AA at 4.54:1 on canvas. Until that token
   * exists this contract carries the gap knowingly, in one place, rather than
   * every page carrying its own. The measured values are in the spec.
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
   * copy around it is muted: the chip is the thing the reader types. Its
   * corners are `--shape-elements` (6px), not the `--shape-flat` they were: a
   * square-cornered tint reads as a highlighter stroke over the sentence,
   * where a rounded one reads as a discrete token sitting in it. `DocCallout`
   * and `DocItem` round their own code chips to the same radius, so every chip
   * a reader can copy has one shape.
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

  /**
   * CLICK AN INLINE CHIP TO COPY IT.
   *
   * Inline `code` is almost always a literal the reader is about to type — a
   * command, a flag, a tool name — so the chip that marks it may as well hand
   * it over. Hovering one shows "Copy"; clicking copies its text and the label
   * turns to "Copied".
   *
   * DELEGATED FROM THIS ROOT, not built into a chip component. Prose `code`
   * arrives three ways — a vnode from a renderer, hand-written markup in a
   * page, raw HTML from another pipeline — and only two of those can hold a
   * component. A listener on the container catches all three, and it is also
   * where the chip is already styled, so presentation and behaviour stay in
   * one file. Attached programmatically rather than as a template `@click`: a
   * `@click` on this non-interactive root is what
   * `click-events-have-key-events` exists to stop.
   *
   * IT ADDS NO TAB STOPS, deliberately. Making every chip a real button would
   * put thirty of them on a documentation page in front of a keyboard user,
   * for a string that is already plain selectable text. The copy is a pointer
   * shortcut over content that stays reachable the ordinary way; it is not the
   * only path to it.
   *
   * Excluded: anything inside `pre` (a fenced block, which has its own copy
   * control) and anything a component generated (below).
   */
  const proseRef = ref<HTMLElement | null>(null)
  const tipFor = ref<HTMLElement | null>(null)
  const tipLabel = ref('Copy')
  const tipLeft = ref(0)
  const tipTop = ref(0)
  let resetTimer: ReturnType<typeof globalThis.setTimeout> | null = null

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prose')

  const chipFrom = (target: globalThis.EventTarget | null): HTMLElement | null => {
    const root = proseRef.value
    const node = target instanceof globalThis.Element ? target : null
    const chip = node?.closest('code') as HTMLElement | null
    if (!chip || !root?.contains(chip) || chip.closest('pre')) return null
    // WHAT COUNTS AS A CHIP is not `[data-doc-chrome]`, the boundary the STYLING
    // uses. A chip inside a callout or an item row sits inside chrome and is
    // still a literal the reader wants — it looks identical to a chip in a
    // paragraph, so it has to behave identically. The line that matters is
    // authored-vs-generated, and the DOM already draws it: a `code` a component
    // owns identifies itself with a `data-testid` and holds child elements (a
    // highlighted CodeBlock line is a row of token spans), where an authored
    // chip is a bare element with one text node.
    if (chip.dataset['testid'] || chip.childElementCount > 0) return null
    return chip
  }

  const anchorTip = (chip: HTMLElement): void => {
    const rect = chip.getBoundingClientRect()
    tipLeft.value = rect.left + rect.width / 2
    tipTop.value = rect.top
  }

  const clearReset = (): void => {
    if (resetTimer !== null) globalThis.clearTimeout(resetTimer)
    resetTimer = null
  }

  const onOver = (event: globalThis.PointerEvent): void => {
    const chip = chipFrom(event.target)
    if (!chip || chip === tipFor.value) return
    clearReset()
    tipLabel.value = 'Copy'
    tipFor.value = chip
    anchorTip(chip)
  }

  const onOut = (event: globalThis.PointerEvent): void => {
    const chip = chipFrom(event.target)
    if (!chip || chip !== tipFor.value) return
    // Ignore a move between the chip's own text nodes.
    if (chipFrom(event.relatedTarget) === chip) return
    clearReset()
    tipFor.value = null
  }

  const onClick = async (event: globalThis.MouseEvent): Promise<void> => {
    const chip = chipFrom(event.target)
    // A chip inside a link belongs to the link — copying would eat the navigation.
    if (!chip || chip.closest('a')) return
    const text = chip.textContent ?? ''
    if (!text) return
    tipFor.value = chip
    anchorTip(chip)
    try {
      await globalThis.navigator.clipboard.writeText(text)
      tipLabel.value = 'Copied'
    } catch {
      // Denied permission, or an insecure origin. Say what still works rather
      // than failing silently under a tooltip that promised a copy.
      tipLabel.value = 'Press \u2318C to copy'
      globalThis.getSelection()?.selectAllChildren(chip)
    }
    clearReset()
    resetTimer = globalThis.setTimeout(() => {
      tipLabel.value = 'Copy'
      resetTimer = null
    }, 1400)
  }

  // The panel is `position: fixed` off a viewport rect, so a scroll or a resize
  // moves the chip out from under it. Re-anchor rather than hide: the pointer is
  // still on the chip, and a tooltip that vanishes mid-scroll reads as a glitch.
  const reanchor = (): void => {
    if (tipFor.value) anchorTip(tipFor.value)
  }

  onMounted(() => {
    const root = proseRef.value
    if (!root) return
    root.addEventListener('pointerover', onOver)
    root.addEventListener('pointerout', onOut)
    root.addEventListener('click', onClick)
    globalThis.addEventListener('scroll', reanchor, { passive: true, capture: true })
    globalThis.addEventListener('resize', reanchor, { passive: true })
  })

  onBeforeUnmount(() => {
    const root = proseRef.value
    root?.removeEventListener('pointerover', onOver)
    root?.removeEventListener('pointerout', onOut)
    root?.removeEventListener('click', onClick)
    globalThis.removeEventListener('scroll', reanchor, { capture: true })
    globalThis.removeEventListener('resize', reanchor)
    clearReset()
  })
</script>

<template>
  <div
    ref="proseRef"
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-2xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xl [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:md:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-elements) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-xs) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:py-0.5 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_code:not([data-testid])]:cursor-pointer [&_code:not([data-testid])]:hover:ring-1 [&_code:not([data-testid])]:hover:ring-(--border-default) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-l-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-12 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-lg) [&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs)"
  >
    <slot />

    <!-- ONE panel for every chip on the page, moved to whichever is hovered.
         Per-chip tooltips would mean a component per code span, which the
         raw-HTML and hand-written paths cannot have (see the copy block in the
         script). It borrows `Tooltip`'s own surface — contrast fill,
         `--shape-elements`, `text-body-xs` — so a gloss in the documentation
         and a tooltip in an application are the same object, and it is
         `pointer-events-none` so it can never sit between the pointer and the
         chip it describes.

         IT LIVES INSIDE THE ROOT DIV, not beside it. A `<Teleport>` counts as a
         root node, so hoisting it to the template's top level makes this
         component a FRAGMENT — and a fragment cannot inherit attributes, which
         silently drops the `class` the consumer passes to cap the column.
         Nested here it still renders under `<body>`; the component just keeps
         its single root. -->
    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <span
          v-if="tipFor"
          role="tooltip"
          data-testid="documentation-doc-prose-copy-tip"
          :style="{ left: `${tipLeft}px`, top: `${tipTop}px` }"
          class="pointer-events-none fixed z-(--z-input-overlay) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing-xxs))] rounded-(--shape-elements) bg-(--bg-contrast) px-(--spacing-xs) py-(--spacing-xxs) text-body-xs whitespace-nowrap text-(--text-contrast)"
          >{{ tipLabel }}</span
        >
      </Transition>
    </Teleport>
  </div>
</template>
