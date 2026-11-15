<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import {
    cloneQuery,
    type FilteringProperty,
    operatorsOf,
    parseFilterText,
    type PropertyFilterOperation,
    type PropertyFilterOperator,
    type PropertyFilterOption,
    type PropertyFilterQuery,
    type PropertyFilterToken,
    type PropertyFilterTokenGroup,
    tokenText
  } from '../../../composables/use-collection/lib/property-filter'
  import { usePlacement } from '../../../composables/use-placement'
  import { usePortalLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import Chip from '../../inputs/chip/chip.vue'
  import HelperText from '../../inputs/helper-text/helper-text.vue'
  import Input from '../../inputs/input/input.vue'
  import Spinner from '../../utils/spinner/spinner.vue'
  import {
    flatQuery,
    parseQuery,
    type PropertyFilterQuerySuggestion,
    type PropertyFilterSubmit,
    queryContext,
    quoteValue
  } from './query-language'

  export type {
    FilteringProperty,
    PropertyFilterOperator,
    PropertyFilterOption,
    PropertyFilterQuery,
    PropertyFilterToken,
    PropertyFilterTokenGroup
  } from '../../../composables/use-collection/lib/property-filter'
  export type { PropertyFilterQuerySuggestion, PropertyFilterSubmit } from './query-language'

  type Suggestion = {
    id: string
    group: 'properties' | 'operators' | 'values' | 'text' | 'fields' | 'connectives'
    label: string
    description: string
    count?: number
    section?: OperatorSection
    apply: () => void
  }

  type OperatorSection = 'equality' | 'comparison' | 'textMatch'

  defineOptions({
    name: 'PropertyFilter',
    inheritAttrs: false
  })

  /** How the field edits the query. */
  export type PropertyFilterMode = 'tokens' | 'query'

  interface Props {
    /** Properties the suggestions offer, with their operators and values. */
    properties?: FilteringProperty[]
    /** Items that match the query, announced next to the tokens. Hidden when unset. */
    totalCount?: number
    /** Placeholder of the field. Empty uses the locale catalog. */
    placeholder?: string
    /** Accessible name of the field. Empty uses the locale catalog. */
    ariaLabel?: string
    /** Accepts typed text with no property as a free-text token. */
    freeText?: boolean
    /** Disables the field and the tokens. */
    disabled?: boolean
    /** `tokens` turns each choice into a token; `query` edits one query string. */
    mode?: PropertyFilterMode
    /** Checks the query string in query mode: '' when valid, else the message shown under the field. Replaces the built-in check. */
    validate?: (text: string) => string
    /** Suggestions for the word at the caret in query mode. Replaces the built-in field, operator, value and AND / OR suggestions. */
    suggest?: (text: string, caret: number) => PropertyFilterQuerySuggestion[]
    /** Tokens mode: tokens go into groups with their own Match all / Match any; Add group starts the next one. */
    grouped?: boolean
    /** Fetches the values of a property for the typed text, after the operator. Replaces its options in the suggestions. */
    loadValues?: (property: FilteringProperty, text: string) => Promise<PropertyFilterOption[]>
    /** Shows the Match all / Match any toggle; false keeps the tokens combined with AND (a model that holds only AND conditions, such as a table's filters). */
    showOperations?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    properties: () => [],
    totalCount: undefined,
    placeholder: '',
    ariaLabel: '',
    freeText: true,
    disabled: false,
    mode: 'tokens',
    validate: undefined,
    suggest: undefined,
    grouped: false,
    loadValues: undefined,
    showOperations: true
  })

  const emit = defineEmits<{
    submit: [event: KeyboardEvent, payload: PropertyFilterSubmit]
  }>()

  /** The tokens and how they combine. Supports v-model:query. */
  const query = defineModel<PropertyFilterQuery>('query', {
    default: () => ({ tokens: [], operation: 'and' })
  })
  /** The query string in query mode. Supports v-model:text. */
  const queryText = defineModel<string>('text', { default: '' })

  defineSlots<{
    /** Editor for the value of a property marked customValue; apply adds the token. */
    value(props: {
      property: FilteringProperty
      operator: PropertyFilterOperator
      apply: (value: string) => void
    }): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({
    propertyFilter: en.propertyFilter,
    propertyFilterQuery: en.propertyFilterQuery
  })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-property-filter'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const uid = useId()
  const listId = `${uid}-suggestions`
  const errorId = `${uid}-error`

  const tokens = computed<PropertyFilterToken[]>(() => query.value.tokens)
  const operation = computed<PropertyFilterOperation>(() => query.value.operation)
  const groups = computed<PropertyFilterTokenGroup[]>(() => query.value.groups ?? [])
  const pendingGroup = ref<boolean>(false)

  const commitQuery = (next: PropertyFilterQuery): void => {
    if (props.disabled) return
    query.value = cloneQuery(next)
  }

  const withGroups = (
    nextTokens: PropertyFilterToken[],
    nextGroups: PropertyFilterTokenGroup[],
    nextOperation: PropertyFilterOperation = operation.value
  ): PropertyFilterQuery => ({ tokens: nextTokens, operation: nextOperation, groups: nextGroups })

  const draft = ref<string>('')
  const open = ref<boolean>(false)
  const active = ref<number>(-1)
  const fieldEl = ref<HTMLElement | null>(null)
  const panelEl = ref<HTMLElement | null>(null)

  const operatorLabel = (operator: PropertyFilterOperator): string => {
    switch (operator) {
      case '=':
        return t('propertyFilter.equals')
      case '!=':
        return t('propertyFilter.notEquals')
      case ':':
        return t('propertyFilter.contains')
      case '!:':
        return t('propertyFilter.notContains')
      case '^':
        return t('propertyFilter.startsWith')
      case '!^':
        return t('propertyFilter.notStartsWith')
      case '>':
        return t('propertyFilter.greater')
      case '<':
        return t('propertyFilter.less')
      case '>=':
        return t('propertyFilter.greaterOrEqual')
      default:
        return t('propertyFilter.lessOrEqual')
    }
  }

  const addToken = (token: PropertyFilterToken): void => {
    if (props.grouped) {
      const current = groups.value
      const last = current[current.length - 1]
      const nextGroups =
        pendingGroup.value || !last
          ? [...current, { tokens: [token], operation: 'or' as const }]
          : [
              ...current.slice(0, -1),
              { tokens: [...last.tokens, token], operation: last.operation }
            ]
      pendingGroup.value = false
      commitQuery(withGroups(tokens.value, nextGroups))
    } else {
      commitQuery(withGroups([...tokens.value, token], groups.value))
    }
    draft.value = ''
    active.value = -1
  }

  const loadedValues = ref<PropertyFilterOption[] | null>(null)
  const valuesLoading = ref<boolean>(false)
  const valuesFailed = ref<boolean>(false)
  const loadedLabels = new Map<string, string>()
  let loadId = 0

  const numberFormat = computed(() => new Intl.NumberFormat(locale.value))

  const sectionOf = (operator: PropertyFilterOperator): OperatorSection => {
    if (operator === '=' || operator === '!=') return 'equality'
    if (operator === ':' || operator === '!:' || operator === '^' || operator === '!^')
      return 'textMatch'
    return 'comparison'
  }

  const isQuery = computed<boolean>(() => props.mode === 'query')

  const parsed = computed(() => parseFilterText(draft.value, props.properties))

  const valueStage = computed(() => {
    const { property, operator, value } = parsed.value
    return property && operator && !isQuery.value ? { property, operator, value } : null
  })

  watch(
    () =>
      valueStage.value && props.loadValues && !valueStage.value.property.customValue
        ? `${valueStage.value.property.key}\u0000${valueStage.value.value}`
        : null,
    async (key) => {
      const id = ++loadId
      const stage = valueStage.value
      if (key === null || !stage || !props.loadValues) {
        loadedValues.value = null
        valuesLoading.value = false
        valuesFailed.value = false
        return
      }
      valuesLoading.value = true
      valuesFailed.value = false
      try {
        const values = await props.loadValues(stage.property, stage.value)
        if (id !== loadId) return
        values.forEach((option) => {
          if (option.label)
            loadedLabels.set(`${stage.property.key}\u0000${option.value}`, option.label)
        })
        loadedValues.value = values
      } catch {
        if (id !== loadId) return
        loadedValues.value = []
        valuesFailed.value = true
      } finally {
        if (id === loadId) valuesLoading.value = false
      }
    }
  )

  const editorStage = computed(() =>
    valueStage.value?.property.customValue ? valueStage.value : null
  )

  const applyCustom = (value: string): void => {
    const stage = editorStage.value
    if (!stage || !value) return
    addToken({ propertyKey: stage.property.key, operator: stage.operator, value })
    void nextTick(() => inputEl()?.focus())
  }

  const tokenSuggestions = computed<Suggestion[]>(() => {
    const { property, operator, value } = parsed.value
    const out: Suggestion[] = []
    if (!property) {
      const needle = draft.value.trim().toLocaleLowerCase()
      props.properties
        .filter((p) => p.label.toLocaleLowerCase().includes(needle))
        .forEach((p) =>
          out.push({
            id: `p-${p.key}`,
            group: 'properties',
            label: p.label,
            description: '',
            apply: () => {
              draft.value = `${p.label} `
              active.value = -1
            }
          })
        )
      if (needle) {
        props.properties.forEach((p) =>
          (p.options ?? [])
            .filter((o) => (o.label ?? o.value).toLocaleLowerCase().includes(needle))
            .forEach((o) =>
              out.push({
                id: `v-${p.key}-${o.value}`,
                group: 'values',
                label: `${p.label} = ${o.label ?? o.value}`,
                description: '',
                count: o.count,
                apply: () => addToken({ propertyKey: p.key, operator: '=', value: o.value })
              })
            )
        )
        if (props.freeText) {
          out.push({
            id: 'text',
            group: 'text',
            label: t('propertyFilter.useText', { text: draft.value.trim() }),
            description: '',
            apply: () => addToken({ operator: ':', value: draft.value.trim() })
          })
        }
      }
      return out
    }
    if (!operator) {
      operatorsOf(property)
        .filter((op) => op.startsWith(value) || value === '')
        .forEach((op) =>
          out.push({
            id: `o-${op}`,
            group: 'operators',
            label: `${property.label} ${op}`,
            description: operatorLabel(op),
            section: sectionOf(op),
            apply: () => {
              draft.value = `${property.label} ${op} `
              active.value = -1
            }
          })
        )
      return out
    }
    if (property.customValue) return out
    const needle = value.toLocaleLowerCase()
    const loaded = props.loadValues ? loadedValues.value : null
    const source = loaded ?? (props.loadValues ? [] : (property.options ?? []))
    source
      .filter((o) => loaded !== null || (o.label ?? o.value).toLocaleLowerCase().includes(needle))
      .forEach((o) =>
        out.push({
          id: `v-${property.key}-${o.value}`,
          group: 'values',
          label: `${property.label} ${operator} ${o.label ?? o.value}`,
          description: '',
          count: o.count,
          apply: () => addToken({ propertyKey: property.key, operator, value: o.value })
        })
      )
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
  })

  const caret = ref<number>(queryText.value.length)
  const touched = ref<boolean>(false)

  const setText = (value: string): void => {
    queryText.value = value
  }

  const builtInParse = computed(() => parseQuery(queryText.value, props.properties, props.freeText))
  const queryError = computed<string>(() => {
    if (!queryText.value.trim()) return ''
    if (props.validate) return props.validate(queryText.value)
    const error = builtInParse.value.error
    return error ? t(`propertyFilterQuery.${error.code}`, error.params) : ''
  })
  const showError = computed<boolean>(
    () => isQuery.value && touched.value && Boolean(queryError.value)
  )

  const context = computed(() =>
    queryContext(queryText.value, caret.value, props.properties, props.freeText)
  )

  const inputEl = (): HTMLInputElement | null | undefined => fieldEl.value?.querySelector('input')

  const insertAtCaret = (insert: string): void => {
    const { from, to } = context.value
    const after = queryText.value.slice(to)
    const spacer = /^\s/.test(after) ? '' : ' '
    const position = from + insert.length + 1
    setText(`${queryText.value.slice(0, from)}${insert}${spacer}${after}`)
    caret.value = position
    active.value = -1
    open.value = true
    void nextTick(() => inputEl()?.setSelectionRange(position, position))
  }

  const querySuggestions = computed<Suggestion[]>(() => {
    if (props.suggest) {
      return props.suggest(queryText.value, caret.value).map((item, index) => ({
        id: `q-${index}-${item.insert}`,
        group: 'text',
        label: item.label,
        description: item.description ?? '',
        apply: () => insertAtCaret(item.insert)
      }))
    }
    const { role, property, word } = context.value
    const needle = word.toLocaleLowerCase()
    if (role === 'field') {
      return props.properties
        .filter(
          (p) =>
            p.key.toLocaleLowerCase().includes(needle) ||
            p.label.toLocaleLowerCase().includes(needle)
        )
        .map((p) => ({
          id: `f-${p.key}`,
          group: 'fields',
          label: p.key,
          description: p.label,
          apply: () => insertAtCaret(p.key)
        }))
    }
    if (role === 'operator') {
      if (!property) return []
      return operatorsOf(property)
        .filter((op) => op.startsWith(word))
        .map((op) => ({
          id: `o-${op}`,
          group: 'operators',
          label: op,
          description: operatorLabel(op),
          apply: () => insertAtCaret(op)
        }))
    }
    if (role === 'value') {
      return (property?.options ?? [])
        .filter(
          (o) =>
            o.value.toLocaleLowerCase().includes(needle) ||
            (o.label ?? '').toLocaleLowerCase().includes(needle)
        )
        .map((o) => ({
          id: `v-${o.value}`,
          group: 'values',
          label: quoteValue(o.value),
          description: o.label && o.label !== o.value ? o.label : '',
          apply: () => insertAtCaret(quoteValue(o.value))
        }))
    }
    return (['AND', 'OR'] as const)
      .filter((c) => c.toLocaleLowerCase().startsWith(needle))
      .map((c) => ({
        id: `c-${c}`,
        group: 'connectives',
        label: c,
        description: c === 'AND' ? t('propertyFilterQuery.all') : t('propertyFilterQuery.any'),
        apply: () => insertAtCaret(c)
      }))
  })

  const MAX_SUGGESTIONS = 100

  const suggestions = computed<Suggestion[]>(() => {
    const list = isQuery.value ? querySuggestions.value : tokenSuggestions.value
    if (list.length <= MAX_SUGGESTIONS) return list
    const typed = list.filter((item) => item.group === 'text')
    return [
      ...list.filter((item) => item.group !== 'text').slice(0, MAX_SUGGESTIONS - typed.length),
      ...typed
    ]
  })

  const syncCaret = (event: Event): void => {
    const target = event.target as HTMLInputElement | null
    if (isQuery.value && typeof target?.selectionStart === 'number') {
      caret.value = target.selectionStart
    }
  }

  const submitQuery = (event: KeyboardEvent): void => {
    if (props.disabled) return
    touched.value = true
    if (queryError.value) return
    open.value = false
    active.value = -1
    emit('submit', event, {
      text: queryText.value,
      query: queryText.value.trim()
        ? flatQuery(builtInParse.value)
        : { tokens: [], operation: operation.value }
    })
  }

  const valueRows = computed<'loading' | 'error' | null>(() => {
    if (!valueStage.value || !props.loadValues || valueStage.value.property.customValue) return null
    if (valuesLoading.value) return 'loading'
    return valuesFailed.value ? 'error' : null
  })

  const expanded = computed<boolean>(
    () =>
      open.value && !props.disabled && (suggestions.value.length > 0 || valueRows.value !== null)
  )

  const sections = computed(() => {
    const out: { id: string; title: string; items: { item: Suggestion; index: number }[] }[] = []
    suggestions.value.forEach((item, index) => {
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
  })
  const activeId = computed<string | undefined>(() =>
    expanded.value && active.value >= 0 ? `${uid}-option-${active.value}` : undefined
  )

  const { panelStyle } = usePlacement({
    triggerRef: fieldEl,
    panelRef: panelEl,
    isOpen: expanded,
    placement: 'bottom-start',
    offset: 4,
    matchTriggerWidth: true
  })

  const commitTyped = (): void => {
    const { property, operator, value } = parsed.value
    if (property && operator && value) {
      addToken({ propertyKey: property.key, operator, value })
      return
    }
    const typed = draft.value.trim()
    if (!property && typed && props.freeText) addToken({ operator: ':', value: typed })
  }

  const onKeydown = (event: KeyboardEvent): void => {
    const count = suggestions.value.length
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      open.value = true
      if (!count) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      active.value =
        active.value < 0 && step < 0 ? count - 1 : (active.value + step + count) % count
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const picked =
        expanded.value && active.value >= 0 ? suggestions.value[active.value] : undefined
      if (picked) picked.apply()
      else if (isQuery.value) submitQuery(event)
      else commitTyped()
      return
    }
    if (event.key === 'Escape') {
      if (expanded.value) {
        event.preventDefault()
        open.value = false
        active.value = -1
      } else if (isQuery.value && queryText.value) {
        event.preventDefault()
        setText('')
        touched.value = false
      } else if (!isQuery.value && draft.value) {
        event.preventDefault()
        draft.value = ''
      }
      return
    }
    if (isQuery.value) return
    if (event.key !== 'Backspace' || draft.value) return
    if (pendingGroup.value) {
      pendingGroup.value = false
      return
    }
    const lastGroup = groups.value.length - 1
    if (props.grouped && lastGroup >= 0) {
      removeGroupToken(lastGroup, (groups.value[lastGroup]?.tokens.length ?? 1) - 1)
    } else if (tokens.value.length) {
      removeToken(tokens.value.length - 1)
    }
  }

  const onInput = (value: string): void => {
    if (isQuery.value) setText(value)
    else draft.value = value
    open.value = true
    active.value = -1
  }

  const removeToken = (index: number): void => {
    commitQuery(
      withGroups(
        tokens.value.filter((_, i) => i !== index),
        groups.value
      )
    )
  }

  const removeGroupToken = (groupIndex: number, tokenIndex: number): void => {
    commitQuery(
      withGroups(
        tokens.value,
        groups.value.map((group, i) =>
          i === groupIndex
            ? {
                tokens: group.tokens.filter((_, j) => j !== tokenIndex),
                operation: group.operation
              }
            : group
        )
      )
    )
  }

  const setOperation = (value: string | undefined): void => {
    if (value !== 'and' && value !== 'or') return
    commitQuery(withGroups(tokens.value, groups.value, value))
  }

  const setGroupOperation = (groupIndex: number, value: string | undefined): void => {
    if (value !== 'and' && value !== 'or') return
    commitQuery(
      withGroups(
        tokens.value,
        groups.value.map((group, i) =>
          i === groupIndex ? { tokens: group.tokens, operation: value } : group
        )
      )
    )
  }

  const startGroup = (): void => {
    pendingGroup.value = true
    void nextTick(() => inputEl()?.focus())
  }

  const conditionCount = computed<number>(() => tokens.value.length + groups.value.length)
  const showTokenRow = computed<boolean>(
    () => !isQuery.value && (conditionCount.value > 0 || pendingGroup.value)
  )

  const clearAll = (): void => {
    pendingGroup.value = false
    commitQuery({ tokens: [], operation: operation.value })
    draft.value = ''
  }

  const operationOptions = computed(() => [
    { label: t('propertyFilter.matchAll'), value: 'and' },
    { label: t('propertyFilter.matchAny'), value: 'or' }
  ])

  const labelOf = (token: PropertyFilterToken): string => {
    if (!token.propertyKey) return `${operatorLabel(token.operator)}: ${token.value}`
    const loaded = loadedLabels.get(`${token.propertyKey}\u0000${token.value}`)
    return loaded
      ? tokenText({ ...token, value: loaded }, props.properties)
      : tokenText(token, props.properties)
  }

  const groupLabel = (group: Suggestion['group']): string => {
    if (group === 'properties') return t('propertyFilter.properties')
    if (group === 'values') return t('propertyFilter.values')
    if (group === 'fields') return t('propertyFilterQuery.fields')
    return ''
  }

  const onBlur = (): void => {
    open.value = false
    if (isQuery.value && queryText.value.trim()) touched.value = true
  }

  const portalLocale = usePortalLocale()
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    class="@container/property-filter flex w-full min-w-0 flex-col gap-(--spacing-xs)"
  >
    <div
      ref="fieldEl"
      :data-mode="mode"
      class="w-full min-w-0 [&[data-mode=query]_input]:text-label-code-sm"
    >
      <Input
        :model-value="isQuery ? queryText : draft"
        role="combobox"
        aria-autocomplete="list"
        autocomplete="off"
        :spellcheck="false"
        :aria-expanded="expanded"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        :aria-label="
          ariaLabel || (isQuery ? t('propertyFilterQuery.label') : t('propertyFilter.label'))
        "
        :aria-describedby="showError ? errorId : undefined"
        :placeholder="
          placeholder ||
          (isQuery ? t('propertyFilterQuery.placeholder') : t('propertyFilter.placeholder'))
        "
        :disabled="disabled"
        :invalid="showError"
        :data-testid="`${testId}__input`"
        size="medium"
        @update:model-value="onInput"
        @keydown="onKeydown"
        @input="syncCaret"
        @keyup="syncCaret"
        @click="syncCaret"
        @focus="open = true"
        @blur="onBlur"
      >
        <template #leading>
          <i
            class="ai ai-filter text-(--text-muted)"
            aria-hidden="true"
          />
        </template>
      </Input>
    </div>
    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <ul
          v-show="expanded"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          :id="listId"
          ref="panelEl"
          role="listbox"
          :aria-label="t('propertyFilter.suggestions')"
          :aria-busy="valueRows === 'loading' || undefined"
          :data-testid="`${testId}__suggestions`"
          :style="panelStyle"
          class="fixed z-(--z-control-overlay) flex max-h-80 flex-col gap-(--spacing-2xs) overflow-y-auto overscroll-contain rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-2xs) shadow-(--shadow-xs)"
        >
          <li
            v-for="section in sections"
            :key="section.id"
            role="presentation"
            class="flex flex-col gap-(--spacing-2xs)"
          >
            <span
              v-if="section.title"
              :id="section.id"
              :data-testid="`${testId}__section`"
              class="flex min-h-7 items-center px-(--spacing-sm) text-label-sm text-(--text-muted)"
              >{{ section.title }}</span
            >
            <ul
              :role="section.title ? 'group' : 'presentation'"
              :aria-labelledby="section.title ? section.id : undefined"
              class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
            >
              <li
                v-for="{ item, index } in section.items"
                :id="`${uid}-option-${index}`"
                :key="item.id"
                role="option"
                :aria-selected="index === active"
                :data-active="index === active || null"
                :data-group="item.group"
                :data-testid="`${testId}__option`"
                class="flex min-h-8 cursor-pointer items-center gap-(--spacing-sm) rounded-(--shape-control) px-(--spacing-sm) py-(--spacing-2xs) text-start text-label-sm text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) data-[active]:bg-(--bg-hover) motion-reduce:transition-none pointer-coarse:min-h-11"
                @mousedown.prevent
                @click="item.apply()"
                @keydown.enter.prevent="item.apply()"
              >
                <span class="min-w-0 flex-1 truncate"
                  ><bdi>{{ item.label }}</bdi></span
                >
                <span
                  v-if="item.count !== undefined"
                  :data-testid="`${testId}__count-value`"
                  class="shrink-0 text-label-sm text-(--text-muted) tabular-nums"
                  >{{ numberFormat.format(item.count) }}</span
                >
                <span
                  v-if="item.description"
                  class="shrink-0 text-(--text-muted)"
                  >{{ item.description }}</span
                >
                <span
                  v-else-if="groupLabel(item.group)"
                  class="shrink-0 text-label-sm text-(--text-muted)"
                  >{{ groupLabel(item.group) }}</span
                >
              </li>
            </ul>
          </li>
          <li
            v-if="valueRows === 'loading'"
            role="presentation"
            :data-testid="`${testId}__loading`"
            class="flex min-h-8 items-center gap-(--spacing-sm) px-(--spacing-sm) text-body-sm text-(--text-muted)"
          >
            <Spinner class="size-3.5" />
            {{ t('propertyFilter.loadingValues') }}
          </li>
          <li
            v-else-if="valueRows === 'error'"
            role="presentation"
            :data-testid="`${testId}__values-error`"
            class="flex min-h-8 items-center gap-(--spacing-sm) px-(--spacing-sm) text-body-sm text-(--text-default)"
          >
            <i
              class="ai ai-circle-alert shrink-0 text-(--danger)"
              aria-hidden="true"
            />
            {{ t('propertyFilter.valuesError') }}
          </li>
        </ul>
      </Transition>
    </Teleport>
    <div
      v-if="editorStage && $slots['value']"
      role="group"
      :aria-label="t('propertyFilter.valueEditor', { property: editorStage.property.label })"
      :data-testid="`${testId}__value-editor`"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
    >
      <slot
        name="value"
        :property="editorStage.property"
        :operator="editorStage.operator"
        :apply="applyCustom"
      />
    </div>
    <div
      v-if="isQuery"
      class="flex min-w-0 flex-wrap items-start gap-(--spacing-xs)"
    >
      <div
        aria-live="polite"
        class="min-w-0 flex-1"
      >
        <HelperText
          v-if="showError"
          :id="errorId"
          :label="queryError"
          :data-testid="`${testId}__error`"
          kind="invalid"
        />
      </div>
      <span
        v-if="totalCount !== undefined"
        role="status"
        :data-testid="`${testId}__count`"
        class="ms-auto text-label-sm text-(--text-muted) tabular-nums"
        >{{ t('propertyFilter.matches', { count: totalCount }) }}</span
      >
    </div>
    <div
      v-if="showTokenRow"
      role="group"
      :aria-label="t('propertyFilter.tokens')"
      :data-testid="`${testId}__tokens`"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    >
      <template
        v-for="(token, index) in tokens"
        :key="`${index}-${token.propertyKey ?? ''}-${token.operator}-${token.value}`"
      >
        <span
          v-if="index > 0"
          class="text-label-sm text-(--text-muted)"
          >{{ operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
        >
        <Chip
          :label="labelOf(token)"
          :disabled="disabled"
          :data-testid="`${testId}__token`"
          kind="filled"
          size="medium"
          removable
          class="max-w-full"
          @remove="removeToken(index)"
        />
      </template>
      <template
        v-for="(group, groupIndex) in groups"
        :key="`group-${groupIndex}`"
      >
        <span
          v-if="tokens.length || groupIndex > 0"
          class="text-label-sm text-(--text-muted)"
          >{{ operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
        >
        <div
          role="group"
          :aria-label="t('propertyFilter.group', { index: groupIndex + 1 })"
          :data-testid="`${testId}__group`"
          class="flex min-w-0 max-w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) px-(--spacing-xs) py-(--spacing-2xs)"
        >
          <template
            v-for="(token, index) in group.tokens"
            :key="`${groupIndex}-${index}-${token.propertyKey ?? ''}-${token.operator}-${token.value}`"
          >
            <span
              v-if="index > 0"
              class="text-label-sm text-(--text-muted)"
              >{{
                group.operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and')
              }}</span
            >
            <Chip
              :label="labelOf(token)"
              :disabled="disabled"
              :data-testid="`${testId}__token`"
              kind="filled"
              size="medium"
              removable
              class="max-w-full"
              @remove="removeGroupToken(groupIndex, index)"
            />
          </template>
          <ToggleGroup
            v-if="group.tokens.length > 1"
            :model-value="group.operation"
            :options="operationOptions"
            :aria-label="t('propertyFilter.groupOperation', { index: groupIndex + 1 })"
            :disabled="disabled"
            :data-testid="`${testId}__group-operation`"
            size="small"
            @update:model-value="setGroupOperation(groupIndex, $event)"
          />
        </div>
      </template>
      <template v-if="pendingGroup">
        <span
          v-if="conditionCount > 0"
          class="text-label-sm text-(--text-muted)"
          >{{ operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
        >
        <Chip
          :label="t('propertyFilter.newGroup')"
          :data-testid="`${testId}__pending-group`"
          kind="dashed"
          size="medium"
        />
      </template>
      <Button
        v-if="grouped && groups.length && !pendingGroup"
        :label="t('propertyFilter.addGroup')"
        :disabled="disabled"
        :data-testid="`${testId}__add-group`"
        icon="ai ai-plus"
        kind="transparent"
        size="small"
        @click="startGroup"
      />
      <ToggleGroup
        v-if="conditionCount > 1 && showOperations"
        :model-value="operation"
        :options="operationOptions"
        :aria-label="t('propertyFilter.operation')"
        :disabled="disabled"
        :data-testid="`${testId}__operation`"
        size="small"
        @update:model-value="setOperation"
      />
      <Button
        :label="t('propertyFilter.clear')"
        :disabled="disabled"
        :data-testid="`${testId}__clear`"
        kind="transparent"
        size="small"
        @click="clearAll"
      />
      <span
        v-if="totalCount !== undefined"
        role="status"
        :data-testid="`${testId}__count`"
        class="ms-auto text-label-sm text-(--text-muted) tabular-nums"
        >{{ t('propertyFilter.matches', { count: totalCount }) }}</span
      >
    </div>
  </div>
</template>
