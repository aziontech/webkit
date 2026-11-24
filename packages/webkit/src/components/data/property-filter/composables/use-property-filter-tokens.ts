import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import {
  cloneQuery,
  type PropertyFilterOperation,
  type PropertyFilterQuery,
  type PropertyFilterToken,
  type PropertyFilterTokenGroup
} from '../../../../composables/use-collection/lib/property-filter'
import {
  appendToken,
  isOperation,
  withGroupOperation,
  withOperation,
  withoutGroupToken,
  withoutLast,
  withoutToken
} from '../lib/token-query'

export interface UsePropertyFilterTokensOptions {
  query: Ref<PropertyFilterQuery>
  disabled: MaybeRefOrGetter<boolean>
  grouped: MaybeRefOrGetter<boolean>
}

export interface UsePropertyFilterTokensReturn {
  tokens: ComputedRef<PropertyFilterToken[]>
  operation: ComputedRef<PropertyFilterOperation>
  groups: ComputedRef<PropertyFilterTokenGroup[]>
  pendingGroup: Readonly<Ref<boolean>>
  conditionCount: ComputedRef<number>
  addToken: (token: PropertyFilterToken) => void
  removeToken: (index: number) => void
  removeGroupToken: (groupIndex: number, tokenIndex: number) => void
  removeLast: () => void
  setOperation: (value: string | undefined) => void
  setGroupOperation: (groupIndex: number, value: string | undefined) => void
  startGroup: () => void
  clearAll: () => void
}

export function usePropertyFilterTokens(
  options: UsePropertyFilterTokensOptions
): UsePropertyFilterTokensReturn {
  const { query } = options
  const pendingGroup = ref<boolean>(false)
  const tokens = computed<PropertyFilterToken[]>(() => query.value.tokens)
  const groups = computed<PropertyFilterTokenGroup[]>(() => query.value.groups ?? [])
  const operation = computed<PropertyFilterOperation>(() => query.value.operation)

  const commit = (next: PropertyFilterQuery | null): void => {
    if (!next || toValue(options.disabled)) return
    query.value = cloneQuery(next)
  }

  const addToken = (token: PropertyFilterToken): void => {
    const next = appendToken(query.value, token, toValue(options.grouped), pendingGroup.value)
    if (toValue(options.grouped)) pendingGroup.value = false
    commit(next)
  }

  const removeLast = (): void => {
    if (pendingGroup.value) pendingGroup.value = false
    else commit(withoutLast(query.value, toValue(options.grouped)))
  }

  return {
    tokens,
    operation,
    groups,
    pendingGroup: readonly(pendingGroup),
    conditionCount: computed<number>(() => tokens.value.length + groups.value.length),
    addToken,
    removeToken: (index) => commit(withoutToken(query.value, index)),
    removeGroupToken: (groupIndex, tokenIndex) =>
      commit(withoutGroupToken(query.value, groupIndex, tokenIndex)),
    removeLast,
    setOperation: (value) => commit(isOperation(value) ? withOperation(query.value, value) : null),
    setGroupOperation: (groupIndex, value) =>
      commit(isOperation(value) ? withGroupOperation(query.value, groupIndex, value) : null),
    startGroup: () => {
      pendingGroup.value = true
    },
    clearAll: () => {
      pendingGroup.value = false
      commit({ tokens: [], operation: operation.value })
    }
  }
}
