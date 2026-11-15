<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, provide, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { usePlacement } from '../../../composables/use-placement'
  import type { PopoverPlacement, PopoverPlacementInput, PopoverSize } from './injection-key'
  import { PopoverInjectionKey } from './injection-key'

  defineOptions({
    name: 'Popover',
    inheritAttrs: false
  })

  const FOCUSABLE_SELECTOR =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

  defineSlots<{
    default(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Where the panel opens relative to the trigger: a side, optionally aligned to its start or end, or `'auto'` for the best-fitting vertical corner at open time. */
      placement?: PopoverPlacementInput
      /** Pixel gap between the trigger and the panel. */
      offset?: number
      /** Prevents the trigger from opening the panel and applies disabled tokens. */
      disabled?: boolean
      /** Panel width preset mapped to container tokens: `'small'` (`--container-xs`), `'medium'` (`--container-sm`), `'large'` (`--container-md`). When omitted, the panel sizes fluidly between `--container-3xs` and `--container-xs`. */
      size?: PopoverSize
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** Light-dismiss: when true, the panel closes on outside-click and `Esc`. Set false to keep it open until the trigger or `PopoverClose` closes it. */
      dismissible?: boolean
    }>(),
    {
      placement: 'bottom-start',
      offset: 4,
      disabled: false,
      size: undefined,
      defaultOpen: false,
      dismissible: true
    }
  )

  /** Controlled open state. Use with v-model:open; while unbound the popover is uncontrolled and starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-popover')

  const triggerId = `${uid}-trigger`
  const contentId = `${uid}-content`
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpenState.value)
  const disabledRef = computed(() => props.disabled)
  const placementRef = computed(() => props.placement)
  const offsetRef = computed(() => props.offset)
  const sizeRef = computed(() => props.size)

  const hasTitle = ref(false)
  const hasDescription = ref(false)

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: isOpenRef,
    placement: placementRef,
    offset: offsetRef,
    autoPlacements: ['bottom-start', 'bottom-end', 'top-start', 'top-end']
  })

  const { isTop, isFocusTop, isInsideHigherLayer, lowerLayerElement } = useOverlayLayer(isOpenRef, {
    element: panelRef
  })

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as PopoverPlacement)

  function setOpen(value: boolean) {
    if (value && props.disabled) return
    isOpenState.set(value)
  }

  function focusTrigger() {
    const trigger = triggerRef.value
    if (!trigger) return
    const target = trigger.matches(FOCUSABLE_SELECTOR)
      ? trigger
      : (trigger.querySelector<globalThis.HTMLElement>(FOCUSABLE_SELECTOR) ?? trigger)
    target.focus({ preventScroll: true })
  }

  function getFocusable(): globalThis.HTMLElement[] {
    const panel = panelRef.value
    if (!panel) return []
    return Array.from(panel.querySelectorAll<globalThis.HTMLElement>(FOCUSABLE_SELECTOR))
  }

  function onDocumentMousedown(event: globalThis.MouseEvent) {
    if (!isOpenState.value) return
    if (!props.dismissible) return
    const target = event.target as globalThis.Node | null
    if (!target) return
    if (isInsideHigherLayer(target) || !isFocusTop.value) return
    if (triggerRef.value?.contains(target)) return
    if (panelRef.value?.contains(target)) return
    setOpen(false)
  }

  function tabbableAfterTrigger(): globalThis.HTMLElement | null {
    const trigger = triggerRef.value
    const scope = lowerLayerElement() ?? globalThis.document?.body
    if (!trigger || !scope) return null
    const panel = panelRef.value
    const all = Array.from(
      scope.querySelectorAll<globalThis.HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter(
      (el) => !panel?.contains(el) && !trigger.contains(el) && el.getClientRects().length > 0
    )
    const after = all.find((el) =>
      Boolean(trigger.compareDocumentPosition(el) & globalThis.Node.DOCUMENT_POSITION_FOLLOWING)
    )
    return after ?? (scope === globalThis.document?.body ? null : (all[0] ?? null))
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (!isOpenState.value || event.defaultPrevented) return

    if (event.key === 'Escape') {
      if (!isTop.value || !props.dismissible) return
      event.preventDefault()
      setOpen(false)
      focusTrigger()
      return
    }

    if (event.key === 'Tab') {
      if (!isFocusTop.value) return
      const trigger = triggerRef.value
      const panel = panelRef.value
      if (!trigger || !panel) return

      const focusables = getFocusable()
      const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const inPanel = Boolean(active && panel.contains(active))
      const onTrigger = Boolean(active && trigger.contains(active))

      if (onTrigger && !event.shiftKey && first) {
        event.preventDefault()
        first.focus({ preventScroll: true })
        return
      }

      if (!inPanel) return

      if (event.shiftKey && (active === first || focusables.length === 0)) {
        event.preventDefault()
        focusTrigger()
        return
      }

      if (!event.shiftKey && (active === last || focusables.length === 0)) {
        event.preventDefault()
        const next = tabbableAfterTrigger()
        setOpen(false)
        if (next) next.focus({ preventScroll: true })
        else focusTrigger()
      }
    }
  }

  watch(
    isOpenRef,
    (open) => {
      if (open) {
        globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
        globalThis.document?.addEventListener('keydown', onDocumentKeydown, true)
      } else {
        globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
        globalThis.document?.removeEventListener('keydown', onDocumentKeydown, true)
      }
    },
    { immediate: true }
  )

  watch(isOpenRef, async (open, wasOpen) => {
    if (!open || wasOpen) return
    await nextTick()
    const panel = panelRef.value
    if (!panel || panel.contains(globalThis.document?.activeElement ?? null)) return
    getFocusable()[0]?.focus({ preventScroll: true })
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown, true)
  })

  provide(PopoverInjectionKey, {
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
    size: sizeRef,
    panelStyle,
    triggerId,
    contentId,
    titleId,
    descriptionId,
    triggerRef,
    panelRef,
    setOpen,
    focusTrigger,
    registerTitle: () => {
      hasTitle.value = true
    },
    unregisterTitle: () => {
      hasTitle.value = false
    },
    registerDescription: () => {
      hasDescription.value = true
    },
    unregisterDescription: () => {
      hasDescription.value = false
    },
    hasTitle,
    hasDescription
  })
</script>

<template>
  <div
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpenRef ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-placement="placement"
    class="inline-block"
  >
    <slot />
  </div>
</template>
