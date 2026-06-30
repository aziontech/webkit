<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useAttrs } from 'vue'

  import { useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownTrigger',
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

  function toggle() {
    if (isDisabled.value) return
    ctx.setOpen(!ctx.isOpen.value)
  }

  function onClick() {
    toggle()
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (isDisabled.value) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!ctx.isOpen.value) {
        ctx.setOpen(true)
      } else {
        ctx.setOpen(false)
      }
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

  function registerTrigger(el: globalThis.HTMLElement | null) {
    ctx.triggerRef.value = el
  }

  onMounted(() => {
    // Triggered when the wrapper mounts; the consumer's element is its only child.
  })

  onBeforeUnmount(() => {
    if (ctx.triggerRef.value) ctx.triggerRef.value = null
  })
</script>

<template>
  <span
    :ref="(el) => registerTrigger(el as globalThis.HTMLElement | null)"
    :id="ctx.triggerId"
    v-bind="attrs"
    role="button"
    tabindex="0"
    :aria-haspopup="'menu'"
    :aria-expanded="isOpen"
    :aria-controls="ctx.panelId"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    class="inline-flex w-fit shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot :is-open="isOpen" />
  </span>
</template>
