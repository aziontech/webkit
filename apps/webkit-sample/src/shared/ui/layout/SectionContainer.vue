<script setup>
  /**
   * SectionContainer — the bordered content column.
   *
   * The framed column that sits below a BannerContainer hero: centered at a
   * max-width with vertical rules on both edges (`bordered` → border-x). Its top
   * edge is the banner's border-b and its bottom edge the footer's border-t, so
   * the whole page frame reads as one continuous border.
   *
   *   • maxWidth — column width token; match the banner above it.
   *   • bordered — draw the vertical frame rules (default true).
   *   • padded   — add inner padding. Leave false for an edge-to-edge stack of
   *                modules that each own their own padding (so nothing doubles);
   *                pass true for a plain prose column.
   */
  const MAX_W = {
    '3xl': 'max-w-[var(--container-3xl)]',
    '4xl': 'max-w-[var(--container-4xl)]',
    '5xl': 'max-w-[var(--container-5xl)]',
    '6xl': 'max-w-[var(--container-6xl)]',
    '7xl': 'max-w-[var(--container-7xl)]'
  }

  defineProps({
    // One of the MAX_W keys ('3xl'…'7xl').
    maxWidth: {
      type: String,
      default: '7xl'
    },
    bordered: {
      type: Boolean,
      default: true
    },
    padded: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div
    :class="[
      MAX_W[maxWidth],
      'mx-auto w-full',
      bordered && 'border-x border-[var(--border-default)]',
      padded && 'px-[var(--spacing-xl)] py-[var(--spacing-xxl)]'
    ]"
  >
    <slot />
  </div>
</template>
