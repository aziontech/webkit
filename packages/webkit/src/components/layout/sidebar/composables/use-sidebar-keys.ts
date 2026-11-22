import {
  computed,
  type ComputedRef,
  onMounted,
  onScopeDispose,
  type Ref,
  type WritableComputedRef
} from 'vue'

import { type Direction, logicalArrowKey } from '../../../../composables/use-direction'
import { useElementListener } from '../../../../composables/use-element-listener'
import { SIDEBAR_NUDGE_STEP } from './use-sidebar-rail'

const isEditable = (target: EventTarget | null) => {
  if (!(target instanceof globalThis.HTMLElement)) return false
  if (target.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function useSidebarKeys(
  handleEl: Ref<globalThis.HTMLElement | null>,
  expandHandleEl: Ref<globalThis.HTMLElement | null>,
  shortcut: () => boolean,
  collapsed: WritableComputedRef<boolean>,
  dir: Readonly<Ref<Direction>>,
  nudge: (delta: number) => void,
  tapToExpand: () => void
): ComputedRef<string | undefined> {
  const shortcutActive = computed(shortcut)

  const onShortcut = (event: globalThis.KeyboardEvent) => {
    if (!shortcutActive.value || event.defaultPrevented) return
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
    if (event.key.toLowerCase() !== 'b' || isEditable(event.target)) return
    event.preventDefault()
    collapsed.value = !collapsed.value
  }

  onMounted(() => globalThis.document.addEventListener('keydown', onShortcut))

  onScopeDispose(() => globalThis.document?.removeEventListener('keydown', onShortcut))

  const keyShortcuts = computed(() => (shortcutActive.value ? 'Control+B Meta+B' : undefined))

  const onHandleKey = (event: globalThis.KeyboardEvent, expandOnly = false) => {
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') nudge(SIDEBAR_NUDGE_STEP)
    else if (key === 'ArrowLeft' && !expandOnly) nudge(-SIDEBAR_NUDGE_STEP)
    else return
    event.preventDefault()
  }

  useElementListener(handleEl, 'keydown', (event: globalThis.KeyboardEvent) => onHandleKey(event))
  useElementListener(handleEl, 'dblclick', () => {
    collapsed.value = true
  })
  useElementListener(expandHandleEl, 'keydown', (event: globalThis.KeyboardEvent) =>
    onHandleKey(event, true)
  )
  useElementListener(expandHandleEl, 'click', tapToExpand)

  return keyShortcuts
}
