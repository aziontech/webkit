# EditFunction (`edit/edit-function`)

> The code editor page, a page body for ConsoleLayout (the layout's breadcrumb names the service): the Code and Settings tabs, an editor toolbar whose ToggleGroup switches between the Code document and the Arguments document, and under it either one editor filling the pane or the Arguments split, a Resizable with the collapsible schema editor on the left and the form fields on the right. Both editors are a `CodeEditor` filling its pane with zero-padded line numbers and the Monaco loader from the code-editor spec. On Settings the tab holds the General, Runtime, Execution environment and Status sections, with the unsaved-changes bar: Save shows its loading state while Discard and the fields wait, a saved change raises a success toast, and a failed save keeps the bar with a danger `Alert`. Fields reorder with Move up and Move down buttons. Its page-level parts are `PageTabs`, `SettingsGroup`, `SettingsRow` and `SaveBar`.

- Surface: app
- Source: `blocks/edit/edit-function/edit-function.vue` in `@aziontech/webkit`
- MCP: `get_block("edit/edit-function")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeEditor](../../components/code-editor.md), [ConfirmDialog](../../components/confirm-dialog.md), [CopyButton](../../components/copy-button.md), [EmptyState](../../components/empty-state.md), `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [KeyValueList](../../components/key-value-list.md), [Link](../../components/link.md), `LogViewerContent`, [LogViewer](../../components/log-viewer.md), [PageTabs](../../components/page-tabs.md), [RadioGroup](../../components/radio-group.md), `ResizableHandle`, `ResizablePane`, `ResizableRoot`, [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [StatusIndicator](../../components/status-indicator.md), [Switch](../../components/switch.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), [Trace](../../components/trace.md), `use-shortcuts`, `use-unsaved-changes`, `utils/leave-link`
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-form`

## Asked as

code editor; code editor page; function code editor; editor page; code and arguments editor; split editor; monaco editor; editor de código; página do editor; editar código; function editor; function detail; function arguments; json schema arguments; function settings; editor de função; argumentos da função; detalhe da função; test run; function test; run trace; span waterfall; invocation trace; testar função; execução de teste; rastreamento da execução; function code page; edit function code; function arguments page

The editing page of a service whose behavior lives in source code. The user writes and saves the code, defines the argument form each instance of the service asks for (its fields, types and defaults), and adjusts the service's settings. The editor fills the page so the code has room, and one save bar commits code, arguments and settings together. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the Services breadcrumb, the ⌘K palette and the `main`. The editor pins its own panes, so its root carries `data-layout-fill`: the layout's `main` stops scrolling and the root fills it (`h-dvh` only sizes a standalone preview).

## When to use

- Use the edit-function block for the code and arguments page of a function; the editor itself is the CodeEditor component.
- A resource is mainly a document the user edits as text: function code, a schema, a configuration file.
- The document comes with a structured companion (an argument form) that is easier to edit as fields than as JSON, and the user wants both views side by side.
- The same resource also has a few settings, shown on a second tab of the same page.
- The user tests the code before saving it and needs to read where the run spent its time and what it printed (variant TestRun).

## When not to use

- A resource made only of settings: use `edit/edit-resource`.
- Ordered conditions and actions the user composes without code: use `edit/edit-rule-builder`.
- Free key and value pairs such as environment variables: use `edit/edit-variables`.
- Running queries and reading results: use `view/view-query-editor`.

## Building blocks

### A. Page tabs — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with Code and Settings as `Tabs.Trigger`s. Each tab keeps its state when the user switches away, so unsaved code survives a visit to Settings.

### B. Editor toolbar — `ToggleGroup`, `Button` (required)

A thin bar above the editor with a `ToggleGroup` labeled Editor document that switches between the Code and Arguments documents, and a muted line describing the active one, e.g. the runtime for Code. In TestRun a secondary medium Run test `Button` with a play icon sits at the inline end; it shows its loading state while the run is in flight and reopens the Test run pane if the user collapsed it.

### C. Code document — `CodeEditor`, `FieldError` (required)

A `CodeEditor` with `fill` and `pad-line-numbers` takes the pane: zero-padded line numbers (01, 02…), Tab indents, and Escape then Tab leaves it. It passes `:loader="loadMonaco"`, the loader from the `code-editor` spec: it sets `MonacoEnvironment.getWorker` with the editor, JSON and TypeScript workers (`monaco-editor/editor/editor.worker?worker` and `monaco-editor/languages/features/<json|typescript>/<name>.worker?worker`) and returns `import('monaco-editor')`, so Monaco is code-split, themed from the tokens and has its language services; the plain editor stays the server and no-JavaScript fallback. In TypeScript the loader returns `Promise<CodeEditorMonacoModule>` (exported by `@aziontech/webkit/code-editor`) and casts the imported module to it, because `CodeEditorMonacoModule` does not yet accept the module type of monaco-editor 0.57; the `?worker` imports type-check through the Vite client types that create-vue's `env.d.ts` references. The app installs `monaco-editor` (0.56 or later). An empty document on Save shows an invalid `FieldError` under the editor, cleared on the next keystroke.

### D. Test run — `ResizableRoot`, `ResizablePane`, `ResizableHandle` (optional)

Variant TestRun only: it renders the block and fills its `editor-actions` and `code-panel` slots, adding `StatusIndicator`, `CopyButton`, `KeyValueList`, `Trace`, `LogViewer` and `LogViewerContent` to the page.

In TestRun the Code document becomes a vertical `ResizableRoot`: the editor is the flexible pane, and the Test run pane under it has a `basis`, a minimum and a maximum height and collapses past its minimum, so the editor can take the whole height back. The pane scrolls on its own and reads top to bottom like the invocation page of the design sample. Below `md` the split is dropped: the handle hides, the editor keeps 60% of the screen height and the pane takes its full content height, so the editor and the whole result read in one scroll instead of a pane the user must find a scroll in:

1. The heading Test run, a `StatusIndicator` (Completed, or Running with its loading dot), the run ID in code type with a `CopyButton`.
2. The request that triggered the run and one line on its outcome (the status code and what happened).
3. A four-column `KeyValueList` of Started, Duration, Data center and Memory, in skeletons while the run is in flight.
4. Trace: one sentence on how to read it, then the `Trace` waterfall bound with `v-model:selected-key`, so the selected span's details (service, start, duration, share, attributes) open under it. While running, a status line says the trace appears when the run finishes.
5. Logs: a `LogViewer` with `LogViewerContent` on the same clock as the trace, `copyable`, and its loading state while running.

### E. Arguments split — `ResizableRoot`, `ResizablePane`, `ResizableHandle`, `CodeEditor`, `Button`, `ConfirmDialog` (required)

A count of fields and the outlined Add field and Remove form `Button`s sit above a `ResizableRoot`. Remove form asks first in a small `ConfirmDialog` (the field count, and that Discard brings them back until Save) before it empties the schema. The left `ResizablePane` holds the schema as JSON in a `CodeEditor` (`language="json"`, `fill`, `pad-line-numbers` and the same `loadMonaco`); it is `collapsible` with a minimum and maximum width. The `ResizableHandle` resizes it and collapses it past its minimum. The right pane holds the fields form; both panes describe the same argument form. A `ResizeObserver` on the split keeps the fields usable: while the split is narrower than 640 px (a phone) the `ResizableRoot` turns `vertical`, with the schema on top at 240 px and the fields below at full width; wider, the schema is capped at 45% of the split so the fields never drop under their minimum.

### F. No fields — `EmptyState`, `Button`, `Link` (optional)

When the form has no fields, the right pane shows an `EmptyState` with one sentence, an Add field `Button` and a `Link` to the arguments documentation.

### G. Field list — `Card`, `Item`, `Tag`, `Tooltip`, `IconButton` (required)

A flush `Card` with one small `Item` per field: a Move up and a Move down `IconButton` (transparent, small, disabled at the ends of the list), the field name and type, small `Tag`s for Required and Needs a name, and `IconButton`s to duplicate, remove and expand the field, each named by a `Tooltip`. Only the expanded field shows its settings. A move keeps focus on the button that moved the field (or its sibling once the field reaches an end) and is announced in a polite live region ("quality moved to position 1 of 2.").

### H. Field settings — `SettingsRow`, `Input`, `Select`, `Switch`, `Textarea`, `FieldError` (required)

Inside an expanded field, `SettingsRow`s for Name, Type, Label, Description, Required and Default, then the rows that follow the type: minimum and maximum length and a pattern for text, minimum and maximum for numbers, Choices as a `Textarea` with one value per line, List of for lists. A name error shows as `FieldError` once the field was touched. Field rows set `stackable`, so in a narrow pane the control moves under its copy at full width.

### I. Settings tab — `SettingsGroup`, `Card`, `Item`, `SettingsRow`, `Input`, `RadioGroup`, `Switch`, `FieldError` (required)

The form column with four `SettingsGroup`s: General (Name, required on Save), Runtime (a read-only `Input` with a lock glyph, because it cannot change after creation), Execution environment (On request or At the gateway as `RadioGroup` choice cards (`variant="card"`)) and Status (Active as a `Switch`). See `skills/webkit-form`.

### J. Save bar — `SaveBar`, `Button`, `Alert` (required)

A `SaveBar` slides up on the first change to code, arguments or settings, with an outlined Discard and a primary Save, both medium. If Save finds Name empty, it switches to the Settings tab and moves focus to Name; an empty Code document takes focus on the Code tab. Save emits `submit` with the values and the page sets `loading`. While the save runs, Save shows its loading state, Discard, the field list and the Settings fields are disabled, and both editors turn read-only; when `loading` ends with no `error`, a success toast says "image-optimizer saved." and the bar leaves. A failed save (`error` set) keeps the bar and every change, and puts a small danger `Alert` with the message in its leading region ("Not saved. You are offline; check your connection and save again."); Save retries, and Discard emits `discard` so the page clears the error. The dirty state comes from `useUnsavedChanges`, which also asks the browser to confirm a reload or a tab close while code, arguments or settings hold unsaved edits. With unsaved edits, a click on any link on the page that leaves it in the same tab (the breadcrumb, the sidebar, a back button; `leavingLink` from `@aziontech/webkit/utils/leave-link` skips new-tab, download and in-page links) first opens the guard's `Unsaved changes` `ConfirmDialog` (Keep editing or Discard changes), as `account/account-team-permissions` does in Edit Team; nothing typed is lost silently.

### K. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes the saved service and the request state through props and emits the save; it fetches nothing. `FunctionEditorService`, `FunctionEditorField`, `FunctionEditorValues` and `FunctionEditorProps` are exported from `edit-function.vue`, and `sample.ts` holds the sample service and fields the block renders when `service` or `fields` is left out. The editor keeps its own draft; Discard returns to the props. The page file is the wiring: `parts/` holds its regions (`function-arguments.vue` with `function-field-item.vue` and `function-field-settings.vue`, `function-settings-tab.vue`, `function-save-bar.vue`, and the TestRun pane `function-test-run-pane.vue`), `composables/use-function-fields.ts` the field list behavior (names, expand, add, duplicate, remove, move), `composables/use-function-test-run.ts` the TestRun run and save simulation, and `lib/function-editor.ts` the Monaco loader, the option lists and the field helpers. `webkit add` copies them all.

| Prop               | Type                             | What it does                                                                                        |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `service`          | `FunctionEditorService`          | The saved name, execution environment, status, code and argument schema (JSON text).                |
| `fields`           | `FunctionEditorField[]`          | The saved argument fields, in order. Pass `[]` for a service with no form.                          |
| `defaultDraft`     | `Partial<FunctionEditorService>` | Unsaved edits the editor opens with, so the save bar is up.                                         |
| `v-model:tab`      | `'code' \| 'settings'`           | The active tab, `code` by default; pass `tab` alone to open on a tab.                               |
| `v-model:document` | `'code' \| 'arguments'`          | The document of the Code tab, `code` by default; pass `document` alone to open on one.              |
| `defaultOpenKeys`  | `string[]`                       | Ids of the fields that open expanded.                                                               |
| `loading`          | `boolean`                        | The save is in flight; when it ends with no `error` the editor takes the draft as saved and toasts. |
| `error`            | `string`                         | Why the save failed, shown in the danger `Alert` of the save bar.                                   |

| Event          | Payload           | When                                                                                   |
| -------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `submit`       | `(event, values)` | Save, once Name and Code are filled; `values` holds the fields too.                    |
| `discard`      | `(event)`         | Discard; the draft is already back to the saved props.                                 |
| `editor-ready` | `(editor)`        | The Code document's Monaco editor mounted; add commands to it, such as Run on ⌘ Enter. |

| Slot             | What it holds                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `editor-actions` | Actions at the end of the editor toolbar, such as Run test.                                                                      |
| `code-panel`     | A `ResizableHandle` and a `ResizablePane` under the Code document, such as the Test run pane; the editor becomes the first pane. |

To go live, render the block from a page that owns the request:

```vue
<script setup lang="ts">
  import EditFunction from './edit-function.vue'

  const { service, fields } = useFunction()
  const { run, pending, error, reset } = useSaveFunction()
</script>

<template>
  <EditFunction
    :service="service"
    :fields="fields"
    :loading="pending"
    :error="error ? 'Not saved. Check your connection and save again.' : ''"
    @submit="(event, values) => run(values)"
    @discard="reset"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- Each field has native Move up and Move down buttons named with the field ("Move quality up"); moves are announced in a polite live region.
- The expand button sets `aria-expanded` and `aria-controls` and names the field it opens.
- Every icon-only control has an `aria-label` that matches its `Tooltip`; decorative icons carry `aria-hidden="true"`.
- The save bar's motion respects reduced motion.
- In TestRun the vertical split is labeled "Code and test run", its panes "Source code" and "Test run", and the handle "Resize the test run". The pane is a `section` named by its Test run heading, with Trace and Logs as `h3`s.
- The trace is a `treegrid` with one tab stop (see `Trace`); the running state is announced by a `status` line.
- `⌘ S` (`Ctrl S` off Apple) saves while the `SaveBar` shows unsaved changes, the same as Save, and stops the browser's own save; with no changes it does nothing. Save carries `aria-keyshortcuts` and a `Kbd` keycap.
- In the Test run variant, `⌘ Enter` (`Ctrl Enter` off Apple) runs the test from anywhere on the Code tab, the source editor included, where a bare `Enter` stays a new line. Run test carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- Code: the default, `tab` `code`: the Code tab with the Code document filling the editor pane.
- Arguments: `document` `arguments` with `defaultOpenKeys`: the Arguments document of image-optimizer, the schema on the left and two fields on the right, one expanded.
- NoArguments: a `service` with an empty schema and `fields` `[]`: the Arguments document of a service with no form, the empty schema and the no fields empty state.
- TestRun: the Code document with a finished test run of image-optimizer under it, the origin fetch selected in the trace; Run test shows the running state.
- Settings: `tab` `settings`: the Settings tab with General, Runtime, Execution environment and Status; editing raises the save bar.
- Saving: `loading` with a `defaultDraft`: a change to the Code document is being saved; Save shows its loading state, Discard and the fields are disabled and the editors are read-only.

## Related

- `shell/shell-console` — the `ConsoleLayout` this page body renders in.
- `edit/edit-resource` — the settings form and save bar pattern the Settings tab follows.
- `view/view-query-editor` — an editor page that runs queries and shows results.
- `view/view-events-explorer` — the events explorer, where the logs of every run land.
- `Trace` — the span waterfall of the test run.
- `detail/detail-version` — reading a deployed version of the code.
- `ResizableRoot` — the split between schema and fields; see `skills/webkit-layout`.

## Variants

- `Code` — primary (the code below)
- `Arguments` — The Arguments document of image-optimizer: its form schema in the left pane and its two fields on the right, defaultFormat expanded into its settings and Choices and quality collapsed. The handle resizes the editor and collapses it past its minimum.
- `NoArguments` — The Arguments document of auth-handler, a service with no form: the empty schema on the left and the This form has no fields empty state on the right.
- `Settings` — The Settings tab of image-optimizer: the General, Runtime, Execution environment and Status sections in the form column, the runtime locked; editing anything raises the unsaved-changes bar.
- `TestRun` — The Code document after a test run of image-optimizer: Run test in the editor toolbar, and under the editor a resizable Test run pane with the run status and ID, the request and its outcome, the run details, the `Trace` waterfall with the origin fetch selected, and the run logs in a `LogViewer`. Run test again shows the running state until the run finishes.
- `Saving` — The Code document of image-optimizer while a change is being saved: the save bar stays up, Save shows its loading state, Discard and the fields are disabled and the editors are read-only until the request ends.

Each variant is the same screen in another state: `get_block("edit/edit-function", { variant })`, or the file under `blocks/edit/edit-function/variants/`.

## Code (`Code`)

```vue
<script setup lang="ts">
  import CodeEditor from '@aziontech/webkit/code-editor'
  import FieldError from '@aziontech/webkit/field-error'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { leavingLink } from '@aziontech/webkit/utils/leave-link'
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    toRaw,
    useId,
    watch
  } from 'vue'

  import { useFunctionFields } from './composables/use-function-fields'
  import { documents, loadMonaco, runtimeLabel, tabs } from './lib/function-editor'
  import FunctionArguments from './parts/function-arguments.vue'
  import FunctionLeaveDialog from './parts/function-leave-dialog.vue'
  import FunctionSaveBar from './parts/function-save-bar.vue'
  import FunctionSettingsTab from './parts/function-settings-tab.vue'
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
    defaultOpenKeys: () => [],
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FunctionEditorValues]
    discard: [event: MouseEvent]
    'editor-ready': [editor: unknown]
  }>()

  const activeTab = defineModel<FunctionEditorTab>('tab', { default: 'code' })
  const activeDocument = defineModel<FunctionEditorDocument>('document', { default: 'code' })

  const slots = defineSlots<{
    /** Actions at the end of the editor toolbar, beside the document switch. */
    'editor-actions'(): unknown
    /** A pane under the Code document; when given, a handle splits it from the editor. */
    'code-panel'(): unknown
  }>()

  type SchemaField = FunctionEditorField

  const savedService = computed<FunctionEditorService>(() => props.service ?? sampleService)
  const savedFields = computed<SchemaField[]>(() => props.fields ?? sampleFields)

  const split = () => Boolean(slots['code-panel'])
  const SPLIT_CLASS =
    'flex min-h-0 w-full flex-1 flex-col max-md:overflow-y-auto! max-md:*:h-auto! max-md:*:shrink-0! max-md:*:basis-auto! ' +
    'max-md:*:first:h-[60dvh]! max-md:[&>[role=separator]]:hidden'
  const form = reactive<FunctionEditorService>({ ...savedService.value })
  const draftFields = ref<SchemaField[]>(structuredClone(toRaw(savedFields.value)))
  const nameError = ref('')
  const codeError = ref('')
  const formId = useId()
  const nameMessageId = useId()
  const groupName = useId()
  const fieldList = useFunctionFields(draftFields, formId, props.defaultOpenKeys)
  const { moveStatus } = fieldList

  const guard = useUnsavedChanges(() => ({ form: { ...form }, fields: draftFields.value }), {
    onDiscard: (saved) => {
      Object.assign(form, saved.form)
      draftFields.value = saved.fields
    }
  })
  Object.assign(form, props.defaultDraft)
  const dirty = guard.isDirty
  const saving = computed(() => props.loading)
  const saveError = computed(() => props.error)

  watch(
    () => JSON.stringify({ service: savedService.value, fields: savedFields.value }),
    () => {
      Object.assign(form, savedService.value)
      draftFields.value = structuredClone(toRaw(savedFields.value))
      guard.commit()
    }
  )

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now || props.error) return
      guard.commit()
      toast.success(`${form.name} saved.`)
    }
  )

  const discard = (event: MouseEvent) => {
    const saved = structuredClone(toRaw(guard.baseline.value))
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
  const onSaveShortcut = (event: KeyboardEvent) => {
    if (!dirty.value || saving.value) return
    save(event)
  }
  const onLeaveClick = async (event: MouseEvent) => {
    const link = leavingLink(event)
    if (!link || !dirty.value) return
    event.preventDefault()
    if (await guard.confirmLeave()) window.location.assign(link.href)
  }

  onMounted(() => document.addEventListener('click', onLeaveClick, true))
  onBeforeUnmount(() => document.removeEventListener('click', onLeaveClick, true))
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
                <slot name="editor-actions" />
              </div>
              <div class="flex min-h-0 flex-1 flex-col">
                <div
                  v-show="activeDocument === 'code'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <component
                    :is="split() ? ResizableRoot : 'div'"
                    :orientation="split() ? 'vertical' : undefined"
                    :aria-label="split() ? 'Code and test run' : undefined"
                    :class="split() ? SPLIT_CLASS : 'flex min-h-0 w-full flex-1 flex-col'"
                  >
                    <component
                      :is="split() ? ResizablePane : 'div'"
                      :aria-label="split() ? 'Source code' : undefined"
                      class="flex min-h-0 w-full flex-1 flex-col"
                    >
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
                            @ready="(editor: unknown) => emit('editor-ready', editor)"
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
                    </component>
                    <slot name="code-panel" />
                  </component>
                </div>
                <div
                  v-show="activeDocument === 'arguments'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <FunctionArguments
                    v-model:schema="form.schema"
                    v-model:draft-fields="draftFields"
                    :saving="saving"
                    :form-id="formId"
                    :fields="fieldList"
                  />
                </div>
              </div>
            </div>
          </div>
          <FunctionSettingsTab
            v-show="activeTab === 'settings'"
            :form="form"
            v-model:name-error="nameError"
            :saving="saving"
            :name-message-id="nameMessageId"
            :group-name="groupName"
          />
        </fieldset>
      </div>
    </section>
    <FunctionSaveBar
      :open="dirty || saving"
      :saving="saving"
      :error="saveError"
      @shortcut="onSaveShortcut"
      @discard="discard"
      @save="save"
    />
    <FunctionLeaveDialog :guard="guard" />
  </div>
</template>
```

## `sample.ts`

```ts
import type { LogViewerLine } from '@aziontech/webkit/log-viewer-root'
import type { TraceSpan } from '@aziontech/webkit/trace'

import type { FunctionEditorField, FunctionEditorService } from './edit-function.vue'

const sampleCode = `const ALLOWED = ['webp', 'avif']

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

export const sampleService: FunctionEditorService = {
  name: 'image-optimizer',
  executionEnvironment: 'request',
  active: true,
  code: sampleCode,
  schema: JSON.stringify(formSchema, null, 2)
}

export const sampleFields: FunctionEditorField[] = [
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
]

const authCode = `const SECRET = 'demo-only'

export async function handleRequest(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const response = await fetch(request)
  response.headers.set('x-authenticated', 'true')
  return response
}
`

export const sampleServiceWithoutArguments: FunctionEditorService = {
  name: 'auth-handler',
  executionEnvironment: 'request',
  active: true,
  code: authCode,
  schema: JSON.stringify({ type: 'object', properties: {} }, null, 2)
}

export const sampleRunRequest = 'GET /img/hero.jpg?format=avif'
export const sampleRunSpans: TraceSpan[] = [
  { id: 'root', name: 'image-optimizer', service: 'Function', start: 0, duration: 412 },
  {
    id: 'parse',
    parentId: 'root',
    name: 'parse-request',
    service: 'Compute',
    start: 4,
    duration: 12,
    attributes: { 'args.defaultFormat': 'webp', 'args.quality': 80 }
  },
  {
    id: 'origin',
    parentId: 'root',
    name: 'fetch-origin',
    service: 'Network',
    start: 16,
    duration: 186,
    attributes: {
      'http.method': 'GET',
      'http.url': 'https://assets.example.com/img/hero.jpg',
      'http.status_code': 200
    }
  },
  {
    id: 'dns',
    parentId: 'origin',
    name: 'dns-lookup',
    service: 'Network',
    start: 16,
    duration: 14
  },
  {
    id: 'tls',
    parentId: 'origin',
    name: 'tls-handshake',
    service: 'Security',
    start: 30,
    duration: 31
  },
  {
    id: 'response',
    parentId: 'origin',
    name: 'origin-response',
    service: 'Network',
    start: 61,
    duration: 141
  },
  {
    id: 'decode',
    parentId: 'root',
    name: 'decode',
    service: 'Compute',
    start: 202,
    duration: 54
  },
  {
    id: 'encode',
    parentId: 'root',
    name: 'encode',
    service: 'Compute',
    start: 256,
    duration: 92,
    attributes: { 'image.format': 'avif', 'image.bytes': 421888 }
  },
  {
    id: 'cache',
    parentId: 'root',
    name: 'put-cache',
    service: 'Storage',
    start: 348,
    duration: 38
  }
]
export const sampleRunLines: LogViewerLine[] = [
  { id: 'l1', time: '0 ms', type: 'text', message: 'Run started: ' + sampleRunRequest },
  {
    id: 'l2',
    time: '4 ms',
    type: 'text',
    message: 'args { defaultFormat:"webp", quality: 80 }'
  },
  { id: 'l3', time: '16 ms', type: 'text', message: 'Cache miss, fetching assets.example.com' },
  { id: 'l4', time: '202 ms', type: 'text', message: 'Origin answered 200, image/jpeg, 2.4 MB' },
  { id: 'l5', time: '348 ms', type: 'text', message: 'Encoded 412 KB, 83% smaller' },
  { id: 'l6', time: '412 ms', type: 'success', message: 'Run finished with 200' }
]
export const sampleRunDetails = [
  { label: 'Started', value: 'Nov 10, 2026, 14:28' },
  { label: 'Duration', value: '412 ms' },
  { label: 'Data center', value: 'US East (Washington)' },
  { label: 'Memory', value: '38 MB of 128 MB' }
]

export const sampleRunId = 'run_7f21c9'
```

## `lib/function-editor.ts`

```ts
import type { CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'

import type { FunctionEditorField } from '../edit-function.vue'

export const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
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
  return await import('monaco-editor')
}

export const tabs = [
  { value: 'code', label: 'Code' },
  { value: 'settings', label: 'Settings' }
]
export const documents = [
  { label: 'Code', value: 'code' },
  { label: 'Arguments', value: 'arguments' }
]
export const fieldTypes = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'True / false' },
  { value: 'select', label: 'Choice' },
  { value: 'array', label: 'List' }
]
export const itemTypes = [
  { value: 'string', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'number', label: 'Number' }
]

