<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'NodeDiagramItem',
    inheritAttrs: false
  })

  export interface NodeDiagramItemProps {
    /** Name of the figure, e.g. `p95`. */
    label?: string
  }

  withDefaults(defineProps<NodeDiagramItemProps>(), {
    label: ''
  })

  defineSlots<{
    /** The value of the figure, e.g. `38 ms`. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'node-diagram-item'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="node-diagram-item"
    :data-testid="testId"
    class="flex min-w-0 items-baseline gap-(--spacing-2xs)"
  >
    <dt class="text-body-xs text-(--text-muted)">{{ label }}</dt>
    <dd
      dir="auto"
      class="m-0 text-label-sm text-(--text-default) tabular-nums"
    >
      <slot />
    </dd>
  </div>
</template>
