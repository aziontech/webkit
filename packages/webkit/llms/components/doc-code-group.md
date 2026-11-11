# Doc Code Group

> One or more code samples of the same thing in different languages or package managers, rendered on `CodeBlock` so the docs inherit its header, copy control and syntax surface. One sample renders a plain block; several render the joined tab strip.

- Import: `import DocCodeGroup from '@aziontech/webkit/doc-code-group'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-code-group.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-code-group.json)

## When to use

- The same install command for npm, pnpm and yarn.
- The same request in cURL, JavaScript and Python.

## Do

- Label each sample with what differs (the language or the tool), not with "Example".
- Keep the same order across a page.

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
| `samples` | `DocCodeSample[]` | `[]` | false | The samples, in tab order: `{ label?, language?, fileName?, code }`. One renders a plain block, several render a joined tab strip; none renders nothing. |
| `showLineNumbers` | `boolean` | `false` | false | Shows the line-number gutter. |

## States

- Visual states: from `CodeBlock` (tab selection, copied).
- `data-doc-block` and `data-doc-chrome` put it on the block rung and stop prose rules at its edge.

## Accessibility

- Tabs, copy button and announcements come from `CodeBlock`.
- A tab label falls back to the language, then to the sample position.

## Right-to-left

- Layout: code stays left-to-right inside `CodeBlock`; the strip follows the page direction.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

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