export const runtimeLabel = 'JavaScript'
export const cleanSchema = JSON.stringify({ type: 'object', properties: {} }, null, 2)

export const fieldTypeLabel = (type: string) =>
  fieldTypes.find((option) => option.value === type)?.label ?? type
export const itemTypeLabel = (type: string) =>
  itemTypes.find((option) => option.value === type)?.label ?? type
export const summary = (field: FunctionEditorField) =>
  field.type === 'array' ? 'List of ' + itemTypeLabel(field.itemType) : fieldTypeLabel(field.type)
export const fieldName = (field: FunctionEditorField) => field.key || 'this field'

export const linesToList = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
export const listToLines = (list: unknown) => (Array.isArray(list) ? list.join('\n') : '')

export const resetForType = (field: FunctionEditorField) => {
  for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum'] as const) {
    field[constraint] = ''
  }
  if (field.type !== 'select') field.options = []
  if (field.type === 'boolean') field.default = false
  else if (field.type === 'array') field.default = []
  else field.default = typeof field.default === 'string' ? field.default : ''
}

export const emptyField = (id: string): FunctionEditorField => ({
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
```

## `composables/use-function-fields.ts`

```ts
import { computed, type ComputedRef, nextTick, type Ref, ref } from 'vue'

import type { FunctionEditorField } from '../edit-function.vue'
import { emptyField, fieldName } from '../lib/function-editor'

export interface UseFunctionFieldsReturn {
  moveStatus: ComputedRef<string>
  keyError: (field: FunctionEditorField) => string
  touch: (id: string) => void
  isExpanded: (id: string) => boolean
  toggle: (id: string) => void
  addField: () => void
  removeField: (index: number) => void
  duplicateField: (index: number) => void
  move: (index: number, direction: number) => void
}

const VALID_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/

function useFieldExpansion(defaultOpenKeys: string[]) {
  const expanded = ref(new Set<string>(defaultOpenKeys))
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
  const close = (id: string) => {
    const next = new Set(expanded.value)
    next.delete(id)
    expanded.value = next
  }
  return { isExpanded, toggle, open, close }
}

function useFieldKeys(draftFields: Ref<FunctionEditorField[]>) {
  const touched = ref(new Set<string>())
  const keyError = (field: FunctionEditorField) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!VALID_KEY.test(key)) return 'Letters, digits and underscore, not starting with a digit.'
    return draftFields.value.some((other) => other.id !== field.id && other.key.trim() === key)
      ? 'Another field already uses this name.'
      : ''
  }
  const touch = (id: string) => {
    touched.value = new Set(touched.value).add(id)
  }
  return { keyError, touch }
}

