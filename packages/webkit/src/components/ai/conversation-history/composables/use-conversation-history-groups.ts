import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import { type LazyChunk, useLazyChunks } from '../../../../composables/use-lazy-chunks'
import type { ConversationHistoryItem } from '../conversation-history.vue'
import { timeOf } from './use-conversation-history-projects'

export type ConversationHistoryGroupKey =
  'today' | 'yesterday' | 'previous7' | 'previous30' | 'older'

export interface ConversationHistoryGroup {
  key: ConversationHistoryGroupKey
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
  'older'
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
  now: MaybeRefOrGetter<string | number | Date>
): UseConversationHistoryGroupsReturn {
  const lazy = Object.fromEntries(
    ORDER.map((key) => [key, useLazyChunks({ rowHeight: 32 })])
  ) as Record<ConversationHistoryGroupKey, ReturnType<typeof useLazyChunks>>

  const groups = computed<ConversationHistoryGroup[]>(() => {
    const today = startOfDay(new Date(toValue(now)).getTime())
    const buckets = new Map<
      ConversationHistoryGroupKey,
      { item: ConversationHistoryItem; time: number }[]
    >()
    for (const item of toValue(items)) {
      const time = timeOf(item)
      const key = groupOf(time, today)
      const bucket = buckets.get(key) ?? []
      bucket.push({ item, time })
      buckets.set(key, bucket)
    }
    return ORDER.filter((key) => buckets.has(key)).map((key) => ({
      key,
      chunks: lazy[key].split(
        buckets
          .get(key)!
          .sort((a, b) => b.time - a.time)
          .map(({ item }) => item)
      )
    }))
  })

  const observe = (key: ConversationHistoryGroupKey, el: unknown, index: number) =>
    lazy[key].observe(el, index)

  return { groups, observe }
}
