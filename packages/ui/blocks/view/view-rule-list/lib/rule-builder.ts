import {
  sampleBehaviorCatalog,
  sampleBuilderPhases as BUILDER_PHASES,
  sampleOperators as OPERATORS,
  sampleOptionSources,
  samplePhaseVariables,
  samplePolicies,
  sampleRuleDetails,
  sampleVariables
} from '../sample'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

export type OptionSource = 'policies' | 'cache-settings' | 'services'
export type ArgumentField =
  'target' | 'policyId' | 'serviceId' | 'cacheId' | 'capturedArray' | 'subject' | 'regex'
export type DragScope = 'behavior'

export interface BuilderPhase {
  value: RuleListPhase
  label: string
  description: string
}

export interface TextArgument {
  kind: 'text'
  field: ArgumentField
  placeholder: string
  label: string
}

export interface SelectArgument {
  kind: 'select'
  field: ArgumentField
  source: OptionSource
  label: string
}

export interface GroupField {
  field: ArgumentField
  placeholder: string
  label: string
}

export interface GroupArgument {
  kind: 'group'
  fields: GroupField[]
}

export type BehaviorArgument = TextArgument | SelectArgument | GroupArgument

export interface BehaviorDefinition {
  value: string
  label: string
  phases: RuleListPhase[]
  argument: BehaviorArgument | null
}

export type BehaviorFields = Partial<Record<ArgumentField, string>>

export interface BehaviorSeed extends BehaviorFields {
  type: string
}

export interface Behavior extends BehaviorSeed {
  id: number
}

export type Condition = {
  id: number
  variable: string
  operator: string
  argument: string
}

export interface SeedCondition {
  join: string | null
  variable: string
  operator: string
  argument: string
}

export interface RuleDetails {
  criteria: { conditions: SeedCondition[] }[]
  behaviors: BehaviorSeed[]
}

export interface RuleSeed extends RuleDetails {
  name: string
  description: string
  phase: RuleListPhase
  status: string
}

export interface RuleForm {
  name: string
  description: string
  phase: RuleListPhase
  criteria: Condition[][]
  behaviors: Behavior[]
  active: boolean
}

export interface DragState {
  scope: DragScope | null
  from: number
  over: number
}

export { BUILDER_PHASES, OPERATORS }

export const criteriaColumns = [
  { key: 'variable', label: 'Variable', required: true },
  { key: 'operator', label: 'Operator' },
  { key: 'argument', label: 'Argument' }
]

const byValue = Object.fromEntries(
  sampleBehaviorCatalog.map((behavior) => [behavior.value, behavior])
)

export const operatorLabel = (value: string) =>
  OPERATORS.find((o) => o.value === value)?.label ?? ''
export const takesArgument = (operator: string) =>
  operator !== 'exists' && operator !== 'does-not-exist'
export const behaviorLabel = (value: string) => byValue[value]?.label ?? ''
export const behaviorArgument = (value: string) => byValue[value]?.argument ?? null
export const textArgument = (value: string) => behaviorArgument(value) as TextArgument
export const selectArgument = (value: string) => behaviorArgument(value) as SelectArgument
export const groupArgument = (value: string) => behaviorArgument(value) as GroupArgument
export const behaviorsFor = (phase: RuleListPhase) =>
  sampleBehaviorCatalog.filter((behavior) => behavior.phases.includes(phase))
export const behaviorAllowedIn = (value: string, phase: RuleListPhase) =>
  Boolean(byValue[value]?.phases.includes(phase))
export const isTerminalBehavior = (value: string) =>
  ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value)
export const behaviorOptions = (source: OptionSource, phase: RuleListPhase) => {
  if (source === 'policies') {
    return samplePolicies
      .filter((policy) => phase !== 'response' || policy.scope === 'any')
      .map(({ value, label }) => ({ value, label }))
  }
  return sampleOptionSources[source] ?? []
}
export const behaviorArgumentNote = (source: OptionSource, phase: RuleListPhase) =>
  source === 'policies' && phase === 'response'
    ? 'Only policies scoped to any phase run in the response phase.'
    : ''
export const variablesFor = (phase: RuleListPhase) =>
  [...sampleVariables, ...samplePhaseVariables[phase]]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value }))

const behaviorFilled = (behavior: Behavior) => {
  const argument = behaviorArgument(behavior.type)
  if (!argument) return true
  const fields: { field: ArgumentField }[] =
    argument.kind === 'group' ? argument.fields : [argument]
  return fields.every(({ field }) => String(behavior[field] ?? '').trim())
}

export const formIsValid = (form: RuleForm) =>
  Boolean(form.name.trim()) &&
  form.criteria.every((group) => group.every((condition) => condition.variable.trim())) &&
  form.behaviors.length > 0 &&
  form.behaviors.every(behaviorFilled)

export const moveItem = <T>(list: T[], index: number, direction: number) => {
  const target = index + direction
  if (target < 0 || target >= list.length) return
  const [moved] = list.splice(index, 1)
  list.splice(target, 0, moved)
}

export const reorderItem = <T>(list: T[], from: number, to: number) => {
  if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
}

const fallbackDetails = (row: RuleListRule): RuleDetails => ({
  criteria: [
    {
      conditions: [{ join: null, variable: '${uri}', operator: 'starts-with', argument: '/' }]
    }
  ],
  behaviors: [{ type: row.phase === 'response' ? 'enable-gzip' : 'deliver' }]
})

export const seedFor = (row: RuleListRule): RuleSeed => ({
  name: row.name,
  description: row.description,
  phase: row.phase,
  ...(sampleRuleDetails[row.id] ?? fallbackDetails(row)),
  status: row.active ? 'Active' : 'Inactive'
})

export const BEHAVIOR_ROW_CLASS =
  'relative grid grid-cols-1 items-start gap-(--spacing-xs) rounded-(--shape-card) transition-[opacity,scale,outline-color] ' +
  'motion-reduce:transition-none ' +
  'data-dragging:scale-[0.98] data-dragging:opacity-70 data-dragging:outline-2 data-dragging:outline-(--accent) data-dragging:outline-dashed ' +
  'data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-2xs) data-drop:before:border-t-2 ' +
  "data-drop:before:border-(--accent) data-drop:before:content-[''] " +
  'sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'

export const DRAG_HANDLE_CLASS =
  'inline-flex size-10 shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors ' +
  'hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none'

export const ruleFormFactory = () => {
  let nextId = 0
  const uid = () => (nextId += 1)
  const newCondition = (): Condition => ({
    id: uid(),
    variable: '',
    operator: 'is-equal',
    argument: ''
  })
  const newBehavior = (): Behavior => ({ id: uid(), type: 'deliver' })
  const blankForm = (): RuleForm => ({
    name: '',
    description: '',
    phase: BUILDER_PHASES[0].value,
    criteria: [[newCondition()]],
    behaviors: [newBehavior()],
    active: true
  })
  const formFor = (seed: RuleSeed | null): RuleForm =>
    !seed
      ? blankForm()
      : {
          name: seed.name,
          description: seed.description,
          phase: seed.phase,
          criteria: seed.criteria.map((group) =>
            group.conditions.map(({ variable, operator, argument }) => ({
              id: uid(),
              variable,
              operator,
              argument
            }))
          ),
          behaviors: seed.behaviors.map((behavior) => ({ ...behavior, id: uid() })),
          active: seed.status === 'Active'
        }
  return { newCondition, newBehavior, blankForm, formFor }
}
