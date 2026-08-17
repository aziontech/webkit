<script setup>
  /**
   * BannerContainer — a fluid, full-width banner band.
   *
   * The "banner fluid container" pattern shared by the Hub and Docs heroes: a
   * full-bleed <section> whose content is centered in a max-width column with
   * consistent horizontal + vertical padding. Its bottom edge (`bordered`) meets
   * the SectionContainer's border-x below it so the frame reads as one
   * continuous border with no doubled lines.
   *
   *   • maxWidth — inner column width token ('7xl' hub, '6xl' docs, …), or 'full'
   *                for a full-bleed band whose content only keeps its padding.
   *   • bordered — draw the bottom hairline (default true).
   *   • hero     — fill the viewport height and center the content vertically.
   *
   * `hero` subtracts `--banner-offset` from the viewport height, so a banner
   * mounted under a fixed bar (the docs top bar) still fills exactly one screen:
   * pass the bar's height as `class="[--banner-offset:3.5rem]"`. Unset ⇒ 0, so a
   * banner that owns the whole viewport needs nothing.
   *
   * The backdrop behind the content (z-0) comes from one of two places:
   *
   *   • banner="<key>" — a registered backdrop from `site/ui/banners/index.js`
   *                      ('globe', 'contour', 'mesh', …). The page names one; it
   *                      never imports the backdrop itself.
   *   • #background     — a one-off backdrop passed as markup. When both are
   *                      given the slot wins, so a page can always override.
   *
   * The default slot is the z-10 copy.
   */
  import { BANNER_NAMES, BANNERS } from '../banners/index.js'

  const MAX_W = {
    '3xl': 'max-w-(--container-xl)',
    '4xl': 'max-w-(--container-2xl)',
    '5xl': 'max-w-(--container-3xl)',
    '6xl': 'max-w-(--container-4xl)',
    '7xl': 'max-w-(--container-5xl)',
    full: 'max-w-none'
  }

  defineProps({
    // One of the MAX_W keys ('3xl'…'7xl', 'full').
    maxWidth: {
      type: String,
      default: '7xl'
    },
    bordered: {
      type: Boolean,
      default: true
    },
    hero: {
      type: Boolean,
      default: false
    },
    // A registered backdrop key from site/ui/banners/index.js — '' for none.
    banner: {
      type: String,
      default: '',
      validator: (v) => v === '' || BANNER_NAMES.includes(v)
    }
  })
</script>

<template>
  <section
    :class="[
      'relative w-full overflow-hidden',
      bordered && 'border-b border-(--border-default)',
      hero && 'flex min-h-[calc(100dvh-var(--banner-offset,0px))] flex-col justify-center'
    ]"
  >
    <slot name="background">
      <component
        :is="BANNERS[banner]"
        v-if="banner"
      />
    </slot>
    <div
      :class="[
        MAX_W[maxWidth],
        'relative z-10 mx-auto w-full px-(--spacing-xl) py-(--spacing-xl)'
      ]"
    >
      <slot />
    </div>
  </section>
</template>
