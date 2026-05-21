<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { PanelInjectionKey, type PanelSize } from './injection-key'

  defineOptions({
    name: 'Panel',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Max width of the panel shell. */
      size?: PanelSize
    }>(),
    {
      size: 'medium'
    }
  )

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-panel')

  provide(PanelInjectionKey, {
    testId: testId.value
  })

  const sizeClasses: Record<PanelSize, string> = {
    small: 'max-w-[var(--container-sm)]',
    medium: 'max-w-[var(--container-xl)]',
    large: 'max-w-[var(--container-2xl)]'
  }

  const rootClasses = computed(() =>
    cn(
      'flex w-full flex-col overflow-hidden',
      'rounded-[var(--shape-card)] border border-[var(--border-default)]',
      'bg-[var(--bg-surface)] shadow-[var(--card-shadow)]',
      'max-h-[min(90vh,640px)]',
      sizeClasses[props.size],
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    :class="rootClasses"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
