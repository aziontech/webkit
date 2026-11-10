import { computed, type ComputedRef, inject, type MaybeRefOrGetter, toValue } from 'vue'

import { type FieldContext, fieldContextKey } from '../../components/inputs/field/injection-key'

export interface UseFieldControlOptions {
  id?: MaybeRefOrGetter<string | undefined>
  describedBy?: MaybeRefOrGetter<string | undefined>
  labelledBy?: MaybeRefOrGetter<string | undefined>
  invalid?: MaybeRefOrGetter<boolean | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  required?: MaybeRefOrGetter<boolean | undefined>
}

export interface UseFieldControlReturn {
  field: FieldContext | null
  controlId: ComputedRef<string | undefined>
  describedBy: ComputedRef<string | undefined>
  labelledBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  required: ComputedRef<boolean>
}

export function useFieldControl(options: UseFieldControlOptions = {}): UseFieldControlReturn {
  const field = inject(fieldContextKey, null)

  return {
    field,
    controlId: computed(() => toValue(options.id) || field?.controlId || undefined),
    describedBy: computed(
      () => toValue(options.describedBy) || field?.describedBy.value || undefined
    ),
    labelledBy: computed(() => toValue(options.labelledBy) || field?.labelledBy.value || undefined),
    invalid: computed(() => Boolean(toValue(options.invalid)) || Boolean(field?.invalid.value)),
    disabled: computed(() => Boolean(toValue(options.disabled)) || Boolean(field?.disabled.value)),
    required: computed(() => Boolean(toValue(options.required)) || Boolean(field?.required.value))
  }
}
