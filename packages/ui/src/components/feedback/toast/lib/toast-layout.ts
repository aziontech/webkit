import type { CSSProperties } from 'vue'

import type { ToastEntry, ToastPosition } from '../composables/use-toast-store'

export interface ToastView {
  entry: ToastEntry
  mounted: boolean
  removing: boolean
}

export interface ToastRegion {
  position: ToastPosition
  all: ToastView[]
  live: ToastView[]
}

interface ToastPlacement {
  translateY: number
  scale: number
  height: string
  overflow: string
}

const GAP = 14
const PEEK = 14

const POSITIONS: ToastPosition[] = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end'
]

const isTop = (position: ToastPosition) => position.startsWith('top')

const pixels = (height: number) => (height ? `${height}px` : 'auto')

export const toastRegions = (items: ToastView[], fallback: ToastPosition): ToastRegion[] => {
  const map = new Map<ToastPosition, ToastView[]>(POSITIONS.map((position) => [position, []]))
  items.forEach((item) => {
    const pos = item.entry.position ?? fallback
    const bucket = map.get(pos)
    if (bucket) bucket.push(item)
    else map.set(pos, [item])
  })
  return Array.from(map, ([position, all]) => ({
    position,
    all,
    live: all.filter((i) => !i.removing)
  }))
}

const stackHeight = (
  region: ToastRegion,
  heights: Record<string, number>,
  visible: number,
  expanded: boolean
): string => {
  const vis = region.live.slice(0, visible)
  if (!vis.length) return '0'
  if (expanded) {
    let total = (vis.length - 1) * GAP
    vis.forEach((i) => (total += heights[i.entry.id] ?? 0))
    return total ? `${total}px` : 'auto'
  }
  const frontHeight = heights[region.live[0]?.entry.id] ?? 0
  return `${frontHeight + Math.min(vis.length - 1, 2) * 12}px`
}

export const edgeInset = (edge: 'top' | 'bottom' | 'left' | 'right'): string =>
  `max(var(--spacing-md), env(safe-area-inset-${edge}))`

export const toastRegionStyle = (
  region: ToastRegion,
  heights: Record<string, number>,
  visible: number,
  expanded: boolean,
  rtl: boolean
): CSSProperties => {
  const pos = region.position
  const top = isTop(pos)
  const center = pos.endsWith('center')
  const leftSide = pos.endsWith(rtl ? 'end' : 'start')
  const rightSide = pos.endsWith(rtl ? 'start' : 'end')
  return {
    position: 'fixed',
    zIndex: '1100',
    width: '356px',
    maxWidth: 'calc(100vw - 2 * var(--spacing-md))',
    top: top ? edgeInset('top') : 'auto',
    bottom: top
      ? 'auto'
      : `calc(${edgeInset('bottom')} + var(--toast-offset-bottom, 0%) + var(--save-bar-height, 0%))`,
    left: center ? '50%' : leftSide ? edgeInset('left') : 'auto',
    right: rightSide ? edgeInset('right') : 'auto',
    transform: center ? 'translateX(-50%)' : 'none',
    height: stackHeight(region, heights, visible, expanded)
  }
}

const placement = (
  region: ToastRegion,
  li: number,
  heights: Record<string, number>,
  visible: number,
  expanded: boolean
): ToastPlacement => {
  const lift = isTop(region.position) ? 1 : -1
  if (li >= visible || (!expanded && li > 0)) {
    const behind = Math.min(li, visible)
    return {
      translateY: lift * PEEK * behind,
      scale: 1 - behind * 0.05,
      height: pixels(heights[region.live[0]?.entry.id] ?? 0),
      overflow: 'hidden'
    }
  }
  const before = expanded
    ? region.live.slice(0, li).reduce((sum, view) => sum + (heights[view.entry.id] ?? 0), 0)
    : 0
  return {
    translateY: expanded ? lift * (li * GAP + before) : 0,
    scale: 1,
    height: pixels(heights[region.live[li].entry.id] ?? 0),
    overflow: 'visible'
  }
}

export const toastItemStyle = (
  region: ToastRegion,
  item: ToastView,
  indexInAll: number,
  heights: Record<string, number>,
  visible: number,
  expanded: boolean
): CSSProperties => {
  const top = isTop(region.position)
  const base: CSSProperties = {
    position: 'absolute',
    left: '0',
    right: '0',
    top: top ? '0' : 'auto',
    bottom: top ? 'auto' : '0',
    width: '100%',
    zIndex: String(region.all.length - indexInAll),
    transformOrigin: top ? 'top center' : 'bottom center'
  }
  if (!item.mounted || item.removing) {
    return {
      ...base,
      transform: `translateY(${top ? '-100%' : '100%'}) scale(1)`,
      opacity: '0',
      pointerEvents: 'none'
    }
  }
  const li = region.live.indexOf(item)
  const hidden = li >= visible
  const { translateY, scale, height, overflow } = placement(region, li, heights, visible, expanded)
  return {
    ...base,
    transform: `translateY(${translateY}px) scale(${scale})`,
    height,
    overflow,
    opacity: hidden ? '0' : '1',
    pointerEvents: hidden ? 'none' : 'auto'
  }
}
