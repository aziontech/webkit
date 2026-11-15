import { computed, type ComputedRef, inject, type MaybeRefOrGetter, toValue } from 'vue'

import { type FieldContext, FieldInjectionKey } from '../../components/input/field/injection-key'

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
  const field = inject(FieldInjectionKey, null)

  return {
    field,
    controlId: computed(() => toValue(options.id) || field?.controlId || undefined),
    describedBy: computed(() => {
      const ids = `${toValue(options.describedBy) ?? ''} ${field?.describedBy.value ?? ''}`
        .split(/\s+/)
        .filter(Boolean)
      return [...new Set(ids)].join(' ') || undefined
    }),
    labelledBy: computed(() => toValue(options.labelledBy) || field?.labelledBy.value || undefined),
    invalid: computed(() => Boolean(toValue(options.invalid)) || Boolean(field?.invalid.value)),
    disabled: computed(() => Boolean(toValue(options.disabled)) || Boolean(field?.disabled.value)),
    required: computed(() => Boolean(toValue(options.required)) || Boolean(field?.required.value))
  }
}
