<script setup lang="ts">
  import { createReusableTemplate } from '@vueuse/core'
  import { computed, nextTick, reactive, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Field from '../field/field.vue'
  import FieldDescription from '../field/field-description/field-description.vue'
  import FieldError from '../field/field-error/field-error.vue'
  import FieldGroup from '../field/field-group/field-group.vue'
  import FieldLabel from '../field/field-label/field-label.vue'
  import FieldLegend from '../field/field-legend/field-legend.vue'
  import FieldSet from '../field/field-set/field-set.vue'
  import Input from '../input/input.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectOption from '../select/select-option/select-option.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import Switch from '../switch/switch.vue'
  import Textarea from '../textarea/textarea.vue'
  import {
    buildNodes,
    getAt,
    leavesOf,
    listLines,
    parseNumber,
    type SchemaFormIssue,
    type SchemaFormNode,
    type SchemaFormSchema,
    type SchemaFormUi,
    seedDefaults,
    setAt,
    validateNode
  } from './schema'

  export type {
    SchemaFormNode,
    SchemaFormSchema,
    SchemaFormType,
    SchemaFormUi,
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

  defineOptions({
    name: 'SchemaForm',
    inheritAttrs: false
  })

  interface Props {
    /** JSON schema of an object (draft-07 subset); each property becomes a Field. */
    schema: SchemaFormSchema
    /** Server or external messages by field path; a field shows its message until it is edited. */
    errors?: SchemaFormErrors
    /** Presentation overrides by field path: widget, placeholder, hidden, and key order (`''` is the root). */
    ui?: Record<string, SchemaFormUi>
    /** When fields first show their validation message: on leaving the field, or only after `validate()`. */
    validateOn?: SchemaFormValidateOn
    /** Disables every field. */
    disabled?: boolean
    /** Shows every value without letting it change. */
    readonly?: boolean
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

  const nodes = computed(() => buildNodes(props.schema, props.ui))
  const leaves = computed(() => leavesOf(nodes.value))

  const value = computed<SchemaFormValue>(() => model.value ?? {})
  const valueAt = (path: string) => getAt(value.value, path)
  const snapshotOf = (path: string) => JSON.stringify(valueAt(path) ?? null)

  watch(
    nodes,
    (list) => {
      const seeded = seedDefaults(list, value.value)
      if (seeded) model.value = seeded
    },
    { immediate: true }
  )

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
    if (node.widget === 'select') return t('schemaForm.selectPlaceholder')
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
      const message = errorOf(node)
      if (message) errors[node.path] = message
    }
    const first = Object.keys(errors)[0]
    if (first) {
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
          <Select
            v-else-if="node.widget === 'select'"
            :model-value="valueAt(node.path) === undefined ? undefined : String(valueAt(node.path))"
            size="large"
            class="w-full"
            :placeholder="placeholderOf(node)"
            :readonly="isReadonly(node)"
            @update:model-value="setOption(node, $event)"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectOption
                v-for="option in node.options"
                :key="String(option)"
                :value="String(option)"
              >
                {{ option }}
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
      <ReuseNodes :nodes="nodes" />
    </FieldGroup>
  </div>
</template>
