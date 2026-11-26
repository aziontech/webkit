import {
  computed,
  type ComputedRef,
  nextTick,
  onScopeDispose,
  type Ref,
  ref,
  shallowRef
} from 'vue'

import type { SidebarMenuLevel, SidebarMenuMotion } from '../injection-key'
import { MENU_LEVEL_EXIT_MS } from '../presets/transitions'

export interface UseSidebarMenuLevelsReturn {
  levels: ComputedRef<SidebarMenuLevel[]>
  motion: ComputedRef<SidebarMenuMotion>
  isCurrentLevel: (id: string) => boolean
  isLevelMounted: (id: string) => boolean
  registerLevel: (id: string, label: string, trigger: globalThis.HTMLElement | null) => void
  push: (level: SidebarMenuLevel, trigger: globalThis.HTMLElement | null) => void
  pop: () => void
  setBackElement: (el: globalThis.HTMLElement | null) => void
  playEnter: () => void
}

export function useSidebarMenuLevels(path: Ref<string[]>): UseSidebarMenuLevelsReturn {
  const labels = ref<Record<string, string>>({})
  const triggers = new Map<string, globalThis.HTMLElement | null>()
  const backEl = shallowRef<globalThis.HTMLElement | null>(null)
  const motion = ref<SidebarMenuMotion>('none')
  const leaving = ref<string[]>([])
  let motionTimer: ReturnType<typeof globalThis.setTimeout> | undefined
  const start = (next: SidebarMenuMotion) => {
    motion.value = next
    if (motionTimer !== undefined) globalThis.clearTimeout(motionTimer)
    motionTimer = globalThis.setTimeout(() => {
      motion.value = 'none'
      leaving.value = []
      motionTimer = undefined
    }, MENU_LEVEL_EXIT_MS)
  }
  onScopeDispose(() => {
    if (motionTimer !== undefined) globalThis.clearTimeout(motionTimer)
  })

  const push = (level: SidebarMenuLevel, trigger: globalThis.HTMLElement | null) => {
    if (path.value.includes(level.id)) return
    labels.value = { ...labels.value, [level.id]: level.label }
    triggers.set(level.id, trigger)
    path.value = [...path.value, level.id]
    start('push')
    nextTick(() => backEl.value?.focus())
  }

  const pop = () => {
    const current = path.value[path.value.length - 1]
    if (current === undefined) return
    const trigger = triggers.get(current) ?? null
    triggers.delete(current)
    path.value = path.value.slice(0, -1)
    leaving.value = [...leaving.value, current]
    start('pop')
    nextTick(() => trigger?.focus())
  }

  return {
    levels: computed(() => path.value.map((id) => ({ id, label: labels.value[id] ?? '' }))),
    motion: computed(() => motion.value),
    isCurrentLevel: (id) => path.value.length > 0 && path.value[path.value.length - 1] === id,
    isLevelMounted: (id) => path.value.includes(id) || leaving.value.includes(id),
    registerLevel: (id, label, trigger) => {
      triggers.set(id, trigger)
      if (label && labels.value[id] !== label) labels.value = { ...labels.value, [id]: label }
    },
    push,
    pop,
    setBackElement: (el) => {
      backEl.value = el
    },
    playEnter: () => start(path.value.length > 0 ? 'push' : 'pop')
  }
}
