<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { usePlacement } from '../../../composables/use-placement'

  export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'
  export type TooltipPlacementInput = TooltipPlacement | 'auto'

  defineOptions({
    name: 'Tooltip',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  interface Props {
    /** Plain text shown inside the tooltip. */
    text: string
    /** Anchor side relative to the trigger. `'auto'` picks the side with the most room at open time. */
    placement?: TooltipPlacementInput
    /** Hover-open delay in milliseconds. */
    delay?: number
    /** Disables tooltip activation. */
    disabled?: boolean
    /** Controlled open state. Use with `v-model:open`. */
    open?: boolean
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placement: 'top',
    delay: 200,
    disabled: false,
    open: undefined,
    defaultOpen: false
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    show: []
    hide: []
  }>()

  const openModel = defineModel<boolean | undefined>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-tooltip')

  const tooltipId = computed(() => `${uid}-tooltip`)

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpen.value)
  const placementRef = computed(() => props.placement)

  const { resolvedPlacement, panelStyle, updatePosition } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: isOpenRef,
    placement: placementRef,
    offset: 8,
    autoPlacements: ['top', 'bottom', 'right', 'left'],
    onDismiss: () => closeTooltip()
  })

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as TooltipPlacement)

  function clearHoverTimer() {
    if (hoverTimer.value) {
      clearTimeout(hoverTimer.value)
      hoverTimer.value = null
    }
  }

  function setOpen(next: boolean) {
    if (props.disabled) return
    if (!props.text && next) return
    isOpen.set(next)
  }

  function scheduleOpen() {
    if (props.disabled || !props.text) return
    clearHoverTimer()
    hoverTimer.value = setTimeout(() => setOpen(true), props.delay)
  }

  function closeTooltip() {
    clearHoverTimer()
    setOpen(false)
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (!isOpen.value) return
    if (event.key === 'Escape') {
      event.preventDefault()
      closeTooltip()
    }
  }

  function onFocusOut(event: globalThis.FocusEvent) {
    const trigger = triggerRef.value
    const next = event.relatedTarget as Node | null
    if (trigger?.contains(next)) return
    closeTooltip()
  }

  watch(
    () => props.text,
    () => {
      if (isOpen.value) updatePosition()
    }
  )

  onMounted(() => {
    globalThis.document?.addEventListener('keydown', onDocumentKeydown)
  })

  onBeforeUnmount(() => {
    clearHoverTimer()
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })
</script>

<template>
  <span
    ref="triggerRef"
    v-bind="attrs"
    class="inline-flex w-fit shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-placement="resolvedPlacementRef"
    :aria-describedby="isOpen && text ? tooltipId : undefined"
    @mouseenter="scheduleOpen"
    @mouseleave="closeTooltip"
    @focusin="setOpen(true)"
    @focusout="onFocusOut"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      @before-enter="emit('show')"
      @before-leave="emit('hide')"
    >
      <div
        v-if="isOpen && text"
        :id="tooltipId"
        ref="panelRef"
        role="tooltip"
        :data-testid="`${testId}__panel`"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-placement="resolvedPlacementRef"
        :aria-hidden="!isOpen"
        :style="panelStyle"
        class="pointer-events-none flex min-h-8 max-w-[var(--container-3xs)] items-center justify-center overflow-clip break-words rounded-[var(--shape-elements)] bg-[var(--bg-contrast)] p-[var(--spacing-xs)] text-center text-body-xs text-[var(--text-contrast)] [transform-origin:var(--popup-origin,center)]"
      >
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>
