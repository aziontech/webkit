<script setup lang="ts">
  import { computed, provide, readonly, ref, useAttrs } from 'vue'

  import { ResizablePanelInjectionKey, type ResizablePanelPaneApi } from './injection-key'

  defineOptions({ name: 'ResizablePanel', inheritAttrs: false })

  /** Axis the panes are laid out on. */
  export type ResizablePanelOrientation = 'horizontal' | 'vertical'

  interface Props {
    /** Axis the panes are laid out on; horizontal places them side by side, vertical stacks them. */
    orientation?: ResizablePanelOrientation
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
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-resizable-panel'
  )

  // THE GROUP IS A REGISTRY, KEYED BY ELEMENT. A handle has to answer one question —
  // which pane do I move — and the honest source for it is the DOM: the pane before me,
  // or the pane after me. Keying the registry by the pane's own element is what lets the
  // handle walk `previousElementSibling` and get a real answer, with no ordered array to
  // keep in step with a v-if, a v-for, or the order the children happened to mount in.
  const panes = new Map<globalThis.HTMLElement, ResizablePanelPaneApi>()

  const orientation = computed(() => props.orientation)

  // The Map itself is deliberately NOT reactive — it is a lookup, read once per event —
  // so membership changes are published as a counter instead.
  const revision = ref(0)

  provide(ResizablePanelInjectionKey, {
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
