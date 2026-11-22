import type { ComputedRef, InjectionKey, Slots } from 'vue'

import type { UseAttributeEditorDragReturn } from './composables/use-attribute-editor-drag'
import type { UseAttributeEditorRowsReturn } from './composables/use-attribute-editor-rows'
import type { AttributeEditorColumn, AttributeEditorRowErrors, AttributeEditorSize } from './types'

/** What the AttributeEditor root shares with the parts that render its rows. */
export interface AttributeEditorContext {
  testId: ComputedRef<string>
  slots: Slots
  props: { definition: AttributeEditorColumn[]; size: AttributeEditorSize; disabled: boolean }
  hintId: string
  groupCount: ComputedRef<number>
  rowErrors: (index: number, groupIndex: number | undefined) => AttributeEditorRowErrors
  position: (index: number, groupIndex: number | undefined) => number
  removeLabel: (position: number) => string
  update: (index: number, groupIndex: number | undefined, key: string, value: unknown) => void
  remove: (event: MouseEvent | KeyboardEvent, index: number, groupIndex?: number) => void
  move: UseAttributeEditorRowsReturn
  drag: UseAttributeEditorDragReturn
}

export const AttributeEditorInjectionKey: InjectionKey<AttributeEditorContext> =
  Symbol('AttributeEditor')
