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
    format = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    dayFormats.set(key, format)
  }
  return Date.parse(format.format(time)) / DAY
}

const MINUTE = 60_000

const dayStarts = new Map<string, number[]>()

const startsOf = (current: number, timeZone?: string): number[] => {
  const key = `${timeZone ?? ''}|${current}`
  const cached = dayStarts.get(key)
  if (cached) return cached
  const starts = [0, 1, 6, 29].map((back) => {
    const day = current - back
    let low = day * 1440 - 900
    let high = day * 1440 + 900
    while (low < high) {
      const mid = Math.floor((low + high) / 2)
      if (dayIndex(mid * MINUTE, timeZone) >= day) high = mid
      else low = mid + 1
    }
    return low * MINUTE
  })
  if (dayStarts.size >= 16) dayStarts.clear()
  dayStarts.set(key, starts)
  return starts
}

const groupClassifier = (
  today: number,
  timeZone?: string
): ((time: number) => ConversationHistoryGroupKey) => {
  const starts = startsOf(dayIndex(today, timeZone), timeZone)
  return (time) => ORDER[starts.findIndex((start) => time >= start)] ?? 'older'
}

export const groupOf = (
  time: number,
  today: number,
  timeZone?: string
): ConversationHistoryGroupKey => groupClassifier(today, timeZone)(time)

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

  const groups = computed<ConversationHistoryGroup[]>(() => {
    const today = new Date(toValue(now)).getTime()
    const byStatus = toValue(groupBy) === 'status'
    const buckets = new Map<
      ConversationHistoryGroupKey,
      { item: ConversationHistoryItem; time: number }[]
    >()
    const all = byStatus ? [...toValue(items), ...toValue(archived)] : toValue(items)
    const byDate = byStatus ? null : groupClassifier(today, zone())
    for (const item of all) {
      const time = timeOf(item)
      const key = byDate
        ? byDate(time)
        : item.status === 'running' && !item.archived
          ? 'working'
          : 'settled'
      const bucket = buckets.get(key) ?? []
      bucket.push({ item, time })
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
