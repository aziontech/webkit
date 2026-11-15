import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { ListboxFocusIntent } from '../../../composables/use-listbox-content'

export type MultiSelectSize = 'small' | 'medium' | 'large'

/** How the trigger shows the selection: joined labels or one removable chip per value. */
export type MultiSelectKind = 'summary' | 'chips'

export type MultiSelectCommitEvent = MouseEvent | KeyboardEvent

export interface MultiSelectContext {
  /** Stable id used to wire trigger `aria-controls` and content element id. */
  contentId: string
  /** Trigger element ref; the content reads it to anchor below. */
  triggerEl: Ref<globalThis.HTMLElement | null>
  /** Current open state. */
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  /** Current selection. Always an array. */
  modelValue: Ref<unknown[]>
  toggleValue: (value: unknown) => void
  isSelected: (value: unknown) => boolean
  /** Static state flags. */
  size: ComputedRef<MultiSelectSize>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  /** Id the enclosing Field assigns to the trigger. */
  controlId: ComputedRef<string | undefined>
  /** Description and error ids of the enclosing Field, for the trigger's aria-describedby. */
  describedBy: ComputedRef<string | undefined>
  /** Label ids of the enclosing Field; they name the list when the root has no aria-label. */
  labelledBy: ComputedRef<string | undefined>
  /** Where focus lands when the list opens: the selected option, the first, the last, or the first match of a typed character. */
  pendingFocus: Ref<ListboxFocusIntent>
  /** `aria-label` set on the root, forwarded to the trigger. */
  ariaLabel: ComputedRef<string | undefined>
  /** `aria-labelledby` set on the root, forwarded to the trigger. */
  ariaLabelledby: ComputedRef<string | undefined>
  placeholder: ComputedRef<string>
  /** Formats the selected values for the trigger label. */
  displayValue: ComputedRef<string>
  /** Whether the current selection is non-empty (drives data-filled). */
  filled: ComputedRef<boolean>
  /** Records the visible label of an option so the trigger can show labels, not values. */
  registerLabel: (value: unknown, label: string) => void
  /** Whether a selected value still has no recorded label, so the closed list renders its options once to read them. */
  labelsPending: ComputedRef<boolean>
  /** Recorded label of a value, or the value as text. */
  labelOf: (value: unknown) => string
  kind: ComputedRef<MultiSelectKind>
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
