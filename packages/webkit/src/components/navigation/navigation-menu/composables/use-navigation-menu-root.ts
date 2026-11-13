import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  nextTick,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  shallowRef,
  toValue,
  watch
} from 'vue'

import { waitForCloseTransition, waitForOpenTransition } from '../presets/animations'
import {
  createChangeEventDetails,
  type NavigationMenuChangeEventDetails
} from './create-change-event-details'
import {
  type NavigationMenuPopupSize,
  useNavigationMenuViewportSize
} from './use-navigation-menu-viewport-size'
import { type TransitionStatus, useTransitionStatus } from './use-transition-status'

export type NavigationMenuItemValue = string | number
export type NavigationMenuActivationDirection = 'left' | 'right' | 'up' | 'down' | null
export type NavigationMenuRootOrientation = 'horizontal' | 'vertical'

export interface NavigationMenuRootEmit {
  (
    event: 'update:modelValue',
    value: NavigationMenuItemValue | null,
    details: NavigationMenuChangeEventDetails
  ): void
  (event: 'open-change-complete', open: boolean): void
}

export interface UseNavigationMenuRootStateOptions {
  delay: MaybeRefOrGetter<number>
  closeDelay: MaybeRefOrGetter<number>
  orientation: MaybeRefOrGetter<NavigationMenuRootOrientation>
  dir?: MaybeRefOrGetter<'ltr' | 'rtl'>
}

export interface UseNavigationMenuRootStateReturn {
  value: ComputedRef<NavigationMenuItemValue | null>
  open: ComputedRef<boolean>
  orientation: ComputedRef<NavigationMenuRootOrientation>
  activationDirection: Readonly<Ref<NavigationMenuActivationDirection>>
  viewportTargetEl: Readonly<Ref<HTMLElement | null>>
  activeTriggerEl: Readonly<Ref<HTMLElement | null>>
  popupEl: Readonly<Ref<HTMLElement | null>>
  currentContentEl: Readonly<Ref<HTMLElement | null>>
  popupMounted: Readonly<Ref<boolean>>
  popupTransitionStatus: Readonly<Ref<TransitionStatus>>
  popupSize: Readonly<Ref<NavigationMenuPopupSize | null>>
  instant: Readonly<Ref<boolean>>
  setViewportTargetEl: (element: HTMLElement | null) => void
  setPopupEl: (element: HTMLElement | null) => void
  setCurrentContentEl: (element: HTMLElement | null) => void
  setValue: (
    next: NavigationMenuItemValue | null,
    details: NavigationMenuChangeEventDetails
  ) => void
  scheduleOpen: (
    itemValue: NavigationMenuItemValue,
    details: NavigationMenuChangeEventDetails
  ) => void
  scheduleClose: (details: NavigationMenuChangeEventDetails) => void
  cancelTimers: () => void
  registerTrigger: (itemValue: NavigationMenuItemValue, el: HTMLElement) => void
  unregisterTrigger: (itemValue: NavigationMenuItemValue) => void
  isItemOpen: (itemValue: NavigationMenuItemValue) => boolean
  onTriggerKeydown: (event: KeyboardEvent) => void
  onPopupKeydown: (event: KeyboardEvent) => void
  close: () => void
  unmount: () => void
}

interface TriggerEntry {
  value: NavigationMenuItemValue
  el: HTMLElement
}

