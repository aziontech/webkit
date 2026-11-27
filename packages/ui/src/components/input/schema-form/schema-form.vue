<script setup lang="ts">
  import { computed, nextTick, provide, reactive, ref, useAttrs, useSlots, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import FieldGroup from '../field/field-group/field-group.vue'
  import { useSchemaFormCollections } from './composables/use-schema-form-collections'
  import { useSchemaFormOptions } from './composables/use-schema-form-options'
  import { useSchemaFormReconcile } from './composables/use-schema-form-reconcile'
  import { SchemaFormInjectionKey } from './injection-key'
  import { sectionsHolding } from './lib/schema-form-sections'
  import SchemaFormNodes from './parts/schema-form-nodes.vue'
  import {
    buildNodes,
    expand,
    getAt,
    leavesOf,
    type SchemaFormIssue,
    type SchemaFormNode,
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

  export interface SchemaFormProps {
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

  const props = withDefaults(defineProps<SchemaFormProps>(), {
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
  const slots = useSlots()
  const { t } = useTranslate({ schemaForm: en.schemaForm })

  const rootEl = ref<HTMLElement | null>(null)
  const touched = reactive(new Set<string>())
  const dismissed = reactive(new Set<string>())
  const drafts = reactive(new Map<string, { text: string; snapshot: string }>())
  const openSections = reactive(new Set<string>())
  const submitted = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'schema-form')
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const nodes = computed(() => buildNodes(props.schema, props.ui))

  const value = computed<SchemaFormValue>(() => model.value ?? {})
  const valueAt = (path: string) => getAt(value.value, path)
  const snapshotOf = (path: string) => JSON.stringify(valueAt(path) ?? null)

  const tree = computed(() => expand(nodes.value, value.value, props.ui))
  const leaves = computed(() => leavesOf(tree.value.nodes))

  useSchemaFormReconcile(
    nodes,
    value,
    () => props.ui,
    (next) => {
      model.value = next
    }
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

  const { optionStates, searchOptions } = useSchemaFormOptions(leaves)
  const collections = useSchemaFormCollections(valueAt, setValue)

  const issueOf = (node: SchemaFormNode): SchemaFormIssue | null =>
    validateNode(node, valueAt(node.path), drafts.get(node.path)?.text)

  const messageOf = (issue: SchemaFormIssue, node: SchemaFormNode) => {
    const message =
      issue.key === 'pattern' && node.description
        ? t('schemaForm.patternRule', { rule: node.description })
        : t(`schemaForm.${issue.key}`, issue.params)
    return issue.line ? t('schemaForm.listItem', { line: issue.line, message }) : message
  }

  const errorOf = (node: SchemaFormNode) => {
    const server = props.errors[node.path]
    if (server && !dismissed.has(node.path)) return server
    if (!submitted.value && !(props.validateOn === 'blur' && touched.has(node.path))) return ''
    const issue = issueOf(node)
    return issue ? messageOf(issue, node) : ''
  }

  const onFocusout = (node: SchemaFormNode, event: globalThis.FocusEvent) => {
    const next = event.relatedTarget as HTMLElement | null
    const field = event.currentTarget as HTMLElement | null
    if (next && (field?.contains(next) || next.closest('[role="listbox"]'))) return
    touched.add(node.path)
  }

  provide(SchemaFormInjectionKey, {
    testId,
    slots,
    valueAt,
    setValue,
    setDraft,
    draftOf: (path) => drafts.get(path)?.text,
    errorOf,
    isDisabled: (node) => props.disabled || (node.readOnly && !props.readonly),
    isReadonly: (node) => props.readonly || node.readOnly,
    onFocusout,
    openSections,
    optionStates,
    searchOptions,
    ...collections
  })

  const focusFirst = async (path: string) => {
    for (const section of sectionsHolding(tree.value.nodes, path)) openSections.add(section.path)
    await nextTick()
    const field = rootEl.value?.querySelector<HTMLElement>(`[data-path="${CSS.escape(path)}"]`)
    field
      ?.querySelector<HTMLElement>('input, textarea, button, [tabindex]:not([tabindex="-1"])')
      ?.focus()
  }

  const validate = async (): Promise<SchemaFormValidation> => {
    submitted.value = true
    const errors: SchemaFormErrors = {}
    for (const node of leaves.value) {
      const duplicate = node.widget === 'map' && collections.duplicateRows(node).some(Boolean)
      const message = errorOf(node) || (duplicate ? t('schemaForm.duplicateKey') : '')
      if (message) errors[node.path] = message
    }
    const first = Object.keys(errors)[0]
    if (first) await focusFirst(first)
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
  <div
    ref="rootEl"
    v-bind="rootAttrs"
    data-slot="schema-form"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    class="@container/schema-form flex w-full min-w-0 flex-col"
  >
    <FieldGroup>
      <SchemaFormNodes :nodes="tree.nodes" />
    </FieldGroup>
  </div>
</template>
