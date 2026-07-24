<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { usePlacement } from '../../../composables/use-placement'
  import type { PopoverPlacement, PopoverPlacementInput } from './injection-key'
  import { PopoverInjectionKey } from './injection-key'

  defineOptions({
    name: 'Popover',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Controlled open state. Use with v-model:open or update:open. When omitted, the component is uncontrolled. */
      open?: boolean
      /** Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time. */
      placement?: PopoverPlacementInput
      /** Pixel gap between the trigger and the panel. */
      offset?: number
      /** Prevents the trigger from opening the panel and applies disabled tokens. */
      disabled?: boolean
      /** Panel width preset mapped to container tokens: `'small'` (`--container-xs`), `'medium'` (`--container-sm`), `'large'` (`--container-md`). When omitted, the panel sizes fluidly between `--container-3xs` and `--container-xs`. */
      width?: 'small' | 'medium' | 'large'
      /** Light-dismiss: when true, the panel closes on outside-click and `Esc`. Set false to keep it open until the trigger or `PopoverClose` closes it. */
      dismissible?: boolean
    }>(),
    {
      open: undefined,
      placement: 'bottom-start',
      offset: 4,
      disabled: false,
      width: undefined,
      dismissible: true
    }
  )

  defineEmits<{
    'update:open': [value: boolean]
  }>()

  const openModel = defineModel<boolean | undefined>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-popover')

  const triggerId = `${uid}-trigger`
  const contentId = `${uid}-content`
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: false,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpenState.value)
  const disabledRef = computed(() => props.disabled)
  const placementRef = computed(() => props.placement)
  const offsetRef = computed(() => props.offset)
  const widthRef = computed(() => props.width)

  const hasTitle = ref(false)
  const hasDescription = ref(false)

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: isOpenRef,
    placement: placementRef,
    offset: offsetRef,
    autoPlacements: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    // Floating-overlay tier (matches Select/Dropdown menus). Kept at this level — not a
    // modal tier — so overlays opened from inside the panel (e.g. a Select, teleported
    // to <body> later) stack above it instead of being occluded by it.
    zIndex: 50
  })

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as PopoverPlacement)

  function setOpen(value: boolean) {
    if (value && props.disabled) return
    isOpenState.set(value)
  }

  function focusTrigger() {
    triggerRef.value?.focus({ preventScroll: true })
  }

  /** Returns the focusable, enabled elements inside the panel, in DOM order. */
  function getFocusable(): globalThis.HTMLElement[] {
    const panel = panelRef.value
    if (!panel) return []
    const selector =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    return Array.from(panel.querySelectorAll<globalThis.HTMLElement>(selector))
  }

  function onDocumentMousedown(event: globalThis.MouseEvent) {
    if (!isOpenState.value) return
    if (!props.dismissible) return
    const target = event.target as globalThis.Node | null
    if (!target) return
    if (triggerRef.value?.contains(target)) return
    if (panelRef.value?.contains(target)) return
    setOpen(false)
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (!isOpenState.value) return

    // Esc dismisses and returns focus to the trigger. Handled at the document level
    // (not on the panel) so it also works while focus rests on the trigger — the panel
    // is not auto-focused on open.
    if (event.key === 'Escape') {
      if (!props.dismissible) return
      event.preventDefault()
      setOpen(false)
      focusTrigger()
      return
    }

    // Contain Tab / Shift+Tab within [trigger, ...panel] so focus never escapes the
    // popover — only Esc or an outside click dismiss it. The panel is teleported to
    // <body>, so the trigger ↔ panel transition is wired here rather than via DOM order.
    if (event.key === 'Tab') {
      const trigger = triggerRef.value
      const panel = panelRef.value
      if (!trigger || !panel) return

      const focusables = getFocusable()
      const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      // Focus on the trigger (or escaped the panel): pull it into the panel.
      if (active === trigger || !panel.contains(active)) {
        event.preventDefault()
        const target = event.shiftKey ? (last ?? trigger) : (first ?? trigger)
        target.focus({ preventScroll: true })
        return
      }

      // Focus inside the panel: wrap the ends back to the trigger.
      if (focusables.length === 0) {
        event.preventDefault()
        trigger.focus({ preventScroll: true })
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        trigger.focus({ preventScroll: true })
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        trigger.focus({ preventScroll: true })
      }
    }
  }

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    globalThis.document?.addEventListener('keydown', onDocumentKeydown)
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })

  provide(PopoverInjectionKey, {
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
    width: widthRef,
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
