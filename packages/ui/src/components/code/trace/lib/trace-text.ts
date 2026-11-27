import type { MessageKey, MessageParams } from '../../../../i18n/types'
import type { TracePlaced, TraceRange, TraceSpanStatus } from '../types'

type Translate = (key: MessageKey, params?: MessageParams) => string

export function axisTicks(win: TraceRange, format: (ms: number) => string) {
  return [0, 0.25, 0.5, 0.75, 1].map((at) => ({
    at,
    edge: at === 0 ? 'start' : at === 1 ? 'end' : null,
    density: at === 0.5 ? 'mid' : at === 0.25 || at === 0.75 ? 'quarter' : null,
    label: format(win[0] + (win[1] - win[0]) * at)
  }))
}

const statusLabel = (t: Translate, status?: TraceSpanStatus): string => {
  if (status === 'error') return t('trace.failed')
  if (status === 'running') return t('trace.running')
  return ''
}

export function spanLabel(
  row: TracePlaced,
  slowestId: string,
  t: Translate,
  format: (ms: number) => string
): string {
  const { span } = row
  return [
    span.name,
    span.service ?? '',
    `+${format(span.start)}`,
    format(span.duration),
    statusLabel(t, span.status),
    span.id === slowestId ? t('trace.slowest') : '',
    row.critical ? t('trace.criticalPath') : '',
    span.events?.length ? t('trace.eventCount', { count: span.events.length }) : ''
  ]
    .filter(Boolean)
    .join(', ')
}
