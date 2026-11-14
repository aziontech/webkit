<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { usePlacement } from '../../../composables/use-placement'
  import type { HoverCardPlacement, HoverCardPlacementInput } from './injection-key'
  import { HoverCardInjectionKey } from './injection-key'

  export type { HoverCardPlacement, HoverCardPlacementInput } from './injection-key'

  defineOptions({
    name: 'HoverCard',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  interface Props {
    /** Side of the trigger the card opens on, flipped when it does not fit; `'auto'` picks the side with room. */
    placement?: HoverCardPlacementInput
    /** Pixel gap between the trigger and the card. */
    offset?: number
    /** Milliseconds the pointer or focus must stay on the trigger before the card opens. */
    openDelay?: number
    /** Milliseconds after the pointer or focus leaves the trigger and the card before the card closes. */
    closeDelay?: number
    /** Never opens the card. */
    disabled?: boolean
    /** Initial open state while v-model:open is unbound. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placement: 'bottom',
    offset: 8,
    openDelay: 500,
    closeDelay: 300,
    disabled: false,
    defaultOpen: false
  })

  /** Controlled open state. Use with v-model:open; while unbound the card starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'overlay-hover-card'
  )

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpenState.value && !props.disabled)

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: isOpenRef,
    placement: () => props.placement,
    offset: () => props.offset,
    onDismiss: () => setOpen(false)
  })

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as HoverCardPlacement)

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
    if (props.disabled) return
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

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (event.key !== 'Escape' || !isOpenState.value) return
    setOpen(false)
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
    placement: resolvedPlacementRef,
    panelStyle,
    triggerRef,
    panelRef,
    scheduleOpen,
    scheduleClose,
    cancelClose
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
