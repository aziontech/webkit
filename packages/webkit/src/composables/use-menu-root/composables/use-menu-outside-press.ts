import { onScopeDispose, type Ref, watch } from 'vue'

import { useOverlayLayer } from '../../use-overlay-layer'

export interface UseMenuOutsidePressOptions {
  isOpen: Readonly<Ref<boolean>>
  triggerEl: Ref<globalThis.HTMLElement | null>
  panelEl: Ref<globalThis.HTMLElement | null>
  setOpen: (value: boolean) => void
}

export interface UseMenuOutsidePressReturn {
  registerSubPanel: (panel: () => globalThis.HTMLElement | null) => () => void
}

export function useMenuOutsidePress({
  isOpen,
  triggerEl,
  panelEl,
  setOpen
}: UseMenuOutsidePressOptions): UseMenuOutsidePressReturn {
  const subPanels = new Set<() => globalThis.HTMLElement | null>()
  const { isInsideHigherLayer } = useOverlayLayer(isOpen, { element: panelEl })

  function isInsideMenu(target: globalThis.Node): boolean {
    if (triggerEl.value?.contains(target) || panelEl.value?.contains(target)) return true
    for (const panel of subPanels) if (panel()?.contains(target)) return true
    return isInsideHigherLayer(target)
  }

  function onDocumentMousedown(event: globalThis.MouseEvent): void {
    if (!isOpen.value) return
    const target = event.target as globalThis.Node | null
    if (target && !isInsideMenu(target)) setOpen(false)
  }

  function listen(active: boolean): void {
    if (active) globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    else globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  }

  if (isOpen.value) listen(true)
  watch(isOpen, listen)
  onScopeDispose(() => listen(false))

  function registerSubPanel(panel: () => globalThis.HTMLElement | null): () => void {
    subPanels.add(panel)
    return () => {
      subPanels.delete(panel)
    }
  }

  return { registerSubPanel }
}
