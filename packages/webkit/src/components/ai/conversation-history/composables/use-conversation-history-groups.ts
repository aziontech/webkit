import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import { type LazyChunk, useLazyChunks } from '../../../../composables/use-lazy-chunks'
import type { ConversationHistoryGroupBy, ConversationHistoryItem } from '../lib/types'
import { timeOf } from './use-conversation-history-projects'

export type ConversationHistoryGroupKey =
  'today' | 'yesterday' | 'previous7' | 'previous30' | 'older' | 'working' | 'settled'

export interface ConversationHistoryGroup {
  key: ConversationHistoryGroupKey
  count: number
  chunks: LazyChunk<ConversationHistoryItem>[]
}

export interface UseConversationHistoryGroupsReturn {
  groups: ComputedRef<ConversationHistoryGroup[]>
  observe: (key: ConversationHistoryGroupKey, el: unknown, index: number) => void
}

const ORDER: ConversationHistoryGroupKey[] = [
  'today',
  'yesterday',
  'previous7',
  'previous30',
  'older',
  'working',
  'settled'
]
const DAY = 86_400_000

const startOfDay = (time: number): number => {
  const date = new Date(time)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export const groupOf = (time: number, today: number): ConversationHistoryGroupKey => {
  const days = Math.round((today - startOfDay(time)) / DAY)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return 'previous7'
  if (days < 30) return 'previous30'
  return 'older'
}

export function useConversationHistoryGroups(
  items: MaybeRefOrGetter<readonly ConversationHistoryItem[]>,
  now: MaybeRefOrGetter<string | number | Date>,
  groupBy: MaybeRefOrGetter<ConversationHistoryGroupBy> = 'date',
  archived: MaybeRefOrGetter<readonly ConversationHistoryItem[]> = []
): UseConversationHistoryGroupsReturn {
  const lazy = Object.fromEntries(
    ORDER.map((key) => [key, useLazyChunks({ rowHeight: 44 })])
  ) as Record<ConversationHistoryGroupKey, ReturnType<typeof useLazyChunks>>

  const keyOf = (item: ConversationHistoryItem, today: number): ConversationHistoryGroupKey => {
    if (toValue(groupBy) === 'date') return groupOf(timeOf(item), today)
    return item.status === 'running' && !item.archived ? 'working' : 'settled'
  }

  const groups = computed<ConversationHistoryGroup[]>(() => {
    const today = startOfDay(new Date(toValue(now)).getTime())
    const byStatus = toValue(groupBy) === 'status'
    const buckets = new Map<
      ConversationHistoryGroupKey,
      { item: ConversationHistoryItem; time: number }[]
    >()
    const all = byStatus ? [...toValue(items), ...toValue(archived)] : toValue(items)
    for (const item of all) {
      const key = keyOf(item, today)
      const bucket = buckets.get(key) ?? []
      bucket.push({ item, time: timeOf(item) })
      buckets.set(key, bucket)
    }
    return ORDER.filter((key) => buckets.has(key)).map((key) => {
      const sorted = buckets
        .get(key)!
        .sort((a, b) => b.time - a.time)
        .map(({ item }) => item)
      return { key, count: sorted.length, chunks: lazy[key].split(sorted) }
    })
  })

  const observe = (key: ConversationHistoryGroupKey, el: unknown, index: number) =>
    lazy[key].observe(el, index)

  return { groups, observe }
}
