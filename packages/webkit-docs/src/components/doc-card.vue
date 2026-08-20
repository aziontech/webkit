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
   */
  defineOptions({ name: 'DocCard' })

  interface Props {
    /** Card heading. */
    title?: string
    /** PrimeIcons class for the leading glyph. */
    icon?: string
    /** Destination; when set the whole card becomes the link. */
    href?: string
    /** Where the link opens. */
    target?: '_self' | '_blank'
    /** Fallback copy when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    icon: '',
    href: '',
    target: '_self',
    label: ''
  })

  defineSlots<{
    /** Card copy. */
    default(): unknown
  }>()

  const isLink = computed(() => props.href.length > 0)
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    data-testid="doc-card"
    data-doc-chrome
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="isLink && target === '_blank' ? 'noreferrer' : undefined"
    class="group relative flex h-full flex-col bg-(--bg-canvas) px-6 py-5 no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface) focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <i
      v-if="icon"
      :class="icon"
      class="mb-(--spacing-md) size-6 text-[1.5rem] leading-none text-(--text-muted) transition-colors duration-150 ease-out group-hover:text-(--primary) motion-reduce:transition-none"
      aria-hidden="true"
    />
    <span class="text-heading-xs text-(--text-default)">{{ title }}</span>
    <span
      v-if="$slots.default || label"
      class="mt-(--spacing-xxs) text-pretty text-body-sm text-(--text-muted) [&>*:first-child]:pt-0! [&_p]:text-body-sm!"
    >
      <slot>{{ label }}</slot>
    </span>
  </component>
</template>