function focusMoved(formId: string, id: string, direction: number) {
  const same = document.getElementById(`${formId}-${direction < 0 ? 'up' : 'down'}-${id}`)
  const other = document.getElementById(`${formId}-${direction < 0 ? 'down' : 'up'}-${id}`)
  const target = same instanceof HTMLButtonElement && !same.disabled ? same : other
  target?.focus()
}

export function useFunctionFields(
  draftFields: Ref<FunctionEditorField[]>,
  formId: string,
  defaultOpenKeys: string[]
): UseFunctionFieldsReturn {
  const { isExpanded, toggle, open, close } = useFieldExpansion(defaultOpenKeys)
  const { keyError, touch } = useFieldKeys(draftFields)
  const status = ref('')
  let sequence = draftFields.value.length
  const nextId = () => 'field-' + (sequence += 1)

  const addField = () => {
    const field = emptyField(nextId())
    draftFields.value.push(field)
    open(field.id)
    nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())
  }
  const removeField = (index: number) => {
    const [removed] = draftFields.value.splice(index, 1)
    if (removed) close(removed.id)
  }
  const duplicateField = (index: number) => {
    const copy = { ...draftFields.value[index], id: nextId(), key: '' }
    draftFields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }
  const move = (index: number, direction: number) => {
    const to = index + direction
    if (to < 0 || to >= draftFields.value.length) return
    const [moved] = draftFields.value.splice(index, 1)
    draftFields.value.splice(to, 0, moved)
    status.value = `${fieldName(moved)} moved to position ${to + 1} of ${draftFields.value.length}.`
    nextTick(() => focusMoved(formId, moved.id, direction))
  }

  return {
    moveStatus: computed(() => status.value),
    keyError,
    touch,
    isExpanded,
    toggle,
    addField,
    removeField,
    duplicateField,
    move
  }
}
```

## `composables/use-function-test-run.ts`

```ts
import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
import type { editor as MonacoEditor } from 'monaco-editor'
import { computed, type ComputedRef, onScopeDispose, readonly, type Ref, ref } from 'vue'

