<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import {
    popupScaleTransitionEnterActiveClasses,
    popupScaleTransitionEnterFromClasses,
    popupScaleTransitionEnterToClasses,
    popupScaleTransitionLeaveActiveClasses,
    popupScaleTransitionLeaveFromClasses,
    popupScaleTransitionLeaveToClasses
  } from './presets/popup-scale-transition.js'

  // Motion utilities (spec): animate-popup-scale-in, animate-popup-scale-out

  export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

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
    /** Anchor side relative to the trigger. */
    placement?: TooltipPlacement
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

  const openModel = defineModel<boolean>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const panelStyle = ref<Record<string, string>>({})
  const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const resolvedPlacement = ref<TooltipPlacement>(props.placement)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-tooltip')

  const tooltipId = computed(() => `${uid}-tooltip`)

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
      emit('update:open', value)
    }
  })

  function getPopupOrigin(side: TooltipPlacement): string {
    if (side === 'top') return 'bottom center'
    if (side === 'bottom') return 'top center'
    if (side === 'left') return 'right center'
    return 'left center'
  }

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

  function updatePosition() {
    const trigger = triggerRef.value
    const panel = panelRef.value

    if (!trigger || !panel) {
      panelStyle.value = {}
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const offset = 8
    const collisionPadding = 8
    const viewport = {
      width: globalThis.innerWidth ?? 0,
      height: globalThis.innerHeight ?? 0
    }

    const opposite: Record<TooltipPlacement, TooltipPlacement> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }

    const fits = (candidate: TooltipPlacement) => {
      switch (candidate) {
        case 'bottom':
          return (
            triggerRect.bottom + offset + panelRect.height + collisionPadding <= viewport.height
          )
        case 'top':
          return triggerRect.top - offset - panelRect.height - collisionPadding >= 0
        case 'right':
          return triggerRect.right + offset + panelRect.width + collisionPadding <= viewport.width
        case 'left':
          return triggerRect.left - offset - panelRect.width - collisionPadding >= 0
        default:
          return true
      }
    }

    let side: TooltipPlacement = props.placement
    if (!fits(side) && fits(opposite[side])) {
      side = opposite[side]
    }
    resolvedPlacement.value = side

    let top = 0
    let left = 0

    if (side === 'top') {
      top = triggerRect.top - panelRect.height - offset
      left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2
    } else if (side === 'bottom') {
      top = triggerRect.bottom + offset
      left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2
    } else if (side === 'left') {
      top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2
      left = triggerRect.left - panelRect.width - offset
    } else {
      top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2
      left = triggerRect.right + offset
    }

    const maxLeft = viewport.width - panelRect.width - collisionPadding
    const maxTop = viewport.height - panelRect.height - collisionPadding
    left = Math.min(Math.max(left, collisionPadding), Math.max(collisionPadding, maxLeft))
    top = Math.min(Math.max(top, collisionPadding), Math.max(collisionPadding, maxTop))

    panelStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '1100',
      '--popup-origin': getPopupOrigin(side)
    }
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (!isOpen.value) return
    if (event.key === 'Escape') {
      event.preventDefault()
      closeTooltip()
    }
  }

  function onScrollOrResize() {
    if (!isOpen.value) return
    updatePosition()
  }

  function onFocusOut(event: globalThis.FocusEvent) {
    const trigger = triggerRef.value
    const next = event.relatedTarget as Node | null
    if (trigger?.contains(next)) return
    closeTooltip()
  }

  watch(
    () => isOpen.value,
    async (open) => {
      if (!open) return
      await nextTick()
      updatePosition()
      await nextTick()
      updatePosition()
    }
  )

  watch(
    () => props.placement,
    () => {
      resolvedPlacement.value = props.placement
      if (isOpen.value) {
        nextTick(() => updatePosition())
      }
    }
  )

  onMounted(() => {
    globalThis.document?.addEventListener('keydown', onDocumentKeydown)
    globalThis.window?.addEventListener('resize', onScrollOrResize)
    globalThis.document?.addEventListener('scroll', onScrollOrResize, true)
  })

  onBeforeUnmount(() => {
    clearHoverTimer()
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
    globalThis.window?.removeEventListener('resize', onScrollOrResize)
    globalThis.document?.removeEventListener('scroll', onScrollOrResize, true)
  })
</script>

<template>
  <span
    ref="triggerRef"
    v-bind="attrs"
    class="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-placement="resolvedPlacement"
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
      :enter-active-class="popupScaleTransitionEnterActiveClasses"
      :enter-from-class="popupScaleTransitionEnterFromClasses"
      :enter-to-class="popupScaleTransitionEnterToClasses"
      :leave-active-class="popupScaleTransitionLeaveActiveClasses"
      :leave-from-class="popupScaleTransitionLeaveFromClasses"
      :leave-to-class="popupScaleTransitionLeaveToClasses"
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
        :data-placement="resolvedPlacement"
        :aria-hidden="!isOpen"
        :style="panelStyle"
        class="pointer-events-none flex min-h-8 max-w-[var(--container-3xs)] items-center justify-center overflow-clip break-words rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-contrast)] p-[var(--spacing-xs)] text-center text-body-sm text-[var(--text-contrast)] [transform-origin:var(--popup-origin,center)] will-change-[transform,opacity]"
      >
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>
