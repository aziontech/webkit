<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs } from 'vue'

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

  function toggle() {
    if (isDisabled.value) return
    ctx.setOpen(!ctx.isOpen.value)
  }

  function onClick() {
    toggle()
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    // Keyboard activation is owned by the focusable child (e.g. Button): its native
    // Enter/Space already synthesises a click that bubbles here. Only act on keys that
    // land DIRECTLY on this wrapper (e.g. a consumer that made it focusable via attrs),
    // so a child's key press never double-fires the toggle.
    if (event.target !== event.currentTarget) return
    if (isDisabled.value) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  function registerTrigger(el: globalThis.HTMLElement | null) {
    ctx.triggerRef.value = el
  }

  onBeforeUnmount(() => {
    if (ctx.triggerRef.value) ctx.triggerRef.value = null
  })
</script>

<template>
  <!--
    Passthrough wrapper: the consumer's focusable child (e.g. Button) owns focus and
    keyboard activation — its native Enter/Space fires a click that bubbles here to
    toggle. A keydown listener on this span would double-fire, so the a11y rule that
    pairs @click with a key handler is intentionally disabled.
  -->
  <span
    :ref="(el) => registerTrigger(el as globalThis.HTMLElement | null)"
    :id="ctx.triggerId"
    v-bind="attrs"
    :aria-haspopup="'dialog'"
    :aria-expanded="isOpen"
    :aria-controls="ctx.contentId"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    class="inline-flex w-fit shrink-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot :is-open="isOpen" />
  </span>
</template>
