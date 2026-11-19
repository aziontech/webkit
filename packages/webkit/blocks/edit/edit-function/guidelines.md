# Function editor

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

Variant TestRun only; it adds `StatusIndicator`, `CopyButton`, `KeyValueList`, `Trace`, `LogViewer` and `LogViewerContent` to the page.

In TestRun the Code document becomes a vertical `ResizableRoot`: the editor is the flexible pane, and the Test run pane under it has a `basis`, a minimum and a maximum height and collapses past its minimum, so the editor can take the whole height back. The pane scrolls on its own and reads top to bottom like the invocation page of the design sample:

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

A `SaveBar` slides up on the first change to code, arguments or settings, with an outlined Discard and a primary Save, both medium. If Save finds Name empty, it switches to the Settings tab and moves focus to Name; an empty Code document takes focus on the Code tab. Save emits `submit` with the values and the page sets `loading`. While the save runs, Save shows its loading state, Discard, the field list and the Settings fields are disabled, and both editors turn read-only; when `loading` ends with no `error`, a success toast says "image-optimizer saved." and the bar leaves. A failed save (`error` set) keeps the bar and every change, and puts a small danger `Alert` with the message in its leading region ("Not saved. You are offline; check your connection and save again."); Save retries, and Discard emits `discard` so the page clears the error.

## Data

The block takes the saved service and the request state through props and emits the save; it fetches nothing. `FunctionEditorService`, `FunctionEditorField`, `FunctionEditorValues` and `FunctionEditorProps` are exported from `edit-function.vue`, and `sample.ts` holds the sample service and fields the block renders when `service` or `fields` is left out. The editor keeps its own draft; Discard returns to the props.

| Prop              | Type                             | What it does                                                                                        |
| ----------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `service`         | `FunctionEditorService`          | The saved name, execution environment, status, code and argument schema (JSON text).                |
| `fields`          | `FunctionEditorField[]`          | The saved argument fields, in order. Pass `[]` for a service with no form.                          |
| `defaultDraft`    | `Partial<FunctionEditorService>` | Unsaved edits the editor opens with, so the save bar is up.                                         |
| `defaultTab`      | `'code' \| 'settings'`           | The tab the page opens on.                                                                          |
| `defaultDocument` | `'code' \| 'arguments'`          | The document of the Code tab the page opens on.                                                     |
| `defaultOpenKeys` | `string[]`                       | Ids of the fields that open expanded.                                                               |
| `loading`         | `boolean`                        | The save is in flight; when it ends with no `error` the editor takes the draft as saved and toasts. |
| `error`           | `string`                         | Why the save failed, shown in the danger `Alert` of the save bar.                                   |

| Event     | Payload           | When                                                                |
| --------- | ----------------- | ------------------------------------------------------------------- |
| `submit`  | `(event, values)` | Save, once Name and Code are filled; `values` holds the fields too. |
| `discard` | `(event)`         | Discard; the draft is already back to the saved props.              |

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

## States

- Code: the default, `defaultTab` `code`: the Code tab with the Code document filling the editor pane.
- Arguments: `defaultDocument` `arguments` with `defaultOpenKeys`: the Arguments document of image-optimizer, the schema on the left and two fields on the right, one expanded.
- NoArguments: a `service` with an empty schema and `fields` `[]`: the Arguments document of a service with no form, the empty schema and the no fields empty state.
- TestRun: the Code document with a finished test run of image-optimizer under it, the origin fetch selected in the trace; Run test shows the running state.
- Settings: `defaultTab` `settings`: the Settings tab with General, Runtime, Execution environment and Status; editing raises the save bar.
- Saving: `loading` with a `defaultDraft`: a change to the Code document is being saved; Save shows its loading state, Discard and the fields are disabled and the editors are read-only.

## Related

- `shell/shell-console` — the `ConsoleLayout` this page body renders in.
- `edit/edit-resource` — the settings form and save bar pattern the Settings tab follows.
- `view/view-query-editor` — an editor page that runs queries and shows results.
- `view/view-events-explorer` — the events explorer, where the logs of every run land.
- `Trace` — the span waterfall of the test run.
- `detail/detail-version` — reading a deployed version of the code.
- `ResizableRoot` — the split between schema and fields; see `skills/webkit-layout`.
