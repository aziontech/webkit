<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import {
    type FilteringProperty,
    operatorsOf,
    parseFilterText,
    type PropertyFilterOperation,
    type PropertyFilterOperator,
    type PropertyFilterQuery,
    type PropertyFilterToken,
    tokenText
  } from '../../../composables/use-collection/property-filter'
  import { usePortalLocale, useTranslate } from '../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../composables/use-placement'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import Chip from '../../inputs/chip/chip.vue'
  import HelperText from '../../inputs/helper-text/helper-text.vue'
  import Input from '../../inputs/input/input.vue'
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
    PropertyFilterQuery,
    PropertyFilterToken
  } from '../../../composables/use-collection/property-filter'
  export type { PropertyFilterQuerySuggestion, PropertyFilterSubmit } from './query-language'

  type Suggestion = {
    id: string
    group: 'properties' | 'operators' | 'values' | 'text' | 'fields' | 'connectives'
    label: string
    description: string
    apply: () => void
  }

  defineOptions({
    name: 'PropertyFilter',
    inheritAttrs: false
  })

  interface Props {
    /** The tokens and how they combine. Supports v-model:query. */
    query?: PropertyFilterQuery
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
    mode?: 'tokens' | 'query'
    /** The query string in query mode. Supports v-model:text. */
    text?: string
    /** Checks the query string in query mode: '' when valid, else the message shown under the field. Replaces the built-in check. */
    validate?: (text: string) => string
    /** Suggestions for the word at the caret in query mode. Replaces the built-in field, operator, value and AND / OR suggestions. */
    suggest?: (text: string, caret: number) => PropertyFilterQuerySuggestion[]
  }

  const props = withDefaults(defineProps<Props>(), {
    query: undefined,
    properties: () => [],
    totalCount: undefined,
    placeholder: '',
    ariaLabel: '',
    freeText: true,
    disabled: false,
    mode: 'tokens',
    text: undefined,
    validate: undefined,
    suggest: undefined
  })

  const emit = defineEmits<{
    'update:query': [query: PropertyFilterQuery]
    'update:text': [text: string]
    submit: [payload: PropertyFilterSubmit]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({
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

  const internal = ref<PropertyFilterQuery>(props.query ?? { tokens: [], operation: 'and' })
  watch(
    () => props.query,
    (next) => {
      if (next) internal.value = next
    }
  )
  const tokens = computed<PropertyFilterToken[]>(() => internal.value.tokens)
  const operation = computed<PropertyFilterOperation>(() => internal.value.operation)

  const commitQuery = (next: PropertyFilterQuery): void => {
    internal.value = next
    emit('update:query', next)
  }

  const draft = ref<string>('')
  const open = ref<boolean>(false)
  const active = ref<number>(-1)
  const fieldRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)

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
    commitQuery({ tokens: [...tokens.value, token], operation: operation.value })
    draft.value = ''
    active.value = -1
  }

  const parsed = computed(() => parseFilterText(draft.value, props.properties))

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
            apply: () => {
              draft.value = `${property.label} ${op} `
              active.value = -1
            }
          })
        )
      return out
    }
    const needle = value.toLocaleLowerCase()
    ;(property.options ?? [])
      .filter((o) => (o.label ?? o.value).toLocaleLowerCase().includes(needle))
      .forEach((o) =>
        out.push({
          id: `v-${property.key}-${o.value}`,
          group: 'values',
          label: `${property.label} ${operator} ${o.label ?? o.value}`,
          description: '',
          apply: () => addToken({ propertyKey: property.key, operator, value: o.value })
        })
      )
    if (value && !property.options?.some((o) => o.value === value)) {
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

  const isQuery = computed<boolean>(() => props.mode === 'query')
  const queryText = ref<string>(props.text ?? '')
  watch(
    () => props.text,
    (next) => {
      if (next !== undefined) queryText.value = next
    }
  )
  const caret = ref<number>(queryText.value.length)
  const touched = ref<boolean>(false)

  const setText = (value: string): void => {
    queryText.value = value
    emit('update:text', value)
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

  const inputEl = (): HTMLInputElement | null | undefined => fieldRef.value?.querySelector('input')

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

  const suggestions = computed<Suggestion[]>(() =>
    isQuery.value ? querySuggestions.value : tokenSuggestions.value
  )

  const syncCaret = (event: Event): void => {
    const target = event.target as HTMLInputElement | null
    if (isQuery.value && typeof target?.selectionStart === 'number') {
      caret.value = target.selectionStart
    }
  }

  const submitQuery = (): void => {
    touched.value = true
    if (queryError.value) return
    open.value = false
    active.value = -1
    emit('submit', {
      text: queryText.value,
      query: queryText.value.trim()
        ? flatQuery(builtInParse.value)
        : { tokens: [], operation: operation.value }
    })
  }

  const expanded = computed<boolean>(
    () => open.value && !props.disabled && suggestions.value.length > 0
  )
  const activeId = computed<string | undefined>(() =>
    expanded.value && active.value >= 0 ? `${uid}-option-${active.value}` : undefined
  )

  const { panelStyle } = usePlacement({
    triggerRef: fieldRef,
    panelRef,
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
      else if (isQuery.value) submitQuery()
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
    if (event.key === 'Backspace' && !draft.value && tokens.value.length) {
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
    commitQuery({
      tokens: tokens.value.filter((_, i) => i !== index),
      operation: operation.value
    })
  }

  const setOperation = (value: string | undefined): void => {
    if (value !== 'and' && value !== 'or') return
    commitQuery({ tokens: tokens.value, operation: value })
  }

  const clearAll = (): void => {
    commitQuery({ tokens: [], operation: operation.value })
    draft.value = ''
  }

  const operationOptions = computed(() => [
    { label: t('propertyFilter.matchAll'), value: 'and' },
    { label: t('propertyFilter.matchAny'), value: 'or' }
  ])

  const labelOf = (token: PropertyFilterToken): string =>
    token.propertyKey
      ? tokenText(token, props.properties)
      : `${operatorLabel(token.operator)}: ${token.value}`

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
      ref="fieldRef"
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
        <template #iconLeft>
          <i
            class="pi pi-filter text-(--text-muted)"
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
          ref="panelRef"
          role="listbox"
          :aria-label="t('propertyFilter.suggestions')"
          :data-testid="`${testId}__suggestions`"
          :style="panelStyle"
          class="fixed z-(--z-input-overlay) flex max-h-80 flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xxs) shadow-(--shadow-xs)"
        >
          <li
            v-for="(item, index) in suggestions"
            :id="`${uid}-option-${index}`"
            :key="item.id"
            role="option"
            :aria-selected="index === active"
            :data-active="index === active || null"
            :data-group="item.group"
            :data-testid="`${testId}__option`"
            class="flex min-h-8 cursor-pointer items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xxs) text-start text-label-sm text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) data-[active]:bg-(--bg-hover) motion-reduce:transition-none pointer-coarse:min-h-11"
            @mousedown.prevent
            @click="item.apply()"
            @keydown.enter.prevent="item.apply()"
          >
            <span class="min-w-0 flex-1 truncate"
              ><bdi>{{ item.label }}</bdi></span
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
      </Transition>
    </Teleport>
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
      v-if="!isQuery && tokens.length"
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
      <ToggleGroup
        v-if="tokens.length > 1"
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
