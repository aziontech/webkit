<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { ResizableInjectionKey } from '../injection-key'

  defineOptions({ name: 'ResizablePane', inheritAttrs: false })

  export interface ResizablePaneProps {
    /** Smallest length in pixels a drag may set. */
    min?: number
    /** Largest length in pixels a drag may set. */
    max?: number
    /** Whether dragging past the minimum collapses the pane instead of stopping at it. */
    collapsible?: boolean
    /** Accessible name for the region. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ResizablePaneProps>(), {
    min: 96,
    max: 720,
    collapsible: false,
    ariaLabel: ''
  })

  /** Pane length in px along the group axis; a pane that never receives one is flexible and absorbs the remainder. */
  const basis = defineModel<number | undefined>('basis', { default: undefined })
  /** Whether the pane is shown at its length; false renders it at zero length. It stays mounted, so its content keeps its state. */
  const open = defineModel<boolean>('open', { default: true })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ResizableInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'resizable-pane'
  )

  const flexible = computed(() => basis.value === undefined)
  const isCollapsed = computed(() => !open.value)
  const setCollapsed = (value: boolean) => {
    open.value = !value
  }
  const orientation = computed(() => ctx?.orientation.value ?? 'horizontal')

  const paneEl = ref<globalThis.HTMLElement | null>(null)

  const clamp = (value: number) => Math.min(Math.max(value, props.min), props.max)

  const setBasis = (next: number) => {
    if (props.collapsible && next < props.min / 2) {
      if (!isCollapsed.value) setCollapsed(true)
      basis.value = props.min
      return
    }
    if (isCollapsed.value) setCollapsed(false)
    basis.value = clamp(next)
  }

  const paneStyle = computed<Record<string, string>>(() => {
    const axis = orientation.value === 'horizontal' ? 'width' : 'height'
    if (isCollapsed.value) return { flex: '0 0 0', [axis]: '0' }
    if (flexible.value) {
      const minAxis = axis === 'width' ? 'minWidth' : 'minHeight'
      return { flex: '1 1 0%', [minAxis]: `min(${props.min}px, 50%)` }
    }
    return { flex: `0 1 ${basis.value}px`, [axis]: `${basis.value}px` }
  })

  const measure = () => {
    const el = paneEl.value
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
    if (!paneEl.value || !ctx) return
    if (basis.value !== undefined) basis.value = clamp(basis.value)
    ctx.register(paneEl.value, {
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
    if (paneEl.value && ctx) ctx.unregister(paneEl.value)
  })
</script>

<template>
  <div
    ref="paneEl"
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-state="isCollapsed ? 'closed' : 'open'"
    :data-flexible="(flexible && !isCollapsed) || null"
    :style="paneStyle"
    class="flex min-h-0 min-w-0 flex-col overflow-hidden"
  >
    <slot />
  </div>
</template>
