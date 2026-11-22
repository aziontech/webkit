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

import { resolveActivationDirection } from '../lib/activation-direction'
import {
  createChangeEventDetails,
  type NavigationMenuChangeEventDetails
} from '../lib/change-event-details'
import { waitForCloseTransition, waitForOpenTransition } from '../presets/animations'
import {
  type NavigationMenuTriggerEntry,
  useNavigationMenuKeyboard
} from './use-navigation-menu-keyboard'
import {
  type NavigationMenuPopoverSize,
  useNavigationMenuViewportSize
} from './use-navigation-menu-viewport-size'
import { type TransitionPhase, useTransitionStatus } from './use-transition-status'

export type NavigationMenuItemValue = string | number
export type NavigationMenuActivationDirection = 'left' | 'right' | 'up' | 'down' | null
export type NavigationMenuRootOrientation = 'horizontal' | 'vertical'

export interface NavigationMenuRootEmit {
  (
    event: 'update:modelValue',
    value: NavigationMenuItemValue | null,
    details: NavigationMenuChangeEventDetails
  ): void
  (event: 'open-transition-end', open: boolean): void
}

export interface UseNavigationMenuRootOptions {
  delay: MaybeRefOrGetter<number>
  closeDelay: MaybeRefOrGetter<number>
  orientation: MaybeRefOrGetter<NavigationMenuRootOrientation>
  dir?: MaybeRefOrGetter<'ltr' | 'rtl'>
}

