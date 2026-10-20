import type { InjectionKey, Ref } from 'vue'

export type ChartCardMoveDirection = 'up' | 'down' | 'left' | 'right'

export interface ChartCardMeasure {
  height: number
  columns: number
  columnWidth: number
}

export interface ChartCardContext {
  testId: string
  titleId: string
  descriptionId: string
  hasTitle: Readonly<Ref<boolean>>
  hasDescription: Readonly<Ref<boolean>>
  draggable: Readonly<Ref<boolean>>
  resizable: Readonly<Ref<boolean>>
  span: Readonly<Ref<number>>
  height: Readonly<Ref<number | undefined>>
  minSpan: Readonly<Ref<number>>
  maxSpan: Readonly<Ref<number>>
  minHeight: Readonly<Ref<number>>
  maxHeight: Readonly<Ref<number>>
  registerTitle: () => () => void
  registerDescription: () => () => void
  armDrag: () => void
  disarmDrag: () => void
  move: (event: KeyboardEvent, direction: ChartCardMoveDirection) => void
  measure: () => ChartCardMeasure
  setSpan: (next: number) => void
  setHeight: (next: number | undefined) => void
  startResize: (event: PointerEvent) => void
  endResize: (event: PointerEvent | KeyboardEvent) => void
}

export const ChartCardInjectionKey: InjectionKey<ChartCardContext> = Symbol('ChartCard')
