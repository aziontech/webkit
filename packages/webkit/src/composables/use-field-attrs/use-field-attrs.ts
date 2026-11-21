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
}

export function useFieldAttrs(props: UseFieldAttrsProps): UseFieldAttrsReturn {
  const attrs = useAttrs()

  return {
    ...useFieldControl({
      id: () => attrs['id'] as string | undefined,
      describedBy: () => attrs['aria-describedby'] as string | undefined,
      labelledBy: () => attrs['aria-labelledby'] as string | undefined,
      invalid: () => props.invalid,
      disabled: () => props.disabled,
      required: () => props.required
    }),
    passthroughAttrs: computed(() => {
      const { class: _class, 'data-testid': _testId, ...rest } = attrs
      return rest
    })
  }
}
