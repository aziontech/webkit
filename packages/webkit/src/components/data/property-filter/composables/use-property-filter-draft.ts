import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import {
  type FilteringProperty,
  parseFilterText,
  type PropertyFilterToken,
  tokenText
} from '../../../../composables/use-collection/lib/property-filter'
import { operatorLabel, type Suggestion, type Translate } from '../lib/suggestion'
import { usePropertyFilterTokenSuggestions } from './use-property-filter-token-suggestions'
import {
  type PropertyFilterValueLoader,
  type PropertyFilterValueStage,
  usePropertyFilterValues
} from './use-property-filter-values'

export interface UsePropertyFilterDraftOptions {
  draft: MaybeRefOrGetter<string>
  query: MaybeRefOrGetter<boolean>
  properties: MaybeRefOrGetter<FilteringProperty[]>
  freeText: MaybeRefOrGetter<boolean>
  loadValues: MaybeRefOrGetter<PropertyFilterValueLoader | undefined>
  t: Translate
  setDraft: (value: string) => void
  addToken: (token: PropertyFilterToken) => void
}

export interface UsePropertyFilterDraftReturn {
  editorStage: ComputedRef<PropertyFilterValueStage | null>
  valueRows: ComputedRef<'loading' | 'error' | null>
  suggestions: ComputedRef<Suggestion[]>
  applyCustom: (value: string) => boolean
  commitTyped: () => void
  labelOf: (token: PropertyFilterToken) => string
}

export function usePropertyFilterDraft(
  options: UsePropertyFilterDraftOptions
): UsePropertyFilterDraftReturn {
  const { t, addToken } = options
  const parsed = computed(() =>
    parseFilterText(toValue(options.draft), toValue(options.properties))
  )
  const valueStage = computed<PropertyFilterValueStage | null>(() => {
    const { property, operator, value } = parsed.value
    return property && operator && !toValue(options.query) ? { property, operator, value } : null
  })
  const { loadedValues, valueRows, loadedLabel } = usePropertyFilterValues({
    stage: valueStage,
    loadValues: options.loadValues
  })
  const editorStage = computed(() =>
    valueStage.value?.property.customValue ? valueStage.value : null
  )
  const suggestions = usePropertyFilterTokenSuggestions({
    ...options,
    parsed,
    remote: () => Boolean(toValue(options.loadValues)),
    loadedValues
  })

  const applyCustom = (value: string): boolean => {
    const stage = editorStage.value
    if (!stage || !value) return false
    addToken({ propertyKey: stage.property.key, operator: stage.operator, value })
    return true
  }

  const commitTyped = (): void => {
    const { property, operator, value } = parsed.value
    const typed = toValue(options.draft).trim()
    if (property && operator && value) addToken({ propertyKey: property.key, operator, value })
    else if (!property && typed && toValue(options.freeText))
      addToken({ operator: ':', value: typed })
  }

  const labelOf = (token: PropertyFilterToken): string => {
    if (!token.propertyKey) return `${operatorLabel(t, token.operator)}: ${token.value}`
    const loaded = loadedLabel(token.propertyKey, token.value)
    return tokenText(loaded ? { ...token, value: loaded } : token, toValue(options.properties))
  }

  return { editorStage, valueRows, suggestions, applyCustom, commitTyped, labelOf }
}
