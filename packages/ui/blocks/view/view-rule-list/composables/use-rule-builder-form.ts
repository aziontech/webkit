import { computed, type ComputedRef, nextTick, type Ref, ref, watch } from 'vue'

import {
  type ArgumentField,
  type Behavior,
  formIsValid,
  type RuleForm,
  type RuleSeed
} from '../lib/rule-builder'
import type { RuleListPhase } from '../view-rule-list.vue'

/** The rule builder form's validation and submit. */
export interface UseRuleBuilderFormReturn {
  /** The submit is in flight. */
  submitting: ComputedRef<boolean>
  /** The name is missing after a submit. */
  nameError: ComputedRef<boolean>
  /** The criteria errors per group and condition after a submit. */
  criteriaErrors: ComputedRef<Record<string, string>[][]>
  /** A required behavior argument is empty after a submit. */
  argumentMissing: (behavior: Behavior, field: ArgumentField) => boolean
  /** Validates, then saves after a short delay. */
  submit: () => void
}

/** What the form opens with. */
export interface RuleBuilderSeed {
  /** The drawer is open. */
  open: Ref<boolean>
  /** The rule being edited, or nothing for a new one. */
  seed: () => RuleSeed | null
  /** The phase a new rule starts in. */
  newPhase: () => RuleListPhase
  /** Builds the form for a seed. */
  formFor: (seed: RuleSeed | null) => RuleForm
}

const INVALID_FIELD =
  ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'

export function useRuleBuilderForm(
  form: RuleForm,
  { open, seed, newPhase, formFor }: RuleBuilderSeed,
  formEl: Ref<HTMLElement | null>,
  onDone: () => void
): UseRuleBuilderFormReturn {
  const submitted = ref(false)
  const submitting = ref(false)

  watch(
    open,
    (isOpen) => {
      if (!isOpen) return
      Object.assign(form, formFor(seed()))
      if (!seed()) form.phase = newPhase()
      submitted.value = false
    },
    { immediate: true }
  )

  const submit = () => {
    submitted.value = true
    if (submitting.value) return
    if (!formIsValid(form)) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>(INVALID_FIELD)?.focus())
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
      onDone()
    }, 900)
  }

  return {
    submitting: computed(() => submitting.value),
    nameError: computed(() => submitted.value && !form.name.trim()),
    criteriaErrors: computed(() =>
      submitted.value
        ? form.criteria.map((group) =>
            group.map((condition): Record<string, string> =>
              condition.variable.trim() ? {} : { variable: 'Enter the variable to compare.' }
            )
          )
        : []
    ),
    argumentMissing: (behavior, field) => submitted.value && !String(behavior[field] ?? '').trim(),
    submit
  }
}
