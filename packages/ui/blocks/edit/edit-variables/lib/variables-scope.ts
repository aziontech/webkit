import type { VariablesScope } from '../edit-variables.vue'

/** One resource a scope can select. */
export type VariablesScopeOption = { value: string; label: string }

/** One scope row of the drawer. */
export type VariablesScopeState = {
  type: string
  label: string
  plural: string
  placeholder: string
  enabled: boolean
  ids: string[]
  query: string
  options: VariablesScopeOption[]
}

const SCOPE_TYPES = [
  { type: 'global', label: 'Global', plural: '' },
  { type: 'environment', label: 'Environment', plural: 'environments' },
  { type: 'project', label: 'Project', plural: 'projects' },
  { type: 'service', label: 'Service', plural: 'services' },
  { type: 'policy', label: 'Policy', plural: 'policies' }
]

const SCOPE_OPTIONS: Record<string, VariablesScopeOption[]> = {
  environment: [
    { value: 'env-production', label: 'Production' },
    { value: 'env-preview', label: 'Preview' },
    { value: 'env-stage', label: 'Stage' }
  ],
  project: [
    { value: '1020655', label: 'web-app' },
    { value: '1020828', label: 'docs-site' },
    { value: '1021001', label: 'api-gateway' },
    { value: '1021174', label: 'mobile-backend' }
  ],
  service: [
    { value: '4410203040', label: 'checkout' },
    { value: '3344556677', label: 'storefront' },
    { value: '8899001122', label: 'search' },
    { value: '9988776655', label: 'marketing-site' }
  ],
  policy: [
    { value: '5540117', label: 'production-policy' },
    { value: '5540118', label: 'staging-policy' },
    { value: '5540119', label: 'api-hardening' },
    { value: '5540120', label: 'checkout-shield' }
  ]
}

export const SCOPE_HINT =
  'Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Scope cannot be changed after the variable is ' +
  'created.'

export const createScopes = (): VariablesScopeState[] =>
  SCOPE_TYPES.map((scope) => ({
    ...scope,
    placeholder: scope.plural ? `Select ${scope.plural}` : '',
    enabled: scope.type === 'global',
    ids: [],
    query: '',
    options: SCOPE_OPTIONS[scope.type] ?? []
  }))

export const scopesFor = (scope: VariablesScope[]): VariablesScopeState[] =>
  createScopes().map((item) => {
    const ids = (scope ?? []).filter((entry) => entry.type === item.type).map((entry) => entry.id)
    return item.type === 'global'
      ? { ...item, enabled: ids.length > 0 }
      : { ...item, enabled: ids.length > 0, ids }
  })

export const setScopeEnabled = (
  scopes: VariablesScopeState[],
  scope: VariablesScopeState,
  enabled: boolean
): void => {
  if (scope.type === 'global') return
  scope.enabled = enabled
  scope.ids = enabled ? scope.options.map((option) => option.value) : []
  scope.query = ''
  scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
}

export const scopeMissing = (scope: VariablesScopeState): boolean =>
  scope.enabled && scope.type !== 'global' && scope.ids.length === 0

export const scopeDisplay =
  (scope: VariablesScopeState) =>
  (ids: unknown[]): string => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
    return scope.options.find((option) => option.value === ids[0])?.label ?? String(ids[0])
  }

export const visibleScopeOptions = (scope: VariablesScopeState): VariablesScopeOption[] => {
  const query = scope.query.trim().toLowerCase()
  if (!query) return scope.options
  return scope.options.filter((option) => option.label.toLowerCase().includes(query))
}

export const scopePayload = (scopes: VariablesScopeState[]): VariablesScope[] =>
  scopes.flatMap((scope) => {
    if (!scope.enabled) return []
    if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
    return scope.ids.map((id) => ({
      type: scope.type,
      id,
      name: scope.options.find((option) => option.value === id)?.label ?? id
    }))
  })

const scopeDetail = (type: string, names: string[], pluralName: string) => {
  if (type === 'global') return ''
  return names.length === 1 ? names[0] : `${names.length} ${pluralName}`
}

export const scopeSummary = (
  scope: VariablesScope[] | undefined
): { label: string; detail: string }[] =>
  SCOPE_TYPES.map((entry) => ({
    ...entry,
    names: (scope ?? []).filter((item) => item.type === entry.type).map((item) => item.name)
  }))
    .filter((entry) => entry.names.length > 0)
    .map((group) => ({
      label: group.label,
      detail: scopeDetail(group.type, group.names, group.plural)
    }))
