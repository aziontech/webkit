<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor, { type CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, toRaw, useId, watch } from 'vue'

  import { sampleFields, sampleService } from './sample'

  /** The value type of one argument field. */
  export type FunctionEditorFieldType =
    'string' | 'integer' | 'number' | 'boolean' | 'select' | 'array'

  /** What every argument field carries, whatever its type. */
  export interface FunctionEditorFieldBase {
    /** Stable key of the row in the builder. */
    id: string
    /** The argument name the code reads. */
    key: string
    /** The label the form shows. */
    title: string
    /** The help text under the field. */
    description: string
    /** The form refuses to save without it. */
    required: boolean
    /** Shortest text allowed, as typed. */
    minLength: string
    /** Longest text allowed, as typed. */
    maxLength: string
    /** Pattern the text must match. */
    pattern: string
    /** Smallest number allowed, as typed. */
    minimum: string
    /** Largest number allowed, as typed. */
    maximum: string
    /** The choices of a choice field. */
    options: string[]
    /** The item type of a list field. */
    itemType: string
  }

  /** One field of the argument form, with a default that matches its type. */
  export type FunctionEditorField = FunctionEditorFieldBase &
    (
      | { type: 'boolean'; default: boolean }
      | { type: 'array'; default: string[] }
      | { type: 'string' | 'integer' | 'number' | 'select'; default: string }
    )

  /** Where the service runs. */
  export type FunctionEditorEnvironment = 'request' | 'gateway'

  /** The saved service the editor opens on. */
  export interface FunctionEditorService {
    /** The service name. */
    name: string
    /** Where the service runs. */
    executionEnvironment: FunctionEditorEnvironment
    /** Whether the service runs at all. */
    active: boolean
    /** The source code. */
    code: string
    /** The argument form schema, as JSON text. */
    schema: string
  }

  /** What a save sends: the service and its argument fields. */
  export interface FunctionEditorValues extends FunctionEditorService {
    /** The argument fields, in order. */
    fields: FunctionEditorField[]
  }

  /** A tab of the editor. */
  export type FunctionEditorTab = 'code' | 'settings'

  /** A document of the Code tab. */
  export type FunctionEditorDocument = 'code' | 'arguments'

  export interface FunctionEditorProps {
    /** The saved service; the editor opens on it and Discard returns to it. Left out, the sample renders. */
    service?: FunctionEditorService
    /** The saved argument fields. Left out, the sample fields render. */
    fields?: FunctionEditorField[]
    /** Unsaved edits the editor opens with on top of the service, so it starts dirty. */
    defaultDraft?: Partial<FunctionEditorService>
    /** The tab the editor opens on. */
    defaultTab?: FunctionEditorTab
    /** The document the Code tab opens on. */
    defaultDocument?: FunctionEditorDocument
    /** Ids of the fields that open expanded. */
    defaultOpenKeys?: string[]
    /** The save is in flight: the save bar stays, Save spins, Discard and the editors lock. */
    loading?: boolean
    /** Why the save failed, shown in a danger alert in the save bar; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<FunctionEditorProps>(), {
    service: undefined,
    fields: undefined,
    defaultDraft: () => ({}),
    defaultTab: 'code',
    defaultDocument: 'code',
    defaultOpenKeys: () => [],
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FunctionEditorValues]
    discard: [event: MouseEvent]
  }>()

  type SchemaField = FunctionEditorField

  const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
    const [{ default: EditorWorker }, { default: JsonWorker }, { default: TsWorker }] =
      await Promise.all([
        import('monaco-editor/editor/editor.worker?worker'),
        import('monaco-editor/languages/features/json/json.worker?worker'),
        import('monaco-editor/languages/features/typescript/ts.worker?worker')
      ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => {
        if (label === 'json') return new JsonWorker()
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        return new EditorWorker()
      }
    }
    return (await import('monaco-editor')) as unknown as CodeEditorMonacoModule
  }

  const tabs = [
    { value: 'code', label: 'Code' },
    { value: 'settings', label: 'Settings' }
  ]
  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]
  const fieldTypes = [
    { value: 'string', label: 'Text' },
    { value: 'integer', label: 'Integer' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'True / false' },
    { value: 'select', label: 'Choice' },
    { value: 'array', label: 'List' }
  ]
  const itemTypes = [
    { value: 'string', label: 'Text' },
    { value: 'integer', label: 'Integer' },
    { value: 'number', label: 'Number' }
  ]

  const runtimeLabel = 'JavaScript'
  const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)

  const savedService = computed<FunctionEditorService>(() => props.service ?? sampleService)
  const savedFields = computed<SchemaField[]>(() => props.fields ?? sampleFields)

  const activeTab = ref<string>(props.defaultTab)
  const activeDocument = ref<string>(props.defaultDocument)
  const form = reactive<FunctionEditorService>({ ...savedService.value })
  const draftFields = ref<SchemaField[]>(structuredClone(toRaw(savedFields.value)))
  const expanded = ref(new Set<string>(props.defaultOpenKeys))
  const touched = ref(new Set<string>())
  const schemaWidth = ref(420)
  const schemaExpanded = ref(true)
  const schemaHeight = ref(240)
  const splitEl = ref<HTMLElement | null>(null)
  const splitWidth = ref(0)
  const splitStacked = computed(() => splitWidth.value > 0 && splitWidth.value < 640)
  const schemaMax = computed(() => {
    if (splitStacked.value) return 480
    if (splitWidth.value === 0) return 720
    return Math.min(720, Math.max(280, Math.floor(splitWidth.value * 0.45)))
  })
  const setSchemaBasis = (value: number | undefined) => {
    if (value === undefined) return
    if (splitStacked.value) schemaHeight.value = value
    else schemaWidth.value = value
  }
  watch(splitEl, (el, _previous, onCleanup) => {
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      splitWidth.value = entry.contentRect.width
    })
    observer.observe(el)
    onCleanup(() => observer.disconnect())
  })
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()

  let sequence = draftFields.value.length
  const newField = (): SchemaField => ({
    id: 'field-' + (sequence += 1),
    key: '',
    type: 'string',
    title: '',
    description: '',
    required: false,
    default: '',
    minLength: '',
    maxLength: '',
    pattern: '',
    minimum: '',
    maximum: '',
    options: [],
    itemType: 'string'
  })

  const fieldTypeLabel = (type: string) =>
    fieldTypes.find((option) => option.value === type)?.label ?? type
  const itemTypeLabel = (type: string) =>
    itemTypes.find((option) => option.value === type)?.label ?? type
  const summary = (field: SchemaField) =>
    field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)

  const keyError = (field: SchemaField) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key))
      return 'Letters, digits and underscore, not starting with a digit.'
    return draftFields.value.some((other) => other.id !== field.id && other.key.trim() === key)
      ? 'Another field already uses this name.'
      : ''
  }
  const touch = (id: string) => {
    touched.value = new Set(touched.value).add(id)
  }

  const isExpanded = (id: string) => expanded.value.has(id)
  const toggle = (id: string) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
  const open = (id: string) => {
    expanded.value = new Set(expanded.value).add(id)
  }

  const addField = () => {
    const field = newField()
    draftFields.value.push(field)
    open(field.id)
    nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())
  }
  const removeField = (index: number) => {
    const [removed] = draftFields.value.splice(index, 1)
    if (!removed) return
    const next = new Set(expanded.value)
    next.delete(removed.id)
    expanded.value = next
  }
  const duplicateField = (index: number) => {
    const copy = { ...draftFields.value[index], id: newField().id, key: '' }
    draftFields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }
  const moveStatus = ref('')
  const fieldName = (field: SchemaField) => field.key || 'this field'
  const move = (index: number, direction: number) => {
    const to = index + direction
    if (to < 0 || to >= draftFields.value.length) return
    const [moved] = draftFields.value.splice(index, 1)
    draftFields.value.splice(to, 0, moved)
    moveStatus.value = `${fieldName(moved)} moved to position ${to + 1} of ${draftFields.value.length}.`
    nextTick(() => {
      const same = document.getElementById(`${formId}-${direction < 0 ? 'up' : 'down'}-${moved.id}`)
      const other = document.getElementById(
        `${formId}-${direction < 0 ? 'down' : 'up'}-${moved.id}`
      )
      const target = same instanceof HTMLButtonElement && !same.disabled ? same : other
      target?.focus()
    })
  }
  const removeForm = () => {
    form.schema = cleanSchema
    draftFields.value = []
  }

  const onTypeChange = (field: SchemaField) => {
    for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum'] as const) {
      field[constraint] = ''
    }
    if (field.type !== 'select') field.options = []
    if (field.type === 'boolean') field.default = false
    else if (field.type === 'array') field.default = []
    else field.default = typeof field.default === 'string' ? field.default : ''
  }
  const linesToList = (text: string) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  const listToLines = (list: unknown) => (Array.isArray(list) ? list.join('\n') : '')

  const snapshot = () => JSON.stringify({ form, fields: draftFields.value })
  const baseline = ref(snapshot())
  Object.assign(form, props.defaultDraft)
  const dirty = computed(() => snapshot() !== baseline.value)
  const saving = computed(() => props.loading)
  const saveError = computed(() => props.error)

  watch(
    () => JSON.stringify({ service: savedService.value, fields: savedFields.value }),
    () => {
      Object.assign(form, savedService.value)
      draftFields.value = structuredClone(toRaw(savedFields.value))
      baseline.value = snapshot()
    }
  )

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now || props.error) return
      baseline.value = snapshot()
      toast.success(`${form.name} saved.`)
    }
  )

  const discard = (event: MouseEvent) => {
    const saved: { form: FunctionEditorService; fields: SchemaField[] } = JSON.parse(baseline.value)
    Object.assign(form, saved.form)
    draftFields.value = saved.fields
    emit('discard', event)
  }
  const save = (event: Event) => {
    if (saving.value) return
    nameError.value = form.name.trim() ? '' : 'This field is required.'
    codeError.value = form.code.trim() ? '' : 'This field is required.'
    if (codeError.value) {
      activeTab.value = 'code'
      activeDocument.value = 'code'
    }
    if (nameError.value) activeTab.value = 'settings'
    if (nameError.value || codeError.value) {
      const target = nameError.value ? 'service-name' : 'service-source-code'
      nextTick(() => document.getElementById(target)?.focus())
      return
    }
    emit('submit', event, { ...form, fields: structuredClone(toRaw(draftFields.value)) })
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <h1 class="sr-only">{{ form.name }}</h1>
    <PageTabs v-model="activeTab">
      <Tabs.Trigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </PageTabs>
    <section
      :data-tab="activeTab"
      class="flex min-h-0 flex-1 flex-col overflow-auto data-[tab=code]:overflow-hidden"
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <fieldset class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0">
          <legend class="sr-only">{{ form.name }} settings</legend>
          <p
            class="sr-only"
            aria-live="polite"
          >
            {{ moveStatus }}
          </p>
          <div
            v-show="activeTab === 'code'"
            class="flex min-h-0 flex-1 flex-col"
          >
            <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div
                class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <ToggleGroup
                  v-model="activeDocument"
                  :options="documents"
                  aria-label="Editor document"
                />
                <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
                  {{
                    activeDocument === 'code'
                      ? runtimeLabel + ', running on request'
                      : 'The fields an instance is asked for, and their defaults.'
                  }}
                </p>
              </div>
              <div class="flex min-h-0 flex-1 flex-col">
                <div
                  v-show="activeDocument === 'code'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <div class="flex min-h-0 w-full flex-1 flex-col">
                    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                      <div class="flex min-h-0 flex-1 flex-col">
                        <CodeEditor
                          :readonly="saving"
                          id="service-source-code"
                          v-model="form.code"
                          language="javascript"
                          path="index.js"
                          fill
                          :bordered="false"
                          pad-line-numbers
                          :loader="loadMonaco"
                          :invalid="!!codeError"
                          aria-label="Source code"
                          @update:model-value="codeError = ''"
                        />
                      </div>
                    </div>
                    <div
                      v-if="codeError"
                      class="px-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <FieldError>{{ codeError }}</FieldError>
                    </div>
                  </div>
                </div>
                <div
                  v-show="activeDocument === 'arguments'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div
                      class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <span class="text-label-sm text-(--text-muted)">
                        {{ draftFields.length }} {{ draftFields.length === 1 ? 'field' : 'fields' }}
                      </span>
                      <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                        <Button
                          label="Add field"
                          variant="outline"
                          size="medium"
                          icon="az az-plus"
                          :disabled="saving"
                          @click="addField"
                        />
                        <Button
                          label="Remove form"
                          variant="outline"
                          size="medium"
                          icon="az az-x"
                          :disabled="saving"
                          @click="removeForm"
                        />
                      </div>
                    </div>
                    <div
                      ref="splitEl"
                      class="flex min-h-0 flex-1"
                    >
                      <ResizableRoot
                        class="w-full"
                        :orientation="splitStacked ? 'vertical' : 'horizontal'"
                        aria-label="Argument form"
                      >
                        <ResizablePane
                          :basis="splitStacked ? schemaHeight : schemaWidth"
                          v-model:open="schemaExpanded"
                          collapsible
                          :min="splitStacked ? 160 : 280"
                          :max="schemaMax"
                          aria-label="Schema"
                          @update:basis="setSchemaBasis"
                        >
                          <div class="flex min-h-0 w-full flex-1 flex-col">
                            <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                              <div class="flex min-h-0 flex-1 flex-col">
                                <CodeEditor
                                  :readonly="saving"
                                  v-model="form.schema"
                                  language="json"
                                  path="args.json"
                                  fill
                                  :bordered="false"
                                  pad-line-numbers
                                  :loader="loadMonaco"
                                  aria-label="Argument form schema, as JSON"
                                />
                              </div>
                            </div>
                          </div>
                        </ResizablePane>
                        <ResizableHandle aria-label="Resize the schema" />
                        <ResizablePane aria-label="Fields">
                          <div
                            v-if="draftFields.length === 0"
                            class="flex min-h-0 flex-1 p-(--spacing-sm)"
                          >
                            <div class="flex min-h-0 flex-1">
                              <EmptyState
                                bordered
                                icon="az az-circle-plus"
                                title="This form has no fields"
                                description="Add the first argument the service reads."
                                class="w-full"
                              >
                                <template #actions>
                                  <Button
                                    label="Add field"
                                    variant="secondary"
                                    size="medium"
                                    icon="az az-plus"
                                    @click="addField"
                                  />
                                  <Link
                                    label="Read about arguments"
                                    size="medium"
                                    href="https://example.com/docs/arguments"
                                    target="_blank"
                                  />
                                </template>
                              </EmptyState>
                            </div>
                          </div>
                          <div
                            v-else
                            class="min-h-0 flex-1 overflow-auto p-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--save-bar-inset,0rem))]"
                          >
                            <fieldset
                              class="layout-column-form m-0 flex min-w-0 flex-col gap-(--spacing-sm) border-0 p-0"
                              :disabled="saving"
                            >
                              <Card :padded="false">
                                <template #default>
                                  <Item.List>
                                    <div
                                      class="relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) [&>[data-slot=item]:last-child]:border-b-transparent"
                                    >
                                      <Item
                                        v-for="(field, index) in draftFields"
                                        :key="field.id"
                                        size="small"
                                      >
                                        <div class="flex w-full flex-col items-stretch">
                                          <div
                                            class="flex w-full min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md)"
                                          >
                                            <div
                                              class="flex shrink-0 items-center"
                                              role="group"
                                              :aria-label="'Order of ' + fieldName(field)"
                                            >
                                              <IconButton
                                                :id="`${formId}-up-${field.id}`"
                                                icon="az az-arrow-up"
                                                variant="ghost"
                                                size="small"
                                                :disabled="index === 0"
                                                :aria-label="'Move ' + fieldName(field) + ' up'"
                                                @click="move(index, -1)"
                                              />
                                              <IconButton
                                                :id="`${formId}-down-${field.id}`"
                                                icon="az az-arrow-down"
                                                variant="ghost"
                                                size="small"
                                                :disabled="index === draftFields.length - 1"
                                                :aria-label="'Move ' + fieldName(field) + ' down'"
                                                @click="move(index, 1)"
                                              />
                                            </div>
                                            <Item.Content>
                                              <div
                                                class="flex min-w-0 flex-row items-baseline gap-(--spacing-xs)"
                                              >
                                                <Item.Title class="min-w-0">
                                                  <span
                                                    :data-empty="!field.key || null"
                                                    class="truncate font-code text-label-code-sm data-empty:text-(--text-muted)"
                                                  >
                                                    {{ field.key || 'Unnamed field' }}
                                                  </span>
                                                </Item.Title>
                                                <div class="hidden min-w-0 sm:block">
                                                  <Item.Description>
                                                    <span class="block truncate">{{
                                                      summary(field)
                                                    }}</span>
                                                  </Item.Description>
                                                </div>
                                              </div>
                                            </Item.Content>
                                            <Item.Actions class="shrink-0">
                                              <Tag
                                                v-if="field.required"
                                                key="required"
                                                label="Required"
                                                severity="info"
                                                size="small"
                                              />
                                              <Tag
                                                v-if="keyError(field)"
                                                key="needs-name"
                                                label="Needs a name"
                                                severity="warning"
                                                size="small"
                                              />
                                              <Tooltip content="Duplicate this field">
                                                <IconButton
                                                  icon="az az-copy"
                                                  variant="outline"
                                                  size="small"
                                                  :aria-label="
                                                    'Duplicate ' + (field.key || 'this field')
                                                  "
                                                  @click="duplicateField(index)"
                                                />
                                              </Tooltip>
                                              <Tooltip content="Remove this field">
                                                <IconButton
                                                  icon="az az-trash"
                                                  variant="outline"
                                                  size="small"
                                                  :aria-label="
                                                    'Remove ' + (field.key || 'this field')
                                                  "
                                                  @click="removeField(index)"
                                                />
                                              </Tooltip>
                                              <IconButton
                                                :icon="
                                                  isExpanded(field.id)
                                                    ? 'az az-chevron-up'
                                                    : 'az az-chevron-down'
                                                "
                                                variant="outline"
                                                size="small"
                                                :aria-expanded="isExpanded(field.id)"
                                                :aria-controls="formId + '-body-' + field.id"
                                                :aria-label="
                                                  (isExpanded(field.id) ? 'Hide' : 'Show') +
                                                  ' the settings for ' +
                                                  (field.key || 'this field')
                                                "
                                                @click="toggle(field.id)"
                                              />
                                            </Item.Actions>
                                          </div>
                                          <div
                                            :id="formId + '-body-' + field.id"
                                            :data-state="isExpanded(field.id) ? 'open' : 'closed'"
                                            class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
                                          >
                                            <div class="overflow-hidden">
                                              <div
                                                class="mt-(--spacing-xs) border-t border-(--border-muted)"
                                              >
                                                <Item.List>
                                                  <SettingsRow
                                                    stackable
                                                    title="Name"
                                                    description="The key in the arguments object, and what the service reads."
                                                  >
                                                    <div class="contents font-code">
                                                      <Input
                                                        :id="formId + '-key-' + field.id"
                                                        v-model="field.key"
                                                        size="medium"
                                                        placeholder="cookie_name"
                                                        autocomplete="off"
                                                        :spellcheck="false"
                                                        class="w-full"
                                                        aria-label="Name"
                                                        :invalid="!!keyError(field)"
                                                        :aria-describedby="
                                                          keyError(field)
                                                            ? formId + '-message-' + field.id
                                                            : undefined
                                                        "
                                                        @blur="touch(field.id)"
                                                      />
                                                    </div>
                                                    <FieldError
                                                      v-if="keyError(field)"
                                                      :id="formId + '-message-' + field.id"
                                                      >{{ keyError(field) }}</FieldError
                                                    >
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    title="Type"
                                                    description="What the field accepts, and the control the form renders."
                                                  >
                                                    <Select
                                                      v-model="field.type"
                                                      size="medium"
                                                      class="w-full"
                                                      :display-value="fieldTypeLabel"
                                                      @update:model-value="onTypeChange(field)"
                                                    >
                                                      <Select.Trigger aria-label="Type" />
                                                      <Select.Content>
                                                        <Select.Item
                                                          v-for="option in fieldTypes"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Item>
                                                      </Select.Content>
                                                    </Select>
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    title="Label"
                                                    description="How the field is named in the form. Falls back to the key."
                                                  >
                                                    <Input
                                                      v-model="field.title"
                                                      size="medium"
                                                      :placeholder="
                                                        field.key || 'Max Age (seconds)'
                                                      "
                                                      autocomplete="off"
                                                      class="w-full"
                                                      aria-label="Label"
                                                    />
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    title="Description"
                                                    description="The guidance under the field."
                                                  >
                                                    <Input
                                                      v-model="field.description"
                                                      size="medium"
                                                      placeholder="What this argument does"
                                                      autocomplete="off"
                                                      class="w-full"
                                                      aria-label="Description"
                                                    />
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    title="Required"
                                                    description="The form refuses to save without it."
                                                    variant="compact"
                                                  >
                                                    <Switch
                                                      v-model="field.required"
                                                      aria-label="Required"
                                                    />
                                                  </SettingsRow>
                                                  <Item size="small">
                                                    <div
                                                      class="flex w-full gap-(--spacing-sm)"
                                                      :class="
                                                        field.type === 'array'
                                                          ? 'flex-col items-stretch'
                                                          : 'items-center'
                                                      "
                                                    >
                                                      <Item.Content>
                                                        <Item.Title>Default</Item.Title>
                                                        <Item.Description
                                                          >Seeds the arguments an instance starts
                                                          from.</Item.Description
                                                        >
                                                      </Item.Content>
                                                      <div
                                                        class="flex"
                                                        :class="
                                                          field.type === 'boolean'
                                                            ? 'justify-end'
                                                            : field.type === 'array'
                                                              ? 'w-full'
                                                              : 'max-w-(--container-3xs) flex-1 justify-end'
                                                        "
                                                      >
                                                        <Item.Actions class="w-full">
                                                          <Switch
                                                            v-if="field.type === 'boolean'"
                                                            v-model="field.default"
                                                            aria-label="Default"
                                                          />
                                                          <div
                                                            v-else
                                                            class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                          >
                                                            <Select
                                                              v-if="field.type === 'select'"
                                                              v-model="field.default"
                                                              size="medium"
                                                              class="w-full"
                                                              placeholder="No default"
                                                              :disabled="field.options.length === 0"
                                                            >
                                                              <Select.Trigger
                                                                aria-label="Default"
                                                              />
                                                              <Select.Content>
                                                                <Select.Item
                                                                  v-for="option in field.options"
                                                                  :key="option"
                                                                  :value="option"
                                                                >
                                                                  {{ option }}
                                                                </Select.Item>
                                                              </Select.Content>
                                                            </Select>
                                                            <div
                                                              v-else-if="field.type === 'array'"
                                                              class="contents font-code"
                                                            >
                                                              <Textarea
                                                                :model-value="
                                                                  listToLines(field.default)
                                                                "
                                                                :rows="3"
                                                                placeholder="One value per line"
                                                                class="w-full"
                                                                aria-label="Default"
                                                                @update:model-value="
                                                                  field.default =
                                                                    linesToList($event)
                                                                "
                                                              />
                                                            </div>
                                                            <div
                                                              v-else
                                                              class="contents font-code"
                                                            >
                                                              <Input
                                                                v-model="field.default"
                                                                size="medium"
                                                                :inputmode="
                                                                  field.type === 'integer' ||
                                                                  field.type === 'number'
                                                                    ? 'numeric'
                                                                    : undefined
                                                                "
                                                                placeholder="No default"
                                                                autocomplete="off"
                                                                class="w-full"
                                                                aria-label="Default"
                                                              />
                                                            </div>
                                                          </div>
                                                        </Item.Actions>
                                                      </div>
                                                    </div>
                                                  </Item>
                                                  <SettingsRow
                                                    stackable
                                                    v-if="field.type === 'string'"
                                                    title="Minimum length"
                                                  >
                                                    <Input
                                                      v-model="field.minLength"
                                                      size="medium"
                                                      inputmode="numeric"
                                                      placeholder="No minimum"
                                                      class="w-full"
                                                      aria-label="Minimum length"
                                                    />
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    key="settings-row-2"
                                                    v-if="field.type === 'string'"
                                                    title="Maximum length"
                                                  >
                                                    <Input
                                                      v-model="field.maxLength"
                                                      size="medium"
                                                      inputmode="numeric"
                                                      placeholder="No maximum"
                                                      class="w-full"
                                                      aria-label="Maximum length"
                                                    />
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    key="settings-row-3"
                                                    v-if="field.type === 'string'"
                                                    title="Pattern"
                                                    description="A regular expression the value has to match."
                                                    variant="stacked"
                                                  >
                                                    <div class="contents font-code">
                                                      <Input
                                                        v-model="field.pattern"
                                                        size="medium"
                                                        placeholder="^[a-z0-9_-]+$"
                                                        autocomplete="off"
                                                        :spellcheck="false"
                                                        class="w-full"
                                                        aria-label="Pattern"
                                                      />
                                                    </div>
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    key="settings-row-4"
                                                    v-if="
                                                      field.type === 'integer' ||
                                                      field.type === 'number'
                                                    "
                                                    title="Minimum"
                                                  >
                                                    <Input
                                                      v-model="field.minimum"
                                                      size="medium"
                                                      inputmode="numeric"
                                                      placeholder="No minimum"
                                                      class="w-full"
                                                      aria-label="Minimum"
                                                    />
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    key="settings-row-5"
                                                    v-if="
                                                      field.type === 'integer' ||
                                                      field.type === 'number'
                                                    "
                                                    title="Maximum"
                                                  >
                                                    <Input
                                                      v-model="field.maximum"
                                                      size="medium"
                                                      inputmode="numeric"
                                                      placeholder="No maximum"
                                                      class="w-full"
                                                      aria-label="Maximum"
                                                    />
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    key="settings-row-6"
                                                    v-if="field.type === 'select'"
                                                    title="Choices"
                                                    description="One per line. These are the values the form offers."
                                                    variant="stacked"
                                                  >
                                                    <div class="contents font-code">
                                                      <Textarea
                                                        :model-value="listToLines(field.options)"
                                                        :rows="3"
                                                        placeholder="webp&#10;avif&#10;jpeg"
                                                        class="w-full"
                                                        aria-label="Choices"
                                                        @update:model-value="
                                                          field.options = linesToList($event)
                                                        "
                                                      />
                                                    </div>
                                                  </SettingsRow>
                                                  <SettingsRow
                                                    stackable
                                                    key="settings-row-7"
                                                    v-if="field.type === 'array'"
                                                    title="List of"
                                                    description="The type of every value in the list."
                                                  >
                                                    <Select
                                                      v-model="field.itemType"
                                                      size="medium"
                                                      class="w-full"
                                                      :display-value="itemTypeLabel"
                                                    >
                                                      <Select.Trigger aria-label="List of" />
                                                      <Select.Content>
                                                        <Select.Item
                                                          v-for="option in itemTypes"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Item>
                                                      </Select.Content>
                                                    </Select>
                                                  </SettingsRow>
                                                </Item.List>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Item>
                                    </div>
                                  </Item.List>
                                </template>
                              </Card>
                            </fieldset>
                          </div>
                        </ResizablePane>
                      </ResizableRoot>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="activeTab === 'settings'"
            class="layout-column-form layout-boundary flex min-w-0 flex-col"
          >
            <fieldset
              class="layout-section-start m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <SettingsGroup label="General">
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
                        title="Name"
                        description="Give a unique and descriptive name to identify your service."
                      >
                        <Input
                          id="service-name"
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          autocomplete="off"
                          required
                          :invalid="!!nameError"
                          :aria-describedby="nameError ? nameMessageId : undefined"
                          @update:model-value="nameError = ''"
                        />
                        <FieldError
                          v-if="nameError"
                          :id="nameMessageId"
                          >{{ nameError }}</FieldError
                        >
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup label="Runtime">
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        stackable
                        title="Runtime"
                        description="The runtime isn't editable after the service is created."
                      >
                        <Input
                          :model-value="runtimeLabel"
                          size="large"
                          class="w-full"
                          aria-label="Runtime"
                          readonly
                          disabled
                        >
                          <template #trailing>
                            <i
                              class="az az-lock"
                              aria-hidden="true"
                            />
                          </template>
                        </Input>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Execution environment"
                hint="Where in the request path the service runs, each stage handing the code a different request."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Runs on"
                        variant="stacked"
                      >
                        <RadioGroup
                          v-model="form.executionEnvironment"
                          variant="card"
                          :name="groupName"
                          aria-label="Execution environment"
                        >
                          <RadioGroup.Item
                            value="request"
                            description="Runs on each request the service handles, after routing."
                            >On request</RadioGroup.Item
                          >
                          <RadioGroup.Item
                            value="gateway"
                            description="Runs at the gateway, before routing, where a request can still be refused."
                            >At the gateway</RadioGroup.Item
                          >
                        </RadioGroup>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup label="Status">
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Active"
                        description="An inactive service keeps its code and stops running."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>
            </fieldset>
          </div>
        </fieldset>
      </div>
    </section>
    <Transition
      enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      leave-to-class="translate-y-2 opacity-0"
    >
      <SaveBar v-if="dirty || saving">
        <template
          v-if="saveError"
          #leading
        >
          <Alert
            severity="danger"
            size="small"
            :label="saveError"
            data-testid="code-editor-save-error"
          />
        </template>
        You have unsaved changes.

        <template #actions>
          <Button
            type="button"
            label="Discard"
            variant="outline"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            label="Save"
            variant="primary"
            size="medium"
            :loading="saving"
            @click="save"
          />
        </template>
      </SaveBar>
    </Transition>
  </div>
</template>
