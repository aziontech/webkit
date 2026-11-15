import { nextTick, onScopeDispose, readonly, type Ref, ref, watch } from 'vue'

import { useOverlayLayer } from '../use-overlay-layer'
import { registerShortcut } from './lib/shortcut-registry'

/** Identifier an option emits on the root `select` event. */
export type MenuOptionValue = string | number

/** The pointer or keyboard event that activated a menu item. */
export type MenuActivationEvent = globalThis.MouseEvent | globalThis.KeyboardEvent

/** Corner a menu panel opens from, relative to its anchor. */
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

/** Which item a focus move lands on. */
export type MenuFocusTarget = 'first' | 'last' | 'next' | 'prev'

/** State shared by a menu root and every item part it renders. */
export interface MenuContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current open state of the whole menu. */
  isOpen: Readonly<Ref<boolean>>
  /** Whether the root is disabled. */
  disabled: Readonly<Ref<boolean>>
  /** Resolved placement of the top-level panel. */
  placement: Readonly<Ref<MenuPlacement>>
  /** Id of the element that labels the top-level panel. */
  triggerId: string
  /** Id of the top-level menu element. */
  panelId: string
  /** Anchor element of the top-level panel. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  /** Top-level floating panel. */
  panelRef: Ref<globalThis.HTMLElement | null>
  /** Element groups of this menu level teleport their content into. */
  panelBodyRef: Ref<globalThis.HTMLElement | null>
  /** Opens or closes the whole menu. */
  setOpen: (value: boolean) => void
  /** Emits select for an item; closes the whole menu unless `close` is false. */
  selectOption: (value: MenuOptionValue, event: MenuActivationEvent, close?: boolean) => void
  /** Registers a window shortcut for an option's command hint; returns the unregister function. */
  registerCommand: (
    command: string,
    activate: (event: globalThis.KeyboardEvent) => void
  ) => () => void
  /** Moves focus to the first enabled item of this menu level. */
  focusFirstOption: () => void
  /** Moves focus to the last enabled item of this menu level. */
  focusLastOption: () => void
  /** Moves focus to the next enabled item of this menu level, wrapping around. */
  focusNextOption: () => void
  /** Moves focus to the previous enabled item of this menu level, wrapping around. */
  focusPrevOption: () => void
  /** Returns focus to the element that opened the menu. */
  focusTrigger: () => void
  /** Id of the sub-menu open on this menu level, or null. */
  activeSub: Readonly<Ref<string | null>>
  /** Opens the sub-menu with this id on this level (null closes it); `delay` waits before switching away from an open one. */
  setActiveSub: (id: string | null, delay?: boolean) => void
  /** Cancels a pending delayed sub-menu switch on this level. */
  cancelSubClose: () => void
  /** Registers a floating sub-menu panel so clicks inside it do not dismiss the menu. */
  registerSubPanel: (panel: () => globalThis.HTMLElement | null) => () => void
}

/** The per-level sub-menu bookkeeping a menu panel owns. */
export interface MenuLevel {
  activeSub: Readonly<Ref<string | null>>
  setActiveSub: (id: string | null, delay?: boolean) => void
  cancelSubClose: () => void
}

export interface UseMenuRootOptions {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  placement: Readonly<Ref<MenuPlacement>>
  triggerId: string
  panelId: string
  triggerRef: Ref<globalThis.HTMLElement | null>
  panelRef: Ref<globalThis.HTMLElement | null>
  panelBodyRef: Ref<globalThis.HTMLElement | null>
  setOpen: (value: boolean) => void
  onSelect: (event: MenuActivationEvent, value: MenuOptionValue) => void
  focusTrigger: () => void
}

export interface UseMenuRootReturn {
  context: MenuContext
  onPanelKeydown: (event: globalThis.KeyboardEvent) => void
}

const ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'

const SUB_SWITCH_DELAY = 150

export function menuItems(container: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<globalThis.HTMLElement>(ITEM_SELECTOR)).filter(
    (el) => el.getAttribute('aria-disabled') !== 'true'
  )
}

export function focusMenuItem(
  container: globalThis.HTMLElement | null,
  target: MenuFocusTarget
): void {
  const items = menuItems(container)
  if (items.length === 0) return
  const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
  const index = active ? items.indexOf(active) : -1
  let next: globalThis.HTMLElement
  if (target === 'first') next = items[0]
  else if (target === 'last') next = items[items.length - 1]
  else if (target === 'next') next = items[(index + 1) % items.length]
  else next = items[(index <= 0 ? items.length : index) - 1]
  next.focus({ preventScroll: true })
}

export function useMenuLevel(): MenuLevel {
  const activeSub = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  function cancelSubClose() {
    if (timer === undefined) return
    clearTimeout(timer)
    timer = undefined
  }

  function setActiveSub(id: string | null, delay = false) {
    cancelSubClose()
    if (delay && activeSub.value !== null && activeSub.value !== id) {
      timer = setTimeout(() => {
        timer = undefined
        activeSub.value = id
      }, SUB_SWITCH_DELAY)
      return
    }
    activeSub.value = id
  }

  onScopeDispose(cancelSubClose)

  return { activeSub: readonly(activeSub), setActiveSub, cancelSubClose }
}

