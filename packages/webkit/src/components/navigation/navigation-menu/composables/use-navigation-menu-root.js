import { computed, nextTick, onUnmounted, ref, shallowRef, watch } from 'vue'

import { waitForCloseTransition, waitForOpenTransition } from '../presets/animations.js'
import { createChangeEventDetails } from './create-change-event-details.js'
import { useNavigationMenuViewportSize } from './use-navigation-menu-viewport-size'
import { useTransitionStatus } from './use-transition-status.js'

/** @typedef {'trigger-press' | 'trigger-hover' | 'outside-press' | 'list-navigation' | 'focus-out' | 'escape-key' | 'link-press' | 'none'} ChangeReason */
/** @typedef {'left' | 'right' | 'up' | 'down' | null} ActivationDirection */

/**
 * @typedef {object} NavigationMenuRootContext
 * @property {import('vue').ComputedRef<string | number | null>} value
 * @property {import('vue').ComputedRef<boolean>} open
 * @property {import('vue').ComputedRef<'horizontal' | 'vertical'>} orientation
 * @property {import('vue').ComputedRef<boolean>} nested
 * @property {import('vue').Ref<ActivationDirection>} activationDirection
 * @property {import('vue').Ref<HTMLElement | null>} viewportEl
 * @property {import('vue').Ref<HTMLElement | null>} activeTriggerEl
 * @property {import('vue').Ref<HTMLElement | null>} popupEl
 * @property {import('vue').Ref<boolean>} instant
 * @property {number} delay
 * @property {number} closeDelay
 * @property {(next: string | number | null, details: ReturnType<typeof createChangeEventDetails>) => void} setValue
 * @property {(itemValue: string | number, details: ReturnType<typeof createChangeEventDetails>) => void} scheduleOpen
 * @property {(details: ReturnType<typeof createChangeEventDetails>) => void} scheduleClose
 * @property {() => void} cancelTimers
 * @property {(itemValue: string | number, el: HTMLElement) => void} registerTrigger
 * @property {(itemValue: string | number) => void} unregisterTrigger
 * @property {(itemValue: string | number) => boolean} isItemOpen
 * @property {(event: KeyboardEvent) => void} onTriggerKeydown
 * @property {(event: KeyboardEvent) => void} onPopupKeydown
 * @property {() => void} close
 * @property {() => void} unmount
 */

/**
 * @typedef {object} NavigationMenuItemContext
 * @property {import('vue').ComputedRef<string | number>} itemValue
 * @property {import('vue').ComputedRef<boolean>} open
 */

/**
 * @typedef {object} NavigationMenuPortalContext
 * @property {import('vue').Ref<HTMLElement | null>} viewportEl
 */

/**
 * @param {import('vue').Ref<string | number | null>} controlledValue
 * @param {import('vue').Ref<string | number | null>} defaultValue
 * @param {import('vue').ComputedRef<boolean>} isControlled
 * @param {import('vue').Ref<string | number | null>} internalValue
 * @param {{
 *   delay: number
 *   closeDelay: number
 *   orientation: 'horizontal' | 'vertical'
 *   nested: boolean
 *   dir?: import('vue').Ref<'ltr' | 'rtl'>
 * }} options
 * @param {(event: string, ...args: unknown[]) => void} emit
 */
