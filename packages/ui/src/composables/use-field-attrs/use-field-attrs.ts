import { computed, type ComputedRef, useAttrs } from 'vue'

import { useFieldControl, type UseFieldControlReturn } from '../use-field-control'

export interface UseFieldAttrsProps {
  /** The control's own invalid flag. */
  invalid?: boolean
  /** The control's own disabled flag. */
  disabled?: boolean
  /** The control's own required flag. */
  required?: boolean
}

export interface UseFieldAttrsReturn extends UseFieldControlReturn {
  /** The consumer attributes without `class` and `data-testid`, for the native control. */
  passthroughAttrs: ComputedRef<Record<string, unknown>>
  /** The disabled, required, aria-invalid and aria-required state of the native control, to bind before the passthrough attributes. */
  controlState: ComputedRef<UseFieldAttrsControlState>
}

/** The state attributes every native field control carries. */
export interface UseFieldAttrsControlState {
  disabled: boolean
  required: boolean
  'aria-invalid': true | undefined
  'aria-required': true | undefined
}

export function useFieldAttrs(props: UseFieldAttrsProps): UseFieldAttrsReturn {
  const attrs = useAttrs()
  const control = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  return {
    ...control,
    controlState: computed(() => ({
      disabled: control.disabled.value,
      required: control.required.value,
      'aria-invalid': control.invalid.value || undefined,
      'aria-required': control.required.value || undefined
    })),
    passthroughAttrs: computed(() => {
      const { class: _class, 'data-testid': _testId, ...rest } = attrs
      return rest
    })
  }
}
