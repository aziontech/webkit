import type { SelectOptionItem } from '@aziontech/ui/select'

import {
  catalog,
  OPERATORS,
  phaseVariables,
  policies,
  sources,
  variables
} from './rule-behavior-data'

const byValue = Object.fromEntries(catalog.map((behavior) => [behavior.value, behavior]))

export const operatorLabel = (value: string) =>
  OPERATORS.find((o) => o.value === value)?.label ?? ''
export const takesArgument = (operator: string) =>
  operator !== 'exists' && operator !== 'does-not-exist'
export const behaviorLabel = (value: string) => byValue[value]?.label ?? ''
export const behaviorArgument = (value: string) => byValue[value]?.argument ?? null
export const behaviorsFor = (phase: string) =>
  catalog.filter((behavior) => behavior.phases.includes(phase))
export const behaviorAllowedIn = (value: string, phase: string) =>
  Boolean(byValue[value]?.phases.includes(phase))
export const isTerminalBehavior = (value: string | undefined) =>
  ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value ?? '')
export const behaviorOptions = (source: string, phase: string): SelectOptionItem[] => {
  if (source === 'policies') {
    return policies
      .filter((policy) => phase !== 'response' || policy.scope === 'any')
      .map(({ value, label }) => ({ value, label }))
  }
  return sources[source] ?? []
}
export const behaviorArgumentNote = (source: string, phase: string) =>
  source === 'policies' && phase === 'response'
    ? 'Only policies scoped to any phase run in the response phase.'
    : ''
export const variablesFor = (phase: string) =>
  [...variables, ...phaseVariables[phase]]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value }))
