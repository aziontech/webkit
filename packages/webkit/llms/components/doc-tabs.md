# Doc Tabs

> Alternative paths through the same instruction ("macOS / Linux / Windows", "Console / CLI"). It reads the `title` of each `DocTab` child to build the strip and renders each child body in its panel, on `Tabs`, so the strip, the indicator and the keyboard model are the design system's.

- Import: `import DocTabs from '@aziontech/webkit/doc-tabs'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-tabs.json)

## When to use

- The same procedure that differs per platform or per tool.

## Do

- Two to five tabs; put the most common path first.
- Keep the panels parallel so switching compares like with like.

## Don’t

- For code-only alternatives — use `DocCodeGroup`.
- For page navigation — use links or `DocCardGroup`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocTab` — the panel it reads.
- Tabs` — the surface it renders on.
- DocCodeGroup`.

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `DocTab` children, in strip order. A child without a `title` is labelled by its position. |

## States

- The first tab is selected on render; selection state comes from `Tabs`.
- `data-doc-block` on the root; the strip carries `data-doc-chrome`.

## Accessibility

- `tablist`, `tab` and `tabpanel` roles and the arrow-key model come from `Tabs`.
- Panels have no padding of their own; the first block in a panel carries the prose rhythm.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Responsive

- The strip scrolls inside its own row on narrow screens (from `Tabs`).

## Examples

### Default

```vue
<script setup>
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
</script>

<template>
  <DocTabs>
    <DocTab title="macOS">
      <p>Install the CLI with Homebrew, then run it once to sign in.</p>
    </DocTab>
    <DocTab title="Linux">
      <p>Download the binary for your architecture and put it on your path.</p>
    </DocTab>
    <DocTab title="Windows">
      <p>Run the installer, then open a new terminal so the path is picked up.</p>
    </DocTab>
  </DocTabs>
</template>
```
