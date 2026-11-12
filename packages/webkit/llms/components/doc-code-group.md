# Doc Code Group

> One or more code samples of the same thing in different languages or package managers, rendered on `CodeBlock` so the docs inherit its header, copy control and syntax surface. One sample renders a block titled by a label header (the sample label, else the language's readable name: Shell, JavaScript, JSON); several render the joined tab strip. A sample's `output` — what its command prints — renders as a separate muted "Output" block under it, with no copy control, so the command block holds only what the reader runs.

- Import: `import DocCodeGroup from '@aziontech/webkit/doc-code-group'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-code-group.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-code-group.json)

## When to use

- The same install command for npm, pnpm and yarn.
- The same request in cURL, JavaScript and Python.

## Do

- Label each sample with what differs (the language or the tool), not with "Example". With one sample, leave `label` empty: the header names the language.
- Keep the same order across a page.
- Do: set `language` on every sample, so the header reads "Shell" or "JavaScript" and the code is highlighted.
- Do: keep `code` to what the reader runs or pastes; the copy control copies exactly that. A leading `$ ` prompt is drawn but never copied.
- Do: put what the command prints in the sample's `output` (`{ language: 'bash', code: 'curl -I https://<your-azion-domain>', output: 'HTTP/2 200' }`), or say it in prose.
- Do: show a standalone printout (a deploy log) with `kind="output"`.
- Don't: write output into `code` — never `curl -I https://example.com\n# HTTP/2 200`, never `$ azion version\nAzion CLI 4.23.0`. The lint `webkit/no-output-in-command` warns on it.
- Don't: turn the label header off on a docs page.

## Don’t

- For unrelated snippets — use one `CodeBlock` each.
- For prose that differs per platform — use `DocTabs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- CodeBlock` — the surface it renders on.
- DocTabs` — alternatives that are prose, not code.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `samples` | `DocCodeSample[]` | `[]` | false | The samples, in tab order: `{ label?, language?, fileName?, code, output? }`. One renders a plain block, several render a joined tab strip; none renders nothing. |
| `showLineNumbers` | `boolean` | `false` | false | Shows the line-number gutter. |
| `showLabel` | `boolean` | `true` | false | Shows the label header (the sample label or the language name) on a single sample. |
| `kind` | `'code' \| 'output'` | `'code'` | false | What the samples hold: `code` the reader runs, or `output` — what a command prints — drawn muted under an "Output" label, without a copy control. |

## States

- Visual states: from `CodeBlock` (tab selection, copied, label header, output kind).
- Output: the active sample's `output` renders a second `CodeBlock` (`kind="output"`, test id `${testId}__output`) under the code block (`${testId}__code`), `--spacing-xs` apart; switching tabs swaps it.
- `data-doc-block` and `data-doc-chrome` put it on the block rung and stop prose rules at its edge.

## Accessibility

- Tabs, copy button and announcements come from `CodeBlock`.
- A tab label falls back to the language's readable name, then to the sample position.

## Right-to-left

- Layout: code stays left-to-right inside `CodeBlock`; the strip follows the page direction.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: the "Output" label, from `CodeBlock`'s catalog group (`codeBlock.output`, en / pt-BR / es). Every other visible string is content and arrives through props.

## Responsive

- Long lines scroll inside the block, never the page.

## Examples

### Default

```vue
<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'
</script>

<template>
  <DocCodeGroup :samples="[{ language: 'bash', code: 'azion link --preset vue' }]" />
</template>
```

### Group

```vue
<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'

  const samples = [
    { label: 'npm', language: 'bash', code: 'npm install @aziontech/webkit' },
    { label: 'pnpm', language: 'bash', code: 'pnpm add @aziontech/webkit' },
    { label: 'yarn', language: 'bash', code: 'yarn add @aziontech/webkit' }
  ]
</script>

<template>
  <DocCodeGroup :samples="samples" />
</template>
```

### WithOutput

```vue
<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'

  const samples = [
    {
      language: 'bash',
      code: 'curl -I https://<your-azion-domain>',
      output: 'HTTP/2 200'
    }
  ]
</script>

<template>
  <DocCodeGroup :samples="samples" />
</template>
```