import type { FunctionEditorDocument, FunctionEditorTab } from '../edit-function.vue'

const writable = <T>(source: Ref<T>) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

export interface UseFunctionTestRunReturn {
  activeTab: Ref<FunctionEditorTab>
  activeDocument: Ref<FunctionEditorDocument>
  selectedSpan: Ref<string>
  resultsHeight: Ref<number>
  resultsExpanded: Ref<boolean>
  running: ComputedRef<boolean>
  saving: Readonly<Ref<boolean>>
  saveError: Readonly<Ref<string>>
  runTest: () => void
  onEditorReady: (editor: unknown) => Promise<void>
  onSubmit: () => void
  clearError: () => void
}

function useSimulatedSave() {
  const saving = ref(false)
  const saveError = ref('')
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  onScopeDispose(() => clearTimeout(saveTimer))
  const onSubmit = () => {
    saveError.value = ''
    saving.value = true
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      if (globalThis.navigator?.onLine === false)
        saveError.value = 'Not saved. You are offline; check your connection and save again.'
      saving.value = false
    }, 900)
  }
  const clearError = () => {
    saveError.value = ''
  }
  return { saving: readonly(saving), saveError: readonly(saveError), onSubmit, clearError }
}

export function useFunctionTestRun(): UseFunctionTestRunReturn {
  const activeTab = ref<FunctionEditorTab>('code')
  const activeDocument = ref<FunctionEditorDocument>('code')
  const runStatus = ref('completed')
  const selectedSpan = ref('origin')
  const resultsHeight = ref(380)
  const resultsExpanded = ref(true)
  let runTimer: ReturnType<typeof setTimeout> | undefined

  const running = computed(() => runStatus.value === 'running')

  const runTest = () => {
    resultsExpanded.value = true
    activeDocument.value = 'code'
    selectedSpan.value = ''
    runStatus.value = 'running'
    clearTimeout(runTimer)
    runTimer = setTimeout(() => {
      runStatus.value = 'completed'
    }, 900)
  }

  onScopeDispose(() => clearTimeout(runTimer))
  useShortcuts({
    keys: 'meta+enter',
    label: 'Run test',
    group: 'Page',
    when: () => activeTab.value === 'code' && !running.value,
    handler: () => runTest()
  })
  const onEditorReady = async (editor: unknown) => {
    const { KeyCode, KeyMod } = await import('monaco-editor')
    const sourceEditor = editor as MonacoEditor.IStandaloneCodeEditor
    sourceEditor.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, () => {
      if (!running.value) runTest()
    })
  }

  return {
    activeTab: writable(activeTab),
    activeDocument: writable(activeDocument),
    selectedSpan: writable(selectedSpan),
    resultsHeight: writable(resultsHeight),
    resultsExpanded: writable(resultsExpanded),
    running,
    runTest,
    onEditorReady,
    ...useSimulatedSave()
  }
}
```

## `parts/function-arguments.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import ResizableRoot from '@aziontech/webkit/resizable-root'
  import { computed, ref, watch } from 'vue'

  import type { UseFunctionFieldsReturn } from '../composables/use-function-fields'
  import type { FunctionEditorField } from '../edit-function.vue'
  import { cleanSchema, loadMonaco } from '../lib/function-editor'
  import FunctionFieldItem from './function-field-item.vue'

  export interface FunctionArgumentsProps {
    /** The save is in flight: the editors and the field list lock. */
    saving: boolean
    /** Prefix of the ids inside the argument form. */
    formId: string
    /** The field list behaviour. */
    fields: UseFunctionFieldsReturn
  }

  defineProps<FunctionArgumentsProps>()

  const schema = defineModel<string>('schema', { required: true })
  const draftFields = defineModel<FunctionEditorField[]>('draftFields', { required: true })

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

  const removeFormOpen = ref(false)
  const removeForm = () => {
    schema.value = cleanSchema
    draftFields.value = []
    removeFormOpen.value = false
  }

  const FIELD_LIST_CLASS =
    'relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) ' +
    '[&>[data-slot=item]:last-child]:border-b-transparent'
