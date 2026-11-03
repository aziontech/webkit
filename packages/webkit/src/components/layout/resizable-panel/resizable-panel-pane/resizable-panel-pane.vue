<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { ResizablePanelInjectionKey } from '../injection-key'

  defineOptions({ name: 'ResizablePanelPane', inheritAttrs: false })

  interface Props {
    /** Smallest length in pixels a drag may set. */
    min?: number
    /** Largest length in pixels a drag may set. */
    max?: number
    /** Whether dragging past the minimum collapses the pane instead of stopping at it. */
    collapsible?: boolean
    /** Accessible name for the region. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    min: 96,
    max: 720,
    collapsible: false,
    ariaLabel: ''
  })

  /** Pane length in px along the group axis; a pane that never receives one is flexible and absorbs the remainder. */
  const basis = defineModel<number | undefined>('basis', { default: undefined })
  /** Whether the pane renders at zero length. It stays mounted, so its content keeps its state. */
  const collapsed = defineModel<boolean | undefined>('collapsed', { default: undefined })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ResizablePanelInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__pane` : 'layout-resizable-panel__pane')
  )

  const flexible = computed(() => basis.value === undefined)
  const isCollapsed = computed(() => collapsed.value === true)
  const orientation = computed(() => ctx?.orientation.value ?? 'horizontal')

  const paneRef = ref<globalThis.HTMLElement | null>(null)

  const clamp = (value: number) => Math.min(Math.max(value, props.min), props.max)

  const setBasis = (next: number) => {
    if (props.collapsible && next < props.min / 2) {
      if (!isCollapsed.value) collapsed.value = true
      basis.value = props.min
      return
    }
    if (isCollapsed.value) collapsed.value = false
    basis.value = clamp(next)
  }

  const paneStyle = computed<Record<string, string>>(() => {
    const axis = orientation.value === 'horizontal' ? 'width' : 'height'
    if (isCollapsed.value) return { flex: '0 0 0', [axis]: '0' }
    if (flexible.value) return { flex: '1 1 0%' }
    return { flex: `0 0 ${basis.value}px`, [axis]: `${basis.value}px` }
  })

  const measure = () => {
    const el = paneRef.value
    if (!el) return basis.value ?? props.min
    return orientation.value === 'horizontal' ? el.offsetWidth : el.offsetHeight
  }

  watch(
    () => [props.min, props.max] as const,
    () => {
      if (basis.value !== undefined) basis.value = clamp(basis.value)
    }
  )

  onMounted(() => {
    if (!paneRef.value || !ctx) return
    if (basis.value !== undefined) basis.value = clamp(basis.value)
    ctx.register(paneRef.value, {
      basis: () => basis.value ?? measure(),
      flexible: () => flexible.value,
      min: () => props.min,
      max: () => props.max,
      collapsible: () => props.collapsible,
      collapsed: () => isCollapsed.value,
      setBasis,
      measure
    })
  })

  onBeforeUnmount(() => {
    if (paneRef.value && ctx) ctx.unregister(paneRef.value)
  })
</script>

<template>
  <div
    ref="paneRef"
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-collapsed="isCollapsed || null"
    :data-flexible="(flexible && !isCollapsed) || null"
    :style="paneStyle"
    class="flex min-h-0 min-w-0 flex-col overflow-hidden"
  >
    <slot />
  </div>
</template>
