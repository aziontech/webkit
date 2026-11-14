<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
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

  const width = computed(() => {
    if (isFluid.value) return 'fluid'
    return props.sizeAtMd ? `${props.size}-md` : props.size
  })
</script>

<template>
  <div
    :data-width="width"
    :class="
      cn(
        'flex w-full max-h-full flex-col overflow-hidden rounded-(--shape-card) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) shadow-(--shadow-2xl) data-[width=fluid]:max-w-none data-[width=small]:max-w-(--container-sm) data-[width=medium]:max-w-(--container-xl) data-[width=large]:max-w-(--container-2xl) data-[width=small-md]:md:max-w-(--container-sm) data-[width=medium-md]:md:max-w-(--container-xl) data-[width=large-md]:md:max-w-(--container-2xl)',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
