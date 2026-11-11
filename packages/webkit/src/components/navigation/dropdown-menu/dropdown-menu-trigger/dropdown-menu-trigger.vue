<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useAttrs, watch } from 'vue'

  import { useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownMenuTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const CONTROL_SELECTOR =
    'button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'

  const attrs = useAttrs()
  const ctx = useDropdownContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__trigger`
  )

  const isOpen = computed(() => ctx.isOpen.value)
  const isDisabled = computed(() => ctx.disabled.value)

  const hostRef = ref<globalThis.HTMLElement | null>(null)
  let control: globalThis.HTMLElement | null = null
  let ownsId = false

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

  function release(el: globalThis.HTMLElement) {
    for (const name of ['haspopup', 'expanded', 'controls', 'disabled'])
      el.removeAttribute(`aria-${name}`)
    if (ownsId) el.removeAttribute('id')
    if (el === hostRef.value) {
      el.removeAttribute('role')
      el.removeAttribute('tabindex')
    }
  }

  function sync() {
    const host = hostRef.value
    if (!host) return
    const next = host.querySelector<globalThis.HTMLElement>(CONTROL_SELECTOR) ?? host
    if (control && control !== next) release(control)
    if (control !== next) ownsId = !next.id || next.id === ctx.triggerId
    control = next
    if (ownsId) next.id = ctx.triggerId
    if (next === host) {
      next.setAttribute('role', 'button')
      next.setAttribute('tabindex', isDisabled.value ? '-1' : '0')
    }
    next.setAttribute('aria-haspopup', 'menu')
    next.setAttribute('aria-expanded', String(isOpen.value))
    next.setAttribute('aria-controls', ctx.panelId)
    if (isDisabled.value) next.setAttribute('aria-disabled', 'true')
    else next.removeAttribute('aria-disabled')
    ctx.triggerRef.value = next
  }

  onMounted(sync)
  onUpdated(sync)
  watch([isOpen, isDisabled], sync, { flush: 'post' })

  onBeforeUnmount(() => {
    if (control) release(control)
    control = null
    if (ctx.triggerRef.value) ctx.triggerRef.value = null
  })
</script>

<template>
  <span
    ref="hostRef"
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    class="inline-flex w-fit shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot :is-open="isOpen" />
  </span>
</template>
