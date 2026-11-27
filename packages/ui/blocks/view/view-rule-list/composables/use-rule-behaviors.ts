import { computed, type ComputedRef, reactive, watch } from 'vue'

import {
  behaviorAllowedIn,
  behaviorArgument,
  behaviorOptions,
  behaviorsFor,
  isTerminalBehavior,
  moveItem,
  type OptionSource,
  type RuleForm
} from '../lib/rule-builder'

/** One option of a behavior or argument select. */
export interface RuleBehaviorOption {
  /** The value. */
  value: string
  /** The label. */
  label: string
}

/** The behaviors list of the rule builder. */
export interface UseRuleBehaviorsReturn {
  /** The search text of each behavior select, by behavior id. */
  behaviorQuery: Record<number, string>
  /** The behaviors the search keeps for one select. */
  behaviorMatches: (id: number) => RuleBehaviorOption[]
  /** Clears a select's search when it closes. */
  onBehaviorPanel: (id: number, isOpen: boolean) => void
  /** The options of an argument source in the form's phase. */
  optionsFor: (source: OptionSource) => RuleBehaviorOption[]
  /** The label of an argument value. */
  optionLabelIn: (source: OptionSource, value: unknown) => string
  /** Changes a behavior's type and clears its arguments. */
  setBehaviorType: (index: number, type: string) => void
  /** Another behavior can be added. */
  canAddBehavior: ComputedRef<boolean>
  /** Adds a behavior at the end. */
  addBehavior: () => void
  /** Removes a behavior, never the last one. */
  removeBehavior: (index: number) => void
  /** Moves a behavior one step. */
  moveBehavior: (index: number, direction: number) => void
}

const keepInPhase = (form: RuleForm, phase: RuleForm['phase']) => {
  form.behaviors.forEach((behavior, index) => {
    if (!behaviorAllowedIn(behavior.type, phase)) {
      form.behaviors[index] = { id: behavior.id, type: 'deliver' }
      return
    }
    const argument = behaviorArgument(behavior.type)
    if (argument?.kind !== 'select') return
    const stillOffered = behaviorOptions(argument.source, phase).some(
      (option) => option.value === behavior[argument.field]
    )
    if (!stillOffered) behavior[argument.field] = ''
  })
}

export function useRuleBehaviors(
  form: RuleForm,
  newBehavior: () => RuleForm['behaviors'][number]
): UseRuleBehaviorsReturn {
  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )
  const behaviorQuery = reactive<Record<number, string>>({})
  const behaviorMatches = (id: number) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }

  const optionsFor = (source: OptionSource) => behaviorOptions(source, form.phase)

  watch(
    () => form.phase,
    (phase) => keepInPhase(form, phase)
  )

  return {
    behaviorQuery,
    behaviorMatches,
    onBehaviorPanel: (id, isOpen) => {
      if (!isOpen) behaviorQuery[id] = ''
    },
    optionsFor,
    optionLabelIn: (source, value) =>
      optionsFor(source).find((option) => option.value === value)?.label ?? '',
    setBehaviorType: (index, type) => {
      if (form.behaviors[index].type === type) return
      form.behaviors[index] = { id: form.behaviors[index].id, type }
    },
    canAddBehavior: computed(() => {
      if (form.behaviors.length >= 10) return false
      return !isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
    }),
    addBehavior: () => {
      form.behaviors.push(newBehavior())
    },
    removeBehavior: (index) => {
      if (form.behaviors.length <= 1) return
      form.behaviors.splice(index, 1)
    },
    moveBehavior: (index, direction) => moveItem(form.behaviors, index, direction)
  }
}