export function useMenuRoot(options: UseMenuRootOptions): UseMenuRootReturn {
  const { isOpen, disabled, panelRef, triggerRef, setOpen, focusTrigger } = options

  const level = useMenuLevel()
  const subPanels = new Set<() => globalThis.HTMLElement | null>()

  const focusFirstOption = () => focusMenuItem(panelRef.value, 'first')
  const focusLastOption = () => focusMenuItem(panelRef.value, 'last')
  const focusNextOption = () => focusMenuItem(panelRef.value, 'next')
  const focusPrevOption = () => focusMenuItem(panelRef.value, 'prev')

  function selectOption(value: MenuOptionValue, event: MenuActivationEvent, close = true) {
    const wasOpen = isOpen.value
    options.onSelect(event, value)
    if (close && wasOpen) {
      setOpen(false)
      focusTrigger()
    }
  }

  function registerCommand(
    command: string,
    activate: (event: globalThis.KeyboardEvent) => void
  ): () => void {
    return registerShortcut(command, () => !disabled.value, activate, shortcutPriority)
  }

  function shortcutPriority(): number {
    if (isOpen.value) return 2
    const focused = globalThis.document?.activeElement ?? null
    return focused && triggerRef.value?.contains(focused) ? 1 : 0
  }

  function registerSubPanel(panel: () => globalThis.HTMLElement | null): () => void {
    subPanels.add(panel)
    return () => {
      subPanels.delete(panel)
    }
  }

  let typeaheadBuffer = ''
  let typeaheadAt = 0

  function typeahead(event: globalThis.KeyboardEvent) {
    const items = menuItems(panelRef.value)
    if (items.length === 0) return
    typeaheadBuffer =
      event.timeStamp - typeaheadAt > 500 ? event.key : `${typeaheadBuffer}${event.key}`
    typeaheadAt = event.timeStamp
    const typed = typeaheadBuffer.toLocaleLowerCase()
    const query = Array.from(typed).every((char) => char === typed[0]) ? typed[0] : typed
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const start = active ? items.indexOf(active) : -1
    const ordered =
      query.length === 1
        ? [...items.slice(start + 1), ...items.slice(0, start + 1)]
        : [...items.slice(Math.max(start, 0)), ...items.slice(0, Math.max(start, 0))]
    const match = ordered.find((item) =>
      (item.textContent ?? '').trim().toLocaleLowerCase().startsWith(query)
    )
    if (match) {
      event.preventDefault()
      match.focus({ preventScroll: true })
    }
  }

  function onPanelKeydown(event: globalThis.KeyboardEvent) {
    const typing = (event.target as globalThis.HTMLElement | null)?.matches?.('input, textarea')
    if (typing && (event.key === 'Home' || event.key === 'End')) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusNextOption()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusPrevOption()
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusFirstOption()
    } else if (event.key === 'End') {
      event.preventDefault()
      focusLastOption()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      focusTrigger()
    } else if (event.key === 'Tab') {
      if (event.shiftKey) event.preventDefault()
      setOpen(false)
      focusTrigger()
    } else if (
      !typing &&
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      typeahead(event)
    }
  }

  const { isInsideHigherLayer } = useOverlayLayer(isOpen, { element: panelRef })

  function onDocumentMousedown(event: globalThis.MouseEvent) {
    if (!isOpen.value) return
    const target = event.target as globalThis.Node | null
    if (!target) return
    if (triggerRef.value?.contains(target)) return
    if (panelRef.value?.contains(target)) return
    for (const panel of subPanels) if (panel()?.contains(target)) return
    if (isInsideHigherLayer(target)) return
    setOpen(false)
  }

  function listenOutside(active: boolean) {
    if (active) globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    else globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  }

  if (isOpen.value) listenOutside(true)
  onScopeDispose(() => listenOutside(false))

  watch(isOpen, async (open) => {
    listenOutside(open)
    if (!open) {
      level.setActiveSub(null)
      return
    }
    await nextTick()
    focusFirstOption()
  })

  const context: MenuContext = {
    testId: options.testId,
    isOpen,
    disabled,
    placement: options.placement,
    triggerId: options.triggerId,
    panelId: options.panelId,
    triggerRef,
    panelRef,
    panelBodyRef: options.panelBodyRef,
    setOpen,
    selectOption,
    registerCommand,
    focusFirstOption,
    focusLastOption,
    focusNextOption,
    focusPrevOption,
    focusTrigger,
    activeSub: level.activeSub,
    setActiveSub: level.setActiveSub,
    cancelSubClose: level.cancelSubClose,
    registerSubPanel
  }

  return { context, onPanelKeydown }
}
