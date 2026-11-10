<script setup lang="ts">
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    ref,
    shallowRef,
    useAttrs,
    watch
  } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(scope: { isOpen: boolean }): unknown
  }>()

  const CONTROL_SELECTOR = 'a[href],button,input,select,textarea,[tabindex]'

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const control = shallowRef<globalThis.HTMLElement | null>(null)
  const isMounted = ref(false)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__trigger`
  )

  const isOpen = computed(() => ctx.isOpen.value)
  const isDisabled = computed(() => ctx.disabled.value)
  const ownsControl = computed(() => isMounted.value && control.value === null)

  watch(
    [control, isOpen],
    ([element, open], _previous, onCleanup) => {
      if (!element) return
      element.setAttribute('aria-haspopup', 'dialog')
      element.setAttribute('aria-expanded', String(open))
      element.setAttribute('aria-controls', ctx.contentId)
      onCleanup(() => {
        element.removeAttribute('aria-haspopup')
        element.removeAttribute('aria-expanded')
        element.removeAttribute('aria-controls')
      })
    },
    { flush: 'post' }
  )

  function toggle() {
    if (isDisabled.value) return
    ctx.setOpen(!ctx.isOpen.value)
  }

  function onClick() {
    toggle()
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
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

  function resolveControl() {
    control.value =
      ctx.triggerRef.value?.querySelector<globalThis.HTMLElement>(CONTROL_SELECTOR) ?? null
  }

  onMounted(() => {
    resolveControl()
    isMounted.value = true
  })

  onUpdated(resolveControl)

  onBeforeUnmount(() => {
    if (ctx.triggerRef.value) ctx.triggerRef.value = null
  })
</script>

<template>
  <span
    :ref="(el) => registerTrigger(el as globalThis.HTMLElement | null)"
    :id="ctx.triggerId"
    v-bind="attrs"
    :role="ownsControl ? 'button' : undefined"
    :tabindex="ownsControl ? (isDisabled ? -1 : 0) : undefined"
    :aria-haspopup="ownsControl ? 'dialog' : undefined"
    :aria-expanded="ownsControl ? isOpen : undefined"
    :aria-controls="ownsControl ? ctx.contentId : undefined"
    :aria-disabled="ownsControl && isDisabled ? 'true' : undefined"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    class="inline-flex w-fit shrink-0 rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot :is-open="isOpen" />
  </span>
</template>
