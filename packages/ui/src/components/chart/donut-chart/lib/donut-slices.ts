import { duration } from '@aziontech/theme/animations'

import type { NormalizedSeries } from '../../lib'

export const RADIUS = { donut: 40, pie: 25 } as const
export const WIDTH = { donut: 14, pie: 50 } as const
export const LIFT = { donut: 4, pie: 0 } as const
const GAP = 0.6

export interface DonutSlice {
  id: string
  color: NormalizedSeries['color']
  dash: string
  offset: number
  delay: string
  entry: NormalizedSeries
}

export function donutSlices(visible: readonly NormalizedSeries[], total: number): DonutSlice[] {
  let start = 0
  const gap = visible.length > 1 ? GAP : 0
  return visible.map((entry, order) => {
    const share = total ? (entry.total / total) * 100 : 0
    const length = Math.max(0, share - gap)
    const slice = {
      id: entry.id,
      color: entry.color,
      dash: `${length} ${100 - length}`,
      offset: -start,
      delay: `calc(${duration['fast-02']} * ${order})`,
      entry
    }
    start += share
    return slice
  })
}
