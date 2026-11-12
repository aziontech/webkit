<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { StatTileGroupInjectionKey } from './injection-key'

  defineOptions({ name: 'StatTileGroup', inheritAttrs: false })

  interface Props {
    /** Accessible name of the strip, such as Usage; empty leaves the group unnamed. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: ''
  })

  defineSlots<{
    /** The StatTile cells, in reading order. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'chart-stat-tile-group'
  )

  provide(StatTileGroupInjectionKey, { grouped: true })
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || undefined"
    :data-testid="testId"
    class="@container/stat-tile-group flex min-w-0 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <div
      class="-me-px -mb-px grid flex-1 grid-cols-1 @md/stat-tile-group:grid-cols-2 @3xl/stat-tile-group:auto-cols-fr @3xl/stat-tile-group:grid-flow-col @3xl/stat-tile-group:grid-cols-none"
      :data-testid="`${testId}__cells`"
    >
      <slot />
    </div>
  </div>
</template>