</script>

<template>
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
          @click="fields.addField"
        />
        <ConfirmDialog
          v-model:open="removeFormOpen"
          title="Remove form"
          :description="`The ${draftFields.length} ${draftFields.length === 1 ? 'field' : 'fields'} of the argument form are removed. Discard brings them back until you save.`"
          confirm-label="Remove form"
          size="small"
          @confirm="removeForm"
        >
          <template #trigger>
            <Button
              label="Remove form"
              variant="outline"
              size="medium"
              icon="az az-x"
              :disabled="saving"
            />
          </template>
        </ConfirmDialog>
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
                  v-model="schema"
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
                    @click="fields.addField"
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
                    <div :class="FIELD_LIST_CLASS">
                      <FunctionFieldItem
                        v-for="(field, index) in draftFields"
                        :key="field.id"
                        v-model:field="draftFields[index]"
                        :index="index"
                        :count="draftFields.length"
                        :form-id="formId"
                        :fields="fields"
                      />
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
</template>
```

## `parts/function-field-item.vue`

```ts
<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { UseFunctionFieldsReturn } from '../composables/use-function-fields'
  import type { FunctionEditorField } from '../edit-function.vue'
  import { fieldName, summary } from '../lib/function-editor'
  import FunctionFieldSettings from './function-field-settings.vue'

  export interface FunctionFieldItemProps {
    /** Position of the field in the list. */
    index: number
    /** How many fields the list holds. */
    count: number
    /** Prefix of the ids inside the argument form. */
    formId: string
    /** The field list the item belongs to. */
    fields: UseFunctionFieldsReturn
  }

  defineProps<FunctionFieldItemProps>()

  const field = defineModel<FunctionEditorField>('field', { required: true })

  const FIELD_BODY_CLASS =
    'grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance ' +
    'data-[state=open]:grid-rows-[1fr] ' +
    'motion-reduce:transition-none'