export function useNavigationMenuRootState(
  controlledValue,
  defaultValue,
  isControlled,
  internalValue,
  options,
  emit
) {
  /** @type {import('vue').Ref<ActivationDirection>} */
  const activationDirection = ref(null)
  const viewportEl = shallowRef(null)
  const viewportTargetEl = shallowRef(null)
  const activeTriggerEl = shallowRef(null)
  const popupEl = shallowRef(null)
  const positionerEl = shallowRef(null)
  const currentContentEl = shallowRef(null)
  const instant = ref(false)
  const componentMounted = ref(true)

  /** @type {import('vue').Ref<Array<{ value: string | number; el: HTMLElement }>>} */
  const triggers = ref([])

  /** @type {ReturnType<typeof setTimeout> | null} */
  let openTimer = null
  /** @type {ReturnType<typeof setTimeout> | null} */
  let closeTimer = null

  const value = computed(() => {
    if (isControlled.value) {
      return controlledValue.value ?? null
    }

    return internalValue.value ?? null
  })

  const open = computed(() => value.value != null)

  const {
    mounted: popupMounted,
    setMounted: setPopupMounted,
    transitionStatus: popupTransitionStatus
  } = useTransitionStatus(() => open.value)

  const { popupSize } = useNavigationMenuViewportSize({
    activeValue: value,
    popupEl,
    currentContentEl,
    viewportTargetEl,
    popupMounted
  })

  function cancelTimers() {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = null
    }

    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  /**
   * @param {string | number | null} nextValue
   * @param {ReturnType<typeof createChangeEventDetails>} details
   */
  function setValue(nextValue, details) {
    if (details.isCanceled) {
      return
    }

    const previous = value.value

    if (previous === nextValue) {
      return
    }

    if (previous != null && nextValue != null) {
      const previousIndex = triggers.value.findIndex((entry) => entry.value === previous)
      const nextIndex = triggers.value.findIndex((entry) => entry.value === nextValue)

      if (previousIndex !== -1 && nextIndex !== -1) {
        if (options.orientation === 'horizontal') {
          const forward = nextIndex > previousIndex !== (options.dir?.value === 'rtl')
          activationDirection.value = forward ? 'right' : 'left'
        } else {
          activationDirection.value = nextIndex > previousIndex ? 'down' : 'up'
        }
      }
    } else {
      activationDirection.value = null
    }

    if (!isControlled.value) {
      internalValue.value = nextValue
    }

    activeTriggerEl.value =
      nextValue == null
        ? null
        : (triggers.value.find((entry) => entry.value === nextValue)?.el ?? null)

    emit('update:modelValue', nextValue, details)

    if (nextValue != null) {
      void notifyOpenChangeComplete(true)
    }
  }

  /**
   * @param {string | number} itemValue
   * @param {ReturnType<typeof createChangeEventDetails>} details
   */
  function scheduleOpen(itemValue, details) {
    cancelTimers()
    openTimer = setTimeout(() => setValue(itemValue, details), options.delay)
  }

  /** @param {ReturnType<typeof createChangeEventDetails>} details */
  function scheduleClose(details) {
    cancelTimers()
    closeTimer = setTimeout(() => setValue(null, details), options.closeDelay)
  }

  /**
   * @param {string | number} itemValue
   * @param {HTMLElement} el
   */
  function registerTrigger(itemValue, el) {
    const existingIndex = triggers.value.findIndex((entry) => entry.value === itemValue)

    if (existingIndex === -1) {
      triggers.value = [...triggers.value, { value: itemValue, el }]
      return
    }

    const next = [...triggers.value]
    next[existingIndex] = { value: itemValue, el }
    triggers.value = next
  }

  /** @param {string | number} itemValue */
  function unregisterTrigger(itemValue) {
    triggers.value = triggers.value.filter((entry) => entry.value !== itemValue)
  }

  /** @param {string | number} itemValue */
  function isItemOpen(itemValue) {
    return value.value === itemValue
  }

  function close() {
    setValue(
      null,
      createChangeEventDetails('none', /** @type {Event} */ ({ type: 'close' }), undefined)
    )
  }

  function unmount() {
    componentMounted.value = false
    cancelTimers()
    close()
    setPopupMounted(false)
  }

  /** @param {boolean} isOpen */
  async function notifyOpenChangeComplete(isOpen) {
    await nextTick()

    if (isOpen) {
      await waitForOpenTransition(popupEl.value)
    } else {
      await waitForCloseTransition(popupEl.value)
    }

    emit('open-change-complete', isOpen)
  }

  watch(
    () => open.value,
    async (isOpen) => {
      if (isOpen) {
        return
      }

      if (!popupMounted.value) {
        return
      }

      await nextTick()
      await waitForCloseTransition(popupEl.value)
      setPopupMounted(false)
      emit('open-change-complete', false)
    }
  )

  const PANEL_FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function panelFocusables() {
    const panel = popupEl.value
    if (!panel) return []
    return /** @type {HTMLElement[]} */ (Array.from(panel.querySelectorAll(PANEL_FOCUSABLE)))
  }

  /** @param {'first' | 'last'} edge */
  async function focusPanel(edge) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await nextTick()
      const items = panelFocusables()
      if (items.length) {
        ;(edge === 'last' ? items[items.length - 1] : items[0]).focus()
        return
      }
      await new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve(null)))
    }
  }

  /** @param {KeyboardEvent} event */
  function onPopupKeydown(event) {
    const trigger = activeTriggerEl.value
    const items = panelFocusables()
    const index = items.indexOf(/** @type {HTMLElement} */ (document.activeElement))

    if (event.key === 'Escape') {
      event.preventDefault()
      setValue(null, createChangeEventDetails('escape-key', event, trigger ?? undefined))
      trigger?.focus()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!items.length) return
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      items[(index + step + items.length) % items.length].focus()
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      if (!items.length) return
      event.preventDefault()
      items[event.key === 'Home' ? 0 : items.length - 1].focus()
      return
    }

    if (event.key !== 'Tab' || !trigger) return

    if (event.shiftKey && index <= 0) {
      event.preventDefault()
      trigger.focus()
      return
    }

    if (!event.shiftKey && index === items.length - 1) {
      setValue(null, createChangeEventDetails('focus-out', event, trigger))
      trigger.focus()
    }
  }

  /** @param {KeyboardEvent} event */
  function onTriggerKeydown(event) {
    const currentIndex = triggers.value.findIndex((entry) => entry.value === value.value)
    const focusedIndex = triggers.value.findIndex((entry) => entry.el === document.activeElement)

    if (event.key === 'Escape') {
      event.preventDefault()
      setValue(null, createChangeEventDetails('escape-key', event, event.currentTarget))
      return
    }

    const ownTrigger = /** @type {HTMLElement} */ (event.currentTarget)
    const ownValue = triggers.value.find((entry) => entry.el === ownTrigger)?.value
    const ownOpen = ownValue != null && value.value === ownValue

    if (event.key === 'Tab' && !event.shiftKey && ownOpen && panelFocusables().length) {
      event.preventDefault()
      void focusPanel('first')
      return
    }

    const enterKey =
      options.orientation === 'horizontal'
        ? 'ArrowDown'
        : options.dir?.value === 'rtl'
          ? 'ArrowLeft'
          : 'ArrowRight'

    if (event.key === enterKey && ownValue != null) {
      event.preventDefault()
      if (!ownOpen) setValue(ownValue, createChangeEventDetails('trigger-press', event, ownTrigger))
      void focusPanel('first')
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const trigger = /** @type {HTMLElement} */ (event.currentTarget)
      const itemValue = triggers.value.find((entry) => entry.el === trigger)?.value

      if (itemValue == null) {
        return
      }

      const nextValue = value.value === itemValue ? null : itemValue
      setValue(nextValue, createChangeEventDetails('trigger-press', event, trigger))
      return
    }

    const isHorizontal = options.orientation === 'horizontal'
    const isRtl = isHorizontal && options.dir?.value === 'rtl'
    const nextKey = isHorizontal ? (isRtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
    const prevKey = isHorizontal ? (isRtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'

    if (event.key !== nextKey && event.key !== prevKey) {
      return
    }

    event.preventDefault()

    if (!triggers.value.length) {
      return
    }

    const baseIndex = focusedIndex !== -1 ? focusedIndex : currentIndex
    const direction = event.key === nextKey ? 1 : -1
    let index = baseIndex

    for (let step = 0; step < triggers.value.length; step += 1) {
      index = (index + direction + triggers.value.length) % triggers.value.length
      const entry = triggers.value[index]
      entry.el.focus()
      setValue(entry.value, createChangeEventDetails('list-navigation', event, entry.el))
      break
    }
  }

  watch(
    () => controlledValue.value,
    (next) => {
      if (isControlled.value && next != null) {
        activeTriggerEl.value =
          triggers.value.find((entry) => entry.value === next)?.el ?? activeTriggerEl.value
      }
    }
  )

  onUnmounted(() => {
    cancelTimers()
  })

  return {
    value,
    open,
    orientation: computed(() => options.orientation),
    nested: computed(() => options.nested),
    activationDirection,
    viewportEl,
    viewportTargetEl,
    activeTriggerEl,
    popupEl,
    positionerEl,
    currentContentEl,
    popupMounted,
    popupTransitionStatus,
    popupSize,
    setPopupMounted,
    instant,
    componentMounted,
    delay: options.delay,
    closeDelay: options.closeDelay,
    setValue,
    scheduleOpen,
    scheduleClose,
    cancelTimers,
    registerTrigger,
    unregisterTrigger,
    isItemOpen,
    onTriggerKeydown,
    onPopupKeydown,
    close,
    unmount,
    createChangeEventDetails
  }
}

export { createChangeEventDetails }
