import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import EmptyState from '@aziontech/webkit/empty-state'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'
import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'
import ResizablePanelRoot from '@aziontech/webkit/resizable-panel-root'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, nextTick, reactive, ref, useId } from 'vue'

import { indent } from '../../_shared/markup'

const quoted = (text) =>
  text.includes('\n')
    ? `\`${text.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${')}\``
    : `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  if (typeof value === 'string') return quoted(value)
  if (typeof value !== 'object' || value === null) return String(value)
  const inner = '  '.repeat(depth + 1)
  const outer = '  '.repeat(depth)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    const inline = `[${value.map((item) => literal(item, depth + 1)).join(', ')}]`
    if (!inline.includes('\n') && inline.length + inner.length <= 96) return inline
    return `[\n${value.map((item) => `${inner}${literal(item, depth + 1)}`).join(',\n')}\n${outer}]`
  }
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && inline.length + inner.length <= 96) return inline
  return `{\n${entries.map((entry) => `${inner}${entry}`).join(',\n')}\n${outer}}`
}

const declare = (name, value, wrap = '') =>
  `const ${name} = ${wrap ? `${wrap}(${literal(value)})` : literal(value)}`

const TABS = [
  { value: 'code', label: 'Code' },
  { value: 'settings', label: 'Settings' }
]

const DOCUMENTS = [
  { label: 'Code', value: 'code' },
  { label: 'Arguments', value: 'arguments' }
]

const FIELD_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'True / false' },
  { value: 'select', label: 'Choice' },
  { value: 'array', label: 'List' }
]

const ITEM_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' }
]

const CLEAN_SCHEMA = JSON.stringify({ type: 'object', properties: {} }, null, 2)

const JS_IMAGE = `const ALLOWED = ['webp', 'avif']

async function handleRequest(request, args) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') ?? args.defaultFormat

  if (!ALLOWED.includes(format)) return fetch(request)

  url.searchParams.set('format', format)
  url.searchParams.set('quality', String(args.quality))
  return fetch(url.toString())
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event.args ?? {}))
})
`

const JS_AUTH = `const SECRET = 'demo-only'