</script>

<template>
  <Item size="small">
    <div class="flex w-full flex-col items-stretch">
      <div
        class="flex w-full min-w-0 flex-wrap items-center gap-(--spacing-xs) px-(--spacing-md)"
        data-slot="field-header"
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
            @click="fields.move(index, -1)"
          />
          <IconButton
            :id="`${formId}-down-${field.id}`"
            icon="az az-arrow-down"
            variant="ghost"
            size="small"
            :disabled="index === count - 1"
            :aria-label="'Move ' + fieldName(field) + ' down'"
            @click="fields.move(index, 1)"
          />
        </div>
        <Item.Content class="min-w-32">
          <div class="flex min-w-0 flex-row items-baseline gap-(--spacing-xs)">
            <Item.Title class="min-w-0">
              <span
                :data-empty="!field.key || null"
                class="truncate font-code text-label-code-sm data-empty:text-(--text-muted)"
              >
                {{ field.key || 'Unnamed field' }}
              </span>
            </Item.Title>
            <div class="hidden min-w-0 md:block">
              <Item.Description>
                <span class="block truncate">{{ summary(field) }}</span>
              </Item.Description>
            </div>
          </div>
        </Item.Content>
        <Item.Actions class="ms-auto shrink-0">
          <Tag
            v-if="field.required"
            key="required"
            label="Required"
            severity="info"
            size="small"
          />
          <Tag
            v-if="fields.keyError(field)"
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
              :aria-label="'Duplicate ' + (field.key || 'this field')"
              @click="fields.duplicateField(index)"
            />
          </Tooltip>
          <Tooltip content="Remove this field">
            <IconButton
              icon="az az-trash"
              variant="outline"
              size="small"
              :aria-label="'Remove ' + (field.key || 'this field')"
              @click="fields.removeField(index)"
            />
          </Tooltip>
          <IconButton
            :icon="fields.isExpanded(field.id) ? 'az az-chevron-up' : 'az az-chevron-down'"
            variant="outline"
            size="small"
            :aria-expanded="fields.isExpanded(field.id)"
            :aria-controls="formId + '-body-' + field.id"
            :aria-label="
              (fields.isExpanded(field.id) ? 'Hide' : 'Show') +
              ' the settings for ' +
              (field.key || 'this field')
            "
            @click="fields.toggle(field.id)"
          />
        </Item.Actions>
      </div>
      <div
        :id="formId + '-body-' + field.id"
        :data-state="fields.isExpanded(field.id) ? 'open' : 'closed'"
        :class="FIELD_BODY_CLASS"
      >
        <div class="overflow-hidden">
          <div class="mt-(--spacing-xs) border-t border-(--border-muted)">
            <FunctionFieldSettings
              v-model:field="field"
              :form-id="formId"
              :fields="fields"
            />
          </div>
        </div>
      </div>
    </div>
  </Item>
