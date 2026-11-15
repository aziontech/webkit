<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FlowParallel',
    inheritAttrs: false
  })

  /** Horizontal alignment of the parallel branches. */
  export type FlowDiagramParallelAlign = 'start' | 'end'

  export interface FlowDiagramParallelProps {
    /** Horizontal alignment of the parallel branches: `start` left-aligns, `end` right-aligns. */
    align?: FlowDiagramParallelAlign
  }

  withDefaults(defineProps<FlowDiagramParallelProps>(), {
    align: 'start'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram-parallel'
  )
</script>

<template>
  <div
    role="listitem"
    data-slot="flow-diagram-parallel"
    :data-align="align"
    :data-testid="testId"
    class="flex flex-col"
    :class="attrs.class"
  >
    <div
      role="list"
      data-slot="flow-branches"
      :data-align="align"
      :data-testid="`${testId}__branches`"
      class="flex w-full flex-col gap-(--spacing-md) data-[align=start]:items-start data-[align=end]:items-end"
    >
      <slot />
    </div>
  </div>
</template>
