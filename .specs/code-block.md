---
name: code-block
category: code
structure: monolithic
status: implemented
spec_version: 7
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761
  node_id: 4567:33761
checksum: 3725b180af94150934df8ecd716869e71c4c862665121ed17ea1189a4c8226be
created: 2026-05-28
last_updated: 2026-11-15
---

# CodeBlock — Component Spec

## Purpose

Read-only code viewer for docs, API examples, and configuration previews. Supports four Figma-documented layouts that share one monolithic shell:

1. **Language switcher** ([4567:33761](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761)) — tabbed snippets with a sliding pill, optional filename bar, syntax highlighting, and copy.
2. **Show filename** ([4567:30198](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-30198)) — single snippet with a raised filename bar (language icon + name), no tabs.
3. **Diff** ([4567:29012](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-29012)) — per-line added/removed markers (`+`/`-`), semantic row backgrounds, and a 2 px leading bar; no tabs or filename bar.
4. **Highlighted line** ([4567:31473](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-31473)) — one active line with info background and leading bar; no tabs or filename bar.

Two more regions serve docs: a **label header** — a 40 px bar naming the block (`</>` + "Shell", "JavaScript", from the active tab's label or the language's readable name, or `title`) when `showLabel` is on and there is no tab strip or filename bar — and the **output** kind (`kind="output"`): what a command prints, drawn flat in `--text-muted` on `--bg-canvas` under an "Output" label, with no copy control by default. A command block and its output are always two blocks.

The other regions render conditionally from tab data. Tab header appears when `tabs.length > 1`. Filename bar appears when the active tab sets `fileName`. Diff and highlight decorations come from `lineChanges` and `highlightedLine` on the active tab.

**Syntax highlighting** is driven by the active tab's `language` and resolves to one of these tokenisers, all of which emit the same seven token types (`keyword`, `string`, `function`, `type`, `punctuation`, `identifier`, `comment`) so every language shares the one `--code-sintax-*` palette:

| `language`                              | Tokenised as                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `javascript`, `js`, `typescript`, `ts`  | Expressions: keywords, strings, function calls, punctuation. `//` runs to end of line as a `comment`; a `//` inside a quoted string stays part of the `string`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `bash`, `sh`, `shell`, `zsh`, `console` | **Commands.** A command line has a different shape from an expression, so it is read as one: the **first word is the program** being run (`function`), and so is any program after an operator that starts a new command (`\|`, `&&`, `\|\|`, `;`); every `-f` / `--flag` and every shell language word (`if`, `for`, `export`, …) is a `keyword`; quoted text is a `string`; a `$VAR` / `${VAR}` expansion is a `type` — the one thing on the line that is a value; the operators joining commands are `punctuation`; and sub-commands, paths, URLs and whitespace are `identifier`. A `#` at line start or after whitespace runs to end of line as a `comment`. A leading `$ ` prompt is a `prompt` token (drawn in the line-number colour, not selectable) and is never copied: when any line carries a prompt, the copy control copies only the prompted lines (and their `\` continuations). This adds **no** new syntax token: a CLI snippet gets the same palette a JS snippet does. |
| `hcl`, `terraform`, `tf`                | **Configuration blocks.** The first word of a line that opens a block (`resource`, `data`, a nested `application {`) is a `keyword`; the first word before `=` is the attribute key and takes `function`, the same colour a key gets in a JavaScript config object; a word before `(` is a call (`function`); quoted labels and values are `string`; `true` / `false` / `null` and numbers are `type`; references (`azion_application.storefront.id`) and whitespace are `identifier`; brackets, `=`, `.` and `,` are `punctuation`. `#` and `//` run to end of line as a `comment`.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `graphql`, `gql`                        | **Operations.** A definition word opening the line (`query`, `mutation`, `fragment`, `type`, …), a `@directive` and a fragment's `on` are `keyword`; the operation name and every field called with arguments (`httpMetrics(`, `sum(`) are `function`; a `$variable`, a capitalised type name (`DateTime`), a number and `true` / `false` / `null` are `type`; quoted text is `string`; plain fields, aliases and argument names are `identifier`; brackets, `:`, `!`, `,` and `...` are `punctuation`. `#` runs to end of line as a `comment`.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `markdown`, `md`                        | One `comment` token per line. Prose inside a code block (a markdown snippet, an agent prompt) is commentary, not code, so it takes the comment colour rather than being tokenised as identifiers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| anything else, or unset                 | Flat — one `identifier` token per line, no highlighting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## When to use

- Read-only code in docs, API examples or configuration previews that readers copy from.
- The same snippet in several languages, switched by tabs (one `tabs` entry per language).
- Showing a change as a diff (`lineChanges`) or pointing at one line (`highlightedLine`) on the active tab.
- Showing what changed between two versions of a file — a configuration before and after a deploy, the code a release replaces — by passing the previous version as the tab's `original`: the block computes the line diff itself and draws it unified or side by side (`diffView`).

## When NOT to use

- The content is build or deploy output with timestamps and log levels → use `log-view`.
- It is a marketing band that pairs a claim with its code → use `code-split`, or `sticky-scroll-code` for several claims.
- It is a terminal session of CLI commands on a product page → use `cli-terminal`.
- You only need to copy one short value (a token, an ID) without showing a block → use `copy-button`.
- The reader edits the new version beside the old one → use `code-editor` in diff mode. A read-only diff is always this block with `original`, never a read-only code editor.

## Related

- `copy-button` — the copy control CodeBlock embeds; use it alone for one-line values.
- `code-editor` — the editable surface; its diff mode is for editing beside an original, while a read-only diff is this block.
- `log-view` — terminal-style viewer for CI and deploy logs.
- `code-split` — page section built around one code sample.
- `scroll-area` — the scroll container the code region runs in.

## Best practices

- Put the source on each tab's `code`. There is no top-level `code` prop, and a tab without a `value` or a `code` is dropped.
- Set `language` on every tab. Only JavaScript/TypeScript, shell, HCL, GraphQL and Markdown are tokenised; anything else renders as flat text.
- Use `default-value` for the initial tab, and `v-model` only when something outside the block must follow the selected tab.
- Prefer `original` to a hand-written `lineChanges` list whenever both versions are at hand: the diff stays right when either version changes. Keep `unified` in narrow columns and use `split` where the block has room for two columns of code.
- Set `:copyable="false"` on decorative blocks, and `:bordered="false"` when the block sits inside a surface that already frames it.
- Keep `animate-lines` for marketing layouts; leave it off in docs and console screens.
- Do: keep a command block to what the reader runs — the copy control copies exactly that. Put what it prints in a second block with `kind="output"` (or in prose).
- Don't: write expected output into the command, as a `# HTTP/2 200` comment or as unprompted lines after a `$ ` prompt — the reader pastes it into the terminal. The `webkit/no-output-in-command` lint warns on it.
- Do: turn `show-label` on in docs (`DocCodeGroup` does by default) so every block is titled with its language; set `title` only when the language name is not the right title.

## Usage

One snippet takes its source straight from **`code`** and **`language`**:

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const code = `export default {
  async fetch(request) {
    return new Response('OK')
  }
}`
</script>

<template>
  <CodeBlock
    :code="code"
    language="javascript"
    show-label
  />
</template>
```

For several languages or files, pass one entry per snippet in **`tabs`** (each with its own `code`; `code` and `language` are ignored when `tabs` is set). Use `v-model` to control the active tab:

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'JavaScript',
      value: 'js',
      language: 'javascript',
      fileName: 'handler.js',
      code: 'export default {}'
    },
    {
      label: 'TypeScript',
      value: 'ts',
      language: 'typescript',
      fileName: 'handler.ts',
      code: 'export default {}'
    }
  ]
</script>

<template>
  <CodeBlock
    :tabs="tabs"
    default-value="js"
  />
</template>
```

Replace `tabs[n].code` (or `code`) or rebuild `tabs` when the source should update reactively.

## Props

| Prop              | Type                 | Default     | Required | JSDoc                                                                                                                                                                                                                            |
| ----------------- | -------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabs`            | `CodeBlockTab[]`     | `[]`        | false    | Tab definitions with label, value, code, and optional language, filename, diff, or highlight metadata.                                                                                                                           |
| `defaultValue`    | `string`             | `undefined` | false    | Initial active tab when uncontrolled.                                                                                                                                                                                            |
| `code`            | `string`             | `''`        | false    | Code of a single snippet, used when `tabs` is empty.                                                                                                                                                                             |
| `language`        | `string`             | `''`        | false    | Language of the single `code` snippet (highlighting and the label header).                                                                                                                                                       |
| `lineNumbers`     | `boolean`            | `true`      | false    | Shows a fixed-width gutter with zero-padded line numbers before each code line (the same name as `code-editor`).                                                                                                                 |
| `showLineNumbers` | `boolean`            | `undefined` | false    | **@deprecated since 6.0 — use `lineNumbers`. Removed in 7.0.** Shows the line-number gutter; when set it wins over `lineNumbers`.                                                                                                |
| `copyAriaLabel`   | `string`             | `''`        | false    | Accessible name for the copy control (forwarded to CopyButton's aria-label). Empty uses the locale catalog (`Copy code`).                                                                                                        |
| `copyable`        | `boolean`            | `undefined` | false    | Shows the copy control. Unset, a `code` block shows it and an `output` block does not; turn it off for a decorative block nobody copies from.                                                                                    |
| `kind`            | `'code' \| 'output'` | `'code'`    | false    | What the block holds: `code` the reader runs or reads, or `output` — what a command prints — drawn flat and muted under an "Output" label, without a copy control.                                                               |
| `showLabel`       | `boolean`            | `false`     | false    | Shows a header naming the block when there is no tab strip or file name: the active tab's label, else the language's readable name (Shell, JavaScript). Docs blocks show it.                                                     |
| `title`           | `string`             | `''`        | false    | Text of the label header; empty uses the tab label or the language name, or "Output" for an `output` block.                                                                                                                      |
| `animateLines`    | `boolean`            | `false`     | false    | Staggered line entrance for website layouts: each line slides from `-8px` with opacity `0 → 1`, `40ms` apart.                                                                                                                    |
| `bordered`        | `boolean`            | `true`      | false    | Draw the outer card border around the block. On by default; set `:bordered="false"` to render the block flush when it sits inside a surface that already frames it. Internal dividers (tab header, filename bar) are unaffected. |
| `diffView`        | `'unified' \| 'split'` | `'unified'` | false    | How a tab with an `original` draws the diff the block computes: `unified` (one column) or `split` (side by side).                                                                                                                |

## Type shapes

### `CodeBlockTab`

| Field             | Type                    | Required | Notes                                                                                                                                                                                                                                                                      |
| ----------------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`           | `string`                | true     | Tab label (uppercase in UI via `.text-overline-sm`).                                                                                                                                                                                                                       |
| `value`           | `string`                | true     | Stable tab id for `v-model`.                                                                                                                                                                                                                                               |
| `code`            | `string`                | true     | Raw source; split on `\n` for rendering.                                                                                                                                                                                                                                   |
| `language`        | `string`                | false    | Drives syntax highlighting and default file icon when `fileIcon` is omitted.                                                                                                                                                                                               |
| `fileName`        | `string`                | false    | When set on the active tab, renders the 40 px filename bar below the tab header (or as the top region when tabs are hidden).                                                                                                                                               |
| `fileIcon`        | `string`                | false    | Icon name for the filename bar (PrimeIcons class, e.g. `'pi pi-file'`). Falls back to a language-derived icon when omitted.                                                                                                                                                |
| `highlightedLine` | `number`                | false    | 1-based line index. Applies info background + leading bar on that row (Figma: Highlighted).                                                                                                                                                                                |
| `lineChanges`     | `CodeBlockLineChange[]` | false    | Per-line diff metadata. When non-empty, renders diff gutter markers and row backgrounds (Figma: Diff).                                                                                                                                                                     |
| `original`        | `string`                | false    | The previous version of `code`. When set, the block computes a line diff of `original` against `code` in-house (Myers, no dependency) and draws it per `diffView`; `lineChanges` is ignored on that tab, and `highlightedLine` counts lines of `code`. Copy copies `code`. |

### `CodeBlockLineChange`

| Field    | Type                   | Required | Notes                                                                    |
| -------- | ---------------------- | -------- | ------------------------------------------------------------------------ |
| `line`   | `number`               | true     | 1-based line index.                                                      |
| `change` | `'added' \| 'removed'` | true     | `added` → success row + `+` marker; `removed` → danger row + `-` marker. |

## v-model

| Model     | Type                  | Default     | Emits               | Notes                                                                                                                                         |
| --------- | --------------------- | ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string \| undefined` | `undefined` | `update:modelValue` | Active tab `value` via `defineModel`. While unbound (`undefined`) the block is uncontrolled: it starts at `defaultValue`, else the first tab. |

## Events

| Event  | Payload                             | Notes                                                       |
| ------ | ----------------------------------- | ----------------------------------------------------------- |
| `copy` | `(event: MouseEvent, code: string)` | Fires after the active tab code is copied to the clipboard. |

## Slots

| Slot       | Scope                   | Notes                                                                                      |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| `tab-icon` | `{ tab: CodeBlockTab }` | Leading mark before a tab's label in the tab strip; nothing renders when it is not filled. |

## States

- Visual states: `default`, `hover`, `focus-visible` on tabs and copy control
- `data-state` on tabs: `active` | `inactive`; the active tab's text colour switches on `data-[state=active]:` in the tab's flat class, never a `:class` ternary
- `data-state` on code lines: `default` | `added` | `removed` | `highlighted`; in the split view a side with no line opposite a change is `empty` (`var(--bg-canvas)`)
- `data-split` on the panel when the active tab with an `original` draws side by side
- `data-disabled` not used (tabs are not disabled in v2)
- `data-kind` on the root: `code` | `output`; `output` paints the shell `--bg-canvas` and every line flat in `--text-muted`

### Layout rules (derived from Figma)

| Region                                                                                                                   | Visible when                                                             |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Tab header (`CodeBlockHeader`, 40 px strip: a 32 px tab over a 4 px inset)                                               | `tabs.length > 1`                                                        |
| Filename bar (`FileName`, 40 px)                                                                                         | active tab has `fileName`                                                |
| Label header (40 px, `pi pi-code` / `pi pi-align-left` + label)                                                          | no tab strip, no `fileName`, and `showLabel`, `title` or `kind="output"` |
| Diff gutter (`+`/`-` + 8 px spacer on unchanged lines)                                                                   | active tab `lineChanges.length > 0`, or the active tab has an `original` |
| Unified diff (removed lines from `original` before the added lines of `code` in each change, numbered on their own side) | active tab has an `original` and `diffView="unified"`                    |
| Split diff (two columns, Original and Modified, rows aligned, a change paired line for line)                             | active tab has an `original` and `diffView="split"`                      |
| Line highlight (info background + 2 px leading bar)                                                                      | active tab `highlightedLine` is set                                      |

When only one tab is provided and it has no `fileName`, the shell is code content + copy only (minimal block).

Code content scrolls inside `@aziontech/webkit/scroll-area` (`orientation="both"`, capped at a `320 px` max height so shorter snippets fit their content and taller ones scroll). Lines never wrap (`whitespace-pre`); on narrow viewports the scroll region grows horizontally so long lines stay on one row.

**The shell is fluid: it takes the width its container gives it and never grows past it.** Long lines are a scroll, never a wider block — so the root is a size container (`@container`, i.e. inline-size containment) and its code width is invisible to the layout above it. Without that, the block's intrinsic width leaks upward: an `auto`-sized grid track or flex row (a one-column `grid` on mobile, a `md:grid-cols-2` panel below its breakpoint) sizes itself to the widest code line and the block overflows the viewport instead of scrolling — a consumer's `min-w-0` on the wrapper cannot fix it, because `min-width` is a floor on the intrinsic contribution, not a cap. The copy control (a `CopyButton`, `kind="outlined"` `size="small"`) is absolutely positioned on the non-scrolling content shell (`__content`) so it stays pinned top-right while lines scroll. **On a single-line block it centres on that row instead** (`data-single-line` on the anchor): the shell is 44 px, the control 28 px, so the `--spacing-sm` top inset would leave it 4 px below the line's own centre. Every line reserves the control's full footprint on its right (`pr-11` = 28 px control + its 12 px inset), so a long line always scrolls clear of it rather than under it. With `copyable` off (`data-copyable` absent on the root) the control is not rendered and lines reserve only `--spacing-sm` on their right.

- Computed diff: the common head and tail are trimmed, then the middle runs the Myers line diff; past 1,000 edits it falls back to the whole middle removed then added, so a rewrite stays linear. A 5,000-line pair with a few hundred edits diffs in a few milliseconds.
## Motion & Animations

| Trigger                                                                                                | Animation / Transition                                                                                                            | Token (see `.claude/docs/DESIGN.md` § Animations)                                   | Reduced-motion fallback                                                                |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| tab change (indicator)                                                                                 | sliding pill via `transform` / `width` transition                                                                                 | `duration-moderate-02` · `ease-productive-entrance` (DESIGN.md § Motion primitives) | `motion-reduce:transition-none`                                                        |
| tab panel change — a tab click, a controlled `value` change, or the active tab's `code` being replaced | content enters **line by line**: each row slides from the direction of travel + fades, `24ms` a line, the step capped at 12 lines | `duration-moderate-02` · `ease-productive-entrance` (DESIGN.md § Motion primitives) | `motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none` |
| tab panel height — on the same triggers as the panel change                                            | the shell animates between the two panels' heights (pin the old height, measure the new, transition `height`)                     | `duration-moderate-02` · `ease-productive-entrance` (DESIGN.md § Motion primitives) | skipped entirely under `prefers-reduced-motion` (height snaps)                         |
| tab label hover                                                                                        | `transition-colors duration-fast-02 ease-productive-entrance`                                                                     | `duration-fast-02` · `ease-productive-entrance`                                     | `motion-reduce:transition-none`                                                        |
| code line hover                                                                                        | `transition-opacity duration-fast-02 ease-productive-entrance` on row ghost layer (`--bg-hover`)                                  | `duration-fast-02` · `ease-productive-entrance` (DESIGN.md § Interactive states)    | `motion-reduce:transition-none`                                                        |
| line entrance (`animateLines`)                                                                         | per-line slide from `-8px` + opacity, staggered `40ms`                                                                            | `duration-moderate-02` · `ease-productive-entrance`                                 | `motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none` |

## Tokens

| Region                   | Token (DESIGN.md)                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------- |
| tab typography           | `.text-label-sm`                                                                       |
| filename typography      | `.text-label-code-sm`                                                                  |
| code typography          | `.text-label-code-sm`                                                                  |
| shell surface            | `var(--bg-surface)`                                                                    |
| filename bar surface     | `var(--bg-surface-raised)`                                                             |
| label header             | `.text-label-code-sm`, `var(--text-muted)`, `var(--border-default)` divider            |
| output shell / text      | `var(--bg-canvas)` · `var(--text-muted)`                                               |
| shell prompt `$ `        | `var(--code-sintax-line-number)`                                                       |
| border                   | `var(--border-default)`                                                                |
| tab strip surface        | `var(--bg-canvas)`                                                                     |
| tab indicator (pill)     | `var(--bg-surface)` fill · `var(--border-default)` hairline · `var(--shadow-sm)`       |
| text default / muted     | `var(--text-default)` / `var(--text-muted)`                                            |
| spacing                  | `var(--spacing-xxs)` / `var(--spacing-xs)` / `var(--spacing-sm)` / `var(--spacing-lg)` |
| shape                    | `var(--shape-elements)` / `var(--shape-button)`                                        |
| ring                     | `var(--ring-color)`                                                                    |
| syntax keyword           | `var(--code-sintax-keyword)`                                                           |
| syntax string            | `var(--code-sintax-string)`                                                            |
| syntax function          | `var(--code-sintax-function)`                                                          |
| syntax type              | `var(--code-sintax-type)`                                                              |
| syntax punctuation       | `var(--code-sintax-punctuation)`                                                       |
| syntax identifier        | `var(--code-sintax-identifier)`                                                        |
| syntax comment           | `var(--code-sintax-comment)`                                                           |
| syntax line number       | `var(--code-sintax-line-number)`                                                       |
| diff removed row         | `var(--danger)`                                                                        |
| diff removed leading bar | `var(--danger-border)`                                                                 |
| diff removed marker      | `var(--danger-contrast)`                                                               |
| diff added row           | `var(--success)`                                                                       |
| diff added leading bar   | `var(--success-border)`                                                                |
| diff added marker        | `var(--success-contrast)`                                                              |
| highlighted row          | `var(--info)`                                                                          |
| highlighted leading bar  | `var(--info-border)`                                                                   |

## Theme gaps

| Gap                                                                                                                                                                                                      | Shipped instead                                                                                                                                                                                                                                           | Why                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The Figma Language switcher frame ([4567:33761](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761)) draws the active tab as a 2 px underline on a `var(--bg-surface)` strip. | A sliding **pill**: the strip steps down to `var(--bg-canvas)` and the active tab carries `var(--bg-surface)` — the code surface itself — under a `var(--border-default)` hairline and `var(--shadow-sm)`, behind a sentence-case `.text-label-sm` label. | The pill ties the tab to the panel it opens (the active tab _is_ the surface below it), which an underline on the same fill cannot say; and it is the anatomy the docs layer's reference reads as. The motion is unchanged — the same measured `transform` / `width` slide, only the indicator's shape and fill differ. Figma frame to be updated to match; raise with design before the next spec revision. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses tabs and copy; `ArrowLeft`/`ArrowRight`/`Home`/`End` move between tabs; `Enter`/`Space` activates tab; copy uses `Enter`/`Space` on the CopyButton (native `<button>`); when focus is in the code scroll region, `ArrowUp`/`ArrowDown`/`PageUp`/`PageDown`/`Home`/`End` scroll vertically and `ArrowLeft`/`ArrowRight` scroll horizontally via ScrollArea.
- ARIA: tab list uses `role="tablist"` when visible; tabs use `role="tab"` with `aria-selected`; panel uses `role="tabpanel"` with `aria-labelledby`. Tab and panel ids come from `useId()` (`<uid>-tab-<index>`, one `<uid>-panel`), so two tabbed blocks on one page never share an id and a tab value with spaces is still a valid id; only the selected tab carries `aria-controls`, pointing at the one rendered panel; copy uses CopyButton `ariaLabel` (forwarded to its inner IconButton); diff `+`/`-` markers are `aria-hidden="true"` and every added or removed line also carries a visually hidden `Added` / `Removed` so the change is read, not only seen. In the split view each column is a named `group` (`Original`, `Modified`) and a focusable scroll region (`tabindex="0"`, the same focus ring) so its long lines scroll from the keyboard.
- Contrast ≥4.5:1 for code text on surface, including syntax token colors and diff/highlight row backgrounds in light and dark. Row backgrounds for `added`, `removed` and `highlighted` are the feedback fills at 40% (`bg-(--success)/40`, `bg-(--danger)/40`, `bg-(--info)/40`): at full strength the light fills (`--danger` `#F3A5A5`, `--info` `#99C9FF`) put the line numbers and the `function` and `type` syntax colours under 4.5:1 (3.93:1 for a line number on a removed row); at 40% every syntax colour clears 4.5:1 in light and dark (the lowest, the light `function` orange `#B03C02` on a removed row, is 4.6:1).
- `motion-reduce:transition-none motion-reduce:transform-none` on indicator and panel motion.
- When `animateLines` is enabled, line motion is disabled under `prefers-reduced-motion` (lines render fully visible immediately).
- Copy control uses CopyButton `size="small"` (28×28 px).

## Internationalization

| Key                  | English source | Override prop   |
| -------------------- | -------------- | --------------- |
| `codeBlock.copy`     | Copy code      | `copyAriaLabel` |
| `codeBlock.output`   | Output         | `title`         |
| `codeBlock.added`    | Added          | —               |
| `codeBlock.removed`  | Removed        | —               |
| `codeBlock.original` | Original       | —               |
| `codeBlock.modified` | Modified       | —               |

- Formatting: line numbers are zero-padded digits; code is user data and is never translated.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move between the file tabs, swapped under `dir="rtl"` (`logicalArrowKey`); the tab indicator is anchored with a physical `left: 0` and moved by `offsetLeft`.
- Motion: the panel slide between tabs mirrors (`rtl:` flips the `translate-x` presets).
- User data: code lines render `dir="ltr"`: code always reads left to right. The scroll area keeps the copy button's width free on its side (`pe-10` when `copyable`), so under `dir="rtl"` the button never covers the start of a line.

## Responsive

- Container queries: the root is a size container (`@container`), so long lines scroll inside the block instead of widening the layout above it.
- Narrow (≤ 640 px or a narrow container): the shell takes the container width; lines never wrap and scroll horizontally inside `scroll-area`; the tab strip keeps one row. The split view halves the width, so it suits wide containers; `unified` is the narrow form.
- Touch: tabs are 32 px tall inside the 40 px strip; the copy control is a 28 px CopyButton with its own touch target.
- Reflow: no page-level horizontal scroll at 320 px; the code region scrolls on its own (code is an allowed two-dimensional exception, WCAG 1.4.10).

## Performance

- Bundle budget: 26.75 KB gzip for the initial chunk of `./code-block` in `.size-limit.json` (the line diff is part of the entry; no dependency).
- Runtime budget: above 300 lines the panel mounts lines in chunks of 100 as they scroll near view (unmounted chunks keep an estimated 24 px per line), so a 5,000-line file mounts and switches tabs within the `code-block-5k-lines` budget of `perf-budgets.json`; a 5,000-line pair mounts as a split diff and switches to unified within `code-block-diff-5k-lines`. Both views mount their rows in chunks. Copy always copies the whole file.
- Heavy parts: the highlighter is a small in-house tokeniser; no editor or highlighting library.

## Examples

- Default — language switcher: two tabs, `fileName` on each tab, JavaScript sample, copy affordance (Figma: Language Switcher).
- WithoutLineNumbers — same Default sample with `line-numbers` off.
- WithoutCopy — same Default sample with `copyable={false}`; the copy control is not rendered and lines reserve only `--spacing-sm` on their right.
- WithFileName — single tab with `fileName` and no tab header (Figma: Show filename).
- WithDiff — single tab with `lineChanges` for added/removed rows (Figma: Diff).
- ComputedDiff — composite: one cache configuration before and after, passed as `original` and `code`, shown unified and split (`diffView`); justified because the computed diff and the split view are rendered surfaces no other example shows.
- WithHighlightedLine — single tab with `highlightedLine={6}` (Figma: Highlighted).
- WithAnimatedLines — single tab with `animateLines={true}` for staggered website entrance.
- Shell — single tab with `language: 'bash'`; justified because the command tokeniser is a distinct rendered surface from the expression one (program, flags, operator hand-off, expansion, trailing comment) that no JavaScript sample exercises.
- UnevenTabs — two tabs whose snippets have different line counts; the only geometry where the shell's height changes on a swap, so it is what exercises the height transition and the per-line entrance together.
- SingleLine — one `bash` line passed as `code` + `language` (the single-snippet API), `line-numbers` off, no tabs and no filename bar: the minimal shell, and the one geometry where the copy control centres on its row instead of hanging from the top inset.
- Borderless — Default sample with `bordered={false}`; the outer card border is dropped so the block sits flush inside a surface that already frames it.
- CommandAndOutput — a `$ `-prompted `curl -I` command with `show-label` ("Shell" header) and, under it, a second block with `kind="output"` holding `HTTP/2 200`; justified because the label header and the output kind are two rendered surfaces no other example shows, and they are the docs pattern for a command and what it prints.

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
