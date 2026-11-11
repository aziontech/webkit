<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs } from 'vue'

  import { TriggerHost } from '../../../../utils/trigger-host'
  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__trigger`
  )

  const isOpen = computed(() => ctx.isOpen.value)
  const isDisabled = computed(() => ctx.disabled.value)

  const aria = computed(() => ({
    'aria-haspopup': 'dialog',
    'aria-expanded': String(isOpen.value),
    'aria-controls': ctx.contentId,
    'aria-disabled': isDisabled.value ? 'true' : undefined
  }))

  function toggle() {
    if (isDisabled.value) return
    ctx.setOpen(!ctx.isOpen.value)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.target !== event.currentTarget) return
    if (isDisabled.value) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
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
    class="inline-flex w-fit shrink-0 rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="toggle"
    @keydown="onKeydown"
    @control="onControl"
  >
    <slot :is-open="isOpen" />
  </TriggerHost>
</template>
