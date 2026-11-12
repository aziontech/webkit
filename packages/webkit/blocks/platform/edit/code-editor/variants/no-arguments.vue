<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import RadioButton from '@aziontech/webkit/radio-button'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId } from 'vue'

  const loadMonaco = async () => {
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
    return import('monaco-editor')
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
  const code = `const SECRET = 'demo-only'

export async function handleRequest(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const response = await fetch(request)
  response.headers.set('x-authenticated', 'true')
  return response
}
`
  const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)

  const activeTab = ref('code')
  const activeDocument = ref('arguments')
  const form = reactive({
    name: 'auth-handler',
    executionEnvironment: 'request',
    active: true,
    code,
    schema: cleanSchema
  })
  const fields = ref([])
  const expanded = ref(new Set())
  const touched = ref(new Set())
  const schemaWidth = ref(420)
  const schemaCollapsed = ref(false)
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()

  let sequence = 0
  const newField = () => ({
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

  const fieldTypeLabel = (type) => fieldTypes.find((option) => option.value === type)?.label ?? type
  const itemTypeLabel = (type) => itemTypes.find((option) => option.value === type)?.label ?? type
  const summary = (field) =>
    field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)

  const keyError = (field) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key))
      return 'Letters, digits and underscore, not starting with a digit.'
    return fields.value.some((other) => other.id !== field.id && other.key.trim() === key)
      ? 'Another field already uses this name.'
      : ''
  }
  const touch = (id) => {
    touched.value = new Set(touched.value).add(id)
  }

  const isExpanded = (id) => expanded.value.has(id)
  const toggle = (id) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
  const open = (id) => {
    expanded.value = new Set(expanded.value).add(id)
  }

  const addField = () => {
    const field = newField()
    fields.value.push(field)
    open(field.id)
    nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())
  }
  const removeField = (index) => {
    const [removed] = fields.value.splice(index, 1)
    if (!removed) return
    const next = new Set(expanded.value)
    next.delete(removed.id)
    expanded.value = next
  }
  const duplicateField = (index) => {
    const copy = { ...fields.value[index], id: newField().id, key: '' }
    fields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }
  const move = (index, direction) => {
    const to = index + direction
    if (to < 0 || to >= fields.value.length) return
    const [moved] = fields.value.splice(index, 1)
    fields.value.splice(to, 0, moved)
  }
  const removeForm = () => {
    form.schema = cleanSchema
    fields.value = []
  }

  const onTypeChange = (field) => {
    for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum']) {
      field[constraint] = ''
    }
    if (field.type !== 'select') field.options = []
    if (field.type === 'boolean') field.default = false
    else if (field.type === 'array') field.default = []
    else if (typeof field.default !== 'string') field.default = ''
  }
  const linesToList = (text) =>
    String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  const listToLines = (list) => (Array.isArray(list) ? list.join('\n') : '')

  const snapshot = () => JSON.stringify({ form, fields: fields.value })
  const baseline = ref(snapshot())
  const dirty = computed(() => snapshot() !== baseline.value)
  const discard = () => {
    const saved = JSON.parse(baseline.value)
    Object.assign(form, saved.form)
    fields.value = saved.fields
  }
  const save = () => {
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
    baseline.value = snapshot()
  }
</script>

