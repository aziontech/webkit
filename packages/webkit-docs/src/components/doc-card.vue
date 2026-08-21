<script setup lang="ts">
  import { computed } from 'vue'

  /**
   * A navigational card — the tile Mintlify uses to fan a landing page out into
   * its sections. It renders as a link when `href` is set and as a plain
   * surface otherwise, so a card is never a fake button.
   *
   * IT IS A CELL, NOT A RAISED CARD. A rounded, filled card is a surface that
   * sits ON the page — right when it carries a distinct object (a row of a data
   * list, a settings group). These do not: they are the page's own sections,
   * laid out as a grid so the reader can pick a path. So the card draws no rule
   * and no radius of its own; `DocCardGroup` frames the whole set and the grid's
   * gaps rule between them, the same shape the docs home band uses.
   *
   * The one thing the cell MUST draw is its background: the hairlines between
   * cells are the group's rule-coloured backdrop showing through 1px gaps, so a
   * transparent cell would leak that colour across its whole face.
   *
   * THE INSET IS FIXED, NOT RESPONSIVE. It was `--spacing-xl`, which resolves to
   * 24/32/48px across the breakpoints — so the widest layout, where the grid is
   * already at three or four columns and each cell is at its narrowest, was also
   * where the padding was largest. That eats the cell from both sides at once.
   * `px-6 py-5` (24/20) is the reference box model and holds at every width; the
   * shorter vertical inset is what keeps a two-line card from going square.
   *
   * The hierarchy inside is glyph -> title -> copy, and only the first gap is a
   * real separation: the glyph is a fixed 24px (a genuine step over the 16px
   * title, which `text-heading-sm` was not — it lands at 16px itself for most of
   * the range) and sits `--spacing-md` above it, while the copy is only
   * `--spacing-xxs` under the title so it reads as that title's subtitle rather
   * than as a third loose line.
   *
   * A card with NO copy renders no copy element at all — not an empty one. A card
   * that is a mark plus one word (the home page's framework band) would otherwise
   * carry that line's `--spacing-xxs` as trailing space, ending 4px lower than its
   * own bottom inset while every neighbour in the grid ends on its padding.
   *
   * THE GLYPH IS A SLOT, and `icon` is its shorthand. A font glyph covers the
   * cases this layer owns — a product, a section, a verb — but a card whose
   * subject is a PRODUCT OF ANOTHER COMPANY needs that company's real mark, and
   * those are inline SVG that lives in the consuming site (they are other
   * people's brands; the design system ships Azion's own marks and its product
   * glyphs). So the region is open: pass `icon` for a glyph, or fill `#icon` with
   * whatever draws the mark. Either way it occupies the same fixed 24px box, so a
   * grid mixing the two still rules straight across.
   *
   * THE OVERLINE NAMES THE MAKER, not the thing. It exists for the case where the
   * title alone is ambiguous about provenance — "Codex" says nothing about OpenAI,
   * "Windsurf" nothing about Cognition — and the reader is choosing partly on who
   * built it. It is set small, muted and above the title because it is a label on
   * the title rather than a line of its own to read; when the title already
   * carries the maker ("GitHub Copilot") there is nothing to add and the card
   * simply omits it.
   *
   * THE CLOSING LINK IS A PROP, NOT MARKUP THE PAGE COMPOSES. `link` is the
   * card's call-to-action text ("Open the Console"), rendered as a row at the
   * FOOT of the cell — `mt-auto`, so a grid of cards whose copy runs to
   * different lengths still lands every call-to-action on one line. It is a
   * `span` and never an `<a>`: the whole card is already the link, and a nested
   * anchor is invalid HTML that browsers un-nest at parse time.
   *
   * Its glyph says WHERE the link goes, and the two say it in the same
   * vocabulary the rest of the layer uses: `pi-chevron-right` for a page inside
   * the documentation (the same glyph `DocItem` draws on its rows), and
   * `pi-arrow-up-right` when the destination leaves it — an absolute URL, or an
   * explicit `target="_blank"`. The external arrow travels its own diagonal on
   * hover (right and up together, 240ms on the expressive curve, so it glides
   * rather than snaps) where the chevron only nudges right, which is the
   * difference the two glyphs are making visible.
   *
   * The transition names `translate`, not `transform`: Tailwind v4 compiles
   * `translate-x-*` / `-translate-y-*` to the standalone `translate` property,
   * so a transition on `transform` interpolates nothing and the glyph snaps.
   */
  defineOptions({ name: 'DocCard' })

  interface Props {
    /** Card heading. */
    title?: string
    /** Small muted line above the title — who makes the thing, when the title does not say. */
    overline?: string
    /** PrimeIcons class for the leading glyph. Ignored when the `icon` slot is filled. */
    icon?: string
    /** Destination; when set the whole card becomes the link. */
    href?: string
    /** Where the link opens. */
    target?: '_self' | '_blank'
    /** Fallback copy when the default slot is empty. */
    label?: string
    /** Call-to-action text; when set the card closes on a link row. */
    link?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    overline: '',
    icon: '',
    href: '',
    target: '_self',
    label: '',
    link: ''
  })

  defineSlots<{
    /** Card copy. */
    default(): unknown
    /** The leading mark, when a font glyph will not do. Replaces `icon`. */
    icon(): unknown
  }>()

  const isLink = computed(() => props.href.length > 0)

  // Leaves the documentation: an absolute URL (http(s) or protocol-relative), a
  // `mailto:`, or a card the page has explicitly told to open in a new tab.
  const isExternal = computed(
    () => props.target === '_blank' || /^(https?:)?\/\/|^mailto:/.test(props.href)
  )
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    data-testid="doc-card"
    data-doc-chrome
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="isLink && target === '_blank' ? 'noreferrer' : undefined"
    class="group relative flex h-full flex-col bg-(--bg-surface) px-6 py-5 no-underline transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <!-- One 24px box either way, so a grid that mixes a font glyph and a brand mark
         still has its titles on one line. The mark keeps its own colour — that is the
         point of it — so only the font glyph takes the hover tint. -->
    <span
      v-if="$slots.icon"
      class="mb-(--spacing-md) flex size-6 items-center [&>svg]:size-6"
    >
      <slot name="icon" />
    </span>
    <i
      v-else-if="icon"
      :class="icon"
      class="mb-(--spacing-md) size-6 text-[1.5rem] leading-none text-(--text-muted) transition-colors duration-150 ease-out group-hover:text-(--primary) motion-reduce:transition-none"
      aria-hidden="true"
    />
    <span
      v-if="overline"
      class="text-overline-sm text-(--text-muted)"
      >{{ overline }}</span
    >
    <span class="text-heading-xs text-(--text-default)">{{ title }}</span>
    <span
      v-if="$slots.default || label"
      class="mt-(--spacing-xxs) text-pretty text-body-sm text-(--text-muted) [&>*:first-child]:pt-0! [&_p]:text-body-sm!"
    >
      <slot>{{ label }}</slot>
    </span>
    <!-- The closing call-to-action, pushed to the foot of the cell so a row of
         cards lands every one of them on the same line. -->
    <span
      v-if="link"
      class="mt-auto flex items-center gap-(--spacing-xxs) pt-(--spacing-sm) text-label-md text-(--text-link)"
    >
      {{ link }}
      <i
        :class="
          isExternal
            ? 'pi-arrow-up-right group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
            : 'pi-chevron-right group-hover:translate-x-0.5'
        "
        class="pi text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
        aria-hidden="true"
      />
    </span>
  </component>
</template>
