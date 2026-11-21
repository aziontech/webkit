<script setup lang="ts">
  import { computed, inject, ref, useAttrs } from 'vue'

  import { useDirection } from '../../../../composables/use-direction'
  import { useElementListener } from '../../../../composables/use-element-listener'
  import { usePointerDrag } from '../../../../composables/use-pointer-drag'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { ResizableInjectionKey, type ResizablePaneApi } from '../injection-key'

  defineOptions({ name: 'ResizableHandle', inheritAttrs: false })

  export interface ResizableHandleProps {
    /** Accessible name of the separator; name the edge it moves. Empty uses the locale catalog (`Resize panel`). */
    ariaLabel?: string
    /** Disables the drag and the keyboard nudge, and removes the separator from the tab order. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<ResizableHandleProps>(), {
    ariaLabel: '',
    disabled: false
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ resizable: en.resizable })
  const ctx = inject(ResizableInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'resizable-handle'
  )

  const orientation = computed(() => ctx?.orientation.value ?? 'horizontal')

  const ariaOrientation = computed(() =>
    orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
  )

  const NUDGE_STEP = 24

  const handleEl = ref<globalThis.HTMLElement | null>(null)
  const { dragging: resizing, startDrag } = usePointerDrag()
  const dir = useDirection(handleEl)

  const target = (): { pane: ResizablePaneApi; sign: 1 | -1 } | null => {
    const el = handleEl.value
    if (!el || !ctx) return null
    const before = ctx.paneFor(el.previousElementSibling)
    if (before && !before.flexible()) return { pane: before, sign: 1 }
    const after = ctx.paneFor(el.nextElementSibling)
    if (after && !after.flexible()) return { pane: after, sign: -1 }
    return null
  }

  const current = computed(() => {
    const el = handleEl.value
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

  const startResize = (event: globalThis.PointerEvent) => {
    if (props.disabled) return
    const hit = target()
    if (!hit) return

    const horizontal = orientation.value === 'horizontal'
    const origin = horizontal ? event.clientX : event.clientY
    const start = hit.pane.measure()

    startDrag(event, {
      captureEl: handleEl.value,
      cursor: horizontal ? 'col-resize' : 'row-resize',
      onMove: (moveEvent) => {
        const physical = (horizontal ? moveEvent.clientX : moveEvent.clientY) - origin
        const delta = horizontal && dir.value === 'rtl' ? -physical : physical
        hit.pane.setBasis(start + delta * hit.sign)
      }
    })
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

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    const horizontal = orientation.value === 'horizontal'
    const rtl = dir.value === 'rtl'
    switch (event.key) {
      case 'ArrowLeft':
        if (horizontal) nudge(rtl ? 1 : -1)
        break
      case 'ArrowRight':
        if (horizontal) nudge(rtl ? -1 : 1)
        break
      case 'ArrowUp':
        if (!horizontal) nudge(-1)
        break
      case 'ArrowDown':
        if (!horizontal) nudge(1)
        break
      case 'Home':
        toExtreme('min')
        break
      case 'End':
        toExtreme('max')
        break
      case 'Enter':
        toggleCollapse()
        break
      default:
        return
    }
    event.preventDefault()
  }

  useElementListener(handleEl, 'keydown', onKeydown)

  const ROOT_CLASS =
    'relative z-10 shrink-0 touch-none bg-(--border-default) outline-none ' +
    'data-[orientation=horizontal]:pointer-coarse:before:-inset-x-4.5 data-[orientation=vertical]:pointer-coarse:before:-inset-y-4.5 ' +
    "transition-colors duration-fast-02 ease-productive-entrance before:absolute before:content-[''] hover:bg-(--border-strong) focus-visible:bg-(--accent) focus-visible:ring-2 " +
    'focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[orientation=horizontal]:w-(--spacing-2xs) data-[orientation=horizontal]:cursor-col-resize data-[orientation=horizontal]:before:inset-y-0 ' +
    'data-[orientation=horizontal]:before:-inset-x-2 data-[orientation=vertical]:h-(--spacing-2xs) data-[orientation=vertical]:cursor-row-resize ' +
    'data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:-inset-y-2 ' +
    'data-[resizing]:bg-(--accent) ' +
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-default data-[disabled]:opacity-40 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div
    ref="handleEl"
    v-bind="$attrs"
    role="separator"
    tabindex="0"
    :aria-label="ariaLabel || t('resizable.handle')"
    :aria-orientation="ariaOrientation"
    :aria-valuenow="valueNow"
    :aria-valuemin="valueMin"
    :aria-valuemax="valueMax"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-resizing="resizing || null"
    :data-disabled="disabled || null"
    :class="ROOT_CLASS"
    @pointerdown="startResize"
  />
</template>
