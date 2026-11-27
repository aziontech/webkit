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
  type FilteringProperty,
  operatorsOf,
  type PropertyFilterOperation
} from '../../../../composables/use-collection/lib/property-filter'
import { operatorLabel, type Suggestion, type Translate } from '../lib/suggestion'
import {
  flatQuery,
  parseQuery,
  type PropertyFilterQuerySuggestion,
  type PropertyFilterSubmit,
  type QueryContext,
  queryContext,
  type QueryParse,
  quoteValue
} from '../query-language'

export interface UsePropertyFilterQueryOptions {
  text: Ref<string>
  enabled: MaybeRefOrGetter<boolean>
  properties: MaybeRefOrGetter<FilteringProperty[]>
  freeText: MaybeRefOrGetter<boolean>
  validate: MaybeRefOrGetter<((text: string) => string) | undefined>
  suggest: MaybeRefOrGetter<
    ((text: string, caret: number) => PropertyFilterQuerySuggestion[]) | undefined
  >
  t: Translate
  onInsert: (position: number) => void
}

export interface UsePropertyFilterQueryReturn {
  caret: Readonly<Ref<number>>
  touched: Readonly<Ref<boolean>>
  error: ComputedRef<string>
  showError: ComputedRef<boolean>
  suggestions: ComputedRef<Suggestion[]>
  syncCaret: (event: Event) => void
  touch: (value: boolean) => void
  payload: (operation: PropertyFilterOperation) => PropertyFilterSubmit
}

type Insert = (insert: string) => void

const includes = (text: string, needle: string): boolean =>
  text.toLocaleLowerCase().includes(needle)

const fieldSuggestions = (properties: FilteringProperty[], needle: string, insert: Insert) =>
  properties
    .filter((p) => includes(p.key, needle) || includes(p.label, needle))
    .map<Suggestion>((p) => ({
      id: `f-${p.key}`,
      group: 'fields',
      label: p.key,
      description: p.label,
      apply: () => insert(p.key)
    }))

const operatorSuggestions = (context: QueryContext, t: Translate, insert: Insert) =>
  context.property
    ? operatorsOf(context.property)
        .filter((op) => op.startsWith(context.word))
        .map<Suggestion>((op) => ({
          id: `o-${op}`,
          group: 'operators',
          label: op,
          description: operatorLabel(t, op),
          apply: () => insert(op)
        }))
    : []

const valueSuggestions = (context: QueryContext, needle: string, insert: Insert) =>
  (context.property?.options ?? [])
    .filter((o) => includes(o.value, needle) || includes(o.label ?? '', needle))
    .map<Suggestion>((o) => ({
      id: `v-${o.value}`,
      group: 'values',
      label: quoteValue(o.value),
      description: o.label && o.label !== o.value ? o.label : '',
      section: 'values',
      apply: () => insert(quoteValue(o.value))
    }))

const connectiveSuggestions = (needle: string, t: Translate, insert: Insert) =>
  (['AND', 'OR'] as const)
    .filter((c) => c.toLocaleLowerCase().startsWith(needle))
    .map<Suggestion>((c) => ({
      id: `c-${c}`,
      group: 'connectives',
      label: c,
      description: c === 'AND' ? t('propertyFilter.queryAll') : t('propertyFilter.queryAny'),
      apply: () => insert(c)
    }))

const parseError = (
  text: string,
  validate: ((text: string) => string) | undefined,
  found: QueryParse['error'],
  t: Translate
): string => {
  if (!text.trim()) return ''
  if (validate) return validate(text)
  return found ? t(`propertyFilter.${found.code}`, found.params) : ''
}

const builtInSuggestions = (
  current: QueryContext,
  properties: FilteringProperty[],
  t: Translate,
  insert: Insert
): Suggestion[] => {
  const needle = current.word.toLocaleLowerCase()
  if (current.role === 'field') return fieldSuggestions(properties, needle, insert)
  if (current.role === 'operator') return operatorSuggestions(current, t, insert)
  if (current.role === 'value') return valueSuggestions(current, needle, insert)
  return connectiveSuggestions(needle, t, insert)
}

const spliceAt = (text: string, from: number, to: number, insert: string): string => {
  const after = text.slice(to)
  return `${text.slice(0, from)}${insert}${/^\s/.test(after) ? '' : ' '}${after}`
}

export function usePropertyFilterQuery(
  options: UsePropertyFilterQueryOptions
): UsePropertyFilterQueryReturn {
  const { text, t } = options
  const caret = ref<number>(text.value.length)
  const touched = ref<boolean>(false)
  const properties = () => toValue(options.properties)

  const builtInParse = computed(() =>
    parseQuery(text.value, properties(), toValue(options.freeText))
  )
  const error = computed<string>(() =>
    parseError(text.value, toValue(options.validate), builtInParse.value.error, t)
  )
  const context = computed(() =>
    queryContext(text.value, caret.value, properties(), toValue(options.freeText))
  )

  const insertAtCaret = (insert: string): void => {
    const { from, to } = context.value
    const position = from + insert.length + 1
    text.value = spliceAt(text.value, from, to, insert)
    caret.value = position
    options.onInsert(position)
  }

  const suggestions = computed<Suggestion[]>(() => {
    const suggest = toValue(options.suggest)
    if (!suggest) return builtInSuggestions(context.value, properties(), t, insertAtCaret)
    return suggest(text.value, caret.value).map((item, index) => ({
      id: `q-${index}-${item.insert}`,
      group: 'text',
      label: item.label,
      description: item.description ?? '',
      apply: () => insertAtCaret(item.insert)
    }))
  })

  return {
    caret: readonly(caret),
    touched: readonly(touched),
    error,
    showError: computed<boolean>(
      () => toValue(options.enabled) && touched.value && Boolean(error.value)
    ),
    suggestions,
    syncCaret: (event) => {
      const target = event.target as HTMLInputElement | null
      if (toValue(options.enabled) && typeof target?.selectionStart === 'number')
        caret.value = target.selectionStart
    },
    touch: (value) => {
      touched.value = value
    },
    payload: (operation) => ({
      text: text.value,
      query: text.value.trim() ? flatQuery(builtInParse.value) : { tokens: [], operation }
    })
  }
}
