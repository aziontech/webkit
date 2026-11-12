---
name: code-editor
category: code
structure: monolithic
status: implemented
spec_version: 3
template: 2
checksum: b0bc114e3192e362dd31b15366e23f345c6a4cdb7afb0368919d5a7777b12601
created: 2026-11-11
last_updated: 2026-11-12
---

# CodeEditor — Component Spec

## Purpose

An editable code surface with line numbers, diagnostics and a read-only and a diff mode. It is a plain-text editor first: a monospace textarea with a line-number gutter that works on the server, without JavaScript and on any device. When the app passes a `loader` (a function that wires Monaco's workers and returns `import('monaco-editor')`), Monaco is loaded lazily, painted with the design tokens and takes over the same value, markers and options; until it loads, or if it fails, the plain editor stays in place. It differs from `code-block`, which only shows code.

## When to use

- Editing a function, a script, a SQL query, a JSON or YAML document inside the product.
- Showing the change between two versions of code side by side (diff mode), for example before a deploy or a revert.
- Code that the server validates: the diagnostics come back as `markers` and show on their lines and in a list.
- A read-only view of code that still needs the editor's navigation (find, folding) once Monaco is loaded.

## When NOT to use

- Showing a snippet to copy, with tabs and a file name → use `code-block`.
- A one-line value such as a header, a regex or a path → use `input` inside a `field`.
- Free prose or a description → use `textarea`.
- A stream of log lines → use `log-view`.
- A form generated from a JSON schema → use `schema-form` (the arguments tab of a function pairs both).

## Related

- `code-block` — read-only snippets with copy; same syntax colour tokens.
- `textarea` — plain multi-line text; the fallback editor is built in its spirit but keeps code typography and a gutter.
- `field` — wraps the editor with a label, a description and an error; the editor reads id, `aria-describedby`, invalid and disabled from it.
- `toggle-group` — the document switch (Code / Arguments) placed in the `toolbar` slot.
- `log-view` — output of a run next to the editor.

## Best practices

- Wrap it in a `Field` with a visible label, or give it an `ariaLabel`; the label names the textarea and the Monaco editor.
- Pass `loader` from the app so Monaco is code-split and never part of the WebKit bundle. The loader sets `MonacoEnvironment.getWorker` before it returns `import('monaco-editor')`; without workers Monaco has no language services. With `monaco-editor` 0.56 and later under Vite the worker imports are `monaco-editor/editor/editor.worker?worker` and `monaco-editor/languages/features/<json|css|html|typescript>/<name>.worker?worker` (`ts.worker` serves `javascript` too); the old `monaco-editor/esm/vs/...?worker` paths fail the build. Copy `loadMonaco` from the Usage block or the `Monaco` example.
- Set `padLineNumbers` on a full-page code editor (`fill`, a function's Code or Arguments document), as the console does (01, 02…); leave it off on a small editor inside a form.
- Function calls are coloured for you (JavaScript and TypeScript, with `--code-sintax-function`); do not register your own Monarch grammar for that.
- Send server diagnostics as `markers` with 1-based lines; keep each message one sentence.
- Give the editor a fixed `height`, or `fill` inside a flex column that has its own height; never let it grow with the content.
- Use `readonly` for code the user may read and select but not change; use `disabled` only when the whole form is locked.
- In diff mode, `original` is the left side and `v-model` the right side; keep the right side editable only when the change can still be edited.

## Usage

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

  const code = ref(`export default function handler(request) {
  return new Response('Hello')
}
`)
  const markers = [{ line: 2, severity: 'warning', message: 'Set a Content-Type header.' }]
</script>

<template>
  <Field>
    <Field.Label>Function code</Field.Label>
    <CodeEditor
      v-model="code"
      language="javascript"
      :markers="markers"
      :loader="loadMonaco"
      path="handler.js"
      height="20rem"
    />
  </Field>
</template>
```

## Sub-components

_none_ — monolithic. The gutter, the fallback textarea, the Monaco host, the toolbar bar and the problems list are fixed parts.

## Props

| Prop             | Type                              | Default       | Required | JSDoc                                                                                                         |
| ---------------- | --------------------------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `language`       | `string`                          | `'plaintext'` | false    | Monaco language id (`javascript`, `typescript`, `json`, `sql`, `lua`, `yaml`…). The fallback ignores it.      |
| `loader`         | `() => Promise<CodeEditorMonaco>` | `undefined`   | false    | Loads Monaco lazily; without it the plain editor is the editor.                                               |
| `readonly`       | `boolean`                         | `false`       | false    | The code can be read, selected and copied but not changed.                                                    |
| `disabled`       | `boolean`                         | `false`       | false    | Locks the editor; it leaves the tab order.                                                                    |
| `invalid`        | `boolean`                         | `false`       | false    | Paints the danger border; also set by a surrounding `Field`.                                                  |
| `diff`           | `boolean`                         | `false`       | false    | Shows `original` beside the value as a side-by-side diff.                                                     |
| `original`       | `string`                          | `''`          | false    | The left side of the diff.                                                                                    |
| `markers`        | `CodeEditorMarker[]`              | `[]`          | false    | Diagnostics shown on their lines and in the problems list.                                                    |
| `height`         | `string`                          | `'16rem'`     | false    | CSS height of the editing area.                                                                               |
| `fill`           | `boolean`                         | `false`       | false    | Fills a flex column instead of using `height`.                                                                |
| `lineNumbers`    | `boolean`                         | `true`        | false    | Shows the line-number gutter.                                                                                 |
| `padLineNumbers` | `boolean`                         | `false`       | false    | Zero-pads line numbers to two digits (01, 02…), as the console's full-page function and arguments editors do. |
| `path`           | `string`                          | `''`          | false    | Model path for Monaco language services (`index.ts`, `args.json`).                                            |
| `ariaLabel`      | `string`                          | `''`          | false    | Accessible name when no `Field` label names it. Empty uses the locale catalog.                                |

Types: `CodeEditorMarker = { line: number; column?: number; endLine?: number; endColumn?: number; severity: 'error' | 'warning' | 'info'; message: string }`. `CodeEditorMonaco` is a structural subset of the `monaco-editor` module (`editor.create`, `editor.createDiffEditor`, `editor.createModel`, `editor.defineTheme`, `editor.setTheme`, `editor.setModelMarkers`, `MarkerSeverity`, and the optional `languages.getLanguages` / `languages.setMonarchTokensProvider`), so `import('monaco-editor')` satisfies it without WebKit depending on Monaco's types.

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                    |
| --------- | -------- | ------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The code via `defineModel`. Updated on every edit, from the plain editor or from Monaco. |

## Events

| Event        | Payload   | Notes                                                             |
| ------------ | --------- | ----------------------------------------------------------------- |
| `ready`      | `unknown` | Monaco mounted; the payload is the editor instance (for actions). |
| `load-error` | `unknown` | The loader rejected; the plain editor stays.                      |

## Slots

| Slot      | Scope | Notes                                                                                   |
| --------- | ----- | --------------------------------------------------------------------------------------- |
| `toolbar` | —     | A bar above the editing area: a document switch, the file name, a Format or Run action. |

## States

- Visual states: `default`, `focus-visible` (ring on the frame), `invalid`, `readonly`, `disabled`, `loading` (Monaco on the way, the plain editor is live)
- `data-mode`: `plain` | `loading` | `monaco` — which editor is live
- `data-invalid`, `data-readonly`, `data-disabled`, `data-diff`, `data-fill` mirror their props
- Each gutter line with a marker carries `data-severity` (`error` | `warning` | `info`)
- Load failure: the plain editor stays and a muted note says the full editor could not load

## Motion & Animations

| Trigger          | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ---------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| frame focus ring | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                   | Token (DESIGN.md)                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| frame surface / border   | `var(--bg-surface)` / `var(--border-default)`                                                                                                |
| invalid border           | `var(--danger-border)`                                                                                                                       |
| gutter                   | `var(--bg-canvas)`, `var(--code-sintax-line-number)`                                                                                         |
| code typography          | `.text-body-code-sm`                                                                                                                         |
| Monaco line height       | `var(--code-editor-line-height)` (16 px, from `--line-height-4`); font family and size from `.text-body-code-sm`                             |
| code text                | `var(--code-sintax-identifier)`                                                                                                              |
| Monaco syntax            | `--code-sintax-keyword`, `-string`, `-type`, `-function` (function and method calls), `-punctuation`, `-identifier`, `--code-sintax-comment` |
| Monaco chrome            | `--bg-surface`, `--bg-surface-raised`, `--bg-hover`, `--bg-selected`, `--border-default`, `--text-default`, `--ring-color`                   |
| marker colours           | `var(--danger-contrast)`, `var(--warning-contrast)`, `var(--info-contrast)`                                                                  |
| toolbar / problems bands | `var(--bg-surface-raised)`, `var(--border-default)`, `.text-body-xs`, `.text-label-sm`                                                       |
| shape / ring             | `var(--shape-elements)`, `var(--ring-color)`                                                                                                 |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the frame shows `focus-within:ring-2 ring-(--ring-color)` for both editors.
- Keyboard map (plain editor): typing edits; `Tab` inserts two spaces and `Shift+Tab` removes them at the line start; `Escape` releases the trap so the next `Tab` / `Shift+Tab` leaves the editor (WCAG 2.1.2); the problems list buttons move the caret to the marker's line. Monaco runs in tab-focus mode by default, so `Tab` moves focus out unless the user toggles it with `Ctrl+M`.
- ARIA: the textarea is a native multi-line text box named by the `Field` label or `ariaLabel`; `aria-invalid`, `aria-readonly` and `aria-describedby` (the field's description plus the problems summary); the gutter is `aria-hidden`; the problems list is a named list; the problem count is a polite `status`.
- Diagnostics are never colour only: each one is a list item with its line and severity in text.
- Contrast ≥4.5:1: code and line numbers use the code syntax tokens tuned for both themes.
- Forced colors: the frame keeps a system border and the gutter marker becomes a system glyph colour.

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

## Right-to-left

- Layout: logical utilities only; the gutter sits at the start edge.
- Code: the textarea and Monaco host are `dir="ltr"` (code reads left to right in every locale); the toolbar and problems list follow the page direction.
- Keyboard: no direction-dependent keys.
- User data: problem messages sit in `<bdi>`.

## Responsive

- Container queries: `@container/code-editor` on the root; in diff mode the two panes sit side by side from `@lg` and stack below.
- Narrow: the editing area keeps its height and scrolls in both axes; long lines never wrap in code.
- Touch: problem buttons are 32 px high (44 px on `pointer: coarse`).
- Reflow: the page never scrolls horizontally; the editor scrolls inside its frame.

## Performance

- Bundle budget: 8.5 KB gzip for `./code-editor` in `.size-limit.json` (measured 8.46 KB on 2026-11-12, up from 7.97 KB for the function-call rules and `padLineNumbers`; Monaco is never bundled: the app's `loader` code-splits it).
- Runtime budget: the plain editor re-renders the gutter per line count change only; tested to 5,000 lines.
- Heavy parts: Monaco loads on mount, after the plain editor is interactive; the theme is rebuilt only when the theme attribute or the colour scheme changes.

## Examples

- Default — the plain editor with a loader-less value and markers.
- Monaco — the same with `loader` set (the monaco-editor 0.56+ worker wiring), plus a JavaScript function editor with `padLineNumbers` and coloured calls; justified because the lazy path is the main use in the console.
- WithToolbar — the console's function editor: the Code / Arguments switch in `toolbar` and `padLineNumbers`.
- Diff — `diff` with `original`; justified as a distinct mode.
- ReadOnly — the `readonly` state.

## Decisions and open questions

- **Example order.** Default, Monaco, WithToolbar come first because the catalog, the MCP and `llms/` carry only the first three examples of a component, and the worker wiring must reach them.
- **No Monaco dependency.** `monaco-editor` is the app's dependency, passed as `loader`; WebKit ships only the structural types and the token theme. Decided (M2.10): no `@aziontech/webkit/code-editor-monaco` entry. Worker wiring depends on the bundler (Vite `?worker`, webpack 5 `new URL(..., import.meta.url)`), so an entry would tie consumers to one; the copyable example `code-editor#Monaco` is the loader. `monaco-editor` is an optional peer (`>=0.50`) and a dev dependency for that example and its browser test.
- **Worker wiring (monaco-editor 0.56+).** Since 0.56 the package `exports` map sends `monaco-editor/*` to `esm/vs/*.js`, so the long-documented `monaco-editor/esm/vs/editor/editor.worker?worker` resolves to `esm/vs/esm/vs/...` and the build fails ("failed to resolve import"). The working paths are `monaco-editor/editor/editor.worker?worker` and `monaco-editor/languages/features/<json|css|html|typescript>/<name>.worker?worker` (the `language/...` paths still exist and re-export these). Verified 2026-11-12 in a fresh Vite 8.3 app with `monaco-editor` 0.57.0: `vite build` + `vite preview` and four cold `vite` dev starts, JSON and TypeScript workers producing their diagnostics. Before 0.56 there is no exports map: use `monaco-editor/esm/vs/editor/editor.worker?worker` and `monaco-editor/esm/vs/language/json/json.worker?worker`.
- **Function calls are coloured by WebKit.** Monaco's Monarch JavaScript and TypeScript grammars tag a called name as a plain `identifier`, so a theme rule for `function` never matched and calls stayed default ink. When Monaco loads, CodeEditor takes each built-in grammar from `languages.getLanguages()` (its `loader`), prepends four rules to `tokenizer.common` (a member call after `.`, a bare call unless the word is a keyword, `true`/`false`/`null`/`undefined` as constants, CONSTANT_CASE as identifiers, as the design sample does) and registers it with `setMonarchTokensProvider`, once per Monaco instance. A module without `languages` (or a grammar without `tokenizer.common`) is left alone. It replaces the stock tokenizer for those two languages, so an app that registers its own Monarch grammar for them should do it after the editor's `ready`.
- **Padded line numbers are opt-in.** The design sample pads (`String(line).padStart(2, '0')`) only its full-page function and arguments editors and keeps plain numbers on the small JSON field of a drawer, so `padLineNumbers` defaults to `false`; both the plain gutter and Monaco's `lineNumbers` formatter follow it. Lines past 99 show three digits.
- **Code line height (M2.10 row 77).** Monaco draws code at the console's 16 px line, not at the `.text-body-code-sm` line height (12 px × 1.625 ≈ 20 px). The value is the theme token `--code-editor-line-height` (`var(--line-height-4)`), read from the host element when the editor is created; `px` and `rem` are converted to pixels, and an absent or unparseable value falls back to 16. The font size stays `--text-body-code-sm-font-size` (12 px), which the console reference also uses (7 px per character, 16 px lines). The plain editor keeps `.text-body-code-sm`.
- **Theme is global in Monaco.** Every editor shares the `webkit` theme, so it is defined and set only when its content changes (`applyThemeOnce`, per Monaco instance): several editors on a page no longer each re-define it on every `class`/`data-theme` change of the document, and a `setTheme` that touched those classes could not make two editors ping-pong (`code-editor.test.ts`).
- **Diff names.** Both sides of the diff are named after the editor (`<name>, Original` and `<name>, Modified`), since Monaco leaves them empty.
- **Plain editor is the default.** Not a skeleton: it is fully usable, so the SSR markup is an editor and slow networks never block typing.
- **Theme.** Colours are read from the host element's computed tokens (hex values) at mount and when `class`/`data-theme` changes on `<html>` or `<body>` or the colour scheme changes; Monaco's theme is global, so the last editor to apply it wins, which is fine because all read the same tokens.
- **Tab handling.** Two-space indentation in the plain editor; Monaco keeps its own setting.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
