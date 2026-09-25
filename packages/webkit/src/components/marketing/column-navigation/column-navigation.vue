<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ColumnNavigation',
    inheritAttrs: false
  })

  /** How many columns the directory fans out to at the large breakpoint. */
  export type ColumnNavigationColumns = 2 | 3 | 4
  /** How many columns the directory holds below the small breakpoint. */
  export type ColumnNavigationMobileColumns = 1 | 2

  interface Props {
    /** Accessible name for the navigation landmark; a page carrying more than one needs each of them named. */
    ariaLabel?: string
    /** How many columns the directory fans out to at the large breakpoint. */
    columns?: ColumnNavigationColumns
    /** How many columns the directory holds below the small breakpoint. */
    mobileColumns?: ColumnNavigationMobileColumns
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    columns: 4,
    mobileColumns: 1
  })

  defineSlots<{
    /** The columns, composed as `ColumnNavigation.Column` elements in reading order. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-column-navigation'
  )
</script>

<template>
  <!-- The rules are the grid's own gaps: the block carries the hairline colour and each
       column paints the page canvas over it, so four adjacent columns produce three
       rules instead of six, and an empty block paints nothing at all. -->
  <nav
    v-bind="$attrs"
    :data-testid="testId"
    :data-columns="columns"
    :data-mobile-columns="mobileColumns"
    :aria-label="ariaLabel || undefined"
    class="grid gap-px bg-(--border-default) data-[mobile-columns=1]:grid-cols-1 data-[mobile-columns=2]:grid-cols-2 data-[columns=2]:sm:grid-cols-2 data-[columns=3]:sm:grid-cols-2 data-[columns=3]:lg:grid-cols-3 data-[columns=4]:sm:grid-cols-2 data-[columns=4]:lg:grid-cols-4"
  >
    <slot />
  </nav>
</template>