async function handleRequest(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const response = await fetch(request)
  response.headers.set('x-authenticated', 'true')
  return response
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
`

const blankField = (id) => ({
  id,
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

const DEFAULT_FORMAT_DESCRIPTION =
  'Used when the request does not ask for a format. Only these are rewritten — anything else passes through untouched.'

export const IMAGE_OPTIMIZER = {
  name: 'image-optimizer',
  executionEnvironment: 'application',
  runtimeLabel: 'JavaScript',
  code: JS_IMAGE,
  schema: {
    type: 'object',
    properties: {
      defaultFormat: {
        type: 'string',
        title: 'Default format',
        description: DEFAULT_FORMAT_DESCRIPTION,
        enum: ['webp', 'avif'],
        default: 'webp'
      },
      quality: {
        type: 'integer',
        title: 'Quality',
        description: 'Compression quality applied to every rewritten image.',
        minimum: 1,
        maximum: 100,
        default: 80
      }
    },
    required: ['defaultFormat']
  },
  fields: [
    {
      ...blankField('field-1'),
      key: 'defaultFormat',
      type: 'select',
      title: 'Default format',
      description: DEFAULT_FORMAT_DESCRIPTION,
      required: true,
      default: 'webp',
      options: ['webp', 'avif']
    },
    {
      ...blankField('field-2'),
      key: 'quality',
      type: 'integer',
      title: 'Quality',
      description: 'Compression quality applied to every rewritten image.',
      default: '80',
      minimum: '1',
      maximum: '100'
    }
  ]
}

export const AUTH_HANDLER = {
  name: 'auth-handler',
  executionEnvironment: 'application',
  runtimeLabel: 'JavaScript',
  code: JS_AUTH,
  schema: null,
  fields: []
}

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

export const pageState = (record, view) => {
  const activeTab = ref(view.tab)
  const activeDocument = ref(view.document)
  const form = reactive({
    name: record.name,
    executionEnvironment: record.executionEnvironment,
    active: true,
    code: record.code,
    schema: record.schema ? JSON.stringify(record.schema, null, 2) : CLEAN_SCHEMA
  })
  const fields = ref(structuredClone(record.fields))
  const expanded = ref(new Set(view.expanded))
  const touched = ref(new Set())
  const schemaWidth = ref(420)
  const schemaCollapsed = ref(false)
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()

  let sequence = record.fields.length
  const newField = () => blankField(`field-${(sequence += 1)}`)

  const fieldTypeLabel = (type) =>
    FIELD_TYPES.find((option) => option.value === type)?.label ?? type
  const itemTypeLabel = (type) => ITEM_TYPES.find((option) => option.value === type)?.label ?? type
  const summary = (field) =>
    field.type === 'array' ? `List of ${itemTypeLabel(field.itemType)}` : fieldTypeLabel(field.type)

  const keyError = (field) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!KEY_PATTERN.test(key)) return 'Letters, digits and underscore, not starting with a digit.'
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
    nextTick(() => globalThis.document?.getElementById(`${formId}-key-${field.id}`)?.focus())
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
    form.schema = CLEAN_SCHEMA
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
    if (nameError.value || codeError.value) return
    baseline.value = snapshot()
  }

  return {
    tabs: TABS,
    documents: DOCUMENTS,
    fieldTypes: FIELD_TYPES,
    itemTypes: ITEM_TYPES,
    runtimeLabel: record.runtimeLabel,
    activeTab,
    activeDocument,
    form,
    fields,
    schemaWidth,
    schemaCollapsed,
    nameError,
    codeError,
    formId,
    nameMessageId,
    groupName,
    fieldTypeLabel,
    itemTypeLabel,
    summary,
    keyError,
    touch,
    isExpanded,
    toggle,
    addField,
    removeField,
    duplicateField,
    move,
    removeForm,
    onTypeChange,
    linesToList,
    listToLines,
    dirty,
    discard,
    save
  }
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Link from '@aziontech/webkit/link'",
  "import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'",
  "import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'",
  "import ResizablePanelRoot from '@aziontech/webkit/resizable-panel-root'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Select from '@aziontech/webkit/select'",
  "import Switch from '@aziontech/webkit/switch'",
  "import TabView from '@aziontech/webkit/tab-view'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Textarea from '@aziontech/webkit/textarea'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, nextTick, reactive, ref, useId } from 'vue'"
]

export const scriptLines = (record, view) => [
  ...IMPORTS,
  '',
  declare('tabs', TABS),
  declare('documents', DOCUMENTS),
  declare('fieldTypes', FIELD_TYPES),
  declare('itemTypes', ITEM_TYPES),
  '',
  `const runtimeLabel = ${quoted(record.runtimeLabel)}`,
  `const code = ${quoted(record.code)}`,
  ...(record.schema ? [declare('formSchema', record.schema)] : []),
  "const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)",
  '',
  `const activeTab = ref(${quoted(view.tab)})`,
  `const activeDocument = ref(${quoted(view.document)})`,
  'const form = reactive({',
  `  name: ${quoted(record.name)},`,
  `  executionEnvironment: ${quoted(record.executionEnvironment)},`,
  '  active: true,',
  '  code,',
  `  schema: ${record.schema ? 'JSON.stringify(formSchema, null, 2)' : 'cleanSchema'}`,
  '})',
  declare('fields', record.fields, 'ref'),
  `const expanded = ref(new Set(${view.expanded.length ? literal(view.expanded) : ''}))`,
  'const touched = ref(new Set())',
  'const schemaWidth = ref(420)',
  'const schemaCollapsed = ref(false)',
  "const nameError = ref('')",
  "const codeError = ref('')",
  'const formId = useId()',
  'const nameMessageId = useId()',
  'const groupName = useId()',
  '',
  `let sequence = ${record.fields.length}`,
  'const newField = () => ({',
  "  id: 'field-' + (sequence += 1),",
  "  key: '',",
  "  type: 'string',",
  "  title: '',",
  "  description: '',",
  '  required: false,',
  "  default: '',",
  "  minLength: '',",
  "  maxLength: '',",
  "  pattern: '',",
  "  minimum: '',",
  "  maximum: '',",
  '  options: [],',
  "  itemType: 'string'",
  '})',
  '',
  'const fieldTypeLabel = (type) => fieldTypes.find((option) => option.value === type)?.label ?? type',
  'const itemTypeLabel = (type) => itemTypes.find((option) => option.value === type)?.label ?? type',
  'const summary = (field) =>',
  "  field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)",
  '',
  'const keyError = (field) => {',
  '  const key = field.key.trim()',
  "  if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''",
  "  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return 'Letters, digits and underscore, not starting with a digit.'",
  '  return fields.value.some((other) => other.id !== field.id && other.key.trim() === key)',
  "    ? 'Another field already uses this name.'",
  "    : ''",
  '}',
  'const touch = (id) => {',
  '  touched.value = new Set(touched.value).add(id)',
  '}',
  '',
  'const isExpanded = (id) => expanded.value.has(id)',
  'const toggle = (id) => {',
  '  const next = new Set(expanded.value)',
  '  if (next.has(id)) next.delete(id)',
  '  else next.add(id)',
  '  expanded.value = next',
  '}',
  'const open = (id) => {',
  '  expanded.value = new Set(expanded.value).add(id)',
  '}',
  '',
  'const addField = () => {',
  '  const field = newField()',
  '  fields.value.push(field)',
  '  open(field.id)',
  "  nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())",
  '}',
  'const removeField = (index) => {',
  '  const [removed] = fields.value.splice(index, 1)',
  '  if (!removed) return',
  '  const next = new Set(expanded.value)',
  '  next.delete(removed.id)',
  '  expanded.value = next',
  '}',
  'const duplicateField = (index) => {',
  "  const copy = { ...fields.value[index], id: newField().id, key: '' }",
  '  fields.value.splice(index + 1, 0, copy)',
  '  open(copy.id)',
  '}',
  'const move = (index, direction) => {',
  '  const to = index + direction',
  '  if (to < 0 || to >= fields.value.length) return',
  '  const [moved] = fields.value.splice(index, 1)',
  '  fields.value.splice(to, 0, moved)',
  '}',
  'const removeForm = () => {',
  '  form.schema = cleanSchema',
  '  fields.value = []',
  '}',
  '',
  'const onTypeChange = (field) => {',
  "  for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum']) {",
  "    field[constraint] = ''",
  '  }',
  "  if (field.type !== 'select') field.options = []",
  "  if (field.type === 'boolean') field.default = false",
  "  else if (field.type === 'array') field.default = []",
  "  else if (typeof field.default !== 'string') field.default = ''",
  '}',
  'const linesToList = (text) =>',
  '  String(text)',
  "    .split('\\n')",
  '    .map((line) => line.trim())',
  '    .filter(Boolean)',
  "const listToLines = (list) => (Array.isArray(list) ? list.join('\\n') : '')",
  '',
  'const snapshot = () => JSON.stringify({ form, fields: fields.value })',
  'const baseline = ref(snapshot())',
  'const dirty = computed(() => snapshot() !== baseline.value)',
  'const discard = () => {',
  '  const saved = JSON.parse(baseline.value)',
  '  Object.assign(form, saved.form)',
  '  fields.value = saved.fields',
  '}',
  'const save = () => {',
  "  nameError.value = form.name.trim() ? '' : 'This field is required.'",
  "  codeError.value = form.code.trim() ? '' : 'This field is required.'",
  '  if (codeError.value) {',
  "    activeTab.value = 'code'",
  "    activeDocument.value = 'code'",
  '  }',
  "  if (nameError.value) activeTab.value = 'settings'",
  '  if (nameError.value || codeError.value) return',
  '  baseline.value = snapshot()',
  '}'
]

export const components = {
  Button,
  CardBox,
  EmptyState,
  FieldRadioBlock,
  HelperText,
  Hint,
  IconButton,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Link,
  ResizablePanelHandle,
  ResizablePanelPane,
  ResizablePanelRoot,
  SegmentedButton,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Switch,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  Tag,
  Textarea,
  Tooltip
}

const itemDescription = (text) => (text ? `\n    <Item.Description>${text}</Item.Description>` : '')

const fieldRow = (
  title,
  text,
  control,
  directive = ''
) => `<Item${directive} size="small" class="items-start">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${itemDescription(text)}
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(control, 3)}
    </div>
  </Item.Actions>
