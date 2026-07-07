<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

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
      /** Light-dismiss: when true, the panel closes on outside-click, `Esc`, and focus leaving the panel. Set false to keep it open until the trigger or `PopoverClose` closes it. */
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
  const panelBodyRef = ref<globalThis.HTMLElement | null>(null)

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

  function onPanelKeydown(event: globalThis.KeyboardEvent) {
    if (event.key === 'Escape') {
      if (!props.dismissible) return
      event.preventDefault()
      setOpen(false)
      focusTrigger()
    }
  }

  // Non-modal: moving focus out of the trigger + panel closes the popover.
  function onPanelFocusout(event: globalThis.FocusEvent) {
    if (!props.dismissible) return
    const next = event.relatedTarget as globalThis.Node | null
    if (!next) return
    if (panelRef.value?.contains(next)) return
    if (triggerRef.value?.contains(next)) return
    setOpen(false)
  }

  watch(
    () => isOpenState.value,
    async (open) => {
      if (!open) return
      await nextTick()
      const focusable = getFocusable()
      if (focusable.length > 0) focusable[0].focus({ preventScroll: true })
      else panelRef.value?.focus({ preventScroll: true })
    }
  )

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  })

  provide(PopoverInjectionKey, {
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
    triggerId,
    contentId,
    titleId,
    descriptionId,
    triggerRef,
    panelRef,
    panelBodyRef,
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

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="isOpenRef"
          :id="contentId"
          ref="panelRef"
          role="dialog"
          tabindex="-1"
          aria-modal="false"
          :aria-labelledby="hasTitle ? titleId : undefined"
          :aria-describedby="hasDescription ? descriptionId : undefined"
          :data-testid="`${testId}__panel`"
          :data-state="isOpenRef ? 'open' : 'closed'"
          :data-placement="resolvedPlacementRef"
          :data-width="width || null"
          :style="panelStyle"
          class="flex min-w-[var(--container-3xs)] max-w-[var(--container-xs)] flex-col rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-sm)] outline-none [transform-origin:var(--popup-origin,top_left)] data-[width=small]:min-w-[var(--container-xs)] data-[width=small]:max-w-[var(--container-xs)] data-[width=medium]:min-w-[var(--container-sm)] data-[width=medium]:max-w-[var(--container-sm)] data-[width=large]:min-w-[var(--container-md)] data-[width=large]:max-w-[var(--container-md)]"
          @keydown="onPanelKeydown"
          @focusout="onPanelFocusout"
        >
          <div
            ref="panelBodyRef"
            :data-testid="`${testId}__body`"
            class="flex flex-col"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
