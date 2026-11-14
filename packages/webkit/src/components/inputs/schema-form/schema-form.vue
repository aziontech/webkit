<script setup lang="ts">
  import { createReusableTemplate } from '@vueuse/core'
  import { computed, markRaw, nextTick, onBeforeUnmount, reactive, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Accordion from '../../content/accordion/accordion.vue'
  import AccordionContent from '../../content/accordion/accordion-content/accordion-content.vue'
  import AccordionItem from '../../content/accordion/accordion-item/accordion-item.vue'
  import AccordionTrigger from '../../content/accordion/accordion-trigger/accordion-trigger.vue'
  import AttributeEditor from '../attribute-editor/attribute-editor.vue'
  import Combobox from '../combobox/combobox.vue'
  import Field from '../field/field.vue'
  import FieldDescription from '../field/field-description/field-description.vue'
  import FieldError from '../field/field-error/field-error.vue'
  import FieldGroup from '../field/field-group/field-group.vue'
  import FieldLabel from '../field/field-label/field-label.vue'
  import FieldLegend from '../field/field-legend/field-legend.vue'
  import FieldSet from '../field/field-set/field-set.vue'
  import Input from '../input/input.vue'
  import MultiSelect from '../multi-select/multi-select.vue'
  import MultiSelectContent from '../multi-select/multi-select-content/multi-select-content.vue'
  import MultiSelectOption from '../multi-select/multi-select-option/multi-select-option.vue'
  import MultiSelectTrigger from '../multi-select/multi-select-trigger/multi-select-trigger.vue'
  import PasswordInput from '../password-input/password-input.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectOption from '../select/select-option/select-option.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import Switch from '../switch/switch.vue'
  import Textarea from '../textarea/textarea.vue'
  import {
    buildNodes,
    expand,
    getAt,
    leavesOf,
    listLines,
    parseNumber,
    type SchemaFormIssue,
    type SchemaFormNode,
    type SchemaFormOption,
    type SchemaFormSchema,
    type SchemaFormUi,
    setAt,
    validateNode
  } from './schema'

  export type {
    SchemaFormNode,
    SchemaFormOption,
    SchemaFormOptionsLoader,
    SchemaFormSchema,
    SchemaFormSection,
    SchemaFormType,
    SchemaFormUi,
    SchemaFormVariant,
    SchemaFormWhen,
    SchemaFormWidget
  } from './schema'

  /** The object the form edits. */
  export type SchemaFormValue = Record<string, unknown>

  /** Messages keyed by field path (`origin.host`). */
  export type SchemaFormErrors = Record<string, string>

  /** When a field first shows its own validation message. */
  export type SchemaFormValidateOn = 'blur' | 'submit'

  /** What `validate()` returns. */
  export interface SchemaFormValidation {
    valid: boolean
    errors: SchemaFormErrors
  }

  defineOptions({
    name: 'SchemaForm',
    inheritAttrs: false
  })

  interface Props {
    /** JSON schema of an object (draft-07 subset); each property becomes a Field. */
    schema: SchemaFormSchema
    /** Server or external messages by field path; a field shows its message until it is edited. */
    errors?: SchemaFormErrors
    /** Presentation overrides by field path (`''` is the root, `*` a repeat item): widget, placeholder, hidden, order, when, options and sections. */
    ui?: Record<string, SchemaFormUi>
    /** When fields first show their validation message: on leaving the field, or only after `validate()`. */
    validateOn?: SchemaFormValidateOn
    /** Disables every field. */
    disabled?: boolean
    /** Shows every value without letting it change. */
    readonly?: boolean
  }

  /** Scope of a `field:<path>` slot, which replaces that field's control. */
  export interface SchemaFormFieldSlotProps {
    path: string
    schema: SchemaFormSchema
    value: unknown
    setValue: (value: unknown) => void
    invalid: boolean
    error: string
    required: boolean
    disabled: boolean
    readonly: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    errors: () => ({}),
    ui: () => ({}),
    validateOn: 'blur',
    disabled: false,
    readonly: false
  })

  const model = defineModel<SchemaFormValue>({ default: () => ({}) })

  defineSlots<{
    [slot: `field:${string}`]: (props: SchemaFormFieldSlotProps) => unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ schemaForm: en.schemaForm })
  const [DefineNodes, ReuseNodes] = createReusableTemplate<{ nodes: SchemaFormNode[] }>()

  const rootRef = ref<HTMLElement | null>(null)
  const touched = reactive(new Set<string>())
  const dismissed = reactive(new Set<string>())
  const drafts = reactive(new Map<string, { text: string; snapshot: string }>())
  const submitted = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-schema-form')
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  type MapRow = { key: string; value: string }
  type OptionState = {
    options: SchemaFormOption[]
    loading: boolean
    failed: boolean
    request: number
  }

  const nodes = computed(() => buildNodes(props.schema, props.ui))

  const value = computed<SchemaFormValue>(() => model.value ?? {})
  const valueAt = (path: string) => getAt(value.value, path)
  const snapshotOf = (path: string) => JSON.stringify(valueAt(path) ?? null)

  const tree = computed(() => expand(nodes.value, value.value, props.ui))
  const leaves = computed(() => leavesOf(tree.value.nodes))

  const stash = new Map<string, unknown>()
  let seen = new Set<string>()

  const reconcile = () => {
    let next = value.value
    const known = new Set(seen)
    let current: SchemaFormNode[] = []
    for (let pass = 0; pass < 5; pass += 1) {
      const view = expand(nodes.value, next, props.ui)
      let changed = false
      for (const path of view.hidden) {
        const held = getAt(next, path)
        if (held === undefined) continue
        stash.set(path, held)
        next = setAt(next, path, undefined)
        changed = true
      }
      current = leavesOf(view.nodes)
      for (const leaf of current) {
        if (known.has(leaf.path)) continue
        known.add(leaf.path)
        if (getAt(next, leaf.path) !== undefined) continue
        const restored = stash.get(leaf.path)
        stash.delete(leaf.path)
        const seed = restored ?? leaf.schema.default
        if (seed === undefined) continue
        next = setAt(next, leaf.path, restored ?? structuredClone(seed))
        changed = true
      }
      if (!changed) break
    }
    seen = new Set(current.map((leaf) => leaf.path))
    if (next !== value.value) model.value = next
  }

  watch(
    nodes,
    () => {
      seen = new Set()
      reconcile()
    },
    { immediate: true }
  )

  watch(value, reconcile, { deep: true })

  watch(
    value,
    () => {
      for (const [path, draft] of drafts) {
        if (snapshotOf(path) !== draft.snapshot) drafts.delete(path)
      }
    },
    { deep: true }
  )

  watch(
    () => props.errors,
    () => dismissed.clear(),
    { deep: true }
  )

  const write = (path: string, next: unknown) => {
    model.value = setAt(value.value, path, next)
    dismissed.add(path)
  }

  const setValue = (node: SchemaFormNode, next: unknown) => {
    drafts.delete(node.path)
    write(node.path, next === '' || next === null ? undefined : next)
  }

  const setDraft = (node: SchemaFormNode, text: string, parsed: unknown) => {
    write(node.path, parsed)
    drafts.set(node.path, { text, snapshot: snapshotOf(node.path) })
  }

  const setNumber = (node: SchemaFormNode, text: string) => {
    const parsed = parseNumber(text)
    setDraft(node, text, parsed === undefined || Number.isNaN(parsed) ? undefined : parsed)
  }

  const setList = (node: SchemaFormNode, text: string) => {
    const lines = listLines(text)
    const items =
      node.itemType === 'string'
        ? lines
        : lines.map((line) => Number(line)).filter((item) => Number.isFinite(item))
    setDraft(node, text, items.length ? items : undefined)
  }

  const setJson = (node: SchemaFormNode, text: string) => {
    let parsed: unknown
    try {
      parsed = text.trim() ? JSON.parse(text) : undefined
    } catch {
      parsed = undefined
    }
    setDraft(node, text, parsed)
  }

  const setOption = (node: SchemaFormNode, selected: unknown) => {
    const match = node.options.find((option) => String(option) === String(selected))
    setValue(node, match)
  }

  const optionStates = reactive(new Map<string, OptionState>())
  const searchTimers = new Map<string, ReturnType<typeof setTimeout>>()

  const stateOf = (node: SchemaFormNode): OptionState => {
    if (!optionStates.has(node.path))
      optionStates.set(node.path, { options: [], loading: false, failed: false, request: 0 })
    return optionStates.get(node.path) as OptionState
  }

  const loadOptions = async (node: SchemaFormNode, query: string) => {
    if (!node.load) return
    const state = stateOf(node)
    state.request += 1
    const request = state.request
    state.loading = true
    state.failed = false
    try {
      const list = await node.load(query)
      if (state.request === request) state.options = Array.isArray(list) ? list : []
    } catch {
      if (state.request === request) {
        state.options = []
        state.failed = true
      }
    } finally {
      if (state.request === request) state.loading = false
    }
  }

  const searchOptions = (node: SchemaFormNode, query: string) => {
    clearTimeout(searchTimers.get(node.path))
    searchTimers.set(
      node.path,
      setTimeout(() => {
        searchTimers.delete(node.path)
        void loadOptions(node, query)
      }, 250)
    )
  }

  watch(
    leaves,
    (list) => {
      for (const node of list) {
        if (node.load && !optionStates.has(node.path)) void loadOptions(node, '')
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    for (const timer of searchTimers.values()) clearTimeout(timer)
    searchTimers.clear()
  })

  const optionsOf = (node: SchemaFormNode) => optionStates.get(node.path)?.options ?? []

  const comboOptionsOf = (node: SchemaFormNode) =>
    optionsOf(node).map((option) => ({
      value: String(option.value),
      label: option.label,
      description: option.description
    }))

  const setChoice = (node: SchemaFormNode, text: string) => {
    if (!text) {
      setValue(node, undefined)
      return
    }
    const match = optionsOf(node).find((option) => String(option.value) === text)
    const numeric = node.type === 'number' || node.type === 'integer'
    setValue(node, match ? match.value : numeric ? Number(text) : text)
  }

  const listAt = (path: string): unknown[] => {
    const current = valueAt(path)
    return Array.isArray(current) ? current : []
  }

  const repeatTokens = new Map<string, object[]>()

  const tokensOf = (node: SchemaFormNode) => {
    const length = listAt(node.path).length
    let tokens = repeatTokens.get(node.path) ?? []
    if (tokens.length !== length) {
      tokens = tokens.slice(0, length)
      while (tokens.length < length) tokens.push(markRaw({}))
      repeatTokens.set(node.path, tokens)
    }
    return tokens
  }

  const newToken = () => markRaw({})

  const setRepeat = (node: SchemaFormNode, next: object[]) => {
    const previous = repeatTokens.get(node.path) ?? []
    const items = listAt(node.path)
    const list = next.map((token) => {
      const index = previous.indexOf(token)
      return index >= 0 ? (items[index] ?? {}) : {}
    })
    repeatTokens.set(node.path, next)
    setValue(node, list.length ? list : undefined)
  }

  const mapRowsStore = new Map<string, MapRow[]>()
  const mapVersion = ref(0)

  const objectOf = (rows: MapRow[]) =>
    Object.fromEntries(
      rows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value])
    )

  const mapRowsOf = (node: SchemaFormNode): MapRow[] => {
    void mapVersion.value
    const current = valueAt(node.path)
    const record = typeof current === 'object' && current && !Array.isArray(current) ? current : {}
    const stored = mapRowsStore.get(node.path)
    if (stored && JSON.stringify(objectOf(stored)) === JSON.stringify(record)) return stored
    const rows = Object.entries(record).map(([key, item]) => ({ key, value: String(item ?? '') }))
    mapRowsStore.set(node.path, rows)
    return rows
  }

  const setMap = (node: SchemaFormNode, rows: MapRow[]) => {
    mapRowsStore.set(node.path, rows)
    mapVersion.value += 1
    const record = objectOf(rows)
    setValue(node, Object.keys(record).length ? record : undefined)
  }

  const duplicateRows = (node: SchemaFormNode) => {
    const rows = mapRowsOf(node)
    const keys = rows.map((row) => row.key.trim())
    return rows.map((_, index) => Boolean(keys[index]) && keys.indexOf(keys[index] ?? '') !== index)
  }

  const mapErrorsOf = (node: SchemaFormNode) =>
    duplicateRows(node).map((duplicate) =>
      duplicate ? { key: t('schemaForm.duplicateKey') } : undefined
    )

  const mapColumns = computed(() => [
    { key: 'key', label: t('schemaForm.mapKey') },
    { key: 'value', label: t('schemaForm.mapValue') }
  ])

  const itemLabelOf = (node: SchemaFormNode, index: number) =>
    (node.schema.items as SchemaFormSchema | undefined)?.title
      ? `${(node.schema.items as SchemaFormSchema).title} ${index + 1}`
      : t('schemaForm.item', { index: index + 1 })

  const openSections = reactive(new Set<string>())

  const toggleSection = (node: SchemaFormNode, next: unknown) => {
    if (next === node.path) openSections.add(node.path)
    else openSections.delete(node.path)
  }

  const sectionsHolding = (list: SchemaFormNode[], path: string): SchemaFormNode[] => {
    for (const node of list) {
      if (node.path === path) return []
      const inner = [...node.children, ...node.entries.flat()]
      if (!inner.length) continue
      const found = sectionsHolding(inner, path)
      if (found.length || inner.some((child) => child.path === path))
        return node.widget === 'section' ? [node, ...found] : found
    }
    return []
  }

  const optionLabelOf = (node: SchemaFormNode, selected: unknown) =>
    selected === undefined || selected === null
      ? ''
      : (node.optionLabels[String(selected)] ?? String(selected))

  const textOf = (node: SchemaFormNode) => {
    const draft = drafts.get(node.path)
    if (draft) return draft.text
    const current = valueAt(node.path)
    if (current === undefined || current === null) return ''
    if (node.widget === 'list' && Array.isArray(current)) return current.join('\n')
    if (node.widget === 'json') return JSON.stringify(current, null, 2)
    return String(current)
  }

  const issueOf = (node: SchemaFormNode): SchemaFormIssue | null =>
    validateNode(node, valueAt(node.path), drafts.get(node.path)?.text)

  const messageOf = (issue: SchemaFormIssue) => {
    const message = t(`schemaForm.${issue.key}`, issue.params)
    return issue.line ? t('schemaForm.listItem', { line: issue.line, message }) : message
  }

  const errorOf = (node: SchemaFormNode) => {
    const server = props.errors[node.path]
    if (server && !dismissed.has(node.path)) return server
    if (!submitted.value && !(props.validateOn === 'blur' && touched.has(node.path))) return ''
    const issue = issueOf(node)
    return issue ? messageOf(issue) : ''
  }

  const isDisabled = (node: SchemaFormNode) => props.disabled || (node.readOnly && !props.readonly)
  const isReadonly = (node: SchemaFormNode) => props.readonly || node.readOnly

  const placeholderOf = (node: SchemaFormNode) => {
    if (node.placeholder) return node.placeholder
    if (node.widget === 'select' || node.widget === 'multiselect')
      return t('schemaForm.selectPlaceholder')
    if (node.widget === 'combobox') return t('schemaForm.searchPlaceholder')
    if (node.widget === 'password' && node.writeOnly && !node.required)
      return t('schemaForm.writeOnlyPlaceholder')
    if (node.format === 'date') return t('schemaForm.datePlaceholder')
    if (node.widget === 'list') return t('schemaForm.listPlaceholder')
    if (node.widget === 'json') return t('schemaForm.jsonPlaceholder')
    if (node.widget === 'number')
      return node.schema.minimum !== undefined
        ? t('schemaForm.numberFrom', { min: node.schema.minimum })
        : t('schemaForm.numberPlaceholder')
    return undefined
  }

  const onFocusOut = (node: SchemaFormNode, event: globalThis.FocusEvent) => {
    const next = event.relatedTarget as HTMLElement | null
    const field = event.currentTarget as HTMLElement | null
    if (next && (field?.contains(next) || next.closest('[role="listbox"]'))) return
    touched.add(node.path)
  }

  const slotProps = (node: SchemaFormNode): SchemaFormFieldSlotProps => {
    const error = errorOf(node)
    return {
      path: node.path,
      schema: node.schema,
      value: valueAt(node.path),
      setValue: (next: unknown) => setValue(node, next),
      invalid: Boolean(error),
      error,
      required: node.required,
      disabled: isDisabled(node),
      readonly: isReadonly(node)
    }
  }

  const validate = async (): Promise<SchemaFormValidation> => {
    submitted.value = true
    const errors: SchemaFormErrors = {}
    for (const node of leaves.value) {
      const duplicate = node.widget === 'map' && duplicateRows(node).some(Boolean)
      const message = errorOf(node) || (duplicate ? t('schemaForm.duplicateKey') : '')
      if (message) errors[node.path] = message
    }
    const first = Object.keys(errors)[0]
    if (first) {
      for (const section of sectionsHolding(tree.value.nodes, first)) openSections.add(section.path)
      await nextTick()
      const field = rootRef.value?.querySelector<HTMLElement>(`[data-path="${CSS.escape(first)}"]`)
      field
        ?.querySelector<HTMLElement>('input, textarea, button, [tabindex]:not([tabindex="-1"])')
        ?.focus()
    }
    return { valid: !first, errors }
  }

  const clearValidation = () => {
    submitted.value = false
    touched.clear()
    drafts.clear()
  }

  defineExpose({ validate, clearValidation })
