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

export const formatInvocationDuration = (
  formatNumber: UseLocaleReturn['formatNumber'],
  ms: number
) =>
  ms >= 1000
    ? `${formatNumber(ms / 1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s`
    : `${Math.round(ms)} ms`