</Item>`

const compactRow = (title, text, control) => `<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${itemDescription(text)}
  </Item.Content>
  <Item.Actions class="justify-end">
${indent(control, 2)}
  </Item.Actions>
</Item>`

const wideRow = (
  title,
  text,
  control,
  directive = ''
) => `<Item${directive} size="small" class="flex-col items-stretch gap-(--spacing-sm)">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${itemDescription(text)}
  </Item.Content>
  <Item.Actions class="w-full justify-start">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(control, 3)}
    </div>
  </Item.Actions>
</Item>`

const card = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows.join('\n'), 3)}
    </Item.List>
  </template>
</CardBox>`

const section = (
  title,
  hint,
  body
) => `<section class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">${title}</span>
      </h2>${hint ? `\n      <Hint text="${hint}" class="shrink-0" />` : ''}
    </div>
  </div>
  <div class="grid min-w-0 grid-rows-[1fr]">
    <div class="min-w-0 overflow-hidden">
      <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
${indent(body, 4)}
      </div>
    </div>
  </div>
</section>`

const editorFrame = (textarea, helper = '') => `<div class="flex min-h-0 w-full flex-1 flex-col">
  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
${indent(textarea, 2)}
  </div>${helper ? `\n${indent(helper)}` : ''}
</div>`

