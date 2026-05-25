<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { PanelInjectionKey, type PanelSize } from './injection-key'
  import { dialogPanelSizeClasses, panelSizeClasses } from './presets/sizes'

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
      /** When true, `size` max-width applies from `md` up only (dialog mobile bottom sheet). */
      sizeAtMd?: boolean
    }>(),
    {
      size: 'medium',
      sizeAtMd: false
    }
  )

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-panel')

  provide(PanelInjectionKey, {
    testId: testId.value
  })

  const rootClasses = computed(() =>
    cn(
      'flex w-full flex-col overflow-hidden',
      'rounded-[var(--shape-card)] border border-[length:var(--border-width-default)]',
      'border-[var(--border-muted)]',
      'bg-[var(--bg-surface)] shadow-[var(--shadow-2xl)]',
      props.sizeAtMd ? dialogPanelSizeClasses[props.size] : panelSizeClasses[props.size],
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
