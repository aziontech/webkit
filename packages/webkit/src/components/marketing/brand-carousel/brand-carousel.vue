<script setup lang="ts">
  import { type Component, computed, defineAsyncComponent, useAttrs } from 'vue'

  import { brandMarkLabel, resolveBrandMark } from '../../../svg/brands/registry'
  import Overline from '../../overline/overline.vue'

  defineOptions({ name: 'BrandCarousel', inheritAttrs: false })

  /** Mark scale. */
  export type BrandCarouselSize = 'small' | 'medium'

  /** Whether the strip paints its own ground. */
  export type BrandCarouselKind = 'plain' | 'band'

  interface Props {
    /** Whether the strip paints its own ground; band fills it with the page canvas so a textured hero cannot show through the marks, and the floor still reads continuous with the band above it. */
    kind?: BrandCarouselKind
    /** Registry names of the marks rendered in the row, in order; an unregistered name renders as its own typographic wordmark so the row stays complete. */
    marks?: string[]
    /** Overline above the row, stating the claim the marks make. */
    label?: string
    /** Mark scale; medium is the marketing band and climbs 32/40/48 px by device class, small is a flat 24 px for a column. */
    size?: BrandCarouselSize
    /** Seconds for one full pass; left at 0 it is derived from the number of marks so every strip moves at one speed. */
    duration?: number
    /** Accessible name for the row of marks, announced instead of an unnamed list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'plain',
    marks: () => [],
    label: '',
    size: 'medium',
    duration: 0,
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-brand-carousel'
  )

  // Speed is the constant, not duration: one pass covers exactly one copy of the row, so a
  // flat duration would run a thirty-mark strip three times faster than an eleven-mark one.
  const SECONDS_PER_MARK = 5.4

  const passDuration = computed(
    () => props.duration || Math.round(props.marks.length * SECONDS_PER_MARK) || 1
  )

  const loaded = new Map<string, Component>()

  const resolved = computed(() =>
    props.marks.map((name) => {
      const loader = resolveBrandMark(name)
      if (loader && !loaded.has(name)) loaded.set(name, defineAsyncComponent(loader))
      return { name, label: brandMarkLabel(name), art: loader ? loaded.get(name) : null }
    })
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-kind="kind"
    class="group/strip flex flex-col items-center gap-(--spacing-xl) data-[kind=band]:w-full data-[kind=band]:bg-(--bg-canvas) data-[kind=band]:py-(--spacing-xl) data-[size=medium]:[--brand-cell:150px] data-[size=medium]:[--brand-mark:32px] data-[size=small]:[--brand-cell:120px] data-[size=small]:[--brand-mark:24px] md:data-[size=medium]:[--brand-cell:200px] md:data-[size=medium]:[--brand-mark:40px] lg:data-[size=medium]:[--brand-cell:240px] lg:data-[size=medium]:[--brand-mark:48px]"
  >
    <Overline
      v-if="label"
      show-cursor
      >{{ label }}</Overline
    >

    <!-- The mask fades both ends so a mark enters and leaves instead of popping in. -->
    <div
      v-if="resolved.length"
      class="group/loop relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <!-- The pass is set here, on the animated element: Tailwind declares `--animate-*` on
           `:root`, so a duration var inside that shorthand resolves there and never sees it. -->
      <div
        :style="{ animationDuration: `${passDuration}s` }"
        class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
      >
        <!-- The row twice: the loop travels exactly -50%, so the duplicate lands where the
             first copy started and the seam never shows. The trailing padding is the seam's
             only gap, since `gap` draws nothing between the two copies. -->
        <ul
          v-for="copy in 2"
          :key="copy"
          :data-size="size"
          :data-duplicate="copy === 2 || null"
          :aria-label="copy === 1 && ariaLabel ? ariaLabel : undefined"
          :aria-hidden="copy === 2 ? 'true' : undefined"
          class="m-0 flex w-max shrink-0 list-none items-center p-0 data-[size=medium]:gap-(--spacing-4) data-[size=medium]:pr-(--spacing-4) data-[size=small]:gap-(--spacing-8) data-[size=small]:pr-(--spacing-8) md:data-[size=medium]:gap-(--spacing-8) md:data-[size=medium]:pr-(--spacing-8) motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
        >
          <li
            v-for="mark in resolved"
            :key="`${copy}-${mark.name}`"
            :title="mark.label"
            class="flex w-(--brand-cell) shrink-0 items-center justify-center text-(--text-default) opacity-70 transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-100 motion-reduce:transition-none"
          >
            <component
              :is="mark.art"
              v-if="mark.art"
              :data-mark="mark.name"
              class="h-(--brand-mark) w-auto max-w-(--brand-cell) object-contain"
            />
            <!-- No artwork registered: the name keeps the row complete. -->
            <span
              v-else
              class="whitespace-nowrap text-heading-xxs"
              >{{ mark.label }}</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
