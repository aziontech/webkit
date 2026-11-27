<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../../utils/safe-href'
  import RegistrationFrame from '../../../layout/registration-frame/registration-frame.vue'

  defineOptions({
    name: 'BentoGridCell',
    inheritAttrs: false
  })

  /** How many columns the cell claims from the medium breakpoint up. */
  export type BentoGridCellSpan = '1' | '2' | '3' | '4' | 'full'
  /** How many rows the cell claims from the medium breakpoint up. */
  export type BentoGridCellRows = '1' | '2'
  /** The cell's fill. */
  export type BentoGridCellVariant = 'surface' | 'canvas' | 'none'

  export interface BentoGridCellProps {
    /** How many columns the cell claims from the medium breakpoint up; below it every cell claims one, and only `full` takes the whole row. */
    span?: BentoGridCellSpan
    /** How many rows the cell claims from the medium breakpoint up. */
    rows?: BentoGridCellRows
    /** The cell's fill; `none` leaves the surface to the content composed inside it. */
    variant?: BentoGridCellVariant
    /** Pads the cell's content away from its rules; off for content that reaches the cell's edges. */
    padded?: boolean
    /** When set, the whole tile is one link to this URL: the cell's surface renders as an anchor. */
    href?: string
  }

  const props = withDefaults(defineProps<BentoGridCellProps>(), {
    span: '1',
    rows: '1',
    variant: 'surface',
    padded: true,
    href: ''
  })

  defineSlots<{
    /** The cell's content, composed as real elements. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'bento-grid-cell')

  const link = computed(() => safeHref(props.href))

  const SURFACE_CLASS =
    'h-full data-[variant=canvas]:bg-(--bg-canvas) data-[variant=surface]:bg-(--bg-surface) data-[padded]:p-(--spacing-xl) ' +
    'data-[link]:block data-[link]:text-(--text-default) data-[link]:no-underline data-[link]:outline-none ' +
    'data-[link]:focus-visible:ring-2 data-[link]:focus-visible:ring-inset data-[link]:focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-span="span"
    :data-rows="rows"
    class="flex min-w-0 data-[span=full]:col-span-full data-[span=2]:md:col-span-2 data-[span=3]:md:col-span-3 data-[span=4]:md:col-span-4 data-[rows=2]:md:row-span-2"
  >
    <RegistrationFrame
      :flush="['top', 'left']"
      marks="all"
      class="h-full w-full min-w-0"
    >
      <component
        :is="link ? 'a' : 'div'"
        :href="link ?? undefined"
        :data-variant="variant"
        :data-padded="padded || null"
        :data-link="link ? true : null"
        :data-testid="link ? `${testId}__link` : undefined"
        :class="SURFACE_CLASS"
      >
        <slot />
      </component>
    </RegistrationFrame>
  </div>
</template>
