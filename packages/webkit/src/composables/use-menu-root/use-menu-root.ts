import { nextTick, type Ref, watch } from 'vue'

import type { Align, Side } from '../use-placement'
import { useMenuKeyboard } from './composables/use-menu-keyboard'
import { useMenuLevel } from './composables/use-menu-level'
import { useMenuOutsidePress } from './composables/use-menu-outside-press'
import { focusMenuItem, type MenuFocusTarget } from './lib/menu-items'
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

function shortcutPriority(
  isOpen: Readonly<Ref<boolean>>,
  triggerEl: Ref<globalThis.HTMLElement | null>
): number {
  if (isOpen.value) return 2
  const focused = globalThis.document?.activeElement ?? null
  return focused && triggerEl.value?.contains(focused) ? 1 : 0
}

export function useMenuRoot(options: UseMenuRootOptions): UseMenuRootReturn {
  const { isOpen, disabled, panelEl, triggerEl, setOpen, focusTrigger } = options
  const level = useMenuLevel()
  const focusOption = (target: MenuFocusTarget) => () => focusMenuItem(panelEl.value, target)
  const focusFirstOption = focusOption('first')

  function selectOption(value: MenuOptionValue, event: MenuActivationEvent, close = true): void {
    const wasOpen = isOpen.value
    options.onSelect(event, value)
    if (!close || !wasOpen) return
    setOpen(false)
    focusTrigger()
  }

  const registerCommand = (
    command: string,
    activate: (event: globalThis.KeyboardEvent) => void
  ): (() => void) =>
    registerShortcut(
      command,
      () => !disabled.value,
      activate,
      () => shortcutPriority(isOpen, triggerEl)
    )

  const { onPanelKeydown } = useMenuKeyboard({ panelEl, setOpen, focusTrigger })
  const { registerSubPanel } = useMenuOutsidePress({ isOpen, triggerEl, panelEl, setOpen })

  watch(isOpen, async (open) => {
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
    selectOption,
    registerCommand,
    focusFirstOption,
    focusLastOption: focusOption('last'),
    focusNextOption: focusOption('next'),
    focusPrevOption: focusOption('prev'),
    focusTrigger,
    activeSub: level.activeSub,
    setActiveSub: level.setActiveSub,
    cancelSubClose: level.cancelSubClose,
    registerSubPanel
  }

  return { context, onPanelKeydown }
}
