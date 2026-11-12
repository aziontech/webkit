# Code Block

> Read-only code viewer for docs, API examples, and configuration previews. Supports four Figma-documented layouts that share one monolithic shell: 1. **Language switcher** ([4567:33761](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-33761)) — tabbed snippets with a sliding pill, optional filename bar, syntax highlighting, and copy. 2. **Show filename** ([4567:30198](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-30198)) — single snippet with a raised filename bar (language icon + name), no tabs. 3. **Diff** ([4567:29012](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-29012)) — per-line added/removed markers (`+`/`-`), semantic row backgrounds, and a 2 px leading bar; no tabs or filename bar. 4. **Highlighted line** ([4567:31473](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4567-31473)) — one active line with info background and leading bar; no tabs or filename bar. Two more regions serve docs: a **label header** — a 40 px bar naming the block (`</>` + "Shell", "JavaScript", from the active tab's label or the language's readable name, or `title`) when `showLabel` is on and there is no tab strip or filename bar — and the **output** kind (`kind="output"`): what a command prints, drawn flat in `--text-muted` on `--bg-canvas` under an "Output" label, with no copy control by default. A command block and its output are always two blocks. The other regions render conditionally from tab data. Tab header appears when `tabs.length > 1`. Filename bar appears when the active tab sets `fileName`. Diff and highlight decorations come from `lineChanges` and `highlightedLine` on the active tab. **Syntax highlighting** is driven by the active tab's `language` and resolves to one of these tokenisers, all of which emit the same seven token types (`keyword`, `string`, `function`, `type`, `punctuation`, `identifier`, `comment`) so every language shares the one `--code-sintax-*` palette:

