import type { UseLocaleReturn } from '@aziontech/webkit/use-locale'

export const formatInvocationTime = (formatDate: UseLocaleReturn['formatDate'], value: Date) =>
  `${formatDate(value, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC'
  })} UTC`

export const formatInvocationDuration = (ms: number) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`
