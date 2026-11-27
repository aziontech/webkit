import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import {
  type FilteringProperty,
  operatorsOf,
  type PropertyFilterOperator,
  type PropertyFilterOption,
  type PropertyFilterToken
} from '../../../../composables/use-collection/lib/property-filter'
import { operatorLabel, sectionOf, type Suggestion, type Translate } from '../lib/suggestion'

export type PropertyFilterDraft = {
  property?: FilteringProperty
  operator?: PropertyFilterOperator
  value: string
}

export interface UsePropertyFilterTokenSuggestionsOptions {
  parsed: MaybeRefOrGetter<PropertyFilterDraft>
  draft: MaybeRefOrGetter<string>
  properties: MaybeRefOrGetter<FilteringProperty[]>
  freeText: MaybeRefOrGetter<boolean>
  remote: MaybeRefOrGetter<boolean>
  loadedValues: MaybeRefOrGetter<readonly PropertyFilterOption[] | null>
  t: Translate
  setDraft: (value: string) => void
  addToken: (token: PropertyFilterToken) => void
}

type Builder = UsePropertyFilterTokenSuggestionsOptions

const optionLabel = (option: PropertyFilterOption): string => option.label ?? option.value

const propertyStage = (options: Builder): Suggestion[] => {
  const { t, setDraft, addToken } = options
  const draft = toValue(options.draft)
  const properties = toValue(options.properties)
  const needle = draft.trim().toLocaleLowerCase()
  const out: Suggestion[] = properties
    .filter((p) => p.label.toLocaleLowerCase().includes(needle))
    .map((p) => ({
      id: `p-${p.key}`,
      group: 'properties',
      label: p.label,
      description: '',
      section: 'properties',
      apply: () => setDraft(`${p.label} `)
    }))
  if (!needle) return out
  properties.forEach((p) =>
    (p.options ?? [])
      .filter((o) => optionLabel(o).toLocaleLowerCase().includes(needle))
      .forEach((o) =>
        out.push({
          id: `v-${p.key}-${o.value}`,
          group: 'values',
          label: `${p.label} = ${optionLabel(o)}`,
          description: '',
          section: 'values',
          count: o.count,
          apply: () => addToken({ propertyKey: p.key, operator: '=', value: o.value })
        })
      )
  )
  if (toValue(options.freeText)) {
    out.push({
      id: 'text',
      group: 'text',
      label: t('propertyFilter.useText', { text: draft.trim() }),
      description: '',
      apply: () => addToken({ operator: ':', value: draft.trim() })
    })
  }
  return out
}

const operatorStage = (options: Builder, property: FilteringProperty, value: string) =>
  operatorsOf(property)
    .filter((op) => op.startsWith(value) || value === '')
    .map<Suggestion>((op) => ({
      id: `o-${op}`,
      group: 'operators',
      label: `${property.label} ${op}`,
      description: operatorLabel(options.t, op),
      section: sectionOf(op),
      apply: () => options.setDraft(`${property.label} ${op} `)
    }))

const valueStage = (
  options: Builder,
  property: FilteringProperty,
  operator: PropertyFilterOperator,
  value: string
): Suggestion[] => {
  const { t, addToken } = options
  const needle = value.toLocaleLowerCase()
  const remote = toValue(options.remote)
  const loaded = remote ? toValue(options.loadedValues) : null
  const source = loaded ?? (remote ? [] : (property.options ?? []))
  const out: Suggestion[] = source
    .filter((o) => loaded !== null || optionLabel(o).toLocaleLowerCase().includes(needle))
    .map((o) => ({
      id: `v-${property.key}-${o.value}`,
      group: 'values',
      label: `${property.label} ${operator} ${optionLabel(o)}`,
      description: '',
      section: 'values',
      count: o.count,
      apply: () => addToken({ propertyKey: property.key, operator, value: o.value })
    }))
  if (value && !source.some((o) => o.value === value)) {
    out.push({
      id: 'typed',
      group: 'text',
      label: t('propertyFilter.useText', { text: `${property.label} ${operator} ${value}` }),
      description: '',
      apply: () => addToken({ propertyKey: property.key, operator, value })
    })
  }
  return out
}

export function usePropertyFilterTokenSuggestions(
  options: UsePropertyFilterTokenSuggestionsOptions
): ComputedRef<Suggestion[]> {
  return computed<Suggestion[]>(() => {
    const { property, operator, value } = toValue(options.parsed)
    if (!property) return propertyStage(options)
    if (!operator) return operatorStage(options, property, value)
    if (property.customValue) return []
    return valueStage(options, property, operator, value)
  })
}
