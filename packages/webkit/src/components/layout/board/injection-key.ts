import type { InjectionKey, Ref } from 'vue'

export interface BoardLayoutItem {
  id: string
  span: number
  height?: number
}

export type BoardMoveDirection = 'up' | 'down' | 'left' | 'right'

export interface BoardMeasure {
  height: number
  columns: number
  columnWidth: number
}

export interface BoardContext {
  testId: string
  editing: Readonly<Ref<boolean>>
  columns: Readonly<Ref<number>>
  minSpan: Readonly<Ref<number>>
  maxSpan: Readonly<Ref<number>>
  minHeight: Readonly<Ref<number>>
  maxHeight: Readonly<Ref<number>>
  draggingId: Readonly<Ref<string | null>>
  entry: (id: string) => BoardLayoutItem | undefined
  registerLabel: (id: string, label: () => string) => () => void
  move: (id: string, direction: BoardMoveDirection) => void
  startDrag: (id: string) => void
  endDrag: () => void
  drop: (targetId: string) => void
  setSpan: (id: string, next: number) => void
  setHeight: (id: string, next: number | undefined) => void
  announceResize: (id: string) => void
}

export interface BoardItemContext {
  id: string
  editing: Readonly<Ref<boolean>>
  span: Readonly<Ref<number>>
  height: Readonly<Ref<number | undefined>>
  minSpan: Readonly<Ref<number>>
  maxSpan: Readonly<Ref<number>>
  minHeight: Readonly<Ref<number>>
  maxHeight: Readonly<Ref<number>>
  move: (event: KeyboardEvent, direction: BoardMoveDirection) => void
  dragStart: (event: DragEvent) => void
  dragEnd: (event: DragEvent) => void
  measure: () => BoardMeasure
  setSpan: (next: number) => void
  setHeight: (next: number | undefined) => void
  startResize: () => void
  endResize: () => void
}

export const BoardInjectionKey: InjectionKey<BoardContext> = Symbol('Board')

export const BoardItemInjectionKey: InjectionKey<BoardItemContext> = Symbol('BoardItem')
