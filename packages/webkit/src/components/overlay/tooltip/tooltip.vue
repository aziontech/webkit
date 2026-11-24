<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { usePlacement } from '../../../composables/use-placement'
  import { usePortalLocale } from '../../../composables/use-translate'
  import { triggerControl } from '../../../utils/trigger-control'

  /** Side of the trigger the tooltip opens on; `start` and `end` follow the text direction. */
  export type TooltipSide = 'top' | 'bottom' | 'start' | 'end'
  /** Alignment of the tooltip along the trigger edge. */
  export type TooltipAlign = 'start' | 'center' | 'end'

  defineOptions({
    name: 'Tooltip',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface TooltipProps {
    /** Plain text shown inside the tooltip. */
    content: string
    /** Side of the trigger the tooltip opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. */
    side?: TooltipSide | 'auto'
    /** Alignment along the trigger edge. */
    align?: TooltipAlign
    /** Pixel gap between the trigger and the tooltip. */
    sideOffset?: number
    /** Hover-open delay in milliseconds. */
    delay?: number
    /** Disables tooltip activation. */
    disabled?: boolean
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<TooltipProps>(), {
    side: 'top',
    align: 'center',
    sideOffset: 8,
    delay: 200,
    disabled: false,
    defaultOpen: false
  })

  const CLOSE_GRACE_MS = 100
  const LONG_PRESS_MS = 500
  const TOUCH_HIDE_MS = 1500

  /** Controlled open state. Use with v-model:open; while unbound the tooltip starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()
  const triggerEl = ref<HTMLElement | null>(null)
  const panelEl = ref<HTMLElement | null>(null)
  const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const pressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  let escaped = false

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tooltip')

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
  const { resolvedSide, resolvedAlign, panelStyle, anchored, updatePosition } = usePlacement({
    triggerRef: triggerEl,
    panelRef: panelEl,
    isOpen: isOpenRef,
    side: () => props.side,
    align: () => props.align,
    sideOffset: () => props.sideOffset,
    autoSides: ['top', 'bottom', 'end', 'start'],
    onDismiss: () => closeTooltip()
  })

  const { isTop } = useOverlayLayer(() => isOpen.value && Boolean(props.content), {
    element: panelEl,
    transient: true
  })

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
    if (!props.content && next) return
    isOpen.set(next)
  }

  function scheduleOpen() {
    clearCloseTimer()
    if (props.disabled || !props.content || escaped) return
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
    escaped = false
    clearHoverTimer()
    clearCloseTimer()
    closeTimer.value = setTimeout(closeTooltip, wait)
  }

  function onPointerdown(event: globalThis.PointerEvent) {
    if (event.pointerType !== 'touch' || props.disabled || !props.content) return
    clearPressTimer()
    clearCloseTimer()
    pressTimer.value = setTimeout(() => setOpen(true), LONG_PRESS_MS)
  }

  function onPointerup(event: globalThis.PointerEvent) {
    if (event.pointerType !== 'touch') return
    clearPressTimer()
    if (isOpen.value) scheduleClose(TOUCH_HIDE_MS)
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (!isOpen.value || !isTop.value || event.defaultPrevented) return
    if (event.key === 'Escape') {
      event.preventDefault()
      escaped = true
      closeTooltip()
    }
  }

  function onFocusout(event: globalThis.FocusEvent) {
    const trigger = triggerEl.value
    const next = event.relatedTarget as Node | null
    if (trigger?.contains(next)) return
    closeTooltip()
  }

  watch(
    () => (isOpen.value && props.content ? tooltipId.value : ''),
    (id) => {
      const host = triggerEl.value
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
    () => props.content,
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

  useElementListener(triggerEl, 'mouseenter', () => scheduleOpen())
  useElementListener(triggerEl, 'mouseleave', () => scheduleClose())
  useElementListener(triggerEl, 'pointerdown', onPointerdown)
  useElementListener(triggerEl, 'pointerup', onPointerup)
  useElementListener(triggerEl, 'pointercancel', onPointerup)
  useElementListener(triggerEl, 'focusin', () => setOpen(true))
  useElementListener(triggerEl, 'focusout', onFocusout)

  onBeforeUnmount(() => {
    clearHoverTimer()
    clearCloseTimer()
    clearPressTimer()
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })

  const portalLocale = usePortalLocale()

  const PANEL_CLASS =
    'flex min-h-8 max-w-(--container-3xs) items-center justify-center overflow-clip break-words rounded-(--shape-control) bg-(--bg-contrast) p-(--spacing-xs) text-center text-body-xs ' +
    'text-(--text-contrast) [transform-origin:var(--popup-origin,center)] ' +
    'data-[anchored]:transition-[translate] data-[anchored]:duration-fast-02 data-[anchored]:ease-productive-entrance ' +
    'motion-reduce:transition-none'
</script>

<template>
  <span
    ref="triggerEl"
    v-bind="attrs"
    class="inline-flex w-fit shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-side="resolvedSide"
    :data-align="resolvedAlign"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="isOpen && content"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :id="tooltipId"
        ref="panelEl"
        role="tooltip"
        :data-testid="`${testId}__panel`"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :data-anchored="anchored || null"
        :aria-hidden="!isOpen"
        @mouseenter="clearCloseTimer"
        @mouseleave="scheduleClose()"
        @focusin="clearCloseTimer"
        @focusout="scheduleClose()"
        :style="panelStyle"
        :class="PANEL_CLASS"
      >
        {{ content }}
      </div>
    </Transition>
  </Teleport>
</template>