<template>
  <div class="flex h-[calc(100dvh-var(--layout-header-height))] min-h-0 flex-col">
    <h1 class="sr-only">{{ form.name }}</h1>
    <PageTabs v-model="activeTab">
      <Tabs.Item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </PageTabs>
    <section
      class="flex min-h-0 flex-1 flex-col"
      :class="activeTab === 'code' ? 'overflow-hidden' : 'overflow-auto'"
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <fieldset class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0">
          <legend class="sr-only">{{ form.name }} settings</legend>
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
                          id="service-source-code"
                          v-model="form.code"
                          language="javascript"
                          path="index.js"
                          fill
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
                      <HelperText
                        kind="invalid"
                        :label="codeError"
                      />
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
                        {{ fields.length }} {{ fields.length === 1 ? 'field' : 'fields' }}
                      </span>
                      <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                        <Button
                          label="Add field"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-plus"
                          @click="addField"
                        />
                        <Button
                          label="Remove form"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-times"
                          @click="removeForm"
                        />
                      </div>
                    </div>
                    <div class="flex min-h-0 flex-1">
                      <ResizableRoot
                        class="w-full"
                        aria-label="Argument form"
                      >
                        <ResizablePane
                          v-model:basis="schemaWidth"
                          v-model:collapsed="schemaCollapsed"
                          collapsible
                          :min="280"
                          :max="720"
                          aria-label="Schema"
                        >
                          <div class="flex min-h-0 w-full flex-1 flex-col">
                            <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                              <div class="flex min-h-0 flex-1 flex-col">
                                <CodeEditor
                                  v-model="form.schema"
                                  language="json"
                                  path="args.json"
                                  fill
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
                            v-if="fields.length === 0"
                            class="flex min-h-0 flex-1 p-(--spacing-sm)"
                          >
                            <div class="flex min-h-0 flex-1">
                              <EmptyState
                                bordered
                                icon="pi pi-plus-circle"
                                title="This form has no fields"
                                description="Add the first argument the service reads."
                                class="w-full"
                              >
                                <template #actions>
                                  <Button
                                    label="Add field"
                                    kind="secondary"
                                    size="medium"
                                    icon="pi pi-plus"
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
                            <div
                              class="layout-column-form mx-auto flex min-w-0 flex-col gap-(--spacing-sm)"
                            >
                              <Card :padded="false">
                                <template #content>
                                  <Item.List>
                                    <div
                                      class="relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) [&>[data-slot=item]:last-child]:border-b-transparent"
                                    >
                                      <Item
                                        v-for="(field, index) in fields"
                                        :key="field.id"
                                        size="small"
                                      >
                                        <div class="flex w-full flex-col items-stretch">
                                          <div
                                            class="flex w-full min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md)"
                                          >
                                            <div
                                              class="inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-default cursor-grab active:cursor-grabbing motion-reduce:transition-none"
                                              role="button"
                                              tabindex="0"
                                              :aria-disabled="fields.length < 2 || undefined"
                                              :aria-label="'Reorder ' + (field.key || 'this field')"
                                              @keydown.up.prevent="move(index, -1)"
                                              @keydown.down.prevent="move(index, 1)"
                                            >
                                              <i
                                                class="pi pi-bars text-label-sm"
                                                aria-hidden="true"
                                              />
                                            </div>
                                            <Item.Content>
                                              <div
                                                class="flex min-w-0 flex-row items-baseline gap-(--spacing-xs)"
                                              >
                                                <Item.Title>
                                                  <span
                                                    class="truncate font-code text-label-code-sm"
                                                    :class="field.key ? '' : 'text-(--text-muted)'"
                                                  >
                                                    {{ field.key || 'Unnamed field' }}
                                                  </span>
                                                </Item.Title>
                                                <Item.Description class="shrink-0">{{
                                                  summary(field)
                                                }}</Item.Description>
                                              </div>
                                            </Item.Content>
                                            <Item.Actions class="shrink-0">
                                              <Tag
                                                v-if="field.required"
                                                label="Required"
                                                severity="info"
                                                size="small"
                                              />
                                              <Tag
                                                key="tag-2"
                                                v-if="keyError(field)"
                                                label="Needs a name"
                                                severity="warning"
                                                size="small"
                                              />
                                              <Tooltip text="Duplicate this field">
                                                <IconButton
                                                  icon="pi pi-clone"
                                                  kind="outlined"
                                                  size="small"
                                                  :aria-label="
                                                    'Duplicate ' + (field.key || 'this field')
                                                  "
                                                  @click="duplicateField(index)"
                                                />
                                              </Tooltip>
                                              <Tooltip text="Remove this field">
                                                <IconButton
                                                  icon="pi pi-trash"
                                                  kind="outlined"
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
                                                    ? 'pi pi-chevron-up'
                                                    : 'pi pi-chevron-down'
                                                "
                                                kind="outlined"
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
                                            class="grid transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                                            :class="
                                              isExpanded(field.id)
                                                ? 'grid-rows-[1fr]'
                                                : 'grid-rows-[0fr]'
                                            "
                                          >
                                            <div class="overflow-hidden">
                                              <div
                                                class="mt-(--spacing-xs) border-t border-(--border-muted)"
                                              >
                                                <Item.List>
                                                  <SettingRow
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
                                                        spellcheck="false"
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
                                                    <HelperText
                                                      v-if="keyError(field)"
                                                      :id="formId + '-message-' + field.id"
                                                      kind="required"
                                                      :label="keyError(field)"
                                                    />
                                                  </SettingRow>
                                                  <SettingRow
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
                                                        <Select.Option
                                                          v-for="option in fieldTypes"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Option>
                                                      </Select.Content>
                                                    </Select>
                                                  </SettingRow>
                                                  <SettingRow
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
                                                  </SettingRow>
                                                  <SettingRow
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
                                                  </SettingRow>
                                                  <SettingRow
                                                    title="Required"
                                                    description="The form refuses to save without it."
                                                    kind="compact"
                                                  >
                                                    <Switch
                                                      v-model="field.required"
                                                      aria-label="Required"
                                                    />
                                                  </SettingRow>
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
                                                                <Select.Option
                                                                  v-for="option in field.options"
                                                                  :key="option"
                                                                  :value="option"
                                                                >
                                                                  {{ option }}
                                                                </Select.Option>
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
                                                  <SettingRow
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
                                                  </SettingRow>
                                                  <SettingRow
                                                    key="setting-row-2"
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
                                                  </SettingRow>
                                                  <SettingRow
                                                    key="setting-row-3"
                                                    v-if="field.type === 'string'"
                                                    title="Pattern"
                                                    description="A regular expression the value has to match."
                                                    kind="stacked"
                                                  >
                                                    <div class="contents font-code">
                                                      <Input
                                                        v-model="field.pattern"
                                                        size="medium"
                                                        placeholder="^[a-z0-9_-]+$"
                                                        autocomplete="off"
                                                        spellcheck="false"
                                                        class="w-full"
                                                        aria-label="Pattern"
                                                      />
                                                    </div>
                                                  </SettingRow>
                                                  <SettingRow
                                                    key="setting-row-4"
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
                                                  </SettingRow>
                                                  <SettingRow
                                                    key="setting-row-5"
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
                                                  </SettingRow>
                                                  <SettingRow
                                                    key="setting-row-6"
                                                    v-if="field.type === 'select'"
                                                    title="Choices"
                                                    description="One per line. These are the values the form offers."
                                                    kind="stacked"
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
                                                  </SettingRow>
                                                  <SettingRow
                                                    key="setting-row-7"
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
                                                        <Select.Option
                                                          v-for="option in itemTypes"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Option>
                                                      </Select.Content>
                                                    </Select>
                                                  </SettingRow>
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
                            </div>
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
            <section class="layout-section-start flex min-w-0 flex-col">
              <SettingsSection title="General">
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
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
                          :required="!!nameError"
                          :aria-describedby="nameError ? nameMessageId : undefined"
                          @update:model-value="nameError = ''"
                        />
                        <HelperText
                          v-if="nameError"
                          :id="nameMessageId"
                          kind="required"
                          :label="nameError"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection title="Runtime">
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
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
                          <template #iconRight>
                            <i
                              class="pi pi-lock"
                              aria-hidden="true"
                            />
                          </template>
                        </Input>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Execution environment"
                hint="Where in the request path the service runs, each stage handing the code a different request."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Runs on"
                        kind="stacked"
                      >
                        <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                          <legend class="sr-only">Execution environment</legend>
                          <Field.Label>
                            <Field orientation="horizontal">
                              <RadioButton
                                v-model="form.executionEnvironment"
                                value="request"
                                :name="groupName"
                              />
                              <Field.Content>
                                <Field.Title> On request </Field.Title>
                                <Field.Description>
                                  Runs on each request the service handles, after routing.
                                </Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                          <Field.Label>
                            <Field orientation="horizontal">
                              <RadioButton
                                v-model="form.executionEnvironment"
                                value="gateway"
                                :name="groupName"
                              />
                              <Field.Content>
                                <Field.Title> At the gateway </Field.Title>
                                <Field.Description>
                                  Runs at the gateway, before routing, where a request can still be
                                  refused.
                                </Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection title="Status">
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Active"
                        description="An inactive service keeps its code and stops running."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </section>
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
      <SaveBar v-if="dirty">
        You have unsaved changes.

        <template #actions>
          <Button
            type="button"
            label="Discard"
            kind="outlined"
            size="medium"
            @click="discard"
          />
          <Button
            label="Save"
            kind="primary"
            size="medium"
            @click="save"
          />
        </template>
      </SaveBar>
    </Transition>
  </div>
</template>
