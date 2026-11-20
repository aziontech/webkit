<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { usePlacement } from '../../../composables/use-placement'
  import { triggerControl } from '../../../utils/trigger-control'
  import type { HoverCardAlign, HoverCardSide } from './injection-key'
  import { HOVER_CARD_FOCUSABLE, HoverCardInjectionKey } from './injection-key'

  export type { HoverCardAlign, HoverCardSide } from './injection-key'

  defineOptions({
    name: 'HoverCard',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface HoverCardProps {
    /** Side of the trigger the card opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. */
    side?: HoverCardSide | 'auto'
    /** Alignment along the trigger edge. */
    align?: HoverCardAlign
    /** Pixel gap between the trigger and the card. */
    sideOffset?: number
    /** Milliseconds the pointer or focus must stay on the trigger before the card opens. */
    openDelay?: number
    /** Milliseconds after the pointer or focus leaves the trigger and the card before the card closes. */
    closeDelay?: number
    /** Never opens the card. */
    disabled?: boolean
    /** Initial open state while v-model:open is unbound. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<HoverCardProps>(), {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    openDelay: 500,
    closeDelay: 300,
    disabled: false,
    defaultOpen: false
  })

  /** Controlled open state. Use with v-model:open; while unbound the card starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()

  const triggerEl = ref<globalThis.HTMLElement | null>(null)
  const panelEl = ref<globalThis.HTMLElement | null>(null)
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let returningFocus = false

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'hover-card')

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpenState.value && !props.disabled)

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: triggerEl,
    panelRef: panelEl,
    isOpen: isOpenRef,
    side: () => props.side,
    align: () => props.align,
    sideOffset: () => props.sideOffset,
    onDismiss: () => setOpen(false)
  })

  function clearTimers() {
    if (openTimer !== undefined) clearTimeout(openTimer)
    if (closeTimer !== undefined) clearTimeout(closeTimer)
    openTimer = undefined
    closeTimer = undefined
  }

  function setOpen(value: boolean) {
    clearTimers()
    if (value && props.disabled) return
    if (isOpenState.value !== value) isOpenState.set(value)
  }

  function scheduleOpen() {
    if (props.disabled || returningFocus) return
    if (closeTimer !== undefined) clearTimeout(closeTimer)
    closeTimer = undefined
    if (isOpenState.value || openTimer !== undefined) return
    openTimer = setTimeout(() => setOpen(true), props.openDelay)
  }

  function scheduleClose() {
    if (openTimer !== undefined) clearTimeout(openTimer)
    openTimer = undefined
    if (!isOpenState.value || closeTimer !== undefined) return
    closeTimer = setTimeout(() => setOpen(false), props.closeDelay)
  }

  function cancelClose() {
    if (closeTimer !== undefined) clearTimeout(closeTimer)
    closeTimer = undefined
  }

  function focusTrigger() {
    const host = triggerEl.value
    if (host) triggerControl(host).focus()
  }

  function focusContent(): boolean {
    const first = panelEl.value?.querySelector<globalThis.HTMLElement>(HOVER_CARD_FOCUSABLE)
    first?.focus()
    return Boolean(first)
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (event.key !== 'Escape' || !isOpenState.value) return
    const inside = Boolean(panelEl.value?.contains(globalThis.document.activeElement))
    setOpen(false)
    if (!inside) return
    returningFocus = true
    focusTrigger()
    returningFocus = false
  }

  onMounted(() => {
    globalThis.document?.addEventListener('keydown', onDocumentKeydown)
  })

  onBeforeUnmount(() => {
    clearTimers()
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })

  provide(HoverCardInjectionKey, {
    testId: testId.value,
    contentId: `${uid}-hover-card`,
    isOpen: isOpenRef,
    side: resolvedSide,
    align: resolvedAlign,
    panelStyle,
    triggerEl,
    panelEl,
    scheduleOpen,
    scheduleClose,
    cancelClose,
    focusContent,
    focusTrigger
  })
</script>

<template>
  <span
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpenRef ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    class="inline-block"
  >
    <slot />
  </span>
</template>