</script>

<template>
  <DefineNodes v-slot="{ nodes: list }">
    <template
      v-for="node in list"
      :key="node.path"
    >
      <FieldSet
        key="fieldset"
        v-if="node.widget === 'fieldset'"
        :data-path="node.path"
        :data-testid="`${testId}__set`"
      >
        <FieldLegend>{{ node.label }}</FieldLegend>
        <FieldDescription v-if="node.description">{{ node.description }}</FieldDescription>
        <FieldGroup>
          <ReuseNodes :nodes="node.children" />
        </FieldGroup>
      </FieldSet>
      <FieldSet
        key="section"
        v-else-if="node.widget === 'section' && !node.collapsed"
        :data-path="node.path"
        data-widget="section"
        :data-testid="`${testId}__section`"
      >
        <FieldLegend>{{ node.label || t('schemaForm.advanced') }}</FieldLegend>
        <FieldDescription v-if="node.description">{{ node.description }}</FieldDescription>
        <FieldGroup>
          <ReuseNodes :nodes="node.children" />
        </FieldGroup>
      </FieldSet>
      <Accordion
        v-else-if="node.widget === 'section'"
        :model-value="openSections.has(node.path) ? node.path : null"
        :data-path="node.path"
        data-widget="section"
        :data-testid="`${testId}__section`"
        @update:model-value="toggleSection(node, $event)"
      >
        <AccordionItem :value="node.path">
          <AccordionTrigger>{{ node.label || t('schemaForm.advanced') }}</AccordionTrigger>
          <AccordionContent>
            <div
              class="flex min-w-0 flex-col gap-(--spacing-md) pb-(--spacing-md) text-(--text-default)"
            >
              <p
                v-if="node.description"
                class="m-0 text-body-sm text-(--text-muted)"
              >
                {{ node.description }}
              </p>
              <FieldGroup>
                <ReuseNodes :nodes="node.children" />
              </FieldGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <FieldSet
        key="collection"
        v-else-if="node.widget === 'repeat' || node.widget === 'map'"
        :data-path="node.path"
        :data-widget="node.widget"
        :data-testid="`${testId}__set`"
        @focusout="onFocusOut(node, $event)"
      >
        <FieldLegend>{{ node.label }}</FieldLegend>
        <FieldDescription v-if="node.description && !errorOf(node)">{{
          node.description
        }}</FieldDescription>
        <AttributeEditor
          key="repeat"
          v-if="node.widget === 'repeat'"
          :items="tokensOf(node)"
          :new-item="newToken"
          :min-items="node.schema.minItems ?? 0"
          :limit="node.schema.maxItems"
          :disabled="isDisabled(node) || isReadonly(node)"
          :aria-label="node.label"
          @update:items="setRepeat(node, $event)"
        >
          <template #row="scope">
            <div
              role="group"
              :aria-label="itemLabelOf(node, scope.index)"
              class="flex min-w-0 flex-col gap-(--spacing-md) rounded-(--shape-card) border border-(--border-muted) p-(--spacing-md)"
              :data-testid="`${testId}__item`"
            >
              <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{
                  itemLabelOf(node, scope.index)
                }}</span>
                <IconButton
                  v-if="scope.removable"
                  icon="pi pi-trash"
                  kind="outlined"
                  size="small"
                  :aria-label="scope.removeLabel"
                  :data-testid="`${testId}__remove`"
                  @click="scope.remove($event)"
                />
              </div>
              <FieldGroup>
                <ReuseNodes :nodes="node.entries[scope.index] ?? []" />
              </FieldGroup>
            </div>
          </template>
        </AttributeEditor>
        <AttributeEditor
          key="map"
          v-else
          :items="mapRowsOf(node)"
          :definition="mapColumns"
          :errors="mapErrorsOf(node)"
          :new-item="() => ({ key: '', value: '' })"
          :disabled="isDisabled(node) || isReadonly(node)"
          :aria-label="node.label"
          @update:items="setMap(node, $event as MapRow[])"
        />
        <FieldError
          v-if="errorOf(node)"
          :data-testid="`${testId}__error`"
          >{{ errorOf(node) }}</FieldError
        >
      </FieldSet>
      <Field
        v-else
        :data-path="node.path"
        :data-widget="node.widget"
        :data-testid="`${testId}__field`"
        :required="node.required"
        :invalid="Boolean(errorOf(node))"
        :disabled="isDisabled(node)"
        @focusout="onFocusOut(node, $event)"
      >
        <FieldLabel>{{ node.label }}</FieldLabel>
        <slot
          :name="`field:${node.path}`"
          v-bind="slotProps(node)"
        >
          <Switch
            v-if="node.widget === 'switch'"
            :model-value="valueAt(node.path) === true"
            :disabled="isDisabled(node) || isReadonly(node)"
            @update:model-value="setValue(node, $event)"
          />
          <Combobox
            v-else-if="node.widget === 'combobox'"
            :model-value="valueAt(node.path) === undefined ? '' : String(valueAt(node.path))"
            :options="comboOptionsOf(node)"
            :loading="optionStates.get(node.path)?.loading ?? false"
            :filter="false"
            :allow-custom="false"
            :clearable="!node.required && !isReadonly(node)"
            :empty-text="optionStates.get(node.path)?.failed ? t('schemaForm.optionsError') : ''"
            size="large"
            class="w-full"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            @update:model-value="setChoice(node, $event)"
            @search="searchOptions(node, $event)"
          />
          <MultiSelect
            v-else-if="node.widget === 'multiselect'"
            :model-value="listAt(node.path)"
            size="large"
            class="w-full"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            @update:model-value="setValue(node, $event.length ? $event : undefined)"
          >
            <MultiSelectTrigger />
            <MultiSelectContent>
              <MultiSelectOption
                v-for="option in optionsOf(node)"
                :key="String(option.value)"
                :value="option.value"
                >{{ option.label || option.value }}</MultiSelectOption
              >
            </MultiSelectContent>
          </MultiSelect>
          <PasswordInput
            v-else-if="node.widget === 'password'"
            key="password"
            :model-value="textOf(node)"
            class="w-full"
            :autocomplete="node.writeOnly ? 'new-password' : 'current-password'"
            :max-length="node.schema.maxLength"
            :placeholder="placeholderOf(node) ?? ''"
            :readonly="isReadonly(node)"
            @update:model-value="setValue(node, $event)"
          />
          <Select
            v-else-if="node.widget === 'select'"
            :model-value="valueAt(node.path) === undefined ? undefined : String(valueAt(node.path))"
            size="large"
            class="w-full"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            :display-value="(selected: unknown) => optionLabelOf(node, selected)"
            @update:model-value="setOption(node, $event)"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectOption
                v-for="option in node.options"
                :key="String(option)"
                :value="String(option)"
              >
                {{ optionLabelOf(node, option) }}
              </SelectOption>
            </SelectContent>
          </Select>
          <Textarea
            v-else-if="node.widget === 'textarea'"
            key="textarea"
            :model-value="textOf(node)"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            :rows="4"
            class="w-full"
            @update:model-value="setValue(node, $event)"
          />
          <Textarea
            v-else-if="node.widget === 'list' || node.widget === 'json'"
            key="code"
            :model-value="textOf(node)"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            :rows="node.widget === 'json' ? 5 : 3"
            spellcheck="false"
            class="w-full font-code"
            @update:model-value="
              node.widget === 'list' ? setList(node, $event) : setJson(node, $event)
            "
          />
          <Input
            v-else-if="node.widget === 'number'"
            key="number"
            :model-value="textOf(node)"
            size="large"
            class="w-full"
            :inputmode="node.type === 'integer' ? 'numeric' : 'decimal'"
            autocomplete="off"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            @update:model-value="setNumber(node, $event)"
          />
          <Input
            v-else
            key="text"
            :model-value="textOf(node)"
            size="large"
            class="w-full"
            autocomplete="off"
            :type="node.format === 'email' ? 'email' : 'text'"
            :inputmode="node.format === 'uri' || node.format === 'url' ? 'url' : undefined"
            :max-length="node.schema.maxLength"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            @update:model-value="setValue(node, $event)"
          />
        </slot>
        <FieldError
          v-if="errorOf(node)"
          :data-testid="`${testId}__error`"
          >{{ errorOf(node) }}</FieldError
        >
        <FieldDescription v-else-if="node.description">{{ node.description }}</FieldDescription>
      </Field>
    </template>
  </DefineNodes>

  <div
    ref="rootRef"
    v-bind="rootAttrs"
    data-slot="schema-form"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    class="@container/schema-form flex w-full min-w-0 flex-col"
  >
    <FieldGroup>
      <ReuseNodes :nodes="tree.nodes" />
    </FieldGroup>
  </div>
</template>