export interface UseNavigationMenuRootReturn {
  value: ComputedRef<NavigationMenuItemValue | null>
  open: ComputedRef<boolean>
  orientation: ComputedRef<NavigationMenuRootOrientation>
  activationDirection: Readonly<Ref<NavigationMenuActivationDirection>>
  viewportTargetEl: Readonly<Ref<HTMLElement | null>>
  activeTriggerEl: Readonly<Ref<HTMLElement | null>>
  popupEl: Readonly<Ref<HTMLElement | null>>
  currentContentEl: Readonly<Ref<HTMLElement | null>>
  popupMounted: Readonly<Ref<boolean>>
  popupTransitionStatus: Readonly<Ref<TransitionPhase>>
  popupSize: Readonly<Ref<NavigationMenuPopoverSize | null>>
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

type ChangeDetails = NavigationMenuChangeEventDetails
type ItemValue = NavigationMenuItemValue

function createTriggerRegistry() {
  const triggers = shallowRef<NavigationMenuTriggerEntry[]>([])

  const registerTrigger = (itemValue: ItemValue, el: HTMLElement) => {
    const existingIndex = triggers.value.findIndex((entry) => entry.value === itemValue)
    if (existingIndex === -1) {
      triggers.value = [...triggers.value, { value: itemValue, el }]
      return
    }
    const next = [...triggers.value]
    next[existingIndex] = { value: itemValue, el }
    triggers.value = next
  }

  const unregisterTrigger = (itemValue: ItemValue) => {
    triggers.value = triggers.value.filter((entry) => entry.value !== itemValue)
  }

  const findTriggerEl = (itemValue: ItemValue) =>
    triggers.value.find((entry) => entry.value === itemValue)?.el

  return { triggers, registerTrigger, unregisterTrigger, findTriggerEl }
}

function createElementSlots() {
  const viewportTargetEl = shallowRef<HTMLElement | null>(null)
  const popupEl = shallowRef<HTMLElement | null>(null)
  const currentContentEl = shallowRef<HTMLElement | null>(null)

  return {
    viewportTargetEl: readonly(viewportTargetEl) as Readonly<Ref<HTMLElement | null>>,
    popupEl: readonly(popupEl) as Readonly<Ref<HTMLElement | null>>,
    currentContentEl: readonly(currentContentEl) as Readonly<Ref<HTMLElement | null>>,
    setViewportTargetEl: (element: HTMLElement | null) => {
      viewportTargetEl.value = element
    },
    setPopupEl: (element: HTMLElement | null) => {
      popupEl.value = element
    },
    setCurrentContentEl: (element: HTMLElement | null) => {
      currentContentEl.value = element
    }
  }
}

function createOpenTimers(
  options: UseNavigationMenuRootOptions,
  setValue: (next: ItemValue | null, details: ChangeDetails) => void
) {
  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  const cancelTimers = () => {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = null
    }
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  const scheduleOpen = (itemValue: ItemValue, details: ChangeDetails) => {
    cancelTimers()
    openTimer = setTimeout(() => setValue(itemValue, details), toValue(options.delay))
  }

  const scheduleClose = (details: ChangeDetails) => {
    cancelTimers()
    closeTimer = setTimeout(() => setValue(null, details), toValue(options.closeDelay))
  }

  onScopeDispose(cancelTimers)

  return { cancelTimers, scheduleOpen, scheduleClose }
}

function createValueState(
  controlledValue: MaybeRefOrGetter<ItemValue | null>,
  isControlled: MaybeRefOrGetter<boolean>,
  internalValue: Ref<ItemValue | null>,
  options: UseNavigationMenuRootOptions,
  registry: ReturnType<typeof createTriggerRegistry>,
  popupEl: Readonly<Ref<HTMLElement | null>>,
  emit: NavigationMenuRootEmit
) {
  const activationDirection = ref<NavigationMenuActivationDirection>(null)
  const activeTriggerEl = shallowRef<HTMLElement | null>(null)
  const orientation = computed(() => toValue(options.orientation))
  const isRtl = () => toValue(options.dir) === 'rtl'
  const value = computed<ItemValue | null>(() =>
    toValue(isControlled) ? (toValue(controlledValue) ?? null) : (internalValue.value ?? null)
  )

  const notifyOpened = async () => {
    await nextTick()
    await waitForOpenTransition(popupEl.value)
    emit('open-transition-end', true)
  }

  const setValue = (nextValue: ItemValue | null, details: ChangeDetails) => {
    if (details.isCanceled) return
    const previous = value.value
    if (previous === nextValue) return
    const direction = resolveActivationDirection(
      registry.triggers.value,
      previous,
      nextValue,
      orientation.value,
      isRtl()
    )
    if (direction !== undefined) activationDirection.value = direction
    if (!toValue(isControlled)) internalValue.value = nextValue
    activeTriggerEl.value = nextValue == null ? null : (registry.findTriggerEl(nextValue) ?? null)
    emit('update:modelValue', nextValue, details)
    if (nextValue != null) void notifyOpened()
  }

  watch(
    () => toValue(controlledValue),
    (next) => {
      if (toValue(isControlled) && next != null)
        activeTriggerEl.value = registry.findTriggerEl(next) ?? activeTriggerEl.value
    }
  )

  return {
    activationDirection: readonly(activationDirection) as Readonly<
      Ref<NavigationMenuActivationDirection>
    >,
    activeTriggerEl: readonly(activeTriggerEl) as Readonly<Ref<HTMLElement | null>>,
    orientation,
    isRtl,
    value,
    setValue,
    triggers: registry.triggers,
    popupEl
  }
}

function watchPopupClose(
  open: ComputedRef<boolean>,
  popup: ReturnType<typeof useTransitionStatus>,
  popupEl: Readonly<Ref<HTMLElement | null>>,
  emit: NavigationMenuRootEmit
) {
  watch(
    () => open.value,
    async (isOpen) => {
      if (isOpen || !popup.mounted.value) return
      await nextTick()
      await waitForCloseTransition(popupEl.value)
      popup.setMounted(false)
      emit('open-transition-end', false)
    }
  )
}

function createPopupState(
  value: ComputedRef<ItemValue | null>,
  elements: ReturnType<typeof createElementSlots>,
  emit: NavigationMenuRootEmit
) {
  const open = computed(() => value.value != null)
  const popup = useTransitionStatus(() => open.value)
  const { popupSize } = useNavigationMenuViewportSize({
    activeValue: value,
    popupEl: elements.popupEl,
    currentContentEl: elements.currentContentEl,
    viewportTargetEl: elements.viewportTargetEl,
    popupMounted: popup.mounted
  })
  watchPopupClose(open, popup, elements.popupEl, emit)
  return { open, popup, popupSize }
}

export function useNavigationMenuRoot(
  controlledValue: MaybeRefOrGetter<ItemValue | null>,
  isControlled: MaybeRefOrGetter<boolean>,
  internalValue: Ref<ItemValue | null>,
  options: UseNavigationMenuRootOptions,
  emit: NavigationMenuRootEmit
): UseNavigationMenuRootReturn {
  const elements = createElementSlots()
  const registry = createTriggerRegistry()
  const state = createValueState(
    controlledValue,
    isControlled,
    internalValue,
    options,
    registry,
    elements.popupEl,
    emit
  )
  const { value, setValue } = state
  const { open, popup, popupSize } = createPopupState(value, elements, emit)
  const timers = createOpenTimers(options, setValue)
  const close = () =>
    setValue(null, createChangeEventDetails('none', new Event('close'), undefined))

  return {
    ...elements,
    ...registry,
    ...state,
    ...timers,
    ...useNavigationMenuKeyboard(state),
    open,
    popupMounted: popup.mounted,
    popupTransitionStatus: popup.transitionStatus,
    popupSize,
    instant: readonly(ref(false)) as Readonly<Ref<boolean>>,
    isItemOpen: (itemValue) => value.value === itemValue,
    close,
    unmount: () => {
      timers.cancelTimers()
      close()
      popup.setMounted(false)
    }
  }
}

export { createChangeEventDetails }
