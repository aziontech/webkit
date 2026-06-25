<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowAnchor',
    inheritAttrs: false
  })

  defineProps<{
    /** Restricts the anchor to the incoming or outgoing connector; omitted marks both. */
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

  const rootClasses = computed(() =>
    cn(
      'inline-flex size-2 items-center justify-center rounded-[var(--shape-button)] bg-[var(--border-default)]',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <span
    aria-hidden="true"
    :data-type="type || null"
    :data-testid="testId"
    :class="rootClasses"
  >
    <slot />
  </span>
</template>
