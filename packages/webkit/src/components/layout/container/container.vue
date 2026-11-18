<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Container',
    inheritAttrs: false
  })

  /** Width the column is capped at. */
  export type ContainerWidth = '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'site'

  export interface ContainerProps {
    /** Width the column is capped at; `site` is the marketing measure every band of that page frame shares. */
    maxWidth?: ContainerWidth
    /** Draw the column's two vertical rules. */
    bordered?: boolean
    /** Pad the column itself. Leave off for a stack of modules that own their padding. */
    padded?: boolean
  }

  const props = withDefaults(defineProps<ContainerProps>(), {
    maxWidth: '7xl',
    bordered: true,
    padded: false
  })

  defineSlots<{
    /** The bands stacked inside the column, in reading order. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'container')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-width="maxWidth"
    :data-bordered="props.bordered || null"
    :data-padded="props.padded || null"
    class="mx-auto w-full data-[width=3xl]:max-w-(--container-3xl) data-[width=4xl]:max-w-(--container-4xl) data-[width=5xl]:max-w-(--container-5xl) data-[width=6xl]:max-w-(--container-6xl) data-[width=7xl]:max-w-(--container-7xl) data-[width=site]:layout-column-site data-[bordered]:border-x data-[bordered]:border-(--border-default) data-[padded]:px-(--layout-boundary-inline) data-[padded]:py-(--spacing-2xl)"
  >
    <slot />
  </div>
</template>
