<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowAnchor',
    inheritAttrs: false
  })

  const props = defineProps<{
    /** Which connector attaches here: `end` is the incoming endpoint, `start` the outgoing origin; omitted marks both. */
    type?: 'start' | 'end'
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__anchor`
  )

  const rootClasses = computed(() => cn('block', attrs.class as string | undefined))
</script>

<template>
  <div
    :data-flow-anchor="props.type ?? 'both'"
    :data-testid="testId"
    :class="rootClasses"
  >
    <slot />
  </div>
</template>
