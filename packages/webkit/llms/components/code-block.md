# Code Block

> Use CodeBlock to show code, config or JSON the person reads or copies, including read-only diffs (a tab's `original`); for code the person edits use CodeEditor, and for build, deploy or runtime log lines use LogViewer. Read-only code viewer for docs, API examples, and configuration previews. Supports four Figma-documented layouts that share one monolithic shell: 1. **Language switcher** ([4567:33761](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761)) — tabbed snippets with a sliding pill, optional filename bar, syntax highlighting, and copy. 2. **Show filename** ([4567:30198](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-30198)) — single snippet with a raised filename bar (language icon + name), no tabs. 3. **Diff** ([4567:29012](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-29012)) — per-line added/removed markers (`+`/`-`), semantic row backgrounds, and a 2 px leading bar; no tabs or filename bar. 4. **Highlighted line** ([4567:31473](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-31473)) — one active line with info background and leading bar; no tabs or filename bar. Two more regions serve docs: a **label header** — a 40 px bar naming the block (`</>` + "Shell", "JavaScript", from the active tab's label or the language's readable name, or `title`) when `showLabel` is on and there is no tab strip or filename bar — and the **output** type (`type="output"`): what a command prints, drawn flat in `--text-muted` on `--bg-canvas` under an "Output" label, with no copy control by default. A command block and its output are always two blocks. The other regions render conditionally from tab data. Tab header appears when `tabs.length > 1`. Filename bar appears when the active tab sets `fileName`. Diff and highlight decorations come from `lineChanges` and `highlightedLine` on the active tab. **Syntax highlighting** is driven by the active tab's `language` and resolves to one of these tokenisers, all of which emit the same seven token types (`keyword`, `string`, `function`, `type`, `punctuation`, `identifier`, `comment`) so every language shares the one `--code-syntax-*` palette:

- Import: `import CodeBlock from '@aziontech/webkit/code-block'`
- Category: code · Surface: app · Structure: monolithic
- API as JSON: [code-block.json](code-block.json)

## When to use

- Read-only code in docs, API examples or configuration previews that readers copy from.
- The same snippet in several languages, switched by tabs (one `tabs` entry per language).
- Showing a change as a diff (`lineChanges`) or pointing at one line (`highlightedLine`) on the active tab.
- Showing what changed between two versions of a file — a configuration before and after a deploy, the code a release replaces — by passing the previous version as the tab's `original`: the block computes the line diff itself and draws it unified or side by side (`diffView`).

## Do

- Put the source on each tab's `code`. There is no top-level `code` prop, and a tab without a `value` or a `code` is dropped.
- Set `language` on every tab. Only JavaScript/TypeScript, shell, HCL, GraphQL and Markdown are tokenised; anything else renders as flat text.
- Use `default-value` for the initial tab, and `v-model` only when something outside the block must follow the selected tab.
- Prefer `original` to a hand-written `lineChanges` list whenever both versions are at hand: the diff stays right when either version changes. Keep `unified` in narrow columns and use `split` where the block has room for two columns of code.
- Set `:copyable="false"` on decorative blocks, and `:bordered="false"` when the block sits inside a surface that already frames it.
- Keep `animate-lines` for marketing layouts; leave it off in docs and console screens.
- Do: keep a command block to what the reader runs — the copy control copies exactly that. Put what it prints in a second block with `type="output"` (or in prose).
- Don't: write expected output into the command, as a `# HTTP/2 200` comment or as unprompted lines after a `$ ` prompt — the reader pastes it into the terminal. The `webkit/no-output-in-command` lint warns on it.
- Do: turn `show-label` on in docs (`DocCodeGroup` does by default) so every block is titled with its language; set `title` only when the language name is not the right title.

## Don’t

- The content is build or deploy output with timestamps and log levels → use `log-viewer`.
- It is a marketing band that pairs a claim with its code → use `feature-scroll-section` with code items.
- It is a terminal session of CLI commands on a product page → use `cli-terminal-section`.
- You only need to copy one short value (a token, an ID) without showing a block → use `copy-button`.
- The reader edits the new version beside the old one → use `code-editor` in diff mode. A read-only diff is always this block with `original`, never a read-only code editor.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [copy-button](copy-button.md) — the copy control CodeBlock embeds; use it alone for one-line values.
- [code-editor](code-editor.md) — the editable surface; its diff mode is for editing beside an original, while a read-only diff is this block.
- [log-viewer](log-viewer.md) — terminal-style viewer for CI and deploy logs.
- [feature-scroll-section](feature-scroll-section.md) — page section whose steps can each pin a code sample (`code`).
- [scroll-area](scroll-area.md) — the scroll container the code region runs in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tabs` | `CodeBlockTab[]` | `[]` | false | Tab definitions with label, value, code, and optional language, filename, diff, or highlight metadata. |
| `defaultValue` | `string` | `undefined` | false | Initial active tab when uncontrolled. |
| `code` | `string` | `''` | false | Code of a single snippet, used when `tabs` is empty. |
| `language` | `string` | `''` | false | Language of the single `code` snippet (highlighting and the label header). |
| `showLineNumbers` | `boolean` | `true` | false | Shows a fixed-width gutter with zero-padded line numbers before each code line (the same name as `code-editor`). |
| `copyAriaLabel` | `string` | `''` | false | Accessible name for the copy control (forwarded to CopyButton's aria-label). Empty uses the locale catalog (`Copy code`). |
| `copyable` | `boolean` | `undefined` | false | Shows the copy control. Unset, a `code` block shows it and an `output` block does not; turn it off for a decorative block nobody copies from. |
| `type` | `'code' \| 'output'` | `'code'` | false | What the block holds: `code` the reader runs or reads, or `output` — what a command prints — drawn flat and muted under an "Output" label, without a copy control. |
| `showLabel` | `boolean` | `false` | false | Shows a header naming the block when there is no tab strip or file name: the active tab's label, else the language's readable name (Shell, JavaScript). Docs blocks show it. |
| `title` | `string` | `''` | false | Text of the label header; empty uses the tab label or the language name, or "Output" for an `output` block. |
| `animateLines` | `boolean` | `false` | false | Staggered line entrance for website layouts: each line slides from `-8px` with opacity `0 → 1`, `40ms` apart. |
| `bordered` | `boolean` | `true` | false | Draw the outer card border around the block. On by default; set `:bordered="false"` to render the block flush when it sits inside a surface that already frames it. Internal dividers (tab header, filename bar) are unaffected. |
| `diffView` | `'unified' \| 'split'` | `'unified'` | false | How a tab with an `original` draws the diff the block computes: `unified` (one column) or `split` (side by side). |
| `modelValue` | `string \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `(event: MouseEvent, code: string)` | Fires after the active tab code is copied to the clipboard. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `tab-icon` | { tab: CodeBlockTab } | Leading mark before a tab's label in the tab strip; nothing renders when it is not filled. |

## v-model

| Model     | Type                  | Default     | Emits               | Notes                                                                                                                                         |
| --------- | --------------------- | ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string \| undefined` | `undefined` | `update:modelValue` | Active tab `value` via `defineModel`. While unbound (`undefined`) the block is uncontrolled: it starts at `defaultValue`, else the first tab. |

## States

- Visual states: `default`, `hover`, `focus-visible` on tabs and copy control
- `data-state` on tabs: `active` | `inactive`; the active tab's text colour switches on `data-[state=active]:` in the tab's flat class, never a `:class` ternary
- `data-state` on code lines: `default` | `added` | `removed` | `highlighted`; in the split view a side with no line opposite a change is `empty` (`var(--bg-canvas)`)
- `data-split` on the panel when the active tab with an `original` draws side by side. A `split` diff draws unified while the content is narrower than 640px (an unmeasured block, as in the server render, draws split)
- `data-disabled` not used (tabs are not disabled in v2)
- `data-type` on the root: `code` | `output`; `output` paints the shell `--bg-canvas` and every line flat in `--text-muted`

#### Layout rules (derived from Figma)

| Region                                                                                                                   | Visible when                                                             |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Tab header (`CodeBlockHeader`, 40 px strip: a 32 px tab over a 4 px inset)                                               | `tabs.length > 1`                                                        |
| Filename bar (`FileName`, 40 px)                                                                                         | active tab has `fileName`                                                |
| Label header (40 px, `az az-code` / `az az-align-left` + label)                                                          | no tab strip, no `fileName`, and `showLabel`, `title` or `type="output"` |
| Diff gutter (`+`/`-` + 8 px spacer on unchanged lines)                                                                   | active tab `lineChanges.length > 0`, or the active tab has an `original` |
| Unified diff (removed lines from `original` before the added lines of `code` in each change, numbered on their own side) | active tab has an `original` and `diffView="unified"`                    |
| Split diff (two columns, Original and Modified, rows aligned, a change paired line for line)                             | active tab has an `original` and `diffView="split"`                      |
| Line highlight (info background + 2 px leading bar)                                                                      | active tab `highlightedLine` is set                                      |

When only one tab is provided and it has no `fileName`, the shell is code content + copy only (minimal block).

Code content scrolls inside `@aziontech/webkit/scroll-area` (`orientation="both"`, capped at a `320 px` max height so shorter snippets fit their content and taller ones scroll). Lines never wrap (`whitespace-pre`); on narrow viewports the scroll region grows horizontally so long lines stay on one row.

**The shell is fluid: it takes the width its container gives it and never grows past it.** Long lines are a scroll, never a wider block — so the root is a size container (`@container`, i.e. inline-size containment) and its code width is invisible to the layout above it. Without that, the block's intrinsic width leaks upward: an `auto`-sized grid track or flex row (a one-column `grid` on mobile, a `md:grid-cols-2` panel below its breakpoint) sizes itself to the widest code line and the block overflows the viewport instead of scrolling — a consumer's `min-w-0` on the wrapper cannot fix it, because `min-width` is a floor on the intrinsic contribution, not a cap. The copy control (a `CopyButton`, `variant="outline"` `size="small"`) is absolutely positioned on the non-scrolling content shell (`__content`) so it stays pinned top-right while lines scroll. **On a single-line block it centres on that row instead** (`data-single-line` on the anchor): the shell is 44 px, the control 28 px, so the `--spacing-sm` top inset would leave it 4 px below the line's own centre. Every line reserves the control's full footprint on its right (`pr-11` = 28 px control + its 12 px inset), so a long line always scrolls clear of it rather than under it. With `copyable` off (`data-copyable` absent on the root) the control is not rendered and lines reserve only `--spacing-sm` on their right.

- Computed diff: the common head and tail are trimmed, then the middle runs the Myers line diff; past 1,000 edits it falls back to the whole middle removed then added, so a rewrite stays linear. A 5,000-line pair with a few hundred edits diffs in a few milliseconds.

- Consumer attributes land on the root (`v-bind="$attrs"`), so a page-JSON scene can mark it `data-plain-ground` (RV-T2-1).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses tabs and copy; `ArrowLeft`/`ArrowRight`/`Home`/`End` move between tabs; `Enter`/`Space` activates tab; copy uses `Enter`/`Space` on the CopyButton (native `<button>`); when focus is in the code scroll region, `ArrowUp`/`ArrowDown`/`PageUp`/`PageDown`/`Home`/`End` scroll vertically and `ArrowLeft`/`ArrowRight` scroll horizontally via ScrollArea.
- ARIA: tab list uses `role="tablist"` when visible; tabs use `role="tab"` with `aria-selected`; panel uses `role="tabpanel"` with `aria-labelledby`. Tab and panel ids come from `useId()` (`<uid>-tab-<index>`, one `<uid>-panel`), so two tabbed blocks on one page never share an id and a tab value with spaces is still a valid id; only the selected tab carries `aria-controls`, pointing at the one rendered panel; copy uses CopyButton `ariaLabel` (forwarded to its inner IconButton); diff `+`/`-` markers are `aria-hidden="true"` and every added or removed line also carries a visually hidden `Added` / `Removed` so the change is read, not only seen. In the split view each column is a named `group` (`Original`, `Modified`) and a focusable scroll region (`tabindex="0"`, the same focus ring) so its long lines scroll from the keyboard.
- Contrast ≥4.5:1 for code text on surface, including syntax token colors and diff/highlight row backgrounds in light and dark. Row backgrounds for `added`, `removed` and `highlighted` are the feedback fills at 40% (`bg-(--success)/40`, `bg-(--danger)/40`, `bg-(--info)/40`): at full strength the light fills (`--danger` `#F3A5A5`, `--info` `#99C9FF`) put the line numbers and the `function` and `type` syntax colours under 4.5:1 (3.93:1 for a line number on a removed row); at 40% every syntax colour clears 4.5:1 in light and dark (the lowest, the light `function` orange `#B03C02` on a removed row, is 4.6:1).
- `motion-reduce:transition-none motion-reduce:transform-none` on indicator and panel motion.
- When `animateLines` is enabled, line motion is disabled under `prefers-reduced-motion` (lines render fully visible immediately).
- Copy control uses CopyButton `size="small"` (28×28 px).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move between the file tabs, swapped under `dir="rtl"` (`logicalArrowKey`); the tab indicator is anchored with a physical `left: 0` and moved by `offsetLeft`.
- Motion: the panel slide between tabs mirrors (`rtl:` flips the `translate-x` presets).
- User data: code lines render `dir="ltr"`: code always reads left to right. The scroll area keeps the copy button's width free on its side (`pe-10` when `copyable`), so under `dir="rtl"` the button never covers the start of a line.

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

## Responsive

- Container queries: the root is a size container (`@container`), so long lines scroll inside the block instead of widening the layout above it.
- Narrow (≤ 640 px or a narrow container): the shell takes the container width; lines never wrap and scroll horizontally inside `scroll-area`; the tab strip keeps one row. The split view halves the width, so it suits wide containers; `unified` is the narrow form.
- Touch: tabs are 32 px tall inside the 40 px strip; the copy control is a 28 px CopyButton with its own touch target.
- Reflow: no page-level horizontal scroll at 320 px; the code region scrolls on its own (code is an allowed two-dimensional exception, WCAG 1.4.10).

## Examples

### Default

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Javascript',
      value: 'js',
      language: 'javascript',
      fileName: 'file name.js',
      code:
        'export default {\n' +
        '  async fetch(request) {\n' +
        '    const { prompt } = await request.json()\n\n' +
        '    const modelResponse = await Azion.AI.run(\n' +
        "      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n" +
        '      {\n' +
        '        messages: [\n' +
        "          { role: 'system', content: 'You are a helpful assistant.' },\n" +
        "          { role: 'user', content: prompt }\n" +
        '        ]\n' +
        '      }\n' +
        '    )\n\n' +
        '    return new Response(JSON.stringify(modelResponse))\n' +
        '  }\n' +
        '}'
    },
    {
      label: 'Typescript',
      value: 'ts',
      language: 'typescript',
      fileName: 'file name.ts',
      code:
        'export default {\n' +
        '  async fetch(request: Request) {\n' +
        '    const { prompt } = await request.json()\n\n' +
        '    const modelResponse = await Azion.AI.run(\n' +
        "      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n" +
        '      {\n' +
        '        messages: [\n' +
        "          { role: 'system', content: 'You are a helpful assistant.' },\n" +
        "          { role: 'user', content: prompt }\n" +
        '        ]\n' +
        '      }\n' +
        '    )\n\n' +
        '    return new Response(JSON.stringify(modelResponse))\n' +
        '  }\n' +
        '}'
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="js"
      show-line-numbers
    />
  </div>
</template>
```

### WithoutLineNumbers

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Javascript',
      value: 'js',
      language: 'javascript',
      fileName: 'file name.js',
      code:
        'export default {\n' +
        '  async fetch(request) {\n' +
        '    const { prompt } = await request.json()\n\n' +
        '    const modelResponse = await Azion.AI.run(\n' +
        "      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n" +
        '      {\n' +
        '        messages: [\n' +
        "          { role: 'system', content: 'You are a helpful assistant.' },\n" +
        "          { role: 'user', content: prompt }\n" +
        '        ]\n' +
        '      }\n' +
        '    )\n\n' +
        '    return new Response(JSON.stringify(modelResponse))\n' +
        '  }\n' +
        '}'
    },
    {
      label: 'Typescript',
      value: 'ts',
      language: 'typescript',
      fileName: 'file name.ts',
      code:
        'export default {\n' +
        '  async fetch(request: Request) {\n' +
        '    const { prompt } = await request.json()\n\n' +
        '    const modelResponse = await Azion.AI.run(\n' +
        "      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n" +
        '      {\n' +
        '        messages: [\n' +
        "          { role: 'system', content: 'You are a helpful assistant.' },\n" +
        "          { role: 'user', content: prompt }\n" +
        '        ]\n' +
        '      }\n' +
        '    )\n\n' +
        '    return new Response(JSON.stringify(modelResponse))\n' +
        '  }\n' +
        '}'
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="js"
      :show-line-numbers="false"
    />
  </div>
</template>
```

### WithoutCopy

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Javascript',
      value: 'js',
      language: 'javascript',
      fileName: 'file name.js',
      code:
        'export default {\n' +
        '  async fetch(request) {\n' +
        '    const { prompt } = await request.json()\n\n' +
        '    const modelResponse = await Azion.AI.run(\n' +
        "      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n" +
        '      {\n' +
        '        messages: [\n' +
        "          { role: 'system', content: 'You are a helpful assistant.' },\n" +
        "          { role: 'user', content: prompt }\n" +
        '        ]\n' +
        '      }\n' +
        '    )\n\n' +
        '    return new Response(JSON.stringify(modelResponse))\n' +
        '  }\n' +
        '}'
    },
    {
      label: 'Typescript',
      value: 'ts',
      language: 'typescript',
      fileName: 'file name.ts',
      code:
        'export default {\n' +
        '  async fetch(request: Request) {\n' +
        '    const { prompt } = await request.json()\n\n' +
        '    const modelResponse = await Azion.AI.run(\n' +
        "      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n" +
        '      {\n' +
        '        messages: [\n' +
        "          { role: 'system', content: 'You are a helpful assistant.' },\n" +
        "          { role: 'user', content: prompt }\n" +
        '        ]\n' +
        '      }\n' +
        '    )\n\n' +
        '    return new Response(JSON.stringify(modelResponse))\n' +
        '  }\n' +
        '}'
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="js"
      show-line-numbers
      :copyable="false"
    />
  </div>
</template>
```