const PANEL_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useNavigationMenuRootState(
  controlledValue: MaybeRefOrGetter<NavigationMenuItemValue | null>,
  isControlled: MaybeRefOrGetter<boolean>,
  internalValue: Ref<NavigationMenuItemValue | null>,
  options: UseNavigationMenuRootStateOptions,
  emit: NavigationMenuRootEmit
): UseNavigationMenuRootStateReturn {
  const activationDirection = ref<NavigationMenuActivationDirection>(null)
  const viewportTargetEl = shallowRef<HTMLElement | null>(null)
  const activeTriggerEl = shallowRef<HTMLElement | null>(null)
  const popupEl = shallowRef<HTMLElement | null>(null)
  const currentContentEl = shallowRef<HTMLElement | null>(null)
  const instant = ref(false)

  const triggers = shallowRef<TriggerEntry[]>([])

  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  const orientation = computed(() => toValue(options.orientation))
  const isRtl = () => toValue(options.dir) === 'rtl'

  const value = computed<NavigationMenuItemValue | null>(() => {
    if (toValue(isControlled)) {
      return toValue(controlledValue) ?? null
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

  async function notifyOpenChangeComplete(isOpen: boolean) {
    await nextTick()

    if (isOpen) {
      await waitForOpenTransition(popupEl.value)
    } else {
      await waitForCloseTransition(popupEl.value)
    }

    emit('open-change-complete', isOpen)
  }

  function setValue(
    nextValue: NavigationMenuItemValue | null,
    details: NavigationMenuChangeEventDetails
  ) {
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
        if (orientation.value === 'horizontal') {
          const forward = nextIndex > previousIndex !== isRtl()
          activationDirection.value = forward ? 'right' : 'left'
        } else {
          activationDirection.value = nextIndex > previousIndex ? 'down' : 'up'
        }
      }
    } else {
      activationDirection.value = null
    }

    if (!toValue(isControlled)) {
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

  function scheduleOpen(
    itemValue: NavigationMenuItemValue,
    details: NavigationMenuChangeEventDetails
  ) {
    cancelTimers()
    openTimer = setTimeout(() => setValue(itemValue, details), toValue(options.delay))
  }

  function scheduleClose(details: NavigationMenuChangeEventDetails) {
    cancelTimers()
    closeTimer = setTimeout(() => setValue(null, details), toValue(options.closeDelay))
  }

  function registerTrigger(itemValue: NavigationMenuItemValue, el: HTMLElement) {
    const existingIndex = triggers.value.findIndex((entry) => entry.value === itemValue)

    if (existingIndex === -1) {
      triggers.value = [...triggers.value, { value: itemValue, el }]
      return
    }

    const next = [...triggers.value]
    next[existingIndex] = { value: itemValue, el }
    triggers.value = next
  }

  function unregisterTrigger(itemValue: NavigationMenuItemValue) {
    triggers.value = triggers.value.filter((entry) => entry.value !== itemValue)
  }

  function isItemOpen(itemValue: NavigationMenuItemValue) {
    return value.value === itemValue
  }

  function close() {
    setValue(null, createChangeEventDetails('none', new Event('close'), undefined))
  }

  function unmount() {
    cancelTimers()
    close()
    setPopupMounted(false)
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

  function panelFocusables(): HTMLElement[] {
    const panel = popupEl.value
    if (!panel) return []
    return Array.from(panel.querySelectorAll<HTMLElement>(PANEL_FOCUSABLE))
  }

  async function focusPanel(edge: 'first' | 'last') {
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

  function onPopupKeydown(event: KeyboardEvent) {
    const trigger = activeTriggerEl.value
    const items = panelFocusables()
    const index = items.indexOf(document.activeElement as HTMLElement)

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

  function onTriggerKeydown(event: KeyboardEvent) {
    const currentIndex = triggers.value.findIndex((entry) => entry.value === value.value)
    const focusedIndex = triggers.value.findIndex((entry) => entry.el === document.activeElement)
    const ownTrigger = event.currentTarget as HTMLElement

    if (event.key === 'Escape') {
      event.preventDefault()
      setValue(null, createChangeEventDetails('escape-key', event, ownTrigger))
      return
    }

    const ownValue = triggers.value.find((entry) => entry.el === ownTrigger)?.value
    const ownOpen = ownValue != null && value.value === ownValue

    if (event.key === 'Tab' && !event.shiftKey && ownOpen && panelFocusables().length) {
      event.preventDefault()
      void focusPanel('first')
      return
    }

    const isHorizontal = orientation.value === 'horizontal'
    const enterKey = isHorizontal ? 'ArrowDown' : isRtl() ? 'ArrowLeft' : 'ArrowRight'

    if (event.key === enterKey && ownValue != null) {
      event.preventDefault()
      if (!ownOpen) setValue(ownValue, createChangeEventDetails('trigger-press', event, ownTrigger))
      void focusPanel('first')
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()

      if (ownValue == null) {
        return
      }

      const nextValue = value.value === ownValue ? null : ownValue
      setValue(nextValue, createChangeEventDetails('trigger-press', event, ownTrigger))
      return
    }

    const flipped = isHorizontal && isRtl()
    const nextKey = isHorizontal ? (flipped ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
    const prevKey = isHorizontal ? (flipped ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'

    if (event.key !== nextKey && event.key !== prevKey) {
      return
    }

    event.preventDefault()

    if (!triggers.value.length) {
      return
    }

    const baseIndex = focusedIndex !== -1 ? focusedIndex : currentIndex
    const direction = event.key === nextKey ? 1 : -1
    const index = (baseIndex + direction + triggers.value.length) % triggers.value.length
    const entry = triggers.value[index]
    entry.el.focus()
    setValue(entry.value, createChangeEventDetails('list-navigation', event, entry.el))
  }

  watch(
    () => toValue(controlledValue),
    (next) => {
      if (toValue(isControlled) && next != null) {
        activeTriggerEl.value =
          triggers.value.find((entry) => entry.value === next)?.el ?? activeTriggerEl.value
      }
    }
  )

  onScopeDispose(cancelTimers)

  return {
    value,
    open,
    orientation,
    activationDirection: readonly(activationDirection) as Readonly<
      Ref<NavigationMenuActivationDirection>
    >,
    viewportTargetEl: readonly(viewportTargetEl) as Readonly<Ref<HTMLElement | null>>,
    activeTriggerEl: readonly(activeTriggerEl) as Readonly<Ref<HTMLElement | null>>,
    popupEl: readonly(popupEl) as Readonly<Ref<HTMLElement | null>>,
    currentContentEl: readonly(currentContentEl) as Readonly<Ref<HTMLElement | null>>,
    popupMounted,
    popupTransitionStatus,
    popupSize,
    instant: readonly(instant) as Readonly<Ref<boolean>>,
    setViewportTargetEl: (element) => {
      viewportTargetEl.value = element
    },
    setPopupEl: (element) => {
      popupEl.value = element
    },
    setCurrentContentEl: (element) => {
      currentContentEl.value = element
    },
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
    unmount
  }
}

export { createChangeEventDetails }
