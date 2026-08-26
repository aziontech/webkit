<script setup>
  /**
   * SectionContainer — the bordered content column.
   *
   * The framed column that sits below a BannerContainer hero: centered at a
   * max-width with vertical rules on both edges (`bordered` → border-x). Its top
   * edge is the banner's border-b and its bottom edge the footer's border-t, so
   * the whole page frame reads as one continuous border.
   *
   *   • maxWidth — column width token; match the banner above it. `site` is the
   *                marketing site's own measure (--container-site), the one every
   *                band of that page frame — nav, hero, sections, footer — shares.
   *   • bordered — draw the vertical frame rules (default true).
   *   • padded   — add inner padding. Leave false for an edge-to-edge stack of
   *                modules that each own their own padding (so nothing doubles);
   *                pass true for a plain prose column. The side inset is the
   *                SURFACE's `--layout-boundary-inline` (declared once per shell),
   *                so a padded column lines up with the bar above it; the vertical
   *                is band rhythm and stays `--spacing-xxl`.
   */
  const MAX_W = {
    '3xl': 'max-w-(--container-3xl)',
    '4xl': 'max-w-(--container-4xl)',
    '5xl': 'max-w-(--container-5xl)',
    '6xl': 'max-w-(--container-6xl)',
    '7xl': 'max-w-(--container-7xl)',
    site: 'max-w-(--container-site)'
  }

  defineProps({
    // One of the MAX_W keys ('3xl'…'7xl', 'site').
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
      bordered && 'border-x border-(--border-default)',
      padded && 'px-(--layout-boundary-inline) py-(--spacing-xxl)'
    ]"
  >
    <slot />
  </div>
</template>
