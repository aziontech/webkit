import { computed, type ComputedRef, type Ref, watch } from 'vue'

import type { CommandRegisteredItem } from '../injection-key'
import {
  arrangeRankedDom,
  cappedHints,
  type CommandDomSnapshot,
  type CommandGroupStats,
  type CommandHomeOrder,
  groupStatsOf,
  homeOrderOf,
  restoreDomOrder,
  sortVisibleItems
} from '../lib/command-order'

export interface UseCommandOrderReturn {
  ranking: ComputedRef<boolean>
  capped: ComputedRef<Set<string>>
  groupStats: ComputedRef<CommandGroupStats>
  visibleItems: ComputedRef<CommandRegisteredItem[]>
  navigableItems: ComputedRef<CommandRegisteredItem[]>
}

export function useCommandOrder(
  items: ComputedRef<CommandRegisteredItem[]>,
  query: Ref<string>
): UseCommandOrderReturn {
  let homeOrder: CommandHomeOrder = new Map()
  const domSnapshot: CommandDomSnapshot = new Map()

  const ranking = computed(() => query.value.trim().length > 0)
  const capped = computed(() => cappedHints(items.value, ranking.value, homeOrder))
  const groupStats = computed(() => groupStatsOf(items.value))
  const visibleItems = computed(() =>
    sortVisibleItems(
      items.value.filter((item) => item.isVisible.value),
      ranking.value,
      groupStats.value,
      homeOrder
    )
  )
  const navigableItems = computed(() => visibleItems.value.filter((item) => !item.disabled.value))

  watch(
    [visibleItems, ranking],
    ([visible, ranked]) => {
      if (ranked) {
        if (!domSnapshot.size) homeOrder = homeOrderOf(items.value)
        arrangeRankedDom(visible, domSnapshot)
      } else {
        restoreDomOrder(domSnapshot)
        homeOrder = homeOrderOf(items.value)
      }
    },
    { flush: 'post' }
  )

  return { ranking, capped, groupStats, visibleItems, navigableItems }
}
