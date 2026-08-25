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

  /**
   * The pane length in pixels along the group axis. A pane that never receives one is
   * FLEXIBLE: it absorbs whatever the sized panes leave, which is what keeps the group
   * filling its container without anyone doing arithmetic.
   */
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

  /**
   * The one place a drag, a keyboard nudge and a programmatic set all land — so the
   * clamp, the collapse threshold and the restore can only be decided once.
   *
   * COLLAPSE IS A SEPARATE FACT FROM LENGTH, and the pane keeps both. A collapsible pane
   * dragged below half its minimum collapses, and its `basis` is left at the minimum
   * rather than at zero: that is the length it comes BACK at, and a pane that reopened to
   * nothing would look like a control that did not work.
   */
  const setBasis = (next: number) => {
    if (props.collapsible && next < props.min / 2) {
      if (!isCollapsed.value) collapsed.value = true
      basis.value = props.min
      return
    }
    if (isCollapsed.value) collapsed.value = false
    basis.value = clamp(next)
  }

  /**
   * THE PANE'S SIZE IS AN INLINE STYLE, `flex` INCLUDED — and the `flex` half is the
   * load-bearing part. Expressed as classes it would be `flex-none` on the base and
   * `flex-1` under a `data-[flexible]` variant, which is the shape this file started
   * with and which silently did not work: the two utilities set the same shorthand, and
   * the flexible pane resolved to `flex: none`. Sized by its content instead of by the
   * space left over, it stopped shrinking when its neighbour grew — so a drag widened
   * the whole GROUP past its container (measured: 1140 → 1282) and pushed the far edge
   * off screen, while the pane the reader was dragging appeared to work perfectly.
   *
   * One inline declaration, three mutually exclusive cases, no cascade to lose.
   */
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

  // A pane that arrives already out of range would hand its handle an aria-valuenow the
  // handle can never reach. Pull it in on mount, and again if the bounds move.
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
  <!-- A COLLAPSED PANE IS ZERO-SIZED, NOT UNMOUNTED AND NOT `display: none`. Zero size is
       what lets the content survive the collapse with its state intact (an editor's undo
       history, a scroll position) AND come back correctly: an element hidden with
       `display: none` reports no geometry, so anything inside it that measures itself —
       an editor, a chart, a virtualized list — comes back mis-laid-out.
       `overflow-hidden` + `min-w-0` / `min-h-0` is the other half: without them a flex
       item refuses to shrink below its content, and a "collapsed" pane sits there at its
       content width. -->
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