const PAGE_TABS = `<div class="border-b border-(--border-default)">
  <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
    <TabView v-model:value="activeTab" class="-ml-(--spacing-xs) min-w-0 flex-1">
      <TabView.List>
        <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
      </TabView.List>
    </TabView>
  </div>
</div>`

const CODE_DOCUMENT = editorFrame(
  `<Textarea
  v-model="form.code"
  resizable="none"
  :invalid="!!codeError"
  aria-label="Function code"
  class="flex-1 rounded-none! border-0! font-code"
  @update:model-value="codeError = ''"
/>`,
  `<div v-if="codeError" class="px-(--spacing-sm) py-(--spacing-xs)">
  <HelperText kind="invalid" :label="codeError" />
</div>`
)

const SCHEMA_DOCUMENT = editorFrame(`<Textarea
  v-model="form.schema"
  resizable="none"
  aria-label="Argument form schema, as JSON"
  class="flex-1 rounded-none! border-0! font-code"
/>`)

const GRIP_CLASS =
  'inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-default cursor-grab active:cursor-grabbing motion-reduce:transition-none'

const FIELD_HEADER = `<div class="flex w-full min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md)">
  <div
    class="${GRIP_CLASS}"
    role="button"
    tabindex="0"
    :aria-disabled="fields.length < 2 || undefined"
    :aria-label="'Reorder ' + (field.key || 'this field')"
    @keydown.up.prevent="move(index, -1)"
    @keydown.down.prevent="move(index, 1)"
  >
    <i class="pi pi-bars text-label-sm" aria-hidden="true" />
  </div>
  <Item.Content class="min-w-0 flex-row items-baseline gap-(--spacing-xs)">
    <Item.Title class="truncate font-code text-label-code-sm" :class="field.key ? '' : 'text-(--text-muted)'">
      {{ field.key || 'Unnamed field' }}
    </Item.Title>
    <Item.Description class="shrink-0">{{ summary(field) }}</Item.Description>
  </Item.Content>
  <Item.Actions class="shrink-0 gap-(--spacing-xs)">
    <Tag v-if="field.required" label="Required" severity="info" size="small" />
    <Tag v-if="keyError(field)" label="Needs a name" severity="warning" size="small" />
    <Tooltip text="Duplicate this field">
      <IconButton
        icon="pi pi-clone"
        kind="outlined"
        size="small"
        :aria-label="'Duplicate ' + (field.key || 'this field')"
        @click="duplicateField(index)"
      />
    </Tooltip>
    <Tooltip text="Remove this field">
      <IconButton
        icon="pi pi-trash"
        kind="outlined"
        size="small"
        :aria-label="'Remove ' + (field.key || 'this field')"
        @click="removeField(index)"
      />
    </Tooltip>
    <IconButton
      :icon="isExpanded(field.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
      kind="outlined"
      size="small"
      :aria-expanded="isExpanded(field.id)"
      :aria-controls="formId + '-body-' + field.id"
      :aria-label="(isExpanded(field.id) ? 'Hide' : 'Show') + ' the settings for ' + (field.key || 'this field')"
      @click="toggle(field.id)"
    />
  </Item.Actions>
</div>`

const numericInput = (model, placeholder, label) => `<InputText
  v-model="${model}"
  size="medium"
  inputmode="numeric"
  placeholder="${placeholder}"
  class="w-full"
  aria-label="${label}"
/>`

