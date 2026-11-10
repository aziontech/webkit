<script setup lang="ts">
  import { computed, provide, readonly, ref, useAttrs } from 'vue'

  import { ResizableInjectionKey, type ResizablePaneApi } from './injection-key'

  defineOptions({ name: 'Resizable', inheritAttrs: false })

  /** Axis the panes are laid out on. */
  export type ResizableOrientation = 'horizontal' | 'vertical'

  interface Props {
    /** Axis the panes are laid out on; horizontal places them side by side, vertical stacks them. */
    orientation?: ResizableOrientation
    /** Accessible name for the group as a whole. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    ariaLabel: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-resizable'
  )

  const panes = new Map<globalThis.HTMLElement, ResizablePaneApi>()

  const orientation = computed(() => props.orientation)

  const revision = ref(0)

  provide(ResizableInjectionKey, {
    testId: testId.value,
    orientation,
    revision: readonly(revision),
    register: (el, api) => {
      panes.set(el, api)
      revision.value += 1
    },
    unregister: (el) => {
      panes.delete(el)
      revision.value += 1
    },
    paneFor: (el) => (el instanceof globalThis.HTMLElement ? (panes.get(el) ?? null) : null)
  })
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    class="flex min-h-0 min-w-0 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col"
  >
    <slot />
  </div>
</template>
