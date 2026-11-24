import { nextTick, onScopeDispose, type Ref, watch } from 'vue'

import { nextTabbableAfter } from '../../utils/tabbable'
import { useOverlayLayer } from '../use-overlay-layer'
import type { Align, Side } from '../use-placement'
import { useMenuLevel } from './composables/use-menu-level'
import { createTypeahead, focusMenuItem, type MenuFocusTarget } from './lib/menu-items'
import { registerShortcut } from './lib/shortcut-registry'

export type { MenuFocusTarget }
export { focusMenuItem, useMenuLevel }

/** Identifier an option emits on the root `select` event. */
export type MenuOptionValue = string | number

/** The pointer or keyboard event that activated a menu item. */
export type MenuActivationEvent = globalThis.MouseEvent | globalThis.KeyboardEvent

/** State shared by a menu root and every item part it renders. */
export interface MenuContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current open state of the whole menu. */
  isOpen: Readonly<Ref<boolean>>
  /** Whether the root is disabled. */
  disabled: Readonly<Ref<boolean>>
  /** Side the top-level panel landed on. */
  side: Readonly<Ref<Side>>
  /** Alignment the top-level panel landed on. */
  align: Readonly<Ref<Align>>
  /** Id of the element that labels the top-level panel. */
  triggerId: string
  /** Id of the top-level menu element. */
  panelId: string
  /** Anchor element of the top-level panel. */
  triggerEl: Ref<globalThis.HTMLElement | null>
  /** Top-level floating panel. */
  panelEl: Ref<globalThis.HTMLElement | null>
  /** Element groups of this menu level teleport their content into. */
  panelBodyEl: Ref<globalThis.HTMLElement | null>
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
  side: Readonly<Ref<Side>>
  align: Readonly<Ref<Align>>
  triggerId: string
  panelId: string
  triggerEl: Ref<globalThis.HTMLElement | null>
  panelEl: Ref<globalThis.HTMLElement | null>
  panelBodyEl: Ref<globalThis.HTMLElement | null>
  setOpen: (value: boolean) => void
  onSelect: (event: MenuActivationEvent, value: MenuOptionValue) => void
  focusTrigger: () => void
}

export interface UseMenuRootReturn {
  context: MenuContext
  onPanelKeydown: (event: globalThis.KeyboardEvent) => void
}

type MenuKeyAction = MenuFocusTarget | 'Escape' | 'Tab' | 'type' | null

function menuKeyAction(event: globalThis.KeyboardEvent, typing: boolean): MenuKeyAction {
  const key = event.key
  if (key === 'ArrowDown') return 'next'
  if (key === 'ArrowUp') return 'prev'
  if (key === 'Home' || key === 'End') {
    if (typing) return null
    return key === 'Home' ? 'first' : 'last'
  }
  if (key === 'Escape' || key === 'Tab') return key
  return !typing && isPrintable(event) ? 'type' : null
}

const isPrintable = (event: globalThis.KeyboardEvent): boolean =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey

function tabOut(panel: globalThis.HTMLElement | null): void {
  const from = globalThis.document?.activeElement as globalThis.HTMLElement | null
  if (!from || from === globalThis.document.body || panel?.contains(from)) return
  nextTabbableAfter(from, panel)?.focus()
}

function panelKeydown(
  event: globalThis.KeyboardEvent,
  options: UseMenuRootOptions,
  typeahead: (event: globalThis.KeyboardEvent) => void
): void {
  const typing = (event.target as globalThis.HTMLElement | null)?.matches?.('input, textarea')
  const action = menuKeyAction(event, Boolean(typing))
  if (!action) return
  if (action === 'type') return typeahead(event)
  event.preventDefault()
  const panel = options.panelEl.value
  if (action !== 'Escape' && action !== 'Tab') return focusMenuItem(panel, action)
  options.setOpen(false)
  options.focusTrigger()
  if (action === 'Tab' && !event.shiftKey) tabOut(panel)
}

function outsidePress(
  options: UseMenuRootOptions,
  subPanels: Set<() => globalThis.HTMLElement | null>,
  isInsideHigherLayer: (target: globalThis.Node) => boolean
): (active: boolean) => void {
  const onDocumentMousedown = (event: globalThis.MouseEvent) => {
    if (!options.isOpen.value) return
    const target = event.target as globalThis.Node | null
    if (!target) return
    if (options.triggerEl.value?.contains(target)) return
    if (options.panelEl.value?.contains(target)) return
    for (const panel of subPanels) if (panel()?.contains(target)) return
    if (isInsideHigherLayer(target)) return
    options.setOpen(false)
  }
  return (active) => {
    if (active) globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    else globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  }
}

function shortcutPriority(options: UseMenuRootOptions): number {
  if (options.isOpen.value) return 2
  const focused = globalThis.document?.activeElement ?? null
  return focused && options.triggerEl.value?.contains(focused) ? 1 : 0
}

function selectOption(
  options: UseMenuRootOptions,
  value: MenuOptionValue,
  event: MenuActivationEvent,
  close = true
): void {
  const wasOpen = options.isOpen.value
  options.onSelect(event, value)
  if (close && wasOpen) {
    options.setOpen(false)
    options.focusTrigger()
  }
}

export function useMenuRoot(options: UseMenuRootOptions): UseMenuRootReturn {
  const { isOpen, disabled, panelEl, triggerEl, setOpen, focusTrigger } = options

  const level = useMenuLevel()
  const subPanels = new Set<() => globalThis.HTMLElement | null>()

  const focusFirstOption = () => focusMenuItem(panelEl.value, 'first')
  const typeahead = createTypeahead(panelEl)

  const { isInsideHigherLayer } = useOverlayLayer(isOpen, { element: panelEl })
  const listenOutside = outsidePress(options, subPanels, isInsideHigherLayer)

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
    side: options.side,
    align: options.align,
    triggerId: options.triggerId,
    panelId: options.panelId,
    triggerEl,
    panelEl,
    panelBodyEl: options.panelBodyEl,
    setOpen,
    selectOption: (value, event, close) => selectOption(options, value, event, close),
    registerCommand: (command, activate) =>
      registerShortcut(
        command,
        () => !disabled.value,
        activate,
        () => shortcutPriority(options)
      ),
    focusFirstOption,
    focusLastOption: () => focusMenuItem(panelEl.value, 'last'),
    focusNextOption: () => focusMenuItem(panelEl.value, 'next'),
    focusPrevOption: () => focusMenuItem(panelEl.value, 'prev'),
    focusTrigger,
    activeSub: level.activeSub,
    setActiveSub: level.setActiveSub,
    cancelSubClose: level.cancelSubClose,
    registerSubPanel: (panel) => {
      subPanels.add(panel)
      return () => subPanels.delete(panel)
    }
  }

  return { context, onPanelKeydown: (event) => panelKeydown(event, options, typeahead) }
}
