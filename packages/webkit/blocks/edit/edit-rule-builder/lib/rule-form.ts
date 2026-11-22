import type { RuleBuilderRule } from '../edit-rule-builder.vue'
import { type Condition, PHASES, type RuleBehavior } from './rule-behavior-data'
import { behaviorArgument } from './rule-catalog'

export type RuleForm = {
  name: string
  description: string
  phase: string
  criteria: Condition[][]
  behaviors: RuleBehavior[]
  active: boolean
}

export const criteriaColumns = [
  { key: 'variable', label: 'Variable', required: true },
  { key: 'operator', label: 'Operator' },
  { key: 'argument', label: 'Argument' }
]

export const behaviorColumns = [
  { key: 'type', label: 'Behavior', required: true },
  { key: 'argument', label: 'Argument' }
]

export const createIds = () => {
  let nextId = 0
  const uid = () => String((nextId += 1))
  const newCondition = (): Condition => ({
    variable: '',
    id: uid(),
    operator: 'is-equal',
    argument: ''
  })
  const newBehavior = (): RuleBehavior => ({ type: 'deliver', id: uid() })
  const blankForm = (): RuleForm => ({
    name: '',
    description: '',
    phase: PHASES[0].value,
    criteria: [[newCondition()]],
    behaviors: [newBehavior()],
    active: true
  })
  const formFor = (seed: RuleBuilderRule | null): RuleForm =>
    !seed
      ? blankForm()
      : {
          name: seed.name,
          description: seed.description,
          phase: seed.phase,
          criteria: seed.criteria.map((group) =>
            group.map((condition) => ({ ...condition, id: uid() }))
          ),
          behaviors: seed.behaviors.map((behavior) => ({ ...behavior, id: uid() })),
          active: seed.active
        }
  return { newCondition, newBehavior, blankForm, formFor }
}

export const valuesOf = (form: RuleForm): RuleBuilderRule => ({
  name: form.name.trim(),
  description: form.description,
  phase: form.phase,
  criteria: form.criteria.map((group) =>
    group.map(({ variable, operator, argument }) => ({ variable, operator, argument }))
  ),
  behaviors: form.behaviors.map(({ id: _id, ...behavior }) => behavior),
  active: form.active
})

const behaviorFilled = (behavior: RuleBehavior) => {
  const argument = behaviorArgument(behavior.type)
  if (!argument) return true
  const fields = argument.kind === 'group' ? argument.fields : [argument]
  return fields.every(({ field }) => String(behavior[field] ?? '').trim())
}

export const isValid = (form: RuleForm) =>
  Boolean(form.name.trim()) &&
  form.criteria.every((group) => group.every((condition) => condition.variable.trim())) &&
  form.behaviors.length > 0 &&
  form.behaviors.every(behaviorFilled)

export const criteriaErrorsOf = (form: RuleForm) =>
  form.criteria.map((group) =>
    group.map((condition) =>
      condition.variable.trim() ? {} : { variable: 'Enter the variable to compare.' }
    )
  )