const DEFAULT_ROW = `<Item size="small" :class="field.type === 'array' ? 'flex-col items-stretch gap-(--spacing-sm)' : 'items-start'">
  <Item.Content>
    <Item.Title>Default</Item.Title>
    <Item.Description>Seeds default_args, and what an instance starts from.</Item.Description>
  </Item.Content>
  <Item.Actions
    :class="field.type === 'boolean' ? 'justify-end' : field.type === 'array' ? 'w-full justify-start' : 'flex-1 justify-end max-w-(--container-3xs)'"
  >
    <Switch v-if="field.type === 'boolean'" v-model="field.default" aria-label="Default" />
    <div v-else class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <Select
        v-if="field.type === 'select'"
        v-model="field.default"
        size="medium"
        class="w-full"
        placeholder="No default"
        :disabled="field.options.length === 0"
      >
        <Select.Trigger aria-label="Default" />
        <Select.Content>
          <Select.Option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </Select.Option>
        </Select.Content>
      </Select>
      <Textarea
        v-else-if="field.type === 'array'"
        :model-value="listToLines(field.default)"
        :rows="3"
        placeholder="One value per line"
        class="w-full font-code"
        aria-label="Default"
        @update:model-value="field.default = linesToList($event)"
      />
      <InputText
        v-else
        v-model="field.default"
        size="medium"
        :inputmode="field.type === 'integer' || field.type === 'number' ? 'numeric' : undefined"
        placeholder="No default"
        autocomplete="off"
        class="w-full font-code"
        aria-label="Default"
      />
    </div>
  </Item.Actions>
</Item>`

const FIELD_SETTINGS = [
  fieldRow(
    'Name',
    'The key in the arguments object, and what the function reads.',
    `<InputText
  :id="formId + '-key-' + field.id"
  v-model="field.key"
  size="medium"
  placeholder="cookie_name"
  autocomplete="off"
  spellcheck="false"
  class="w-full font-code"
  aria-label="Name"
  :invalid="!!keyError(field)"
  :aria-describedby="keyError(field) ? formId + '-message-' + field.id : undefined"
  @blur="touch(field.id)"
/>
<HelperText v-if="keyError(field)" :id="formId + '-message-' + field.id" kind="required" :label="keyError(field)" />`
  ),
  fieldRow(
    'Type',
    'What the field accepts, and the control the form renders.',
    `<Select
  v-model="field.type"
  size="medium"
  class="w-full"
  :display-value="fieldTypeLabel"
  @update:model-value="onTypeChange(field)"
>
  <Select.Trigger aria-label="Type" />
  <Select.Content>
    <Select.Option v-for="option in fieldTypes" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`
  ),
  fieldRow(
    'Label',
    'How the field is named in the form. Falls back to the key.',
    `<InputText
  v-model="field.title"
  size="medium"
  :placeholder="field.key || 'Max Age (seconds)'"
  autocomplete="off"
  class="w-full"
  aria-label="Label"
/>`
  ),
  fieldRow(
    'Description',
    'The guidance under the field.',
    `<InputText
  v-model="field.description"
  size="medium"
  placeholder="What this argument does"
  autocomplete="off"
  class="w-full"
  aria-label="Description"
/>`
  ),
  compactRow(
    'Required',
    'The form refuses to save without it.',
    '<Switch v-model="field.required" aria-label="Required" />'
  ),
  DEFAULT_ROW,
  fieldRow(
    'Minimum length',
    '',
    numericInput('field.minLength', 'No minimum', 'Minimum length'),
    ` v-if="field.type === 'string'"`
  ),
  fieldRow(
    'Maximum length',
    '',
    numericInput('field.maxLength', 'No maximum', 'Maximum length'),
    ` v-if="field.type === 'string'"`
  ),
  wideRow(
    'Pattern',
    'A regular expression the value has to match.',
    `<InputText
  v-model="field.pattern"
  size="medium"
  placeholder="^[a-z0-9_-]+$"
  autocomplete="off"
  spellcheck="false"
  class="w-full font-code"
  aria-label="Pattern"
/>`,
    ` v-if="field.type === 'string'"`
  ),
  fieldRow(
    'Minimum',
    '',
    numericInput('field.minimum', 'No minimum', 'Minimum'),
    ` v-if="field.type === 'integer' || field.type === 'number'"`
  ),
  fieldRow(
    'Maximum',
    '',
    numericInput('field.maximum', 'No maximum', 'Maximum'),
    ` v-if="field.type === 'integer' || field.type === 'number'"`
  ),
  wideRow(
    'Choices',
    'One per line. These are the values the form offers.',
    `<Textarea
  :model-value="listToLines(field.options)"
  :rows="3"
  placeholder="webp&#10;avif&#10;jpeg"
  class="w-full font-code"
  aria-label="Choices"
  @update:model-value="field.options = linesToList($event)"
/>`,
    ` v-if="field.type === 'select'"`
  ),
  fieldRow(
    'List of',
    'The type of every value in the list.',
    `<Select v-model="field.itemType" size="medium" class="w-full" :display-value="itemTypeLabel">
  <Select.Trigger aria-label="List of" />
  <Select.Content>
    <Select.Option v-for="option in itemTypes" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`,
    ` v-if="field.type === 'array'"`
  )
]

