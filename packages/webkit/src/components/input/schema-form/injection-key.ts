import type { ComputedRef, InjectionKey, Slots } from 'vue'

import type { SchemaFormNode, SchemaFormOption } from './schema'

/** One `ui[path].options` field's loaded choices. */
export interface SchemaFormOptionState {
  options: SchemaFormOption[]
  loading: boolean
  failed: boolean
  request: number
}

/** One key and value row of a map field. */
export type SchemaFormMapRow = { key: string; value: string }

/** What the SchemaForm root shares with the parts that render its fields. */
export interface SchemaFormContext {
  testId: ComputedRef<string>
  slots: Slots
  valueAt: (path: string) => unknown
  setValue: (node: SchemaFormNode, next: unknown) => void
  setDraft: (node: SchemaFormNode, text: string, parsed: unknown) => void
  draftOf: (path: string) => string | undefined
  errorOf: (node: SchemaFormNode) => string
  isDisabled: (node: SchemaFormNode) => boolean
  isReadonly: (node: SchemaFormNode) => boolean
  onFocusout: (node: SchemaFormNode, event: globalThis.FocusEvent) => void
  openSections: Set<string>
  optionStates: Map<string, SchemaFormOptionState>
  searchOptions: (node: SchemaFormNode, query: string) => void
  tokensOf: (node: SchemaFormNode) => object[]
  setRepeat: (node: SchemaFormNode, next: object[]) => void
  mapRowsOf: (node: SchemaFormNode) => SchemaFormMapRow[]
  setMap: (node: SchemaFormNode, rows: SchemaFormMapRow[]) => void
  duplicateRows: (node: SchemaFormNode) => boolean[]
}

export const SchemaFormInjectionKey: InjectionKey<SchemaFormContext> = Symbol('SchemaForm')
