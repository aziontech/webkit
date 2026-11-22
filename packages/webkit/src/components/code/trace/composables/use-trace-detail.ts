import { computed, type ComputedRef, type Ref } from 'vue'

import type { MessageKey, MessageParams } from '../../../../i18n/types'
import { selfTimeOf, type TraceChildren } from '../lib/trace-model'
import type { TraceRange, TraceSpan } from '../types'

export interface UseTraceDetailOptions {
  detail: Readonly<Ref<TraceSpan | null>>
  children: Readonly<Ref<TraceChildren>>
  criticalPath: Readonly<Ref<Map<string, TraceRange[]>>>
  total: Readonly<Ref<number>>
  t: (key: MessageKey, params?: MessageParams) => string
  format: (ms: number) => string
}

export interface UseTraceDetailReturn {
  detailFacts: ComputedRef<{ label: string; value: string }[]>
  detailEvents: ComputedRef<{ key: string; time: string; name: string }[]>
  detailAttributes: ComputedRef<{ key: string; value: string }[]>
}

export function useTraceDetail(options: UseTraceDetailOptions): UseTraceDetailReturn {
  const { detail, t, format } = options
  const detailFacts = computed(() => {
    const span = detail.value
    if (!span) return []
    const facts = [
      { label: t('trace.startedAt'), value: `+${format(span.start)}` },
      { label: t('trace.duration'), value: format(span.duration) },
      {
        label: t('trace.share'),
        value: t('trace.percent', {
          value: Math.round((span.duration / options.total.value) * 100)
        })
      }
    ]
    const self = selfTimeOf(span, options.children.value)
    if (self !== null) facts.splice(2, 0, { label: t('trace.selfTime'), value: format(self) })
    const stretches = options.criticalPath.value.get(span.id)
    if (stretches) {
      const onPath = stretches.reduce((sum, [a, b]) => sum + b - a, 0)
      facts.push({ label: t('trace.onCriticalPath'), value: format(onPath) })
    }
    if (span.service) facts.unshift({ label: t('trace.service'), value: span.service })
    return facts
  })
  return {
    detailFacts,
    detailEvents: computed(() =>
      [...(detail.value?.events ?? [])]
        .sort((a, b) => a.at - b.at)
        .map((event, order) => ({
          key: `${order}`,
          time: `+${format(event.at)}`,
          name: event.name
        }))
    ),
    detailAttributes: computed(() =>
      Object.entries(detail.value?.attributes ?? {}).map(([key, value]) => ({
        key,
        value: String(value)
      }))
    )
  }
}