const FIELD_ROW = `<Item v-for="(field, index) in fields" :key="field.id" size="small" class="relative flex-col flex-nowrap items-stretch gap-0 px-0!">
${indent(FIELD_HEADER)}
  <div
    :id="formId + '-body-' + field.id"
    class="grid transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    :class="isExpanded(field.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
  >
    <div class="overflow-hidden">
      <Item.List class="mt-(--spacing-xs) border-t border-(--border-muted)">
${indent(FIELD_SETTINGS.join('\n'), 4)}
      </Item.List>
    </div>
  </div>
</Item>`

const ARGUMENTS_DOCUMENT = `<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
  <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">
      {{ fields.length }} {{ fields.length === 1 ? 'field' : 'fields' }}
    </span>
    <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
      <Button label="Add field" kind="outlined" size="medium" icon="pi pi-plus" @click="addField" />
      <Button label="Remove form" kind="outlined" size="medium" icon="pi pi-times" @click="removeForm" />
    </div>
  </div>
  <ResizablePanelRoot class="min-h-0 flex-1 overflow-hidden" aria-label="Argument form">
    <ResizablePanelPane
      v-model:basis="schemaWidth"
      v-model:collapsed="schemaCollapsed"
      collapsible
      :min="280"
      :max="720"
      aria-label="Schema"
      class="bg-(--bg-surface)"
    >
${indent(SCHEMA_DOCUMENT, 3)}
    </ResizablePanelPane>
    <ResizablePanelHandle aria-label="Resize the schema" />
    <ResizablePanelPane aria-label="Fields">
      <div v-if="fields.length === 0" class="flex min-h-0 flex-1 p-(--spacing-sm)">
        <EmptyState
          bordered
          icon="pi pi-plus-circle"
          title="This form has no fields"
          description="Add the first argument the function reads."
          class="min-h-0 flex-1"
        >
          <template #actions>
            <Button label="Add field" kind="secondary" size="medium" icon="pi pi-plus" @click="addField" />
            <Link
              label="Read about function arguments"
              size="medium"
              href="https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/"
              target="_blank"
            />
          </template>
        </EmptyState>
      </div>
      <div v-else class="min-h-0 flex-1 overflow-auto p-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--save-bar-inset,0rem))]">
        <div class="layout-column-form mx-auto flex min-w-0 flex-col gap-(--spacing-sm)">
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <div class="relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) [&>[data-slot=item]:last-child]:border-b-transparent">
${indent(FIELD_ROW, 9)}
                </div>
              </Item.List>
            </template>
          </CardBox>
        </div>
      </div>
    </ResizablePanelPane>
  </ResizablePanelRoot>
</div>`

const CODE_TAB = `<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
  <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)">
    <SegmentedButton v-model="activeDocument" :options="documents" aria-label="Editor document" />
    <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
      {{ activeDocument === 'code' ? runtimeLabel + ', running on request' : 'The fields an instance is asked for, and their defaults.' }}
    </p>
  </div>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-show="activeDocument === 'code'" class="flex min-h-0 flex-1 flex-col">
${indent(CODE_DOCUMENT, 3)}
    </div>
    <div v-show="activeDocument === 'arguments'" class="flex min-h-0 flex-1 flex-col">
${indent(ARGUMENTS_DOCUMENT, 3)}
    </div>
  </div>
</div>`

