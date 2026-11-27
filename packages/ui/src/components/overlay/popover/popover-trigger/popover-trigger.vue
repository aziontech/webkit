<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import OverlayTrigger from '../../parts/overlay-trigger.vue'
  import { usePopoverContext } from '../composables/use-popover-context'

  defineOptions({
    name: 'PopoverTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'popover-trigger')

  const isOpen = computed(() => ctx.isOpen.value)

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.target !== event.currentTarget) return
    if (ctx.disabled.value) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ctx.setOpen(!ctx.isOpen.value)
    }
  }
</script>

<template>
  <OverlayTrigger
    v-bind="attrs"
    :context="ctx"
    haspopup="dialog"
    :controls="ctx.contentId"
    :data-testid="testId"
    class="cursor-pointer rounded-(--shape-control)"
    @keydown="onKeydown"
  >
    <slot :is-open="isOpen" />
  </OverlayTrigger>
</template>
