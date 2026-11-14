<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { usePortalLocale } from '../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../composables/use-placement'
  import { triggerControl } from '../../../utils/trigger-control'

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
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placement: 'top',
    delay: 200,
    disabled: false,
    defaultOpen: false
  })

  const emit = defineEmits<{
    /**
     * Emitted right after the open transition starts.
     * @deprecated since 6.0 — use `update:open` (v-model:open). Removed in 7.0.
     */
    show: []
    /**
     * Emitted right after the close transition starts.
     * @deprecated since 6.0 — use `update:open` (v-model:open). Removed in 7.0.
     */
    hide: []
  }>()

  const CLOSE_GRACE_MS = 100
  const LONG_PRESS_MS = 500
  const TOUCH_HIDE_MS = 1500

  /** Controlled open state. Use with v-model:open; while unbound the tooltip starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const pressTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-tooltip')

  const tooltipId = computed(() => `${uid}-tooltip`)

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpen.value)
  const placementRef = computed(() => props.placement)

  const { resolvedPlacement, panelStyle, anchored, updatePosition } = usePlacement({
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

  function clearCloseTimer() {
    if (closeTimer.value) {
      clearTimeout(closeTimer.value)
      closeTimer.value = null
    }
  }

  function clearPressTimer() {
    if (pressTimer.value) {
      clearTimeout(pressTimer.value)
      pressTimer.value = null
    }
  }

  function setOpen(next: boolean) {
    if (props.disabled) return
    if (!props.text && next) return
    isOpen.set(next)
  }

  function scheduleOpen() {
    clearCloseTimer()
    if (props.disabled || !props.text) return
    if (isOpen.value) return
    clearHoverTimer()
    hoverTimer.value = setTimeout(() => setOpen(true), props.delay)
  }

  function closeTooltip() {
    clearHoverTimer()
    clearCloseTimer()
    clearPressTimer()
    setOpen(false)
  }

  function scheduleClose(wait: number = CLOSE_GRACE_MS) {
    clearHoverTimer()
    clearCloseTimer()
    closeTimer.value = setTimeout(closeTooltip, wait)
  }

  function onPointerDown(event: globalThis.PointerEvent) {
    if (event.pointerType !== 'touch' || props.disabled || !props.text) return
    clearPressTimer()
    clearCloseTimer()
    pressTimer.value = setTimeout(() => setOpen(true), LONG_PRESS_MS)
  }

  function onPointerUp(event: globalThis.PointerEvent) {
    if (event.pointerType !== 'touch') return
    clearPressTimer()
    if (isOpen.value) scheduleClose(TOUCH_HIDE_MS)
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
    () => (isOpen.value && props.text ? tooltipId.value : ''),
    (id) => {
      const host = triggerRef.value
      if (!host) return
      const el = triggerControl(host)
      const ids = (el.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter((token) => token && token !== tooltipId.value)
      if (id) ids.push(id)
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '))
      else el.removeAttribute('aria-describedby')
    },
    { flush: 'post' }
  )

  watch(
    () => props.text,
    () => {
      if (isOpen.value) updatePosition()
    }
  )

  watch(
    () => isOpen.value,
    (open) => {
      if (open) globalThis.document?.addEventListener('keydown', onDocumentKeydown)
      else globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    clearHoverTimer()
    clearCloseTimer()
    clearPressTimer()
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })

  const portalLocale = usePortalLocale()
</script>

<template>
  <span
    ref="triggerRef"
    v-bind="attrs"
    class="inline-flex w-fit shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-placement="resolvedPlacementRef"
    @mouseenter="scheduleOpen"
    @mouseleave="scheduleClose()"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
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
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :id="tooltipId"
        ref="panelRef"
        role="tooltip"
        :data-testid="`${testId}__panel`"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-placement="resolvedPlacementRef"
        :data-anchored="anchored || null"
        :aria-hidden="!isOpen"
        @mouseenter="clearCloseTimer"
        @mouseleave="scheduleClose()"
        :style="panelStyle"
        class="flex min-h-8 max-w-(--container-3xs) items-center justify-center overflow-clip break-words rounded-(--shape-elements) bg-(--bg-contrast) p-(--spacing-xs) text-center text-body-xs text-(--text-contrast) [transform-origin:var(--popup-origin,center)] data-[anchored]:transition-[translate] data-[anchored]:duration-fast-02 data-[anchored]:ease-productive-entrance motion-reduce:transition-none"
      >
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>
