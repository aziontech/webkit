# CodeEditor (`platform/edit/code-editor`)

> The code editor page, a page body for ConsoleLayout (the layout's breadcrumb names the service): the Code and Settings tabs, an editor toolbar whose ToggleGroup switches between the Code document and the Arguments document, and under it either one editor filling the pane or the Arguments split, a Resizable with the collapsible schema editor on the left and the form fields on the right. Both editors are a `CodeEditor` filling its pane with zero-padded line numbers and the Monaco loader from the code-editor spec. On Settings the tab holds the General, Runtime, Execution environment and Status sections, with the unsaved-changes bar. Its page-level parts are `PageTabs`, `SettingsSection`, `SettingRow` and `SaveBar`.

- Surface: product
- Source: `blocks/platform/edit/code-editor/code-editor.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/edit/code-editor")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [CodeEditor](../../../components/code-editor.md), [CopyButton](../../../components/copy-button.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [KeyValuePairs](../../../components/key-value-pairs.md), [Link](../../../components/link.md), [LogView](../../../components/log-view.md), `LogViewContent`, [PageTabs](../../../components/page-tabs.md), [RadioButton](../../../components/radio-button.md), `ResizableHandle`, `ResizablePane`, `ResizableRoot`, [SaveBar](../../../components/save-bar.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [StatusIndicator](../../../components/status-indicator.md), [Switch](../../../components/switch.md), [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md), [Trace](../../../components/trace.md)
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-form`

## Asked as

code editor; code editor page; function code editor; editor page; code and arguments editor; split editor; monaco editor; editor de código; página do editor; editar código; function editor; edge function; function detail; function arguments; json schema arguments; function settings; editor de função; argumentos da função; detalhe da função; test run; function test; run trace; span waterfall; invocation trace; testar função; execução de teste; rastreamento da execução

The editing page of a service whose behavior lives in source code. The user writes and saves the code, defines the argument form each instance of the service asks for (its fields, types and defaults), and adjusts the service's settings. The editor fills the page so the code has room, and one save bar commits code, arguments and settings together. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the Services breadcrumb, the ⌘K palette and the `main`. The editor pins its own panes, so its root carries `data-layout-fill`: the layout's `main` stops scrolling and the root fills it (`h-dvh` only sizes a standalone preview).

## When to use

- A resource is mainly a document the user edits as text: function code, a schema, a configuration file.
- The document comes with a structured companion (an argument form) that is easier to edit as fields than as JSON, and the user wants both views side by side.
- The same resource also has a few settings, shown on a second tab of the same page.
- The user tests the code before saving it and needs to read where the run spent its time and what it printed (variant TestRun).

## When not to use

- A resource made only of settings: use `platform/edit/edit-resource`.
- Ordered conditions and actions the user composes without code: use `platform/edit/rule-builder`.
- Free key and value pairs such as environment variables: use `platform/edit/attribute-editor`.
- Running queries and reading results: use `platform/view/query-editor`.

## Building blocks

### A. Page tabs — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with Code and Settings as `Tabs.Item`s. Each tab keeps its state when the user switches away, so unsaved code survives a visit to Settings.

### B. Editor toolbar — `ToggleGroup`, `Button` (required)

A thin bar above the editor with a `ToggleGroup` labeled Editor document that switches between the Code and Arguments documents, and a muted line describing the active one, e.g. the runtime for Code. In TestRun a secondary medium Run test `Button` with a play icon sits at the inline end; it shows its loading state while the run is in flight and reopens the Test run pane if the user collapsed it.

### C. Code document — `CodeEditor`, `HelperText` (required)

A `CodeEditor` with `fill` and `pad-line-numbers` takes the pane: zero-padded line numbers (01, 02…), Tab indents, and Escape then Tab leaves it. It passes `:loader="loadMonaco"`, the loader from the `code-editor` spec: it sets `MonacoEnvironment.getWorker` with the editor, JSON and TypeScript workers (`monaco-editor/editor/editor.worker?worker` and `monaco-editor/languages/features/<json|typescript>/<name>.worker?worker`) and returns `import('monaco-editor')`, so Monaco is code-split, themed from the tokens and has its language services; the plain editor stays the server and no-JavaScript fallback. In TypeScript the loader returns `Promise<CodeEditorMonacoModule>` (exported by `@aziontech/webkit/code-editor`) and casts the imported module to it, because `CodeEditorMonacoModule` does not yet accept the module type of monaco-editor 0.57; the `?worker` imports type-check through the Vite client types that create-vue's `env.d.ts` references. The app installs `monaco-editor` (0.56 or later). An empty document on Save shows an invalid `HelperText` under the editor, cleared on the next keystroke.

### D. Test run — `ResizableRoot`, `ResizablePane`, `ResizableHandle` (optional)

Variant TestRun only; it adds `StatusIndicator`, `CopyButton`, `KeyValuePairs`, `Trace`, `LogView` and `LogViewContent` to the page.

In TestRun the Code document becomes a vertical `ResizableRoot`: the editor is the flexible pane, and the Test run pane under it has a `basis`, a minimum and a maximum height and collapses past its minimum, so the editor can take the whole height back. The pane scrolls on its own and reads top to bottom like the invocation page of the design sample:

1. The heading Test run, a `StatusIndicator` (Completed, or Running with its loading dot), the run ID in code type with a `CopyButton`.
2. The request that triggered the run and one line on its outcome (the status code and what happened).
3. A four-column `KeyValuePairs` of Started, Duration, Edge location and Memory, in skeletons while the run is in flight.
4. Trace: one sentence on how to read it, then the `Trace` waterfall bound with `v-model:selected`, so the selected span's details (service, start, duration, share, attributes) open under it. While running, a status line says the trace appears when the run finishes.
5. Logs: a `LogView` with `LogViewContent` on the same clock as the trace, `copyable`, and its loading state while running.

### E. Arguments split — `ResizableRoot`, `ResizablePane`, `ResizableHandle`, `CodeEditor`, `Button` (required)

A count of fields and the outlined Add field and Remove form `Button`s sit above a `ResizableRoot`. The left `ResizablePane` holds the schema as JSON in a `CodeEditor` (`language="json"`, `fill`, `pad-line-numbers` and the same `loadMonaco`); it is `collapsible` with a minimum and maximum width. The `ResizableHandle` resizes it and collapses it past its minimum. The right pane holds the fields form; both panes describe the same argument form.

### F. No fields — `EmptyState`, `Button`, `Link` (optional)

When the form has no fields, the right pane shows an `EmptyState` with one sentence, an Add field `Button` and a `Link` to the arguments documentation.

### G. Field list — `Card`, `Item`, `Tag`, `Tooltip`, `IconButton` (required)

A flush `Card` with one small `Item` per field: a reorder grip, the field name and type, small `Tag`s for Required and Needs a name, and `IconButton`s to duplicate, remove and expand the field, each named by a `Tooltip`. Only the expanded field shows its settings.

### H. Field settings — `SettingRow`, `Input`, `Select`, `Switch`, `Textarea`, `HelperText` (required)

Inside an expanded field, `SettingRow`s for Name, Type, Label, Description, Required and Default, then the rows that follow the type: minimum and maximum length and a pattern for text, minimum and maximum for numbers, Choices as a `Textarea` with one value per line, List of for lists. A name error shows as `HelperText` once the field was touched.

### I. Settings tab — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Input`, `Field`, `RadioButton`, `Switch`, `HelperText` (required)

The form column with four `SettingsSection`s: General (Name, required on Save), Runtime (a read-only `Input` with a lock glyph, because it cannot change after creation), Execution environment (On request or At the gateway as `Field` choice cards around `RadioButton`s) and Status (Active as a `Switch`). See `skills/webkit-form`.

### J. Save bar — `SaveBar`, `Button` (required)

A `SaveBar` slides up on the first change to code, arguments or settings, with an outlined Discard and a primary Save, both medium. If Save finds Name empty, it switches to the Settings tab and moves focus to Name; an empty Code document takes focus on the Code tab.

## Do

- Let the editor fill the pane; the page scrolls inside the editor, not around it.
- Mark the page root with `data-layout-fill`.
- Show the schema JSON and the fields form side by side, so the user can check one against the other.
- Keep collapsed fields as one-line summaries with their tags, and open settings only for the field being edited.
- Lock fields that cannot change after creation, with a lock glyph and a description that says so.
- Use one save bar for both tabs, and take the user to the tab that holds the error.
- Show a test run under the code it ran, on the same page: the trace and the logs on one clock, the summary first.
- Select the span the user most likely wants (the slowest or the failed one) when the run finishes.

## Don't

- Don't put the code editor inside a card, a drawer or a modal.
- Don't add a page heading above the tabs; the layout's breadcrumb names the service.
- Don't size the page with `calc(100dvh - …)`; it overflows under a notification.
- Don't save from inside the Arguments pane or a field; Save lives in the bar.
- Don't flag a new field's name before the user has touched it.
- Don't let the schema pane squeeze the fields pane below a usable width; collapse it instead.
- Don't open a test run in a dialog or a new page; it covers the code the user is about to fix.
- Don't save as a side effect of Run test; a test runs the code in the editor, saved or not.
- Don't report a test run with a toast; the result lives in the pane, where the user is looking.

## Copy

- **Tabs and documents:** single nouns, e.g. "Code", "Settings", "Arguments".
- **Field count:** a number and the noun, e.g. "1 field", "2 fields".
- **Buttons:** verb first, three words or fewer, e.g. "Add field", "Remove form", "Discard", "Save".
- **Empty state:** title states the fact, e.g. "This form has no fields"; description says what to do, e.g. "Add the first argument the service reads."
- **Errors:** short and specific, e.g. "This field is required.", "Another field already uses this name."
- **Save bar:** "You have unsaved changes."
- **Test run:** status as one word ("Completed", "Running", "Failed"); the outcome as the status code and what happened, e.g. "200, served from the transform and written to cache."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Both editors have an `aria-label` that names the document, e.g. "Source code", "Argument form schema, as JSON".
- The split is labeled "Argument form", its panes "Schema" and "Fields", and the handle "Resize the schema".
- Field grips are focusable buttons named "Reorder" plus the field name, and move the field with the arrow keys.
- The expand button sets `aria-expanded` and `aria-controls` and names the field it opens.
- Every icon-only control has an `aria-label` that matches its `Tooltip`; decorative icons carry `aria-hidden="true"`.
- The save bar's motion respects reduced motion.
- In TestRun the vertical split is labeled "Code and test run", its panes "Source code" and "Test run", and the handle "Resize the test run". The pane is a `section` named by its Test run heading, with Trace and Logs as `h3`s.
- The trace is a `treegrid` with one tab stop (see `Trace`); the running state is announced by a `status` line.

## States

- Code: the Code tab with the Code document filling the editor pane.
- Arguments: the Arguments document of image-optimizer, the schema on the left and two fields on the right, one expanded.
- NoArguments: the Arguments document of a service with no form, the empty schema and the no fields empty state.
- TestRun: the Code document with a finished test run of image-optimizer under it, the origin fetch selected in the trace; Run test shows the running state.
- Settings: the Settings tab with General, Runtime, Execution environment and Status; editing raises the save bar.

## Related

- `shells/console` — the `ConsoleLayout` this page body renders in.
- `platform/edit/edit-resource` — the settings form and save bar pattern the Settings tab follows.
- `platform/view/query-editor` — an editor page that runs queries and shows results.
- `platform/view/split-view` — the events explorer, where the logs of every run land.
- `Trace` — the span waterfall of the test run.
- `platform/detail/version-detail` — reading a deployed version of the code.
- `ResizableRoot` — the split between schema and fields; see `skills/webkit-layout`.

## Variants

- `Code` — primary (the code below)
- `Arguments` — The Arguments document of image-optimizer: its form schema in the left pane and its two fields on the right, defaultFormat expanded into its settings and Choices and quality collapsed. The handle resizes the editor and collapses it past its minimum.
- `NoArguments` — The Arguments document of auth-handler, a service with no form: the empty schema on the left and the This form has no fields empty state on the right.
- `Settings` — The Settings tab of image-optimizer: the General, Runtime, Execution environment and Status sections in the form column, the runtime locked; editing anything raises the unsaved-changes bar.
- `TestRun` — The Code document after a test run of image-optimizer: Run test in the editor toolbar, and under the editor a resizable Test run pane with the run status and ID, the request and its outcome, the run details, the `Trace` waterfall with the origin fetch selected, and the run logs in a `LogView`. Run test again shows the running state until the run finishes.

Each variant is the same screen in another state: `get_pattern("platform/edit/code-editor", { variant })`, or the file under `blocks/platform/edit/code-editor/variants/`.

## Code (`Code`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor, { type CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'
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

  type FieldBase = {
    id: string
    key: string
    title: string
    description: string
    required: boolean
    minLength: string
    maxLength: string
    pattern: string
    minimum: string
    maximum: string
    options: string[]
    itemType: string
  }
  type SchemaField = FieldBase &
    (
      | { type: 'boolean'; default: boolean }
      | { type: 'array'; default: string[] }
      | { type: 'string' | 'integer' | 'number' | 'select'; default: string }
    )

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
  const code = `const ALLOWED = ['webp', 'avif']

export async function handleRequest(request, args = {}) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') ?? args.defaultFormat

  if (!ALLOWED.includes(format)) return fetch(request)

  url.searchParams.set('format', format)
  url.searchParams.set('quality', String(args.quality))
  return fetch(url.toString())
}
`
  const formSchema = {
    type: 'object',
    properties: {
      defaultFormat: {
        type: 'string',
        title: 'Default format',
        description:
          'Used when the request does not ask for a format. Only these are rewritten. Anything else passes through untouched.',
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
  }
  const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)

  const activeTab = ref('code')
  const activeDocument = ref('code')
  const form = reactive({
    name: 'image-optimizer',
    executionEnvironment: 'request',
    active: true,
    code,
    schema: JSON.stringify(formSchema, null, 2)
  })
  const fields = ref<SchemaField[]>([
    {
      id: 'field-1',
      key: 'defaultFormat',
      type: 'select',
      title: 'Default format',
      description:
        'Used when the request does not ask for a format. Only these are rewritten. Anything else passes through untouched.',
      required: true,
      default: 'webp',
      minLength: '',
      maxLength: '',
      pattern: '',
      minimum: '',
      maximum: '',
      options: ['webp', 'avif'],
      itemType: 'string'
    },
    {
      id: 'field-2',
      key: 'quality',
      type: 'integer',
      title: 'Quality',
      description: 'Compression quality applied to every rewritten image.',
      required: false,
      default: '80',
      minLength: '',
      maxLength: '',
      pattern: '',
      minimum: '1',
      maximum: '100',
      options: [],
      itemType: 'string'
    }
  ])
  const expanded = ref(new Set<string>())
  const touched = ref(new Set<string>())
  const schemaWidth = ref(420)
  const schemaCollapsed = ref(false)
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()

  let sequence = 2
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

  const fieldTypeLabel = (type: unknown) =>
    fieldTypes.find((option) => option.value === type)?.label ?? String(type)
  const itemTypeLabel = (type: unknown) =>
    itemTypes.find((option) => option.value === type)?.label ?? String(type)
  const summary = (field: SchemaField) =>
    field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)

  const keyError = (field: SchemaField) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key))
      return 'Letters, digits and underscore, not starting with a digit.'
    return fields.value.some((other) => other.id !== field.id && other.key.trim() === key)
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
    fields.value.push(field)
    open(field.id)
    nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())
  }
  const removeField = (index: number) => {
    const [removed] = fields.value.splice(index, 1)
    if (!removed) return
    const next = new Set(expanded.value)
    next.delete(removed.id)
    expanded.value = next
  }
  const duplicateField = (index: number) => {
    const copy = { ...fields.value[index], id: newField().id, key: '' }
    fields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }
  const move = (index: number, direction: number) => {
    const to = index + direction
    if (to < 0 || to >= fields.value.length) return
    const [moved] = fields.value.splice(index, 1)
    fields.value.splice(to, 0, moved)
  }
  const removeForm = () => {
    form.schema = cleanSchema
    fields.value = []
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
  const linesToList = (text: unknown) =>
    String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  const listToLines = (list: unknown) => (Array.isArray(list) ? list.join('\n') : '')

  const snapshot = () => JSON.stringify({ form, fields: fields.value })
  const baseline = ref(snapshot())
  const dirty = computed(() => snapshot() !== baseline.value)
  const discard = () => {
    const saved: { form: typeof form; fields: SchemaField[] } = JSON.parse(baseline.value)
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
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
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
                                                        :spellcheck="false"
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
```
