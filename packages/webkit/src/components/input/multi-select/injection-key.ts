import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { SelectRootContext } from '../../../composables/use-select-root'

export type MultiSelectSize = 'small' | 'medium' | 'large'

/** How the trigger shows the selection: joined labels or one removable chip per value. */
export type MultiSelectVariant = 'summary' | 'chips'

export type MultiSelectCommitEvent = MouseEvent | KeyboardEvent

export interface MultiSelectContext extends SelectRootContext {
  /** Current selection. Always an array. */
  modelValue: Readonly<Ref<readonly unknown[]>>
  placeholder: ComputedRef<string>
  /** Recorded label of a value, or the value as text. */
  labelOf: (value: unknown) => string
  variant: ComputedRef<MultiSelectVariant>
  chipLimit: ComputedRef<number>
  searchable: ComputedRef<boolean>
  allowCustom: ComputedRef<boolean>
  loading: ComputedRef<boolean>
  error: ComputedRef<string>
  emptyTitle: ComputedRef<string>
  /** The typed text of a searchable trigger. */
  query: Ref<string>
  setQuery: (text: string) => void
  /** Whether an option label passes the typed filter. */
  matches: (label: string) => boolean
  /** Records a mounted option label so the panel can count visible options. */
  registerOption: (id: symbol, label: string) => void
  unregisterOption: (id: symbol) => void
  /** Mounted options whose label passes the typed filter. */
  visibleCount: ComputedRef<number>
  /** Whether the typed text should be offered as an Add row. */
  showCreate: ComputedRef<boolean>
  create: (event: MultiSelectCommitEvent) => void
  /** The control that holds focus for the trigger: the input when searchable, else the trigger button. */
  controlEl: Ref<globalThis.HTMLElement | null>
  focusControl: () => void
  /** Set by the content: moves focus into the list for an arrow, Home or End key. */
  navigate: Ref<((key: string) => void) | null>
}

export const MultiSelectInjectionKey: InjectionKey<MultiSelectContext> = Symbol('MultiSelect')

export interface MultiSelectGroupContext {
  /** Records whether one option of the group passes the typed filter. */
  register: (id: symbol, visible: ComputedRef<boolean>) => void
  unregister: (id: symbol) => void
}

export const MultiSelectGroupInjectionKey: InjectionKey<MultiSelectGroupContext> =
  Symbol('MultiSelectGroup')
