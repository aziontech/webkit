<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import {
    type FilteringProperty,
    type PropertyFilterOperator,
    type PropertyFilterOption,
    type PropertyFilterQuery,
    type PropertyFilterToken
  } from '../../../composables/use-collection/lib/property-filter'
  import { useShortcuts } from '../../../composables/use-shortcuts'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import FieldError from '../../input/field/field-error/field-error.vue'
  import Input from '../../input/input/input.vue'
  import { usePropertyFilterDraft } from './composables/use-property-filter-draft'
  import { usePropertyFilterKeyboard } from './composables/use-property-filter-keyboard'
  import { usePropertyFilterQuery } from './composables/use-property-filter-query'
  import { usePropertyFilterTokens } from './composables/use-property-filter-tokens'
  import { capSuggestions } from './lib/suggestion'
  import PropertyFilterSuggestions from './parts/property-filter-suggestions.vue'
  import PropertyFilterTokens from './parts/property-filter-tokens.vue'
  import type { PropertyFilterQuerySuggestion, PropertyFilterSubmit } from './query-language'

  export type {
    FilteringProperty,
    PropertyFilterOperator,
    PropertyFilterOption,
    PropertyFilterQuery,
    PropertyFilterToken,
    PropertyFilterTokenGroup
  } from '../../../composables/use-collection/lib/property-filter'
  export type { PropertyFilterQuerySuggestion, PropertyFilterSubmit } from './query-language'

  defineOptions({ name: 'PropertyFilter', inheritAttrs: false })

  /** How the field edits the query. */
  export type PropertyFilterMode = 'tokens' | 'query'

  export interface PropertyFilterProps {
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

  const props = withDefaults(defineProps<PropertyFilterProps>(), {
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
  const { t } = useTranslate({ propertyFilter: en.propertyFilter })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'property-filter'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const uid = useId()
  const listId = `${uid}-suggestions`
  const errorId = `${uid}-error`

  const draft = ref<string>('')
  const open = ref<boolean>(false)
  const active = ref<number>(-1)
  const fieldEl = ref<HTMLElement | null>(null)
  const isQuery = computed<boolean>(() => props.mode === 'query')

  const inputEl = (): HTMLInputElement | null | undefined => fieldEl.value?.querySelector('input')
  const focusInput = (): void => {
    void nextTick(() => inputEl()?.focus())
  }

  const tokenState = usePropertyFilterTokens({
    query,
    disabled: () => props.disabled,
    grouped: () => props.grouped
  })
  const { operation, conditionCount } = tokenState

  const setDraft = (value: string): void => {
    draft.value = value
    active.value = -1
  }

  const addToken = (token: PropertyFilterToken): void => {
    tokenState.addToken(token)
    setDraft('')
  }

  const draftState = usePropertyFilterDraft({
    draft,
    query: isQuery,
    properties: () => props.properties,
    freeText: () => props.freeText,
    loadValues: () => props.loadValues,
    t,
    setDraft,
    addToken
  })
  const { editorStage, valueRows, labelOf } = draftState

  const applyCustom = (value: string): void => {
    if (draftState.applyCustom(value)) focusInput()
  }

  const queryState = usePropertyFilterQuery({
    text: queryText,
    enabled: isQuery,
    properties: () => props.properties,
    freeText: () => props.freeText,
    validate: () => props.validate,
    suggest: () => props.suggest,
    t,
    onInsert: (position) => {
      active.value = -1
      open.value = true
      void nextTick(() => inputEl()?.setSelectionRange(position, position))
    }
  })
  const { showError, syncCaret, error: queryError } = queryState

  useShortcuts({
    keys: '/',
    label: () => t('propertyFilter.focusShortcut'),
    element: () => fieldEl.value,
    when: () => !props.disabled,
    handler: () => inputEl()?.focus()
  })

  const suggestions = computed(() =>
    capSuggestions(isQuery.value ? queryState.suggestions.value : draftState.suggestions.value)
  )

  const expanded = computed<boolean>(
    () =>
      open.value && !props.disabled && (suggestions.value.length > 0 || valueRows.value !== null)
  )

  const activeId = computed<string | undefined>(() =>
    expanded.value && active.value >= 0 ? `${uid}-option-${active.value}` : undefined
  )

  const submitQuery = (event: KeyboardEvent): void => {
    if (props.disabled) return
    queryState.touch(true)
    if (queryState.error.value) return
    open.value = false
    active.value = -1
    emit('submit', event, queryState.payload(operation.value))
  }

  const { onKeydown } = usePropertyFilterKeyboard({
    suggestions,
    expanded,
    query: isQuery,
    open,
    active,
    draft,
    text: queryText,
    submit: submitQuery,
    commitTyped: draftState.commitTyped,
    removeLast: tokenState.removeLast,
    resetQuery: () => {
      queryText.value = ''
      queryState.touch(false)
    }
  })

  const onInput = (value: string): void => {
    if (isQuery.value) queryText.value = value
    else draft.value = value
    open.value = true
    active.value = -1
  }

  const startGroup = (): void => {
    tokenState.startGroup()
    focusInput()
  }

  const showTokenRow = computed<boolean>(
    () => !isQuery.value && (conditionCount.value > 0 || tokenState.pendingGroup.value)
  )

  const clearAll = (): void => {
    tokenState.clearAll()
    draft.value = ''
  }

  const onBlur = (): void => {
    open.value = false
    if (isQuery.value && queryText.value.trim()) queryState.touch(true)
  }
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
      class="w-full min-w-0"
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
          ariaLabel || (isQuery ? t('propertyFilter.queryLabel') : t('propertyFilter.label'))
        "
        :aria-describedby="showError ? errorId : undefined"
        :placeholder="
          placeholder ||
          (isQuery ? t('propertyFilter.queryPlaceholder') : t('propertyFilter.placeholder'))
        "
        :disabled="disabled"
        :invalid="showError"
        :monospace="isQuery"
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
            class="az az-filter text-(--text-muted)"
            aria-hidden="true"
          />
        </template>
      </Input>
    </div>
    <PropertyFilterSuggestions
      :anchor="fieldEl"
      :suggestions="suggestions"
      :active="active"
      :open="expanded"
      :value-rows="valueRows"
      :list-id="listId"
      :uid="uid"
      :test-id="testId"
    />
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
        <FieldError
          v-if="showError"
          :id="errorId"
          :data-testid="`${testId}__error`"
          >{{ queryError }}</FieldError
        >
      </div>
      <span
        v-if="totalCount !== undefined"
        role="status"
        :data-testid="`${testId}__count`"
        class="ms-auto text-label-sm text-(--text-muted) tabular-nums"
        >{{ t('propertyFilter.matches', { count: totalCount }) }}</span
      >
    </div>
    <PropertyFilterTokens
      v-if="showTokenRow"
      :filter="tokenState"
      :label-of="labelOf"
      :total-count="totalCount"
      :disabled="disabled"
      :grouped="grouped"
      :show-operations="showOperations"
      :test-id="testId"
      @add-group="startGroup"
      @clear="clearAll"
    />
  </div>
</template>
