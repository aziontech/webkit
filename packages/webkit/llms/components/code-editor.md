# Code Editor

> An editable code surface with line numbers, diagnostics and a read-only and a diff mode. It is a plain-text editor first: a monospace textarea with a line-number gutter that works on the server, without JavaScript and on any device. When the app passes a `loader` (a function that wires Monaco's workers and returns `import('monaco-editor')`), Monaco is loaded lazily, painted with the design tokens and takes over the same value, markers and options; until it loads, or if it fails, the plain editor stays in place. It differs from `code-block`, which only shows code.

- Import: `import CodeEditor from '@aziontech/webkit/code-editor'`
- Category: code · Surface: product · Structure: monolithic
- API as JSON: [code-editor.json](https://github.com/aziontech/webkit/blob/main/.specs/code-editor.json)

## When to use

- Editing a function, a script, a SQL query, a JSON or YAML document inside the product.
- Showing the change between two versions of code side by side (diff mode), for example before a deploy or a revert.
- Code that the server validates: the diagnostics come back as `markers` and show on their lines and in a list.
- A read-only view of code that still needs the editor's navigation (find, folding) once Monaco is loaded.

## Do

- Wrap it in a `Field` with a visible label, or give it an `ariaLabel`; the label names the textarea and the Monaco editor.
- Pass `loader` from the app so Monaco is code-split and never part of the WebKit bundle. The loader sets `MonacoEnvironment.getWorker` before it returns `import('monaco-editor')`; without workers Monaco has no language services. With `monaco-editor` 0.56 and later under Vite the worker imports are `monaco-editor/editor/editor.worker?worker` and `monaco-editor/languages/features/<json|css|html|typescript>/<name>.worker?worker` (`ts.worker` serves `javascript` too); the old `monaco-editor/esm/vs/...?worker` paths fail the build. Copy `loadMonaco` from the Usage block or the `Monaco` example.
- Set `padLineNumbers` on a full-page code editor (`fill`, a function's Code or Arguments document), as the console does (01, 02…); leave it off on a small editor inside a form.
- Function calls are coloured for you (JavaScript and TypeScript, with `--code-sintax-function`); do not register your own Monarch grammar for that.
- Send server diagnostics as `markers` with 1-based lines; keep each message one sentence.
- Give the editor a fixed `height`, or `fill` inside a flex column that has its own height; never let it grow with the content.
- Use `readonly` for code the user may read and select but not change; use `disabled` only when the whole form is locked.
- In diff mode, `original` is the left side and `v-model` the right side; keep the right side editable only when the change can still be edited.

## Don’t

- Showing a snippet to copy, with tabs and a file name → use `code-block`.
- A one-line value such as a header, a regex or a path → use `input` inside a `field`.
- Free prose or a description → use `textarea`.
- A stream of log lines → use `log-view`.
- A form generated from a JSON schema → use `schema-form` (the arguments tab of a function pairs both).
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [code-block](code-block.md) — read-only snippets with copy; same syntax colour tokens.
- [textarea](textarea.md) — plain multi-line text; the fallback editor is built in its spirit but keeps code typography and a gutter.
- [field](field.md) — wraps the editor with a label, a description and an error; the editor reads id, `aria-describedby`, invalid and disabled from it.
- [toggle-group](toggle-group.md) — the document switch (Code / Arguments) placed in the `toolbar` slot.
- [log-view](log-view.md) — output of a run next to the editor.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `language` | `string` | `'plaintext'` | false | Monaco language id (`javascript`, `typescript`, `json`, `sql`, `lua`, `yaml`…). The fallback ignores it. |
| `loader` | `() => Promise<CodeEditorMonaco>` | `undefined` | false | Loads Monaco lazily; without it the plain editor is the editor. |
| `readonly` | `boolean` | `false` | false | The code can be read, selected and copied but not changed. |
| `disabled` | `boolean` | `false` | false | Locks the editor; it leaves the tab order. |
| `invalid` | `boolean` | `false` | false | Paints the danger border; also set by a surrounding `Field`. |
| `diff` | `boolean` | `false` | false | Shows `original` beside the value as a side-by-side diff. |
| `original` | `string` | `''` | false | The left side of the diff. |
| `markers` | `CodeEditorMarker[]` | `[]` | false | Diagnostics shown on their lines and in the problems list. |
| `height` | `string` | `'16rem'` | false | CSS height of the editing area. |
| `fill` | `boolean` | `false` | false | Fills a flex column instead of using `height`. |
| `lineNumbers` | `boolean` | `true` | false | Shows the line-number gutter. |
| `padLineNumbers` | `boolean` | `false` | false | Zero-pads line numbers to two digits (01, 02…), as the console's full-page function and arguments editors do. |
| `path` | `string` | `''` | false | Model path for Monaco language services (`index.ts`, `args.json`). |
| `ariaLabel` | `string` | `''` | false | Accessible name when no `Field` label names it. Empty uses the locale catalog. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `ready` | `unknown` | Monaco mounted; the payload is the editor instance (for actions). |
| `load-error` | `unknown` | The loader rejected; the plain editor stays. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `toolbar` | — | A bar above the editing area: a document switch, the file name, a Format or Run action. |

## Sub-components

_none_ — monolithic. The gutter, the fallback textarea, the Monaco host, the toolbar bar and the problems list are fixed parts.

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                    |
| --------- | -------- | ------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The code via `defineModel`. Updated on every edit, from the plain editor or from Monaco. |

## States

- Visual states: `default`, `focus-visible` (ring on the frame), `invalid`, `readonly`, `disabled`, `loading` (Monaco on the way, the plain editor is live)
- `data-mode`: `plain` | `loading` | `monaco` — which editor is live
- `data-invalid`, `data-readonly`, `data-disabled`, `data-diff`, `data-fill` mirror their props
- Each gutter line with a marker carries `data-severity` (`error` | `warning` | `info`)
- Load failure: the plain editor stays and a muted note says the full editor could not load

## Accessibility

- Visible focus: the frame shows `focus-within:ring-2 ring-(--ring-color)` for both editors.
- Keyboard map (plain editor): typing edits; `Tab` inserts two spaces and `Shift+Tab` removes them at the line start; `Escape` releases the trap so the next `Tab` / `Shift+Tab` leaves the editor (WCAG 2.1.2); the problems list buttons move the caret to the marker's line. Monaco runs in tab-focus mode by default, so `Tab` moves focus out unless the user toggles it with `Ctrl+M`.
- ARIA: the textarea is a native multi-line text box named by the `Field` label or `ariaLabel`; `aria-invalid`, `aria-readonly` and `aria-describedby` (the field's description plus the problems summary); the gutter is `aria-hidden`; the problems list is a named list; the problem count is a polite `status`.
- Diagnostics are never colour only: each one is a list item with its line and severity in text.
- Contrast ≥4.5:1: code and line numbers use the code syntax tokens tuned for both themes.
- Forced colors: the frame keeps a system border and the gutter marker becomes a system glyph colour.

## Right-to-left

- Layout: logical utilities only; the gutter sits at the start edge.
- Code: the textarea and Monaco host are `dir="ltr"` (code reads left to right in every locale); the toolbar and problems list follow the page direction.
- Keyboard: no direction-dependent keys.
- User data: problem messages sit in `<bdi>`.

## Internationalization

| Key                                     | English source                                             | Override prop |
| --------------------------------------- | ---------------------------------------------------------- | ------------- |
| `codeEditor.label`                      | Code editor                                                | `ariaLabel`   |
| `codeEditor.original`                   | Original                                                   | —             |
| `codeEditor.modified`                   | Modified                                                   | —             |
| `codeEditor.problems`                   | Problems                                                   | —             |
| `codeEditor.problemCount`               | No problems / {count} problem / {count} problems (plural)  | —             |
| `codeEditor.line`                       | Line {line}                                                | —             |
| `codeEditor.error` / `warning` / `info` | Error / Warning / Info                                     | —             |
| `codeEditor.loading`                    | Loading the full editor…                                   | —             |
| `codeEditor.loadFailed`                 | The full editor could not load. You can keep editing here. | —             |
| `codeEditor.tabHint`                    | Press Escape, then Tab, to leave the editor.               | —             |

- Formatting: the problem count goes through the plural rules of the active locale.

## Responsive

- Container queries: `@container/code-editor` on the root; in diff mode the two panes sit side by side from `@lg` and stack below.
- Narrow: the editing area keeps its height and scrolls in both axes; long lines never wrap in code.
- Touch: problem buttons are 32 px high (44 px on `pointer: coarse`).
- Reflow: the page never scrolls horizontally; the editor scrolls inside its frame.

## Examples

### Default

```vue
<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const code = ref(`export default async function handler(request) {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  return new Response(\`Hello, \${name}\`)
}
`)

  const markers = [
    { line: 3, severity: 'warning', message: 'name can be null; give it a default value.' },
    { line: 4, severity: 'info', message: 'Set a Content-Type header on the response.' }
  ]
</script>

<template>
  <Field>
    <Field.Label>Function code</Field.Label>
    <CodeEditor
      v-model="code"
      language="javascript"
      :markers="markers"
      height="14rem"
    />
    <Field.Description>Runs on every request that reaches this function.</Field.Description>
  </Field>
</template>
```

### Monaco

```vue
<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

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

  const handler = ref(`async function handleRequest(request) {
  const token = request.headers.get('authorization')
  if (!token) return new Response('Unauthorized', { status: 401 })
  return fetch(request)
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
`)

  const original = `{
  "cache": {
    "ttl": 60,
    "bypass": false
  }
}
`

  const code = ref(`{
  "cache": {
    "ttl": 300,
    "bypass": false,
    "stale": true
  }
}
`)

  const markers = [
    {
      line: 5,
      column: 5,
      endColumn: 12,
      severity: 'warning',
      message: '"stale" serves expired content while the cache revalidates.'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Field>
      <Field.Label>Cache settings</Field.Label>
      <CodeEditor
        v-model="code"
        :loader="loadMonaco"
        language="json"
        path="cache.json"
        :markers="markers"
        height="12rem"
      />
    </Field>
    <CodeEditor
      v-model="code"
      :original="original"
      :loader="loadMonaco"
      language="json"
      diff
      height="12rem"
      aria-label="Cache settings, compared with the saved version"
    />
    <CodeEditor
      v-model="handler"
      :loader="loadMonaco"
      language="javascript"
      path="handler.js"
      pad-line-numbers
      height="12rem"
      aria-label="Function code"
    />
  </div>
</template>
```

### WithToolbar

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]
  const active = ref('code')
  const files = ref({
    code: `export default function handler(request, args) {
  return new Response(args.greeting)
}
`,
    arguments: `{
  "greeting": "Hello"
}
`
  })
  const value = computed({
    get: () => files.value[active.value],
    set: (next) => {
      files.value[active.value] = next
    }
  })
  const markers = computed(() =>
    active.value === 'arguments' && !value.value.includes('"greeting"')
      ? [{ line: 1, severity: 'error', message: 'Add the greeting argument.' }]
      : []
  )
</script>

<template>
  <CodeEditor
    v-model="value"
    :language="active === 'code' ? 'javascript' : 'json'"
    :markers="markers"
    pad-line-numbers
    height="12rem"
    aria-label="Function editor"
  >
    <template #toolbar>
      <ToggleGroup
        v-model="active"
        :options="documents"
        size="small"
        aria-label="Editor document"
      />
      <span class="min-w-0 flex-1 truncate text-body-xs text-(--text-muted)">
        {{ active === 'code' ? 'JavaScript, running on request' : 'Defaults for each instance' }}
      </span>
      <Button
        label="Run"
        kind="secondary"
        size="small"
        icon="pi pi-play"
      />
    </template>
  </CodeEditor>
</template>
```
