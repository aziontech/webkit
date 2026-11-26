<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import OverlayTrigger from '../../../overlay/parts/overlay-trigger.vue'
  import { useDropdownContext } from '../composables/use-dropdown-context'

  defineOptions({
    name: 'DropdownMenuTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useDropdownContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'dropdown-menu-trigger'
  )

  const isOpen = computed(() => ctx.isOpen.value)

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (ctx.disabled.value) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ctx.setOpen(!ctx.isOpen.value)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      ctx.setOpen(true)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      ctx.setOpen(true)
      globalThis.requestAnimationFrame(() => ctx.focusLastOption())
    } else if (event.key === 'Escape' && ctx.isOpen.value) {
      event.preventDefault()
      ctx.setOpen(false)
    }
  }
</script>

<template>
  <OverlayTrigger
    v-bind="attrs"
    :context="ctx"
    haspopup="menu"
    :controls="ctx.panelId"
    :data-testid="testId"
    @keydown="onKeydown"
  >
    <slot :is-open="isOpen" />
  </OverlayTrigger>
</template>