const SETTINGS_TAB = [
  section(
    'General',
    '',
    card([
      fieldRow(
        'Name',
        'Give a unique and descriptive name to identify your function.',
        `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  autocomplete="off"
  :required="!!nameError"
  :aria-describedby="nameError ? nameMessageId : undefined"
  @update:model-value="nameError = ''"
/>
<HelperText v-if="nameError" :id="nameMessageId" kind="required" :label="nameError" />`
      )
    ])
  ),
  section(
    'Runtime',
    '',
    card([
      fieldRow(
        'Runtime',
        "The runtime isn't editable after the function is created.",
        `<InputText :model-value="runtimeLabel" size="large" class="w-full" aria-label="Runtime" readonly disabled>
  <template #iconRight>
    <i class="pi pi-lock" aria-hidden="true" />
  </template>
</InputText>`
      )
    ])
  ),
  section(
    'Execution environment',
    'Which product runs the function, each handing the code a different request.',
    card([
      wideRow(
        'Runs on',
        '',
        `<fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
  <legend class="sr-only">Execution environment</legend>
  <FieldRadioBlock
    v-model="form.executionEnvironment"
    value="application"
    :name="groupName"
    label="Application"
    description="Runs on requests an application serves, after routing."
  />
  <FieldRadioBlock
    v-model="form.executionEnvironment"
    value="firewall"
    :name="groupName"
    label="Firewall"
    description="Runs inside Firewall, before the request reaches an application, where a request can still be refused."
  />
</fieldset>`
      )
    ])
  ),
  section(
    'Status',
    '',
    card([
      compactRow(
        'Active',
        'An inactive function keeps its code and stops running.',
        '<Switch v-model="form.active" aria-label="Active" />'
      )
    ])
  )
].join('\n\n')

const SAVE_BAR = `<Transition
  enter-active-class="origin-bottom transition-[scale,opacity] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
  enter-from-class="scale-95 opacity-0"
  leave-active-class="origin-bottom transition-[scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  leave-to-class="scale-95 opacity-0"
>
  <footer v-if="dirty" class="pointer-events-none sticky bottom-0 z-10 h-0 shrink-0">
    <div class="absolute inset-x-0 bottom-0 flex justify-center px-(--spacing-md) pb-(--spacing-lg)">
      <div class="pointer-events-auto flex max-w-[min(100%,var(--container-3xl))] items-center gap-(--spacing-xl) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) py-(--spacing-sm) pr-(--spacing-sm) pl-(--spacing-lg) shadow-lg">
        <div class="flex min-w-0 items-start gap-(--spacing-xs)">
          <i class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
          <p class="min-w-0 text-body-sm text-(--text-default)">You have unsaved changes.</p>
        </div>
        <div class="flex shrink-0 items-center gap-(--spacing-sm)">
          <Button type="button" label="Discard" kind="outlined" size="large" @click="discard" />
          <Button label="Save" kind="primary" size="large" @click="save" />
        </div>
      </div>
    </div>
  </footer>
</Transition>`

export const TEMPLATE = `<div class="flex h-screen min-h-0 flex-col bg-(--bg-canvas)">
  <main class="flex h-full min-h-0 flex-col">
    <h1 class="sr-only">{{ form.name }}</h1>
${indent(PAGE_TABS, 2)}
    <section class="flex min-h-0 flex-1 flex-col" :class="activeTab === 'code' ? 'overflow-hidden' : 'overflow-auto'">
      <div class="flex min-h-0 flex-1 flex-col">
        <fieldset class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0">
          <legend class="sr-only">{{ form.name }} settings</legend>
          <div v-show="activeTab === 'code'" class="flex min-h-0 flex-1 flex-col">
${indent(CODE_TAB, 6)}
          </div>
          <div v-show="activeTab === 'settings'" class="layout-column-form layout-boundary flex min-w-0 flex-col">
            <section class="layout-section-start flex min-w-0 flex-col">
${indent(SETTINGS_TAB, 7)}
            </section>
          </div>
        </fieldset>
      </div>
    </section>
${indent(SAVE_BAR, 2)}
  </main>
</div>`

export const FUNCTION_MAIN = TEMPLATE.split('\n')
  .slice(1, -1)
  .map((line) => line.replace(/^ {2}/, ''))
  .join('\n')
