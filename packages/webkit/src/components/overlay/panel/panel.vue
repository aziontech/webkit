<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
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

  const isFluid = computed(() => attrs['data-fluid'] !== undefined && attrs['data-fluid'] !== false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-panel')

  provide(PanelInjectionKey, {
    testId: testId.value
  })

  const rootClasses = computed(() =>
    cn(
      // `max-h-full` is what makes `overflow-hidden` mean something. The shell
      // clips its own overflow, but with no height bound it simply grows to fit
      // its content, so nothing is ever clipped and `panel-content`'s
      // `overflow-y-auto` never fires. Measured inside a 400px-tall container the
      // shell rendered 771px with the body not scrolling; with the cap it is
      // 400px and the body scrolls. Dialog and Drawer already bound it from the
      // outside, so this only changes the case where nothing else does.
      'flex w-full max-h-full flex-col overflow-hidden',
      'rounded-(--shape-card) border border-(length:--border-width-default)',
      'border-(--border-muted)',
      'bg-(--bg-surface) shadow-(--shadow-2xl)',
      isFluid.value
        ? 'w-full max-w-none'
        : props.sizeAtMd
          ? dialogPanelSizeClasses[props.size]
          : panelSizeClasses[props.size],
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
