<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs, watch } from 'vue'

  import { triggerControl } from '../../../../utils/trigger-control'
  import { useHoverCardContext } from '../injection-key'

  defineOptions({
    name: 'HoverCardTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useHoverCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__trigger`
  )

  const isOpen = computed(() => ctx.isOpen.value)

  function setHostRef(el: unknown) {
    ctx.triggerRef.value = el instanceof HTMLElement ? el : null
  }

  function onPointerenter(event: globalThis.PointerEvent) {
    if (event.pointerType === 'touch') return
    ctx.scheduleOpen()
  }

  function onPointerleave(event: globalThis.PointerEvent) {
    if (event.pointerType === 'touch') return
    ctx.scheduleClose()
  }

  function onFocusout(event: globalThis.FocusEvent) {
    const next = event.relatedTarget as globalThis.Node | null
    if (next && ctx.triggerRef.value?.contains(next)) return
    ctx.scheduleClose()
  }

  watch(
    () => (isOpen.value ? ctx.contentId : ''),
    (id) => {
      const host = ctx.triggerRef.value
      if (!host) return
      const el = triggerControl(host)
      const ids = (el.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter((token) => token && token !== ctx.contentId)
      if (id) ids.push(id)
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '))
      else el.removeAttribute('aria-describedby')
    },
    { flush: 'post' }
  )

  onBeforeUnmount(() => {
    ctx.triggerRef.value = null
  })
</script>

<template>
  <span
    v-bind="attrs"
    :ref="setHostRef"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="inline-flex w-fit"
    @pointerenter="onPointerenter"
    @pointerleave="onPointerleave"
    @focusin="ctx.scheduleOpen()"
    @focusout="onFocusout"
  >
    <slot :is-open="isOpen" />
  </span>
</template>
