import type { InjectionKey, Ref } from 'vue'

export interface DashboardGridLayoutItem {
  id: string
  span: number
  height?: number
}

export type DashboardGridMoveDirection = 'up' | 'down' | 'left' | 'right'

export interface DashboardGridMeasure {
  height: number
  columns: number
  columnWidth: number
}

export interface DashboardGridContext {
  testId: string
  editing: Readonly<Ref<boolean>>
  columns: Readonly<Ref<number>>
  minSpan: Readonly<Ref<number>>
  maxSpan: Readonly<Ref<number>>
  minHeight: Readonly<Ref<number>>
  maxHeight: Readonly<Ref<number>>
  draggingId: Readonly<Ref<string | null>>
  entry: (id: string) => DashboardGridLayoutItem | undefined
  registerLabel: (id: string, label: () => string) => () => void
  move: (event: KeyboardEvent, id: string, direction: DashboardGridMoveDirection) => void
  startDrag: (id: string) => void
  endDrag: () => void
  drop: (event: DragEvent, targetId: string) => void
  setSpan: (id: string, next: number) => void
  setHeight: (id: string, next: number | undefined) => void
  announceResize: (event: PointerEvent | KeyboardEvent, id: string) => void
}

export interface DashboardGridItemContext {
  id: string
  editing: Readonly<Ref<boolean>>
  span: Readonly<Ref<number>>
  height: Readonly<Ref<number | undefined>>
  minSpan: Readonly<Ref<number>>
  maxSpan: Readonly<Ref<number>>
  minHeight: Readonly<Ref<number>>
  maxHeight: Readonly<Ref<number>>
  move: (event: KeyboardEvent, direction: DashboardGridMoveDirection) => void
  dragStart: (event: DragEvent) => void
  dragEnd: (event: DragEvent) => void
  measure: () => DashboardGridMeasure
  setSpan: (next: number) => void
  setHeight: (next: number | undefined) => void
  startResize: () => void
  endResize: (event: PointerEvent | KeyboardEvent) => void
}

export const DashboardGridInjectionKey: InjectionKey<DashboardGridContext> = Symbol('DashboardGrid')

export const DashboardGridItemInjectionKey: InjectionKey<DashboardGridItemContext> =
  Symbol('DashboardGridItem')
