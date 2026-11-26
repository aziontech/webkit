import type {
  PropertyFilterOperation,
  PropertyFilterQuery,
  PropertyFilterToken,
  PropertyFilterTokenGroup
} from '../../../../composables/use-collection/lib/property-filter'

const groupsOf = (query: PropertyFilterQuery): PropertyFilterTokenGroup[] => query.groups ?? []

const withGroups = (
  query: PropertyFilterQuery,
  tokens: PropertyFilterToken[],
  groups: PropertyFilterTokenGroup[],
  operation: PropertyFilterOperation = query.operation
): PropertyFilterQuery => ({ tokens, operation, groups })

const mapGroup = (
  query: PropertyFilterQuery,
  groupIndex: number,
  change: (group: PropertyFilterTokenGroup) => PropertyFilterTokenGroup
): PropertyFilterQuery =>
  withGroups(
    query,
    query.tokens,
    groupsOf(query).map((group, i) => (i === groupIndex ? change(group) : group))
  )

export const isOperation = (value: string | undefined): value is PropertyFilterOperation =>
  value === 'and' || value === 'or'

export const appendToken = (
  query: PropertyFilterQuery,
  token: PropertyFilterToken,
  grouped: boolean,
  freshGroup: boolean
): PropertyFilterQuery => {
  const groups = groupsOf(query)
  if (!grouped) return withGroups(query, [...query.tokens, token], groups)
  const last = groups[groups.length - 1]
  const next =
    freshGroup || !last
      ? [...groups, { tokens: [token], operation: 'or' as const }]
      : [...groups.slice(0, -1), { tokens: [...last.tokens, token], operation: last.operation }]
  return withGroups(query, query.tokens, next)
}

export const withoutToken = (query: PropertyFilterQuery, index: number): PropertyFilterQuery =>
  withGroups(
    query,
    query.tokens.filter((_, i) => i !== index),
    groupsOf(query)
  )

export const withoutGroupToken = (
  query: PropertyFilterQuery,
  groupIndex: number,
  tokenIndex: number
): PropertyFilterQuery =>
  mapGroup(query, groupIndex, (group) => ({
    tokens: group.tokens.filter((_, j) => j !== tokenIndex),
    operation: group.operation
  }))

export const withoutLast = (
  query: PropertyFilterQuery,
  grouped: boolean
): PropertyFilterQuery | null => {
  const groups = groupsOf(query)
  const lastGroup = groups.length - 1
  if (grouped && lastGroup >= 0)
    return withoutGroupToken(query, lastGroup, (groups[lastGroup]?.tokens.length ?? 1) - 1)
  return query.tokens.length ? withoutToken(query, query.tokens.length - 1) : null
}

export const withOperation = (
  query: PropertyFilterQuery,
  operation: PropertyFilterOperation
): PropertyFilterQuery => withGroups(query, query.tokens, groupsOf(query), operation)

export const withGroupOperation = (
  query: PropertyFilterQuery,
  groupIndex: number,
  operation: PropertyFilterOperation
): PropertyFilterQuery =>
  mapGroup(query, groupIndex, (group) => ({ tokens: group.tokens, operation }))
