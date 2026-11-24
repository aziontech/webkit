import { computed, type ComputedRef, type MaybeRefOrGetter, onMounted, ref, toValue } from 'vue'

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

const dayFormats = new Map<string, Intl.DateTimeFormat>()

const dayIndex = (time: number, timeZone?: string): number => {
  const key = timeZone ?? ''
  let format = dayFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
    dayFormats.set(key, format)
  }
  const part = (type: string): number =>
    Number(format.formatToParts(time).find((item) => item.type === type)?.value)
  return Math.round(Date.UTC(part('year'), part('month') - 1, part('day')) / DAY)
}

export const groupOf = (
  time: number,
  today: number,
  timeZone?: string
): ConversationHistoryGroupKey => {
  const days = dayIndex(today, timeZone) - dayIndex(time, timeZone)
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
  archived: MaybeRefOrGetter<readonly ConversationHistoryItem[]> = [],
  timeZone: MaybeRefOrGetter<string | undefined> = undefined
): UseConversationHistoryGroupsReturn {
  const lazy = Object.fromEntries(
    ORDER.map((key) => [key, useLazyChunks({ rowHeight: 44 })])
  ) as Record<ConversationHistoryGroupKey, ReturnType<typeof useLazyChunks>>
  const mounted = ref<boolean>(false)
  onMounted(() => {
    mounted.value = true
  })
  const zone = (): string | undefined => toValue(timeZone) || (mounted.value ? undefined : 'UTC')

  const keyOf = (item: ConversationHistoryItem, today: number): ConversationHistoryGroupKey => {
    if (toValue(groupBy) === 'date') return groupOf(timeOf(item), today, zone())
    return item.status === 'running' && !item.archived ? 'working' : 'settled'
  }

  const groups = computed<ConversationHistoryGroup[]>(() => {
    const today = new Date(toValue(now)).getTime()
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
