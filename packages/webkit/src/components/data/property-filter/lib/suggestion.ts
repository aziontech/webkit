import type { PropertyFilterOperator } from '../../../../composables/use-collection/lib/property-filter'
import type { UseTranslateReturn } from '../../../../composables/use-translate'
import type { MessageKey } from '../../../../i18n/types'

export type Translate = UseTranslateReturn['t']

export type OperatorSection = 'equality' | 'comparison' | 'textMatch'

export type Suggestion = {
  id: string
  group: 'properties' | 'operators' | 'values' | 'text' | 'fields' | 'connectives'
  label: string
  description: string
  count?: number
  section?: OperatorSection
  apply: () => void
}

export type SuggestionSection = {
  id: string
  title: string
  items: { item: Suggestion; index: number }[]
}

const OPERATOR_LABELS: Record<PropertyFilterOperator, MessageKey> = {
  '=': 'propertyFilter.equals',
  '!=': 'propertyFilter.notEquals',
  ':': 'propertyFilter.contains',
  '!:': 'propertyFilter.notContains',
  '^': 'propertyFilter.startsWith',
  '!^': 'propertyFilter.notStartsWith',
  '>': 'propertyFilter.greater',
  '<': 'propertyFilter.less',
  '>=': 'propertyFilter.greaterOrEqual',
  '<=': 'propertyFilter.lessOrEqual'
}

export const operatorLabel = (t: Translate, operator: PropertyFilterOperator): string =>
  t(OPERATOR_LABELS[operator])

export const sectionOf = (operator: PropertyFilterOperator): OperatorSection => {
  if (operator === '=' || operator === '!=') return 'equality'
  if (operator === ':' || operator === '!:' || operator === '^' || operator === '!^')
    return 'textMatch'
  return 'comparison'
}

const MAX_SUGGESTIONS = 100

export const capSuggestions = (list: Suggestion[]): Suggestion[] => {
  if (list.length <= MAX_SUGGESTIONS) return list
  const typed = list.filter((item) => item.group === 'text')
  return [
    ...list.filter((item) => item.group !== 'text').slice(0, MAX_SUGGESTIONS - typed.length),
    ...typed
  ]
}

export const groupSections = (
  suggestions: Suggestion[],
  uid: string,
  t: Translate
): SuggestionSection[] => {
  const out: SuggestionSection[] = []
  suggestions.forEach((item, index) => {
    const key = item.section ?? ''
    const last = out[out.length - 1]
    if (last && last.id === `${uid}-section-${key}`) last.items.push({ item, index })
    else
      out.push({
        id: `${uid}-section-${key}`,
        title: item.section ? t(`propertyFilter.${item.section}`) : '',
        items: [{ item, index }]
      })
  })
  return out
}
