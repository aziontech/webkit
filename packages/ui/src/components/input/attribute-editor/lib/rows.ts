import { toRaw } from 'vue'

import type { AttributeEditorRowErrors, AttributeEditorSize } from '../types'

export type AttributeEditorFit = 'md' | 'xl' | '3xl'

export interface AttributeEditorKeys {
  keyOf: (target: object, prefix: string) => string
  keep: (target: object, source: object) => void
  clone: <T>(groups: T[][]) => T[][]
}

export const createRowKeys = (baseId: string): AttributeEditorKeys => {
  const rowKeys = new WeakMap<object, string>()
  let nextKey = 0
  const keyOf = (target: object, prefix: string) => {
    const raw = toRaw(target)
    let key = rowKeys.get(raw)
    if (!key) {
      nextKey += 1
      key = `${baseId}-${prefix}-${nextKey}`
      rowKeys.set(raw, key)
    }
    return key
  }
  return {
    keyOf,
    keep: (target, source) => rowKeys.set(target, keyOf(source, 'row')),
    clone: (groups) =>
      groups.map((group) => {
        const copy = [...group]
        rowKeys.set(copy, keyOf(group, 'group'))
        return copy
      })
  }
}

export const rowErrorsAt = (
  errors: unknown[],
  index: number,
  groupIndex: number | undefined
): AttributeEditorRowErrors => {
  const entry =
    groupIndex === undefined ? errors[index] : (errors[groupIndex] as unknown[])?.[index]
  return entry && typeof entry === 'object' && !Array.isArray(entry)
    ? (entry as AttributeEditorRowErrors)
    : {}
}

export const positionIn = (
  groups: unknown[][],
  index: number,
  groupIndex: number | undefined
): number => {
  if (groupIndex === undefined) return index + 1
  return groups.slice(0, groupIndex).reduce((sum, group) => sum + group.length, 0) + index + 1
}

export const fitOf = (
  columns: number,
  actions: number,
  size: AttributeEditorSize
): AttributeEditorFit => {
  const control = size === 'small' ? 28 : size === 'medium' ? 32 : 40
  const row = columns * 140 + actions * control + (actions - 1) * 4
  if (row <= 472) return 'md'
  return row <= 644 ? 'xl' : '3xl'
}

export const rowSelector = (index: number, groupIndex: number | undefined): string =>
  groupIndex === undefined
    ? `[data-row="${index}"]:not([data-group])`
    : `[data-group="${groupIndex}"][data-row="${index}"]`

export const removeFrom = <T>(
  groups: T[][],
  target: number,
  index: number,
  grouped: boolean
): { next: T[][]; focus: string } => {
  let next = groups
  next[target]?.splice(index, 1)
  const left = next[target]?.length ?? 0
  let focusGroup: number | undefined = grouped ? target : undefined
  let focusIndex = index
  if (grouped && left === 0) {
    next = next.filter((_, i) => i !== target)
    focusGroup = Math.min(target, next.length - 1)
    focusIndex = 0
  } else if (focusIndex >= left) {
    focusIndex = left - 1
  }
  const none = focusIndex < 0 || (focusGroup !== undefined && focusGroup < 0)
  return { next, focus: none ? '[data-none]' : rowSelector(focusIndex, focusGroup) }
}

export const moveWithin = <T>(list: T[], from: number, to: number): void => {
  list.splice(to, 0, ...list.splice(from, 1))
}

const rowAt = (
  event: Event,
  root: HTMLElement | null,
  grouped: boolean
): { el: HTMLElement; index: number; groupIndex: number | undefined } | null => {
  let el =
    event.target instanceof Element ? event.target.closest<HTMLElement>('li[data-row]') : null
  while (el && el.closest('[data-fit]') !== root) {
    el = el.parentElement?.closest<HTMLElement>('li[data-row]') ?? null
  }
  if (!el) return null
  return {
    el,
    index: Number(el.dataset['row']),
    groupIndex: grouped ? Number(el.dataset['group']) : undefined
  }
}

export const rowItemAt = <T extends object>(
  event: Event,
  root: HTMLElement | null,
  groups: T[][],
  grouped: boolean,
  keyOf: (item: T) => string
): { el: HTMLElement; index: number; groupIndex: number | undefined; key: string } | null => {
  const at = rowAt(event, root, grouped)
  const item = at && groups[at.groupIndex ?? 0]?.[at.index]
  return at && item ? { ...at, key: keyOf(item) } : null
}