</template>
```

## `parts/function-field-settings.vue`

```ts
<script setup lang="ts">
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'

  import type { UseFunctionFieldsReturn } from '../composables/use-function-fields'
  import type { FunctionEditorField } from '../edit-function.vue'
  import {
    fieldTypeLabel,
    fieldTypes,
    itemTypeLabel,
    itemTypes,
    linesToList,
    listToLines,
    resetForType
  } from '../lib/function-editor'

  export interface FunctionFieldSettingsProps {
    /** Prefix of the ids inside the argument form. */
    formId: string
    /** The field list the row belongs to. */
    fields: UseFunctionFieldsReturn
  }

  defineProps<FunctionFieldSettingsProps>()

  const field = defineModel<FunctionEditorField>('field', { required: true })
</script>

<template>
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
          :invalid="!!fields.keyError(field)"
          :aria-describedby="fields.keyError(field) ? formId + '-message-' + field.id : undefined"
          @blur="fields.touch(field.id)"
        />
      </div>
      <FieldError
        v-if="fields.keyError(field)"
        :id="formId + '-message-' + field.id"
        >{{ fields.keyError(field) }}</FieldError
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
        @update:model-value="resetForType(field)"
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
        :placeholder="field.key || 'Max Age (seconds)'"
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
        :class="field.type === 'array' ? 'flex-col items-stretch' : 'items-center'"
      >
        <Item.Content>
          <Item.Title>Default</Item.Title>
          <Item.Description>Seeds the arguments an instance starts from.</Item.Description>
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
                <Select.Trigger aria-label="Default" />
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
                  :model-value="listToLines(field.default)"
                  :rows="3"
                  placeholder="One value per line"
                  class="w-full"
                  aria-label="Default"
                  @update:model-value="field.default = linesToList($event)"
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
                    field.type === 'integer' || field.type === 'number' ? 'numeric' : undefined
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
      v-if="field.type === 'integer' || field.type === 'number'"
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
      v-if="field.type === 'integer' || field.type === 'number'"
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
          @update:model-value="field.options = linesToList($event)"
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
</template>
```

## `parts/function-save-bar.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'

  export interface FunctionSaveBarProps {
    /** The bar shows: there are unsaved edits or a save is in flight. */
    open: boolean
    /** The save is in flight. */
    saving: boolean
    /** Why the save failed. */
    error: string
  }

  defineProps<FunctionSaveBarProps>()

  const emit = defineEmits<{
    save: [event: Event]
    shortcut: [event: KeyboardEvent]
    discard: [event: MouseEvent]
  }>()
