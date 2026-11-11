<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowParallel',
    inheritAttrs: false
  })

  defineProps<{
    /** Horizontal alignment of the parallel branches: `start` left-aligns, `end` right-aligns. */
    align?: 'start' | 'end'
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__parallel`
  )

  const rootClasses = computed(() => cn('flex flex-col', attrs.class as string | undefined))
</script>

<template>
  <div
    role="listitem"
    data-flow-kind="parallel"
    :data-align="align ?? 'start'"
    :data-testid="testId"
    :class="rootClasses"
  >
    <div
      role="list"
      :data-align="align ?? 'start'"
      :data-testid="`${testId}-branches`"
      class="flex w-full flex-col gap-(--spacing-md) data-[align=start]:items-start data-[align=end]:items-end"
    >
      <slot />
    </div>
  </div>
</template>
