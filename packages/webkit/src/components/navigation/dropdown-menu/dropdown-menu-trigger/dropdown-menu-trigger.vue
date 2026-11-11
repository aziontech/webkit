<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs } from 'vue'

  import { TriggerHost } from '../../../../utils/trigger-host'
  import { useDropdownContext } from '../injection-key'

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
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__trigger`
  )

  const isOpen = computed(() => ctx.isOpen.value)
  const isDisabled = computed(() => ctx.disabled.value)

  const aria = computed(() => ({
    'aria-haspopup': 'menu',
    'aria-expanded': String(isOpen.value),
    'aria-controls': ctx.panelId,
    'aria-disabled': isDisabled.value ? 'true' : undefined
  }))

  function onClick() {
    if (!isDisabled.value) ctx.setOpen(!ctx.isOpen.value)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (isDisabled.value) return
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

  function onControl(el: globalThis.HTMLElement | null) {
    ctx.triggerRef.value = el
  }

  onBeforeUnmount(() => {
    ctx.triggerRef.value = null
  })
</script>

<template>
  <TriggerHost
    v-bind="attrs"
    :aria="aria"
    :control-id="ctx.triggerId"
    :disabled="isDisabled"
    as-button
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    class="inline-flex w-fit shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
    @control="onControl"
  >
    <slot :is-open="isOpen" />
  </TriggerHost>
</template>
