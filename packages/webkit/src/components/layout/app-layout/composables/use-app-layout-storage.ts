import { onMounted, type Ref, watch } from 'vue'

import type { AppLayoutSplitPanelPosition } from '../app-layout.vue'

interface Stored {
  navigationOpen?: boolean
  toolsOpen?: boolean
  splitPanelPosition?: AppLayoutSplitPanelPosition
  splitPanelSize?: number
}

const readStored = (storageKey: string): Stored | null => {
  if (!storageKey) return null
  try {
    const raw = globalThis.localStorage?.getItem(storageKey)
    return raw ? (JSON.parse(raw) as Stored) : null
  } catch {
    return null
  }
}

export function useAppLayoutStorage(
  storageKey: () => string,
  navigationOpen: Ref<boolean>,
  toolsOpen: Ref<boolean>,
  splitPosition: Ref<AppLayoutSplitPanelPosition>,
  splitSize: Ref<number>
): void {
  onMounted(() => {
    const stored = readStored(storageKey())
    if (!stored) return
    if (typeof stored.navigationOpen === 'boolean') navigationOpen.value = stored.navigationOpen
    if (typeof stored.toolsOpen === 'boolean') toolsOpen.value = stored.toolsOpen
    if (stored.splitPanelPosition === 'bottom' || stored.splitPanelPosition === 'side')
      splitPosition.value = stored.splitPanelPosition
    if (typeof stored.splitPanelSize === 'number' && Number.isFinite(stored.splitPanelSize))
      splitSize.value = stored.splitPanelSize
  })

  watch(
    () => [navigationOpen.value, toolsOpen.value, splitPosition.value, splitSize.value],
    () => {
      const key = storageKey()
      if (!key) return
      try {
        globalThis.localStorage?.setItem(
          key,
          JSON.stringify({
            navigationOpen: navigationOpen.value,
            toolsOpen: toolsOpen.value,
            splitPanelPosition: splitPosition.value,
            splitPanelSize: splitSize.value
          } satisfies Stored)
        )
      } catch {
        return
      }
    }
  )
}
