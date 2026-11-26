import {
  computed,
  type ComputedRef,
  provide,
  type Ref,
  ref,
  shallowReactive,
  useAttrs,
  useId
} from 'vue'

import { FieldInjectionKey } from '../../components/input/field/injection-key'
import { useFieldControl } from '../use-field-control'
import type { ListboxFocusIntent } from '../use-listbox-content'

/** The state a select root owns whatever its selection holds, shared with its trigger, content and options. */
export interface SelectRootState {
  /** Stable id used to wire trigger `aria-controls` and content element id. */
  contentId: string
  /** Trigger element ref; the content reads it to anchor below. */
  triggerEl: Ref<globalThis.HTMLElement | null>
  /** Current open state. */
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  /** Whether the root is disabled or read-only, so the selection and the open state cannot change. */
  locked: () => boolean
  /** Static state flags. */
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
  /** The visible label each option recorded, by value. */
  labels: ReadonlyMap<unknown, string>
  /** Records the visible label of an option so the trigger can show labels, not values. */
  registerLabel: (value: unknown, label: string) => void
  /** The state the root and its trigger mirror as data attributes: open or closed, size, disabled, read-only, invalid and required. */
  stateAttrs: ComputedRef<Record<string, unknown>>
  /** The combobox attributes of the control that opens the list, given the attributes its own part received: its id, accessible name and state. */
  controlAttrs: (own: Record<string, unknown>) => Record<string, unknown>
  /** The root element's attributes: the consumer's without the accessible name, which goes to the trigger, plus the state attributes. */
  rootAttrs: ComputedRef<Record<string, unknown>>
}

/** The whole context of a select root: the shared state plus what depends on the shape of its selection. */
export interface SelectRootContext extends SelectRootState {
  toggleValue: (value: unknown) => void
  isSelected: (value: unknown) => boolean
  /** Trigger placeholder shown when no option is selected. */
  placeholder: ComputedRef<string | undefined>
  /** Formats the selected value(s) for the trigger label. */
  displayValue: ComputedRef<string>
  /** Whether the current selection is non-empty (drives data-filled). */
  filled: ComputedRef<boolean>
  /** True while a selected value has no recorded label yet, so the closed list renders its options once to read them. */
  labelsPending: ComputedRef<boolean>
}

export interface UseSelectRootProps {
  defaultOpen: boolean
  size: 'small' | 'medium' | 'large'
  disabled: boolean
  readonly: boolean
  required: boolean
  invalid: boolean
}

export function useSelectRoot(
  name: string,
  props: UseSelectRootProps,
  open: Ref<boolean | undefined>
): SelectRootState {
  const attrs = useAttrs()

  const control = useFieldControl(props)

  provide(FieldInjectionKey, null)

  const locked = (): boolean => control.disabled.value || props.readonly

  const labels = shallowReactive(new Map<unknown, string>())

  const contentId = `${name}-${useId()}`
  const isOpen = computed(() => open.value ?? props.defaultOpen)

  const stateAttrs = computed(() => ({
    'data-state': isOpen.value ? 'open' : 'closed',
    'data-size': props.size,
    'data-disabled': control.disabled.value || null,
    'data-readonly': props.readonly || null,
    'data-invalid': control.invalid.value || null,
    'data-required': control.required.value || null
  }))

  return {
    ...control,
    contentId,
    triggerEl: ref<globalThis.HTMLElement | null>(null),
    open: isOpen,
    setOpen: (value) => {
      if (!locked()) open.value = value
    },
    locked,
    readonly: computed(() => props.readonly),
    pendingFocus: ref<ListboxFocusIntent>(''),
    ariaLabel: computed(() => attrs['aria-label'] as string | undefined),
    ariaLabelledby: computed(() => attrs['aria-labelledby'] as string | undefined),
    labels,
    stateAttrs,
    controlAttrs: (own) => ({
      id: own['id'] ?? control.controlId.value ?? `${contentId}-trigger`,
      'aria-describedby': own['aria-describedby'] ?? control.describedBy.value,
      'aria-label': own['aria-label'] ?? attrs['aria-label'],
      'aria-labelledby': own['aria-labelledby'] ?? attrs['aria-labelledby'],
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen.value,
      'aria-controls': contentId,
      'aria-invalid': control.invalid.value || undefined,
      'aria-required': control.required.value || undefined,
      disabled: control.disabled.value
    }),
    registerLabel: (value, label) => {
      if (label && labels.get(value) !== label) labels.set(value, label)
    },
    rootAttrs: computed(() => {
      const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
      return { ...rest, ...stateAttrs.value }
    })
  }
}