</script>

<template>
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <SaveBar
      v-if="open"
      @save="(event: KeyboardEvent) => emit('shortcut', event)"
    >
      <template
        v-if="error"
        #leading
      >
        <Alert
          severity="danger"
          size="small"
          :label="error"
          data-testid="code-editor-save-error"
        />
      </template>
      {{ saving ? 'Saving changes…' : 'You have unsaved changes.' }}

      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="saving"
          @click="(event: MouseEvent) => emit('discard', event)"
        />
        <Button
          variant="primary"
          size="medium"
          :loading="saving"
          @click="(event: Event) => emit('save', event)"
          aria-keyshortcuts="Meta+S Control+S"
        >
          Save
          <Kbd
            meta
            size="small"
            aria-hidden="true"
            >S</Kbd
          >
        </Button>
      </template>
    </SaveBar>
  </Transition>
</template>
```

## `parts/function-settings-tab.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import type { FunctionEditorService } from '../edit-function.vue'
  import { runtimeLabel } from '../lib/function-editor'

  export interface FunctionSettingsTabProps {
    /** The save is in flight: the fields lock. */
    saving: boolean
    /** Id of the name error message. */
    nameMessageId: string
    /** Name of the execution environment radio group. */
    groupName: string
  }

  defineProps<FunctionSettingsTabProps>()

  const form = defineModel<FunctionEditorService>('form', { required: true })
  const nameError = defineModel<string>('nameError', { required: true })
</script>

<template>
  <div class="layout-column-form layout-boundary flex min-w-0 flex-col">
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
</template>
```

## `parts/function-test-run-pane.vue`

```ts
<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import LogViewerContent from '@aziontech/webkit/log-viewer-content'
  import LogViewer from '@aziontech/webkit/log-viewer-root'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Trace from '@aziontech/webkit/trace'

  import {
    sampleRunDetails,
    sampleRunId,
    sampleRunLines,
    sampleRunRequest,
    sampleRunSpans
  } from '../sample'

  export interface FunctionTestRunPaneProps {
    /** The test run is in flight. */
    running: boolean
  }

  defineProps<FunctionTestRunPaneProps>()

  const basis = defineModel<number>('basis', { required: true })
  const open = defineModel<boolean>('open', { required: true })
  const selectedSpan = defineModel<string>('selectedKey', { required: true })
</script>

<template>
  <ResizablePane
    v-model:basis="basis"
    v-model:open="open"
    collapsible
    :min="200"
    :max="720"
    aria-label="Test run"
  >
    <section
      aria-labelledby="test-run-title"
      class="flex min-h-0 w-full flex-1 flex-col gap-(--spacing-md) overflow-auto border-t border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
    >
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <h2
          id="test-run-title"
          class="text-label-md text-(--text-default)"
        >
          Test run
        </h2>
        <StatusIndicator
          :severity="running ? 'info' : 'success'"
          :label="running ? 'Running' : 'Completed'"
          :loading="running"
        />
        <span class="truncate text-label-code-sm text-(--text-muted)">{{ sampleRunId }}</span>
        <CopyButton
          :value="sampleRunId"
          aria-label="Copy the run ID"
          variant="outline"
          size="small"
        />
      </div>

      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <i
          class="az az-arrow-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
          aria-hidden="true"
        />
        <span class="truncate text-label-code-sm text-(--text-default)">{{
          sampleRunRequest
        }}</span>
        <span class="text-body-sm text-(--text-muted)">
          {{
            running
              ? 'Waiting for the function to answer.'
              : '200, served from the transform and written to cache.'
          }}
        </span>
      </div>

      <KeyValueList
        :columns="4"
        :loading="running"
        aria-label="Run details"
      >
        <KeyValueList.Item
          v-for="detail in sampleRunDetails"
          :key="detail.label"
          :label="detail.label"
        >
          {{ detail.value }}
        </KeyValueList.Item>
      </KeyValueList>

      <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
        <h3 class="text-label-sm text-(--text-default)">Trace</h3>
        <p class="text-body-sm text-(--text-muted)">
          One row per span, placed against the run's own clock. Select a row to read what it
          measured.
        </p>
        <Trace
          v-if="!running"
          v-model:selected-key="selectedSpan"
          :spans="sampleRunSpans"
          aria-label="Trace of the test run"
        />
        <p
          v-else
          role="status"
          class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) text-body-sm text-(--text-muted)"
        >
          The trace appears when the run finishes.
        </p>
      </div>

      <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
        <h3 class="text-label-sm text-(--text-default)">Logs</h3>
        <LogViewer
          :lines="sampleRunLines"
          :loading="running"
          loading-label="Running the test…"
          copyable
        >
          <LogViewerContent>
            <template #empty>No log lines yet.</template>
          </LogViewerContent>
        </LogViewer>
      </div>
    </section>
  </ResizablePane>
</template>
```