- Import: `import CodeBlock from '@aziontech/webkit/code-block'`
- Category: code · Surface: product · Structure: monolithic
- API as JSON: [code-block.json](https://github.com/aziontech/webkit/blob/main/.specs/code-block.json)

## When to use

- Read-only code in docs, API examples or configuration previews that readers copy from.
- The same snippet in several languages, switched by tabs (one `tabs` entry per language).
- Showing a change as a diff (`lineChanges`) or pointing at one line (`highlightedLine`) on the active tab.

## Do

- Put the source on each tab's `code`. There is no top-level `code` prop, and a tab without a `value` or a `code` is dropped.
- Set `language` on every tab. Only JavaScript/TypeScript, shell, HCL, GraphQL and Markdown are tokenised; anything else renders as flat text.
- Use `default-value` for the initial tab, and `v-model` only when something outside the block must follow the selected tab.
- Set `:copyable="false"` on decorative blocks, and `:bordered="false"` when the block sits inside a surface that already frames it.
- Keep `animate-lines` for marketing layouts; leave it off in docs and console screens.
- Do: keep a command block to what the reader runs — the copy control copies exactly that. Put what it prints in a second block with `kind="output"` (or in prose).
- Don't: write expected output into the command, as a `# HTTP/2 200` comment or as unprompted lines after a `$ ` prompt — the reader pastes it into the terminal. The `webkit/no-output-in-command` lint warns on it.
- Do: turn `show-label` on in docs (`DocCodeGroup` does by default) so every block is titled with its language; set `title` only when the language name is not the right title.

## Don’t

- The content is build or deploy output with timestamps and log levels → use `log-view`.
- It is a marketing band that pairs a claim with its code → use `code-split`, or `sticky-scroll-code` for several claims.
- It is a terminal session of CLI commands on a product page → use `cli-terminal`.
- You only need to copy one short value (a token, an ID) without showing a block → use `copy-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [copy-button](copy-button.md) — the copy control CodeBlock embeds; use it alone for one-line values.
- [log-view](log-view.md) — terminal-style viewer for CI and deploy logs.
- [code-split](code-split.md) — page section built around one code sample.
- [scroll-area](scroll-area.md) — the scroll container the code region runs in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tabs` | `CodeBlockTab[]` | `[]` | false | Tab definitions with label, value, code, and optional language, filename, diff, or highlight metadata. |
| `defaultValue` | `string` | `undefined` | false | Initial active tab when uncontrolled. |
| `showLineNumbers` | `boolean` | `true` | false | Shows a fixed-width gutter with zero-padded line numbers before each code line. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name for the copy control (forwarded to CopyButton's aria-label). Empty uses the locale catalog (`Copy code`). |
| `copyable` | `boolean` | `undefined` | false | Shows the copy control. Unset, a `code` block shows it and an `output` block does not; turn it off for a decorative block nobody copies from. |
| `kind` | `'code' \| 'output'` | `'code'` | false | What the block holds: `code` the reader runs or reads, or `output` — what a command prints — drawn flat and muted under an "Output" label, without a copy control. |
| `showLabel` | `boolean` | `false` | false | Shows a header naming the block when there is no tab strip or file name: the active tab's label, else the language's readable name (Shell, JavaScript). Docs blocks show it. |
| `title` | `string` | `''` | false | Text of the label header; empty uses the tab label or the language name, or "Output" for an `output` block. |
| `animateLines` | `boolean` | `false` | false | Staggered line entrance for website layouts: each line slides from `-8px` with opacity `0 → 1`, `40ms` apart. |
| `bordered` | `boolean` | `true` | false | Draw the outer card border around the block. On by default; set `:bordered="false"` to render the block flush when it sits inside a surface that already frames it. Internal dividers (tab header, filename bar) are unaffected. |
| `modelValue` | `string \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `string` | Fires after the active tab code is copied to the clipboard. |

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
- `data-state` on tabs: `active` | `inactive`
- `data-state` on code lines: `default` | `added` | `removed` | `highlighted`
- `data-disabled` not used (tabs are not disabled in v2)
- `data-kind` on the root: `code` | `output`; `output` paints the shell `--bg-canvas` and every line flat in `--text-muted`

#### Layout rules (derived from Figma)

| Region                                                                     | Visible when                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Tab header (`CodeBlockHeader`, 40 px strip: a 32 px tab over a 4 px inset) | `tabs.length > 1`                                                        |
| Filename bar (`FileName`, 40 px)                                           | active tab has `fileName`                                                |
| Label header (40 px, `pi pi-code` / `pi pi-align-left` + label)            | no tab strip, no `fileName`, and `showLabel`, `title` or `kind="output"` |
| Diff gutter (`+`/`-` + 8 px spacer on unchanged lines)                     | active tab `lineChanges.length > 0`                                      |
| Line highlight (info background + 2 px leading bar)                        | active tab `highlightedLine` is set                                      |

When only one tab is provided and it has no `fileName`, the shell is code content + copy only (minimal block).

Code content scrolls inside `@aziontech/webkit/scroll-area` (`orientation="both"`, capped at a `320 px` max height so shorter snippets fit their content and taller ones scroll). Lines never wrap (`whitespace-pre`); on narrow viewports the scroll region grows horizontally so long lines stay on one row.

**The shell is fluid: it takes the width its container gives it and never grows past it.** Long lines are a scroll, never a wider block — so the root is a size container (`@container`, i.e. inline-size containment) and its code width is invisible to the layout above it. Without that, the block's intrinsic width leaks upward: an `auto`-sized grid track or flex row (a one-column `grid` on mobile, a `md:grid-cols-2` panel below its breakpoint) sizes itself to the widest code line and the block overflows the viewport instead of scrolling — a consumer's `min-w-0` on the wrapper cannot fix it, because `min-width` is a floor on the intrinsic contribution, not a cap. The copy control (a `CopyButton`, `kind="outlined"` `size="small"`) is absolutely positioned on the non-scrolling content shell (`__content`) so it stays pinned top-right while lines scroll. **On a single-line block it centres on that row instead** (`data-single-line` on the anchor): the shell is 44 px, the control 28 px, so the `--spacing-sm` top inset would leave it 4 px below the line's own centre. Every line reserves the control's full footprint on its right (`pr-11` = 28 px control + its 12 px inset), so a long line always scrolls clear of it rather than under it. With `copyable` off (`data-copyable` absent on the root) the control is not rendered and lines reserve only `--spacing-sm` on their right.

- Long files: above 300 lines the panel mounts lines in chunks of 100 as they scroll near view (unmounted chunks keep an estimated 24 px per line), so a 5,000-line file mounts and switches tabs within its runtime budget. Copy always copies the whole file.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses tabs and copy; `ArrowLeft`/`ArrowRight`/`Home`/`End` move between tabs; `Enter`/`Space` activates tab; copy uses `Enter`/`Space` on the CopyButton (native `<button>`); when focus is in the code scroll region, `ArrowUp`/`ArrowDown`/`PageUp`/`PageDown`/`Home`/`End` scroll vertically and `ArrowLeft`/`ArrowRight` scroll horizontally via ScrollArea.
- ARIA: tab list uses `role="tablist"` when visible; tabs use `role="tab"` with `aria-selected`; panel uses `role="tabpanel"` with `aria-labelledby`; copy uses CopyButton `ariaLabel` (forwarded to its inner IconButton); diff `+`/`-` markers are `aria-hidden="true"` (change semantics conveyed by row `data-state` and visible background).
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
      code: "export default {\n  async fetch(request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
    },
    {
      label: 'Typescript',
      value: 'ts',
      language: 'typescript',
      fileName: 'file name.ts',
      code: "export default {\n  async fetch(request: Request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
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
      code: "export default {\n  async fetch(request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
    },
    {
      label: 'Typescript',
      value: 'ts',
      language: 'typescript',
      fileName: 'file name.ts',
      code: "export default {\n  async fetch(request: Request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
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
      code: "export default {\n  async fetch(request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
    },
    {
      label: 'Typescript',
      value: 'ts',
      language: 'typescript',
      fileName: 'file name.ts',
      code: "export default {\n  async fetch(request: Request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
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
