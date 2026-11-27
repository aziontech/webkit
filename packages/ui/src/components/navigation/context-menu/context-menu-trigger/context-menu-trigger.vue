<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs } from 'vue'

  import { resolveDirection } from '../../../../composables/use-direction'
  import { useElementListener } from '../../../../composables/use-element-listener'
  import { useContextMenuContext } from '../composables/use-context-menu-context'

  defineOptions({
    name: 'ContextMenuTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const LONG_PRESS_MS = 500
  const LONG_PRESS_SLOP = 10
  const REPEAT_GUARD_MS = 400

  const attrs = useAttrs()
  const ctx = useContextMenuContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'context-menu-trigger'
  )

  const areaEl = ref<globalThis.HTMLElement | null>(null)

  const isOpen = computed(() => ctx.isOpen.value)

  let pressTimer: ReturnType<typeof setTimeout> | undefined
  let pressStart: { x: number; y: number } | null = null
  let openedAt = 0

  function setAreaEl(el: unknown) {
    areaEl.value = el instanceof HTMLElement ? el : null
    ctx.areaEl.value = areaEl.value
  }

  function open(x: number, y: number, source: globalThis.Element | null) {
    openedAt = Date.now()
    ctx.openAt(x, y, source)
  }

  function recentlyOpened() {
    return Date.now() - openedAt < REPEAT_GUARD_MS
  }

  function onContextmenu(event: globalThis.MouseEvent) {
    if (ctx.disabled.value) return
    event.preventDefault()
    if (recentlyOpened()) return
    open(event.clientX, event.clientY, event.target as globalThis.Element | null)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (ctx.disabled.value) return
    const opens = event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)
    if (!opens) return
    event.preventDefault()
    const source = event.target as globalThis.Element
    const rect = source.getBoundingClientRect()
    const x = resolveDirection(source) === 'rtl' ? rect.right : rect.left
    open(x, rect.bottom, source)
  }

  function cancelPress() {
    if (pressTimer !== undefined) clearTimeout(pressTimer)
    pressTimer = undefined
    pressStart = null
  }

  function onPointerdown(event: globalThis.PointerEvent) {
    if (event.pointerType !== 'touch' || ctx.disabled.value) return
    cancelPress()
    const source = event.target as globalThis.Element | null
    pressStart = { x: event.clientX, y: event.clientY }
    pressTimer = setTimeout(() => {
      const point = pressStart
      cancelPress()
      if (point) open(point.x, point.y, source)
    }, LONG_PRESS_MS)
  }

  function onPointermove(event: globalThis.PointerEvent) {
    if (!pressStart) return
    const moved = Math.hypot(event.clientX - pressStart.x, event.clientY - pressStart.y)
    if (moved > LONG_PRESS_SLOP) cancelPress()
  }

  useElementListener(areaEl, 'contextmenu', onContextmenu)
  useElementListener(areaEl, 'keydown', onKeydown)
  useElementListener(areaEl, 'pointerdown', onPointerdown)
  useElementListener(areaEl, 'pointermove', onPointermove)
  useElementListener(areaEl, 'pointerup', cancelPress)
  useElementListener(areaEl, 'pointercancel', cancelPress)

  onBeforeUnmount(() => {
    cancelPress()
    ctx.areaEl.value = null
  })
</script>

<template>
  <div
    v-bind="attrs"
    :ref="setAreaEl"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="ctx.disabled.value || null"
    class="block"
  >
    <slot :is-open="isOpen" />
  </div>
</template>
