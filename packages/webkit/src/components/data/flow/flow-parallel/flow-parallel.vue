<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowParallel',
    inheritAttrs: false
  })

  /** Horizontal alignment of the parallel branches. */
  export type FlowParallelAlign = 'start' | 'end'

  export interface FlowParallelProps {
    /** Horizontal alignment of the parallel branches: `start` left-aligns, `end` right-aligns. */
    align?: FlowParallelAlign
  }

  withDefaults(defineProps<FlowParallelProps>(), {
    align: 'start'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      `${ctx?.testId.value ?? 'data-flow'}__parallel`
  )
</script>

<template>
  <div
    role="listitem"
    data-slot="flow-parallel"
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
