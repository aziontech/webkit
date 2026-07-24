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
   *   • maxWidth — inner column width token ('7xl' hub, '6xl' docs, …).
   *   • bordered — draw the bottom hairline (default true).
   *   • hero     — fill the viewport height and center the content vertically.
   *
   * A `#background` slot renders behind the content (z-0) for full-bleed
   * backdrops (the ASCII field, scrims); the default slot is the z-10 copy.
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
    hero: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <section
    :class="[
      'relative w-full overflow-hidden',
      bordered && 'border-b border-[var(--border-default)]',
      hero && 'flex min-h-dvh flex-col justify-center'
    ]"
  >
    <slot name="background" />
    <div
      :class="[
        MAX_W[maxWidth],
        'relative z-10 mx-auto w-full px-[var(--spacing-xl)] py-[var(--spacing-xxl)]'
      ]"
    >
      <slot />
    </div>
  </section>
</template>
