<script setup lang="ts">
  import { computed, inject, onScopeDispose, ref, useAttrs } from 'vue'

  import { ResizablePanelInjectionKey, type ResizablePanelPaneApi } from '../injection-key'

  defineOptions({ name: 'ResizablePanelHandle', inheritAttrs: false })

  interface Props {
    /** Accessible name of the separator; name the edge it moves. */
    ariaLabel?: string
    /** Disables the drag and the keyboard nudge, and removes the separator from the tab order. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: 'Resize panel',
    disabled: false
  })

  const attrs = useAttrs()
  const ctx = inject(ResizablePanelInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__handle` : 'layout-resizable-panel__handle')
  )

  const orientation = computed(() => ctx?.orientation.value ?? 'horizontal')

  const ariaOrientation = computed(() =>
    orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
  )

  const NUDGE_STEP = 24

  const handleRef = ref<globalThis.HTMLElement | null>(null)
  const resizing = ref(false)

  const target = (): { pane: ResizablePanelPaneApi; sign: 1 | -1 } | null => {
    const el = handleRef.value
    if (!el || !ctx) return null
    const before = ctx.paneFor(el.previousElementSibling)
    if (before && !before.flexible()) return { pane: before, sign: 1 }
    const after = ctx.paneFor(el.nextElementSibling)
    if (after && !after.flexible()) return { pane: after, sign: -1 }
    return null
  }

  const current = computed(() => {
    const el = handleRef.value
    if (!el || !ctx) return null
    void ctx.revision.value
    const before = ctx.paneFor(el.previousElementSibling)
    if (before && !before.flexible()) return before
    const after = ctx.paneFor(el.nextElementSibling)
    if (after && !after.flexible()) return after
    return null
  })

  const valueNow = computed(() => current.value?.basis() ?? 0)
  const valueMin = computed(() => current.value?.min() ?? 0)
  const valueMax = computed(() => current.value?.max() ?? 0)

  let stopDrag: (() => void) | null = null

  const startResize = (event: globalThis.PointerEvent) => {
    if (props.disabled) return
    const hit = target()
    if (!hit) return

    const horizontal = orientation.value === 'horizontal'
    const origin = horizontal ? event.clientX : event.clientY
    const start = hit.pane.measure()

    resizing.value = true
    handleRef.value?.setPointerCapture?.(event.pointerId)
    globalThis.document.body.style.userSelect = 'none'
    globalThis.document.body.style.cursor = horizontal ? 'col-resize' : 'row-resize'

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const delta = (horizontal ? moveEvent.clientX : moveEvent.clientY) - origin
      hit.pane.setBasis(start + delta * hit.sign)
    }

    stopDrag = () => {
      resizing.value = false
      globalThis.document.body.style.removeProperty('user-select')
      globalThis.document.body.style.removeProperty('cursor')
      globalThis.window.removeEventListener('pointermove', onMove)
      globalThis.window.removeEventListener('pointerup', stopDrag as () => void)
      globalThis.window.removeEventListener('pointercancel', stopDrag as () => void)
      stopDrag = null
    }

    globalThis.window.addEventListener('pointermove', onMove)
    globalThis.window.addEventListener('pointerup', stopDrag)
    globalThis.window.addEventListener('pointercancel', stopDrag)
    event.preventDefault()
  }

  const nudge = (direction: -1 | 1) => {
    if (props.disabled) return
    const hit = target()
    if (!hit) return
    hit.pane.setBasis(hit.pane.basis() + NUDGE_STEP * direction * hit.sign)
  }

  const toExtreme = (edge: 'min' | 'max') => {
    if (props.disabled) return
    const hit = target()
    if (!hit) return
    hit.pane.setBasis(edge === 'min' ? hit.pane.min() : hit.pane.max())
  }

  const toggleCollapse = () => {
    if (props.disabled) return
    const hit = target()
    if (!hit || !hit.pane.collapsible()) return
    hit.pane.setBasis(hit.pane.collapsed() ? hit.pane.min() : 0)
  }

  onScopeDispose(() => stopDrag?.())
</script>

<template>
  <div
    ref="handleRef"
    v-bind="$attrs"
    role="separator"
    tabindex="0"
    :aria-label="ariaLabel"
    :aria-orientation="ariaOrientation"
    :aria-valuenow="valueNow"
    :aria-valuemin="valueMin"
    :aria-valuemax="valueMax"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-resizing="resizing || null"
    :data-disabled="disabled || null"
    class="relative z-10 shrink-0 bg-(--border-default) outline-none transition-colors duration-fast-02 ease-productive-entrance before:absolute before:content-[''] hover:bg-(--border-strong) focus-visible:bg-(--accent) data-[orientation=horizontal]:w-(--spacing-xxs) data-[orientation=horizontal]:cursor-col-resize data-[orientation=horizontal]:before:inset-y-0 data-[orientation=horizontal]:before:-inset-x-2 data-[orientation=vertical]:h-(--spacing-xxs) data-[orientation=vertical]:cursor-row-resize data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:-inset-y-2 data-[resizing]:bg-(--accent) data-[disabled]:pointer-events-none data-[disabled]:cursor-default data-[disabled]:opacity-40 motion-reduce:transition-none"
    @pointerdown="startResize"
    @keydown.left.prevent="orientation === 'horizontal' && nudge(-1)"
    @keydown.right.prevent="orientation === 'horizontal' && nudge(1)"
    @keydown.up.prevent="orientation === 'vertical' && nudge(-1)"
    @keydown.down.prevent="orientation === 'vertical' && nudge(1)"
    @keydown.home.prevent="toExtreme('min')"
    @keydown.end.prevent="toExtreme('max')"
    @keydown.enter.prevent="toggleCollapse"
  />
</template>
